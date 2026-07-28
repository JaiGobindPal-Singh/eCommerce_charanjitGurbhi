import { create } from 'zustand';

const initialState = {
    pages: {},
};

const useCategoryStore = create((set) => ({
    ...initialState,

    setCategories: (payload) =>
        set((state) => ({
            pages: {
                ...state.pages,
                [payload.currentPage]: {
                    categories: payload?.categories ?? [],
                    hasNextPage: payload?.hasNextPage ?? false
                }
            },
        })),
    resetCategories: () => set(initialState),
}));

export default useCategoryStore;
