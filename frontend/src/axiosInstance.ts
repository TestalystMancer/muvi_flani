import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const getAccessToken = () => sessionStorage.getItem("access_token");
export const setAccessToken = (token: string) => sessionStorage.setItem("access_token", token);
export const clearTokens = () => sessionStorage.clear();

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// Add Authorization header automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
