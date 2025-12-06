import {
  Lock,
  Globe,
  Pencil,
  Tag,
  Settings,
  Image,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import CreateStatus from "../CreateStatus";
import { useState } from "react";
import PostCard from "../PostCard";
import SpinnerLoading from "../SpinnerLoading";
import { useGetOwnerPosts } from "../../hooks/usePosts";
import { Link } from "react-router-dom";
import { getBackendImgURL } from "../../utils/helper";
import EditGroupInfoModal from "../EditGroupInfoModal";

export default function DiscussionTab({ group: initialGroup }) {
  const { user } = useAuthStore();
  const [group, setGroup] = useState(initialGroup); // Local state for updates
  const {
    posts,
    setPosts,
    loading: postLoading,
  } = useGetOwnerPosts("Group", group._id);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const isGroupAdmin =
    user && group.admins.some((admin) => admin._id === user._id);
  const MAX_LENGTH = 200;
  const isJoined =
    user && group.members.some((member) => member._id === user._id);

  const handleAddPost = (newPost) => setPosts((prev) => [newPost, ...prev]);
  const handleRemovePost = (postId) =>
    setPosts((prev) => prev.filter((post) => post._id !== postId));

  const handleGroupUpdate = (updatedGroup) => {
    setGroup(updatedGroup); // Update local group state
  };

  const description = group.description || "No description provided.";
  const shouldTruncate = description.length > MAX_LENGTH;
  const displayDescription =
    shouldTruncate && !showFullDescription
      ? description.slice(0, MAX_LENGTH) + "..."
      : description;

  return (
    <>
      <div className="flex lg:flex-row flex-col gap-4">
        {/* --- Posts Column --- */}
        <div className="lg:w-[60%] w-full space-y-4">
          {((isJoined && group.settings.allowMemberPost) || isGroupAdmin) && (
            <CreateStatus
              postedBy={{
                _id: group._id,
                name: group.name,
                avatar: group.avatar,
                slug: group.slug,
              }}
              onPostCreated={handleAddPost}
              postedByType="Group"
              postedById={group._id}
            />
          )}

          <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-4 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Posts
            </h1>
          </div>

          {postLoading ? (
            <SpinnerLoading />
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDeletePost={handleRemovePost}
              />
            ))
          ) : (
            <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-12 border border-gray-200 dark:border-[#2b2b3d] shadow-sm text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No posts available
              </p>
            </div>
          )}
        </div>

        {/* --- About Sidebar --- */}
        <div className="lg:w-[40%] w-full space-y-4 lg:sticky top-[8.5vh] h-fit">
          {/* About Card */}
          <div className="rounded-xl bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-[#2b2b3d] p-5 shadow-sm space-y-5">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">About</h2>
              {isGroupAdmin && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Pencil className="size-4" /> Edit
                </button>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {displayDescription}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {showFullDescription ? (
                    <>
                      See Less <ChevronUp className="size-4" />
                    </>
                  ) : (
                    <>
                      See More <ChevronDown className="size-4" />
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-[#2b2b3d] pt-4" />

            {/* Visibility */}
            <div className="flex gap-3 items-start">
              <div
                className={`p-2 rounded-lg ${
                  group.visibility === "public"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {group.visibility === "public" ? (
                  <Globe className="size-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Lock className="size-5 text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-semibold text-base capitalize dark:text-gray-200 mb-1">
                  {group.visibility} Group
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {group.visibility === "public"
                    ? "Anyone can see who's in the group and what they post."
                    : "Only members can see who's in the group and what they post."}
                </p>
              </div>
            </div>

            {/* Tags */}
            {group.tags && group.tags.length > 0 && (
              <>
                <div className="border-t border-gray-200 dark:border-[#2b2b3d] pt-4" />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="size-5 text-blue-600 dark:text-blue-400" />
                    <p className="font-semibold text-base dark:text-gray-200">
                      Tags
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Settings */}
            <div className="border-t border-gray-200 dark:border-[#2b2b3d] pt-4" />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Settings className="size-5 text-gray-600 dark:text-gray-400" />
                <p className="font-semibold text-base dark:text-gray-200">
                  Group Settings
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#252838]">
                  <div
                    className={`mt-0.5 size-2 rounded-full flex-shrink-0 ${
                      group.settings.allowMemberPost
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Members{" "}
                    <b>{group.settings.allowMemberPost ? "can" : "cannot"}</b>{" "}
                    post in the group.
                  </span>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#252838]">
                  <div
                    className={`mt-0.5 size-2 rounded-full flex-shrink-0 ${
                      group.settings.requirePostApproval
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {group.settings.requirePostApproval ? (
                      <>
                        Posts require <b>admin approval</b>.
                      </>
                    ) : (
                      <>
                        Posts appear <b>instantly</b>.
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#252838]">
                  <div
                    className={`mt-0.5 size-2 rounded-full flex-shrink-0 ${
                      group.settings.requireJoinApproval
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {group.settings.requireJoinApproval ? (
                      <>
                        Joining requires <b>admin approval</b>.
                      </>
                    ) : (
                      <>
                        Anyone can join <b>without approval</b>.
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Media Card */}
          <div className="rounded-xl bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-[#2b2b3d] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Image className="size-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold dark:text-white">
                Recent Media
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(() => {
                let count = 0;
                const maxImages = 9;

                return posts.map((post) => {
                  if (!post.media || post.media.length === 0) return null;

                  return post.media.map((img, idx) => {
                    if (count >= maxImages) return null;
                    count++;

                    return (
                      <Link
                        key={`${post._id}-${idx}`}
                        to={`/posts/${post._id}`}
                        className="relative w-full aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-200"
                      >
                        <img
                          src={getBackendImgURL(img)}
                          alt="Post media"
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    );
                  });
                });
              })()}
            </div>

            {posts.some((post) => post.media && post.media.length > 0) && (
              <Link to={`/group/${group.slug}/media`}>
                <button className="w-full rounded-lg py-2.5 px-4 font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                  View All Media
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditGroupInfoModal
        group={group}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleGroupUpdate}
      />
    </>
  );
}
