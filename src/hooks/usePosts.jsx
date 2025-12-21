import { useEffect, useState } from "react";
import { postAPI } from "../services/api";
import useAuthStore from "../store/authStore";
import { useCallback } from "react";

export const useGetOwnerPosts = (type, id) => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !id || !type) return;
    const fetchPosts = async () => {
      try {
        const response = await postAPI.getPostsByOwner(type, id);
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
  }, [type, id, user]);

  return { posts, setPosts, loading, error };
};

export const useGetFeed = () => {
  const { user } = useAuthStore();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadFeed = useCallback(async (pageNum = 1, append = false) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await postAPI.getFeed(pageNum, 20); // limit 20
      
      if (response.success) {
        const newPosts = response.posts || [];
        
        if (append) {
          setFeed((prev) => [...prev, ...newPosts]);
        } else {
          setFeed(newPosts);
        }
        
        // Nếu số bài < 20, nghĩa là hết data
        setHasMore(newPosts.length === 20);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadFeed(nextPage, true); // append = true
    }
  }, [page, loading, hasMore, loadFeed]);

  useEffect(() => {
    loadFeed(1, false);
  }, [user]);

  return {
    feed,
    setFeed,
    loading,
    error,
    hasMore,
    loadMore,
    refresh: () => {
      setPage(1);
      loadFeed(1, false);
    },
  };
};