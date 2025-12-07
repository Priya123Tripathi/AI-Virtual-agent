
import express from "express";
import { getCurrentUser, updateAssistant } from "../controller/user.controllers.js";

import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
const userRouter=express.Router();

userRouter.get("/current",isAuth,getCurrentUser);
userRouter.post("/update",isAuth,upload.single("AssistantImage"),updateAssistant)
export default userRouter;