import { useState } from "react"
import axios from "axios"
import Config from "../envVars.js"

function PostModal({ user, onClose }) {
  const [content, setContent] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handlePost = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append("content", content)
    formData.append("time", new Date().toISOString()) // Thêm thời gian tự động

    if (image) {
      formData.append("image", image)
    }

    try {
      const response = await axios.post(`${Config.BACKEND_URL}/api/v1/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Bắt buộc để gửi cookie chứa JWT
      })

      setSuccess("Đăng bài thành công!")
      console.log(response.data)

      // Reset
      setContent("")
      setImage(null)
      setImagePreview(null)
      onClose()
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      setError(errorMessage)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-lg p-4 shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold text-center mb-4">Tạo bài viết</h2>
        
        <div className="flex gap-3 items-center mb-4">
          <img
            src={user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : '/user.png'}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{user.fullName}</p>
            <select className="text-sm text-gray-500 bg-gray-100 rounded px-2 py-1">
              <option>Bạn bè</option>
              <option>Công khai</option>
              <option>Chỉ mình tôi</option>
            </select>
          </div>
        </div>

        <textarea
          className="w-full h-40 resize-none p-2 border border-gray-300 rounded focus:outline-none"
          placeholder={`${user.fullName} ơi, bạn đang nghĩ gì thế?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {imagePreview && (
          <div className="mt-2">
            <img src={imagePreview} alt="Preview" className="max-h-60 rounded-lg" />
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <label
            htmlFor="uploadImage"
            className="flex items-center gap-2 text-purple-600 cursor-pointer hover:text-purple-800"
          >
            <img src="/photos.png" className="w-6 h-6" alt="upload" />
            <span>Ảnh</span>
          </label>
          <input
            id="uploadImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}

        <button
          className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          onClick={handlePost}
          disabled={(!content.trim() && !image) || loading}
        >
          {loading ? "Đang đăng..." : "Đăng"}
        </button>
      </div>
    </div>
  )
}

export default PostModal
