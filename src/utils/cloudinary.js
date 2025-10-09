import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
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
