import { useEffect, useState } from "react";
import { postAPI } from "../services/api";
import useAuthStore from "../store/authStore";

export const useGetOwnerPosts = (type, id) => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
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

  const loadFeed = async () => {
    if (!user) return;
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
    refresh: loadFeed,
  };
};
