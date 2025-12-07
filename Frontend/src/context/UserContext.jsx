//createContext ek global box banata hai jisme aap data store kar sakte ho.
//Aur phir app ke kisi bhi component me aap woh data use kar sakte ho.

import React, { useEffect } from "react"
import { useState } from "react";
import { createContext } from "react";
export const UserDataContext=createContext();
import axios from "axios";


function UserContext({children}){
const serverUrl="http://localhost:8000";
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
      setUserdata(result.data)
      console.log(result.data)
  }catch(err){
  console.log(err);
  setUserdata(null);
  }finally{
    setloading(false);
  }
};

useEffect(()=>{
handleCurrentUser()
},[])




    const value={
   serverUrl,userdata,setUserdata,BackendImage, setBackendImage
   ,frontendImage, loading,setFrontendImage,selectedImage,setselectedImage}
  return (

   <UserDataContext.Provider value={value}>
  {children}
</UserDataContext.Provider>

  )
  
}

export default UserContext;
