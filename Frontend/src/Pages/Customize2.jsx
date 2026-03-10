import React, { useState, useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Customize2() {

  const navigate = useNavigate();

  const {
    userdata,
    BackendImage,
    selectedImage,
    serverUrl,
    setUserdata
  } = useContext(UserDataContext);

  const [assistantName, setAssistantName] = useState(userdata?.AssistantName || "");
  const [loading, setloading] = useState(false);

  const handleUpdateAssistant = async () => {

    setloading(true);

    try {

      const formData = new FormData();
      formData.append("AssistantName", assistantName);

      // if user uploaded image
      if (BackendImage instanceof File) {
        formData.append("AssistantImage", BackendImage);
      }

      // if card image selected
      else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );

      setloading(false);

      console.log("Backend Response:", result.data);

      setUserdata(result.data);

      navigate("/");

    } catch (err) {

      console.log("ERROR:", err);

      if (err.response) {
        console.log("Backend Error:", err.response.data);
      }

      setloading(false);
    }
  };

  return (

    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#020236] flex flex-col items-center justify-center px-4 py-8">

      {/* Back Button */}
      <IoMdArrowRoundBack
        className="absolute top-4 left-4 md:top-6 md:left-6 text-white w-6 h-6 cursor-pointer"
        onClick={() => navigate("/customize")}
      />

      {/* Title */}
      <h1 className="text-white text-2xl sm:text-3xl md:text-4xl text-center mb-8">
        Enter your <span className="text-blue-200">Assistant Name</span>
      </h1>

      {/* Input */}
      <input
        type="text"
        placeholder="eg: Mini"
        required
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
        className="w-full max-w-md h-[50px] sm:h-[55px] md:h-[60px]
        outline-none border-2 border-white
        bg-transparent text-white placeholder-gray-300
        px-5 rounded-full text-[16px] sm:text-[18px]"
      />

      {/* Button */}
      <button
        disabled={loading}
        onClick={handleUpdateAssistant}
        className="w-full max-w-md h-[50px] sm:h-[55px] md:h-[60px]
        mt-8 bg-white text-black font-semibold rounded-full
        text-[16px] sm:text-[18px] disabled:opacity-60"
      >
        {!loading ? "Finally Create Your Assistant" : "Loading..."}
      </button>

    </div>
  );
}

export default Customize2;