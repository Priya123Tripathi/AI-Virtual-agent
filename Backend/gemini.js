import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


const geminiResponse = async (command, assistantName = "Assistant", userName = "Creator") => {
  try {
    
    console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

    const apiUrl =
      process.env.GEMINI_API_URL ||
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY (or GOOGLE_API_KEY)");
    }
  


    const prompt = `
You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object like this:

{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" |
           "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" |
           "instagram-open" | "facebook-open" | "weather-show",
  "userinput": "<original user input> {only remove your name from userinput if it exists} 
                and agar kisi ne google ya youtube pe kuch search karne ko bola hai to 
                userInput me only wo search waala text jaye.",
  "response": "<a short spoken response to read out loud to the user>"
}

---

### Instructions:
- "type": determine the intent of the user.
- "userInput": the original sentence the user spoke.
- "response": a short, voice-friendly reply (for example: "Sure, playing it now.", "Here's what I found.", "Today is Tuesday.", etc.)

---

### Type meanings:
- "general": if it's a factual or informational question. aur agar koi 
aisa question puchhta hai jiska answer tumko pta hai ushko bhi general ki 
category mai rakho bs short answer de dena
- "google-search": if the user wants to search something on Google.
- "youtube-search": if the user wants to search something on YouTube.
- "youtube-play": if the user wants to directly play a video or song.
- "calculator-open": if the user wants to open a calculator.
- "instagram-open": if the user wants to open Instagram.
- "facebook-open": if the user wants to open Facebook.
- "weather-show": if the user wants to know the weather.
- "get-time": if the user asks for the current time.
- "get-date": if the user asks for today’s date.
- "get-day": if the user asks what day it is.
- "get-month": if the user asks for the current month.

---

### Important:
- Use "${userName}" if someone asks who created you.
- Only respond with the JSON object — nothing else.

Now your userInput is: ${command}
`;
    // -------------------------------------------

    const resp = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        timeout: 60000,
      }
    );
        console.log(" Gemini API returned:");
    console.log("Gemini RAW Response:", JSON.stringify(resp.data, null, 2));
    // Safe JSON extraction + parsing
    const safeExtractText = (data) => {
      try {
        return (
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          data?.candidates?.[0]?.content?.[0]?.text ||
          data?.output?.[0]?.content?.[0]?.text ||
          (typeof data === "string" ? data : null)
        );
      } catch (e) {
        return null;
      }
    };

   const text = safeExtractText(resp.data);
if (!text) {
  return { type: "error", response: "Empty response from Gemini." };
}

//  Gemini JSON sometimes comes inside triple backticks like ```json ... ```
let cleanedText = text
  .replace(/^```json/i, "") // remove starting ```json
  .replace(/^```/, "")      // remove starting ```
  .replace(/```$/, "")      // remove ending ```
  .trim();

try {
  return JSON.parse(cleanedText);
} catch (parseErr) {
  console.warn(" Could not parse Gemini JSON, raw text:", cleanedText);
  return {
    type: "error",
    response: "Assistant returned invalid JSON.",
    raw: cleanedText,
  };
}

  } catch (err) {
console.error(" Full Gemini Error Object:", err);
 
  // Handle rate-limit explicitly
  if (err?.response?.status === 429) {
    return {
      type: "error",
      response: "Gemini API rate limit reached. Please wait a few seconds before trying again.",
    };
  }

return {
      type: "error",
      response: err?.message || "Connection issue with Gemini.",
    };
  }
};

export default geminiResponse;