import express from "express";
import { generateGeminiResponse } from "../Backend/gemini.js";  // 👈 use your logic directly

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    const reply = await generateGeminiResponse(prompt);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;
