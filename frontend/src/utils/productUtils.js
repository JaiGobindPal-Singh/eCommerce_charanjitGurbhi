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
        console.log(response);
        //storing in store
        useProductStore.getState().setProducts({
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
        //fetching and return product based on id
        const response = await api.get(`products/${productId}`);
        const payload = response?.data ?? {};
        return payload?.product ?? {};
    }catch(e){
        console.error("error getting product", e.message);
    } 
}
