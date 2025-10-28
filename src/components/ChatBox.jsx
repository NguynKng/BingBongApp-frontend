import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon, Minus, Phone, Send, Video, X } from "lucide-react";
import Config from "../envVars";
import useAuthStore from "../store/authStore";
import { useGetChats, useGetHistoryChat } from "../hooks/useChats";
import { Link } from "react-router-dom";
import {
  formatTimeToDateAndHour,
  formatTimeToHourMinute,
} from "../utils/timeUtils";
import { chatApi } from "../services/api";
import ReactMarkdown from "react-markdown";
import { useImagePreview } from "../hooks/useImagePreview";
import SpinnerLoading from "./SpinnerLoading";

function ChatBox({ onClose, userChat }) {
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [message, setMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const { user: currentUser, socket, onlineUsers } = useAuthStore();
  const messagesEndRef = useRef(null);
  const isOnline = onlineUsers.includes(userChat?._id);
  const isAIChat = userChat?._id === "bingbong-ai";
  const { messages, setMessages, addAIMessage, loading } = useGetHistoryChat(
    userChat?._id,
    isAIChat
  );
  const { updateMessage } = useGetChats();
  const { openImagePreview, ImagePreviewModal } = useImagePreview();

  useEffect(() => {
    if (!socket || !currentUser || !userChat) return;

    const handleReceiveMessage = ({
      _id,
      senderId,
      receiverId,
      text,
      media,
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
            media: media || [],
            createdAt: new Date(createdAt),
          },
        ]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("newMessage", (newMessage) => {
      updateMessage(newMessage, newMessage.senderId === currentUser._id);
    });

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("newMessage");
    };
  }, [socket, currentUser, userChat, updateMessage, setMessages]);

  useEffect(() => {
    if (!isMinimized) {
      // Chờ 1 chút cho DOM render xong
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [messages, isMinimized]);

  const handleSend = useCallback(async () => {
    if ((!message.trim() && !images.length) || !currentUser) return;

    const data = {
      senderId: currentUser._id,
      receiverId: userChat._id,
      text: message,
      createdAt: new Date(),
    };

    if (isAIChat) {
      setIsLoadingAIResponse(true);
      addAIMessage(data); // Cập nhật vào store
      //setMessages(useChatStore.getState().AIMessages); // Cập nhật UI
      setMessage("");

      const aiReply = await chatApi.getAIResponse(message);
      if (aiReply.success) {
        const aiMessage = {
          senderId: "bingbong-ai",
          receiverId: currentUser._id,
          text: aiReply.data,
          createdAt: new Date(),
        };
        addAIMessage(aiMessage); // Cập nhật vào store
        //setMessages(useChatStore.getState().AIMessages); // Cập nhật UI
      }

      setIsLoadingAIResponse(false);
    } else {
      try {
        const formSendMessage = new FormData();
        formSendMessage.append("senderId", currentUser._id);
        formSendMessage.append("receiverId", userChat._id);
        formSendMessage.append("text", message);
        images.forEach((img) => {
          formSendMessage.append("images", img);
        });
        const response = await chatApi.sendMessage(formSendMessage);
        if (response.success) {
          setMessage("");
          setImages([]);
          setImagesPreview([]);
        }
      } catch (error) {
        console.error("❌ Error sending message:", error);
      }
    }
  }, [message, currentUser, userChat._id, isAIChat, addAIMessage, images]);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...files]);
    setImagesPreview((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagesPreview((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleToggleCall = () => {
    if (!socket) return;

    const callId = `${currentUser._id}_${userChat._id}_${Date.now()}`;

    const payload = {
      to: userChat._id,
      from: currentUser._id,
      callId,
      metadata: {
        fullName: currentUser.fullName,
        avatar: currentUser.avatar,
      },
      toData: {
        fullName: userChat.fullName,
        avatar: userChat.avatar,
      },
    };

    // emit to server — server should forward to callee and also emit "outgoing-call" back to caller
    socket.emit("call-user", payload);
    // do not open modal here — IncomingCall listens for "outgoing-call" / "incoming-call"
  };

  return (
    <>
      <ImagePreviewModal />
      <div className="fixed right-10 bottom-0 lg:w-92 z-50 transform transition-all duration-300 ease-out hover:scale-[1.01]">
        <div className="rounded-t-xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-2 font-semibold rounded-t-xl flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex items-center gap-2">
              <Link
                to={isAIChat ? `#` : `/profile/${userChat.slug}`}
                className="relative rounded-full size-8"
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
                  to={isAIChat ? `#` : `/profile/${userChat.slug}`}
                  className="text-[15px] text-white"
                >
                  {`${userChat.fullName}`}
                </Link>
                {isAIChat && (
                  <span className="text-sm text-gray-300 block">
                    dùng Gemini 2.5
                  </span>
                )}
                {isOnline && (
                  <span className="text-green-300 block text-[13px]">
                    Đang hoạt động
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!isAIChat && (
                <div className="flex items-center gap-1">
                  <button
                    className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
                    onClick={handleToggleCall}
                  >
                    <Phone className="size-5 fill-white" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer">
                    <Video className="size-5 fill-white" />
                  </button>
                </div>
              )}
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
            className={`transition-all duration-300 ease-in-out ${
              isMinimized ? "max-h-0 opacity-0" : "h-[26rem] opacity-100"
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex-1 flex flex-col gap-2 p-2 overflow-y-auto text-sm dark:text-gray-200">
                {loading ? (
                  <SpinnerLoading />
                ) : (
                  messages.map((msg, index) => {
                    const isMyMessage = msg.senderId === currentUser?._id;

                    const formatDate = (dateStr) => {
                      return new Date(dateStr).toLocaleDateString(); // or use dayjs(dateStr).format("YYYY-MM-DD")
                    };

                    const currentDate = formatDate(msg.createdAt);
                    const prevDate =
                      index > 0
                        ? formatDate(messages[index - 1].createdAt)
                        : null;
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
                            {msg.text && (
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
                                {isAIChat && msg.senderId === "bingbong-ai" ? (
                                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                                ) : (
                                  msg.text
                                )}
                              </div>
                            )}
                            {msg.media && msg.media.length > 0 && (
                              <div
                                className={`gap-2 mt-2 ${
                                  msg.media.length >= 3
                                    ? "grid grid-cols-3" // 3 or more
                                    : "flex flex-col" // 1 or 2 images
                                }`}
                              >
                                {msg.media.map((src, index) => (
                                  <img
                                    onClick={() =>
                                      openImagePreview(msg.media, index)
                                    }
                                    key={index}
                                    src={`${Config.BACKEND_URL}${src}`}
                                    alt={`preview-${index}`}
                                    className={`object-cover cursor-pointer rounded-lg border border-gray-300 ${
                                      msg.media.length >= 3
                                        ? "w-full h-20"
                                        : "w-full h-40"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}

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
                  })
                )}
                {/* 👇 Hiển thị khi đang đợi AI trả lời */}
                {isAIChat && isLoadingAIResponse && (
                  <div className="flex gap-2 justify-start items-start">
                    <img
                      src={`${Config.BACKEND_URL}/images/bingbong-ai.png`}
                      className="w-8 h-8 rounded-full object-cover"
                      alt="AI"
                    />
                    <div className="flex flex-col max-w-[75%] self-start items-start">
                      <div className="px-4 py-2 rounded-2xl text-sm bg-gray-100 dark:bg-[rgb(52,52,52)] text-gray-500 dark:text-gray-300">
                        <div className="flex space-x-1">
                          <span className="animate-bounce [animation-delay:-0.3s]">
                            .
                          </span>
                          <span className="animate-bounce [animation-delay:-0.15s]">
                            .
                          </span>
                          <span className="animate-bounce">.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
              {/* Preview ảnh cố định chiều cao, cuộn ngang */}
              {imagesPreview.length > 0 && (
                <div className="px-2 py-2 flex gap-2 overflow-x-auto border-t border-gray-200">
                  {imagesPreview.map((src, index) => (
                    <div
                      key={index}
                      className="relative w-12 h-12 flex-shrink-0"
                    >
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="p-2 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer transition"
                  >
                    <ImageIcon className="size-4" />
                  </label>
                </div>

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
      </div>
    </>
  );
}

export default ChatBox;
