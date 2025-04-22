import { useState } from "react";
import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieDetails from "./MovieDetails";

function MovieCard({movie}){
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
    const [showDetails, setShowDetails] = useState(false);
    
    const favorite = isFavorite(movie.id);

    function handleFavoriteClick(e) {
        e.stopPropagation(); // Prevent modal from opening when clicking favorite button
        if (favorite) {
            removeFromFavorites(movie.id);
        } else {
            addToFavorites(movie);
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
                        <button 
                            className={`favorite-btn ${favorite ? "active" : ""}`}
                            onClick={handleFavoriteClick}
                        >
                            {favorite ? "❤️" : "🤍"}
                        </button>
                    </div>
                </div>
                <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>{new Date(movie.release_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}</p>
                </div>
            </div>
            {showDetails && (
                <MovieDetails 
                    movieId={movie.id} 
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    );
}

export default MovieCard;