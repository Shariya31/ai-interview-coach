import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Interview DB connected");
  } catch (error) {
    console.error("Interview DB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
