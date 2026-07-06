import { uploadImage, deleteImage } from "../utils/imageHandler.js";
import Product from "../models/product.model.js";

//only admin access
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, comparePrice, stockAvailable } =
      req.body;
    if (!name || !description || !price || !comparePrice || !req.file) {
      return res
        .status(400)
        .json({ error: "All fields and product image are required" });
    }
    //upload product image and get the URL
    const productImageUrl = await uploadImage(req.file);

    //saving the product to the database
    const product = new Product({
      name,
      description,
      category,
      price,
      comparePrice,
      stockAvailable,
      imageUrl: productImageUrl,
    });
    await product.save();

    //returning the response
    return res
      .status(201)
      .json({
        success: true,
        product: {
          id: product._id,
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          comparePrice: product.comparePrice,
          stockAvailable: product.stockAvailable,
          imageUrl: product.imageUrl
        }
      });
  } catch (error) {
    // console.error("Error creating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId).lean();
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    //delete the product image from cloudinary
    await deleteImage(deletedProduct.imageUrl);

    return res.status(200).json({ success: true });
  } catch (error) {
    // console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const updateProduct = async (req, res) => {
  try {
    //validating the data
    const {
      productId,
      name,
      description,
      category,
      price,
      comparePrice,
      stockAvailable,
    } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    //check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    //handle image update if a new file is uploaded
    if (req.file) {
      //delete the old image from cloudinary
      await deleteImage(product.imageUrl);
      //upload the new image and get the URL
      const productImageUrl = await uploadImage(req.file);
      product.imageUrl = productImageUrl;
    }
    //update the product details
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = price;
    if (comparePrice) product.comparePrice = comparePrice;
    if (stockAvailable) product.stockAvailable = stockAvailable;

    await product.save();
    product.id = product._id;
    delete product._id;
    delete product.__v;
    delete product.createdAt;
    delete product.updatedAt;

    return res
      .status(200)
      .json({ success: true, product });
  } catch (error) {
    // console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//* optimize these later using cursor on application scale

export const getAllProducts = async (req, res) => {
  try {
    //fetching pageNumber and pageSize from query example:- https://a.com/hello?pn=2&ps=10
    const pageNumber = req.query.pn
      ? Math.max(parseInt(req.query.pn, 10), 1) || 1
      : 1;
    const pageSize = req.query.ps
      ? Math.max(parseInt(req.query.ps, 10), 1) || 10
      : 10; //default 10

    //fetching the products pageByPage
    const [allProducts, productCount] = await Promise.all([
      Product.find({})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Product.countDocuments({}),
    ]);
    const totalPages = Math.ceil(productCount / pageSize);
    return res.status(200).json({
      message: "fetched all products",
      totalPages,
      currentPage: pageNumber,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
      products: allProducts.map(({ _id, __v, ...product }) => ({
        ...product,
        id: _id,
      })),
    });
  } catch (error) {
    // console.log("error getting all products", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
};
export const getProductsByCategory = async (req, res) => {
  try {
    const pageNumber = req.query.pn
      ? Math.max(parseInt(req.query.pn, 10), 1) || 1
      : 1;
    const pageSize = req.query.ps
      ? Math.max(parseInt(req.query.ps, 10), 1) || 10
      : 10;
    const category = req.query.category;

    // dynamic MongoDB filter object
    const filter = {};
    if (category) {
      if (Array.isArray(category)) {
        filter.category = category[0];
      } else {
        filter.category = category;
      }
    }

    // Pass the filter object into both queries
    const [allProducts, totalProducts] = await Promise.all([
      Product.find(filter)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / pageSize);

    return res.status(200).json({
      message: "fetched products successfully",
      currentPage: pageNumber,
      pageSize: pageSize,
      totalProducts: totalProducts,
      totalPages: totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
      products: allProducts,
    });
  } catch (error) {
    // console.log("error getting products By Category", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
};
export const getProductsByKeyword = async (req, res) => {
  // Helper function to escape special regex characters
  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
  try {
    const pageNumber = req.query.pn
      ? Math.max(parseInt(req.query.pn, 10), 1) || 1
      : 1;
    const pageSize = req.query.ps
      ? Math.max(parseInt(req.query.ps, 10), 1) || 10
      : 10;
    const keyword = req.query.productSearchKey;

    //validating keyword
    if (!keyword || keyword.length < 3) {
      return res.status(200).json({
        success: false,
        currentPage: pageNumber,
        pageSize: 10,
        totalProducts: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
        products: [],
      });
    }
    //sanitize the query
    const safeKeyword = escapeRegex(keyword.trim());

    //creating filter
    const filter = {
      $or: [
        { name: { $regex: safeKeyword, $options: "i" } },
        { category: { $regex: safeKeyword, $options: "i" } },
      ],
    };
    //search products in db and find total documents
    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / pageSize);

    return res.status(200).json({
      success: true,
      currentPage: pageNumber,
      pageSize: pageSize,
      totalProducts: totalProducts,
      totalPages: totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
      products: products.map((pd) => {
        const { _id, __v, createdAt, updatedAt, ...pdF } = pd;
        pdF.id = _id;
        return pdF;
      }),
    });
  } catch (error) {
    // console.log("error occurred getting products by keyword", error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }
    product.id = product._id;
    delete product._id;
    delete product.__v;
    delete product.createdAt;
    delete product.updatedAt;
    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    // console.log("error occurred getting product by id", error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};
