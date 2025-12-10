import { useEffect, useState } from "react";
import { statsAPI, userAPI } from "../services/api";

// ✅ 1. Get overview stats
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

// ✅ 2. Get gender stats
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

// ✅ 3. Get user & posts stats by month
export const useGetUserGroupShopStats = () => {
  const [userGroupShopStats, setUserGroupShopStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserGroupShopStats = async () => {
      try {
        const data = await statsAPI.getUserGroupShopStats();
        setUserGroupShopStats(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroupShopStats();
  }, []);

  return { userGroupShopStats, loading, error };
};

export const useGetPostCommentReactionStats = () => {
  const [postCommentReactionStats, setPostCommentReactionStats] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostCommentReactionStats = async () => {
      try {
        const data = await statsAPI.getPostCommentReactionStats();
        setPostCommentReactionStats(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostCommentReactionStats();
  }, []);

  return { postCommentReactionStats, loading, error };
};

// ✅ 4. Get all users (existing)
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

// ✅ 5. Get user stats (existing)
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

// ✅ 6. Get top users (NEW)
export const useGetTopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const data = await statsAPI.getTopUsers();
        setTopUsers(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  return { topUsers, loading, error };
};

// ✅ 7. Get top posts (NEW)
export const useGetTopPosts = () => {
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const data = await statsAPI.getTopPosts();
        setTopPosts(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  return { topPosts, loading, error };
};

// ✅ 8. Get recent activity (NEW)
export const useGetRecentActivity = () => {
  const [recentActivity, setRecentActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const data = await statsAPI.getRecentActivity();
        setRecentActivity(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  return { recentActivity, loading, error };
};

// ✅ 9. Get group stats (NEW)
export const useGetGroupStats = () => {
  const [groupStats, setGroupStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupStats = async () => {
      try {
        const data = await statsAPI.getGroupStats();
        setGroupStats(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupStats();
  }, []);

  return { groupStats, loading, error };
};

// ✅ 10. Get shop stats (NEW)
export const useGetShopStats = () => {
  const [shopStats, setShopStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopStats = async () => {
      try {
        const data = await statsAPI.getShopStats();
        setShopStats(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShopStats();
  }, []);

  return { shopStats, loading, error };
};
