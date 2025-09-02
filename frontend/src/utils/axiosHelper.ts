import axios from "axios";

// Axios instance for your API
const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;

// Optional: helper to get stored token
export const getAccessToken = () => {
  return localStorage.getItem("token");
};
