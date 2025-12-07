import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app =express();
const port=process.env.PORT;

app.use(cookieParser());

app.use(cors({
 origin:  "http://localhost:5173",
 credentials:true
}
   
));

app.use(express.json());


app.use((req, res, next) => {
  console.log("Raw headers:", req.headers.cookie); // shows exactly what the browser sends
  console.log("Parsed cookies:", req.cookies);
  next();
});


app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);



app.listen(port,()=>{
    connectDb();
    console.log("server is listening on port");
});