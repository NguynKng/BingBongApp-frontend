import { useState } from "react";
import { Minus, Send, X } from "lucide-react";

function ChatBox({ onClose }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isMinimized, setIsMinimized] = useState(false);

    const handleSend = () => {
        if (message.trim() === "") return;
        setMessages([...messages, { sender: "me", content: message }]);
        setMessage("");
    };

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
                        <img src="/user.png" className="object-cover size-8 rounded-full border" />
                        <span className="text-base">{"User"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="p-1 rounded-full hover:bg-white/20 transition"
                            onClick={handleMinimize}
                        >
                            <Minus />
                        </button>
                        <button
                            className="p-1 rounded-full hover:bg-white/20 transition"
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
                    <div className="p-2 min-h-72 max-h-96 overflow-y-auto space-y-2 text-sm">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded-lg max-w-[75%] ${
                                    msg.sender === "me"
                                        ? "ml-auto bg-blue-500 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                {msg.content}
                            </div>
                        ))}
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
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
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
