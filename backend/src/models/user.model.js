import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            streetAddress: {
                type: String,
                trim: true,
                lowercase: true,
                default: ""
            },
            city: {
                type: String,
                trim: true,
                lowercase: true,
                default: ""
            },
            state: {
                type: String,
                trim: true,
                lowercase: true,
                default: ""
            },
            postalCode: {
                type: String,
                trim: true,
            }
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['client', 'admin'],
            default: 'client',
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;