import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/user.model.js"

export const getCurrentUser=async(req,res)=>{
    try{
        const userId=req.userId
        console.log(userId);
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({message: "user not found"})
        }
          return res.status(200).json(user)

      
    }catch(error){
        return res.status(400).json({message:"get current user err"})
    }
}
export const updateAssistant=async(req,res)=>{
try{
const {AssistantName,imageUrl}=req.body;
let  AssistantImage;
if(req.file){//agar file exist kiya mtlb hmne new image select ki hai tabhi hm cloudinary pe upload karenge
    AssistantImage=await uploadOnCloudinary(req.file.path)
}else{
    AssistantImage=imageUrl//else hm existing jo image hi 8tho ushke url ko d=save kara denge
}

const user =await User.findByIdAndUpdate(req.userId,{
AssistantName,AssistantImage

},{new:true}).select("-password")//jb hm return karaye toh password n ho
// 
return res.status(200).json(user);

}catch(err){

 return res.status(400).json({message:" updation user err"});
}
}





