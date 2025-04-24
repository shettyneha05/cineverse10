import "../css/Favorites.css"
import { useMovieContext } from "../contexts/MovieContext"
import MovieCard from "../components/MovieCards"
import Loader from "../components/Loader"
import { useState, useEffect } from "react"

function Watchlist() {
  const { watchlist } = useMovieContext();
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

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="favorites">
        <h2>Your Watchlist</h2>
        <div className="favorites-empty">
          <h2>No Movies in Watchlist</h2>
          <p>Add movies that you want to watch later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h2>Your Watchlist</h2>
      <div className="movies-grid">
        {watchlist
          .filter((movie) => movie.poster_path)
          .map((movie) => (
            <MovieCard 
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

export default Watchlist;
