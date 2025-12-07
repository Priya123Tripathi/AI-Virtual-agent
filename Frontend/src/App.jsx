import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import SignUp from "./Pages/SignUP";
import SignIn from "./Pages/SignIn";
import Customize from "./Pages/Customize";
import Customize2 from "./Pages/Customize2";
import Home from "./Pages/Home";

import { UserDataContext } from "./context/UserContext";

function App() {
  const { userdata } = useContext(UserDataContext);

  const hasAssistant =
    userdata?.AssistantName?.trim() !== "" &&
    userdata?.AssistantImage?.trim() !== "";

  return (
    <Routes>

      {/* Home */}
      <Route
        path="/"
         element={<Navigate to="/customize" />}
        // element={hasAssistant?<Home />:<Navigate to="/customize"  />}
      />

      {/* Signup */}
      <Route
        path="/signup"
        element={!userdata ? <SignUp />:<Navigate to="/"  />}
      />

      {/* Signin */}
      <Route
        path="/signin"
        element={!userdata?<SignIn />:<Navigate to="/" />}
      />

      {/* Choose image */}
      <Route
        path="/customize"
        element={userdata?<Customize />:<Navigate to="/signin"  />}
      />

      {/* Name + Save */}
      <Route
        path="/customize2"
        element={userdata?<Customize2 />:<Navigate to="/signin" />}
      />

    </Routes>
  );
}

export default App;