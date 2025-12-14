import { useState, useRef } from "react";
import {
  Upload,
  X,
  Video,
  Image as ImageIcon,
  Music,
  ChevronLeft,
  Lock,
  Users,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { shortAPI } from "../services/api";
import toast from "react-hot-toast";

export default function CreateShortPage() {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [musicName, setMusicName] = useState("");
  const [musicArtist, setMusicArtist] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Video file size must be less than 100MB");
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      toast.success("Video selected");
    }
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      toast.success("Thumbnail selected");
    }
  };

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeThumbnail = () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  const parseHashtags = (hashtagString) => {
    if (!hashtagString || hashtagString.trim() === "") return [];

    return hashtagString
      .split(/[\s,]+/)
      .filter((tag) => tag.startsWith("#"))
      .map((tag) => tag.substring(1).toLowerCase().trim())
      .filter((tag) => tag.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }

    if (!thumbnailFile) {
      toast.error("Please select a thumbnail image");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);
    formData.append("caption", caption.trim());
    formData.append("privacy", privacy);

    // Parse and send hashtags as JSON string
    const parsedHashtags = parseHashtags(hashtags);
    if (parsedHashtags.length > 0) {
      formData.append("hashtags", JSON.stringify(parsedHashtags));
    }

    // Send music as JSON string
    if (musicName?.trim() || musicArtist?.trim()) {
      const musicData = {
        name: musicName.trim() || "",
        artist: musicArtist.trim() || "",
      };
      formData.append("music", JSON.stringify(musicData));
    }

    try {
      const response = await shortAPI.createShort(formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        },
      });

      if (response.success) {
        toast.success("Short uploaded successfully!");
        navigate("/shorts/me");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const privacyOptions = [
    {
      value: "public",
      label: "Public",
      icon: Globe,
      description: "Everyone can see",
    },
    {
      value: "friends",
      label: "Friends",
      icon: Users,
      description: "Only friends",
    },
    { value: "private", label: "Private", icon: Lock, description: "Only you" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/shorts")}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Short
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Video *
            </label>

            {!videoPreview ? (
              <div
                onClick={() => videoInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition"
              >
                <Video className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                  Click to upload video
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  MP4, MOV, AVI, MKV, WEBM (Max 100MB)
                </p>
              </div>
            ) : (
              <div className="relative">
                <video
                  src={videoPreview}
                  controls
                  className="w-full rounded-lg bg-black max-h-96"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            )}

            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/mov,video/avi,video/mkv,video/webm"
              onChange={handleVideoSelect}
              className="hidden"
            />
          </div>

          {/* Thumbnail Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Thumbnail *
            </label>

            {!thumbnailPreview ? (
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition"
              >
                <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Upload thumbnail image
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG, WEBP (Recommended: 9:16 ratio)
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail"
                  className="w-full rounded-lg max-h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            )}

            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleThumbnailSelect}
              className="hidden"
            />
          </div>

          {/* Caption */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={4}
              maxLength={2200}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
              {caption.length}/2200
            </p>
          </div>

          {/* Hashtags */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Hashtags
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#trending #viral #fyp"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Separate hashtags with spaces or commas
            </p>
          </div>

          {/* Music */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
              <Music className="w-4 h-4" />
              Music (Optional)
            </label>
            <div className="space-y-3">
              <input
                type="text"
                value={musicName}
                onChange={(e) => setMusicName(e.target.value)}
                placeholder="Song name"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={musicArtist}
                onChange={(e) => setMusicArtist(e.target.value)}
                placeholder="Artist name"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Privacy
            </label>
            <div className="grid grid-cols-3 gap-3">
              {privacyOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPrivacy(option.value)}
                    className={`p-4 rounded-lg border-2 transition ${
                      privacy === option.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mx-auto mb-2 ${
                        privacy === option.value
                          ? "text-blue-500"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-sm font-medium ${
                        privacy === option.value
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Uploading...
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/shorts")}
              disabled={uploading}
              className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!videoFile || !thumbnailFile || uploading}
              className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Post Short
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
