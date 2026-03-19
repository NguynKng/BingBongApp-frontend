import { useState, useRef, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { postAPI } from "../services/api.js";
import { getBackendImgURL } from "../utils/helper.js";
import useAuthStore from "../store/authStore.js";
import { useGetProfileByName } from "../hooks/useProfile.jsx";
import debounce from "lodash.debounce";
import { Tag, Smile, Video } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

function PostModal({
  onClose,
  onPostCreated,
  postedBy,
  postedByType,
  postedById,
  placeholder,
}) {
  const { user, theme } = useAuthStore();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [imageKeys, setImageKeys] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videosPreview, setVideosPreview] = useState([]);
  const [videoKeys, setVideoKeys] = useState([]);
  const [mediaSequence, setMediaSequence] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // ✅ Tag user states
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchInputRef = useRef(null);

  const isSearchingUser = debouncedQuery.length > 0;
  const { listUser, loading: loadingUsers } = useGetProfileByName(
    debouncedQuery,
    {
      enabled: isSearchingUser,
    }
  );

  // ✅ Debounce search query
  const debouncedSetQuery = useMemo(
    () =>
      debounce((value) => {
        setDebouncedQuery(value);
      }, 500),
    []
  );

  // Cleanup debounce
  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  // ✅ Auto focus search input khi mở tag modal
  useEffect(() => {
    if (showTagModal && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showTagModal]);

  // ✅ Xử lý search user
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSetQuery(value);
  };

  const handleEmojiClick = (emojiData) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  // ✅ Chọn user từ gợi ý
  const handleSelectUser = (selectedUser) => {
    // Kiểm tra user đã được tag chưa
    if (!taggedUsers.find((u) => u._id === selectedUser._id)) {
      setTaggedUsers([...taggedUsers, selectedUser]);
    }
    setShowTagModal(false);
    setSearchQuery("");
    setDebouncedQuery("");
  };

  // ✅ Xóa user khỏi danh sách tag
  const handleRemoveTag = (userId) => {
    setTaggedUsers(taggedUsers.filter((u) => u._id !== userId));
  };

  const createTempMediaKey = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && images.length === 0 && videos.length === 0) {
      toast.error("Please add text, image, or video before posting.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    formData.append("postedByType", postedByType);
    formData.append("postedById", postedById);

    // ✅ Thêm tagged users
    taggedUsers.forEach((user) => {
      formData.append("taggedUsers", user._id);
    });

    images.forEach((img) => {
      formData.append("images", img);
    });

    videos.forEach((video) => {
      formData.append("videos", video);
    });

    const imageIndexByKey = new Map(imageKeys.map((key, idx) => [key, idx]));
    const videoIndexByKey = new Map(videoKeys.map((key, idx) => [key, idx]));

    mediaSequence.forEach((item) => {
      if (item.type === "image" && imageIndexByKey.has(item.key)) {
        formData.append(
          "mediaOrder",
          JSON.stringify({
            type: "image",
            index: imageIndexByKey.get(item.key),
          }),
        );
      }

      if (item.type === "video" && videoIndexByKey.has(item.key)) {
        formData.append(
          "mediaOrder",
          JSON.stringify({
            type: "video",
            index: videoIndexByKey.get(item.key),
          }),
        );
      }
    });

    try {
      const response = await postAPI.createPost(formData);
      if (response.success === true) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
        return;
      }

      if (onPostCreated) {
        onPostCreated(response.post);
      }

      setContent("");
      setImages([]);
      setImagesPreview([]);
      setImageKeys([]);
      setVideos([]);
      setVideosPreview([]);
      setVideoKeys([]);
      setMediaSequence([]);
      setTaggedUsers([]);
      setSearchQuery("");
      setDebouncedQuery("");
      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newKeys = files.map(() => createTempMediaKey());
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...files]);
    setImagesPreview((prev) => [...prev, ...newPreviews]);
    setImageKeys((prev) => [...prev, ...newKeys]);
    setMediaSequence((prev) => [
      ...prev,
      ...newKeys.map((key) => ({ type: "image", key })),
    ]);
  };

  const handleRemoveImage = (indexToRemove) => {
    const removedKey = imageKeys[indexToRemove];
    const removedPreview = imagesPreview[indexToRemove];
    if (removedPreview) {
      URL.revokeObjectURL(removedPreview);
    }

    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagesPreview((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setImageKeys((prev) => prev.filter((_, index) => index !== indexToRemove));
    setMediaSequence((prev) =>
      prev.filter((item) => !(item.type === "image" && item.key === removedKey)),
    );
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    const limitedFiles = files.slice(0, 3 - videos.length);

    if (limitedFiles.length === 0) return;

    if (limitedFiles.length < files.length) {
      toast.error("You can upload up to 3 videos per post.");
    }

    const newKeys = limitedFiles.map(() => createTempMediaKey());
    const newPreviews = limitedFiles.map((file) => URL.createObjectURL(file));

    setVideos((prev) => [...prev, ...limitedFiles]);
    setVideosPreview((prev) => [...prev, ...newPreviews]);
    setVideoKeys((prev) => [...prev, ...newKeys]);
    setMediaSequence((prev) => [
      ...prev,
      ...newKeys.map((key) => ({ type: "video", key })),
    ]);
  };

  const handleRemoveVideo = (indexToRemove) => {
    const removedKey = videoKeys[indexToRemove];
    const removedPreview = videosPreview[indexToRemove];
    if (removedPreview) {
      URL.revokeObjectURL(removedPreview);
    }

    setVideos((prev) => prev.filter((_, index) => index !== indexToRemove));
    setVideosPreview((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setVideoKeys((prev) => prev.filter((_, index) => index !== indexToRemove));
    setMediaSequence((prev) =>
      prev.filter((item) => !(item.type === "video" && item.key === removedKey)),
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
          Create Post
        </h2>

        <div className="flex gap-3 items-center mb-4">
          <img
            src={getBackendImgURL(
              postedByType === "Group" ? user.avatar : postedBy.avatar
            )}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">
              {postedByType === "Group" ? user.fullName : postedBy.name}
            </p>
            <select className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
              <option>Friends</option>
              <option>Public</option>
              <option>Only me</option>
            </select>
          </div>
        </div>

        <textarea
          className="w-full h-40 resize-none p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {/* ✅ Hiển thị danh sách user đã tag */}
        {taggedUsers.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {taggedUsers.map((taggedUser) => (
              <div
                key={taggedUser._id}
                className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full"
              >
                <img
                  src={getBackendImgURL(taggedUser.avatar)}
                  className="w-5 h-5 rounded-full object-cover"
                  alt={taggedUser.fullName}
                />
                <span className="text-sm font-medium">
                  {taggedUser.fullName}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(taggedUser._id)}
                  className="text-xs hover:text-red-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

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

        {videosPreview.length > 0 && (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {videosPreview.map((preview, index) => (
              <div key={index} className="relative group">
                <video
                  src={preview}
                  className="w-full h-44 object-cover rounded"
                  controls
                  preload="metadata"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveVideo(index)}
                  className="absolute top-2 right-2 bg-black/50 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-4 relative">
            <label
              htmlFor="uploadImage"
              className="flex items-center gap-2 text-purple-600 cursor-pointer hover:text-purple-800"
            >
              <img src="/photos.png" className="w-6 h-6" alt="upload" />
              <span className="dark:text-white">Photo</span>
            </label>

            <label
              htmlFor="uploadVideo"
              className="flex items-center gap-2 text-purple-600 cursor-pointer hover:text-purple-800"
            >
              <Video className="text-red-500" />
              <span className="dark:text-white">Video</span>
            </label>

            {/* ✅ Button tag user */}
            <button
              type="button"
              onClick={() => setShowTagModal(true)}
              className="flex items-center gap-2 text-purple-600 cursor-pointer hover:text-purple-800"
            >
              <Tag className="text-blue-600" />
              <span className="dark:text-white">Tag</span>
            </button>
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="flex items-center gap-2 text-purple-600 cursor-pointer hover:text-purple-800"
            >
              <Smile className="text-yellow-500" />
              <span className="dark:text-white">Emoji</span>
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-50">
                <EmojiPicker theme={theme} onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>

          <input
            id="uploadImage"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
          <input
            id="uploadVideo"
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={handleVideoChange}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      {/* ✅ Tag User Modal */}
      {showTagModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setShowTagModal(false);
              setSearchQuery("");
              setDebouncedQuery("");
            }}
          ></div>

          <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-4 shadow-xl z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Tag People</h3>
              <button
                type="button"
                onClick={() => {
                  setShowTagModal(false);
                  setSearchQuery("");
                  setDebouncedQuery("");
                }}
                className="text-2xl hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* ✅ Search Input */}
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none mb-3"
            />

            {/* ✅ Search Results */}
            <div className="max-h-80 overflow-y-auto">
              {loadingUsers ? (
                <div className="p-3 text-sm text-gray-500 text-center">
                  Searching...
                </div>
              ) : listUser && listUser.length > 0 ? (
                listUser.map((suggestedUser) => {
                  const isTagged = taggedUsers.find(
                    (u) => u._id === suggestedUser._id
                  );
                  return (
                    <div
                      key={suggestedUser._id}
                      onClick={() =>
                        !isTagged && handleSelectUser(suggestedUser)
                      }
                      className={`flex items-center gap-3 p-3 rounded-lg transition ${
                        isTagged
                          ? "bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      }`}
                    >
                      <img
                        src={getBackendImgURL(suggestedUser.avatar)}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={suggestedUser.fullName}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {suggestedUser.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{suggestedUser.slug}
                        </p>
                      </div>
                      {isTagged && (
                        <span className="text-green-600 text-xl">✓</span>
                      )}
                    </div>
                  );
                })
              ) : searchQuery ? (
                <div className="p-3 text-sm text-gray-500 text-center">
                  No users found
                </div>
              ) : (
                <div className="p-3 text-sm text-gray-500 text-center">
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostModal;
