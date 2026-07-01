import { create } from 'zustand';

const initialState = {
    categories: [],
};

const useCategoryStore = create((set) => ({
    ...initialState,

    setCategories: (payload) =>
        set((state) => ({
            ...state,
            categories: payload?.categories ?? [],
        })),
    resetCategories: () => set(initialState),
}));

export default useCategoryStore;
