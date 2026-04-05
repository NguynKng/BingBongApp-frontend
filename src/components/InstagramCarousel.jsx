import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useImagePreview } from "../hooks/useImagePreview";
import { getBackendImgURL, getBackendVideoURL } from "../utils/helper";

const ImageCarousel = memo(({ media = [], videos = [], mediaOrder = [], postId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const { openImagePreview, ImagePreviewModal } = useImagePreview();

  useEffect(() => {
    if (!carouselRef.current) return undefined;

    const pauseAllVideos = () => {
      carouselRef.current
        ?.querySelectorAll("video")
        .forEach((videoEl) => videoEl.pause());
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          pauseAllVideos();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(carouselRef.current);

    return () => {
      pauseAllVideos();
      observer.disconnect();
    };
  }, []);

  const items = useMemo(
    () => {
      const imageItems = media.map((id, index) => ({ type: "image", id, index }));
      const videoItems = videos.map((id, index) => ({ type: "video", id, index }));

      if (!Array.isArray(mediaOrder) || mediaOrder.length === 0) {
        return [...imageItems, ...videoItems];
      }

      const orderedItems = [];
      const usedImageIndexes = new Set();
      const usedVideoIndexes = new Set();

      mediaOrder.forEach((orderItem) => {
        const orderType = orderItem?.type;
        const orderIndex = Number(orderItem?.index);

        if (orderType === "image" && Number.isInteger(orderIndex) && imageItems[orderIndex]) {
          orderedItems.push(imageItems[orderIndex]);
          usedImageIndexes.add(orderIndex);
        }

        if (orderType === "video" && Number.isInteger(orderIndex) && videoItems[orderIndex]) {
          orderedItems.push(videoItems[orderIndex]);
          usedVideoIndexes.add(orderIndex);
        }
      });

      imageItems.forEach((item) => {
        if (!usedImageIndexes.has(item.index)) {
          orderedItems.push(item);
        }
      });

      videoItems.forEach((item) => {
        if (!usedVideoIndexes.has(item.index)) {
          orderedItems.push(item);
        }
      });

      return orderedItems;
    },
    [media, mediaOrder, videos],
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
  };

  const handleOpenPreview = () => {
    const currentItem = items[currentIndex];
    if (!currentItem || currentItem.type !== "image") return;

    const imageIds = items
      .filter((item) => item.type === "image")
      .map((item) => item.id);

    const imageIndex = items
      .slice(0, currentIndex)
      .filter((item) => item.type === "image").length;

    openImagePreview(imageIds, imageIndex, postId);
  };

  if (items.length === 0) return null;

  return (
    <>
      <ImagePreviewModal />
      <div
        ref={carouselRef}
        className="relative w-full overflow-hidden mt-3 border-y-2 border-gray-200 dark:border-gray-500"
      >
        {/* Container chứa tất cả media */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {items.map((item, idx) => (
            <div key={idx} className="w-full flex-shrink-0">
              {item.type === "image" ? (
                <img
                  src={getBackendImgURL(item.id)}
                  alt={`post-img-${idx}`}
                  className="w-full h-[400px] object-contain cursor-pointer"
                  loading="lazy"
                  onClick={handleOpenPreview}
                />
              ) : (
                <video
                  src={getBackendVideoURL(item.id)}
                  controls
                  preload="metadata"
                  className="w-full h-[400px] object-contain bg-black"
                />
              )}
            </div>
          ))}
        </div>

        {/* Nút điều hướng */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute top-1/2 cursor-pointer left-3 dark:hover:bg-white/70 hover:bg-black/30 -translate-y-1/2 dark:bg-white/50 bg-black/20 text-gray-600 p-1 rounded-full"
          >
            <ChevronLeft />
          </button>
        )}
        {currentIndex < items.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-3 cursor-pointer -translate-y-1/2 dark:bg-white/50 bg-black/20 dark:hover:bg-white/70 hover:bg-black/30 text-gray-600 p-1 rounded-full"
          >
            <ChevronRight />
          </button>
        )}

        {/* Dấu chấm điều hướng */}
        {items.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, idx) => (
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
        {items.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/60 text-gray-300 text-sm px-3 py-1 rounded-full shadow-md">
            {currentIndex + 1}/{items.length}
          </div>
        )}
      </div>
    </>
  );
});
export default ImageCarousel;
