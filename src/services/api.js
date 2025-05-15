import axios from "axios";
import { toast } from "react-hot-toast";
import Config from "../envVars";

// Create axios instance with default config
const api = axios.create({
  baseURL: `${Config.BACKEND_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication services
export const authAPI = {
  // Register a new user
  signup: async (userData) => {
    try {
      const response = await api.post("/auth/signup", userData);

      // Check if response indicates failure
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      // Handle axios error
      if (error.response) {
        const errorMessage = error.response.data.message || "Signup failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Handle other errors
      toast.error(error.message || "Signup failed");
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);

      // Check if response indicates failure
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      // Handle axios error
      if (error.response) {
        const errorMessage = error.response.data.message || "Login failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Handle other errors
      toast.error(error.message || "Login failed");
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");

      // Check if response indicates failure
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      // Handle axios error
      if (error.response) {
        const errorMessage = error.response.data.message || "Logout failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Handle other errors
      toast.error(error.message || "Logout failed");
      throw error;
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      const response = await api.get("/auth/authCheck");

      // Check if response indicates failure
      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      // Don't show error toast for auth check failures since this is often expected
      if (error.response && error.response.status !== 401) {
        toast.error(
          error.response.data.message || "Authentication check failed"
        );
      }
      throw error;
    }
  },
};

// User services
export const userAPI = {
  getUserPost: async (userId) => {
    try {
      const response = await api.get(`/posts/user/${userId}`);
      if (response.data.success === false) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to get user posts";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  // Upload user avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to upload avatar";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      toast.error(error.message || "Failed to upload avatar");
      throw error;
    }
  },

  // Upload user cover photo
  uploadCoverPhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append("coverPhoto", file);

      const response = await api.post("/user/cover-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to upload cover photo";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      toast.error(error.message || "Failed to upload cover photo");
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      // Use different endpoints based on whether userId is provided
      const url = userId ? `/user/profile/${userId}` : "/user/profile";
      const response = await api.get(url);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to get user profile";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  getUserProfileByName: async (name) => {
    try {
      // Use different endpoints based on whether userId is provided
      const url = `/user/search?name=${name}`;
      const response = await api.get(url);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to get user profile";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  // Add friend-related actions
  acceptFriendRequest: async (userId) => {
    try {
      const response = await api.post(`/user/friend-request/accept/${userId}`);
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to accept friend request";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  sendFriendRequest: async (userId) => {
    try {
      const response = await api.post(`/user/friend-request/${userId}`);
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send friend request";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  cancelFriendRequest: async (userId) => {
    try {
      const response = await api.delete(`/user/friend-request/${userId}`);
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to cancel friend request";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  declineFriendRequest: async (userId) => {
    try {
      const response = await api.delete(
        `/user/friend-request/decline/${userId}`
      );
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to decline friend request";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  removeFriend: async (userId) => {
    try {
      const response = await api.delete(`/user/friend/${userId}`);
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to remove friend";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
};

export const postAPI = {
  createPost: async (postData) => {
    try {
      const response = await api.post("/posts", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Đã có lỗi xảy ra khi đăng post",
        data: {},
      };
    }
  },
  reactToPost: async (postId, type) => {
    try {
      const response = await api.post(`/posts/react`, { postId, type });
      return {
        success: true,
        message: response.data.message, // Thông điệp có thể tuỳ chỉnh
        data: response.data.data || {}, // Dữ liệu thả cảm xúc
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Đã có lỗi xảy ra khi thả cảm xúc",
        data: {},
      };
    }
  },
  // Get user feed (posts from user and their friends)
  getFeed: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch feed";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Get posts by user ID
  getUserPosts: async (userId, page = 1, limit = 10) => {
    try {
      const response = await api.get(
        `/posts/user/${userId}?page=${page}&limit=${limit}`
      );

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch user posts";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  addComment: async (postId, commentData) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, {
        content: commentData,
      });

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to add comment";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  addReply: async (commentId, replyData) => {
    try {
      const response = await api.post(`/posts/comments/${commentId}/replies`, {
        content: replyData,
      });

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to add reply";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getComments: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch comments";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/posts/${postId}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to delete post";
        throw new Error(errorMessage);
      }
      throw error;
    }
  }
};

export const chatApi = {
  getChatList: async () => {
    try {
      const response = await api.get("/messages");

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch chat list";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

export const quizAPI = {
  // Create a new quiz
  createQuiz: async (quizData) => {
    try {
      const response = await api.post("/quiz", quizData);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to create quiz";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Get all quizzes
  getAllQuizzes: async () => {
    try {
      const response = await api.get("/quiz");

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch quizzes";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getQuizById: async (quizId) => {
    try {
      const response = await api.get(`/quiz/${quizId}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch quiz";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

// Export the axios instance for use in other API services
export default api;
