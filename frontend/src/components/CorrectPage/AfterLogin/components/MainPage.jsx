import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, isLoggedIn, zoomIn } from "../../../../assets/auth";
import { Link, useNavigate } from "react-router-dom";
import { dex, earn, home, invite, logo, profile } from "./Images/image";
import { motion } from "framer-motion";

const MainPage = () => {
  const [points, setPoints] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const navigate = useNavigate();
  let timer;

  // This effect runs when the component mounts
  useEffect(() => {
    if (!isLoggedIn()) {
      alert("You must log in first");
      navigate("/login");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    setPoints(userData.points || 0);

    const lastClaimTime = localStorage.getItem("lastClaimTime");
    if (lastClaimTime) {
      updateButtonState(new Date(lastClaimTime));
    }
  }, [navigate]);

  // Function to update the button state based on last claim time
  const updateButtonState = (lastClaimTime) => {
    const now = new Date();
    const isToday =
      lastClaimTime.toISOString().split("T")[0] ===
      now.toISOString().split("T")[0];

    if (isToday) {
      setButtonDisabled(true);
      calculateTimeLeft(lastClaimTime); // Start timer calculation
    } else {
      setButtonDisabled(false);
    }
  };

  // Function to calculate the time left until midnight
  const calculateTimeLeft = (lastClaimTime) => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set time to the next midnight
    const timeDiff = midnight - now;

    if (timeDiff > 0) {
      // Calculate hours, minutes, and seconds
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000); // Get the remaining seconds

      // Format hours, minutes, and seconds with leading zeros
      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

      // Update timeLeft state with formatted time
      setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);

      // Update the time every second (instead of minute) to reflect seconds accurately
      timer = setTimeout(() => calculateTimeLeft(lastClaimTime), 1000);
    } else {
      setButtonDisabled(false); // Re-enable the button after midnight
      setTimeLeft(""); // Reset the time display
    }
  };

  // Function to clear the timer when component unmounts
  const clearTimer = () => {
    clearTimeout(timer);
  };

  // Ensure the timer is cleared on cleanup
  useEffect(() => {
    return () => clearTimer();
  }, []);

  const handleButtonClick = async () => {
    try {
      setButtonDisabled(true); // Disable the button immediately

      const response = await axios.post(
        "http://localhost:5000/click-button",
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      if (response.status === 200) {
        const newPoints = points + 10;
        setPoints(newPoints);

        const now = new Date();
        localStorage.setItem("lastClaimTime", now.toISOString());
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("userData")),
            points: newPoints,
          })
        );

        updateButtonState(now); // Update button state for next claim

        alert("✅ Reward claimed! Your points have been updated.");
      }
    } catch (err) {
      setButtonDisabled(false); // Re-enable button on error
      alert(
        err.response?.data?.message || "❌ An error occurred. Please try again."
      );
    }
  };

  const userId = JSON.parse(localStorage.getItem("userData"))?._id;

  return (
    <motion.main
      variants={zoomIn(0.1, 0.2)}
      initial="hidden"
      whileInView={"show"}
      className="Home"
    >
      <div className="top">
        <p>Your approximate share</p>
        <div className="top-logo">
          <img src={logo} alt="logo" />
          {points}
        </div>
      </div>

      <div className="middle">
        <div className="left">
          <Link to={"/"}>
            <img src={home} alt="home" />
            Home
          </Link>
          <Link to={`/earn?profile=${userId}`}>
            <img src={earn} alt="earn" />
            Earn
          </Link>
        </div>

        <div className="middle-logo">
          <div className="up-circle"></div>
          <div className="middle-circle"></div>
          <img src={logo} alt="logo" />
        </div>

        <div className="right">
          <Link to={`/profile?profile=${userId}`}>
            <img src={profile} alt="home" />
            Profile
          </Link>
          <Link to={"/dex"}>
            <img src={dex} alt="earn" />
            Dex
          </Link>
        </div>
      </div>

      <div className="claim-div">
        <button
          className={`claim ${buttonDisabled && "disable"}`}
          onClick={handleButtonClick}
          disabled={buttonDisabled}
        >
          Claim Reward
        </button>

        <p className={`text ${!buttonDisabled && "active"}`}>
          {!buttonDisabled
            ? `Get your award`
            : ` Next reward after ${timeLeft}`}
        </p>
      </div>

      <div className="buttons">
        <div className="row">
          <Link to={"/invite"}>
            <img src={invite} alt="" />
            Invite
          </Link>

          <button>{`Participate in the waitlist >`}</button>
        </div>

        <div className="row">
          <Link to={"/invite"} className="none">
            <img src={invite} alt="" />
            Invite
          </Link>

          <button>{`Check the waitlist >`}</button>
        </div>
      </div>
    </motion.main>
  );
};

export default MainPage;
