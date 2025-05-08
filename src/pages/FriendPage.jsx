import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import useAuthStore from "../store/authStore";
import { useGetProfile } from "../hooks/useProfile";
import { userAPI } from "../services/api";
import toast from "react-hot-toast";
import Config from "../envVars";
import { Link } from "react-router-dom";

const FriendPage = () => {
  const { user, updateUser } = useAuthStore();
  const { profile } = useGetProfile(user._id);
  console.log(profile)

  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    if (profile && profile.friendRequests) {
      setFriendRequests(profile.friendRequests);
    }
  }, [profile]);

  const handleAcceptFriendRequest = async (requesterId) => {
    try {
      const response = await userAPI.acceptFriendRequest(requesterId);
      updateUser({
        friends: response.friends,
        friendRequests: response.friendRequests,
      });
      setFriendRequests((prev) =>
        prev.filter((req) => req._id !== requesterId)
      );
      toast.success("Đã chấp nhận lời mời kết bạn");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Không thể chấp nhận lời mời");
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 mt-[10vh] py-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Lời mời kết bạn ({friendRequests.length})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
          {friendRequests.length === 0 ? (
            <p className="text-gray-500 col-span-full">Không có lời mời nào</p>
          ) : (
            friendRequests.map((requester) => (
              <div
                key={requester._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 p-4 flex flex-col items-center text-center"
              >
                {/* Link to profile */}
                <Link to={`/profile/${requester._id}`} className="flex flex-col items-center">
                  <img
                    src={requester.avatar ? `${Config.BACKEND_URL}${requester.avatar}` : "/user.png"}
                    alt={requester.fullName}
                    className="w-24 h-24 rounded-full object-cover mb-3"
                  />
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    {requester.fullName}
                  </p>
                </Link>

                {/* Action buttons outside Link */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent bubbling to Link
                    handleAcceptFriendRequest(requester._id);
                  }}
                  className="text-sm font-medium bg-[#1b74e4] hover:bg-[#155fc3] text-white px-4 py-2 rounded-md w-full mb-2 transition cursor-pointer"
                >
                  Xác nhận
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Optional: remove from UI
                    setFriendRequests((prev) => prev.filter((r) => r._id !== requester._id));
                  }}
                  className="text-sm font-medium border border-gray-300 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md w-full transition cursor-pointer"
                >
                  Xoá
                </button>
              </div>
            ))
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Những người bạn có thể biết
        </h2>
        <p className="text-gray-500">Tính năng đang phát triển...</p>
      </div>
    </>
  );
};

export default FriendPage;
