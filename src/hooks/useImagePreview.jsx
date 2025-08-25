import { ChevronRight, X, ChevronLeft } from "lucide-react";
import Config from "../envVars";
import { useState } from "react";

export const useImagePreview = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  const openImagePreview = (imageList, index) => {
    setImages(imageList);
    setCurrentIndex(index);
  };

  const closeImagePreview = () => {
    setImages([]);
    setCurrentIndex(null);
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
  images.length > 0 && currentIndex !== null && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-51">
      {/* Chevron trái */}
      {images.length > 1 && (
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-400 hover:bg-gray-200 size-10 p-2 cursor-pointer z-50"
          onClick={showPrevImage}
        >
          <ChevronLeft />
        </div>
      )}

      {/* Ảnh */}
      <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        <img
          src={`${Config.BACKEND_URL}${images[currentIndex]}`}
          alt="Preview"
          className="max-w-[50rem] max-h-[40rem] object-contain rounded-md shadow-lg"
        />
      </div>

      {/* Chevron phải */}
      {images.length > 1 && (
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-400 hover:bg-gray-200 size-10 p-2 cursor-pointer z-50"
          onClick={showNextImage}
        >
          <ChevronRight />
        </div>
      )}

      {/* Nút đóng */}
      <button
        className="absolute top-4 right-4 text-2xl hover:scale-130 transform transition-all bg-transparent text-white rounded-full cursor-pointer flex items-center justify-center z-50"
        onClick={closeImagePreview}
      >
        <X />
      </button>
    </div>
  );

  return { openImagePreview, ImagePreviewModal };
};
