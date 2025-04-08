import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Reset the error state
      resetError: () => set({ error: null }),
      
      // Sign up a new user
      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.signup(userData);
          set({ 
            isLoading: false,
            error: null
          });
          toast.success("Account created successfully!");
          return response;
        } catch (error) {
          set({ 
            isLoading: false,
            error: error.message
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
            error: null
          });
          toast.success("Login successful!");
          return response;
        } catch (error) {
          set({ 
            isLoading: false,
            error: error.message
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
            error: null
          });
          toast.success("Logged out successfully!");
        } catch (error) {
          set({ 
            isLoading: false,
            error: error.message
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
            error: null
          });
          return response;
        } catch (error) {
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null // Don't set error for auth check failures
          });
        }
      },
      
      // Update user data
      updateUser: (userData) => {
        set({ 
          user: { ...get().user, ...userData }
        });
      }
    }),
    {
      name: 'bingbong-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);

export default useAuthStore;
