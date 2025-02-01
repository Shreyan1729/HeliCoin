import React from "react";
import { Link, BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { FaAngleLeft } from "react-icons/fa";
import { AiOutlineExclamation } from "react-icons/ai";

import "./components/style/style.css";

import MainPage from "./components/MainPage";
import Profile from "./components/Profile";
import Earn from "./components/Earn";
import Dex from "./components/Dex";
import Invite from "./components/Invite";
import AboutUs from "./components/AboutUs";

const AfterLogin = () => {
  return (
    <>
      <Router>
        <Link className="icon" to={"/"}>
          <FaAngleLeft />
        </Link>

        <Link className="right-icon" to={"/about-us"}>
          <AiOutlineExclamation />
        </Link>

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/dex" element={<Dex />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </Router>
    </>
  );
};

export default AfterLogin;
