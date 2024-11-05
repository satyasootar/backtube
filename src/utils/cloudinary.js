import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath){
            return null
        }
        const uploadResult = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        });
        console.log("File is uploaded on cloudinary successfully,", uploadResult.url);
        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localFilePath);  //Remove the locally saved temporary file as the upload operations got failed 
        console.log("The file has been deleted from the local server")
        return null
    }
}
