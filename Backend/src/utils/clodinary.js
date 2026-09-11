import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, 
});

const uploadOnCloudinary = async (localFilePath) => {
  console.log("cloudinary entry");

  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("file uploaded", response.url);

    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return response
    
  } catch (error) {
    console.log("Error at cloudinary", error);

    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};




export { uploadOnCloudinary };
