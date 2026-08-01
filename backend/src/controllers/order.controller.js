import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import OrderCondition from "../models/orderCondition.model.js";
import PaymentOptions from "../models/paymentOptions.model.js";
import { verifyMongoId } from "../utils/mongo.utils.js";
import {
  createRazorpayOrder,
  verifyRazorpayWebhookSign,
} from "../services/razorpay.service.js";
import { env } from "../config/env.js";
import Transaction from "../models/transaction.model.js";
import Charge from "../models/charge.model.js";
import mongoose from "mongoose";

const findApplicableCharges = async (user, cartTotal) => {
  //getting charges
  const charges = await Charge.find({}).lean();

  //no charges exist
  if (!Object.keys(charges).length) {
    return [];
  }

  const calculateChargePercent = (cartTotal, percent) => {
    return (cartTotal * percent) / 100;
  };
  //getting fixed charges
  const fixedCharges = charges
    .filter((ch) => ch.fixed)
    .map((ch) => ({
      [ch.chargeName]:
        ch.chargeAmount || calculateChargePercent(cartTotal, ch.chargePercent),
    }));

  //evaluating optional charges
  const userCity = user?.address?.postalCode || "";
  const optionalCharges = charges
    .filter((ch) => {
      if (ch.fixed) return false;

      const cityExempt = ch.noChargeConditions?.postalCodes?.length
        ? (ch.noChargeConditions?.postalCodes?.includes(userCity) ?? false)
        : true;

      const minAmount = ch.noChargeConditions?.minAmount ?? 0;
      const amountExempt = minAmount > 0 ? cartTotal >= minAmount : true;

      return !(cityExempt && amountExempt);
    })
    .map((ch) => ({
      [ch.chargeName]:
        ch.chargeAmount || calculateChargePercent(cartTotal, ch.chargePercent),
    }));

  return [...fixedCharges, ...optionalCharges];
};
const calculateTotalPayable = (cartTotal, charges) => {
  //calculating charges total
  let totalCharges = 0;
  charges?.forEach((ch) => {
    totalCharges += Number(
      Object.values(ch).reduce((sum, current) => sum + current, 0),
    );
  });

  //return total payable
  return cartTotal + totalCharges;
};
const calculateCartTotal = (cart) => {
  const total =
    cart?.items?.reduce((sum, item) => {
      if (item?.product?.pricingTiers?.length < 1) {
        return sum + (item.product?.price || 0) * item.quantity;
      }

      let applicableItemPrice = item.product?.price || 0;
      item?.product?.pricingTiers?.forEach((pt) => {
        if (item.quantity >= pt.minQuantity) applicableItemPrice = pt.price;
      });
      return sum + applicableItemPrice * item.quantity;
    }, 0) || 0;
  return total;
};

