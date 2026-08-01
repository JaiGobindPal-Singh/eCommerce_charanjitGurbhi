import { useState, useEffect } from 'react';
import OrderListItem from '../common/OrderListItem';
import { fetchOrders } from '../../utils/orderUtils';
import Pagination from '../utilents/Pagination';
import SpinLoader from '../utilents/SpinLoader';
import OrderModal from './OrderModal';

function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [activeFilterOption, setActiveFilterOption] = useState('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const newOrders = await fetchOrders(currentPage, activeFilterOption);
        if (isMounted) {
          setOrders(newOrders.orders ?? []);
          setHasNextPage(Boolean(newOrders.hasNextPage));
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
        if (isMounted) {
          setOrders([]);
          setHasNextPage(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [currentPage, activeFilterOption]);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const filterOptionClass = `
  shrink-0
  px-4 py-2
  min-w-[7.5rem]
  rounded-2xl

  bg-slate-700/60
  text-slate-300

  border border-slate-600
  hover:bg-slate-600
  hover:border-slate-500
  hover:text-white

  text-sm
  font-medium
  uppercase
  tracking-wide

  transition-all
  duration-200

  flex
  items-center
  justify-center
`;
  const activeFilterOptionClass = `
  shrink-0
  px-4 py-2
  min-w-[7.5rem]
  rounded-2xl

  bg-blue-600/20
  text-blue-300

  border border-blue-500
  shadow-[0_0_0_1px_rgba(59,130,246,0.15)]

  text-sm
  font-semibold
  uppercase
  tracking-wide

  transition-all
  duration-200

  flex
  items-center
  justify-center
`;

  return (
    <div className="w-full min-h-full bg-color-medium px-3 py-4 sm:px-4">
      <div className="relative flex w-full min-w-0 flex-col items-center rounded-xl bg-color-heavy p-3 sm:p-4 min-h-[calc(100vh-6rem)]">
        {isLoading && <SpinLoader message="Loading orders..." />}

        <div className="pb-2 flex gap-4 items-center justify-between w-full max-md:hidden">
          <div className="flex justify-between max-md:hidden">
            <h1 className="text-4xl text-primary-color font-bold">Orders</h1>
          </div>
        </div>
        <div className="w-full border-1 border border-primary-color/50 my-2 max-md:hidden mb-2"></div>
        <div className="options flex w-full max-w-full gap-2 overflow-x-auto whitespace-nowrap px-1 py-1 mb-2 scrollbar-hide">
          <button
            className={activeFilterOption === 'all' ? activeFilterOptionClass : filterOptionClass}
            onClick={() => setActiveFilterOption('all')}
          >All Orders</button>
          <button
            className={activeFilterOption === 'pending' ? activeFilterOptionClass : filterOptionClass}
            onClick={() => setActiveFilterOption('pending')}
          >Pending</button>
          <button
            className={activeFilterOption === 'processing' ? activeFilterOptionClass : filterOptionClass}
            onClick={() => setActiveFilterOption('processing')}
          >Processing</button>
          <button
            className={activeFilterOption === 'shipped' ? activeFilterOptionClass : filterOptionClass}
            onClick={() => setActiveFilterOption('shipped')}
          >Shipped</button>
          <button
            className={activeFilterOption === 'delivered' ? activeFilterOptionClass : filterOptionClass}
            onClick={() => setActiveFilterOption('delivered')}
          >Delivered</button>
          <button
            className={activeFilterOption === 'cancelled' ? activeFilterOptionClass : filterOptionClass}
            onClick={() => setActiveFilterOption('cancelled')}
          >Cancelled</button>
        </div>

        {orders.length > 0 ? (
          orders.map((ord) => (
            <OrderListItem
              key={ord.id}
              orderId={'ORD-' + ord.id}
              status={ord.status}
              totalBill={ord.totalBill}
              orderData={ord}
              onClick={() => handleOpenModal(ord.id)}
            />
          ))
        ) : (
          !isLoading && (
            <div className="w-full rounded-3xl border border-slate-600/40 bg-slate-800/70 p-8 text-center text-slate-300 shadow-inner">
              <p className="text-xl font-semibold text-white mb-2">No orders yet</p>
              <p className="text-sm text-slate-400">There are no orders that match the selected filter right now.</p>
            </div>
          )
        )}

        <OrderModal isOpen={isModalOpen} onClose={handleCloseModal} orderId={selectedOrder} />

        <div className="mt-auto">
          <Pagination currentPage={currentPage} onPageChange={setCurrentPage} hasNextPage={hasNextPage} />
        </div>
      </div>
    </div>
  );
}

export default Orders;
