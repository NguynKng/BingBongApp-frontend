import { useState, useRef, useEffect } from "react";
import {
  Briefcase,
  ChevronDown,
  Globe,
  GraduationCap,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  UserCheck,
  UserPlus,
  UserX,
  Link2,
} from "lucide-react";
import CreateStatus from "../components/CreateStatus";
import PostCard from "../components/PostCard";
import { Link, useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Config from "../envVars";
import { userAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { useGetOwnerPosts } from "../hooks/usePosts";
import { useGetProfileBySlug } from "../hooks/useProfile";
import SpinnerLoading from "../components/SpinnerLoading";
import ChatBox from "../components/ChatBox";
import WarningDeleteFriend from "../components/WarningDeleteFriend";
import EditInfoModal from "../components/EditInfoModal";
import useUserStore from "../store/userStore";
import { useMemo } from "react";

function ProfilePage() {
  const [isOpenFriendsDropdown, setIsOpenFriendsDropdown] = useState(false);
  const { slug } = useParams();
  const { updateUserProfileInStore } = useUserStore();
  const [activeTab, setActiveTab] = useState("Bài viết");
  const [isUploading, setIsUploading] = useState({
    avatar: false,
    coverPhoto: false,
  });
  const [isWarningDeleteFriend, setIsWarningDeleteFriend] = useState(false);
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);
  const { user, updateUser, theme } = useAuthStore();
  const avatarInputRef = useRef(null);
  const { profile } = useGetProfileBySlug(slug);
  const userId = useMemo(() => profile?._id ?? null, [profile]);
  const coverPhotoInputRef = useRef(null);
  const { posts, setPosts, loading } = useGetOwnerPosts("User", userId);

  const isMyProfile = userId === user?._id;

  const displayedUser = profile ?? null;

  const [isFriend, setIsFriend] = useState(false);
  const [hasSentFriendRequest, setHasSentFriendRequest] = useState(false);
  const [isReceivingFriendRequest, setIsReceivingFriendRequest] =
    useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState();

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

  if (!displayedUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerLoading />
      </div>
    );
  }

  const tabs = [
    { name: "Bài viết" },
    { name: "Giới thiệu" },
    { name: "Bạn bè" },
    { name: "Ảnh" },
  ];

  const handleToggleChat = (friend) => {
    setActiveChatUser(friend);
    setShowChat(true); // ensure ChatBox shows when a friend is clicked
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setActiveChatUser(undefined);
  }; // giữ nguyên qua các route

  const handleAddPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleRemovePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading((prev) => ({ ...prev, avatar: true }));
      const response = await userAPI.uploadAvatar(file, "User", userId);
      updateUser({ avatar: response.data });
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
      await userAPI.sendFriendRequest(userId);
      setHasSentFriendRequest(true);
      toast.success("Đã gửi lời mời kết bạn");
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Không thể gửi lời mời kết bạn");
    }
  };

  const handleRemoveFriendRequest = async () => {
    try {
      await userAPI.cancelFriendRequest(userId);
      setHasSentFriendRequest(false);
      toast.success("Đã huỷ lời mời kết bạn");
    } catch (error) {
      console.error("Error cancel friend request:", error);
      toast.error("Không thể huỷ lời mời kết bạn");
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
      toast.success("Đã chấp nhận lời mời kết bạn");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Không thể chấp nhận lời mời");
    }
  };

  const handleUpdateUser = (updatedData) => {
    if (isMyProfile) {
      updateUserProfileInStore(user._id, updatedData);
    }
  };

  return (
    <>
      <div className="lg:px-[15%] bg-gray-100 dark:bg-[#181826]">
        <div className="relative w-full">
          <div className="relative w-full lg:h-[24rem] md:h-[22rem] sm:h-[20rem] h-[18rem] rounded-b-md">
            <img
              src={
                displayedUser?.coverPhoto
                  ? `${Config.BACKEND_URL}${displayedUser.coverPhoto}`
                  : "/background-gray.avif"
              }
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
                    {isUploading.coverPhoto ? "Uploading..." : "Thay ảnh bìa"}
                  </span>
                </div>
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/50 to-transparent h-[30%] rounded-md"></div>
              </>
            )}
            <div className="absolute bottom-0 lg:translate-y-1/2 translate-y-1/5 lg:left-10 left-4 bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] rounded-full z-10 w-46 h-46 flex border-4 border-white items-center justify-center">
              <img
                src={
                  displayedUser?.avatar
                    ? `${Config.BACKEND_URL}${displayedUser.avatar}`
                    : "/user.png"
                }
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
                    <div className="flex flex-col justify-center items-start self-end">
                      <h1 className="text-3xl font-bold not-[]:rounded dark:text-white">
                        {displayedUser?.fullName || "Loading..."}
                      </h1>
                      <p className="text-gray-500 dark:text-gray-400 rounded">{`${
                        displayedUser.friends.length || 0
                      } người bạn`}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end items-end py-4 z-30">
                    <div className="flex gap-2 items-center">
                      {isMyProfile ? (
                        <>
                          <button className="flex lg:gap-2 gap-1 bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-md py-2 lg:px-4 px-2 text-white items-center justify-center">
                            <Plus className="size-5" />
                            <span>Thêm vào tin</span>
                          </button>
                          <button className="flex lg:gap-2 gap-1 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] cursor-pointer rounded-md py-2 lg:px-4 px-2 text-black dark:text-white font-medium">
                            <Pencil className="size-5" />
                            <span>Chỉnh sửa trang cá nhân</span>
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
                                      Xoá kết bạn
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </button>
                          <button
                            className="flex gap-2 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] cursor-pointer rounded-md py-2 px-4 text-black dark:text-white font-medium"
                            onClick={() => handleToggleChat(displayedUser)}
                          >
                            <img
                              src={
                                theme === "light"
                                  ? "/messenger-icon.png"
                                  : "/messenger-icon-white.png"
                              }
                              className="object-cover size-5"
                            />
                            <span>Nhắn tin</span>
                          </button>
                        </>
                      ) : isReceivingFriendRequest ? (
                        <>
                          <button
                            className="flex gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 font-medium items-center cursor-pointer"
                            onClick={handleAcceptFriendRequest}
                          >
                            <span>Chấp nhận lời mời</span>
                          </button>
                          <button
                            className="flex gap-2 bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] text-black dark:text-white rounded-md py-2 px-4 font-medium items-center cursor-pointer"
                            onClick={handleDeclineFriendRequest}
                          >
                            <span>Xoá lời mời</span>
                          </button>
                          <button
                            className="flex gap-2 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] cursor-pointer rounded-md py-2 px-4 text-black dark:text-white font-medium"
                            onClick={() => handleToggleChat(displayedUser)}
                          >
                            <img
                              src={
                                theme === "light"
                                  ? "/messenger-icon.png"
                                  : "/messenger-icon-white.png"
                              }
                              className="object-cover size-5"
                            />
                            <span>Nhắn tin</span>
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
                                ? "Huỷ lời mời"
                                : "Thêm bạn bè"}
                            </span>
                          </button>
                          <button
                            className="flex gap-2 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] cursor-pointer rounded-md py-2 px-4 text-black dark:text-white font-medium"
                            onClick={() => handleToggleChat(displayedUser)}
                          >
                            <img
                              src={
                                theme === "light"
                                  ? "/messenger-icon.png"
                                  : "/messenger-icon-white.png"
                              }
                              className="object-cover size-5"
                            />
                            <span>Nhắn tin</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap py-1">
                    {tabs.map((tab, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer border-b-4 font-medium py-1 px-2 lg:py-3 lg:px-4 ${
                          activeTab === tab.name
                            ? "border-blue-500 text-blue-500 bg-transparent"
                            : "border-transparent text-gray-500 hover:bg-gray-200 rounded-md"
                        }`}
                        onClick={() => setActiveTab(tab.name)}
                      >
                        {tab.name}
                      </div>
                    ))}
                    <div className="flex gap-2 items-center justify-center hover:bg-gray-200 cursor-pointer rounded-md py-1 px-2 lg:py-3 lg:px-4 text-gray-500 font-medium">
                      <span>Xem thêm</span>
                      <ChevronDown className="size-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gray-200 dark:bg-[#181826] lg:px-[17%] px-2 py-4 min-h-screen">
        <div className="flex lg:flex-row flex-col gap-4">
          <div className="lg:w-[40%] w-full space-y-4 lg:sticky top-[8.5vh] h-fit">
            <div className="rounded-xl bg-white dark:bg-[#1c1c28] border border-gray-200 dark:border-[#2c2c3a] p-5 space-y-2 shadow-sm transition-all duration-300">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Giới thiệu
                </h1>
                {isMyProfile && (
                  <button
                    onClick={() => setIsOpenInfoModal(true)}
                    className="text-sm px-3 py-1.5 rounded-md bg-gray-50 dark:bg-[#23233b] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2b2b3d] transition"
                  >
                    <Pencil className="inline w-4 h-4 mr-1" /> Chỉnh sửa
                  </button>
                )}
              </div>

              {/* Bio */}
              {displayedUser?.bio ? (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                  {displayedUser.bio}
                </p>
              ) : (
                isMyProfile && (
                  <button
                    onClick={() => setIsOpenInfoModal(true)}
                    className="py-2 px-4 w-full rounded-md bg-gray-50 dark:bg-[#23233b] dark:text-white font-medium text-sm hover:bg-gray-100 dark:hover:bg-[#2b2b3d]"
                  >
                    Thêm tiểu sử
                  </button>
                )
              )}

              <hr className="border-gray-200 dark:border-[#2b2b3d]" />

              {/* Education */}
              {displayedUser?.education?.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    Học vấn
                  </h2>
                  {displayedUser.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="pl-7 text-gray-700 dark:text-gray-300 text-sm"
                    >
                      <p className="font-medium">{edu.school}</p>
                      {edu.major && <p>{edu.major}</p>}
                      {edu.year && (
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {edu.year}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Work */}
              {displayedUser?.work && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span>
                    {(() => {
                      const { position, company, duration } =
                        displayedUser.work;
                      if (position && company && duration)
                        return `Làm ${position} tại ${company} (${duration})`;
                      if (position && company)
                        return `Làm ${position} tại ${company}`;
                      if (position) return position;
                      if (company) return `Làm việc tại ${company}`;
                      return null;
                    })()}
                  </span>
                </div>
              )}

              {/* Location */}
              {displayedUser?.address && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span>Sống tại {displayedUser.address}</span>
                </div>
              )}

              {/* Website */}
              {displayedUser?.website && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <a
                    href={displayedUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {displayedUser.website}
                  </a>
                </div>
              )}

              {/* Skills */}
              {displayedUser?.skills?.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    Kỹ năng
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {displayedUser.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-[#23233b] text-gray-800 dark:text-gray-300 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {displayedUser?.interests?.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    Sở thích
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {displayedUser.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-[#23233b] text-gray-800 dark:text-gray-300 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {displayedUser?.socialLinks?.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                    <Link2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    Liên kết
                  </h2>
                  <div className="flex flex-col gap-1 text-sm">
                    {displayedUser.socialLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {link.platform}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-md bg-white dark:bg-[#1e1e2f] border-2 border-gray-200 dark:border-[#2b2b3d] p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Ảnh
                </h1>
                <h1 className="text-blue-500 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#23233b]">
                  Xem tất cả ảnh
                </h1>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {posts.map(
                  (post) =>
                    post.media &&
                    post.media.length > 0 && (
                      <div
                        key={post._id}
                        className="relative w-full lg:h-32 h-56 overflow-hidden rounded-md cursor-pointer hover:scale-105 transition-transform duration-300 border-2 border-gray-200"
                      >
                        <img
                          src={`${Config.BACKEND_URL}${post.media[0]}`}
                          alt="Post"
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    )
                )}
              </div>
            </div>

            <div className="rounded-md bg-white dark:bg-[#1e1e2f] border-2 border-gray-200 dark:border-[#2b2b3d] p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Bạn bè
                </h1>
                <h1 className="text-blue-500 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#23233b]">
                  Xem tất cả bạn bè
                </h1>
              </div>
              <h1 className="text-gray-500 dark:text-gray-400 text-lg">{`${profile.friends.length} người bạn`}</h1>
              <div className="grid grid-cols-3 gap-2">
                {profile.friends.map((friend) => (
                  <div key={friend._id} className="w-full rounded-md">
                    <Link to={`/profile/${friend.slug}`}>
                      <img
                        src={
                          friend.avatar
                            ? `${Config.BACKEND_URL}${friend.avatar}`
                            : "/user.png"
                        }
                        alt="avatar"
                        className="w-32 h-30 object-cover rounded-md border-2 border-gray-200 dark:border-[#2b2b3d]"
                      />
                    </Link>
                    <Link
                      to={`/profile/${friend.slug}`}
                      className="font-medium dark:text-white text-sm hover:underline-offset-2 hover:underline"
                    >
                      {friend.fullName}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-[60%] w-full space-y-4">
            {isMyProfile && (
              <CreateStatus
                postedBy={{
                  _id: user._id,
                  name: user.fullName,
                  avatar: user.avatar,
                  slug: user.slug,
                }}
                onPostCreated={handleAddPost}
                postedByType={"User"}
                postedById={user?._id}
              />
            )}
            <div className="py-2 px-4 bg-white dark:bg-[#1e1e2f] rounded-lg">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Bài viết
              </h1>
            </div>
            {loading ? (
              <SpinnerLoading />
            ) : (
              <>
                {posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onDeletePost={handleRemovePost}
                    />
                  ))
                ) : (
                  <p className="text-center text-2xl dark:text-white">
                    Không có bài viết nào
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      {isWarningDeleteFriend && (
        <WarningDeleteFriend
          onConfirm={handleDeleteFriend}
          onCancel={() => setIsWarningDeleteFriend(false)}
          displayedUser={displayedUser}
        />
      )}
      {showChat && (
        <ChatBox userChat={activeChatUser} onClose={handleCloseChat} />
      )}

      {/* Modal */}
      {isOpenInfoModal && (
        <EditInfoModal
          onClose={() => setIsOpenInfoModal(false)}
          user={displayedUser}
          isMyProfile={isMyProfile}
          onUpdated={handleUpdateUser}
        />
      )}
    </>
  );
}

export default ProfilePage;
