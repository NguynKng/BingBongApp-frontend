import { Ellipsis, Search } from "lucide-react";
import { useGetProfile } from "../hooks/useProfile";
import useAuthStore from "../store/authStore";
import SpinnerLoading from "../components/SpinnerLoading";
import { useEffect, useMemo, useState } from "react";
import Config from "../envVars";
import ads from "../data/ads";
import { Link } from "react-router-dom";

function ListFriend({ onToggleChat }) {
  const { user, onlineUsers } = useAuthStore();
  const { profile, loading } = useGetProfile(user?._id || "");
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const currentAds = ads.slice(currentAdIndex, currentAdIndex + 2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 2) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  const sortedFriends = useMemo(() => {
    const target = showSearch ? filteredFriends : friends;
    return [...target].sort((a, b) => {
      const aOnline = onlineUsers.includes(a._id);
      const bOnline = onlineUsers.includes(b._id);
      return Number(bOnline) - Number(aOnline); // Online lên đầu
    });
  }, [showSearch, filteredFriends, friends, onlineUsers]);

  return (
    <div className="fixed px-4 overflow-y-auto min-h-[92vh] max-h-[92vh] custom-scroll">
      {/* Sponsored Section */}
      <div className="py-4 border-b-2 border-gray-300 dark:border-gray-500">
        <h1 className="text-lg text-gray-600 dark:text-gray-400">Sponsored</h1>
        <div className="mt-1 space-y-2 transition-all duration-700 ease-in-out animate-fade">
          {currentAds.map((ad) => (
            <Link
              to={ad.link}
              key={ad.id}
              className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-lg transition-all cursor-pointer dark:hover:bg-[rgb(56,56,56)]"
            >
              <img
                src={ad.imageUrl}
                className="size-[8rem] rounded-lg object-cover"
                alt={`Ad ${ad.id}`}
              />
              <div className="flex flex-col">
                <h2 className="text-[15px] font-semibold leading-5 dark:text-white">
                  {ad.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  zalo.me
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Contacts Section */}
      <div className="py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-gray-600 text-lg font-semibold dark:text-gray-400">
            Contacts
          </h1>
          <div className="flex items-center gap-3">
            <div
              onClick={() => setShowSearch((prev) => !prev)}
              className="hover:bg-gray-300 bg-white/70 rounded-full size-9 flex items-center justify-center shadow cursor-pointer transition dark:hover:bg-[rgb(56,56,56)]"
            >
              <Search className="size-5 text-gray-600" />
            </div>
            <div className="hover:bg-gray-300 bg-white/70 rounded-full size-9 flex items-center justify-center shadow cursor-pointer transition dark:hover:bg-[rgb(56,56,56)]">
              <Ellipsis className="size-5 text-gray-600" />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center">
            <SpinnerLoading />
          </div>
        ) : (
          <>
            {/* Search Input (conditional) */}
            {showSearch && (
              <div className="relative mb-4">
                <Search className="absolute size-5 top-2.5 left-3 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bạn bè"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-2 pl-10 pr-3 rounded-full bg-gray-100 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none shadow-inner dark:bg-[rgb(52,52,53)] dark:text-white dark:placeholder:text-gray-300"
                />
              </div>
            )}
            {/* List of Friends */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 hover:bg-gray-200 rounded-lg px-2 py-2 cursor-pointer transition dark:hover:bg-[rgb(56,56,56)]" onClick={() => onToggleChat({
                _id: "bingbong-ai",
                fullName: "BingBong AI",
                avatar: "/images/bingbong-ai.png",
              })}>
                <div className="size-10 relative rounded-full">
                  <img
                    src={`${Config.BACKEND_URL}/images/bingbong-ai.png`}
                    alt={"Chat with BingBong AI"}
                    className="size-full rounded-full object-cover"
                  />
                </div>
                <h2 className="text-[15px] font-semibold dark:text-white">
                  {"BingBong AI"}
                </h2>
                <img src="/checklist.png" className="size-4 rounded-full object-cover" />
              </div>
              {sortedFriends.length > 0 ? (
                sortedFriends.map((friend) => (
                  <div
                    key={friend._id}
                    className="flex items-center gap-2 hover:bg-gray-200 rounded-lg px-2 py-2 cursor-pointer transition dark:hover:bg-[rgb(56,56,56)]"
                    onClick={() => onToggleChat(friend)}
                  >
                    <div className="size-10 relative rounded-full">
                      <img
                        src={
                          friend.avatar
                            ? `${Config.BACKEND_URL}${friend.avatar}`
                            : "/user.png"
                        }
                        alt={friend.fullName}
                        className="size-full rounded-full object-cover"
                      />
                      {onlineUsers.includes(friend._id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <h2 className="text-[15px] font-semibold dark:text-white">
                      {friend.fullName}
                    </h2>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Không tìm thấy bạn bè nào.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ListFriend;
