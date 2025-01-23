import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../../assets/auth";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/login", form);

      // Set token and store user data
      setToken(data.token);
      const userData = {
        name: data.user.name,
        email: data.user.email,
        points: data.user.points,
      };
      localStorage.setItem("userData", JSON.stringify(userData));

      // Navigate to home after successful login
      alert("Login successful!");
      navigate("/", { replace: true }); // Use replace to avoid adding a new entry in the history stack
      window.location.reload();
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
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
