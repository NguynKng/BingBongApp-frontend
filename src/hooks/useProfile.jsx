import { useEffect, useState } from "react";
import { userAPI } from "../services/api";
import useAuthStore from "../store/authStore";

export const useGetProfile = (userId, options = {}) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shouldFetch = options.enabled !== false;

  useEffect(() => {
    if (!shouldFetch || !userId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await userAPI.getUserProfile(userId);
        if (response.success) {
          setProfile(response.user);
          setError(null);
        } else {
          setError(response.message || "Lỗi không xác định");
        }
      } catch (err) {
        setError(err.message || "Lỗi khi gọi API");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, shouldFetch]);

  return { profile, loading, error };
};

export const useGetProfileByName = (name, options = {}) => {
  const [listUser, setListUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const shouldFetch = options.enabled !== false;
  useEffect(() => {
    if (!shouldFetch) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await userAPI.getUserProfileByName(name);
        if (response.success) {
          setListUser(response.users);
          setError(null);
        } else {
          setError(response.message || "Lỗi không xác định");
        }
      } catch (err) {
        setError(err.message || "Lỗi khi gọi API");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [name, shouldFetch]);

  return { listUser, loading, error };
};

export const useGetSuggestion = () => {
  const { user } = useAuthStore();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await userAPI.getSuggestions();
        if (response.success) {
          setSuggestions(response.data);
          setError(null);
        } else {
          setError(response.message || "Lỗi không xác định");
        }
      } catch (err) {
        setError(err.message || "Lỗi khi gọi API");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  return { suggestions, loading, error };
};
