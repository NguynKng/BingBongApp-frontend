import React, { useState } from "react";
import friendsData from "../data/friends";

const FriendList = () => {
  const [friends, setFriends] = useState(friendsData);

  // Handle friend actions (add, remove, cancel)
  const handleFriendAction = (friendId, action) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) => {
        if (friend.id === friendId) {
          if (action === "add") {
            return { ...friend, status: "friend" };
          }
          if (action === "remove") {
            // Change status back to not_friend when removed
            return { ...friend, status: "not_friend" };
          }
        }
        return friend;
      })
    );
  };

  const handleDelete = (friendId) => {
    setFriends((prevFriends) => prevFriends.filter((f) => f.id !== friendId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Lời mời kết bạn</h2>

      {/* Section for friend requests */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
        {friends
          .filter((friend) => friend.status === "not_friend")
          .map((friend) => (
            <div
              key={friend.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 p-4 flex flex-col items-center text-center"
            >
              <img
                src={friend.image}
                alt={friend.name}
                className="w-24 h-24 rounded-full object-cover mb-3"
              />
              <p className="text-sm font-semibold text-gray-900 mb-2">{friend.name}</p>

              {/* Button to accept friend request */}
              <button
                onClick={() => handleFriendAction(friend.id, "add")}
                className="text-sm font-medium bg-[#1b74e4] hover:bg-[#155fc3] text-white px-4 py-2 rounded-md w-full mb-2 transition"
              >
                Xác nhận
              </button>

              <button
                onClick={() => handleDelete(friend.id)}
                className="text-sm font-medium border border-gray-300 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md w-full transition"
              >
                Xoá
              </button>
            </div>
          ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-8">Những người bạn có thể biết</h2>

      {/* Section for friend suggestions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {friends
          .filter((friend) => friend.status === "not_friend" || friend.status === "friend")
          .map((friend) => (
            <div
              key={friend.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 p-4 flex flex-col items-center text-center"
            >
              <img
                src={friend.image}
                alt={friend.name}
                className="w-24 h-24 rounded-full object-cover mb-3"
              />
              <p className="text-sm font-semibold text-gray-900 mb-2">{friend.name}</p>

              {/* If not friend, show "Add friend" or "Cancel" */}
              {friend.status === "not_friend" && (
                <>
                  <button
                    onClick={() => handleFriendAction(friend.id, "add")}
                    className="text-sm font-medium bg-[#60a5fa] hover:bg-[#3b82f6] text-white px-4 py-2 rounded-md w-full mb-2 transition"
                  >
                    Thêm bạn bè
                  </button>
                  <button
                    onClick={() => handleFriendAction(friend.id, "remove")}
                    className="text-sm font-medium border border-gray-300 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md w-full transition"
                  >
                    Gỡ
                  </button>
                </>
              )}

              {friend.status === "friend" && (
                <button
                  onClick={() => handleFriendAction(friend.id, "remove")}
                  className="text-sm font-medium border border-gray-300 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md w-full transition"
                >
                  Huỷ kết bạn
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default FriendList;
