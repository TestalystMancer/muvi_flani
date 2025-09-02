import React, { useState, useEffect } from "react";
import {
  AppBar, Button, Toolbar, Typography, Tabs, Tab, Container,
  Grid, TextField, IconButton, InputAdornment, CircularProgress
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import MovieCard from "./MovieCard";
import Login from "./Login";
import axiosInstance, { clearTokens, getAccessToken } from "./axiosInstance";


const BASE_URL = "/api/movies";

function App() {
  const [movies, setMovies] = useState<any[]>([]);
  const [category, setCategory] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAccessToken());

  const fetchMovies = async (reset = false) => {
    const token = getAccessToken();
    if (!token) return;

    try {
      setLoading(true);
      let url = "";

      if (searchQuery) {
        url = `${BASE_URL}/movies/?search=${searchQuery}&page=${page}`;
      } else {
        switch (category) {
          case "popular":
            url = `${BASE_URL}/movies/popular/?page=${page}`;
            break;
          case "top_rated":
            url = `${BASE_URL}/movies/top_rated/?page=${page}`;
            break;
          case "upcoming":
            url = `${BASE_URL}/movies/upcoming/?page=${page}`;
            break;
          case "now_playing":
            url = `${BASE_URL}/movies/now_playing/?page=${page}`;
            break;
          default:
            url = `${BASE_URL}/movies/popular/?page=${page}`;
        }
      }

      const res = await axiosInstance.get(url);
      const newMovies = res.data.results || res.data;
      setMovies(reset ? newMovies : [...movies, ...newMovies]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // FIX: Add isLoggedIn to the dependency array so movies are fetched after login.
    fetchMovies(page === 1);
  }, [category, searchQuery, page, isLoggedIn]); // <-- ADDED isLoggedIn HERE

  const handleLogout = () => {
    clearTokens();
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <>
      <AppBar position="sticky" sx={{ background: darkMode ? "#111" : "#1976d2" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            🎬 MuviFlani
          </Typography>

          <TextField
            placeholder="Search movies..."
            size="small"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            sx={{
              width: "50%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                backgroundColor: darkMode ? "#333" : "#fff",
                "& fieldset": { border: "none" },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => { setSearchQuery(""); setPage(1); }}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <div style={{ display: "flex", alignItems: "center" }}>
            <Tabs
              value={category}
              onChange={(e, val) => { setCategory(val); setPage(1); }}
              textColor="inherit"
              indicatorColor="secondary"
            >
              <Tab label="Popular" value="popular" />
              <Tab label="Top Rated" value="top_rated" />
              <Tab label="Upcoming" value="upcoming" />
              <Tab label="Now Playing" value="now_playing" />
            </Tabs>

            <IconButton sx={{ ml: 1 }} onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

             {/* Logout Button */}            
            <Button
              sx={{
                ml: 2,
                color: "#fff",
                border: "1px solid #fff",
              }}
              variant="outlined"
              onClick={handleLogout}
            >
              Logout
            </Button>

          </div>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        {loading && page === 1 ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <Grid container spacing={2}>
              {movies.map((movie) => (
                <Grid item xs={12} sm={6} md={3} key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>

            {movies.length > 0 && (
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  style={{ padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer" }}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default App;
