import { ChevronLeft, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useGetProfile } from "../hooks/useProfile";
import useAuthStore from "../store/authStore";
import SpinnerLoading from "./SpinnerLoading";
import Config from "../envVars";

export default function ListFriendBar({ onToggleChat }) {
  const [isOpenBar, setIsOpenBar] = useState(false);
  const { user, onlineUsers } = useAuthStore();
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Friends");
  const { profile, loading } = useGetProfile(user?._id || "");
  const isOnline = (friendId) => onlineUsers.includes(friendId);

  useEffect(() => {
    if (profile?.friends) {
      setFriends(profile.friends);
    }
  }, [profile]);

  const filteredFriends = useMemo(() => {
    return friends.filter((friend) =>
      friend.fullName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, friends]);

  return (
    <div
      className={`fixed flex flex-col right-0 bottom-0 bg-white h-screen pt-[64px] shadow-lg
        transition-all duration-300 ease-in-out
        ${isOpenBar ? "w-60" : "w-20"}`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-center ${
          isOpenBar ? "gap-2 justify-start" : "gap-0"
        } py-4 px-6 border-b-2 border-gray-100 
          transition-opacity duration-300`}
      >
        <img src="/chat-ico-1.png" className="object-cover w-6 h-6" />
        <h2
          className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out
                ${
                  isOpenBar
                    ? "opacity-100 max-w-[150px]"
                    : "opacity-0 max-w-0 ml-0"
                }
        `}
        >
          {`Messenger`}
        </h2>
      </div>

      {/* Friend list */}
      <div className="flex-1 overflow-y-auto custom-scroll p-2">
        {isOpenBar && (
          <div className="p-2">
            <div className="flex items-center gap-2">
              <h2
                onClick={() => setTab("Friends")}
                className={`text-sm cursor-pointer hover:text-blue-500 ${
                  tab == "Friends" && "text-blue-500"
                }`}
              >
                Friends
              </h2>
              <h2
                onClick={() => setTab("Groups")}
                className={`text-sm cursor-pointer hover:text-blue-500 ${
                  tab == "Groups" && "text-blue-500"
                }`}
              >
                Groups
              </h2>
            </div>
            <div className="relative w-full mt-4">
              <Search className="absolute size-3 top-1/2 left-3 -translate-y-1/2 text-blue-700" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm bạn bè"
                className="text-blue-900 dark:text-gray-200 font-medium w-full py-2 pl-8 pr-4 bg-white/90 dark:bg-[#1f2233] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-400 shadow-md transition-all duration-300 text-sm"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2 mt-2">
          <div
            className="flex gap-2 items-center py-2 px-4 rounded-lg hover:bg-blue-100 cursor-pointer"
            onClick={() =>
              onToggleChat({
                _id: "bingbong-ai",
                fullName: "BingBong AI",
                avatar: "/images/bingbong-ai.png",
              })
            }
          >
            <div className="size-8 relative">
              <img
                src={`${Config.BACKEND_URL}/images/bingbong-ai.png`}
                alt={"ChatBot"}
                className="size-full rounded-full object-cover"
              />
            </div>
            {isOpenBar && (
              <h2
                className={`text-sm overflow-hidden transition-all duration-300 ease-in-out
    ${isOpenBar ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"}
  `}
              >
                BingBong AI
              </h2>
            )}
          </div>
          {loading ? (
            <SpinnerLoading />
          ) : (
            filteredFriends.map((friend) => (
              <div
                key={friend._id}
                className="flex gap-2 items-center py-2 px-4 rounded-lg hover:bg-blue-100 cursor-pointer"
                onClick={() => onToggleChat(friend)}
              >
                <div className="size-8 relative">
                  <img
                    src={`${Config.BACKEND_URL}${friend.avatar}`}
                    alt={friend.fullName}
                    className="size-full rounded-full object-cover"
                  />
                  {isOnline(friend._id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                {isOpenBar && (
                  <h2
                    className={`text-sm overflow-hidden transition-all duration-300 ease-in-out
    ${isOpenBar ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"}
  `}
                  >
                    {friend.fullName}
                  </h2>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer toggle button */}
      <div className="p-4 flex items-center justify-center border-t-2 border-gray-100 gap-2">
        <button
          onClick={() => setIsOpenBar(!isOpenBar)}
          className={`p-2 w-8 h-8 flex items-center justify-center bg-blue-400 hover:bg-blue-500 cursor-pointer rounded-full 
            transition-transform duration-300 ${isOpenBar && "rotate-180"}`}
        >
          <ChevronLeft className="text-white" />
        </button>
      </div>
    </div>
  );
}
