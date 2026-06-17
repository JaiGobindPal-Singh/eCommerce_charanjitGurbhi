import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Connects to MongoDB using Mongoose. The connection URI is read from environment variables.
 */
const connectDb = async () => {
    if (!env.mongoUri) {
        throw new Error('MONGO_URI is required to connect to MongoDB');
    }
    //connecting to mongodb
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB connected');
};

export default connectDb;