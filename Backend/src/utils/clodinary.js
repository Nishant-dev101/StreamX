import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from "fs"


    // Configuration
    cloudinary.config({ 
        cloud_name : process.env.CLOUD_NAME,
        api_key : process.env.API_KEY,
        api_secret : process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
    })
    

    const uploadOnCloudinary = async (localFilePath) => {
        console.log("cloudinary entry")
      
        
        try {
             if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
         })

         console.log("file uploaded", response.url );
       
         
         fs.unlinkSync(localFilePath)
         return response; 
         
        } catch (error) {
            console.log("Error at cloudinary", error);
            
            fs.unlinkSync(localFilePath)
            return null
        }
    }


    export default uploadOnCloudinary;
