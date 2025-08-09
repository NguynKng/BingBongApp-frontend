import { useState, useMemo } from "react";
import { Ellipsis, Expand, Search, SquarePen } from "lucide-react";
import { useGetChats } from "../hooks/useChats";
import SpinnerLoading from "./SpinnerLoading";
import Config from "../envVars";
import { formatTimeToDateOrHour } from "../utils/timeUtils";
import useAuthStore from "../store/authStore";

function DropdownChat({ onToggleChat }) {
  const { messages, loading } = useGetChats();
  const { onlineUsers } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMessages = useMemo(() => {
    return messages.filter((chat) =>
      chat.participant.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messages, searchTerm]);

  return (
    <div className="absolute top-[110%] right-0 min-w-96 rounded-xl shadow-2xl bg-white p-4 space-y-5 animate-fade-in transform transition-all duration-300 ease-in-out dark:bg-[rgb(35,35,35)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md dark:text-white">
          Đoạn chat
        </h1>
        <div className="flex items-center gap-2">
          <div className="bg-transparent hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer transition duration-200 transform hover:scale-110 dark:hover:bg-[rgb(52,52,52)]">
            <Ellipsis className="size-5 text-gray-500" />
          </div>
          <div className="bg-transparent hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer transition duration-200 transform hover:scale-110 dark:hover:bg-[rgb(52,52,52)]">
            <Expand className="size-5 text-gray-500" />
          </div>
          <div className="bg-transparent hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer transition duration-200 transform hover:scale-110 dark:hover:bg-[rgb(52,52,52)]">
            <SquarePen className="size-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute size-5 top-2.5 left-3 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm trên messenger"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-gray-900 w-full py-2 pl-10 bg-gray-100 rounded-full focus:outline-none dark:bg-[rgb(52,52,53)] text-sm shadow-inner dark:placeholder:text-gray-300 dark:text-gray-300"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <h1 className="py-2 px-4 bg-blue-100 font-medium hover:bg-blue-200 cursor-pointer text-blue-600 rounded-full shadow-sm transition dark:hover:bg-blue-300">
          Hộp thư
        </h1>
        <h1 className="py-2 px-4 bg-transparent font-medium cursor-pointer hover:bg-gray-200 text-gray-800 rounded-full shadow-sm transition dark:hover:bg-[rgb(52,52,52)] dark:text-white">
          Cộng đồng
        </h1>
      </div>

      {/* Chat List */}
      <div className="space-y-2 min-h-[28rem] custom-scroll overflow-y-auto pr-1 custom-scrollbar">
        {loading ? (
          <SpinnerLoading />
        ) : filteredMessages.length > 0 ? (
          filteredMessages.map((chat) => (
            <div
              key={chat.participant._id}
              onClick={() => onToggleChat(chat.participant)}
              className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md dark:hover:bg-[rgb(52,52,52)]"
            >
              <div className="relative size-10 rounded-full">
                <img
                  src={
                    chat.participant.avatar
                      ? `${Config.BACKEND_URL}${chat.participant.avatar}`
                      : "/user.png"
                  }
                  alt="user avatar"
                  className="size-full rounded-full object-cover"
                />
                {onlineUsers.includes(chat.participant._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                  {chat.participant.fullName}
                </h2>
                <p className="text-xs text-gray-500 truncate dark:text-white">
                  {chat.lastMessage.isSentByMe ? "Bạn: " : ""}
                  {chat.lastMessage?.media && chat.lastMessage.media.length > 0
                    ? `đã gửi ${chat.lastMessage.media.length} hình ảnh`
                    : chat?.lastMessage.text?.length > 30
                    ? `${chat.lastMessage.text.slice(0, 30)}...`
                    : chat.lastMessage.text}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {formatTimeToDateOrHour(chat.lastMessage.createdAt)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm dark:text-gray-300">
            Không tìm thấy đoạn chat nào.
          </p>
        )}
      </div>
    </div>
  );
}

export default DropdownChat;
