import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Send, X } from "lucide-react";
import Config from "../envVars";
import useAuthStore from "../store/authStore";
import { useGetChats } from "../hooks/useChats";
import { Link } from "react-router-dom";
import {
  formatTimeToDateAndHour,
  formatTimeToHourMinute,
} from "../utils/timeUtils";

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
    <div className="fixed right-10 bottom-0 w-88 z-50 transform transition-all duration-300 ease-out hover:scale-[1.01]">
      <div className="rounded-t-xl shadow-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
              <Link
                to={`/profile/${userChat._id}`}
                className="text-base text-white"
              >
                {`${userChat.fullName}`}
              </Link>
              {isOnline && (
                <span className="text-green-300 block text-[13px]">
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
          <div className="flex flex-col gap-2 p-2 min-h-72 max-h-96 overflow-y-auto text-sm dark:text-gray-200">
            {messages.map((msg, index) => {
              const isMyMessage = msg.senderId === currentUser?._id;

              const formatDate = (dateStr) => {
                return new Date(dateStr).toLocaleDateString(); // or use dayjs(dateStr).format("YYYY-MM-DD")
              };

              const currentDate = formatDate(msg.createdAt);
              const prevDate =
                index > 0 ? formatDate(messages[index - 1].createdAt) : null;
              const shouldShowDate = currentDate !== prevDate;

              return (
                <div key={msg._id + index}>
                  {shouldShowDate && (
                    <div className="text-center text-xs text-gray-500 mb-2 mt-1">
                      {formatTimeToDateAndHour(msg.createdAt)}
                    </div>
                  )}
                  <div
                    className={`flex gap-2 ${
                      isMyMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMyMessage && (
                      <img
                        src={
                          userChat.avatar
                            ? `${Config.BACKEND_URL}${userChat.avatar}`
                            : "/user.png"
                        }
                        className="w-8 h-8 rounded-full object-cover self-start"
                        alt="Avatar"
                      />
                    )}
                    <div
                      className={`flex flex-col max-w-[75%] ${
                        isMyMessage
                          ? "self-end items-end"
                          : "self-start items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm break-words ${
                          isMyMessage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-[rgb(52,52,52)] dark:text-white"
                        }`}
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                        }}
                      >
                        {msg.text}
                      </div>
                      <span
                        className={`text-xs mt-1 text-gray-400 ${
                          isMyMessage ? "pr-1" : "pl-1"
                        }`}
                      >
                        {formatTimeToHourMinute(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
