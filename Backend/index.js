import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import geminiResponse from "./gemini.js";

const app =express();
const port=process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
 origin:  "https://ai-virtual-agent-f.onrender.com",
 credentials:true
}
   
));
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Loaded " : " Missing");





 app.use((err, req, res, next) => {
  console.error('Backend error:', err);
  res.status(500).json({ error: err.message });
  next();
});


app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);




app.listen(port,()=>{
    connectDb();
    console.log(`server is listening on port:${port}`);
});
