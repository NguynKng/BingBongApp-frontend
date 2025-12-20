import { Link } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../store/authStore.js";
import PostModal from "./PostModal"; // You must create PostModal.jsx as instructed before
import { getBackendImgURL } from "../utils/helper.js";

function CreateStatus({ onPostCreated, postedBy, postedByType, postedById }) {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const linkToProfile = () => {
    switch (postedByType) {
      case "User":
        return `/profile/${postedBy.slug}`;
      case "Shop":
        return `/shop/${postedBy.slug}`;
      case "Group":
        return `/profile/${user.slug}`;
      default:
        return `/profile/${user.slug}`;
    }
  };

  const placeholderText = () => {
    switch (postedByType) {
      case "User":
        return `What's on your mind, ${postedBy.name}?`;
      case "Shop":
        return `What's new in your shop, ${postedBy.name}?`;
      case "Group":
        return `Share something with your group, ${user.fullName}?`;
      default:
        return `What's on your mind, ${postedBy.name}?`;
    }
  };

  return (
    <>
      <div className="px-4 bg-white dark:bg-[#1b1f2b] dark:border dark:border-[#2b2b3d] rounded-lg">
        {/* Status input row */}
        <div className="flex items-center gap-2 py-4 border-b-2 border-gray-200 dark:border-gray-700">
          <Link
            to={linkToProfile()}
            className="size-12 rounded-full border-[1px] border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-[70%]"
          >
            <img
              src={getBackendImgURL(
                postedByType === "Group" ? user.avatar : postedBy.avatar
              )}
              alt="user-avatar"
              className="object-cover rounded-full size-full"
            />
          </Link>

          <div
            className="py-2 px-4 rounded-full bg-gray-100 dark:bg-[#2a2e3d] hover:bg-gray-200 dark:hover:bg-[#3a3e4d] flex-1 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-gray-500 dark:text-gray-300 lg:text-[1.1rem] text-sm">
              {placeholderText()}
            </span>
          </div>
          <button className="rounded-lg hover:bg-gray-200 cursor-pointer p-2" onClick={() => setIsModalOpen(true)}>
            <img
              src="/photos.png"
              alt="Photos"
              className="object-cover size-6"
            />
          </button>
        </div>
      </div>

      {/* Post creation modal */}
      {isModalOpen && (
        <PostModal
          onPostCreated={onPostCreated}
          postedBy={postedBy}
          postedByType={postedByType}
          postedById={postedById}
          onClose={() => setIsModalOpen(false)}
          placeholder={placeholderText()}
        />
      )}
    </>
  );
}

export default CreateStatus;
