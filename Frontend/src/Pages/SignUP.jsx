import React, { useState } from "react";
import Bg from "../assets/authBg.png"
import { FaEye } from "react-icons/fa";
import { useContext } from "react";
import { FaEyeSlash } from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import { UserDataContext } from "../context/UserContext.jsx";
import axios from "axios";

  function SignUp() { 
    const [showPassword,setShowPassword]=useState(false);
     const {serverUrl,userdata,setUserdata}=useContext(UserDataContext);
    const navigate=useNavigate();
    const[name,setName]=useState(""); 
    const[email,setEmail]=useState(""); 
    const[password,setPassword]=useState(""); 
    const[err,seterr]=useState("");
       const[loading,setloading]=useState(false);

    const handleSignUp=async(e)=>{
      e.preventDefault();
      seterr("");
      setloading(true)
   try{
    let result=await axios.post(`${serverUrl}/api/auth/signup`,{
    name,email,password,
        
   },{withCredentials:true});//so that token store easily in cookie
     setUserdata(result.data)
  setloading(false)
  navigate("/customize")
  }catch(err){
    console.log(err);
          setloading(false)
 seterr(err.response?.data?.message || "Something went wrong. Please try again.");
      setUserdata(null)
    
   }
    }
    return(
    
        <div className='w-full h-[100vh] bg-cover flex justify-center items-center'
        style={{backgroundImage:`url(${Bg})`,
              backgroundSize: "cover",
              height: "100vh", 
                width: "100vw",
             backgroundPosition: "fixed",
        }}>
          <form className='w-[90%] h-[500px] max-w-[500px] bg-[#00000062]
          backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center
          gap-[20px] px-[20px]' onSubmit={handleSignUp}>

         <h1 className='text-white text-[30px] font-semibold mb-[30px]'>
          Register to 
          <span className='text-blue-400'>Virtual Assistant</span>
        </h1>

      <input type="text" placeholder=" Enter your name" className='w-full h-[60px] outline-none border-2
     border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full 
     text-[18px]' required onChange={(event)=>setName(event.target.value)} value={name}/>

       <input type="text" placeholder="  Email" className='w-full h-[60px] outline-none border-2
     border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full 
     text-[18px]' required onChange={(event)=>setEmail(event.target.value)} value={email}/>
    <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full 
     text-[18px] relative'>

    <input type={showPassword?"text":"password"} 
    placeholder='password' 
    className="w-full h-full rounded-full outline-none bg-transparent
    placeholder-gray-300 px-[20px] py-[10px]" autoComplete="current-password"
    required onChange={(event)=>setPassword(event.target.value)} value={password}/>
 
{!showPassword && <FaEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px]
  text-[white] cursor-pointer' onClick={()=>setShowPassword(true)}/>}
{showPassword && <FaEyeSlash className='absolute top-[18px] right-[20px] w-[25px] h-[25px]
  text-[white] cursor-pointer' onClick={()=>setShowPassword(false)}/>
  }
</div>
{err.length>0 && <p className="text-red-500">*{err}</p> }
<button className='min-w-[150px] h-[60px] mt-[30px] text-black-semibold
 bg-white rounded-full text-[19px]' disabled={loading}>{loading?"loading....":"SignUp"}</button>
  <p className='text-[white] text-[18px] cursor-pointer'
   onClick={()=>navigate('/signin')}>Already have an account?<span className="text-blue-400">Sign In</span></p>
           </form>
        </div>
    );
}

export default SignUp;