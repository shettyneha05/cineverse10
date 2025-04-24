"use client"

import "../css/Favorites.css"
import { useMovieContext } from "../contexts/MovieContext"
import MovieCard from "../components/MovieCards"
import Loader from "../components/Loader"
import { useState, useEffect } from "react"

function Favorites() {
  const { favorites } = useMovieContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites">
        <h2>Your Favorites</h2>
        <div className="favorites-empty">
          <h2>No Favorites Yet</h2>
          <p>Start adding movies to your favorites!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h2>Your Favorites</h2>
      <div className="movies-grid">
        {favorites
          .filter((movie) => movie.poster_path)
          .map((movie) => (
            <MovieCard 
              style={{maxWidth: "250px"}}
              movie={{
                ...movie,
                id: movie.movieId
              }} 
              key={movie.movieId} 
            />
          ))}
      </div>
    </div>
  );
}

export default Favorites;
