import useOrderStore from "../store/orderStore";
import api from "../configs/axiosConfig";
import { generateNotification } from "./notificationUtils";

/**
* 
 * @param {Number} page 
 * @returns {any} return array of fetched orders
 * @note if orders exist in store it will not make api request until page number is <= currentPage
 */
export const fetchOrders = async (page, filter) => {
    try {
        const { pages, filterStored } = useOrderStore.getState();

        //return stored orders if already stored
        if (filter.trim() == filterStored) {
            const storedOrders = pages[page];
            if (storedOrders && storedOrders?.orders?.length) {
                return storedOrders;
            }
        }

        const endpointMap = {
            pending: 'orders/pending',
            all: 'orders/all',
            processing: 'orders/processing',
            shipped: 'orders/shipped',
            delivered: 'orders/completed',
            cancelled: 'orders/cancelled'
        };
        const endpoint = endpointMap[filter] || 'orders/pending';
        //fetching from api 
        const response = await api.get(`${endpoint}?ps=10&pn=${page}`);
        const payload = response?.data ?? {};

        //storing in store
        useOrderStore.getState().setOrders({
            currentPage: page,
            hasNextPage: payload?.pagination?.hasNextPage ?? false,
            orders: payload?.orders ?? [],
            total: payload?.pagination?.total
        });

        return {
            orders: payload?.orders ?? [],
            hasNextPage: payload?.pagination?.hasNextPage ?? false,
            totalPages: payload?.pagination?.totalPages ?? 0,
            total: payload?.pagination?.total
        };

    } catch (e) {
        console.error('error fetching orders', e);
    }
};

export const getOrderCondition = async() =>{
    try{
        const condition = await api.get('/orders/conditions');
        return condition.data;
    }catch(e){
        console.log(e);
    }
}
export const setOrderCondition = async(minAmount) =>{
    try{
        const con = await api.put('/orders/conditions', {
            minAmount
        });
        const payload = con.data;
        generateNotification("updated condition")();
        return payload;
    }catch(e){
        generateNotification("unable to update condition")();
        console.log(e);
    }
}
export const updateOrderStatus = async (orderId, status, cancellationReason, deliveryPartner, trackingId ) =>{
    try{
        console.log(status, "00");
        const response = await api.patch(`orders/status/${orderId}`,{
            status,
            cancellationReason,
            deliveryPartner,
            trackingId
        });
        const payload = response.data;
        if(payload.success){
            generateNotification('Order Updated')();
            return;
        }else{
            generateNotification('Unable to update Order')();
            throw new Error("unable to update order");
        }
    }catch(error){
        console.log(error.response.data.message || error.response.data)
        console.log(error);
    }
}
export const getOrderDetails = async (orderId) =>{
    try{
        const response = await api.get(`orders/${orderId}`);
        const payload = response.data
        return payload.order;
    }catch(e){
        console.log('error getting order', e);
    }
}