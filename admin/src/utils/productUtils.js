import useProductStore from "../store/productStore";
import api from "../configs/axiosConfig";
import { generateNotification } from "./notificationUtils";
/**
* 
 * @param {Number} page 
 * @returns {any} return array of fetched products
 * @note if products exist in store it will not make api request until page number is <= currentPage
 */
export const fetchProducts = async (page) => {
    try {
        const { pages } = useProductStore.getState();
        //return stored products if already stored
        const storedProducts = pages[page];
        if (storedProducts && storedProducts?.products?.length) {
            return storedProducts;
        }
        //fetching from api 
        const response = await api.get(`products?ps=10&pn=${page}`);
        const payload = response?.data ?? {};
        //storing in store
        useProductStore.getState().setProducts({
            currentPage: page,
            hasNextPage: payload?.hasNextPage ?? false,
            products: payload?.products ?? [],
        });

        return {
            products: payload?.products ?? [],
            hasNextPage: payload?.hasNextPage ?? false,
            totalPages: payload?.totalPages ?? 0
        };

    } catch (e) {
        console.error('error fetching products', e);
    }
};

/**
 * @brief search products by keyword if no keyword fallback to fetchProduct
 * @param {Number} page pageNumber to load
 * @param {String} key Search value
 * @returns {any} products
 */
export const fetchProductsByKey = async (page, key) => {
    try {
        const { pages } = useProductStore.getState();
        if (!key || key.trim().length < 3) {
            return await fetchProducts(page);
        }
        //return stored products if already stored
        const storedProducts = pages[page];
        if (storedProducts && storedProducts?.length) {
            return storedProducts;
        }

        // Always fetch for keyword searches to avoid stale/partial results
        const response = await api.get(`products/keyword?productSearchKey=${encodeURIComponent(key)}&pn=${page || 1}&ps=10`);
        const payload = response?.data ?? {};

        //! DO NOT STORE SEARCHED PRODUCTS

        return {
            products: payload?.products ?? [],
            hasNextPage: payload?.hasNextPage ?? false,
            totalPages: payload?.totalPages ?? 0
        };

    } catch (e) {
        console.error("error fetching by keyword", e);
        return [];
    }
}

/**
 * 
 * @param {String} productId 
 * @returns {any} product
 */
export const getProduct = async (productId) => {
    try {
        //fetching and return product based on id 
        const response = await api.get(`products/${productId}`);
        const payload = response?.data ?? {};
        return payload?.product ?? {};
    } catch (e) {
        console.error("error getting product", e.message);
    }
}

export const createProduct = async (formData) => {
    try {
        const res = await api.post('products/', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
        const payload = res.data;
        generateNotification("New Product added")();
        return payload.product;
    } catch (e) {
        generateNotification("unable to create product")();
        console.log(e);
    }
}

export const updateProduct = async (productId, productData) => {
    try {
        console.log(productData);
        const res = await api.put(`products/${productId}`, productData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
        const payload = res.data;
        generateNotification("Product updated successfully")();
        return payload.product;
    } catch (e) {
        generateNotification("unable to update product")();
        console.log(e);
    }
}

export const deleteProduct = async (productId) => {
    try {
        await api.delete(`products/${productId.trim()}`);
        generateNotification("Product Deleted")();
    } catch (e) {
        generateNotification("unable to delete product")();
        console.log(e);
    }
}
