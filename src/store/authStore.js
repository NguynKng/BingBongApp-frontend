import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import Config from "../envVars";
import normalizeIceServers from "../utils/normalize";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      onlineUsers: [],
      socket: null,
      theme: "light", // Default theme
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      // Replace iceServers (useful when you fetch TURN credentials)
      setIceServers: (servers) => set({ iceServers: servers }),

      requestTurnViaSocket: (opts = { ttl: 600, timeoutMs: 8000 }) => {
        const socket = get().socket;
        if (!socket || !socket.connected) {
          console.warn("Socket not connected, cannot request TURN via socket");
          return Promise.resolve(null);
        }
        const requestId = `turn_req_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`;

        return new Promise((resolve) => {
          let handled = false;
          const timeout = setTimeout(() => {
            if (handled) return;
            handled = true;
            socket.off("turn-credentials", handler);
            resolve(null);
          }, opts.timeoutMs || 8000);

          const handler = (payload) => {
            // If server includes requestId echoing, match it (optional)
            if (payload?.requestId && payload.requestId !== requestId) return;
            if (handled) return;
            handled = true;
            clearTimeout(timeout);
            socket.off("turn-credentials", handler);
            try {
              const ice = normalizeIceServers(payload?.data || payload);
              set({ iceServers: ice });
            } catch (e) {
              /* ignore normalize error */
            }
            resolve(payload);
          };

          socket.on("turn-credentials", handler);

          // emit with optional requestId and ttl
          socket.emit("request-turn", { requestId, ttl: opts.ttl || 600 });
        });
      },

      // deprecated: kept for compatibility (calls socket-based request)
      fetchTurnCredentials: async (userId, opts = {}) => {
        // simply wrap the socket request to keep API compatibility
        return await get().requestTurnViaSocket(opts);
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        document.documentElement.classList.toggle("dark", newTheme === "dark");
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
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          toast.success("Login successful!");
          get().connectSocket(); // Connect socket after successful login
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
      adminLogin: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.adminLogin(credentials);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          toast.success("Login successful!");
          get().connectSocket(); // Connect socket after successful login
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
      logout: async (manual = true) => {
        try {
          get().disconnectSocket(); // Ngắt socket trước

          // Xóa toàn bộ state user
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          if (manual) toast.success("Logged out successfully!");
        } catch (error) {
          set({ isLoading: false, error: error.message });
          console.error("Logout error:", error);
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
          return response;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message, // Don't set error for auth check failures
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
        // set socket early so other modules can access
        set({ socket });

        socket.on("connect", () => {
          console.log("[SOCKET CONNECTED]", socket.id);
          const userId = get().user?._id;
          if (userId) socket.emit("setup", userId);

          // proactively request TURN (server may also push without request)
          socket.emit("request-turn", { userId });
        });

        // handle server-sent turn credentials (may be unsolicited or in reply)
        socket.on("turn-credentials", (payload) => {
          try {
            const ice = normalizeIceServers(payload?.data || payload);
            set({ iceServers: ice });
          } catch (e) {
            console.warn("invalid turn-credentials", e);
          }
        });

        socket.on("getOnlineUsers", (onlineUsers) => {
          set({ onlineUsers });
        });
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
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        iceServers: state.iceServers, // persist ICE config so it survives refresh
      }),
    }
  )
);

export default useAuthStore;
