import React, { useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useContext} from "react";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import {useNavigate} from "react-router-dom";


function Customize2(){
    const navigate=useNavigate();
    const {userdata,BackendImage,selectedImage,serverUrl,setUserdata}=useContext(UserDataContext);
    const [assistantName,setAssistantName]=useState(userdata?.AssistantName||"");
    const [loading, setloading]=useState(false);

    const handleUpdateAssistant = async () => {
    setloading(true)

    try {
        const formData = new FormData();
        formData.append("AssistantName", assistantName);

        //  If user uploaded new image → send file
        if (BackendImage instanceof File) {
            formData.append("AssistantImage", BackendImage);
        } 
        //  If user selected card → send old cloudinary URL
        else {
            formData.append("imageUrl", selectedImage)
        }

        const result = await axios.post(
            `${serverUrl}/api/user/update`,
            formData,
            { withCredentials: true }
        );
   setloading(false)
        console.log(" Backend Response:", result.data);
        setUserdata(result.data);
        navigate("/")

    } catch (err) {
        console.log(" ERROR:", err);

        if (err.response) {
            console.log(" Backend Error:", err.response.data);
        }
    }
};

 

    return(
          <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#020236] 
      flex justify-center items-center flex-col p-[20px] relative'>

        <IoMdArrowRoundBack className="absolute top-[30px]
         left-[30px] text-white w-[25px] h-[25px] cursor-pointer" onClick={()=>{
navigate("/customize")  }}/>
      <h1 className="text-white text-[30px]
       text-center mb-[40px]">Enter your
     <span className="text-blue-200">Asistant Name</span></h1>
      
       <input type="text" placeholder='eg:Mini' className='w-[550px] h-[60px] outline-none border-2
     border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full 
     text-[18px]' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>
       
     <button
          className='min-w-[300px] h-[60px] mt-[30px] bg-white 
          text-black font-semibold rounded-full text-[19px]'
          disabled={loading}
          onClick={()=>{
            handleUpdateAssistant()
          }}>

       {!loading?"Finally Create Your Assistant":"loading"}
        </button>

      
      
        </div>
    )
}

export default Customize2