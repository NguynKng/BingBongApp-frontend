import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useImagePreview } from "../hooks/useImagePreview";
import { getBackendImgURL } from "../utils/helper";

export default function ImageCarousel({ media }) {
  const [currentIndex, setCurrentIndex] = useState(0); // Dùng state thay vì ref
  const { openImagePreview, ImagePreviewModal } = useImagePreview();

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, media.length - 1));
  };

  if (!media || media.length === 0) return null;

  return (
    <>
      <ImagePreviewModal />
      <div className="relative w-full overflow-hidden mt-3 border-y-2 border-gray-200 dark:border-gray-500">
        {/* Container chứa tất cả ảnh */}
        <div
          className="flex transition-transform cursor-pointer duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
          onClick={() => openImagePreview(media, currentIndex)}
        >
          {media.map((img, idx) => (
            <div key={idx} className="w-full flex-shrink-0">
              <img
                src={getBackendImgURL(img)}
                alt={`post-img-${idx}`}
                className="w-full h-[400px] object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Nút điều hướng */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute top-1/2 cursor-pointer left-3 hover:bg-white/70 -translate-y-1/2 bg-white/50 text-gray-600 p-1 rounded-full"
          >
            <ChevronLeft />
          </button>
        )}
        {currentIndex < media.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-3 cursor-pointer hover:bg-white/70 -translate-y-1/2 bg-white/50 text-gray-600 p-1 rounded-full"
          >
            <ChevronRight />
          </button>
        )}

        {/* Dấu chấm điều hướng */}
        {media.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {media.map((_, idx) => (
              <div
                key={idx}
                className={`h-[6px] w-[6px] rounded-full ${
                  idx === currentIndex ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
        {/* Hiển thị số thứ tự ảnh */}
        {media.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/60 text-gray-300 text-sm px-3 py-1 rounded-full shadow-md">
            {currentIndex + 1}/{media.length}
          </div>
        )}
      </div>
    </>
  );
}
