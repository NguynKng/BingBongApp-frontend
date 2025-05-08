import { Ellipsis, Expand, Search, SquarePen } from "lucide-react";
import { useGetChats } from "../hooks/useChats";
import SpinnerLoading from "./SpinnerLoading";
import Config from "../envVars";
import { formatTime } from "../utils/timeUtils";
import useAuthStore from "../store/authStore";

function DropdownChat({ onToggleChat }) {
  const { messages, loading } = useGetChats();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="absolute top-[110%] right-0 min-w-96 rounded-xl shadow-2xl border border-gray-200 bg-white p-4 space-y-5 animate-fade-in transform transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
          Đoạn chat
        </h1>
        <div className="flex items-center gap-2">
          <div className="bg-white hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer transition duration-200 transform hover:scale-110">
            <Ellipsis className="size-5 text-gray-500" />
          </div>
          <div className="bg-white hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer transition duration-200 transform hover:scale-110">
            <Expand className="size-5 text-gray-500" />
          </div>
          <div className="bg-white hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer transition duration-200 transform hover:scale-110">
            <SquarePen className="size-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute size-5 top-2.5 left-3 text-gray-500" />
        <input
          type="text"
          placeholder="Tìm kiếm trên messenger"
          className="text-gray-900 w-full py-2 pl-10 bg-gray-100 rounded-full focus:outline-none text-sm shadow-inner"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <h1 className="py-2 px-4 bg-blue-100 font-medium hover:bg-blue-200 cursor-pointer text-blue-600 rounded-full shadow-sm transition">
          Hộp thư
        </h1>
        <h1 className="py-2 px-4 bg-gray-100 font-medium cursor-pointer hover:bg-gray-200 text-gray-800 rounded-full shadow-sm transition">
          Cộng đồng
        </h1>
      </div>

      {/* Chat List */}
      <div className="space-y-2 min-h-[28rem] custom-scroll overflow-y-auto pr-1 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center">
            <SpinnerLoading />
          </div>
        ) : (
          messages.map((chat) => (
            <div
              key={chat.participant._id}
              onClick={() => onToggleChat(chat.participant)}
              className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
            >
              <div className="relative size-10 rounded-full">
                <img
                  src={chat.participant.avatar ? `${Config.BACKEND_URL}${chat.participant.avatar}` : "/user.png"}
                  alt={`user avatar`}
                  className="size-full rounded-full object-cover"
                />
                {onlineUsers.includes(chat.participant._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-800">
                  {chat.participant.fullName}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {chat.lastMessage.isSentByMe ? "Bạn: " : ""}
                  {chat?.lastMessage.text.length > 30
                    ? `${chat.lastMessage.text.slice(0, 30)}...`
                    : chat.lastMessage.text}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {formatTime(chat.lastMessage.createdAt)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DropdownChat;
