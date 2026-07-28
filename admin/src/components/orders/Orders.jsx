import OrderListItem from '../common/OrderListItem';

function Orders() {
  const orders = [
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'order_placed',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'abandoned',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'return_requested',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'cancelled',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'returned',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'payment_failed',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'out_for_delivery',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'order_placed',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'order_placed',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'order_placed',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'order_placed',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'order_placed',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'order_placed',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'order_placed',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'order_placed',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'order_placed',
      totalBill: 1234
    },
    {
      id: 'asjdfkjsdfkjsdkjf356',
      status: 'order_placed',
      totalBill: 1234
    },
  ]
  return (
    <div className="min-h-screen bg-color-medium p-4 ">
      <div className="w-full flex flex-col items-center bg-color-heavy p-4 rounded-xl min-h-[95dvh]">
        {/* header  */}
        <div className="pb-2 flex gap-4  items-center justify-between w-full max-md:hidden">
          <div className="flex justify-between max-md:hidden">
            <h1 className="text-4xl text-primary-color font-bold">Orders</h1>
          </div>
        </div>
        <div className="w-full border-1 border border-primary-color/50 my-2 max-md:hidden mb-6 "></div>

        {orders.map(ord => <OrderListItem key={ord.id}
          orderId={"ORD-" + ord.id} status={ord.status} totalBill={ord.totalBill} />)}
      </div>
    </div>

  )
}
export default Orders
