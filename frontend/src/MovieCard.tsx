// src/MovieCard.tsx
import React, { useState } from "react";
import { Card, CardMedia, CardContent, Typography, Modal, Box } from "@mui/material";

interface MovieCardProps {
  movie: any;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <>
      <Card
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          borderRadius: 2,
          boxShadow: 3,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          height="350"
          image={imageUrl}
          alt={movie.title || movie.name}
        />
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1" noWrap>
            {movie.title || movie.name}
          </Typography>
        </CardContent>
      </Card>

      {/* Modal for details */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" gutterBottom>
            {movie.title || movie.name}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {movie.overview
              ? movie.overview.length > 300
                ? movie.overview.substring(0, 300) + "..."
                : movie.overview
              : "No description available."}
          </Typography>
          <Typography variant="subtitle2">
            Release Date: {movie.release_date || "N/A"}
          </Typography>
          <Typography variant="subtitle2">
            Rating: {movie.vote_average || "N/A"} ({movie.vote_count || 0} votes)
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default MovieCard;
