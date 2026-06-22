import express from 'express';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
// import adminRoutes from './routes/adminRoutes.js';
// import productRoutes from './routes/productRoutes.js';
// import catalogRoutes from './routes/catalogRoutes.js';
// import cartRoutes from './routes/cartRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v0/cart', cartRoutes);
app.use('/api/v0/auth', authRoutes);
app.use('/api/v0/categories', categoryRoutes);
app.use('/api/v0/products', productRoutes);

app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
});



export default app;