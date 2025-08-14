import mongoose from "mongoose";

export const connectDb = async () => {
    const MAX_RETRIES = 5;
    const RETRY_INTERVAL = 3000; 

    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        try {
            // Check if already connected
            if (mongoose.connection.readyState === 1) {
                console.log('MongoDB already connected');
                return;
            }

            await mongoose.connect(process.env.MONGO_URL, {
                serverSelectionTimeoutMS: 5000, 
                socketTimeoutMS: 45000,
            });

            console.log('MongoDB Connected Successfully');

            mongoose.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
            });

            return; 

        } catch (error) {
            attempts++;
            console.error(`MongoDB connection attempt ${attempts} failed:`, error.message);

            if (attempts >= MAX_RETRIES) {
                console.error('Max connection attempts reached. Could not connect to MongoDB.');
                if (process.env.NODE_ENV !== 'production') {
                    process.exit(1);
                }
                return;
            }

            console.log(`Retrying connection in ${RETRY_INTERVAL / 1000} seconds...`);
            await new Promise(res => setTimeout(res, RETRY_INTERVAL));
        }
    }
};
