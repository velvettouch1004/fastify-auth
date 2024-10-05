import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGOURI as string; // Use your MongoDB URI here

export const connectToDatabase = async () => {
  try {
    // Use mongoose to connect to the MongoDB server
    await mongoose.connect(uri);
    console.log(`Connected to database: ${uri}`);
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};
