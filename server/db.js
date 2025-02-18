//db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

const connectdb = async () => {
    try{
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected");
    }catch (error){
        console.error("MongoDB connection failed", error.message);
    }
};

export default connectdb;