import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true // Standardizes codes like "SAVE10"
    },
    description: {
        type: String,
        required: true,
        trim: true
    },

    // 1. Discount Value Fields
    discountType: {
        type: String,
        required: true,
        enum: ['FIXED', 'PERCENT']
    },
    discountValue: {
        type: Number,
        required: true,
        min: [0, 'Discount value cannot be negative'],
        validate: {
            validator: function (value) {
                // Enforces that percentage discounts cannot exceed 100%
                if (this.discountType === 'PERCENT' && value > 100) {
                    return false;
                }
                return true;
            },
            message: 'Percentage discount cannot be greater than 100%'
        }
    },

    // 2. Discount Conditions
    conditions: {
        minCartValue: {
            type: Number,
            default: 0,
            min: 0
        },
        // isNewUserOnly: {
        //     type: Boolean,
        //     default: false
        // },
        maxDiscountAmount: {
            type: Number, // Useful cap for PERCENT discounts (e.g., 50% off up to ₹500)
            min: 0,
            default: null
        },
        usageLimitTotal: {
            type: Number, // Total times this coupon can ever be used across the store
            default: null
        },
    },

    // 3. Metadata & Validity
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Pre-save hook to automatically deactivate expired coupons on save
discountSchema.pre('save', function (next) {
    if (this.endDate && this.endDate < new Date()) {
        this.isActive = false;
    }
    next();
});

const Discount = mongoose.model('Discount', discountSchema);
export default Discount;
