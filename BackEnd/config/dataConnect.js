import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config(); // Load environment variables from .env file

const MONGOOSE_URL = process.env.MONGOOSE_URI; // Use the correct variable name from .env

const dbConnect = async () => {
    try {
        await mongoose.connect(MONGOOSE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

export default dbConnect;






