import { create } from 'zustand';

const initialState = {
    pages: {},
};

const useProductStore = create((set) => ({
    ...initialState,

    setProducts: (payload) =>
        set((state) => ({
            pages: {
                ...state.pages,
                [payload.currentPage]: {
                    products: payload?.products ?? [],
                    hasNextPage: payload?.hasNextPage ?? false
                }
            },
        })),
    resetProducts: () => set(initialState),
}));

export default useProductStore;
