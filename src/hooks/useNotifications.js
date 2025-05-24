// hooks/useNotifications.ts
import { useEffect, useState } from "react";
import { notificationAPI } from "../services/api";
import useNotificationStore from "../store/notificationStore";

export function useGetNotifications() {
  const { setNotifications, appendNotifications } = useNotificationStore();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (currentPage = 1) => {
    try {
      setLoading(true);
      const res = await notificationAPI.getNotifications(currentPage);
      if (currentPage === 1) {
        setNotifications(res.data);
      } else {
        appendNotifications(res.data);
      }
      setHasMore(res.pagination.hasMore);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  return { loading, loadMore, hasMore };
}
