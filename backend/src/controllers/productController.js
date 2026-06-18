import { uploadImage, deleteImage } from "../utils/imageHandler";
import Product from "../models/product.model";

export const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, comparePrice, stockAvailable } = req.body;
        if (!name || !description || !price || !comparePrice || !req.file) {
            return res.status(400).json({ message: 'All fields and product image are required' });
        }
        //upload product image and get the URL
        const productImageUrl = await uploadImage(req.file);

        //saving the product to the database
        const product = new Product({
            name,
            description,
            category,
            price,
            comparePrice,
            stockAvailable,
            imageUrl: productImageUrl
        });
        await product.save();

        //returning the response
        return res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export const deleteProduct = async (req, res) => {
    try{
        const {productId} = req.params;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).json({message: 'Product not found'});
        }
        //delete the product image from cloudinary
        await deleteImage(deletedProduct.imageUrl);

        return res.status(200).json({message: 'Product deleted successfully'});
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}
//todo create product controller update , get products by diff methods