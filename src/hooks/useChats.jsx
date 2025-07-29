import { useEffect, useState } from "react";
import { chatApi } from "../services/api";
import useChatStore from "../store/chatStore";

export const useGetChats = () => {
  const { messages, setMessages, updateMessage } = useChatStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchChats = async () => {
      try {
        const res = await chatApi.getChatList();
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [setMessages]);

  return { messages, loading, updateMessage };
};
