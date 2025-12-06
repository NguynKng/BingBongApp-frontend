import { useState, useMemo } from "react";
import { useGetOwnerPosts } from "../../hooks/usePosts";
import { getBackendImgURL } from "../../utils/helper";
import {
  Image,
  Video,
  Grid3x3,
} from "lucide-react";
import SpinnerLoading from "../SpinnerLoading";
import { useImagePreview } from "../../hooks/useImagePreview";

export default function MediaTab({ group }) {
  const { posts, loading } = useGetOwnerPosts("Group", group._id);
  const [filterType, setFilterType] = useState("all"); // all, image, video
  const { openImagePreview, ImagePreviewModal } = useImagePreview();

  // Extract all media from posts with metadata
  const allMedia = useMemo(() => {
    const mediaList = [];

    posts.forEach((post) => {
      if (post.media && post.media.length > 0) {
        post.media.forEach((mediaUrl, idx) => {
          // Detect if it's a video based on file extension
          const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);

          mediaList.push({
            url: mediaUrl,
            type: isVideo ? "video" : "image",
            postId: post._id,
            postedBy: post.postedBy,
            createdAt: post.createdAt,
            caption: post.content,
            index: idx,
          });
        });
      }
    });

    return mediaList;
  }, [posts]);

  // Filter media based on type
  const filteredMedia = useMemo(() => {
    if (filterType === "all") return allMedia;
    return allMedia.filter((media) => media.type === filterType);
  }, [allMedia, filterType]);

  // Prepare images for preview modal
  const handleMediaClick = (media, idx) => {
  // Chỉ lấy images
  const images = filteredMedia
    .filter(m => m.type === "image")
    .map(m => m.url);
  
  // Tìm index của ảnh trong mảng images
  const imageIndex = filteredMedia
    .slice(0, idx)
    .filter(m => m.type === "image")
    .length;

  // Truyền postId của media hiện tại
  openImagePreview(images, imageIndex, media.postId);
};

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center">
        <SpinnerLoading />
    </div>
  }

  return (
    <>
      <ImagePreviewModal />
      <div className="space-y-4">
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard
            icon={<Grid3x3 className="size-5" />}
            label="Total Media"
            value={allMedia.length}
            color="blue"
          />
          <StatCard
            icon={<Image className="size-5" />}
            label="Images"
            value={allMedia.filter((m) => m.type === "image").length}
            color="green"
          />
          <StatCard
            icon={<Video className="size-5" />}
            label="Videos"
            value={allMedia.filter((m) => m.type === "video").length}
            color="purple"
          />
        </div>

        {/* Filter Bar */}
        <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-4 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-colors ${
                  filterType === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                All Media
              </button>
              <button
                onClick={() => setFilterType("image")}
                className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  filterType === "image"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Image className="size-4" /> Images
              </button>
              <button
                onClick={() => setFilterType("video")}
                className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  filterType === "video"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Video className="size-4" /> Videos
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <b>{filteredMedia.length}</b> items
            </p>
          </div>
        </div>

        {/* Media Grid */}
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredMedia.map((media, idx) => (
              <MediaCard
                key={`${media.postId}-${media.index}`}
                media={media}
                onClick={() => handleMediaClick(media, idx)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-12 border border-gray-200 dark:border-[#2b2b3d] shadow-sm text-center">
            <div className="flex flex-col items-center gap-3">
              {filterType === "image" ? (
                <Image className="size-12 text-gray-400" />
              ) : filterType === "video" ? (
                <Video className="size-12 text-gray-400" />
              ) : (
                <Grid3x3 className="size-12 text-gray-400" />
              )}
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No {filterType === "all" ? "media" : filterType + "s"} found
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* Stat Card Component */
function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-4 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
      <div className={`inline-flex p-2 rounded-lg mb-2 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold dark:text-gray-200">{value}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}

/* Media Card Component */
function MediaCard({ media, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 aspect-square"
    >
      {media.type === "image" ? (
        <img
          src={getBackendImgURL(media.url)}
          alt="Media"
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
      ) : (
        <video
          src={getBackendImgURL(media.url)}
          className="w-full h-full object-cover"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {media.type === "video" ? (
            <Video className="size-8 text-white" />
          ) : (
            <Image className="size-8 text-white" />
          )}
        </div>
      </div>

      {/* Media Type Badge */}
      {media.type === "video" && (
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
          <Video className="size-3" /> Video
        </div>
      )}
    </div>
  );
}