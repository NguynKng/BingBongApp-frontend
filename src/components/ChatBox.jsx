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
        <div className="fixed right-20 bottom-0 w-80 bg-white border border-gray-300 rounded-t-md shadow-lg flex flex-col overflow-hidden z-50">
            {/* Header */}
            <div className="px-4 py-2 font-semibold flex justify-between items-center bg-gray-100">
                <div className="flex items-center gap-2 text-black">
                    <img src="/user.png" className="object-cover size-8" />
                    <span className="text-base">{"User"}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-500">
                    <button
                        className="p-1 rounded-full hover:bg-gray-200 transition duration-200 cursor-pointer"
                        onClick={handleMinimize}
                    >
                        <Minus />
                    </button>
                    <button
                        className="p-1 rounded-full hover:bg-gray-200 transition duration-200 cursor-pointer"
                        onClick={onClose}
                    >
                        <X />
                    </button>
                </div>
            </div>

            {/* Chat content: only show if not minimized */}
            {!isMinimized && (
                <>
                    <div className="flex-1 overflow-y-auto p-2 min-h-72 space-y-2 border-y-2 border-gray-200 text-sm">
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

                    <div className="p-2 flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 px-3 py-2 border rounded-full text-sm outline-none"
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
                </>
            )}
        </div>
    );
}

export default ChatBox;
