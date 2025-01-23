import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, isLoggedIn } from "../../assets/auth";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const [points, setPoints] = useState(0); // Points state
  const [buttonDisabled, setButtonDisabled] = useState(false); // Button state
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      alert("You must log in first");
      navigate("/login");
      return;
    }

    // Retrieve the user object from localStorage and extract points
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && typeof userData.points === "number") {
      setPoints(userData.points);
    }
  }, [navigate]);

  const handleButtonClick = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/click-button",
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      // Increment points in the component state
      const newPoints = points + 10; // Add 10 points for each button click
      setPoints(newPoints);

      // Update points in local storage
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) {
        userData.points = newPoints; // Update the points in userData
        localStorage.setItem("userData", JSON.stringify(userData)); // Save back to local storage
      }

      setButtonDisabled(true); // Disable the button after clicking
      alert("Button clicked! Points updated.");
    } catch (err) {
      // Handle errors from the server
      alert(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("userData");
    localStorage.removeItem("token");

    // Redirect to login page
    alert("You have been logged out.");

    window.location.reload();
    navigate("/login");
  };

  return (
    <div>
      <h1>Main Page</h1>
      <p>Your Points: {points}</p>
      <button onClick={handleButtonClick} disabled={buttonDisabled}>
        Click Me
      </button>
      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>
    </div>
  );
};

export default MainPage;
