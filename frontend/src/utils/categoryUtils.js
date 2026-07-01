import api from "../configs/axiosConfig.js";
import useCategoryStore from '../store/categoryStore.js'
export const getCategories = async() =>{
    try{
        const {categories} = useCategoryStore.getState();
        if(categories && categories?.length > 0){
            return categories;
        }
        //call api only if categories are not stored
        const response = await api.get("categories/");

        //storing categories
        const payload = response?.data ?? {};
        useCategoryStore.getState().setCategories({
            categories: payload?.categories ?? []
        })
        return payload?.categories ?? [];
    }catch(e){
        console.error("error fetching categories", e);
    }
}
//todo develop admin functions