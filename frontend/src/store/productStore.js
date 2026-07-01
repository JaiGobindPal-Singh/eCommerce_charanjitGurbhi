import { create } from 'zustand';

const initialState = {
    hasNextPage: true,
    products: [],
    currentPage: 0
};

const useProductStore = create((set) => ({
    ...initialState,

    setProducts: (payload) =>
        set((state) => ({
            currentPage: payload?.currentPage ?? 0,
            hasNextPage: payload?.hasNextPage ?? false,
            products: [...state.products, ...(payload?.products ?? [])],
        })),
    resetProducts: () => set(initialState),
}));

export default useProductStore;
