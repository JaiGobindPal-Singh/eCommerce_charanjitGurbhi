import { uploadImage } from "../utils/imageHandler.js";
import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
    try{
        const {name} = req.body;
        if(!name || !req.file){
            return res.status(400).json({message: 'Name and icon image are required'});
        }
        const iconUrl = await uploadImage(req.file);
        const category = new Category({
            name, 
            iconUrl
        });
        await category.save();
        return res.status(201).json({message: 'Category created successfully', category});
    }catch(error){
        console.error('Error creating category:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export const getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find().lean();
        return res.status(200).json({categories});
    }catch(error){
        console.error('Error fetching categories:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export const getCategoryByStep = async (req, res) => {
    try{
        const {step} = req.params;
        const categories = await Category.find().skip((step - 1) * 10).limit(10).lean();
        return res.status(200).json({categories});
    }catch(error){
        console.error('Error fetching categories by step:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}