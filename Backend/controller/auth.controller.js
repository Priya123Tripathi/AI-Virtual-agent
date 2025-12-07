import genToken from "../config/token.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";   
//Signup
export const signUp=async(req,res)=>{
try{

    const {name,email,password}=req.body;
   
    const existemail=await User.findOne({email});
    if(existemail){
        return res.status(400).json({message:"email already exist !"})
    }
    if(password.length<6){
        return res.status(400).json({message:"password should be at least 6 character!"});

    }
    const hashedPassword=await bcrypt.hash(password,10);//password hash hoga + 10 more value as a salt use hogi
   const user=await User.create({
    name:name,
    password:hashedPassword,
    email:email

   });
 
   const token= genToken(user._id);

   res.cookie("token",token,{
    httpOnly:true,
    maxAge:7*24*60*60*1000,
      sameSite: "lax", // must be none
  secure: false,    // localhost only
  path: "/"

   })
      // Remove password from output
        const { password: _, ...safeUser } = user._doc;

        return res.status(201).json(safeUser);
   

}catch(err){
return res.status(500).json({message:`sign up error ${err}`});
}
}

 //LOGIN
export const Login=async(req,res)=>{
try{

    const {email,password}=req.body;
   
    const userexist=await User.findOne({email});
    if(!userexist){
        return res.status(400).json({message:"email does not exist !"})
    }
   const isMatch=await bcrypt.compare(password,userexist.password)
if(!isMatch){
    return res.status(400).json({message:"Incorrect Password"});
}

   const token= genToken(userexist._id);

   //Store token cookie
   res.cookie("token",token,{
    httpOnly:true,
    maxAge:7*24*60*60*1000,
     sameSite: "lax", // ✅ must be none for cross-origin
  secure: false,    // ✅ false for localhost
  path: "/"
   })
       // Remove password from output
        const { password: _, ...safeUser } = userexist._doc;

        return res.status(200).json(safeUser);
   

}catch(err){
return res.status(500).json({message:`login error ${err}`});
}
} //LOgout

export const logOut=async(req,res)=>{
    try{
     res.clearCookie("token");
     return res.status(200).json({message:"logout successfully"})
    }catch(err){
   console.log(err);
    }
}
