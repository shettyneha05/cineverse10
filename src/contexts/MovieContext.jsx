import { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../services/api";
import { useAuth } from "./AuthContext";

const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && user) {
      fetchFavorites();
      fetchWatchlist();
    } else {
      setFavorites([]);
      setWatchlist([]);
    }
  }, [token, user]);

  const fetchFavorites = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/api/movies/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const fetchWatchlist = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/api/movies/watchlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data);
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  const isFavorite = (id) => favorites.some(movie => movie.movieId === id);
  
  const isInWatchlist = (id) => watchlist.some(movie => movie.movieId === id);

  const addToFavorites = async (movie) => {
    if (!token) return { success: false, error: "Authentication required" };
    
    try {
      const response = await fetch(`${API_URL}/api/movies/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movie)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to add to favorites");
      }
      
      setFavorites(prev => [...prev, data.favorite]);
      return { success: true };
      
    } catch (error) {
      console.error("Error adding to favorites:", error);
      return { success: false, error: error.message };
    }
  };

  const removeFromFavorites = async (id) => {
    if (!token) return { success: false, error: "Authentication required" };
    
    try {
      const response = await fetch(`${API_URL}/api/movies/favorites/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to remove from favorites");
      }
      
      setFavorites(prev => prev.filter(movie => movie.movieId !== id));
      return { success: true };
      
    } catch (error) {
      console.error("Error removing from favorites:", error);
      return { success: false, error: error.message };
    }
  };

  const addToWatchlist = async (movie) => {
    if (!token) return { success: false, error: "Authentication required" };
    
    try {
      const response = await fetch(`${API_URL}/api/movies/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movie)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to add to watchlist");
      }
      
      setWatchlist(prev => [...prev, data.watchlistItem]);
      return { success: true };
      
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      return { success: false, error: error.message };
    }
  };

  const removeFromWatchlist = async (id) => {
    if (!token) return { success: false, error: "Authentication required" };
    
    try {
      const response = await fetch(`${API_URL}/api/movies/watchlist/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to remove from watchlist");
      }
      
      setWatchlist(prev => prev.filter(movie => movie.movieId !== id));
      return { success: true };
      
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <MovieContext.Provider value={{
      favorites,
      watchlist,
      isFavorite,
      isInWatchlist,
      addToFavorites,
      removeFromFavorites,
      addToWatchlist,
      removeFromWatchlist
    }}>
      {children}
    </MovieContext.Provider>
  );
}

export const useMovieContext = () => useContext(MovieContext);
