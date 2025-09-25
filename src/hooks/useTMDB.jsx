import { useEffect, useState } from "react";
import { tmdbAPI } from "../services/api";

export const useGetTrendingMovie = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await tmdbAPI.getTrendingMovie();
                if (response.success) {
                    setMovies(response.content);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return { movies, setMovies, loading, error };
}