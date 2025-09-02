import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Container } from "@mui/material";
import { setAccessToken } from "./axiosInstance";

const API_URL = "http://127.0.0.1:8000/api/auth";

const Login: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/login/`, { username, password });

      // Save tokens in sessionStorage
      setAccessToken(res.data.access);
      sessionStorage.setItem("refresh_token", res.data.refresh);

      // Notify App that login was successful
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>
      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
        inputProps={{ "aria-label": "username" }}
       />
      <TextField
        fullWidth
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
        inputProps={{ "aria-label": "password" }} 
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" fullWidth onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
};

export default Login;
