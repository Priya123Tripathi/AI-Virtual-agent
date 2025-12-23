import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../model/user.model.js";
import moment from "moment"; // npm i moment


export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
   
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ message: "get current user err" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { AssistantName, imageUrl } = req.body;
    let AssistantImage;
    if (req.file) {
      // agar file exist karti hai to cloud pe upload karo
      AssistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      AssistantImage = imageUrl; // otherwise existing url use karo
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { AssistantName, AssistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (err) {
    console.error("updateAssistant err:", err);
    return res.status(500).json({ message: "updation user err" });
  }
};
export const askToAssistant = async (req, res) => {
  console.log(" askToAssistant route hit — command received:", req.body.command);

  try {
    const { command } = req.body;

    if (!command || typeof command !== "string" || command.trim() === "") {
      return res.status(400).json({ response: "Command missing" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }

    // Rate Limit Check
    if (user.lastGeminiCall && Date.now() - user.lastGeminiCall < 4000) {
      return res.status(200).json({
        type: "error",
        response: "Please wait a few seconds before talking again.",
        history: user.history || [],
      });
    }

    user.lastGeminiCall = Date.now();
    if (!Array.isArray(user.history)) user.history = [];
    user.history.push(command);
    await user.save();

    const userName = user.name || "Creator";
    const assistantName = user.AssistantName || "Assistant";

    // Call Gemini
    const result = await geminiResponse(command, assistantName, userName);

    if (!result) {
      return res.status(502).json({ response: "No response from AI." });
    }


    let gemResult;
    try {
      if (typeof result === "object") {
        gemResult = result;
      } else {
        
        const cleanJson = result.replace(/```json|```/g, "").trim();
        gemResult = JSON.parse(cleanJson);
      }
    } catch (parseErr) {
      console.error("JSON Parse Error. Raw result:", result);
      return res.status(200).json({
        type: "general",
        response: typeof result === "string" ? result : "I encountered a formatting error.",
        history: user.history
      });
    }

    const userInput = gemResult.userinput ?? gemResult.userInput ?? "";
    const type = gemResult.type;

   
    const istTime = moment().add(5, 'hours').add(30, 'minutes');

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput,
          response: `Today's date is ${istTime.format("DD MMMM YYYY")}`,
          history: user.history,
        });

      case "get-time":
        return res.json({
          type,
          userInput,
          response: `The current time is ${istTime.format("hh:mm A")}`,
          history: user.history,
        });

      default:
        return res.json({
          type: type || "general",
          userInput,
          response: gemResult.response ?? "I'm not sure how to help with that.",
          history: user.history,
        });
    }
  } catch (err) {
    console.error("askToAssistant error:", err);
    return res.status(500).json({ response: "Internal Server Error" });
  }
};
// HISTORY CLEAR CONTROLLER
export const clearHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.history = [];          // history empty
    await user.save();

    return res.status(200).json({
      success: true,
      history: [],
      message: "History cleared successfully"
    });
  } catch (error) {
    console.error("clearHistory error:", error);
    return res.status(500).json({ message: "Failed to clear history" });
  }
};
