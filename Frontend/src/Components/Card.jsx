import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

function Card({ image }) {
  const {
    serverUrl,
    userdata,
    setUserdata,
    BackendImage,
    setBakendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setselectedImage
  } = useContext(UserDataContext);

  return (
    <div
      className={`w-[80px] h-[140px] lg:w-[150px] lg:h-[250px]
        bg-[#030326] border-2 border-[#0000ff66]
        rounded-2xl overflow-hidden
        hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4
        hover:border-[white]
        ${selectedImage === image ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}
      `}
      onClick={() =>{
            setselectedImage(image)
         setBakendImage(null)
         setFrontendImage(null)
      }}
    >
      {/* //The image fills the entire card. */}
      <img src={image} className="h-full object-cover" />
    </div>
  );
}

export default Card;
