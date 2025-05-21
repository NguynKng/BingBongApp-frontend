import { useEffect, useState } from "react";
import { notificationAPI } from "../services/api";
import useNotificationStore from "../store/notificationStore";

export const useGetNotifications = () => {
  const { notifications, setNotifications, unreadCount } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await notificationAPI.getNotifications();

        if (response.success) {
          setNotifications(response.data);
        } else {
          setError(response.message || "Không thể tải thông báo");
        }
      } catch (err) {
        setError(err?.message || "Có lỗi xảy ra khi tải thông báo");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [setNotifications]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
  };
};
