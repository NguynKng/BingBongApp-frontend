import { useState, useRef, useEffect } from "react";
import {
  Check,
  CircleCheckBig,
  Pencil,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import { Link, useParams, Routes, Route } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { userAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { useGetProfileBySlug } from "../hooks/useProfile";
import SpinnerLoading from "../components/SpinnerLoading";
import WarningDeleteFriend from "../components/WarningDeleteFriend";
import { useMemo } from "react";
import { getBackendImgURL, getEquippedBadge } from "../utils/helper";
import { chatAPI } from "../services/api";
import UserBadge from "../components/UserBadge";
import PostTab from "../components/UserProfile/PostTab";
import PhotoTab from "../components/UserProfile/PhotoTab";
import AboutTab from "../components/UserProfile/AboutTab";
import FriendTab from "../components/UserProfile/FriendTab";
import MusicTab from "../components/UserProfile/MusicTab";
import BadgeTab from "../components/UserProfile/BadgeTab";

function ProfilePage({ onToggleChat }) {
  const [isOpenFriendsDropdown, setIsOpenFriendsDropdown] = useState(false);
  const { slug } = useParams();
  const [isUploading, setIsUploading] = useState({
    avatar: false,
    coverPhoto: false,
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [isWarningDeleteFriend, setIsWarningDeleteFriend] = useState(false);
  const { user, updateUser, theme } = useAuthStore();
  const avatarInputRef = useRef(null);
  const { profile } = useGetProfileBySlug(slug);
  const userId = useMemo(() => profile?._id ?? null, [profile]);
  const coverPhotoInputRef = useRef(null);
  const clean = useMemo(() => (p) => p.replace(/\/+$/, ""), []);

  const isCurrentTab = useMemo(
    () => (tabPath) =>
      clean(location.pathname) ===
      clean(`/profile/${slug}${tabPath ? `/${tabPath.toLowerCase()}` : ""}`),
    [slug, clean]
  );

  const isMyProfile = useMemo(() => userId === user?._id, [userId, user?._id]);

  const [displayedUser, setDisplayedUser] = useState(profile ?? null);

  useEffect(() => {
    if (profile) {
      setDisplayedUser(profile);
    }
  }, [profile]);

  const equippedBadge = useMemo(
    () => getEquippedBadge(displayedUser),
    [displayedUser]
  );

  const [isFriend, setIsFriend] = useState(false);
  const [hasSentFriendRequest, setHasSentFriendRequest] = useState(false);
  const [isReceivingFriendRequest, setIsReceivingFriendRequest] =
    useState(false);

  useEffect(() => {
    if (!isMyProfile && displayedUser && user) {
      setIsFriend(user.friends?.includes(displayedUser._id));
      setHasSentFriendRequest(
        displayedUser.friendRequests?.some((r) => r._id === user._id)
      );
      setIsReceivingFriendRequest(
        user.friendRequests?.includes(displayedUser._id)
      );
    }
  }, [displayedUser, user, isMyProfile]);

  const tabs = useMemo(
    () => [
      { name: "Posts", path: "" },
      { name: "About", path: "about" },
      { name: "Friends", path: "friends" },
      { name: "Photos", path: "photos" },
      { name: "Music", path: "music" },
      { name: "Badge", path: "badge" },
    ],
    []
  );

  if (!displayedUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerLoading />
      </div>
    );
  }

  const handleToggleChat = async (userId) => {
    const response = await chatAPI.getChatIdByTypeId({
      userId,
      type: "private",
    });
    onToggleChat(response.data);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading((prev) => ({ ...prev, avatar: true }));
      const response = await userAPI.uploadAvatar(file, "User", userId);
      updateUser({ avatar: response.data });
      setDisplayedUser((prev) => ({ ...prev, avatar: response.data }));
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Avatar upload error:", error);
    } finally {
      setIsUploading((prev) => ({ ...prev, avatar: false }));
    }
  };

  const handleCoverPhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading((prev) => ({ ...prev, coverPhoto: true }));
      const response = await userAPI.uploadCoverPhoto(file, "User", userId);
      updateUser({ coverPhoto: response.data });
      setDisplayedUser((prev) => ({ ...prev, coverPhoto: response.data }));
      toast.success("Cover photo updated successfully");
    } catch (error) {
      console.error("Cover photo upload error:", error);
    } finally {
      setIsUploading((prev) => ({ ...prev, coverPhoto: false }));
    }
  };

  const handleDeleteFriend = async () => {
    try {
      const response = await userAPI.removeFriend(userId);
      if (!response.success) {
        toast.error("Failed to delete friend.");
        return;
      }
      setIsWarningDeleteFriend(false);
      updateUser({
        friends: response?.user?.friends,
      });
      setIsFriend(false);
      toast.success("Friend deleted successfully!");
    } catch (error) {
      console.error("Error deleting friend:", error);
      toast.error("Failed to delete friend.");
    }
  };

  const handleAddFriendRequest = async () => {
    try {
      const response = await userAPI.sendFriendRequest(userId);
      setHasSentFriendRequest(true);
      toast.success(response.message);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Cannot send friend request.");
    }
  };

  const handleRemoveFriendRequest = async () => {
    try {
      await userAPI.cancelFriendRequest(userId);
      setHasSentFriendRequest(false);
      toast.success("Friend request cancelled successfully");
    } catch (error) {
      console.error("Error cancel friend request:", error);
      toast.error("Cannot cancel friend request");
    }
  };

  const handleDeclineFriendRequest = async () => {
    try {
      const response = await userAPI.declineFriendRequest(userId);
      if (!response.success) {
        toast.error("Failed to decline friend request.");
        return;
      }
      updateUser({ friendRequests: response?.user?.friendRequests });
      setIsReceivingFriendRequest(false);
      toast.success("Friend request declined successfully!");
    } catch (error) {
      console.error("Error declining friend request:", error);
      toast.error("Failed to decline friend request.");
    }
  };

  const handleAcceptFriendRequest = async () => {
    try {
      const response = await userAPI.acceptFriendRequest(userId);
      updateUser({
        friends: response.user.friends,
        friendRequests: response.user.friendRequests,
      });
      setIsFriend(true);
      setIsReceivingFriendRequest(false);
      toast.success("Friend request accepted successfully");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Cannot accept friend request");
    }
  };

  const handleSaveFullName = async () => {
    if (!newFullName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      const response = await userAPI.renameUserProfile(newFullName.trim());
      updateUser({ fullName: response.data });
      setDisplayedUser((prev) => ({ ...prev, fullName: response.data }));
      setIsEditingName(false);
      toast.success("Name updated successfully");
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error("Failed to update name");
    }
  };

  return (
    <>
      <div className="lg:px-[15%] bg-gray-100 dark:bg-[#181826]">
        <div className="relative w-full">
          <div className="relative w-full lg:h-[24rem] md:h-[22rem] sm:h-[20rem] h-[18rem] rounded-b-md">
            <img
              src={getBackendImgURL(displayedUser?.coverPhoto)}
              className="size-full lg:rounded-b-md object-cover"
              alt="Cover photo"
              loading="lazy"
            />
            {isMyProfile && (
              <>
                <input
                  type="file"
                  ref={coverPhotoInputRef}
                  onChange={handleCoverPhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  className="absolute bottom-4 right-4 z-31 flex items-center gap-2 bg-white hover:bg-gray-300 cursor-pointer rounded-md py-2 px-4 text-black font-medium"
                  onClick={() => coverPhotoInputRef.current.click()}
                >
                  <img src="/camera.png" className="size-4 object-cover" />
                  <span className="lg:inline hidden">
                    {isUploading.coverPhoto
                      ? "Uploading..."
                      : "Change cover photo"}
                  </span>
                </div>
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/50 to-transparent h-[30%] rounded-md"></div>
              </>
            )}
            <div className="absolute bottom-0 lg:translate-y-1/2 translate-y-1/5 lg:left-10 left-4 bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] rounded-full z-10 w-46 h-46 flex border-4 border-white items-center justify-center">
              <img
                src={getBackendImgURL(displayedUser?.avatar)}
                className="size-full rounded-full object-cover cursor-pointer hover:opacity-70"
                alt="Avatar"
              />
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />
              {isMyProfile && (
                <div
                  className="absolute bottom-4 right-0 p-2 size-9 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  onClick={() => avatarInputRef.current.click()}
                >
                  {isUploading.avatar ? (
                    <div className="size-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <img src="/camera.png" className="size-full object-cover" />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <div className="relative w-full">
              <div className="lg:px-8 px-4">
                <div className="flex lg:flex-row flex-col lg:justify-between justify-center lg:items-end items-start border-b-2 border-gray-200 dark:border-[#2b2b3d] lg:pb-4 pb-1 lg:pl-[13rem] lg:pt-4 pt-10">
                  <div className="flex lg:flex-row flex-col gap-2 justify-center items-center self-start">
                    <div className="flex flex-col justify-center items-start self-end gap-2">
                      <div className="flex flex-wrap gap-2 items-center">
                        {isEditingName && isMyProfile ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={newFullName}
                              onChange={(e) => setNewFullName(e.target.value)}
                              className="text-2xl font-bold px-2 py-1 border-2 border-blue-500 rounded dark:bg-[#23233b] dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-400 w-full max-w-64"
                              autoFocus
                              placeholder="Enter name"
                            />
                            <button
                              onClick={handleSaveFullName}
                              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer transition-colors"
                              title="Save"
                            >
                              <Check className="size-4" />
                            </button>
                            <button
                              onClick={() => setIsEditingName(false)}
                              className="p-2 cursor-pointer bg-gray-300 dark:bg-[#2b2b3d] text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-[#35354f] transition-colors"
                              title="Cancel"
                            >
                              <UserX className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <h1 className="text-3xl font-bold dark:text-white">
                              {displayedUser?.fullName || "Loading..."}
                            </h1>
                            {isMyProfile && (
                              <button
                                onClick={() => {
                                  setNewFullName(displayedUser?.fullName || "");
                                  setIsEditingName(true);
                                }}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#23233b] cursor-pointer transition-colors"
                                title="Edit name"
                              >
                                <Pencil className="size-4 text-gray-600 dark:text-gray-400" />
                              </button>
                            )}
                            {displayedUser.isVerifiedAccount && (
                              <div
                                className="p-2 rounded-full bg-green-500"
                                title="Verified account"
                              >
                                <Check className="text-white size-4" />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 rounded">{`${
                        displayedUser.friends.length || 0
                      } friend${
                        displayedUser.friends.length !== 1 ? "s" : ""
                      }`}</p>
                      {equippedBadge && (
                        <UserBadge badge={equippedBadge} mode="large" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-end items-end py-4 z-30">
                    <div className="flex gap-2 items-center">
                      {isMyProfile ? (
                        <>
                          <button className="flex lg:gap-2 gap-1 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] cursor-pointer rounded-md py-2 lg:px-4 px-2 text-black dark:text-white font-medium">
                            <Pencil className="size-4" />
                            <span>Edit profile</span>
                          </button>
                        </>
                      ) : isFriend ? (
                        <>
                          <button
                            className="relative flex gap-2 bg-gray-200 dark:bg-[#23233b] text-black dark:text-white rounded-md py-2 px-4 font-medium items-center hover:bg-gray-300 dark:hover:bg-[#23233b] cursor-pointer"
                            onClick={() =>
                              setIsOpenFriendsDropdown(!isOpenFriendsDropdown)
                            }
                          >
                            <UserCheck />
                            <span>Bạn bè</span>
                            {isOpenFriendsDropdown && (
                              <div className="absolute right-0 top-full w-72 bg-white dark:bg-[#1e1e2f] rounded-lg shadow-xl z-50 border border-gray-200 dark:border-[#2b2b3d]">
                                <ul className="p-2">
                                  <li
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#23233b] cursor-pointer rounded-md"
                                    onClick={() =>
                                      setIsWarningDeleteFriend(true)
                                    }
                                  >
                                    <UserX />
                                    <span className="font-medium">
                                      Remove Friend
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </button>
                          <button
                            className="flex gap-2 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] cursor-pointer rounded-md py-2 px-4 text-black dark:text-white font-medium"
                            onClick={() => handleToggleChat(displayedUser._id)}
                          >
                            <img
                              src={
                                theme === "light"
                                  ? "/messenger-icon.png"
                                  : "/messenger-icon-white.png"
                              }
                              className="object-cover size-5"
                            />
                            <span>Message</span>
                          </button>
                        </>
                      ) : isReceivingFriendRequest ? (
                        <>
                          <button
                            className="flex gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 font-medium items-center cursor-pointer"
                            onClick={handleAcceptFriendRequest}
                          >
                            <span>Accept Request</span>
                          </button>
                          <button
                            className="flex gap-2 bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] text-black dark:text-white rounded-md py-2 px-4 font-medium items-center cursor-pointer"
                            onClick={handleDeclineFriendRequest}
                          >
                            <span>Delete Request</span>
                          </button>
                          <button
                            className="flex gap-2 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] cursor-pointer rounded-md py-2 px-4 text-black dark:text-white font-medium"
                            onClick={() => handleToggleChat(displayedUser._id)}
                          >
                            <img
                              src={
                                theme === "light"
                                  ? "/messenger-icon.png"
                                  : "/messenger-icon-white.png"
                              }
                              className="object-cover size-5"
                            />
                            <span>Message</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={`flex gap-2 font-medium cursor-pointer ${
                              hasSentFriendRequest
                                ? "bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] text-black dark:text-white"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            } rounded-md py-2 px-4 items-center justify-center`}
                            onClick={
                              hasSentFriendRequest
                                ? handleRemoveFriendRequest
                                : handleAddFriendRequest
                            }
                          >
                            <UserPlus />
                            <span>
                              {hasSentFriendRequest
                                ? "Cancel Request"
                                : "Add Friend"}
                            </span>
                          </button>
                          <button
                            className="flex gap-2 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] cursor-pointer rounded-md py-2 px-4 text-black dark:text-white font-medium"
                            onClick={() => handleToggleChat(displayedUser._id)}
                          >
                            <img
                              src={
                                theme === "light"
                                  ? "/messenger-icon.png"
                                  : "/messenger-icon-white.png"
                              }
                              className="object-cover size-5"
                            />
                            <span>Message</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap py-1">
                    {tabs.map((tab, index) => (
                      <Link
                        to={`/profile/${slug}/${tab.path}`}
                        key={index}
                        className={`cursor-pointer border-b-4 font-medium py-1 px-2 lg:py-3 lg:px-4 ${
                          isCurrentTab(tab.path)
                            ? "border-blue-500 text-blue-500 bg-transparent"
                            : "border-transparent text-gray-500 hover:bg-gray-200 rounded-md"
                        }`}
                      >
                        {tab.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gray-200 dark:bg-[#181826] lg:px-[17%] px-2 py-4 min-h-screen">
        <Routes>
          <Route path="/" element={<PostTab displayedUser={displayedUser} />} />
          <Route
            path="about"
            element={<AboutTab displayedUser={displayedUser} />}
          />
          <Route
            path="photos"
            element={<PhotoTab displayedUser={displayedUser} />}
          />
          <Route
            path="friends"
            element={<FriendTab displayedUser={displayedUser} />}
          />
          <Route
            path="music"
            element={<MusicTab displayedUser={displayedUser} />}
          />
          <Route
            path="badge"
            element={<BadgeTab displayedUser={displayedUser} />}
          />
        </Routes>
      </section>
      {isWarningDeleteFriend && (
        <WarningDeleteFriend
          onConfirm={handleDeleteFriend}
          onCancel={() => setIsWarningDeleteFriend(false)}
          displayedUser={displayedUser}
        />
      )}
    </>
  );
}

export default ProfilePage;
