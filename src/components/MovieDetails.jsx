import { useState, useEffect } from 'react';
import { getMovieDetails } from '../services/api';
import '../css/MovieDetails.css';


function MovieDetails({ movieId, onClose }) {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const data = await getMovieDetails(movieId);
                setMovie(data);
            } catch (err) {
                setError('Failed to load movie details');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    if (loading) return <div className="modal-loading">Loading...</div>;
    if (error) return <div className="modal-error">{error}</div>;
    if (!movie) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                <div className="modal-grid">
                    <div className="modal-poster">
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                    </div>
                    <div className="modal-info">
                        <h2>{movie.title}</h2>
                        <p className="movie-tagline">{movie.tagline}</p>
                        <div className="movie-meta">
                            <span className="release-date">
                                {new Date(movie.release_date).getFullYear()}
                            </span>
                            <span className="runtime">{movie.runtime} min</span>
                            <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
                        </div>
                        <div className="genre-list">
                            {movie.genres.map(genre => (
                                <span key={genre.id} className="genre-tag">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        <div className="overview">
                            <h3>Overview</h3>
                            <p>{movie.overview}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetails;
