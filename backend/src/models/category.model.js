import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
{
    name:{
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    iconUrl:{
        type: String,
        required: true,
    },
}
);

const Category = mongoose.model('Category', categorySchema);
export default Category;