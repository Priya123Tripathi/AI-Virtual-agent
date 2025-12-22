import genToken from "../config/token.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs"; 
import sendEmail from "../config/sendEmail.js";  
const isProd = process.env.NODE_ENV === "production";


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
      sameSite: isProd ? "None" : "Lax",
  secure: isProd,   
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
     sameSite: isProd ? "None" : "Lax", 
  secure: isProd,   
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
     res.clearCookie("token", {
  sameSite: isProd ? "None" : "Lax",
  secure:  isProd,
  path: "/"
});
     return res.status(200).json({message:"logout successfully"})
    }catch(err){
   console.log(err);
    }
}


// SEND OTP
export const sendOtp = async (req, res) => {
    console.log("sendOtp API HIT");
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetOtp = otp;
    user.otpExpire = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

   try {
  await sendEmail(email, "Your OTP for Password Reset", `Your OTP is ${otp}`);
} catch (mailErr) {
  return res.status(500).json({
    msg: "Email service temporarily down, try again later"
  });
}

    console.log(" OTP sent to:", email);

    res.json({ msg: "OTP sent successfully! Check your Gmail inbox." });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};
// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
      
    const { email, otp, password } = req.body;

    if (password.length < 6) {
  return res.status(400).json({ msg: "Password too short" });
}

    // Step 1: Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Step 2: Check OTP expiration
    if (!user.otpExpire || Date.now() > user.otpExpire) {
      return res.status(400).json({ msg: "OTP expired. Please request a new one." });
    }

    //  Step 3: Compare OTP safely (string vs number)
    if (String(user.resetOtp) !== String(otp)) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }


    // Step 4: Hash and save new password
    user.password = await bcrypt.hash(password, 10);
    user.resetOtp = undefined;
    user.otpExpire = undefined;
    await user.save();

    console.log(" Password updated for:", email);
    res.json({ msg: "Password updated successfully!" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
