import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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

      // Store token
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);

        // Store user data including lastClickTime
        const userData = {
          name: data.user.name,
          email: data.user.email,
          points: data.user.points,
          lastClickTime: data.user.lastClickTime, // Storing lastClickTime
        };
        localStorage.setItem("userData", JSON.stringify(userData));

        // Navigate to home after successful login
        alert("Login successful!");
        navigate("/", { replace: true });
        window.location.reload();
      } else {
        alert("Login failed! No token received.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials");
    }
  };

  return (
    <section className="Signup">
      <h1>Get ready for flight !</h1>
      <p>Let the license made by your hands</p>

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

      <p className="login-text">
        <Link to={"/signup"}>Create an new account</Link>
      </p>
    </section>
  );
};

export default Login;
