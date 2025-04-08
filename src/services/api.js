import axios from 'axios';
import { toast } from 'react-hot-toast';
import Config from '../envVars';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${Config.BACKEND_URL}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authentication services
export const authAPI = {
  // Register a new user
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      
      // Check if response indicates failure
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      // Handle axios error
      if (error.response) {
        const errorMessage = error.response.data.message || 'Signup failed';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      // Handle other errors
      toast.error(error.message || 'Signup failed');
      throw error;
    }
  },
  
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Check if response indicates failure
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      // Handle axios error
      if (error.response) {
        const errorMessage = error.response.data.message || 'Login failed';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      // Handle other errors
      toast.error(error.message || 'Login failed');
      throw error;
    }
  },
  
  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      
      // Check if response indicates failure
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      // Handle axios error
      if (error.response) {
        const errorMessage = error.response.data.message || 'Logout failed';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      // Handle other errors
      toast.error(error.message || 'Logout failed');
      throw error;
    }
  },
  
  // Check authentication status
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/authCheck');
      
      // Check if response indicates failure
      if (response.data.success === false) {
        throw new Error(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      // Don't show error toast for auth check failures since this is often expected
      if (error.response && error.response.status !== 401) {
        toast.error(error.response.data.message || 'Authentication check failed');
      }
      throw error;
    }
  }
};

// User services
export const userAPI = {
  // Upload user avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || 'Failed to upload avatar';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      toast.error(error.message || 'Failed to upload avatar');
      throw error;
    }
  },

  // Upload user cover photo
  uploadCoverPhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('coverPhoto', file);

      const response = await api.post('/user/cover-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || 'Failed to upload cover photo';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      toast.error(error.message || 'Failed to upload cover photo');
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      // Use different endpoints based on whether userId is provided
      const url = userId ? `/user/profile/${userId}` : '/user/profile';
      const response = await api.get(url);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || 'Failed to get user profile';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      throw error;
    }
  }
};

// Export the axios instance for use in other API services
export default api;
