import { memo, useMemo, useCallback } from "react";
import { useGetOwnerPosts } from "../../hooks/usePosts";
import { Image, ImageOff } from "lucide-react";
import propTypes from "prop-types";
import { getBackendImgURL } from "../../utils/helper";
import SpinnerLoading from "../SpinnerLoading";
import { useImagePreview } from "../../hooks/useImagePreview";

const PhotoTab = memo(({ displayedUser }) => {
  const { posts, loading } = useGetOwnerPosts("User", displayedUser._id);
  const { openImagePreview, ImagePreviewModal } = useImagePreview();

  // ✅ Extract all images from posts
  const allImages = useMemo(() => {
    if (!posts) return [];
    
    return posts.reduce((acc, post) => {
      if (post.media && post.media.length > 0) {
        const postImages = post.media.map((img) => ({
          url: img,
          postId: post._id,
          caption: post.content || "",
          createdAt: post.createdAt,
        }));
        return [...acc, ...postImages];
      }
      return acc;
    }, []);
  }, [posts]);

  // ✅ Group images by post for preview
  const imagesByPost = useMemo(() => {
    if (!posts) return {};
    
    return posts.reduce((acc, post) => {
      if (post.media && post.media.length > 0) {
        acc[post._id] = post.media;
      }
      return acc;
    }, {});
  }, [posts]);

  // ✅ useCallback for image click
  const handleImageClick = useCallback(
    (image, globalIndex) => {
      // Find which post this image belongs to
      const postId = image.postId;
      const mediaList = imagesByPost[postId] || [];
      
      // Find index within that post's media
      const localIndex = mediaList.findIndex((url) => url === image.url);
      
      // Open preview with post's media list
      openImagePreview(mediaList, localIndex, postId);
    },
    [imagesByPost, openImagePreview]
  );

  return (
    <>
      <div className="bg-white dark:bg-[#1b1f2b] rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Image className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Photos
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {allImages.length} {allImages.length === 1 ? "photo" : "photos"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <LoadingState />
          ) : allImages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {allImages.map((image, index) => (
                <PhotoCard
                  key={`${image.postId}-${index}`}
                  image={image}
                  index={index}
                  onClick={handleImageClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal />
    </>
  );
});

PhotoTab.displayName = "PhotoTab";

PhotoTab.propTypes = {
  displayedUser: propTypes.shape({
    _id: propTypes.string.isRequired,
  }).isRequired,
};

// ✅ PhotoCard Component
const PhotoCard = memo(({ image, index, onClick }) => (
  <div
    onClick={() => onClick(image, index)}
    className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
  >
    <img
      src={getBackendImgURL(image.url)}
      alt={`Photo ${index + 1}`}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      loading="lazy"
    />
    
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
      <Image className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  </div>
));

PhotoCard.displayName = "PhotoCard";

PhotoCard.propTypes = {
  image: propTypes.shape({
    url: propTypes.string.isRequired,
    postId: propTypes.string.isRequired,
    caption: propTypes.string,
    createdAt: propTypes.string,
  }).isRequired,
  index: propTypes.number.isRequired,
  onClick: propTypes.func.isRequired,
};

// ✅ LoadingState Component
const LoadingState = memo(() => (
  <div className="flex flex-col items-center justify-center py-16">
    <SpinnerLoading />
    <p className="text-gray-500 dark:text-gray-400 mt-4">Loading photos...</p>
  </div>
));

LoadingState.displayName = "LoadingState";

// ✅ EmptyState Component
const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
      <ImageOff className="w-12 h-12 text-gray-400 dark:text-gray-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      No photos yet
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
      {`This user hasn't posted any photos yet. When they share photos, they'll appear here.`}
    </p>
  </div>
));

EmptyState.displayName = "EmptyState";

export default PhotoTab;