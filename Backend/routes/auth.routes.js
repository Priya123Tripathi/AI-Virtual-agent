import { signUp, Login, logOut } from "../controller/auth.controller.js";
import express from "express";
const authRouter=express.Router();
authRouter.post("/signup",signUp);
authRouter.post("/signin",Login);
authRouter.post("/logout",logOut);
export default authRouter;