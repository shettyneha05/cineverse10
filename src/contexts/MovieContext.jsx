import { createContext, useContext, useState } from "react";

const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const isFavorite = (id) => favorites.some((movie) => movie.id === id);

  const addToFavorites = (movie) => {
    setFavorites((prev) => {
      // Avoid duplicates
      if (!prev.some((fav) => fav.id === movie.id)) {
        return [...prev, movie];
      }
      return prev;
    });
  };

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== id));
  };

  return (
    <MovieContext.Provider
      value={{ favorites, isFavorite, addToFavorites, removeFromFavorites }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export const useMovieContext = () => useContext(MovieContext);

