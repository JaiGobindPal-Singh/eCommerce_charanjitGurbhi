import app from './src/app.js';
import connectDb from './src/config/db.js';
import { env } from './src/config/env.js';
import { seedAdminUser } from './src/utils/seedAdmin.js';

const PORT = env.port;

const startServer = async () => {
    await connectDb();
    await seedAdminUser();

    // Register cron jobs
    await import('./src/jobs/expireOrders.js');
    await import('./src/jobs/updateDiscounts.js');

    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});