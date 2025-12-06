import { useEffect, useState } from "react";
import { chatAPI, messageAPI } from "../services/api";
import useChatStore from "../store/chatStore";
import useAuthStore from "../store/authStore";

export const useGetChats = () => {
  const { user } = useAuthStore();
  const { messages, setMessages, updateMessage } = useChatStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!user) return; // không tải nếu chưa đăng nhập
    const fetchChats = async () => {
      try {
        const res = await chatAPI.getRecentChats();
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [setMessages, user]);

  return { messages, loading, updateMessage };
};

export const useGetHistoryChat = (userChatId, isAIChat = false) => {
  const { user: currentUser } = useAuthStore();
  const addAIMessage = useChatStore((state) => state.addAIMessage);
  const AIMessages = useChatStore((state) => state.AIMessages);
  const [messages, setMessages] = useState([]); // chỉ dùng cho chat thường
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const fetchChats = async () => {
      setLoading(true);
      try {
        if (isAIChat) {
          const { AIMessages } = useChatStore.getState();
          if (!AIMessages.some((msg) => msg._id === 1)) {
            addAIMessage({
              _id: 1,
              sender: "bingbong-ai",
              text: "Tôi là BingBong AI. Tôi có thể giúp gì cho bạn hôm nay?",
              createdAt: new Date(),
            });
          }
        } else {
          // Chat thường
          const res = await messageAPI.getHistoryChat(userChatId);
          setMessages(res.data);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userChatId, currentUser, isAIChat, addAIMessage]);

  return {
    messages: isAIChat ? AIMessages : messages,
    loading,
    setMessages,
    addAIMessage,
  };
};
