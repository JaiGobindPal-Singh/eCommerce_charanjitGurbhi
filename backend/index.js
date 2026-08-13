import app from './src/app.js';
import connectDb from './src/config/db.js';
import express from 'express';
import { env } from './src/config/env.js';
import { seedAdminUser } from './src/utils/seedAdmin.js';
import { fileURLToPath } from 'url';
import path from 'path';
//creating pathname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = env.port;


const startServer = async () => {
    await connectDb();
    await seedAdminUser();

    // Register cron jobs
    await import('./src/jobs/expireOrders.js');
    await import('./src/jobs/updateDiscounts.js');


    // Serve static assets specifically for the dashboard route
    app.use('/admin', express.static(path.join(__dirname, 'dist')));
    app.use('/',  express.static(path.join(__dirname, 'front')));

    // Catch-all refresh handler for dashboard sub-routes (e.g., /dashboard/settings)
    app.get('/admin*any', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
    app.get('/*any', (req, res) => {
        res.sendFile(path.join(__dirname, 'front', 'index.html'));
    });

    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});