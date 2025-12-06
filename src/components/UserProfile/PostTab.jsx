import { useGetOwnerPosts } from "../../hooks/usePosts";
import { getBackendImgURL } from "../../utils/helper";
import useAuthStore from "../../store/authStore";
import {
  ChevronDown,
  Globe,
  GraduationCap,
  MapPin,
  Pencil,
  Sparkles,
  UserCheck,
  UserPlus,
  UserX,
  Link2,
  BriefcaseBusiness,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import EditInfoModal from "../EditInfoModal";
import useUserStore from "../../store/userStore";
import CreateStatus from "../CreateStatus";
import SpinnerLoading from "../SpinnerLoading";
import PostCard from "../PostCard";
import { memo } from "react";

const PostTab = memo(({ displayedUser }) => {
  const { updateUserProfileInStore } = useUserStore();
  const userId = displayedUser?._id;
  const { user } = useAuthStore();
  const isMyProfile = userId === user?._id;
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);
  const { posts, setPosts, loading } = useGetOwnerPosts("User", userId);
  const handleAddPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleRemovePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };
  const handleUpdateUser = (updatedData) => {
    if (isMyProfile) {
      updateUserProfileInStore(displayedUser.slug, updatedData);
    }
  };
  return (
    <>
      <div className="flex lg:flex-row flex-col gap-4">
        <div className="lg:w-[40%] w-full space-y-4 lg:sticky top-[8.5vh] h-fit">
          <div className="rounded-xl bg-white dark:bg-[#1c1c28] border border-gray-200 dark:border-[#2c2c3a] p-5 space-y-2 shadow-sm transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Intro
              </h1>
              {isMyProfile && (
                <button
                  className="py-1 px-3 rounded-lg cursor-pointer bg-blue-500 text-white"
                  onClick={() => setIsOpenInfoModal(true)}
                >
                  Edit
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
                  Add bio
                </button>
              )
            )}

            <hr className="border-gray-200 dark:border-[#2b2b3d]" />

            {/* Education */}
            {displayedUser?.education?.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <GraduationCap className="size-5 fill-gray-500 text-white dark:text-black" />
                  Education
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
                <BriefcaseBusiness className="fill-gray-500 text-white size-5 dark:text-black" />
                <div>
                  {displayedUser.work?.position && (
                    <strong>{displayedUser.work.position}</strong>
                  )}
                  {displayedUser.work?.company && (
                    <>
                      {displayedUser.work?.position ? " at " : "Work at "}
                      <strong>{displayedUser.work.company}</strong>
                    </>
                  )}
                  {displayedUser.work?.duration && (
                    <>
                      {" ("}
                      <strong>{displayedUser.work.duration}</strong>
                      {")"}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            {displayedUser?.address && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="fill-gray-500 text-white size-5 dark:text-black" />
                <span>
                  Lives in <strong>{displayedUser.address}</strong>
                </span>
              </div>
            )}

            {/* Website */}
            {displayedUser?.website && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Globe className="fill-gray-500 text-white size-5 dark:text-black" />
                <Link
                  to={displayedUser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {displayedUser.website}
                </Link>
              </div>
            )}

            {/* Skills */}
            {displayedUser?.skills?.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                  <Sparkles className="fill-gray-500 text-white size-5" />
                  Skills
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
                  <Heart className="fill-gray-500 text-white size-5 dark:text-black" />
                  Interests
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
                  <Link2 className="fill-gray-500 text-white size-5 dark:text-black" />
                  Social Links
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
                Photos
              </h1>
              <h1 className="text-blue-500 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#23233b]">
                View All Photos
              </h1>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(() => {
                let count = 0; // đếm số ảnh hiển thị tối đa
                const maxImages = 9;

                return posts.map((post) => {
                  if (!post.media || post.media.length === 0) return null;

                  return post.media.map((img, idx) => {
                    if (count >= maxImages) return null; // dừng khi đạt 9 ảnh
                    count++;

                    return (
                      <Link
                        key={`${post._id}-${idx}`}
                        to={`/posts/${post._id}`} // link đến post tương ứng
                        className="relative w-full lg:h-32 h-56 overflow-hidden rounded-md cursor-pointer hover:scale-105 transition-transform duration-300 border-2 border-gray-200"
                      >
                        <img
                          src={getBackendImgURL(img)}
                          alt="Post"
                          className="w-full h-full object-cover rounded-md"
                        />
                      </Link>
                    );
                  });
                });
              })()}
            </div>
          </div>

          <div className="rounded-md bg-white dark:bg-[#1e1e2f] border-2 border-gray-200 dark:border-[#2b2b3d] p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Friends
              </h1>
              <h1 className="text-blue-500 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#23233b]">
                View All Friends
              </h1>
            </div>
            <h1 className="text-gray-500 dark:text-gray-400 text-lg">{`${
              displayedUser.friends.length
            } friend${displayedUser.friends.length !== 1 ? "s" : ""}`}</h1>
            <div className="grid grid-cols-3 gap-2">
              {displayedUser.friends.map((friend) => (
                <div key={friend._id} className="w-full rounded-md">
                  <Link to={`/profile/${friend.slug}`}>
                    <img
                      src={getBackendImgURL(friend.avatar)}
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
              Posts
            </h1>
          </div>
          {loading ? (
            <div className="min-h-[50vh] flex items-center justify-center">
              <SpinnerLoading />
            </div>
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
                  No posts available
                </p>
              )}
            </>
          )}
        </div>
      </div>
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
})

export default PostTab;