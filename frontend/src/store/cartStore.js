import {create} from 'zustand';

const useCartStore = create((set) => ({
    cartItems: [],
    addToCart: (item) => set((state) => ({
        cartItems: [...state.cartItems, item]
    })),

    removeFromCart: (itemId) => set((state) => ({
        cartItems: state.cartItems.filter(
            (item) => (item.product?.id ?? item.id) !== itemId)
    })),

    updateQuantity: (itemId, quantity) =>
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
                (item.product?.id ?? item.id) === itemId ? { ...item, quantity } : item
            )
        })),
        setCart: (items) => 
            set({cartItems:items})
}));

export default useCartStore;