// src/api.ts
import axiosInstance, { getAccessToken, clearTokens } from "./axiosInstance";

const API_URL = "http://127.0.0.1:8000/api";

// Example: login function
export const login = async (username: string, password: string) => {
  try {
    const res = await axiosInstance.post(`${API_URL}/auth/login/`, {
      username,
      password,
    });
    // Save access & refresh tokens
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Example: fetch movies
export const fetchMovies = async (category: string, page: number, search?: string) => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error("No access token found");

    let url = `${API_URL}/movies/`;
    if (search) {
      url += `?search=${search}&page=${page}`;
    } else {
      switch (category) {
        case "popular":
          url = `${API_URL}/movies/popular/?page=${page}`;
          break;
        case "top_rated":
          url = `${API_URL}/movies/top_rated/?page=${page}`;
          break;
        case "upcoming":
          url = `${API_URL}/movies/upcoming/?page=${page}`;
          break;
        case "now_playing":
          url = `${API_URL}/movies/now_playing/?page=${page}`;
          break;
      }
    }

    const res = await axiosInstance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.results || res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Example: logout function
export const logout = () => {
  clearTokens();
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
