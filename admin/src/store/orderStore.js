import { create } from 'zustand';

const initialState = {
    pages: {},
    filter: 'pending'
};

const useOrderStore = create((set) => ({
    ...initialState,

    setOrders: (payload) =>
        set((state) => ({
            pages: {
                ...state.pages,
                [payload.currentPage]: {
                    orders: payload?.orders ?? [],
                    hasNextPage: payload?.hasNextPage ?? false
                }
            },
            filter: payload.filter
        })),
    resetOrders: () => set(initialState),
}));

export default useOrderStore;
