
import express from "express";
import { getCurrentUser,clearHistory,askToAssistant, updateAssistant } from "../controller/user.controllers.js";

import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
const userRouter=express.Router();

userRouter.get("/current",isAuth,getCurrentUser);
userRouter.post("/update",isAuth,upload.single("AssistantImage"),updateAssistant)

userRouter.post("/asktoassistant",isAuth,askToAssistant)
userRouter.delete("/history", isAuth, clearHistory);

export default userRouter;

