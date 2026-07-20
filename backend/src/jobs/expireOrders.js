/**
 * @file expireOrders.js
 * @description this file contains the job that execute at 2AM and clears 
 */
import cron from 'node-cron';
import Transaction from '../models/transaction.model.js';
import Order from '../models/order.model.js';
// Runs every day at 2:00 AM IST
cron.schedule(
    '0 2 * * *',
    async () => {
        try {
            const result = await Transaction.updateMany(
                {
                    status: 'initialized',
                    createdAt: {
                        $lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    },
                },
                {
                    $set: {
                        status: 'failed', // or 'expired'
                    },
                }
            );
            const orderResult = await Order.updateMany(
                {
                    status: 'payment_pending',
                    createdAt: {
                        $lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    },
                },
                {
                    $set: {
                        status: 'payment_failed', 
                    },
                }
            );
            console.log(
                `Transaction expiry completed. Matched: ${result.matchedCount}-${orderResult.matchedCount}, Updated: ${result.modifiedCount}-${orderResult.modifiedCount}`
            );

        } catch (error) {
            console.error('Transaction expiry job failed:', error);
        }
    },
    {
        timezone: 'Asia/Kolkata',
    }
);