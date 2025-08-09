import { useState } from "react";
import Config from "../envVars.js";
import { toast } from "react-hot-toast";
import { postAPI } from "../services/api.js";
import useAuthStore from "../store/authStore.js";

function PostModal({ onClose, onPostCreated }) {
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn reload trang
    setLoading(true);

    const formData = new FormData();
    formData.append("content", content);
    formData.append("time", new Date().toISOString());

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const response = await postAPI.createPost(formData);
      if (response.success === true) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
        return; // Dừng nếu có lỗi
      }

      if (onPostCreated) {
        onPostCreated(response.post); // Send it back to HomePage
      }

      setContent("");
      setImages([]);
      setImagesPreview([]);
      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...files]);
    setImagesPreview((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagesPreview((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-90 backdrop-blur-sm"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg w-full max-w-xl p-4 shadow-xl z-10"
      >
        <button
          type="button"
          className="absolute p-2 rounded-full size-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 top-2 right-2 text-black dark:text-white cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 pb-2 border-b-2 dark:border-gray-600 border-gray-200">
          Tạo bài viết
        </h2>

        <div className="flex gap-3 items-center mb-4">
          <img
            src={
              user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : "/user.png"
            }
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{user.fullName}</p>
            <select className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
              <option>Bạn bè</option>
              <option>Công khai</option>
              <option>Chỉ mình tôi</option>
            </select>
          </div>
        </div>

        <textarea
          className="w-full h-40 resize-none p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none"
          placeholder={`${user.fullName} ơi, bạn đang nghĩ gì thế?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {imagesPreview.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {imagesPreview.map((preview, index) => (
              <div key={index} className="relative group w-32 h-32">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <label
            htmlFor="uploadImage"
            className="flex items-center gap-2 text-purple-600 cursor-pointer hover:text-purple-800"
          >
            <img src="/photos.png" className="w-6 h-6" alt="upload" />
            <span className="dark:text-white">Ảnh</span>
          </label>
          <input
            id="uploadImage"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Đang đăng..." : "Đăng"}
        </button>
      </form>
    </div>
  );
}

export default PostModal;
