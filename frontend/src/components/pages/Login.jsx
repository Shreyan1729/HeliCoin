import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "./../../assets/auth";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the server
      const { data } = await axios.post("http://localhost:5000/login", form);

      // Save token in local storage
      setToken(data.token);

      // Save user data (excluding password) in local storage
      const userData = {
        name: data.user.name,
        email: data.user.email,
        points: data.user.points,
      };
      localStorage.setItem("userData", JSON.stringify(userData));

      alert("Login successful! Redirecting...");
      window.location.reload();

      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
