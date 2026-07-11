import mongoose from "mongoose"
const orderConditionSchema = new mongoose.Schema({
    minAmount:{
        type: Number,
        default: 0,
        unique: true
    }
});

const OrderCondition = mongoose.model("OrderCondition", orderConditionSchema);
export default OrderCondition;
