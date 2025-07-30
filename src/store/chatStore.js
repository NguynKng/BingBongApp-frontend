import { create } from "zustand";

const useChatStore = create((set) => ({
  AIMessages: [],
  addAIMessage: (message) =>
    set((state) => ({
      AIMessages: [...state.AIMessages, message],
    })),
  messages: [],
  setMessages: (messages) => set({ messages }),
  updateMessage: (newMessage, isSentByMe) =>
    set((state) => {
      const index = state.messages.findIndex(
        (msg) => msg.roomId === newMessage.roomId
      );
      if (index !== -1) {
        const updatedChat = {
          ...state.messages[index],
          lastMessage: {
            text: newMessage.lastMessage.text,
            createdAt: newMessage.lastMessage.createdAt,
            isSentByMe: isSentByMe,
          },
        };
        const newMessages = [
          updatedChat,
          ...state.messages.filter((_, i) => i !== index),
        ];
        return { messages: newMessages };
      } else {
        const newChat = {
          roomId: newMessage.roomId,
          lastMessage: {
            text: newMessage.lastMessage.text,
            createdAt: newMessage.lastMessage.createdAt,
            isSentByMe: isSentByMe,
          },
          participant: newMessage.participant,
        };
        return { messages: [newChat, ...state.messages] };
      }
    }),
}));

export default useChatStore;
