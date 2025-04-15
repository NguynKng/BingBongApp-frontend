import { useEffect, useState } from "react";
import { userAPI, postAPI } from "../services/api"; 

export const useGetUserPosts = (userId) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await userAPI.getUserPost(userId);
                if (response.success) {
                    setPosts(response.posts);
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
    }, [userId]);

    return { posts, loading, error };
}

// Add a new hook for fetching the feed
export const useGetFeed = (initialPage = 1, initialLimit = 10) => {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: initialPage,
        limit: initialLimit,
        total: 0,
        pages: 0
    });
    const [hasMore, setHasMore] = useState(true);

    // Function to load initial feed
    const loadFeed = async (page = initialPage, limit = initialLimit) => {
        setLoading(true);
        try {
            const response = await postAPI.getFeed(page, limit);
            if (response.success) {
                setFeed(response.posts);
                setPagination(response.pagination);
                setHasMore(response.pagination.page < response.pagination.pages);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to load more posts (for infinite scrolling)
    const loadMore = async () => {
        if (loading || !hasMore) return;
        
        const nextPage = pagination.page + 1;
        setLoading(true);
        
        try {
            const response = await postAPI.getFeed(nextPage, pagination.limit);
            if (response.success) {
                setFeed(prevFeed => [...prevFeed, ...response.posts]);
                setPagination(response.pagination);
                setHasMore(response.pagination.page < response.pagination.pages);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load initial feed when component mounts
    useEffect(() => {
        loadFeed();
    }, []);

    return { 
        feed, 
        loading, 
        error, 
        pagination, 
        hasMore, 
        loadMore,
        refresh: () => loadFeed(1, pagination.limit) 
    };
}