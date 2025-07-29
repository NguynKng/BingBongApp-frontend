import { create } from "zustand";
import { notificationAPI } from "../services/api";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  setNotifications: (notifications) => {
    const unread = notifications.filter((n) => !n.isRead).length;
    set({ notifications, unreadCount: unread });
  },
  addNotification: (notification) => {
    const currentNotifications = get().notifications;
    const updatedNotifications = [notification, ...currentNotifications];
    const unread = updatedNotifications.filter((n) => !n.isRead).length;
    set({ notifications: updatedNotifications, unreadCount: unread });
  },
  appendNotifications: (newNotifications) => {
    const currentNotifications = get().notifications;
    const updatedNotifications = [...currentNotifications, ...newNotifications];
    const unread = updatedNotifications.filter((n) => !n.isRead).length;
    set({ notifications: updatedNotifications, unreadCount: unread });
  },
  markAsAllRead: async () => {
    const response = await notificationAPI.markAllAsRead();
    if (response.success) {
      set({ notifications: response.data, unreadCount: 0 });
    }
  },
}));

export default useNotificationStore;
