import { useEffect, useState } from "react";
import { getUser } from "../../utils/userUtils";
import { useNavigate } from "react-router-dom";
import { IndianRupee } from "lucide-react";
import { formatNumber } from "../../helpers/formatters";
import OrderListItem from "../common/OrderListItem";
import UserListItem from "../common/UserListItem";
import Todo from "../todo/Todo";
function ContentBox({ children }) {
  return (
    <div className="p-4 m-4  flex flex-col justify-center  bg-slate-900/50 border border-slate-800 rounded-xl shadow-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80">
      {children}
    </div>
  )
}

function Dashboard() {
  const [orders, setOrders] = useState([
    {
      "totalBill": 5238.4,
      "id": "6a61d84838e1abb3fe01944e",
      "status": "order_placed"
    }
  ]);
  const [users, setUsers] = useState([
    {
      "id": "6a61d84838e1abb3fe01944e",
      "phone": 8871717473,
      name: "jai gobind pal singh"
    }
  ]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        if (!user?.id || user?.role?.trim() !== "admin") {
          navigate('/login');
        }
      } catch {
        navigate('/login');
      }
    }
    fetchUser();
  }, [navigate]);


  return (
    <div className="min-w-full min-h-full bg-color-medium flex flex-col items-center overflow-auto ">
      <div className="bg-color-heavy w-[95%] mt-2 rounded-xl grid grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))] gap-6 max-md:gap-2 mb-2 px-6 overflow-hidden">

        {/* Card 1: Today's Sale Amount */}
        <ContentBox >
          <h2 className="text-xs font-semibold tracking-wider uppercase text-primary-color/70 mb-3">
            Today's Sale Amount
          </h2>
          <div className="text-primary-color text-3xl font-bold tracking-tight flex items-baseline gap-1">
            <IndianRupee size={28} className="self-center opacity-90" />
            <span>{formatNumber(50000)}</span>
          </div>
        </ContentBox>

        {/* Card 2: New Orders */}
        <ContentBox >
          <h2 className="text-xs font-semibold tracking-wider uppercase text-primary-color/70 mb-3">
            New Orders
          </h2>
          <div className="text-primary-color text-3xl font-bold tracking-tight">
            {formatNumber(5000)}
          </div>
        </ContentBox>

        {/* Card 3: Alternative Metric (Fixed Duplicate Title) */}
        <ContentBox >
          <h2 className="text-xs font-semibold tracking-wider uppercase text-primary-color/70 mb-3">
            Total Customers
          </h2>
          <div className="text-primary-color text-3xl font-bold tracking-tight flex items-baseline gap-1">
            <span>{formatNumber(10)}</span>
          </div>
        </ContentBox>

      </div>
      <div className="w-[95%] bg-color-heavy rounded-xl min-h-80 p-4 mb-2">
        <h2 className="text-primary-color text-2xl font-bold tracking-tight max-md:text-xl ">Recent Orders</h2>
        <div className="w-full border-1 border border-primary-color/50 flex my-2"></div>
        {orders.map(ord => <OrderListItem key={ord.id}
        orderId={"ORD-" + ord.id} status={ord.status} totalBill={ord.totalBill} />)}
      </div>

      <div className="flex gap-2 w-[95%] mb-2 max-md:flex-col ">
        <div className="w-[50%] bg-color-heavy rounded-xl h-72 overflow-auto p-4 max-md:p-2 max-md:w-full">
          <h2 className="text-primary-color text-2xl font-bold tracking-tight max-md:text-xl">Recent Users</h2>
          <div className="w-full border-1 border border-primary-color/50 flex my-2"></div>
          {users.map(ord => <UserListItem key={ord.id+ ord.phone} id={ord.id} name={ord.name} phone={ord.phone} />)}
        </div>
        <div className="w-[50%] bg-color-heavy rounded-xl h-72 overflow-auto p-4 max-md:p-2 max-md:w-full">
          <h2 className="text-primary-color text-2xl font-bold tracking-tight max-md:text-xl">Todo Tasks</h2>
          <div className="w-full border-1 border border-primary-color/50 flex my-2"></div>
          <Todo />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
