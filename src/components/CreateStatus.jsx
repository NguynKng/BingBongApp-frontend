import { Link } from "react-router-dom";
import { useState } from "react";
import Config from "../envVars.js";
import useAuthStore from "../store/authStore.js";
import PostModal from "./PostModal"; // Bạn phải tạo PostModal.jsx theo hướng dẫn trước

function CreateStatus({ onPostCreated, postedByType, postedById }) {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="px-4 bg-white dark:bg-[#1b1f2b] dark:border dark:border-[#2b2b3d] rounded-lg">
        {/* Dòng tạo status */}
        <div className="flex items-center gap-2 py-4 border-b-2 border-gray-200 dark:border-gray-700">
          <Link
            to={`/profile/${user._id}`}
            className="size-12 rounded-full border-[1px] border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-[70%]"
          >
            <img
              src={
                user?.avatar
                  ? `${Config.BACKEND_URL}${user.avatar}`
                  : "/user.png"
              }
              alt="user-avatar"
              className="object-cover rounded-full size-full"
            />
          </Link>

          <div
            className="py-2 px-4 rounded-full bg-gray-100 dark:bg-[#2a2e3d] hover:bg-gray-200 dark:hover:bg-[#3a3e4d] w-full cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-gray-500 dark:text-gray-300 lg:text-[1.1rem] text-sm">
              {`${user.fullName} ơi, bạn đang nghĩ gì thế?`}
            </span>
          </div>
        </div>

        {/* Hàng icon: Live, Photo, Feeling */}
        <div className="flex items-center py-2">
          {[
            { icon: "/video-player.png", label: "Live video" },
            { icon: "/photos.png", label: "Photo/video" },
            { icon: "/smiling-face.png", label: "Feeling/activity" },
          ].map(({ icon, label }, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center justify-center w-1/3 gap-2 hover:bg-gray-100 dark:hover:bg-[#2f3344] cursor-pointer rounded-md py-2 px-4"
              onClick={() => setIsModalOpen(true)}
            >
              <img src={icon} className="object-cover size-6" alt={label} />
              <span className="text-gray-600 dark:text-gray-300 text-center">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal tạo bài viết */}
      {isModalOpen && (
        <PostModal
          onPostCreated={onPostCreated}
          postedByType={postedByType}
          postedById={postedById}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default CreateStatus;
