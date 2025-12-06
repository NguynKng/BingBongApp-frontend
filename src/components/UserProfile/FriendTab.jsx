import { memo, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Users, Search, UserX } from "lucide-react";
import propTypes from "prop-types";
import { getBackendImgURL } from "../../utils/helper";
import useAuthStore from "../../store/authStore";

const FriendTab = memo(({ displayedUser }) => {
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ useCallback for isOnline check
  const isOnline = useCallback(
    (friendId) => onlineUsers.includes(friendId),
    [onlineUsers]
  );

  // ✅ Memoize friends list
  const friends = useMemo(
    () => displayedUser.friends || [],
    [displayedUser.friends]
  );

  // ✅ Memoize filtered friends
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;

    const query = searchQuery.toLowerCase();
    return friends.filter(
      (friend) =>
        friend.fullName.toLowerCase().includes(query) ||
        friend.slug.toLowerCase().includes(query)
    );
  }, [friends, searchQuery]);

  // ✅ useCallback for search handler
  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // ✅ Memoize has friends check
  const hasFriends = useMemo(() => friends.length > 0, [friends.length]);

  return (
    <div className="bg-white dark:bg-[#1b1f2b] rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Friends
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {friends.length} {friends.length === 1 ? "friend" : "friends"}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {hasFriends && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#2a3142] border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        )}
      </div>

      {/* Friends List */}
      <div className="p-6">
        {!hasFriends ? (
          <EmptyState />
        ) : filteredFriends.length === 0 ? (
          <NoResults searchQuery={searchQuery} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFriends.map((friend) => (
              <FriendCard
                key={friend._id}
                friend={friend}
                isOnline={isOnline(friend._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

FriendTab.displayName = "FriendTab";

FriendTab.propTypes = {
  displayedUser: propTypes.shape({
    friends: propTypes.arrayOf(
      propTypes.shape({
        _id: propTypes.string.isRequired,
        fullName: propTypes.string.isRequired,
        slug: propTypes.string.isRequired,
        avatar: propTypes.string,
        bio: propTypes.string,
      })
    ),
  }).isRequired,
};

// ✅ FriendCard Component - Now receives isOnline as prop
const FriendCard = memo(({ friend, isOnline }) => (
  <Link
    to={`/profile/${friend.slug}`}
    className="bg-white dark:bg-[#2a3142] rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
  >
    {/* Avatar */}
    <div className="flex flex-col items-center">
      <div className="relative mb-3">
        <img
          src={getBackendImgURL(friend.avatar)}
          alt={friend.fullName}
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors"
          loading="lazy"
        />

        {/* Online Status */}
        {isOnline && (
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-[#2a3142] rounded-full"></div>
        )}
      </div>

      {/* Name */}
      <h3 className="text-base font-semibold text-gray-900 dark:text-white text-center mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
        {friend.fullName}
      </h3>

      {/* Slug */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2 line-clamp-1">
        @{friend.slug}
      </p>

      {/* Bio */}
      {friend.bio && (
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center line-clamp-2 mb-3">
          {friend.bio}
        </p>
      )}

      {/* Action Button */}
      <button className="w-full py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm">
        View Profile
      </button>
    </div>
  </Link>
));

FriendCard.displayName = "FriendCard";

FriendCard.propTypes = {
  friend: propTypes.shape({
    _id: propTypes.string.isRequired,
    fullName: propTypes.string.isRequired,
    slug: propTypes.string.isRequired,
    avatar: propTypes.string,
    bio: propTypes.string,
  }).isRequired,
  isOnline: propTypes.bool.isRequired,
};

// ✅ EmptyState Component
const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
      <Users className="w-12 h-12 text-gray-400 dark:text-gray-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      No friends yet
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
      {`This user doesn't have any friends yet. When they add friends, they'll appear here.`}
    </p>
  </div>
));

EmptyState.displayName = "EmptyState";

// ✅ NoResults Component
const NoResults = memo(({ searchQuery }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
      <UserX className="w-12 h-12 text-gray-400 dark:text-gray-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      No results found
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
      No friends found matching{" "}
      <span className="font-medium text-gray-700 dark:text-gray-300">
        &ldquo;{searchQuery}&rdquo;
      </span>
    </p>
  </div>
));

NoResults.displayName = "NoResults";

NoResults.propTypes = {
  searchQuery: propTypes.string.isRequired,
};

export default FriendTab;