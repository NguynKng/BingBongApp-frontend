import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { Minus, Send, X } from "lucide-react";
import Config from "../envVars";
import { useSocket } from "../hooks/useSocket";
import useAuthStore from "../store/authStore";
import { useGetChats } from "../hooks/useChats";

function ChatBox({ onClose, userChat }) {
    const socket = useSocket();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isMinimized, setIsMinimized] = useState(false);
    const { user: currentUser } = useAuthStore();
    const messagesEndRef = useRef(null);
    const { updateMessage } = useGetChats()

    const getRoomId = useCallback((user1, user2) => {
        return [user1, user2].sort().join("-");
    }, []);

    const roomId = useMemo(() => {
        if (!currentUser || !userChat) return "";
        return getRoomId(currentUser._id, userChat._id);
    }, [currentUser, userChat, getRoomId]);

    useEffect(() => {
        if (!socket || !currentUser || !userChat || !roomId) return;

        socket.emit("joinRoom", roomId);

        const handleLoadHistory = (history) => {
            if (Array.isArray(history)) {
                const formatted = history.map((msg) => ({
                    ...msg,
                    timestamp: new Date(msg.createdAt), // sửa timestamp
                }));
                setMessages(formatted);
            }
        };

        const handleReceiveMessage = ({
            _id,
            senderId,
            receiverId,
            text,
            roomId,
            timestamp,
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
                        roomId,
                        timestamp: new Date(timestamp),
                    },
                ]);
            }
        };

        socket.on("loadChatHistory", handleLoadHistory);
        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("newMessage", (newMessage) => {
            console.log('newMessage', newMessage);
            updateMessage(newMessage, newMessage.senderId === currentUser._id);
        });

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("loadChatHistory", handleLoadHistory);
            socket.off("newMessage");
        };
    }, [socket, currentUser, userChat, roomId, updateMessage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages]);

    const handleSend = useCallback(() => {
        if (!message.trim() || !currentUser || !socket || !roomId) return;

        const data = {
            senderId: currentUser._id,
            receiverId: userChat._id,
            text: message,
            roomId: roomId,
            timestamp: new Date(),
        };

        socket.emit("sendMessage", data);
        setMessage("");
    }, [message, currentUser, socket, userChat._id, roomId]);

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <div className="fixed right-20 bottom-0 w-80 z-50 transform transition-all duration-300 ease-out hover:scale-[1.01]">
            <div className="rounded-t-xl shadow-xl overflow-hidden bg-white border border-gray-200">
                {/* Header */}
                <div className="px-4 py-2 font-semibold flex justify-between items-center 
                    bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <div className="flex items-center gap-2">
                        <img src={userChat.avatar ? `${Config.BACKEND_URL}${userChat.avatar}` : '/user.png'} className="object-cover size-8 rounded-full border" />
                        <span className="text-base">{userChat.fullName}</span>
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
                        {messages.map((msg) => (
                            <p
                                key={msg._id}
                                className={`p-2 rounded-lg max-w-[75%] ${
                                    msg.senderId === currentUser._id
                                        ? "bg-blue-500 text-white self-end"
                                        : "bg-gray-200 self-start"
                                }`}
                            >
                                {msg.text}
                            </p>
                        ))}
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
