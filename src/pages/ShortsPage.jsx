import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { shortAPI } from "../services/api";
import ShortCard from "../components/ShortCard";
import CommentsSidebar from "../components/CommentsSidebar";
import SpinnerLoading from "../components/SpinnerLoading";

export default function ShortsPage() {
  const navigate = useNavigate();
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Memoize current short to avoid unnecessary re-renders
  const currentShort = useMemo(() => shorts[currentIndex], [shorts, currentIndex]);

  // Memoize navigation button states
  const canNavigateUp = useMemo(() => currentIndex > 0, [currentIndex]);
  const canNavigateDown = useMemo(() => currentIndex < shorts.length - 1, [currentIndex, shorts.length]);

  // Fetch shorts feed
  useEffect(() => {
    fetchShorts();
  }, []);

  const fetchShorts = async () => {
    try {
      setLoading(true);
      const response = await shortAPI.getShortsFeed();
      if (response && response.success) {
        setShorts(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch shorts:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Play/Pause video when index changes
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      if (playing) {
        currentVideo.play().catch(() => {});
      } else {
        currentVideo.pause();
      }
    }

    // Pause other videos
    videoRefs.current.forEach((video, idx) => {
      if (video && idx !== currentIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, playing]);


  // ✅ Navigate to next/previous video (vertical)
  const navigateVideo = useCallback(
    (direction) => {
      if (isScrollingRef.current) return;

      let newIndex = currentIndex;

      if (direction === "up" && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else if (direction === "down" && currentIndex < shorts.length - 1) {
        newIndex = currentIndex + 1;
      }

      if (newIndex !== currentIndex) {
        isScrollingRef.current = true;
        setCurrentIndex(newIndex);
        setPlaying(true);

        // Scroll to video vertically
        if (containerRef.current) {
          const videoHeight = containerRef.current.clientHeight;
          containerRef.current.scrollTo({
            top: videoHeight * newIndex,
            behavior: "smooth",
          });
        }

        // Reset scrolling flag after animation
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 500);
      }
    },
    [currentIndex, shorts.length]
  );

  // ✅ Keyboard navigation (Arrow Up/Down)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateVideo("up");
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateVideo("down");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigateVideo]);

  // ✅ Detect manual scroll (swipe or wheel) - Vertical
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout;
    const handleScroll = () => {
      if (isScrollingRef.current) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const videoHeight = container.clientHeight;
        const index = Math.round(scrollTop / videoHeight);

        if (index !== currentIndex && index >= 0 && index < shorts.length) {
          setCurrentIndex(index);
          setPlaying(true);
        }
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentIndex, shorts.length]);

  // ✅ Touch/Swipe support - Vertical
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;

    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        navigateVideo("down");
      } else {
        navigateVideo("up");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[92vh] bg-gray-50 dark:bg-gray-900">
        <SpinnerLoading />
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="h-[92vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl text-gray-900 dark:text-gray-100 font-bold mb-4">
          No shorts available
        </h2>
        <button
          onClick={() => navigate("/shorts/create")}
          className="px-6 py-3 cursor-pointer bg-blue-500 rounded-lg hover:bg-blue-600 transition text-white"
        >
          Create First Short
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-[92vh] overflow-hidden">
      {/* Create Short Button */}
      <button
        onClick={() => navigate("/shorts/create")}
        className="absolute top-6 right-6 z-20 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all hover:scale-110"
        title="Create Short"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Video Container - Vertical Scroll */}
      <div
        ref={containerRef}
        className="h-full max-w-4xl mx-auto snap-y snap-mandatory overflow-y-scroll custom-scroll"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {shorts.map((short, index) => (
          <div
            key={short._id}
            className="relative h-[92vh] w-full snap-start snap-always"
          >
            <ShortCard
              short={short}
              onComment={() => setShowComments(true)}
              videoRef={(el) => (videoRefs.current[index] = el)}
              autoPlay={index === currentIndex}
            />
          </div>
        ))}
      </div>

      {/* Control Buttons - Top/Bottom */}
      <div className="absolute top-1/2 right-6 z-10 flex flex-col gap-2">
        <button
          onClick={() => navigateVideo("up")}
          disabled={!canNavigateUp}
          className="p-2 rounded-full cursor-pointer bg-black dark:bg-gray-800/50 backdrop-blur-sm disabled:opacity-30 hover:bg-black/60 dark:hover:bg-gray-700/50 transition disabled:cursor-not-allowed"
        >
          <ChevronUp className="w-6 h-6 text-white dark:text-gray-100" />
        </button>
        <button
          onClick={() => navigateVideo("down")}
          disabled={!canNavigateDown}
          className="p-2 rounded-full cursor-pointer bg-black  dark:bg-gray-800/50 backdrop-blur-sm disabled:opacity-30 hover:bg-black/60 dark:hover:bg-gray-700/50 transition disabled:cursor-not-allowed"
        >
          <ChevronDown className="w-6 h-6 text-white dark:text-gray-100" />
        </button>
      </div>

      {/* Progress Indicator - Vertical */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-20">
        {shorts.map((_, idx) => (
          <div
            key={idx}
            className={`w-1 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "h-8 bg-gray-500 dark:bg-gray-100"
                : "h-1 bg-gray-400 dark:bg-gray-500"
            }`}
          />
        ))}
      </div>

      {/* Comments Sidebar */}
      {showComments && currentShort && (
        <CommentsSidebar
          shortId={currentShort._id}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
}