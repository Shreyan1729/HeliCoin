import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { signUpGif } from "./../../../assets/image";

import { motion } from "framer-motion";
import { zoomIn } from "../../../assets/auth";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", form);
      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      alert("Error during signup");
    }
  };

  return (
    <motion.section
      variants={zoomIn(0, 0.2)}
      initial="hidden"
      whileInView={"show"}
      className="Signup"
    >
      <img src={signUpGif} alt="" className="signupGIF" />

      <h1>Get ready for flight !</h1>
      <p>Let the license made by your hands</p>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
      </form>

      <p className="login-text">
        Do you have an account. <br /> Then <Link to={"/login"}>Login</Link>.
      </p>
    </motion.section>
  );
};

export default SignUp;
