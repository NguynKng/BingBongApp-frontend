import { useEffect, useState } from "react";
import { statsAPI, userAPI } from "../services/api";

export const useGetStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsAPI.getStats();
        setStats(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export const useGetGenderStats = () => {
  const [genderStats, setGenderStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenderStats = async () => {
      try {
        const data = await statsAPI.getUserGenderStats();
        setGenderStats(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderStats();
  }, []);

  return { genderStats, loading, error };
};

export const useGetUserPostsStats = () => {
  const [userPostsStats, setUserPostsStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPostsStats = async () => {
      try {
        const data = await statsAPI.getUserPostsStats();
        setUserPostsStats(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPostsStats();
  }, []);

  return { userPostsStats, loading, error };
};

export const useGetAllUsers = () => {
  const [usersStats, setUsersStats] = useState({
    totalUsers: 0,
    totalUnverifiedUsers: 0,
    totalBlockedUsers: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPostsStats = async () => {
      try {
        const data = await userAPI.getAllUsers();
        setUsers(data.data);
        setUsersStats({
          totalUsers: data.data.length,
          totalUnverifiedUsers: data.data.filter((user) => !user.isVerified)
            .length,
          totalBlockedUsers: data.data.filter((user) => user.block).length,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPostsStats();
  }, []);

  return { users, usersStats, loading, error };
};

export const useGetUserStats = () => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const data = await userAPI.getUserStats();
        setUserStats(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  return { userStats, loading, error };
};