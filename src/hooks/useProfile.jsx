import { useEffect, useState } from "react";
import { userAPI } from "../services/api";
import useAuthStore from "../store/authStore";
import useUserStore from "../store/userStore";

export const useGetProfileBySlug = (slug, options = {}) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { users, fetchUserProfile } = useUserStore();
  const shouldFetch = options.enabled !== false;

  useEffect(() => {
    if (!shouldFetch || !slug) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        if (users[slug]) {
          setProfile(users[slug]);
        } else {
          const fetched = await fetchUserProfile(slug);
          setProfile(fetched);
        }
      } catch (err) {
        setError(err.message || "Lỗi khi tải profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [slug, shouldFetch, users, fetchUserProfile]);

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
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { suggestions, error, fetchSuggestions } = useUserStore();

  useEffect(() => {
    const loadSuggestions = async () => {
      if (!user) return;
      setLoading(true);
      try {
        await fetchSuggestions();
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [user, fetchSuggestions]);

  return { suggestions, loading, error };
};
