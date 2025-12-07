import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

function Home() {
  const { userdata } = useContext(UserDataContext);

  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-gradient-to-t from-black to-[#020236] text-white">
      <h1 className="text-[35px] font-bold mb-4">
        Welcome back, {userdata?.name || "User"}! 👋
      </h1>

      {userdata?.AssistantImage && (
        <img
          src={userdata.AssistantImage}
          alt="Assistant"
          className="w-[200px] h-[200px] rounded-full border-4 border-white shadow-lg"
        />
      )}

      {userdata?.AssistantName && (
        <h2 className="mt-4 text-[24px] text-blue-300">
          Your Assistant:{" "}
          <span className="text-white">{userdata.AssistantName}</span>
        </h2>
      )}
    </div>
  );
}

export default Home;
