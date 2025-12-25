import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected (auth-service)");
  } catch (err) {
    console.error("Mongo connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
