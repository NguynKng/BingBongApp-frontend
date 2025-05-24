import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Meta from "../components/Meta";
import {
  ChevronDown,
  Ellipsis,
  Plus,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import CreateStatus from "../components/CreateStatus";
import PostCard from "../components/PostCard";
import { Link, useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Config from "../envVars";
import { userAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { useGetUserPosts } from "../hooks/usePosts";
import { useGetProfile } from "../hooks/useProfile";
import SpinnerLoading from "../components/SpinnerLoading";

function ProfilePage() {
  const [isOpenFriendsDropdown, setIsOpenFriendsDropdown] = useState(false);
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("Bài viết");
  const [isUploading, setIsUploading] = useState({
    avatar: false,
    coverPhoto: false,
  });
  const { user, updateUser, theme } = useAuthStore();
  const avatarInputRef = useRef(null);
  const coverPhotoInputRef = useRef(null);
  const { posts, setPosts, loading } = useGetUserPosts(userId);

  const isMyProfile = userId === user?._id;

  const { profile } = useGetProfile(userId);

  const displayedUser = profile ?? null;

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
      const response = await userAPI.uploadAvatar(file);
      updateUser({ avatar: response.user.avatar });
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
      const response = await userAPI.uploadCoverPhoto(file);
      updateUser({ coverPhoto: response.user.coverPhoto });
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

  return (
    <>
      <Meta title="BingBong" />
      <div className="lg:px-[15%] bg-gray-100 dark:bg-[#181826]">
        <div className="relative w-full lg:h-[38rem] h-[30rem]">
          <div className="relative w-full h-[71%] rounded-b-md">
            <img
              src={
                displayedUser?.coverPhoto
                  ? `${Config.BACKEND_URL}${displayedUser.coverPhoto}`
                  : "/background-gray.avif"
              }
              className="size-full rounded-b-md object-cover"
              alt="Cover photo"
            />
            <input
              type="file"
              ref={coverPhotoInputRef}
              onChange={handleCoverPhotoUpload}
              accept="image/*"
              className="hidden"
            />
            {isMyProfile && (
              <div
                className="absolute bottom-4 right-8 z-31 flex items-center gap-2 bg-white hover:bg-gray-300 cursor-pointer rounded-md py-2 px-4 text-black font-medium"
                onClick={() => coverPhotoInputRef.current.click()}
              >
                <img src="/camera.png" className="size-4 object-cover" />
                <span>
                  {isUploading.coverPhoto ? "Uploading..." : "Thay ảnh bìa"}
                </span>
              </div>
            )}
          </div>
          <div className="absolute w-full -bottom-1">
            <div className="relative w-full">
              <div className="absolute top-0 w-full bg-gradient-to-t from-black/50 to-transparent h-[30%] rounded-md"></div>
              <div className="px-8">
                <div className="flex lg:flex-row flex-col lg:justify-between justify-center lg:items-end items-center border-b-2 border-gray-200 dark:border-[#2b2b3d] pb-4">
                  <div className="flex lg:flex-row flex-col gap-2 justify-center items-center">
                    <div className="relative bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] rounded-full size-46 flex border-4 border-white items-center justify-center">
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
                            <img
                              src="/camera.png"
                              className="size-full object-cover"
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center lg:items-start items-center self-end py-4 px-2">
                      <h1 className="text-3xl font-bold text-center bg-white/80 dark:bg-[#23233b]/80 lg:bg-transparent px-2 rounded dark:text-white">
                        {displayedUser?.fullName || "Loading..."}
                      </h1>
                      <p className="text-gray-500 text-center dark:text-gray-400 bg-white/80 dark:bg-[#23233b]/80 lg:bg-transparent px-2 rounded">{`${
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
                            <img
                              src="/pen.png"
                              className="size-5 object-cover"
                            />
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
                                    onClick={handleDeleteFriend}
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
                          <button className="flex gap-2 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] cursor-pointer rounded-md py-2 px-4 text-black dark:text-white font-medium">
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
                          <button className="flex gap-2 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] cursor-pointer rounded-md py-2 px-4 text-black dark:text-white font-medium">
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
                          <button className="flex gap-2 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] cursor-pointer rounded-md py-2 px-4 text-black dark:text-white font-medium">
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

      <section className="bg-gray-200 dark:bg-[#181826] lg:px-[17%] md:px-[10%] px-2 py-4 min-h-screen">
        <div className="flex lg:flex-row flex-col gap-4">
          <div className="lg:w-[40%] w-full space-y-4 lg:sticky top-[8.5vh] h-fit">
            <div className="rounded-md bg-white dark:bg-[#1e1e2f] border-2 border-gray-200 dark:border-[#2b2b3d] p-4 space-y-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Giới thiệu
              </h1>
              <button className="py-2 px-4 text-center w-full rounded-md bg-gray-200 dark:bg-[#23233b] dark:text-white font-medium cursor-pointer hover:bg-gray-300 dark:hover:bg-[#23233b]">
                Thêm tiểu sử
              </button>
              <div className="flex gap-2 items-center">
                <img src="/graduate.png" className="size-5" />
                <span className="text-gray-600 dark:text-gray-400">
                  Went to THPT Trần khai Nguyên
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <img src="/location-pin.png" className="size-5" />
                <span className="text-gray-600 dark:text-gray-400">
                  From Ho Chi Minh City, Vietnam
                </span>
              </div>
              <button className="py-2 px-4 text-center w-full rounded-md bg-gray-200 dark:bg-[#23233b] dark:text-white font-medium cursor-pointer hover:bg-gray-300 dark:hover:bg-[#23233b]">
                Chỉnh sửa chi tiết
              </button>
              <button className="py-2 px-4 text-center w-full rounded-md bg-gray-200 dark:bg-[#23233b] dark:text-white font-medium cursor-pointer hover:bg-gray-300 dark:hover:bg-[#23233b]">
                Thêm nội dung đáng chú ý
              </button>
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
                    <Link to={`/profile/${friend._id}`}>
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
                      to={`/profile/${friend._id}`}
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
            {isMyProfile && <CreateStatus onPostCreated={handleAddPost} />}
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
    </>
  );
}

export default ProfilePage;
