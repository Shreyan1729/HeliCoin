export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");
export const isLoggedIn = () => !!getToken();

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api", // Backend URL
// });

// export const signupUser = (data) => api.post("/signup", data);
// export const loginUser = (data) => api.post("/login", data);
// export const updatePoints = (data) => api.post("/update-points", data);

// export default api;