const updateInventory = async (cartItems, session) => {
  const bulkOperations = cartItems.map((item) => {
    return {
      updateOne: {
        filter: {
          _id: item.product._id,
          stockAvailable: { $gte: item.quantity }, // Check stock for this item
        },
        update: {
          $inc: { stockAvailable: -item.quantity }, // Deduct requested quantity
        },
      },
    };
  });

  const result = await mongoose.model("Product").bulkWrite(bulkOperations, {
    session, // Ensures rollback if anything fails
    ordered: true, // Executes one after the other to prevent deadlocks
  });
  if (result.modifiedCount !== cartItems.length) {
    // If a product is out of stock, MongoDB won't update it.
    // The counts won't match, throwing this error and rolling back the transaction.
    throw new Error("One or more items in your cart are out of stock!");
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { deliveryDetails, paymentMode } = req.body;

    //validate payment mode
    if (!paymentMode || !["cod", "online"].includes(paymentMode.trim())) {
      return res.status(400).json({ error: "invalid payment option" });
    }

    //validate delivery details
    if (!deliveryDetails || !deliveryDetails.deliveryAddress) {
      return res.status(400).json({ error: "delivery details required" });
    }
    if (
      !deliveryDetails.deliveryAddress.fullName ||
      !deliveryDetails.deliveryAddress.phone ||
      !deliveryDetails.deliveryAddress.streetAddress ||
      !deliveryDetails.deliveryAddress.city ||
      !deliveryDetails.deliveryAddress.state ||
      !deliveryDetails.deliveryAddress.postalCode
    ) {
      return res
        .status(400)
        .json({ error: "all delivery details are required" });
    }

    //verify cod payment is available or not
    if (paymentMode.trim() == "cod") {
      const pOp = await PaymentOptions.findOne();
      // 1. If COD is completely disabled, reject it immediately.
      if (!pOp.cod?.enabled) {
        return res.status(400).json({ error: "cod not available" });
      }

      // 2. If it's enabled, check the city restrictions.
      const cityList = pOp.cod.allowedPostalCodes || [];
      const userCity = (
        deliveryDetails?.deliveryAddress?.postalCode || ""
      ).trim();

      // If cityList has items AND the user's city isn't in it, reject it.
      if (cityList.length > 0 && !cityList.includes(userCity)) {
        return res
          .status(400)
          .json({ error: "cod not available at this location" });
      }
    }

    // Get cart and validate
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || !cart.items?.length) {
      return res.status(400).json({
        error: "Cart is empty",
      });
    }

    //calculating cart total
    calculateCartTotal(cart);
    const cartTotal = calculateCartTotal(cart);

    //getting applicable charges and totalBill
    const charges = await findApplicableCharges(req.user, cartTotal);
    const totalBill = calculateTotalPayable(cartTotal, charges);

    const chargesFormatted = charges.map((ch) => {
      const key = Object.keys(ch)[0];
      const value = ch[key];
      return {
        chargeName: key,
        chargeAmount: value,
      };
    });
    //verifying min order amount
    const minOrderValue = await OrderCondition.findOne().lean();
    if (minOrderValue && totalBill < minOrderValue.minAmount) {
      return res.status(400).json({
        error: `minimum order value must more than or equals ${minOrderValue.minAmount}`,
      });
    }

    //payment mode is cod clear cart and return
    if (paymentMode == "cod") {
      const moSe = await mongoose.startSession(); //starting mongo session
      try {
        moSe.startTransaction();

        //update inventory
        await updateInventory(cart.items, moSe);

        // Create order
        const [order] = await Order.create(
          [
            {
              user: userId,
              status: "order_placed",
              statusHistory: [
                {
                  status: "order_placed",
                },
              ],
              items: cart.items,
              billing: {
                paymentMode,
                charges: chargesFormatted,
                totalBill: totalBill,
              },
              deliveryDetails: deliveryDetails,
            },
          ],
          { session: moSe },
        );

        // clear cart after successful order
        cart.items = [];
        await cart.save({ session: moSe });

        await moSe.commitTransaction(); //ending mongo session

        return res.status(201).json({
          success: true,
          order: {
            id: order._id,
            status: order.status,
            totalBill,
          },
        });
      } catch (e) {
        //Rollback all changes if any query fails
        await moSe.abortTransaction();
        console.log(e);
        return res
          .status(400)
          .json({ success: false, error: "unable to place order" });
      } finally {
        await moSe.endSession();
      }
    }

    //online payment initialize
    const paymentOrder = await createRazorpayOrder(totalBill);
    if (!paymentOrder) {
      return res.status(502).json({
        error: "Unable to initialize payment.",
      });
    }

    const dbSession = await mongoose.startSession();
    try {
      dbSession.startTransaction();

      //update inventory
      await updateInventory(cart.items, dbSession);

      // Create order for online
      const [order] = await Order.create(
        [
          {
            user: userId,
            status: "payment_pending",
            statusHistory: [
              {
                status: "payment_pending",
              },
            ],
            items: cart.items,
            billing: {
              paymentMode,
              charges: chargesFormatted,
              totalBill: totalBill,
            },
            deliveryDetails: deliveryDetails,
          },
        ],
        { session: dbSession },
      );

      //creating payment object
      const [transaction] = await Transaction.create(
        [
          {
            user: userId,
            order: order._id,
            razorpayOrderId: paymentOrder.id,
            amount: totalBill,
            status: "initialized",
          },
        ],
        { session: dbSession },
      );
      await dbSession.commitTransaction(); //ending session

      return res.status(201).json({
        success: true,
        order: {
          id: order._id,
          status: order.status,
          totalBill,
        },
        razorpayOrderId: paymentOrder.id,
        razorpayKey: env.razorpayKey,
      });
    } catch (e) {
      //Rollback all changes if any query fails
      await dbSession.abortTransaction();
      console.log(e);
      return res.status(400).json({
        success: false,
        error: "unable to place order",
      });
    } finally {
      //end the session
      await dbSession.endSession();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal server error",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const status = String(req.body.status);
    const cancellationReason = String(req.body.cancellationReason || "");
    const { deliveryPartner, trackingId } = req.body;

    //validate order and status
    if (!orderId || !verifyMongoId(orderId)) {
      return res.status(400).json({ error: "invalid order" });
    }
    if (
      !status ||
      !['payment_failed',
      'payment_pending',
      'abandoned',
      'order_placed',
      'processing',
      'hold',
      'shipped',
      'delivered',
      'cancelled',
      'return_requested',
      'return_approved',
      'returned'].includes(
        status.trim(),
      )
    ) {
      return res.status(400).json({ error: "invalid status option" });
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // Update status
    order.status = status;

    // Handle cancellation
    if (status === "cancelled") {
      order.cancellationReason = cancellationReason;
    }

    // Handle out for delivery
    if (status === "shipped") {
      order.deliveryDetails.deliveryPartner = deliveryPartner || "";
      order.deliveryDetails.trackingId = trackingId || "";
    }
    // Add history
    order.statusHistory.push({
      status,
    });

    await order.save();
    return res.status(200).json({
      success: true,
      order: order._id,
    });
  } catch (error) {
    console.error("error updating order status", error);
    return res.status(500).json({
      error: "internal server error",
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // Pagination
    const pageNumber = Math.max(parseInt(req.query.pn) || 1, 1);
    const pageSize = Math.max(parseInt(req.query.ps) || 10, 1);

    const skip = (pageNumber - 1) * pageSize;

    // Fetch orders and total count in parallel
    const [orders, totalOrders] = await Promise.all([
      Order.find({ user: userId })
        .select("status items billing.totalBill createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate({
          path: "items.product",
          select: "name",
        })
        .lean(),

      Order.countDocuments({ user: userId }),
    ]);
    orders?.forEach((ord) => {
      ord.id = ord._id;
      delete ord._id;
      ord.items.forEach((itm) => {
        delete itm.product._id;
      });
    });
    return res.status(200).json({
      orders,
      pagination: {
        pageNumber,
        pageSize,
        totalOrders,
        totalPages: Math.ceil(totalOrders / pageSize),
        hasNextPage: pageNumber * pageSize < totalOrders,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("getUserOrders ", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    //validating order id
    if (!orderId || !verifyMongoId(orderId)) {
      return res.status(400).json({ error: "invalid order" });
    }
    //fetching order
    const fullOrder = await Order.findOne({ _id: orderId })
      .populate({
        path: "billing.paymentMode",
        select: "paymentOption",
      })
      .populate({
        path: "items.product",
        select: "name price", // This only retrieves the name and price fields of the product
      })
      .lean();
    if (!fullOrder) {
      return res.status(404).json({ error: "order does not exist" });
    }

    fullOrder.id = fullOrder._id;
    delete fullOrder._id;
    fullOrder.statusHistory?.forEach((sh) => delete sh?._id);
    fullOrder.items?.forEach((it) => delete it.product._id);
    delete fullOrder.__v;

    return res.status(200).json({ order: fullOrder });
  } catch (error) {
    console.log("error getting order details", error);
    return res.status(500).json({ error: "internal server error" });
  }
};
export const getPendingOrders = async (req, res) => {
  try {
    const pn = Math.max(1, parseInt(req.query.pn) || 1);
    const ps = Math.max(1, Math.min(100, parseInt(req.query.ps) || 10));
    const skip = (pn - 1) * ps;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [orders, total, todaysRevenueResult] = await Promise.all([
      Order.find({ status: { $in: ["order_placed", "hold"] } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(ps)
        .select("billing.totalBill status"),
      Order.countDocuments({ status: { $eq: "order_placed" } }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfToday, $lte: endOfToday },
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$billing.totalBill" },
          },
        },
      ]),
    ]);
    const todaysRevenue = todaysRevenueResult[0]?.totalRevenue || 0;
    const ordersF = orders.map((ord) => {
      return {
        totalBill: ord.billing.totalBill,
        id: ord._id,
        status: ord.status,
      };
    });
    return res.status(200).json({
      orders: ordersF,
      todaysRevenue,
      pagination: {
        page: pn,
        pageSize: ps,
        total,
        hasNextPage: pn * ps < total,
        hasPreviousPage: pn > 1,
      },
    });
  } catch (error) {
    console.error("Get pending orders error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getCompletedOrders = async (req, res) => {
  try {
    const pn = Math.max(1, parseInt(req.query.pn) || 1);
    const ps = Math.max(1, Math.min(100, parseInt(req.query.ps) || 10));
    const skip = (pn - 1) * ps;

    const [orders, total] = await Promise.all([
      Order.find({
        status: { $eq: "delivered" },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(ps)
        .populate({ path: "billing.paymentMode", select: "paymentOption" }),
      Order.countDocuments({ status: { $eq: "delivered" } }),
    ]);
    const ordersF = orders.map((ord) => {
      return {
        totalBill: ord.billing.totalBill,
        id: ord._id,
        status: ord.status,
      };
    });
    return res.status(200).json({
      orders: ordersF,
      pagination: {
        page: pn,
        pageSize: ps,
        total,
        totalPages: Math.ceil(total / ps),
        hasNextPage: pn * ps < total,
        hasPreviousPage: pn > 1,
      },
    });
  } catch (error) {
    console.error("Get completed order err:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getCancelledOrders = async (req, res) => {
  try {
    const pn = Math.max(1, parseInt(req.query.pn) || 1);
    const ps = Math.max(1, Math.min(100, parseInt(req.query.ps) || 10));
    const skip = (pn - 1) * ps;

    const [orders, total] = await Promise.all([
      Order.find({
        status: { $eq: "cancelled" },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(ps)
        .populate({ path: "billing.paymentMode", select: "paymentOption" }),
      Order.countDocuments({ status: { $eq: "cancelled" } }),
    ]);
    const ordersF = orders.map((ord) => {
      return {
        totalBill: ord.billing.totalBill,
        id: ord._id,
        status: ord.status,
      };
    });
    return res.status(200).json({
      orders: ordersF,
      pagination: {
        page: pn,
        pageSize: ps,
        total,
        totalPages: Math.ceil(total / ps),
        hasNextPage: pn * ps < total,
        hasPreviousPage: pn > 1,
      },
    });
  } catch (error) {
    console.error("Get cancelled order err:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getShippedOrders = async (req, res) => {
  try {
    const pn = Math.max(1, parseInt(req.query.pn) || 1);
    const ps = Math.max(1, Math.min(100, parseInt(req.query.ps) || 10));
    const skip = (pn - 1) * ps;

    const [orders, total] = await Promise.all([
      Order.find({
        status: { $eq: "shipped" },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(ps)
        .populate({ path: "billing.paymentMode", select: "paymentOption" }),
      Order.countDocuments({ status: { $eq: "cancelled" } }),
    ]);
    const ordersF = orders.map((ord) => {
      return {
        totalBill: ord.billing.totalBill,
        id: ord._id,
        status: ord.status,
      };
    });
    return res.status(200).json({
      orders: ordersF,
      pagination: {
        page: pn,
        pageSize: ps,
        total,
        totalPages: Math.ceil(total / ps),
        hasNextPage: pn * ps < total,
        hasPreviousPage: pn > 1,
      },
    });
  } catch (error) {
    console.error("Get cancelled order err:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const pn = Math.max(1, parseInt(req.query.pn) || 1);
    const ps = Math.max(1, Math.min(100, parseInt(req.query.ps) || 10));
    const skip = (pn - 1) * ps;

    const [orders, total] = await Promise.all([
      Order.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(ps)
        .populate({ path: "billing.paymentMode", select: "paymentOption" }),
      Order.countDocuments({}),
    ]);
    const ordersF = orders.map((ord) => {
      return {
        totalBill: ord.billing.totalBill,
        id: ord._id,
        status: ord.status,
      };
    });
    return res.status(200).json({
      orders: ordersF,
      pagination: {
        page: pn,
        pageSize: ps,
        totalPages: Math.ceil(total / ps),
        hasNextPage: pn * ps < total,
        hasPreviousPage: pn > 1,
      },
    });
  } catch (error) {
    console.error("Get cancelled order err:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getProcessingOrders = async (req, res) => {
  try {
    const pn = Math.max(1, parseInt(req.query.pn) || 1);
    const ps = Math.max(1, Math.min(100, parseInt(req.query.ps) || 10));
    const skip = (pn - 1) * ps;

    const [orders, total] = await Promise.all([
      Order.find({ status: { $eq: "processing" } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(ps)
        .populate({ path: "billing.paymentMode", select: "paymentOption" }),
      Order.countDocuments({}),
    ]);
    const ordersF = orders.map((ord) => {
      return {
        totalBill: ord.billing.totalBill,
        id: ord._id,
        status: ord.status,
      };
    });
    return res.status(200).json({
      orders: ordersF,
      pagination: {
        page: pn,
        pageSize: ps,
        totalPages: Math.ceil(total / ps),
        hasNextPage: pn * ps < total,
        hasPreviousPage: pn > 1,
      },
    });
  } catch (error) {
    console.error("Get cancelled order err:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
