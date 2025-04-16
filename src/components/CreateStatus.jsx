import { Link } from "react-router-dom"
import { useState } from "react"
import Config from "../envVars.js"
import useAuthStore from "../store/authStore.js"
import PostModal from "./PostModal" // Bạn phải tạo PostModal.jsx theo hướng dẫn trước

function CreateStatus() {
  const { user } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="px-4 bg-white rounded-lg">
        {/* Dòng tạo status */}
        <div className="flex items-center gap-2 py-4 border-b-2 border-gray-200">
          <Link to="/profile" className="size-12 rounded-full border-2 border-gray-300 cursor-pointer hover:opacity-[70%]">
            <img
              src={user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : '/user.png'}
              alt="user-avatar"
              className="object-cover rounded-full size-full"
            />
          </Link>

          <div
            className="py-2 px-4 rounded-full bg-gray-100 w-full hover:bg-gray-200 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-gray-500 text-[1.1rem]">
              {`${user.fullName} ơi, bạn đang nghĩ gì thế?`}
            </span>
          </div>
        </div>

        {/* Hàng icon: Live, Photo, Feeling */}
        <div className="flex items-center py-2">
          <div className="flex items-center justify-center w-1/3 gap-2 hover:bg-gray-100 cursor-pointer rounded-md py-2 px-4" onClick={() => setIsModalOpen(true)}>
            <img src="/video-player.png" className="object-cover size-8" alt="video-player" />
            <span className="text-gray-600">Live video</span>
          </div>
          <div className="flex items-center justify-center w-1/3 gap-2 hover:bg-gray-100 cursor-pointer rounded-md py-2 px-4" onClick={() => setIsModalOpen(true)}>
            <img src="/photos.png" className="object-cover size-8" alt="photos" />
            <span className="text-gray-600">Photo/video</span>
          </div>
          <div className="flex items-center justify-center w-1/3 gap-2 hover:bg-gray-100 cursor-pointer rounded-md py-2 px-4" onClick={() => setIsModalOpen(true)}>
            <img src="/smiling-face.png" className="object-cover size-8" alt="feeling" />
            <span className="text-gray-600">Feeling/activity</span>
          </div>
        </div>
      </div>

      {/* Modal tạo bài viết */}
      {isModalOpen && (
        <PostModal user={user} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  )
}

export default CreateStatus
