import React, { useContext, useEffect, useState,useRef, useCallback } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import axios from "axios";
import aiImg from "../assets/Ai.gif";
import { RxCross2 } from "react-icons/rx";
import userImg from "../assets/user.gif";
import { AiOutlineMenuFold } from "react-icons/ai";

function Home() {
 
  const { userdata, serverUrl,clearHistory, setUserdata, getGeminiResponse } =
    useContext(UserDataContext);
  const navigate = useNavigate();
const[userText,setUserText]=useState("");
const[AiText,setAiText]=useState("");
const [menuOpen, setMenuOpen] = useState(false);

const [speaker, setSpeaker] = useState("ai"); 
 console.log("HOME USERDATA ", userdata);
  const hasAssistant = Boolean(
    userdata?.AssistantImage || userdata?.AssistantName
  );
   const isListeningRef = useRef(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
const voicesRef = useRef([]);

  const isVoiceActiveRef = useRef(false);
  const isProcessingRef = useRef(false);

  useEffect(() => {
  const loadVoices = () => {
    voicesRef.current = window.speechSynthesis.getVoices();
  };

  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}, []);

  /* ===================== SPEAK (Hindi + English) ===================== */
const speak = useCallback((text) => {
  return new Promise((resolve) => {
    if (!text || !synthRef.current) return resolve();

    const synth = synthRef.current;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);

    // Force English Google voice (best quality)
    const voice =
      voicesRef.current.find(v =>
        v.lang === "en-IN" && v.name.toLowerCase().includes("google")
      ) ||
      voicesRef.current.find(v => v.lang.startsWith("en"));

    if (voice) utter.voice = voice;

    utter.lang = "en-IN";   // Hinglish magic
    utter.rate = 0.95;
    utter.pitch = 1;

    utter.onend = resolve;
    utter.onerror = resolve;

    synth.speak(utter);
  });
}, []);


  /* ===================== COMMAND HANDLER ===================== */
  const handleCommand = async (data, lang) => {
    const { type, userInput = "", response = "" } = data;
    let url = null;

    if (type === "google-search") {
      url = `https://www.google.com/search?q=${encodeURIComponent(userInput)}`;
    } else if (type === "calculator-open") {
      url = "https://www.google.com/search?q=calculator";
    } else if (type === "instagram-open") {
      url = "https://www.instagram.com/";
    } else if (type === "facebook-open") {
      url = "https://www.facebook.com/";
    } else if (type === "weather-show") {
      url = "https://www.google.com/search?q=weather";
    } else if (type === "youtube-search" || type === "youtube_play") {
      url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        userInput
      )}`;
    }

    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    await speak(response, lang);
  };



useEffect(() => {
  const interval = setInterval(() => {
    if (
      isVoiceActiveRef.current &&      // voice mode ON
      !isProcessingRef.current &&      // assistant bol nahi raha
      !isListeningRef.current &&       // mic actually OFF hai
      recognitionRef.current
    ) {
      try {
        recognitionRef.current.start();
        // console.log(" mic restarted by 10-sec checker");
      } catch (_) {}
    }
  }, 10000); //  every 10 sec

  return () => clearInterval(interval);
}, []);



  /*  SPEECH RECOGNITION  */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = async (e) => {
      if (!isVoiceActiveRef.current || isProcessingRef.current) return;

      const transcript =
        e.results[e.results.length - 1][0].transcript.trim();

      const assistantName = userdata?.AssistantName?.toLowerCase();
      if (!assistantName) return;
      if (!transcript.toLowerCase().includes(assistantName)) return;
   setUserText(transcript);
   setAiText("");
   setSpeaker("user"); 
      isProcessingRef.current = true;
      recognition.stop();


      const isHindi = /[ऀ-ॿ]/.test(transcript);
      const lang = isHindi ? "hi" : "en";

      let data;
      try {
        data = await getGeminiResponse(transcript);
      } catch (_) {}

      if (data?.type === "error"){
        await speak(
          lang === "hi"
            ? "Abhi server busy hai, thodi der baad try karo."
            : "Server is busy. Please try again.",
          lang
        );
      } else if (data?.response) {
      setSpeaker("ai"); 
  
      await handleCommand(data, lang);
        setUserText("");
        setAiText(data.response);
     
      }

      isProcessingRef.current = false;
    }
      

    
      recognition.onstart = () => {
  isListeningRef.current = true;
};

recognition.onend = () => {
  isListeningRef.current = false;

}   
  


   recognition.onerror = () => {
  isListeningRef.current = false;
  };

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [userdata?.AssistantName, getGeminiResponse, speak]);

  /*ACTIVATE VOICE */
  const handleActivateVoice = async () => {
    if (isVoiceActiveRef.current) return;

    isVoiceActiveRef.current = true;
    await speak("Voice activated. hello.. how can i help you.... i am a virtual assistant designed by priya", "hi");

    try {
      recognitionRef.current.start();
    } catch (_) {}
  };

  /* LOGOUT  */
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
    } catch (_) {}
    setUserdata(null);
    navigate("/signin");
  };

 
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#020236] via-[#050018] to-black flex items-center justify-center px-4">
   
    
      <div className="max-w-3xl w-full flex flex-col items-center gap-8">
  
      <AiOutlineMenuFold className="lg:hidden cursor-pointer text-white absolute top-[20px] right-[20px] w-[25px]"
       onClick={() => setMenuOpen(true)} />
        {menuOpen && (
<div className="fixed inset-0 z-[9999] bg-[#00000053] backdrop-blur-lg px-[20px] flex flex-col gap-[20px] items-center">


          <RxCross2
            className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
            onClick={() => setMenuOpen(false)}/>
          <button
            className="min-w-[125px] h-[50px] mt-[30px] text-black font-semibold bg-white rounded-full flex justify-center items-center  text-[19px]"
            onClick={handleLogout}
          >
            Log Out
          </button>
    <button
  onClick={clearHistory}
  className="bg-red-500 text-white px-4 py-1 rounded-full"
>
  Clear History
</button>


          <div className="w-full h-[2px] bg-gray-400 mt-2px"></div>
          <h1 className="text-white font-bold text-[19px]">History-</h1>


<div className="w-full max-w-[500px] max-h-[60vh] overflow-y-auto flex flex-col gap-[12px] bg-black/30 rounded-lg p-3">

             {Array.isArray(userdata?.history) && userdata.history.length > 0 ? (
  userdata.history.map((his, index) => (
    <span key={index} className="text-white text-[20px] break-words ">
      {his}
    </span>
  ))
) : (
  <span className="text-white text-sm">No history yet</span>
)}

          </div>
        </div>
            )}
      

 <button
            className="hidden lg:flex absolute lg:top-6 lg:right-6 top-[10px] right-[10px] min-w-[100px] h-[40px] text-[15px] bg-white text-black font-semibold rounded-full flex justify-center items-center"
            onClick={handleLogout}
          >
            Log Out
          </button>
  
        {/* Header */}
        <div className="text-center space-y-2">   
          <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-blue-300/80">
            AI Virtual Assistant
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            Welcome back,{" "}
            <span className="text-blue-300">
              {userdata?.name || "Creator"}
            </span>
          </h1>
        </div>

        {/* Assistant Card */}
        <div className="relative w-[320px] md:w-[380px] rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 flex flex-col items-center gap-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-blue-400 flex items-center justify-center">
            {userdata?.AssistantImage ? (
              <img
                src={userdata.AssistantImage}
                alt="Assistant"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-white font-semibold">
                {userdata?.AssistantName?.[0] || "A"}
              </span>
            )}
          </div>

          <h2 className="text-xl font-semibold text-white">
            {userdata?.AssistantName || "Assistant"}
          </h2>

          <button
            onClick={handleActivateVoice}
            className="min-w-[150px] h-[50px] text-black font-semibold bg-yellow-400 rounded-full"
          >
            Activate Voice
          </button>

          <button
            onClick={() => navigate("/customize")}
            className="mt-2 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500 text-white"
          >
            <FiEdit3 />
            {hasAssistant ? "Customize Assistant" : "Create Assistant"}
          </button>
        </div>

        {/* ===== Conversation Text ===== */}
<div className="w-full max-w-[500px] flex flex-col gap-3 text-white text-[18px]">

  {userText && (
    <div className="self-end bg-blue-600/80 px-4 py-2 rounded-2xl max-w-[90%]">
      {userText}
    </div>
  )}

  {AiText && (
    <div className="self-start bg-white/20 px-4 py-2 rounded-2xl max-w-[90%]">
      {AiText}
    </div>
  )}

</div>

        {speaker === "ai" && <img src={aiImg} alt="AI" className="w-[200px]" />}
{speaker === "user" && <img src={userImg} alt="User" className="w-[200px]" />}

      </div>
 
  
    </div>
  );
}

export default Home;
