import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { useGetProfileBySlug } from "../hooks/useProfile";
import { userAPI } from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useGetSuggestion } from "../hooks/useProfile";
import { getBackendImgURL } from "../utils/helper";

const FriendPage = () => {
  const { suggestions } = useGetSuggestion();
  const { user, updateUser } = useAuthStore();
  const { profile } = useGetProfileBySlug(user.slug);
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
      toast.success("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Unable to accept request");
    }
  };

  const cardBlinkStyle = `
    @media (min-width: 768px) {
      @keyframes card-blink {
        0%, 100% { box-shadow: 0 8px 20px rgba(0,0,0,0.08), 0 0 0 0 #93c5fd44; }
        50% { box-shadow: 0 8px 20px rgba(0,0,0,0.08), 0 0 0 4px #93c5fd88; }
      }
      .card-blink {
        animation: card-blink 1.2s infinite;
      }
    }
  `;

  return (
    <>
      <style>{cardBlinkStyle}</style>
      <div className="min-h-[92vh] pt-10">
        <div className="lg:w-[90%] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-hidden">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
            Friend Requests ({friendRequests.length})
          </h2>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8"
            style={{ perspective: "1000px" }}
          >
            {friendRequests.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 col-span-full">
                No friend requests
              </p>
            ) : (
              friendRequests.map((requester) => (
                <div
                  key={requester._id}
                  className="bg-white dark:bg-[#1e1e2f] rounded-2xl border border-gray-200 dark:border-[#2b2b3d] shadow-lg transition-transform duration-300 p-4 flex flex-col items-center text-center card-blink w-full max-w-xs mx-auto"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Link
                    to={`/profile/${requester.slug}`}
                    className="flex flex-col items-center"
                  >
                    <img
                      src={
                        getBackendImgURL(requester.avatar)
                      }
                      alt={requester.fullName}
                      className="w-24 h-24 aspect-square rounded-full object-cover mb-3 shadow-md"
                    />
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 truncate w-full">
                      {requester.fullName}
                    </p>
                  </Link>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptFriendRequest(requester._id);
                    }}
                    className="text-sm font-medium bg-[#1b74e4] hover:bg-[#155fc3] text-white px-4 py-2 rounded-md w-full mb-2 transition shadow"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFriendRequests((prev) =>
                        prev.filter((r) => r._id !== requester._id)
                      );
                    }}
                    className="text-sm font-medium border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#23233b] px-4 py-2 rounded-md w-full transition shadow"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
            People You May Know
          </h2>

          <div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 items-center">
            {suggestions.map((user) => (
              <SuggestionCard key={user._id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const SuggestionCard = ({ user }) => {
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFriendRequest = async () => {
    setIsLoading(true);
    try {
      if (isRequestSent) {
        // Cancel friend request
        await userAPI.cancelFriendRequest(user._id);
        setIsRequestSent(false);
        toast.success("Friend request cancelled");
      } else {
        // Send friend request
        await userAPI.sendFriendRequest(user._id);
        setIsRequestSent(true);
        toast.success("Friend request sent");
      }
    } catch (error) {
      console.error("Error toggling friend request:", error);
      toast.error("Unable to process request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-white dark:bg-[#1e1e2f] rounded-2xl border border-gray-200 dark:border-[#2b2b3d] shadow-lg transition-transform duration-300 p-4 flex flex-col items-center text-center card-blink"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <Link
        to={`/profile/${user.slug}`}
        className="flex flex-col items-center"
      >
        <img
          src={getBackendImgURL(user.avatar)}
          alt={user.fullName}
          className="w-24 h-24 aspect-square rounded-full object-cover mb-3 shadow-md"
        />
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 truncate w-full">
          {user.fullName}
        </p>
      </Link>

      <button
        onClick={handleToggleFriendRequest}
        disabled={isLoading}
        className={`text-sm font-medium cursor-pointer px-4 py-2 rounded-md w-full transition shadow disabled:opacity-50 disabled:cursor-not-allowed ${
          isRequestSent
            ? "bg-gray-500 hover:bg-gray-600 text-white"
            : "bg-[#1b74e4] hover:bg-[#155fc3] text-white"
        }`}
      >
        {isLoading ? "..." : isRequestSent ? "Cancel Request" : "Add Friend"}
      </button>
    </div>
  );
};

export default FriendPage;
