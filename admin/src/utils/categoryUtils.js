import useCategoryStore from "../store/categoryStore";
import api from "../configs/axiosConfig";

/**
* 
 * @param {Number} page 
 * @returns {any} return array of fetched categories
 * @note if categories exist in store it will not make api request until page number is <= currentPage
 */
export const fetchCategories = async (page) => {
    try {
        const {pages} = useCategoryStore.getState();
        //return stored categories if already stored
        const storedCategories = pages[page];
        if(storedCategories && storedCategories?.categories?.length){
            return storedCategories;
        }
        //fetching from api 
        const response = await api.get(`categories?ps=10&pn=${page}`);
        const payload = response?.data ?? {};
        //storing in store
        useCategoryStore.getState().setCategories({
            currentPage: page,
            hasNextPage: payload?.hasNextPage ?? false,
            categories: payload?.categories ?? [],
        });

        return {
            categories: payload?.categories ?? [],
            hasNextPage: payload?.hasNextPage ?? false,
            totalPages: payload?.totalPages ?? 0
        };

    } catch (e) {
        console.error('error fetching categories', e);
    }
};

/**
 * 
 * @param {String} categoryId
 * @returns {any} category
 */
export const getCategory = async (categoryId) =>{
    try{
        //fetching and return category based on id 
        const response = await api.get(`categories/${categoryId}`);
        const payload = response?.data ?? {};
        return payload?.category ?? {};
    }catch(e){
        console.error("error getting category", e.message);
    } 
}
