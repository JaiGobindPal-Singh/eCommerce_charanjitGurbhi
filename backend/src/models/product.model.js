import mongoose from 'mongoose';

// subDocument schema for pricing tiers
const tierPricingSchema = new mongoose.Schema({
  minQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    gst:{
      type: Number,
      required: true
    },
    imageUrl: {
      type: [
        {
          type: String,
          trim: true,
        }
      ],
      maxLength: [5, 'You can upload a maximum of 5 images'],
    },
    category: {
      type: [String],
      trim: true,
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    comparePrice: {
      type: Number,
      min: 0,
      default: 0
    },
    stockAvailable: {
      type: Number,
      required: true,
      min: 0,
    },
    pricingTiers: {
      type: [tierPricingSchema],
      default: []
    },
    variants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;