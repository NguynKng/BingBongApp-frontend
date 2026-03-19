import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageIcon,
  Minus,
  Phone,
  Send,
  Video,
  X,
  Settings,
  UserPlus,
  LogOut,
  Edit2,
  Smile,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import Config from "../envVars";
import useAuthStore from "../store/authStore";
import { useGetChats, useGetHistoryChat } from "../hooks/useChats";
import { useGetProfileBySlug } from "../hooks/useProfile";
import { Link } from "react-router-dom";
import {
  formatTimeToDateAndHour,
  formatTimeToHourMinute,
} from "../utils/timeUtils";
import { messageAPI, chatAPI, userAPI } from "../services/api";
import ReactMarkdown from "react-markdown";
import { useImagePreview } from "../hooks/useImagePreview";
import SpinnerLoading from "./SpinnerLoading";
import { getBackendImgURL } from "../utils/helper";
import { v4 as uuidv4 } from "uuid";

function ChatBox({ onClose, chat }) {
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [message, setMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [userChat, setUserChat] = useState(null);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);
  const { user: currentUser, socket, onlineUsers, theme } = useAuthStore();
  const messagesEndRef = useRef(null);
  const isAIChat = chat?._id === "bingbong-ai";
  const isGroupChat = chat && chat.type === "group";
  const isFanpageChat = chat && chat.type === "fanpage";
  const { profile } = useGetProfileBySlug(currentUser?.slug, {
    enabled: showAddMembersModal && isGroupChat,
  });

  // Update userChat when chat changes
  useEffect(() => {
    if (!chat) {
      setUserChat(null);
      return;
    }

    if (isAIChat) {
      setUserChat(chat);
      return;
    }

    switch (chat.type) {
      case "private":
        setUserChat(chat.participants.find((p) => p._id !== currentUser._id));
        break;

      case "group":
        setUserChat(chat);
        break;

      case "shop":
        setUserChat(chat.shopId);
        break;

      case "shop_channel":
        setUserChat(chat.shopId);
        break;

      case "fanpage":
        setUserChat(chat.fanpageId);
        break;

      default:
        setUserChat(null);
    }
  }, [chat, currentUser, isAIChat]);

  const getProfileLink = () => {
    if (!userChat) return "#";
    switch (chat.type) {
      case "private":
        return `/profile/${userChat.slug}`;
      case "shop":
        return `/shop/${userChat.slug}`;
      case "shop_channel":
        return `/shop/${userChat.slug}`;
      case "fanpage":
        return `/group/${userChat.slug}`;
      default:
        return "#";
    }
  };

  const isOnline = userChat ? onlineUsers.includes(userChat._id) : false;

  const { messages, setMessages, addAIMessage, loading } = useGetHistoryChat(
    chat?._id,
    isAIChat
  );
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

    const handleGroupMemberLeft = (payload) => {
      if (String(payload.chat._id) === String(chat._id)) {
        if (payload.leftUserId.toString() === currentUser._id.toString()) {
          onClose();
        }
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("newMessage", handleNewMessage);
    socket.on("groupMemberLeft", handleGroupMemberLeft);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("newMessage", handleNewMessage);
      socket.off("groupMemberLeft", handleGroupMemberLeft);
    };
  }, [socket, currentUser, chat, updateMessage, setMessages, onClose]);

  useEffect(() => {
    if (!isMinimized) {
      const timer = setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "auto" }),
        50
      );
      return () => clearTimeout(timer);
    }
  }, [messages, isMinimized]);

  const handleSend = useCallback(async () => {
    if ((!message.trim() && !images.length) || !currentUser) return;

    const data = {
      _id: uuidv4(),
      sender: {
        _id: currentUser._id,
      },
      text: message,
      createdAt: new Date(),
    };

    if (isAIChat) {
      setIsLoadingAIResponse(true);
      addAIMessage(data);
      setMessage("");
      const aiReply = await messageAPI.getAIResponse(message);
      if (aiReply.success) {
        addAIMessage({
          _id: uuidv4(),
          sender: {
            _id: "bingbong-ai",
          },
          text: aiReply.data,
          createdAt: new Date(),
        });
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
  }, [message, currentUser, isAIChat, addAIMessage, images, chat._id]);

  const handleMinimize = () => setIsMinimized(!isMinimized);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setImagesPreview((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
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

  const handleUpdateGroupName = async () => {
    if (!newGroupName.trim()) return;
    try {
      const response = await chatAPI.updateGroupChat(chat._id, {
        groupName: newGroupName,
      });
      if (response.success) {
        setUserChat((prev) => ({ ...prev, groupName: newGroupName }));
        setEditingGroupName(false);
        setShowGroupSettings(false);
        setNewGroupName("");
      }
    } catch (error) {
      console.error("Failed to update group name:", error);
    }
  };

  const handleLeaveGroup = async () => {
    if (!confirm("Are you sure you want to leave this group?")) return;

    try {
      await chatAPI.leaveGroupChat(chat._id);
      onClose();
    } catch (error) {
      console.error("Failed to leave group:", error);
    }
  };

  const handleChangeGroupAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const response = await userAPI.uploadAvatar(file, "GroupChat", chat._id);
      if (response.success) {
        setUserChat((prev) => ({
          ...prev,
          avatar: response.data,
        }));
        setShowGroupSettings(false);
      }
    } catch (error) {
      console.error("Failed to change group avatar:", error);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleOpenAddMembers = () => {
    setShowGroupSettings(false);
    setShowAddMembersModal(true);
  };

  useEffect(() => {
    if (showAddMembersModal && profile?.friends) {
      // Filter out users already in the group
      const participantIds = chat.participants.map((p) => p._id);
      const available = profile.friends.filter(
        (user) => !participantIds.includes(user._id)
      );
      setAvailableUsers(available);
      setLoadingUsers(false);
    } else if (showAddMembersModal) {
      setLoadingUsers(true);
    }
  }, [showAddMembersModal, profile, chat]);

  const handleToggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const response = await chatAPI.addGroupMembers(chat._id, selectedUsers);
      if (response.success) {
        setUserChat((prev) => ({
          ...prev,
          participants: response.data.participants,
        }));
        setShowAddMembersModal(false);
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error("Failed to add members:", error);
    }
  };

  if (!userChat) return null;

  return (
    <>
      <ImagePreviewModal />

      {/* View Members Modal */}
      {showMembersList && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Group Members ({chat.participants.length})
              </h3>
              <button
                onClick={() => setShowMembersList(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition cursor-pointer"
              >
                <X className="size-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {chat.participants.map((member) => (
                  <Link
                    key={member._id}
                    to={`/profile/${member.slug}`}
                    onClick={() => setShowMembersList(false)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <div className="relative">
                      <img
                        src={getBackendImgURL(member.avatar)}
                        alt={member.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {onlineUsers.includes(member._id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {member.fullName}
                        {member._id === currentUser._id && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            (You)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{member.slug}
                      </p>
                      {onlineUsers.includes(member._id) && (
                        <span className="text-xs text-green-500">Online</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowMembersList(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {showAddMembersModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Members
              </h3>
              <button
                onClick={() => {
                  setShowAddMembersModal(false);
                  setSelectedUsers([]);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition cursor-pointer"
              >
                <X className="size-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {loadingUsers ? (
                <div className="flex justify-center py-8">
                  <SpinnerLoading />
                </div>
              ) : availableUsers.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No users available to add
                </p>
              ) : (
                <div className="space-y-2">
                  {availableUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleToggleUserSelection(user._id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                        selectedUsers.includes(user._id)
                          ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500"
                          : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent"
                      }`}
                    >
                      <img
                        src={getBackendImgURL(user.avatar)}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{user.slug}
                        </p>
                      </div>
                      {selectedUsers.includes(user._id) && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedUsers.length} selected
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAddMembersModal(false);
                    setSelectedUsers([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMembers}
                  disabled={selectedUsers.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Members
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="fixed right-10 bottom-0 lg:w-92 z-50 transform transition-all duration-300 ease-out hover:scale-[1.01]">
        <div className="rounded-t-xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div
            className={`p-2 font-semibold rounded-t-xl flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white ${
              isMinimized ? "cursor-pointer" : ""
            }`}
            onClick={() => isMinimized && setIsMinimized(!isMinimized)}
          >
            <div className="flex items-center gap-2">
              {isGroupChat && !isAIChat ? (
                // ────────────────────────────────
                // GROUP CHAT
                // ────────────────────────────────
                <>
                  <img
                    src={getBackendImgURL(userChat.avatar)}
                    className="w-8 h-8 rounded-full object-cover"
                    alt={userChat?.groupName || chat.groupName}
                  />
                  <div>
                    <span className="text-[15px]">
                      {userChat?.groupName || chat.groupName}
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMembersList(true);
                      }}
                      className="text-sm text-gray-300 block hover:text-white cursor-pointer hover:underline"
                    >
                      {chat.participants.length} members
                    </span>
                  </div>
                </>
              ) : (
                // ────────────────────────────────
                // NON-GROUP CHAT (private, shop, shop_channel, fanpage, AI)
                // ────────────────────────────────
                <>
                  <Link
                    to={isAIChat ? "#" : getProfileLink()}
                    className="relative rounded-full size-8"
                  >
                    {/* Avatar hiển thị theo type */}
                    {chat.type === "shop" ? (
                      // ────────────────────────────────
                      // SHOP LOGIC
                      // ────────────────────────────────
                      currentUser._id === chat.shopId.owner ? (
                        // 👉 Chủ shop → 2 avatar chồng nhau
                        <div className="relative w-8 h-8">
                          <img
                            src={getBackendImgURL(userChat?.avatar)} // avatar shop
                            className="w-full h-full rounded-full object-cover"
                          />
                          <img
                            src={getBackendImgURL(
                              chat.participants.find(
                                (p) => p._id !== chat.shopId.owner
                              )?.avatar
                            )}
                            className="w-4 h-4 rounded-full object-cover absolute -bottom-1 -right-1 border-2 border-white"
                          />
                        </div>
                      ) : (
                        // 👉 User nhắn với shop → chỉ hiện avatar shop
                        <img
                          src={getBackendImgURL(userChat?.avatar)}
                          className="object-cover size-full rounded-full"
                        />
                      )
                    ) : chat.type === "shop_channel" ? (
                      // ────────────────────────────────
                      // SHOP CHANNEL → chỉ avatar shop
                      // ────────────────────────────────
                      <img
                        src={getBackendImgURL(userChat?.avatar)}
                        className="object-cover size-full rounded-full"
                      />
                    ) : (
                      // ────────────────────────────────
                      // PRIVATE, FANPAGE, AI
                      // ────────────────────────────────
                      <img
                        src={getBackendImgURL(userChat?.avatar)}
                        className="object-cover size-full rounded-full"
                      />
                    )}

                    {/* Online indicator (exclude shop) */}
                    {isOnline && chat.type !== "shop" && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </Link>

                  <div>
                    {/* Name logic */}
                    <Link
                      to={isAIChat ? "#" : getProfileLink()}
                      className="text-[15px]"
                    >
                      {chat.type === "shop"
                        ? currentUser._id === chat.shopId.owner
                          ? // 👉 Chủ shop nhìn thấy: ShopName • UserName
                            `${userChat.name} • ${
                              chat.participants.find(
                                (p) => p._id !== chat.shopId.owner
                              ).fullName
                            }`
                          : // 👉 User nhìn thấy: chỉ tên shop
                            userChat.name
                        : chat.type === "shop_channel"
                        ? `${userChat.name} (Channel)`
                        : userChat.fullName || userChat.name}
                    </Link>

                    {isOnline && chat.type !== "shop" && (
                      <span className="text-green-300 block text-[13px]">
                        Online
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {isGroupChat && !isAIChat && (
                <div className="relative">
                  <button
                    onClick={() => setShowGroupSettings(!showGroupSettings)}
                    className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
                  >
                    <Settings className="size-5" />
                  </button>

                  {/* Dropdown Menu */}
                  {showGroupSettings && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowGroupSettings(false)}
                      />
                      <div className="absolute right-0 translate-x-1/3 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                        {/* Change Group Name */}
                        <button
                          onClick={() => {
                            setEditingGroupName(true);
                            setNewGroupName(chat.groupName);
                            setShowGroupSettings(false);
                          }}
                          className="flex items-center cursor-pointer gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition text-sm"
                        >
                          <Edit2 className="size-4" />
                          <span>Change Group Name</span>
                        </button>

                        {/* Add Members */}
                        <button
                          onClick={handleOpenAddMembers}
                          className="flex items-center cursor-pointer gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition text-sm"
                        >
                          <UserPlus className="size-4" />
                          <span>Add Members</span>
                        </button>

                        {/* Change Avatar */}
                        <label className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition text-sm cursor-pointer">
                          <Edit2 className="size-4" />
                          <span>Change Avatar</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleChangeGroupAvatar}
                          />
                        </label>

                        {/* Divider */}
                        <div className="border-t border-gray-200 dark:border-gray-700" />

                        {/* Leave Group */}
                        <button
                          onClick={() => {
                            handleLeaveGroup();
                            setShowGroupSettings(false);
                          }}
                          className="flex items-center cursor-pointer gap-3 w-full px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition text-sm"
                        >
                          <LogOut className="size-4" />
                          <span>Leave Group</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
              {!isAIChat && chat.type === "private" && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleToggleCall}
                    className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
                  >
                    <Phone className="size-5 fill-white" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer">
                    <Video className="size-5 fill-white" />
                  </button>
                </div>
              )}
              <button
                onClick={handleMinimize}
                className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
              >
                <Minus />
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
              >
                <X />
              </button>
            </div>
          </div>

          {/* Edit Group Name Modal/Inline */}
          {isGroupChat && editingGroupName && (
            <div className="bg-gray-50 dark:bg-gray-900 border-t border-b border-gray-200 dark:border-gray-700 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter new group name"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 text-black dark:text-white"
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleUpdateGroupName()
                  }
                  autoFocus
                />
                <button
                  onClick={handleUpdateGroupName}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingGroupName(false);
                    setNewGroupName("");
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white rounded-lg cursor-pointer transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

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
                    const isMyMessage = msg.sender._id === currentUser._id;
                    const senderAvatar =
                      chat.type !== "private" && !isAIChat
                        ? getBackendImgURL(msg.sender.avatar)
                        : getBackendImgURL(userChat?.avatar);

                    const formatDate = (dateStr) =>
                      new Date(dateStr).toLocaleDateString();
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
                              src={senderAvatar}
                              className="w-8 h-8 rounded-full object-cover self-start"
                              alt="Avatar"
                              title={msg.sender.fullName}
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
                                {isAIChat &&
                                msg.sender._id === "bingbong-ai" ? (
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
                                    ? "grid grid-cols-3"
                                    : "flex flex-col"
                                }`}
                              >
                                {msg.media.map((src, idx) => (
                                  <img
                                    key={idx}
                                    onClick={() =>
                                      openImagePreview(msg.media, idx)
                                    }
                                    src={getBackendImgURL(src)}
                                    alt={`preview-${idx}`}
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

              {/* Preview ảnh */}
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

              {/* Input */}
              <div className="p-2 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 relative">
                <div className="flex items-center gap-2">
                  {/* Upload image */}
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

                  {/* Emoji button */}
                  <button
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="p-2 bg-yellow-400 cursor-pointer text-white rounded-full hover:bg-yellow-500 transition"
                  >
                    <Smile className="size-4" />
                  </button>
                </div>

                {/* Emoji picker */}
                {showEmoji && (
                  <div className="absolute bottom-14 left-2 z-50">
                    <EmojiPicker theme={theme} onEmojiClick={handleEmojiClick} />
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 text-black dark:text-white"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <button
                  onClick={handleSend}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
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
