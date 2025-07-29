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

    return { posts, setPosts, loading, error };
}

export const useGetFeed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const response = await postAPI.getFeed(); // không truyền page/limit
      if (response.success) {
        setFeed(response.posts); // lấy tất cả
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return {
    feed,
    setFeed,
    loading,
    error,
    refresh: loadFeed
  };
};
