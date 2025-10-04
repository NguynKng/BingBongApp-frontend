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

//AUTH API services
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
  adminLogin: async (credentials) => {
    try {
      const response = await api.post("/auth/admin/login", credentials);

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
  verifyCode: async (email, code, action) => {
    try {
      const response = await api.post("/auth/verify-code", {
        email,
        code,
        action,
      });

      // Check if response indicates failure
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      // Handle axios error
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Verification failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Handle other errors
      toast.error(error.message || "Verification failed");
      throw error;
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });

      // Check if response indicates failure
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      // Handle axios error
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Forgot password failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Handle other errors
      toast.error(error.message || "Forgot password failed");
      throw error;
    }
  },
  resetPassword: async (email, newPassword) => {
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        newPassword,
      });

      // Check if response indicates failure
      if (response.data.success === false) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      // Handle axios error
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Reset password failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Handle other errors
      toast.error(error.message || "Reset password failed");
      throw error;
    }
  },
};

//USER API services
export const userAPI = {
  getAllUsers: async () => {
    try {
      const response = await api.get(`/user/get-all`);
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
  getSuggestions: async () => {
    try {
      const response = await api.get(`/user/suggestions`);
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

//POST API services
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
        message:
          error.response?.data?.message || "Đã có lỗi xảy ra khi tạo bài viết",
        data: {},
      };
    }
  },
  getPostById: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch post";
        throw new Error(errorMessage);
      }
      throw error;
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
  getFeed: async () => {
    try {
      const response = await api.get(`/posts/feed`);

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
  },
};

//CHAT API services
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
  getAIResponse: async (prompt) => {
    try {
      const response = await api.post("/messages/generate-ai-response", {
        prompt,
      });

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to get AI response";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  sendMessage: async (data) => {
    try {
      const response = await api.post("/messages/send-message", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to send message";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getHistoryChat: async (userChatId) => {
    try {
      const response = await api.get(`/messages/history/${userChatId}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to send message";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

//QUIZ API services
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
  getAllQuizzes: async (name) => {
    try {
      const url = name ? `/quiz?name=${name}` : "/quiz";
      const response = await api.get(url);

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
  deleteQuiz: async (quizId) => {
    try {
      const response = await api.delete(`/quiz/${quizId}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to delete quiz";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getLeaderboard: async () => {
    try {
      const response = await api.get("/quizScore/leaderboard");

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch leaderboard";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  submitScore: async (scoreData) => {
    try {
      const response = await api.post("/quizScore/submit", scoreData);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to submit score";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

//NOTIFICATION API services
export const notificationAPI = {
  getNotifications: async (page = 1) => {
    try {
      const response = await api.get(`/notifications?page=${page}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch notifications";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  markAllAsRead: async () => {
    try {
      const response = await api.put("/notifications/mark-as-all-read");

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to mark notifications as read";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

//NEWS API services
export const newsApi = {
  getNews: async (page) => {
    try {
      const response = await api.get(`/crawlblog?pageNumber=${page}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch news";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

//Badges API
export const badgesAPI = {
  getAllBadges: async () => {
    try {
      const response = await api.get(`/badges`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch news";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getUserBadgeInventory: async () => {
    try {
      const response = await api.get(`/badges/user-inventory`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch news";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

export const translateAPI = {
  translateText: async (text, to) => {
    try {
      const response = await api.post("/translate", { text, to });

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to translate text";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

export const statsAPI = {
  getStats: async () => {
    try {
      const response = await api.get("/stats");

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch stats";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getUserGenderStats: async () => {
    try {
      const response = await api.get("/stats/user-gender");

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch stats";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getUserPostsStats: async () => {
    try {
      const response = await api.get("/stats/user-posts");

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch stats";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

export const tmdbAPI = {
  getTrendingMovie: async () => {
    try {
      const response = await api.get("/tmdb/movie/trending");

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch tmdb trending movies";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getContentTrailer: async (id, contentType) => {
    try {
      const response = await api.get(`/tmdb/${contentType}/trailer/${id}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch tmdb trending movies";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getContentDetail: async (id, contentType) => {
    try {
      const response = await api.get(`/tmdb/${contentType}/detail/${id}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch tmdb trending movies";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getContentCredit: async (id, contentType) => {
    try {
      const response = await api.get(`/tmdb/${contentType}/credit/${id}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch tmdb trending movies";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getSimilarContent: async (id, contentType) => {
    try {
      const response = await api.get(`/tmdb/${contentType}/similar/${id}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch tmdb trending movies";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getMoviesByCategory: async (category) => {
    try {
      const response = await api.get(`/tmdb/movie/${category}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch tmdb trending movies";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getTrendingTVShow: async () => {
    try {
      const response = await api.get(`/tmdb/tv/trending`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch tmdb trending movies";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getTVShowByCategory: async (category) => {
    try {
      const response = await api.get(`/tmdb/tv/${category}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch tmdb trending movies";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  getTVShowEpisode: async (id, season_number) => {
    try {
      const response = await api.get(
        `/tmdb/tv/detail/${id}/season/${season_number}`
      );

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch tmdb trending movies";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

export const shopAPI = {
  getShopBySlug: async (slug) => {
    try {
      const response = await api.get(`/shop/${slug}`);

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Failed to fetch tmdb trending movies";
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

// Export the axios instance for use in other API services
export default api;
