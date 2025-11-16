import { useState, useEffect } from "react";
import { getBackendImgURL } from "../utils/helper";
import { chatAPI } from "../services/api";
import { Search } from "lucide-react";
import { useGetProfileBySlug } from "../hooks/useProfile";

export default function CreateGroupChatDropdown({
  currentUser,
  onClose,
  onCreated,
}) {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");

  const { profile: data } = useGetProfileBySlug(currentUser.slug);

  useEffect(() => {
    if (data?.friends) setFriends(data.friends);
  }, [data]);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    const payload = {
      groupName,
      userIds: [...selectedUsers]
    };

    const res = await chatAPI.createGroupChat(payload);
    if (res.success) {
      onCreated(res.data);
      onClose();
    }
  };

  const filteredFriends = friends.filter((f) =>
    f.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute top-6 right-0 mt-2 w-[22rem] bg-white dark:bg-[rgb(35,35,35)] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-[999] animate-fade-in">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
        Create Group Chat
      </h2>

      {/* Group Name */}
      <input
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
        className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-[rgb(52,52,52)] text-gray-800 dark:text-white focus:outline-none mb-3"
      />

      {/* Search Friends */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 dark:text-gray-300" />
        <input
          type="text"
          placeholder="Search friends..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-[rgb(52,52,53)] text-gray-800 dark:text-gray-300 focus:outline-none"
        />
      </div>

      {/* Friend List */}
      <div className="max-h-60 overflow-y-auto space-y-2 custom-scroll">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => toggleUser(friend._id)}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[rgb(52,52,52)]"
            >
              <img
                src={getBackendImgURL(friend.avatar)}
                className="size-10 rounded-full object-cover"
              />

              <span className="flex-1 text-sm text-gray-700 dark:text-white">
                {friend.fullName}
              </span>

              <input
                type="checkbox"
                checked={selectedUsers.includes(friend._id)}
                onChange={() => toggleUser(friend._id)}
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center dark:text-gray-400">
            No friends found.
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-[rgb(52,52,52)] dark:text-white"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </div>
  );
}
