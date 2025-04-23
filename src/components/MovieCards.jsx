"use client";

import { useState } from "react";
import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieDetails from "./MovieDetails";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites, isInWatchlist, addToWatchlist, removeFromWatchlist } = useMovieContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const favorite = isFavorite(movie.id);
  const inWatchlist = isInWatchlist(movie.id);

  function handleFavoriteClick(e) {
    e.stopPropagation(); 
    
    if (!user) {
      navigate("/signin");
      return;
    }
    
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites({
        movieId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        overview: movie.overview,
        vote_average: movie.vote_average
      });
    }
  }

  function handleWatchlistClick(e) {
    e.stopPropagation();  
    
    if (!user) {
      navigate("/signin");
      return;
    }
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist({
        movieId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        overview: movie.overview,
        vote_average: movie.vote_average
      });
    }
  }

  return (
    <>
      <div className="movie-card" onClick={() => setShowDetails(true)}>
        <div className="movie-poster">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/default-image.jpg"}
            alt={movie.title}
          />
          <div className="movie-overlay">
            <div className="movie-buttons">
              <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={handleFavoriteClick}>
                {favorite ? "❤️" : "🤍"}
              </button>
              <button className={`watchlist-btn ${inWatchlist ? "active" : ""}`} onClick={handleWatchlistClick}>
                {inWatchlist ? "✓" : "👁️"}
              </button>
            </div>
          </div>
        </div>
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>
            {movie.release_date ? new Date(movie.release_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }) : null}
          </p>
        </div>
      </div>
      {showDetails && <MovieDetails movieId={movie.id} onClose={() => setShowDetails(false)} />}
    </>
  );
}

export default MovieCard;
