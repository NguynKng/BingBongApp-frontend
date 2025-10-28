import { useEffect, useState } from "react";
import { userAPI } from "../services/api";
import useAuthStore from "../store/authStore";
import useUserStore from "../store/userStore";

export const useGetProfileBySlug = (slug, options = {}) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const { users, fetchUserProfile, loading } = useUserStore();
  const shouldFetch = options.enabled !== false;

  useEffect(() => {
    if (!shouldFetch || !slug) return;

    const loadProfile = async () => {
      try {
        if (users[slug]) {
          setProfile(users[slug]);
        } else {
          const fetched = await fetchUserProfile(slug);
          setProfile(fetched);
        }
      } catch (err) {
        setError(err.message || "Lỗi khi tải profile");
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
  const { user } = useAuthStore();
  const { suggestions, loading, error, fetchSuggestions } = useUserStore();

  useEffect(() => {
    if (user) fetchSuggestions(); // ✅ Fetch only once unless empty
  }, [user, fetchSuggestions]);

  return { suggestions, loading, error };
};
