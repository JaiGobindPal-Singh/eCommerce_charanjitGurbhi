import zustand from 'zustand';

const useCartStore = zustand((set) => ({
    cartItems: [],
    addToCart: (item) => set((state) => ({
        cartItems: [...state.cartItems, item]
    })),

    removeFromCart: (itemId) => set((state) => ({
        cartItems: state.cartItems.filter(
            (item) => item.id !== itemId)
    })),

    updateQuantity: (itemId, quantity) =>
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        }))
}));

export default useCartStore;