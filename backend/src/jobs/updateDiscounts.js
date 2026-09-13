import cron from 'node-cron';
import Discount from '../models/discount.model.js';

cron.schedule('0 0 * * *', async () => {
    const now = new Date();
    
    try {
        // 1. DEACTIVATE: End date passed AND currently active
        const deactivated = await Discount.updateMany(
            {
                isActive: true,
                endDate: { $lte: now }
            },
            {
                $set: { isActive: false }
            }
        );

        //2. Deactivate if max use limit reached
        const maxUsageDeactivated = await Discount.updateMany(
            {
                isActive: true,
                'conditions.usageLimitTotal': { $and: { $ne: null, $lte: 0 } }
            },
            {
                $set: { isActive: false }
            }
        );

        if (deactivated.modifiedCount > 0 || deactivated.modifiedCount > 0 || maxUsageDeactivated.modifiedCount > 0) {
            console.log(`[Cron] Synced coupons: deactivated ${deactivated.modifiedCount}, Deactivated ${deactivated.modifiedCount}, Max Usage Deactivated ${maxUsageDeactivated.modifiedCount}`);
        }
        
    } catch (error) {
        console.error("[Cron Error] Failed to sync coupon statuses:", error);
    }
});
