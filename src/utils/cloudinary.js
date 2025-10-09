import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';

// Load environment variables here in case this module is imported before
// the application's central dotenv config runs (prevents missing api_key)
dotenv.config();

console.log("Cloudinary Config:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing",
  secret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing"
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const result = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"});
        // Delete the file from local uploads folder after uploading to Cloudinary
        fs.unlinkSync(localFilePath);
        console.log("Uploaded to Cloudinary:", result.secure_url);
        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

export default uploadToCloudinary;
