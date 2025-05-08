import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Send, X } from "lucide-react";
import Config from "../envVars";
import useAuthStore from "../store/authStore";
import { useGetChats } from "../hooks/useChats";
import { Link } from "react-router-dom";
import { formatTimeToHourMinute } from "../utils/timeUtils";

function ChatBox({ onClose, userChat }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const { user: currentUser, socket, onlineUsers } = useAuthStore();
  const messagesEndRef = useRef(null);
  const [isOnline, setIsOnline] = useState(false);
  const { updateMessage } = useGetChats();

  useEffect(() => {
    if (!socket || !currentUser || !userChat) return;
    setIsOnline(onlineUsers.includes(userChat._id));

    socket.emit("loadChatHistory", {
      userId1: currentUser._id,
      userId2: userChat._id,
    });

    const handleLoadHistory = (history) => {
      if (Array.isArray(history)) {
        const formatted = history.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formatted);
      }
    };

    const handleReceiveMessage = ({
      _id,
      senderId,
      receiverId,
      text,
      createdAt,
    }) => {
      const isRelevant =
        (String(senderId) === String(currentUser._id) &&
          String(receiverId) === String(userChat._id)) ||
        (String(senderId) === String(userChat._id) &&
          String(receiverId) === String(currentUser._id));

      if (isRelevant) {
        setMessages((prev) => [
          ...prev,
          {
            _id,
            senderId,
            receiverId,
            text,
            createdAt: new Date(createdAt),
          },
        ]);
      }
    };

    socket.on("loadChatHistory", handleLoadHistory);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("newMessage", (newMessage) => {
      updateMessage(newMessage, newMessage.senderId === currentUser._id);
    });

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("loadChatHistory", handleLoadHistory);
      socket.off("newMessage");
    };
  }, [socket, currentUser, userChat, updateMessage, onlineUsers]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!message.trim() || !currentUser || !socket) return;

    const data = {
      senderId: currentUser._id,
      receiverId: userChat._id,
      text: message,
      createdAt: new Date(),
    };

    socket.emit("sendMessage", data);
    setMessage("");
  }, [message, currentUser, socket, userChat._id]);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed right-20 bottom-0 w-88 z-50 transform transition-all duration-300 ease-out hover:scale-[1.01]">
      <div className="rounded-t-xl shadow-xl overflow-hidden bg-white border border-gray-200">
        {/* Header */}
        <div
          className="px-4 py-2 font-semibold flex justify-between items-center 
                    bg-gradient-to-r from-blue-500 to-purple-500 text-white"
        >
          <div className="flex items-center gap-2">
            <Link
              to={`/profile/${userChat._id}`}
              className="relative rounded-full size-10"
            >
              <img
                src={
                  userChat.avatar
                    ? `${Config.BACKEND_URL}${userChat.avatar}`
                    : "/user.png"
                }
                className="object-cover size-full rounded-full"
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </Link>
            <div>
              <Link to={`/profile/${userChat._id}`} className="text-base">
                {`${userChat.fullName}`}
              </Link>
              {isOnline && (
                <span className="text-green-500 block text-[13px]">
                  Đang hoạt động
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
              onClick={handleMinimize}
            >
              <Minus />
            </button>
            <button
              className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
              onClick={onClose}
            >
              <X />
            </button>
          </div>
        </div>

        {/* Chat content */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isMinimized ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
          }`}
        >
          <div className="flex flex-col gap-2 p-2 min-h-72 max-h-96 overflow-y-auto text-sm">
            {messages.map((msg) => {
              const isMyMessage = msg.senderId === currentUser?._id;
              return (
                <div
                  key={msg._id}
                  className={`flex gap-2 max-w-[75%] ${
                    isMyMessage ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  {!isMyMessage && (
                    <img
                      src={`${Config.BACKEND_URL}${userChat.avatar}`}
                      alt={`${userChat.fullName}`}
                      className="w-8 h-8 rounded-full object-cover self-end"
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-gray-500 text-xs ${
                        isMyMessage ? "self-end" : "self-start"
                      }`}
                    >
                      {formatTimeToHourMinute(msg.createdAt)}
                    </span>
                    <p
                      className={`p-2 rounded-lg text-sm ${
                        isMyMessage ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 flex items-center gap-2 border-t border-gray-200">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-300"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer transition"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
