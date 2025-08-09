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
  const [initialized, setInitialized] = useState(false); // để đảm bảo chỉ gọi 1 lần

  const fetchNotifications = async (currentPage = 1) => {
    if (!user) return; // không tải nếu chưa đăng nhập
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

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

  useEffect(() => {
    if (!initialized && notifications.length === 0) {
      fetchNotifications(1);
      setInitialized(true);
    }
  }, [initialized, notifications.length]);

  return {
    loading,
    loadMore,
    hasMore,
    notifications,
    unreadCount,
  };
}
