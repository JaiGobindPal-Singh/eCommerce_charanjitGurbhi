import useProductStore from "../store/productStore.js";
import api from "../configs/axiosConfig.js";

/**
 * 
 * @param {Number} page 
 * @returns {any} return array of fetched products
 * @note if products exist in store it will not make api request until page number is <= currentPage
 */
export const fetchProducts = async (page) => {
    try {
        const {currentPage, hasNextPage, products} = useProductStore.getState();
        //checking if next page exist or page is current page
        if(currentPage == page || !hasNextPage){
            return products;
        }
        // load stored products if needed
        if(page <= currentPage){
            if(products && products.length > 0) return products;

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

        return payload?.products ?? [];

    } catch (e) {
        console.error('error fetching products', e);
    }
};

/**
 * 
 * @param {String} productId 
 * @returns {any} product
 */
export const getProduct = async (productId) =>{
    try{
        //getting product from store
        const {products} = useProductStore.getState();
        if(products && Array.isArray(products) && products.length > 0){
            products.forEach(prd => {
                if(prd.id == productId) return prd;
            });
        }
        //fetching and return product based on id if product not in store
        const response = await api.get(`products/${productId}`);
        const payload = response?.data ?? {};
        return payload?.product ?? {};
    }catch(e){
        console.error("error getting product", e.message);
    } 
}

/**
 * @brief returns boolean that tells more products exists or not true if exists
 * @returns {Boolean} hasNextPage
 */
export const moreProductsExists = () => {
    const { hasNextPage } = useProductStore.getState();
    return hasNextPage;
}

export const clearProductStore = () => {
    useProductStore.getState().resetProducts();
};

/**
 * @brief search products by keyword if no keyword fallback to fetchProduct
 * @param {Number} page pageNumber to load
 * @param {String} key Search value
 * @returns {any} products
 */
export const fetchProductsByKey = async (page, key) => {
    try {
        if (!key || key.trim().length < 3) {
            return await fetchProducts(page);
        }

        // Always fetch for keyword searches to avoid stale/partial results
        const response = await api.get(`products/keyword?productSearchKey=${encodeURIComponent(key)}&pn=${page}&ps=10`);
        const payload = response?.data ?? {};

        useProductStore.getState().setProducts({
            currentPage: page,
            hasNextPage: payload?.hasNextPage ?? false,
            products: payload?.products ?? [],
        });

        return payload?.products ?? [];

    } catch (e) {
        console.error("error fetching by keyword", e);
        return [];
    }
}

//todo admin functions

