import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import Config from "../envVars";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      onlineUsers: [],
      socket: null,
      sse: null,
      theme: "light", // Default theme
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      },
      connectSSE: () => {
        const userId = get().user?._id;
        const sse = new EventSource(
          `${Config.BACKEND_URL}/api/v1/events/${userId}`,
          {
            withCredentials: true,
          }
        );

        sse.onopen = () => {
          console.log(`[SSE OPENED for ${userId}]`);
        };

        sse.onerror = (err) => {
          console.error("[SSE ERROR]", err);
          sse.close(); // auto-reconnect logic có thể thêm sau
        };

        sse.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("[SSE MESSAGE]", data.message);
          console.log("[SSE MESSAGE]", data.clients);
        };
        set({ sse });
      },
      disconnectSSE: () => {
        const sse = get().sse;
        if (sse) {
          sse.close();
          set({ sse: null });
          console.log("[SSE DISCONNECTED]");
        }
      },

      // Reset the error state
      resetError: () => set({ error: null }),

      // Sign up a new user
      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.signup(userData);
          set({
            isLoading: false,
            error: null,
          });
          toast.success("Account created successfully!");
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
          // Toast is already shown in the API service
          throw error;
        }
      },

      // Login a user
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          toast.success("Login successful!");
          get().connectSocket(); // Connect socket after successful login
          get().connectSSE(); // Connect SSE after successful login
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
          // Toast is already shown in the API service
          throw error;
        }
      },

      // Logout the user
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          toast.success("Logged out successfully!");
          get().disconnectSocket(); // Disconnect socket on logout
          get().disconnectSSE(); // Disconnect SSE on logout
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
          // Toast is already shown in the API service
          throw error;
        }
      },

      // Check if user is authenticated
      checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.checkAuth();
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          if (!get().socket) {
            get().connectSocket();
          }
          if (!get().sse) {
            get().connectSSE();
          }
          return response;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null, // Don't set error for auth check failures
          });
        }
      },
      connectSocket: () => {
        const { user } = get();
        if (!user || get().socket?.connected) return;

        const socket = io(Config.BACKEND_URL, {
          withCredentials: true,
          transports: ["websocket"],
        });
        socket.on("connect", () => {
          console.log("[SOCKET CONNECTED]", socket.id);
          const userId = get().user?._id;
          if (userId) {
            socket.emit("setup", userId);
          }
          socket.on("getOnlineUsers", (onlineUsers) => {
            set({ onlineUsers });
          });
        });
        set({ socket });
      },
      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },

      // Update user data
      updateUser: (userData) => {
        set({
          user: { ...get().user, ...userData },
        });
      },
    }),
    {
      name: "bingbong-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
      }),
    }
  )
);

export default useAuthStore;
