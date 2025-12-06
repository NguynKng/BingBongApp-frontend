import { ChevronRight, X, ChevronLeft, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getBackendImgURL } from "../utils/helper";

export const useImagePreview = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [postId, setPostId] = useState(null);

  const openImagePreview = (imageList, index, postId = null) => {
    setImages(imageList);
    setCurrentIndex(index);
    setPostId(postId);
  };

  const closeImagePreview = () => {
    setImages([]);
    setCurrentIndex(null);
    setPostId(null);
  };

  const showPrevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const showNextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const ImagePreviewModal = () =>
    images.length > 0 &&
    currentIndex !== null && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-[100]">
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm size-12 p-3 cursor-pointer z-50 transition-all"
              onClick={showPrevImage}
            >
              <ChevronLeft className="text-white" />
            </button>

            {/* Next Button */}
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm size-12 p-3 cursor-pointer z-50 transition-all"
              onClick={showNextImage}
            >
              <ChevronRight className="text-white" />
            </button>
          </>
        )}

        {/* Image Container */}
        <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
          <img
            src={getBackendImgURL(images[currentIndex])}
            alt="Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 flex items-center justify-between">
          {/* Image Counter */}
          <div className="text-white font-semibold text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
          <div className="flex gap-2 items-center">
            {postId && (
              <Link to={`/posts/${postId}`} onClick={closeImagePreview}>
                <button className="flex items-center text-sm gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg cursor-pointer">
                  <ExternalLink className="size-4" />
                  View Post
                </button>
              </Link>
            )}
            {/* Close Button */}
            <button
              className="text-white cursor-pointer hover:bg-white/20 bg-white/10 backdrop-blur-sm p-2 rounded-full transition-all"
              onClick={closeImagePreview}
            >
              <X className="size-6" />
            </button>
          </div>
        </div>
      </div>
    );

  return { openImagePreview, ImagePreviewModal };
};
