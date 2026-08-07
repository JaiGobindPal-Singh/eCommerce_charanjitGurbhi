import { useEffect, useState } from "react";
// import { IndianRupee } from "lucide-react";
import { formatNumber } from "../../helpers/formatters";
import OrderListItem from "../common/OrderListItem";
import PaymentOptionMenu from "../common/PaymentOptionMenu";
import ChargesMenu from "../common/ChargesMenu";
import { fetchOrders, getOrderCondition, setOrderCondition } from "../../utils/orderUtils";
function ContentBox({ children }) {
  return (
    <div className="p-4 m-4  flex flex-col justify-center  bg-slate-900/50 border border-slate-800 rounded-xl shadow-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80">
      {children}
    </div>
  )
}

function Dashboard() {
  const [minAmount, setMinAmount] = useState(0);
  const [orders, setOrders] = useState([]);
  // const [newOrders, setNewOrders] = useState(0);
  const getOrdersTotalAmount = () => {
    let total = 0;
    orders.forEach(o => total += o.totalBill)
    return total;
  }

  useEffect(() => {
    fetchOrders(1, 'pending').then((ords => {
      setOrders(ords.orders)
    }));
    getOrderCondition().then(c => setMinAmount(c?.minAmount || 0))
  }, [])



  return (
    <div className="min-w-full min-h-full px-4 max-md:px-2 pt-2 bg-color-medium flex flex-col items-center overflow-auto ">
      <div className="bg-color-heavy w-full mt-2 rounded-xl grid grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))] gap-6 max-md:gap-2 mb-2 px-6 overflow-hidden">

        {/* Card 1: Today's Sale Amount */}
        {/* <ContentBox >
          <h2 className="text-xs font-semibold tracking-wider uppercase text-primary-color/70 mb-3">
            Today's Sale Amount
          </h2>
          <div className="text-primary-color text-3xl font-bold tracking-tight flex items-baseline gap-1">
            <IndianRupee size={28} className="self-center opacity-90" />
            <span>{formatNumber()}</span>
          </div>
        </ContentBox> */}

        {/* Card 2: New Orders */}
        <ContentBox >
          <h2 className="text-xs font-semibold tracking-wider uppercase text-primary-color/70 mb-3">
            New Orders
          </h2>
          <div className="text-primary-color text-3xl font-bold tracking-tight">
            {formatNumber(getOrdersTotalAmount())}
          </div>
        </ContentBox>

        {/* Card 3: Alternative Metric (Fixed Duplicate Title) */}
        {/* <ContentBox >
          <h2 className="text-xs font-semibold tracking-wider uppercase text-primary-color/70 mb-3">
            Total Customers
          </h2>
          <div className="text-primary-color text-3xl font-bold tracking-tight flex items-baseline gap-1">
            <span>{formatNumber(10)}</span>
            <span>---</span>
          </div>
        </ContentBox> */}

      </div>


      {/* <div className="flex gap-2 w-full mb-2 max-md:flex-col ">
        <div className="w-[50%] bg-color-heavy rounded-xl h-72 overflow-auto p-4 max-md:p-2 max-md:w-full">
          <h2 className="text-primary-color text-2xl font-bold tracking-tight max-md:text-xl">Recent Users</h2>
          <div className="w-full border-1 border border-primary-color/50 flex my-2"></div>
          {users.length < 1 &&
            <div className="w-full min-h-40 flex items-center justify-center text-white font-semibold p-4 text-xl">
              No Users Yet</div>
            }
          {users.slice(0, 3).map(ord => <UserListItem key={ord.id + ord.phone} id={ord.id} name={ord.name} phone={ord.phone} />)}
        </div>
        <div className="w-[50%] bg-color-heavy rounded-xl h-72 overflow-auto p-4 max-md:p-2 max-md:w-full">
          <h2 className="text-primary-color text-2xl font-bold tracking-tight max-md:text-xl">Todo Tasks</h2>
          <div className="w-full border-1 border border-primary-color/50 flex my-2"></div>
          <Todo />
        </div>
      </div> */}

      <div className="flex gap-2 w-full mb-2 max-md:flex-col min-h-96 md:max-h-96 overflow-hidden  ">
        <div className="w-[50%] bg-color-heavy rounded-xl  overflow-hidden p-4 max-md:p-2 max-md:w-full flex flex-col justify-between">
          <div className="w-full upperpart ">

          <h2 className="text-primary-color text-2xl font-bold tracking-tight max-md:text-xl ">Recent Orders</h2>
          <div className="w-full border-1 border border-primary-color/50 flex my-2 "></div>

          {orders.length < 1 &&
            <div className="w-full min-h-40 flex items-center justify-center text-white font-semibold p-4 text-xl">
              No Orders Yet</div>
          }
          {orders.slice(0, 3).map(ord => <OrderListItem key={ord.id}
            orderId={"ORD-" + ord.id} status={ord.status} totalBill={ord.totalBill} />)}
            </div>

          <div className="">
            <div className="w-full border-1 border border-primary-color/50 flex my-2"></div>
            <div
              className={`w-full mb-2 max-h-12 items-center flex justify-between p-3  bg-slate-900/90 border border-slate-800 rounded-xl shadow-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80 `}>
              <form onSubmit={(e) => { e.preventDefault(); setOrderCondition(minAmount) }} className="flex  gap-1 items-center">
                <label htmlFor="min-am" className="text-sm font-semibold text-slate-200 font-mono">
                  Min Amount:
                </label>
                <input className="bg-color-heavy text-white px-2 py-1 rounded-xl w-[50%]" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} type="number" name="min-am" id="min-am" />
                <button className="text-white bg-color-heavy px-4 py-1 rounded-xl">Update</button>
              </form>

            </div>
          </div>
        </div>
        <div className="w-[50%] bg-color-heavy rounded-xl  overflow-hidden p-4 max-md:p-2 max-md:w-full">
          <h2 className="text-primary-color text-2xl font-bold tracking-tight max-md:text-xl">Payment Options</h2>
          <div className="w-full border-1 border border-primary-color/50 flex my-2"></div>
          <PaymentOptionMenu />
        </div>


      </div>
      <div className="w-full bg-color-heavy rounded-xl overflow-auto p-4 max-md:p-2 max-md:w-full mb-4">
        <h2 className="text-primary-color text-2xl font-bold tracking-tight max-md:text-xl">Charges</h2>
        <div className="w-full border-1 border border-primary-color/50 flex my-2"></div>
        <ChargesMenu />
      </div>

    </div>
  )
}

export default Dashboard
