import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connectedDB");
  } catch (error) {
    console.log("db error:", error.message);
  }
};

export default connectDB;
