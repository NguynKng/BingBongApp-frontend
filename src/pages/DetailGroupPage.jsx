import { useEffect, useRef, useState } from "react";
import { Link, useParams, useLocation, Routes, Route } from "react-router-dom";
import { chatAPI, groupAPI, userAPI } from "../services/api";
import { Plus, Earth, Lock, Dot, Check, Clock, X } from "lucide-react";
import DiscussionTab from "../components/Group/DiscussionTab";
import AboutTab from "../components/Group/AboutTab";
import MembersTab from "../components/Group/MembersTab";
import MediaTab from "../components/Group/MediaTab";
import ManageTab from "../components/Group/ManageTab";
import SpinnerLoading from "../components/SpinnerLoading";
import NotFoundPage from "./NotFoundPage";
import { getBackendImgURL } from "../utils/helper";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import HoverWrapper from "../components/HoverWrapper";

export default function DetailGroupPage({ onToggleChat }) {
  const { slug } = useParams();
  const location = useLocation();
  const { user: currentUser, theme } = useAuthStore();
  const [isUploading, setIsUploading] = useState({
    avatar: false,
    coverPhoto: false,
  });
  const [isJoined, setIsJoined] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const avatarInputRef = useRef(null);
  const coverPhotoInputRef = useRef(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const isGroupAdmin = group?.admins?.some(
    (admin) => admin._id === currentUser._id
  );

  const clean = (p) => p.replace(/\/+$/, "");
  const isCurrentTab = (tabPath) =>
    clean(location.pathname) ===
    clean(`/group/${group.slug}${tabPath ? `/${tabPath.toLowerCase()}` : ""}`);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await groupAPI.getGroupBySlug(slug);
        setGroup(res.data);

        // Check if user is a member
        const isMember = res.data.members.some(
          (m) => m._id === currentUser._id
        );
        setIsJoined(isMember);

        // Check if user has pending join request
        const hasPendingRequest = res.data.pendingMembers?.some(
          (m) => m._id === currentUser._id
        );
        setIsPending(hasPendingRequest);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [slug, currentUser._id]);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading((prev) => ({ ...prev, avatar: true }));
      const response = await userAPI.uploadAvatar(file, "Group", group._id);
      setGroup((prev) => ({ ...prev, avatar: response.data }));
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to update avatar");
    } finally {
      setIsUploading((prev) => ({ ...prev, avatar: false }));
    }
  };

  const handleCoverPhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading((prev) => ({ ...prev, coverPhoto: true }));
      const response = await userAPI.uploadCoverPhoto(file, "Group", group._id);
      setGroup((prev) => ({ ...prev, coverPhoto: response.data }));
      toast.success("Cover photo updated successfully");
    } catch (error) {
      console.error("Cover photo upload error:", error);
      toast.error("Failed to update cover photo");
    } finally {
      setIsUploading((prev) => ({ ...prev, coverPhoto: false }));
    }
  };

  const handleJoinGroup = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const res = await groupAPI.joinGroup(group._id);

      if (res.action === "requested") {
        // Join request sent (pending approval)
        setIsPending(true);
        setIsJoined(false);
        toast.success("Join request sent!");

        // Add to pending members
        setGroup((prev) => ({
          ...prev,
          pendingMembers: [
            ...(prev.pendingMembers || []),
            {
              _id: currentUser._id,
              avatar: currentUser.avatar,
              slug: currentUser.slug,
              fullName: currentUser.fullName,
            },
          ],
        }));
      } else if (res.action === "canceled") {
        // Cancel join request
        setIsPending(false);
        toast.success("Join request canceled");

        // Remove from pending members
        setGroup((prev) => ({
          ...prev,
          pendingMembers: prev.pendingMembers?.filter(
            (m) => m._id !== currentUser._id
          ),
        }));
      } else if (res.action === "joined") {
        // Directly joined (no approval needed)
        setIsJoined(true);
        setIsPending(false);
        toast.success("Joined group successfully!");

        // Add to members
        setGroup((prev) => ({
          ...prev,
          members: [
            ...prev.members,
            {
              _id: currentUser._id,
              avatar: currentUser.avatar,
              slug: currentUser.slug,
              fullName: currentUser.fullName,
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Join group error:", error);
      toast.error(error.response?.data?.error || "Failed to join group");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (isProcessing) return;

    if (!confirm("Are you sure you want to leave this group?")) return;

    setIsProcessing(true);
    try {
      const res = await groupAPI.leaveGroup(group._id);

      if (res.success) {
        setIsJoined(false);
        setIsPending(false);
        toast.success("Left group successfully");

        // Remove from members
        setGroup((prev) => ({
          ...prev,
          members: prev.members.filter((m) => m._id !== currentUser._id),
          admins: prev.admins.filter((a) => a._id !== currentUser._id),
          moderators: prev.moderators.filter((m) => m._id !== currentUser._id),
        }));
      }
    } catch (error) {
      console.error("Leave group error:", error);
      toast.error(error.response?.data?.error || "Failed to leave group");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleChat = async (groupId) => {
    const response = await chatAPI.getChatIdByTypeId({
      fanpageId: groupId,
      type: "fanpage",
    });
    onToggleChat(response.data);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerLoading />
      </div>
    );
  if (!group) return <NotFoundPage />;

  const tabs = [
    { label: "About", path: `about` },
    { label: "Discussion", path: `` },
    { label: "People", path: `members` },
    { label: "Media", path: `media` },
    ...(isGroupAdmin ? [{ label: "Manage", path: `manage` }] : []),
  ];

  return (
    <>
      <div className="lg:px-[15%] bg-gray-100 dark:bg-[#181826]">
        <div className="relative w-full">
          <div className="relative w-full lg:h-[24rem] md:h-[22rem] sm:h-[20rem] h-[18rem] rounded-b-md">
            <img
              src={getBackendImgURL(group.coverPhoto)}
              className="size-full lg:rounded-b-md object-cover"
              alt="Cover photo"
              loading="lazy"
            />

            {isGroupAdmin && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={coverPhotoInputRef}
                  onChange={handleCoverPhotoUpload}
                />
                <div
                  className="absolute bottom-4 right-4 z-31 flex items-center gap-2 bg-white hover:bg-gray-300 cursor-pointer rounded-md py-2 px-4 text-black font-medium"
                  onClick={() => coverPhotoInputRef.current.click()}
                >
                  <img src="/camera.png" className="size-4" />
                  <span className="lg:inline hidden">
                    {isUploading.coverPhoto
                      ? "Uploading..."
                      : "Change cover photo"}
                  </span>
                </div>
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/50 to-transparent h-[30%] rounded-md"></div>
              </>
            )}

            <div className="absolute bottom-0 lg:translate-y-1/2 translate-y-1/5 lg:left-10 left-4 bg-gray-200 dark:bg-[#23233b] rounded-full z-10 w-46 h-46 flex border-4 border-white items-center justify-center">
              <img
                src={getBackendImgURL(group.avatar)}
                className="size-full rounded-full object-cover cursor-pointer hover:opacity-70"
                alt="Avatar"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={avatarInputRef}
                onChange={handleAvatarUpload}
              />

              {isGroupAdmin && (
                <div
                  className="absolute bottom-4 right-0 p-2 size-9 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  onClick={() => avatarInputRef.current.click()}
                >
                  {isUploading.avatar ? (
                    <div className="size-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <img src="/camera.png" className="size-full" />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            <div className="relative w-full">
              <div className="lg:px-8 px-4">
                <div className="flex lg:flex-row flex-col lg:justify-between justify-center lg:items-end items-start border-b-2 border-gray-200 dark:border-[#2b2b3d] lg:pb-4 pb-1 lg:pl-[13rem] lg:pt-4 pt-10">
                  <div className="flex lg:flex-row flex-col gap-2 items-center self-start">
                    <div className="flex flex-col gap-1">
                      <h1 className="text-3xl font-bold dark:text-white">
                        {group.name || "Loading..."}
                      </h1>
                      <div className="flex items-center gap-1">
                        {group.visibility === "public" ? (
                          <div className="flex items-center gap-1">
                            <Earth className="size-4 text-gray-500" />
                            <p className="text-sm text-gray-500">
                              Public group
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Lock className="size-4 text-gray-500" />
                            <p className="text-sm text-gray-500">
                              Private group
                            </p>
                          </div>
                        )}
                        <Dot className="size-4 text-gray-500" />
                        <p className="text-sm text-gray-500">{`${
                          group.members.length || 0
                        } member${group.members.length === 1 ? "" : "s"}`}</p>
                      </div>
                      <div className="flex items-center">
                        {group.members.slice(0, 20).map((member, index) => (
                          <HoverWrapper
                            slug={member.slug}
                            type="User"
                            key={member._id}
                          >
                            <Link
                              to={`/profile/${member.slug}`}
                              className={index > 0 ? "-ml-2" : ""}
                            >
                              <img
                                src={getBackendImgURL(member.avatar)}
                                alt={member.fullName}
                                className="size-6 rounded-full object-cover"
                              />
                            </Link>
                          </HoverWrapper>
                        ))}

                        {group.members.length > 20 && (
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                            +{group.members.length - 20} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 justify-end items-center py-4 z-30">
                    {isJoined ? (
                      // Already Joined - Show Leave Button
                      <button
                        onClick={handleLeaveGroup}
                        disabled={isProcessing}
                        className="flex gap-2 items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-[#23233b] dark:hover:bg-[#262638] cursor-pointer rounded-md py-2 px-4 text-black dark:text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="size-4" />
                        <span>Joined</span>
                      </button>
                    ) : isPending ? (
                      // Pending Request - Show Cancel Button
                      <button
                        onClick={handleJoinGroup}
                        disabled={isProcessing}
                        className="flex gap-2 items-center justify-center bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 cursor-pointer rounded-md py-2 px-4 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Clock className="size-4" />
                        )}
                        <span>
                          {isProcessing ? "Processing..." : "Pending"}
                        </span>
                      </button>
                    ) : (
                      // Not Joined - Show Join Button
                      <button
                        onClick={handleJoinGroup}
                        disabled={isProcessing}
                        className="flex gap-2 items-center justify-center bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 cursor-pointer rounded-md py-2 px-4 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                        <span>{isProcessing ? "Processing..." : "Join"}</span>
                      </button>
                    )}

                    {isJoined && (
                      <button
                        className="flex gap-2 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#262638] cursor-pointer rounded-md py-2 px-4 text-black dark:text-white font-medium"
                        onClick={() => handleToggleChat(group._id)}
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
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap py-1">
                    {tabs.map((tab, index) => (
                      <Link
                        to={`/group/${group.slug}${
                          tab.path ? `/${tab.path}` : ""
                        }`}
                        key={index}
                        className={`cursor-pointer border-b-4 font-medium py-1 px-2 lg:py-3 lg:px-4 ${
                          isCurrentTab(tab.path)
                            ? "border-blue-500 text-blue-500"
                            : "border-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-[#23233b] rounded-md"
                        }`}
                      >
                        {tab.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-200 dark:bg-[#181826] lg:px-[14%] px-2 py-4 min-h-screen">
        <Routes>
          <Route path="/" element={<DiscussionTab group={group} />} />
          <Route path="about" element={<AboutTab group={group} />} />
          <Route path="members" element={<MembersTab group={group} />} />
          <Route path="media" element={<MediaTab group={group} />} />
          {isGroupAdmin && (
            <Route path="manage" element={<ManageTab group={group} />} />
          )}
        </Routes>
      </div>
    </>
  );
}
