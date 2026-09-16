import mongoose from "mongoose";

export async function connectDB() {
  try {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established successfully');})
    const conn = await mongoose.connect(`${process.env.MONGODB_URL}/chat-app`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}