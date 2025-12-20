import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
const uploadOnCloudinary=async(filePath)=>{
        cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
   
    });
   try{
     const uploadResult = await cloudinary.uploader
       .upload(filePath)
       fs.unlinkSync(filePath)//Deletes the file from the local server after uploading to Cloudinary.
      return uploadResult.secure_url
   }catch(error){
           console.log(error);
              fs.unlinkSync(filePath)
       }


} 
export default uploadOnCloudinary