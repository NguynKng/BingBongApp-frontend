import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon, Minus, Phone, Send, Video, X } from "lucide-react";
import Config from "../envVars";
import useAuthStore from "../store/authStore";
import { useGetChats, useGetHistoryChat } from "../hooks/useChats";
import { Link } from "react-router-dom";
import { formatTimeToDateAndHour, formatTimeToHourMinute } from "../utils/timeUtils";
import { chatAPI, messageAPI } from "../services/api";
import ReactMarkdown from "react-markdown";
import { useImagePreview } from "../hooks/useImagePreview";
import SpinnerLoading from "./SpinnerLoading";
import { getBackendImgURL } from "../utils/helper";

function ChatBox({ onClose, chat }) {
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [message, setMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const { user: currentUser, socket, onlineUsers } = useAuthStore();
  const messagesEndRef = useRef(null);
  const isAIChat = chat?._id === "bingbong-ai";

  const userChat = chat.isGroup ? null : chat.participants.find((p) => p._id !== currentUser._id);
  const isOnline = userChat ? onlineUsers.includes(userChat._id) : false;

  const { messages, setMessages, addAIMessage, loading } = useGetHistoryChat(chat?._id, isAIChat);
  const { updateMessage } = useGetChats();
  const { openImagePreview, ImagePreviewModal } = useImagePreview();

  // Socket events
  useEffect(() => {
    if (!socket || !currentUser || !chat) return;

    const handleReceiveMessage = (message) => {
      if (!message?.chatId?._id) return;
      if (String(message.chatId._id) === String(chat._id)) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleNewMessage = (payload) => {
      updateMessage(payload.chat);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, currentUser, chat, updateMessage, setMessages]);

  useEffect(() => {
    if (!isMinimized) {
      const timer = setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "auto" }), 50);
      return () => clearTimeout(timer);
    }
  }, [messages, isMinimized]);

  const handleSend = useCallback(async () => {
    if ((!message.trim() && !images.length) || (!currentUser)) return;

    const data = { senderId: currentUser._id, receiverId: userChat?._id, text: message, createdAt: new Date() };

    if (isAIChat) {
      setIsLoadingAIResponse(true);
      addAIMessage(data);
      setMessage("");
      const aiReply = await chatAPI.getAIResponse(message);
      if (aiReply.success) {
        addAIMessage({ senderId: "bingbong-ai", receiverId: currentUser._id, text: aiReply.data, createdAt: new Date() });
      }
      setIsLoadingAIResponse(false);
    } else {
      try {
        const formSendMessage = new FormData();
        formSendMessage.append("chatId", chat._id);
        formSendMessage.append("text", message);
        images.forEach((img) => formSendMessage.append("images", img));
        const response = await messageAPI.sendMessage(formSendMessage);
        if (response.success) {
          setMessage("");
          setImages([]);
          setImagesPreview([]);
        }
      } catch (error) {
        console.error("❌ Error sending message:", error);
      }
    }
  }, [message, currentUser, userChat, isAIChat, addAIMessage, images, chat._id]);

  const handleMinimize = () => setIsMinimized(!isMinimized);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setImagesPreview((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleCall = () => {
    if (!socket || !userChat) return;
    const callId = `${currentUser._id}_${userChat._id}_${Date.now()}`;
    socket.emit("call-user", {
      to: userChat._id,
      from: currentUser._id,
      callId,
      metadata: { fullName: currentUser.fullName, avatar: currentUser.avatar },
      toData: { fullName: userChat.fullName, avatar: userChat.avatar },
    });
  };

  return (
    <>
      <ImagePreviewModal />
      <div className="fixed right-10 bottom-0 lg:w-92 z-50 transform transition-all duration-300 ease-out hover:scale-[1.01]">
        <div className="rounded-t-xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-2 font-semibold rounded-t-xl flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex items-center gap-2">
              {chat.isGroup ? (
                <>
                  <img src={getBackendImgURL(chat.avatar)} className="w-8 h-8 rounded-full object-cover" alt={chat.groupName} />
                  <div>
                    <span className="text-[15px]">{chat.groupName}</span>
                    <span className="text-sm text-gray-300 block">{chat.participants.length} members</span>
                  </div>
                </>
              ) : (
                <>
                  <Link to={isAIChat ? "#" : `/profile/${userChat.slug}`} className="relative rounded-full size-8">
                    <img src={getBackendImgURL(userChat?.avatar)} className="object-cover size-full rounded-full" />
                    {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                  </Link>
                  <div>
                    <Link to={isAIChat ? "#" : `/profile/${userChat.slug}`} className="text-[15px]">{userChat?.fullName}</Link>
                    {isOnline && <span className="text-green-300 block text-[13px]">Online</span>}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {!isAIChat && !chat.isGroup && (
                <div className="flex items-center gap-1">
                  <button onClick={handleToggleCall} className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"><Phone className="size-5 fill-white" /></button>
                  <button className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"><Video className="size-5 fill-white" /></button>
                </div>
              )}
              <button onClick={handleMinimize} className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"><Minus /></button>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"><X /></button>
            </div>
          </div>

          {/* Chat content */}
          <div className={`transition-all duration-300 ease-in-out ${isMinimized ? "max-h-0 opacity-0" : "h-[26rem] opacity-100"}`}>
            <div className="flex flex-col h-full">
              <div className="flex-1 flex flex-col gap-2 p-2 overflow-y-auto text-sm dark:text-gray-200">
                {loading ? <SpinnerLoading /> : messages.map((msg, index) => {
                  const isMyMessage = msg.sender._id === currentUser._id;
                  const senderName = chat.isGroup ? msg.sender.fullName : null;
                  const senderAvatar = chat.isGroup ? getBackendImgURL(msg.sender.avatar) : getBackendImgURL(userChat?.avatar);

                  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
                  const currentDate = formatDate(msg.createdAt);
                  const prevDate = index > 0 ? formatDate(messages[index - 1].createdAt) : null;
                  const shouldShowDate = currentDate !== prevDate;

                  return (
                    <div key={msg._id + index}>
                      {shouldShowDate && <div className="text-center text-xs text-gray-500 mb-2 mt-1">{formatTimeToDateAndHour(msg.createdAt)}</div>}
                      <div className={`flex gap-2 ${isMyMessage ? "justify-end" : "justify-start"}`}>
                        {!isMyMessage && <img src={senderAvatar} className="w-8 h-8 rounded-full object-cover self-start" alt="Avatar" />}
                        <div className={`flex flex-col max-w-[75%] ${isMyMessage ? "self-end items-end" : "self-start items-start"}`}>
                          {msg.text && (
                            <div className={`px-4 py-2 rounded-2xl text-sm break-words ${isMyMessage ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-[rgb(52,52,52)] dark:text-white"}`}
                              style={{ wordBreak: "break-word", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                              {isAIChat && msg.senderId === "bingbong-ai" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                            </div>
                          )}
                          {msg.media && msg.media.length > 0 && (
                            <div className={`gap-2 mt-2 ${msg.media.length >= 3 ? "grid grid-cols-3" : "flex flex-col"}`}>
                              {msg.media.map((src, idx) => <img key={idx} onClick={() => openImagePreview(msg.media, idx)} src={getBackendImgURL(src)} alt={`preview-${idx}`} className={`object-cover cursor-pointer rounded-lg border border-gray-300 ${msg.media.length >= 3 ? "w-full h-20" : "w-full h-40"}`} />)}
                            </div>
                          )}
                          <span className={`text-xs mt-1 text-gray-400 ${isMyMessage ? "pr-1" : "pl-1"}`}>{formatTimeToHourMinute(msg.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isAIChat && isLoadingAIResponse && (
                  <div className="flex gap-2 justify-start items-start">
                    <img src={`${Config.BACKEND_URL}/images/bingbong-ai.png`} className="w-8 h-8 rounded-full object-cover" alt="AI" />
                    <div className="flex flex-col max-w-[75%] self-start items-start">
                      <div className="px-4 py-2 rounded-2xl text-sm bg-gray-100 dark:bg-[rgb(52,52,52)] text-gray-500 dark:text-gray-300">
                        <div className="flex space-x-1">
                          <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                          <span className="animate-bounce [animation-delay:-0.15s]">.</span>
                          <span className="animate-bounce">.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Preview ảnh */}
              {imagesPreview.length > 0 && (
                <div className="px-2 py-2 flex gap-2 overflow-x-auto border-t border-gray-200">
                  {imagesPreview.map((src, index) => (
                    <div key={index} className="relative w-12 h-12 flex-shrink-0">
                      <img src={src} alt={`preview-${index}`} className="w-full h-full object-cover rounded-lg border border-gray-300" />
                      <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-2 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" id="image-upload" />
                  <label htmlFor="image-upload" className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer transition">
                    <ImageIcon className="size-4" />
                  </label>
                </div>

                <input type="text" placeholder="Nhập tin nhắn..." className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                <button onClick={handleSend} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer transition">
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
