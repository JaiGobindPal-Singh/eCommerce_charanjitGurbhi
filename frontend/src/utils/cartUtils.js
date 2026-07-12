import { getFromLocalStorage, saveToLocalStorage } from "./localStorage";
import { getUser } from "./userUtils"
import useCartStore from "../store/cartStore";
import api from "../configs/axiosConfig";

const normalizeCartItems = (items = []) => {
    return items.map((item) => {
        if (item?.product) {
            return item;
        }

        const { id, name, price, imageUrl, quantity } = item;
        return {
            product: {
                id,
                name,
                price,
                imageUrl,
            },
            quantity,
        };
    });
};

export const getCart = async () => {
    //getting cart from store if already stored
    const { cartItems } = useCartStore.getState();

    //returning cart from store if already stored
    if (cartItems && cartItems.length) {
        return cartItems;
    }

    //checking if user is logged in and getting cart from backend if logged in, else getting cart from local storage
    const user = await getUser();
    if (!user?.id) {
        const cartItems = JSON.parse(getFromLocalStorage("cartItems")) || [];
        const normalizedItems = normalizeCartItems(cartItems);
        useCartStore.getState().setCart(normalizedItems);
        return normalizedItems;
    }

    //making api request
    const cart = await api.get("/cart");
    const payload = cart?.data;
    const { items } = payload?.cart || {};
    const normalizedItems = normalizeCartItems(items);

    //saving data to store adn returning response
    useCartStore.getState().setCart(normalizedItems);
    return normalizedItems;
}

export const addToCart = async (product, quantity) => {
    const user = await getUser();
    const productId = product.id;
    const cartItem = {
        product: {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
        },
        quantity,
    };

    // storing to local storage if user is not logged in
    if (!user?.id) {
        const cartItems = JSON.parse(getFromLocalStorage("cartItems")) || [];
        const existingIndex = cartItems.findIndex(
            (item) => (item?.product?.id ?? item?.id) === productId
        );

        if (existingIndex >= 0) {
            const existingItem = cartItems[existingIndex];
            cartItems[existingIndex] = {
                ...existingItem,
                quantity: (existingItem.quantity || 0) + quantity,
            };
        } else {
            cartItems.push(cartItem);
        }

        saveToLocalStorage("cartItems", JSON.stringify(cartItems));
    } else {
        // storing to backend if user is logged in
        const response = await api.post('/cart', {
            productId: product.id,
            quantity: quantity,
        });
        const payload = response?.data;
        if (!payload?.success) {
            throw new Error("Failed to add item to cart");
        }
    }

    const { cartItems } = useCartStore.getState();
    const existingStoreItem = cartItems.find(
        (item) => (item?.product?.id ?? item?.id) === productId
    );

    if (existingStoreItem) {
        useCartStore.getState().updateQuantity(
            productId,
            (existingStoreItem.quantity || 0) + quantity
        );
    } else {
        useCartStore.getState().addToCart(cartItem);
    }
}

export const removeFromCart = async (product) => {
    const user = await getUser();
    const productId = product?.product?.id || product?.id;

    //removing from local storage if user is not logged in
    if (!user?.id) {
        const cartItems = JSON.parse(getFromLocalStorage("cartItems")) || [];
        const updatedCartItems = cartItems.filter((item) => (item?.product?.id ?? item?.id) !== productId);
        saveToLocalStorage("cartItems", JSON.stringify(updatedCartItems));
    }
    else {
        //removing from backend if user is logged in
        const response = await api.delete(`/cart/${productId}`);
        const payload = response?.data;
        if (!payload?.success) {
            throw new Error("Failed to remove item from cart");
        }
    }
    //update store
    useCartStore.getState().removeFromCart(productId);
}

export const updateProductQuantity = async (productId, quantity) => {
    const user = await getUser();

    // updating local storage if user is not logged in
    if (!user?.id) {
        const cartItems = JSON.parse(getFromLocalStorage("cartItems")) || [];
        const updatedCartItems = cartItems.map((item) => {
            if ((item?.product?.id ?? item?.id) === productId) {
                return { ...item, quantity };
            }
            return item;
        });
        saveToLocalStorage("cartItems", JSON.stringify(updatedCartItems));
    }
    else {
        // updating backend if user is logged in
        const response = await api.patch('/cart', {
            productId,
            quantity,
        });
        const payload = response?.data;
        if (!payload?.success) {
            throw new Error('Failed to update cart quantity');
        }
    }
    // update store from backend payload if returned, else optimistically update
    useCartStore.getState().updateQuantity(productId, quantity);
}