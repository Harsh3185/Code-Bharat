import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DBConnection = async () => {
    
    const MONGODB_URL = process.env.MONGODB_URL;

    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to the Database Successfully,")
    } catch (error) {
        console.log("Error connecting to database " , error.message);
    }
};

export default DBConnection;

