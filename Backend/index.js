import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import geminiResponse from "./gemini.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

//  Middlewares
app.use(express.json());
app.use(cookieParser());

//  Allowed origins (local + deployed)
const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-virtual-agent-front.onrender.com",
  "https://ai-virtual-agent-frontend-km91.onrender.com"
];

//  Single CORS setup (no duplication)
app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / curl etc.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log(" Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.options("/*", cors());

console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Loaded ✅" : " Missing ❌");

//  Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Error middleware 
app.use((err, req, res, next) => {
  console.error("Backend error:", err.message);
  if (err.message.includes("CORS")) {
    return res.status(403).json({ error: "CORS blocked: Origin not allowed" });
  }
  return res.status(500).json({ error: "Internal Server Error" });
});

//  server
app.listen(port, async () => {
  await connectDb();
  console.log(`Server running on port ${port}`);
});
