import { useState } from "react";
import emotions from "../data/emotion";

function EmotionBar({ onReact }) {
    const [hoveredEmotion, setHoveredEmotion] = useState(null);

    return (
        <div className="flex gap-1 bg-white rounded-full shadow-md border border-gray-200 relative z-40">
            {emotions.map((emotion) => (
                <div
                    key={emotion.id}
                    className="relative size-12 transition-transform transform hover:scale-125 cursor-pointer"
                    onMouseEnter={() => setHoveredEmotion(emotion.id)} // Hiển thị tooltip khi hover
                    onMouseLeave={() => setHoveredEmotion(null)} // Ẩn tooltip khi rời chuột
                    onClick={() => onReact(emotion)} // Gửi cảm xúc về PostCard
                >
                    <img
                        src={emotion.icon}
                        alt={emotion.name}
                        className="w-full h-full object-contain"
                    />
                    {/* Tooltip */}
                    {hoveredEmotion === emotion.id && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-100 transition-all bg-black text-gray-300 text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none">
                            {emotion.name}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default EmotionBar;