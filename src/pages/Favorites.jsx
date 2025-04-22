import '../css/Favorites.css';
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from '../components/MovieCards';
import Loader from '../components/Loader'; // ✅ this is correct based on your folder

import { useState, useEffect } from 'react';

function Favorites() {
  const { favorites } = useMovieContext();

  // ✅ loader state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 sec delay
    return () => clearTimeout(timeout);
  }, []);

  // ✅ loading screen
  if (isLoading) {
    return <Loader />;
  }

  if (!favorites || favorites.length === 0) {
    return <div className='favorites'><h2>No Favorites Yet 😿</h2></div>;
  }

  return (
    <div className='favorites'>
      <h2>Your Favorites</h2>
      <div className="movies-grid">
        {favorites
          .filter((movie) => movie.poster_path)
          .map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
      </div>
    </div>
  );
}

export default Favorites;

