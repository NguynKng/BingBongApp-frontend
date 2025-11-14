import { useEffect, useState } from "react";
import { notificationAPI } from "../services/api";
import useNotificationStore from "../store/notificationStore";
import useAuthStore from "../store/authStore";

export function useGetNotifications() {
  const { user } = useAuthStore();
  const { setNotifications, appendNotifications, notifications, unreadCount } =
    useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (currentPage = 1) => {
    if (!user) return;
    setLoading(true);

    try {
      const res = await notificationAPI.getNotifications(currentPage);

      if (currentPage === 1) {
        setNotifications(res.data);
      } else {
        appendNotifications(res.data);
      }

      setHasMore(res.pagination?.hasMore ?? false);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch lại khi user thay đổi + cache không đúng user
  useEffect(() => {
    if (!user) {
      // logout → reset
      setNotifications([]);
      setHasMore(false);
      setPage(1);
      return;
    }

    const isCachedForThisUser =
      notifications.length > 0 && notifications[0].user === user._id;

    if (!isCachedForThisUser) {
      // cache không khớp → reset và fetch mới
      setNotifications([]);
      setPage(1);
      setHasMore(true);
      fetchNotifications(1);
    }
  }, [user?._id]); // chỉ theo user._id

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

  return {
    loading,
    loadMore,
    hasMore,
    notifications,
    unreadCount,
  };
}
