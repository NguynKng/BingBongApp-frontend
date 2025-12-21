import { useState, useMemo } from "react";
import { Ellipsis, Expand, Search, SquarePen } from "lucide-react";
import { useGetChats } from "../hooks/useChats";
import SpinnerLoading from "./SpinnerLoading";
import useAuthStore from "../store/authStore";
import { getBackendImgURL } from "../utils/helper";
import CreateGroupChatDropdown from "./CreateGroupChatDropdown";

function DropdownChat({ onToggleChat, onClose }) {
  const { messages, loading, updateMessage } = useGetChats();
  const { onlineUsers, user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox");
  const isPrivateChat = (chat) => chat.type === "private";

  const filteredMessages = useMemo(() => {
    return messages.filter((chat) => {
      let userChat = null;

      switch (chat.type) {
        case "private":
          userChat = chat.participants.find((p) => p._id !== user._id);
          return userChat?.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        case "group":
          userChat = chat;
          return chat.groupName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        case "shop":
          userChat = chat.shopId;
          return userChat?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        case "shop_channel":
          userChat = chat.shopId;
          return userChat?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "fanpage":
          userChat = chat.fanpageId;
          return userChat?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        case "AI":
          userChat = chat;
          return chat.groupName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        default:
          return false;
      }
    });
  }, [messages, searchTerm, user._id]);

  const inboxMessages = useMemo(
    () => filteredMessages.filter((chat) => isPrivateChat(chat)),
    [filteredMessages]
  );
  const groupMessages = useMemo(
    () => filteredMessages.filter((chat) => !isPrivateChat(chat)),
    [filteredMessages]
  );

  function renderChats(list) {
    if (!list || list.length === 0)
      return (
        <p className="text-center text-gray-500 text-sm dark:text-gray-300">
          No chats found.
        </p>
      );

    return list.map((chat) => {
      let displayAvatar = "";
      let displayName = "";
      let onlineIndicator = false;

      // ------------------------------------------------------
      // Xác định người còn lại nếu là private
      // ------------------------------------------------------
      const otherUser =
        chat.type === "private"
          ? chat.participants.find((p) => p._id !== user._id)
          : null;

      const isSentByMe = chat.lastMessage?.sender._id === user._id;

      switch (chat.type) {
        // ===============================
        // PRIVATE
        // ===============================
        case "private":
          displayAvatar = getBackendImgURL(otherUser?.avatar);
          displayName = otherUser?.fullName;
          onlineIndicator = otherUser && onlineUsers.includes(otherUser._id);
          break;

        // ===============================
        // GROUP
        // ===============================
        case "group":
          displayAvatar = getBackendImgURL(chat.avatar);
          displayName = chat.groupName;
          break;

        // ===============================
        // SHOP
        // ===============================
        case "shop": {
          const shop = chat.shopId;

          const ownerId = shop.owner;
          const otherPerson =
            chat.participants.find((p) => p._id !== ownerId) || null;

          if (user._id === ownerId) {
            // ---- Bạn là chủ shop ----
            displayAvatar = getBackendImgURL(otherPerson?.avatar);
            displayName = `${otherPerson.fullName} • ${shop.name}`;
            onlineIndicator =
              otherPerson && onlineUsers.includes(otherPerson._id);
          } else {
            // ---- Bạn là khách ----
            displayAvatar = getBackendImgURL(shop.avatar);
            displayName = shop.name;
          }
          break;
        }

        // ===============================
        // SHOP CHANNEL
        // ===============================
        case "shop_channel":
          displayAvatar = getBackendImgURL(chat.shopId.avatar);
          displayName = `${chat.shopId.name} (channel)`;
          break;

        // ===============================
        // FANPAGE
        // ===============================
        case "fanpage":
          displayAvatar = getBackendImgURL(chat.fanpageId.avatar);
          displayName = chat.fanpageId.name;
          break;

        // ===============================
        // AI
        // ===============================
        case "AI":
          displayAvatar = getBackendImgURL(chat.avatar);
          displayName = chat.groupName;
          break;
      }

      return (
        <div
          key={chat._id}
          onClick={() => {
            onToggleChat(chat);
            onClose();
          }}
          className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md dark:hover:bg-[rgb(52,52,52)]"
        >
          {/* Avatar */}
          <div className="relative size-10 rounded-full">
            <img
              src={displayAvatar}
              className="size-full rounded-full object-cover"
            />

            {/* Online indicator — chỉ private + shop (nếu owner) */}
            {onlineIndicator && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
              {displayName}
            </h2>
            <p className="text-xs text-gray-500 truncate dark:text-white">
              {isSentByMe ? "You: " : ""}
              {chat.lastMessage?.media.length > 0
                ? `sent ${chat.lastMessage.media.length} media`
                : chat.lastMessage?.text || "No messages yet."}
            </p>
          </div>
        </div>
      );
    });
  }

  return (
    <>
      <div className="absolute top-[110%] right-0 min-w-96 rounded-xl shadow-2xl bg-white p-4 space-y-5 animate-fade-in transform transition-all duration-300 ease-in-out dark:bg-[rgb(35,35,35)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md dark:text-white">
            Chats
          </h1>
          <div className="relative flex items-center gap-2">
            <div className="bg-transparent hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer transition duration-200 transform hover:scale-110 dark:hover:bg-[rgb(52,52,52)]">
              <Ellipsis className="size-5 text-gray-500" />
            </div>
            <div className="bg-transparent hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer transition duration-200 transform hover:scale-110 dark:hover:bg-[rgb(52,52,52)]">
              <Expand className="size-5 text-gray-500" />
            </div>
            <div
              className="bg-transparent hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer transition duration-200 transform dark:hover:bg-[rgb(52,52,52)]"
              onClick={() => setShowGroupModal(!showGroupModal)}
            >
              <SquarePen className="size-5 text-gray-500" />
            </div>
            {showGroupModal && (
              <CreateGroupChatDropdown
                currentUser={user}
                onClose={() => setShowGroupModal(false)}
                onCreated={(newGroup) => updateMessage(newGroup)}
              />
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute size-5 top-1/2 -translate-y-1/2 left-3 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search in messenger"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-gray-900 w-full py-2 pl-10 bg-gray-100 rounded-full focus:outline-none dark:bg-[rgb(52,52,53)] text-sm shadow-inner dark:placeholder:text-gray-300 dark:text-gray-300"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2">
          <h1
            onClick={() => setActiveTab("inbox")}
            className={`py-2 px-4 font-medium cursor-pointer rounded-full shadow-sm transition 
              ${
                activeTab === "inbox"
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  : "bg-transparent text-gray-800 hover:bg-gray-200 dark:text-white dark:hover:bg-[rgb(52,52,52)]"
              }`}
          >
            Inbox
          </h1>
          <h1
            onClick={() => setActiveTab("community")}
            className={`py-2 px-4 font-medium cursor-pointer rounded-full shadow-sm transition 
              ${
                activeTab === "community"
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  : "bg-transparent text-gray-800 hover:bg-gray-200 dark:text-white dark:hover:bg-[rgb(52,52,52)]"
              }`}
          >
            Community
          </h1>
        </div>

        {/* Chat List */}
        <div className="space-y-2 min-h-[28rem] custom-scroll overflow-y-auto pr-1 custom-scrollbar">
          {loading ? (
            <SpinnerLoading />
          ) : (
            <>
              {activeTab === "inbox" && renderChats(inboxMessages)}
              {activeTab === "community" && renderChats(groupMessages)}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default DropdownChat;
