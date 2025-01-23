import React, { useEffect, useState } from "react";

import "./assets/style/App.css";
import BeforeLogin from "./components/pages/BeforeLogin/BeforeLogin";
import AfterLogin from "./components/pages/AfterLogin/AfterLogin";
import BigScreen from "./components/BigScreen/BigScreen";

const App = () => {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Check user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUser("user");
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
        localStorage.removeItem("userData"); // Remove invalid data
      }
    }
  }, []);

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    <div className="App">
      {user === null && <BeforeLogin />}
      {user === "user" && <AfterLogin />}
    </div>
  ) : (
    <BigScreen />
  );
};

export default App;
