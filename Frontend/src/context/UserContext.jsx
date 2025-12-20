//createContext ek global box banata hai jisme aap data store kar sakte ho.
//Aur phir app ke kisi bhi component me aap woh data use kar sakte ho.

import React, { useEffect } from "react"
import { useState } from "react";
import { createContext } from "react";
export const UserDataContext=createContext();
import axios from "axios";


function UserContext({children}){
const serverUrl="https://ai-virtual-assistant-backend-8jqq.onrender.com";
const[userdata,setUserdata]=useState(null);
  const [loading, setloading] = useState(true);
 const [frontendImage, setFrontendImage]=useState(null);
    const [BackendImage, setBackendImage]=useState(null);
const [selectedImage,setselectedImage]=useState(null);




    const handleCurrentUser=async()=>{
  try{
     const result=await axios.get(`${serverUrl}/api/user/current`,
      {withCredentials:true

      })
setUserdata(prev => {
  if (!prev) return result.data;   // 🔥 FIRST LOAD SAFE
  return {
    ...prev,
    ...result.data,
    history: result.data.history ?? prev.history
  };
});

      console.log(result.data)
  }catch(err){
  console.log(err);

  }finally{
    setloading(false);
  }
};


const getGeminiResponse=async (command)=>{
  try{
  const result= await axios.post(`${serverUrl}/api/user/asktoassistant`,
    {command},
    {withCredentials:true,
        headers: { "Content-Type": "application/json" },
    })
            console.log("✅ Gemini response:", result.data);
   
       if (Array.isArray(result.data?.history)) {
      setUserdata(prev => {
  if (!prev) return prev;
  return {
    ...prev,
    history: result.data.history
  };
});
       }
            return result.data
  }catch(err){
  console.log(err)
  
  }
}

useEffect(()=>{
handleCurrentUser()
},[])

const clearHistory = async () => {
  try {
    const res = await axios.delete(
      `${serverUrl}/api/user/history`,
      { withCredentials: true }
    );

    setUserdata(prev => ({
      ...prev,
      history: []
    }));
  } catch (err) {
    console.log("Clear history failed", err);
  }
};




    const value={
   serverUrl,userdata,BackendImage,setUserdata, clearHistory ,setBackendImage
   ,frontendImage, loading,setFrontendImage,selectedImage,setselectedImage
  ,getGeminiResponse}
  
   return (

   <UserDataContext.Provider value={value}>
  {children}
</UserDataContext.Provider>

  )
  
}

export default UserContext;
