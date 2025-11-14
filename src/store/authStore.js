import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import Config from "../envVars";
import normalizeIceServers from "../utils/normalize";

//let hasShownTokenExpired = false; // flag để toast chỉ 1 lần

const useAuthStore = create(
  persist(
    (set, get) => ({
      /** ==== STATE ==== */
      user: null,
      token: null,
      isAuthenticated: false,
      tokenExpired: false,

      // Separate loading states
      isCheckingAuth: false,
      isLoggingIn: false,
      isSigningUp: false,

      error: null,
      onlineUsers: [],
      socket: null,
      theme: "light",
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],

      /** ==== THEME ==== */
      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      },

      /** ==== ICE SERVERS ==== */
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
            if (payload?.requestId && payload.requestId !== requestId) return;
            if (handled) return;
            handled = true;
            clearTimeout(timeout);
            socket.off("turn-credentials", handler);
            try {
              const ice = normalizeIceServers(payload?.data || payload);
              set({ iceServers: ice });
            } catch {
              /* ignore normalize error */
            }
            resolve(payload);
          };

          socket.on("turn-credentials", handler);
          socket.emit("request-turn", { requestId, ttl: opts.ttl || 600 });
        });
      },

      fetchTurnCredentials: async (_, opts = {}) => {
        return await get().requestTurnViaSocket(opts);
      },

      /** ==== AUTH ==== */
      resetError: () => set({ error: null }),

      /** Sign up */
      signup: async (data) => {
        set({ isSigningUp: true, error: null });
        try {
          const res = await authAPI.signup(data);
          set({ isSigningUp: false });
          toast.success("Account created successfully!");
          return res;
        } catch (error) {
          set({ isSigningUp: false, error: error.message });
          throw error;
        }
      },

      /** Login (user hoặc admin) */
      login: async (credentials, options = { admin: false }) => {
        set({ isLoggingIn: true, error: null });
        try {
          const response = options.admin
            ? await authAPI.adminLogin(credentials)
            : await authAPI.login(credentials);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoggingIn: false,
            error: null,
          });
          toast.success("Login successful!");
          get().connectSocket();
          return response;
        } catch (error) {
          set({ isLoggingIn: false, error: error.message });
          throw error;
        }
      },

      /** Logout */
      logout: async (manual = true) => {
        try {
          get().disconnectSocket();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoggingIn: false,
            isCheckingAuth: false,
            isSigningUp: false,
            error: null,
          });
          if (manual) toast.success("Logged out successfully!");
        } catch (error) {
          set({ error: error.message });
          console.error("Logout error:", error);
        }
      },
      /** Check Authentication */
      checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
          const response = await authAPI.checkAuth();
          set({
            user: response.user,
            isAuthenticated: true,
            isCheckingAuth: false,
          });
          if (!get().socket) get().connectSocket();
          return response;
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isCheckingAuth: false,
          });
        }
      },

      /** ==== SOCKET ==== */
      connectSocket: () => {
        const { user } = get();
        if (!user || get().socket?.connected) return;

        const socket = io(Config.BACKEND_URL, {
          withCredentials: true,
          transports: ["websocket"],
        });

        set({ socket });

        socket.on("connect", () => {
          console.log("[SOCKET CONNECTED]", socket.id);
          if (user?._id) socket.emit("setup", user._id);
          socket.emit("request-turn", { userId: user?._id });
        });

        socket.on("turn-credentials", (payload) => {
          try {
            const ice = normalizeIceServers(payload?.data || payload);
            set({ iceServers: ice });
          } catch (e) {
            console.warn("Invalid turn-credentials", e);
          }
        });

        socket.on("getOnlineUsers", (onlineUsers) => {
          set({ onlineUsers });
        });
      },

      disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) socket.disconnect();
      },

      /** ==== USER ==== */
      updateUser: (data) => {
        set({ user: { ...get().user, ...data } });
      },
    }),
    {
      name: "bingbong-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        iceServers: state.iceServers,
      }),
    }
  )
);

export default useAuthStore;
