import { MdOutlineDriveFolderUpload } from "react-icons/md";
import Card from "../Components/Card";
import React, { useContext, useRef,useEffect } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/authBg.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import image8 from '../assets/image8.png'

function Customize() {

  const navigate = useNavigate();

  const {
    serverUrl,
    userdata,
    setUserdata,
    BackendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setselectedImage,
    loading
  } = useContext(UserDataContext);

  const inputImage = useRef();

 
    useEffect(() => {
    if (!loading && !userdata) {
      navigate("/login", { replace: true });
    }
  }, [loading, userdata, navigate]);
 

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
     <div className='w-full min-h-screen bg-gradient-to-t from-black to-[#020236] 
flex flex-col items-center justify-center px-4 py-8'>

   <IoMdArrowRoundBack className="absolute top-[30px]
           left-[30px] text-white w-[25px] h-[25px] cursor-pointer" onClick={()=>{
             console.log("⬅️ Back arrow clicked"); 
  navigate("/")  }}/>

      <h1 className="text-white text-2xl sm:text-3xl md:text-4xl text-center mb-8">
        Select your <span className="text-red">Assistant</span>
      </h1>

<div className="w-full max-w-5xl grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 place-items-center">
    
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <Card image={image8} />

        {/* Upload Card */}
        <div
          className="w-[80px] h-[120px] 
sm:w-[100px] sm:h-[150px] 
md:w-[120px] md:h-[180px] 
lg:w-[150px] lg:h-[230px]
bg-[#030326] border-2 border-[#0000ff66]
rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950
cursor-pointer hover:border-4 hover:border-white
flex justify-center items-center"
          onClick={() => {
            inputImage.current.click();
            setselectedImage("input");
          }}
        >
          {!frontendImage && (
            <MdOutlineDriveFolderUpload className="text-white w-[25px] h-[25px]" />
          )}

          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
   {(BackendImage || selectedImage) && (
        <button
          className='min-w-[150px] h-[60px] mt-[30px] bg-white 
          text-black font-semibold rounded-full text-[19px]'
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize;
