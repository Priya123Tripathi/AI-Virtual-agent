import { signUp, 
    Login,
     logOut,  
     sendOtp,
  resetPassword } from "../controller/auth.controller.js";
import express from "express";
const authRouter=express.Router();
console.log("auth.routes.js loaded");

authRouter.post("/signup",signUp);
authRouter.post("/signin",Login);
authRouter.post("/logout",logOut);


//Forgot Password APIs

authRouter.post("/send-otp", sendOtp);
authRouter.post("/reset-password", resetPassword);


export default authRouter;