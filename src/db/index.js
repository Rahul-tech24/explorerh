import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://rahulrajput808160_db_user:VUCZ39OyxuJzObrC@cluster0.wekfbru.mongodb.net/explorerh?retryWrites=true&w=majority");
    console.log("Connected to MongoDB");
  } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
  }
};
