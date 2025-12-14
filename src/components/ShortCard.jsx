import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Volume2,
  VolumeX,
  Music,
  Eye,
} from "lucide-react";
import { shortAPI } from "../services/api";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import { getBackendImgURL, getBackendVideoURL } from "../utils/helper";
import { formatNumber } from "../utils/formattedFunction";

export default function ShortCard({
  short,
  onComment,
  videoRef,
  autoPlay = false,
}) {
  const { user } = useAuthStore();
  const internalVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (short) {
      setIsLiked(short.likes?.includes(user?._id));
      setLikesCount(short.likes?.length || 0);
    }
  }, [short, user]);

  // Expose internal ref to parent via callback
  useEffect(() => {
    if (videoRef && typeof videoRef === 'function') {
      videoRef(internalVideoRef.current);
    }
  }, [videoRef]);

  // Auto play if autoPlay prop is true
  useEffect(() => {
    if (autoPlay && internalVideoRef.current) {
      internalVideoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else if (!autoPlay && internalVideoRef.current) {
      internalVideoRef.current.pause();
      setIsPlaying(false);
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (internalVideoRef.current) {
      if (isPlaying) {
        internalVideoRef.current.pause();
      } else {
        internalVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (internalVideoRef.current) {
      internalVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = async () => {
    if (!short?._id) return;
    try {
      await shortAPI.toggleLikeShort(short._id);
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Failed to like short:", error);
      toast.error("Failed to like short");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: short?.caption || "Check out this short",
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="relative h-[92vh] w-full aspect-[9/16]">
      {/* Video Player */}
      <video
        ref={internalVideoRef}
        src={getBackendVideoURL(short.videoUrl)}
        className="w-full h-full object-contain"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
        poster={getBackendImgURL(short.thumbnailUrl)}
      />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 dark:bg-black/50 cursor-pointer"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-full p-4 animate-pulse">
            <Play className="w-12 h-12 text-gray-900 dark:text-white fill-gray-900 dark:fill-white" />
          </div>
        </div>
      )}

      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900/60 dark:from-black/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-900/80 dark:from-black/80 to-transparent pointer-events-none" />

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 z-10">
        <div className="flex items-end justify-between">
          {/* Left: Author Info & Caption */}
          <div className="flex-1 pr-16">
            <div className="flex items-center gap-3 mb-2">
              <Link to={`/profile/${short.user.slug}`}>
                <img
                  src={
                    getBackendImgURL(short.user?.avatar) ||
                    "/default-avatar.png"
                  }
                  alt={short.user?.fullName}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-300"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </Link>
              <div>
                <Link
                  to={`/profile/${short.user.slug}`}
                  className="text-white dark:text-gray-100 font-semibold text-sm hover:underline"
                >
                  {short.user?.fullName}
                </Link>
                <p className="text-white/70 dark:text-gray-300 text-xs">
                  @{short.user?.slug}
                </p>
              </div>
            </div>

            {short.caption && (
              <p className="text-white dark:text-gray-100 text-sm mb-1 line-clamp-2">
                {short.caption}
              </p>
            )}

            {short.hashtags && short.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {short.hashtags.map((tag, index) => (
                  <span key={index} className="text-blue-400 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {short.music && (
              <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                <Music className="w-3 h-3" />
                <span>
                  {short.music.name}
                  {short.music.artist && ` - ${short.music.artist}`}
                </span>
              </div>
            )}

            <p className="text-white/60 dark:text-gray-300 text-xs">
              {formatNumber(short.views || 0)} views
            </p>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-col items-center gap-4">
            {/* Like */}
            <button onClick={handleLike} className="flex flex-col items-center group">
              <div
                className={`p-3 rounded-full ${
                  isLiked
                    ? "bg-red-500"
                    : "bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm"
                } transition-all group-hover:scale-110`}
              >
                <Heart
                  className={`w-6 h-6 ${
                    isLiked
                      ? "text-white fill-white"
                      : "text-white dark:text-gray-100"
                  }`}
                />
              </div>
              <span className="text-white dark:text-gray-100 text-xs mt-1">
                {formatNumber(likesCount)}
              </span>
            </button>

            {/* Comments */}
            <button
              onClick={onComment}
              className="flex flex-col items-center group"
            >
              <div className="p-3 rounded-full bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm group-hover:scale-110 transition">
                <MessageCircle className="w-6 h-6 text-white dark:text-gray-100" />
              </div>
              <span className="text-white dark:text-gray-100 text-xs mt-1">
                {formatNumber(short.commentsCount || 0)}
              </span>
            </button>

            {/* Share */}
            <button onClick={handleShare} className="flex flex-col items-center group">
              <div className="p-3 rounded-full bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm group-hover:scale-110 transition">
                <Share2 className="w-6 h-6 text-white dark:text-gray-100" />
              </div>
            </button>

            {/* Views */}
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm">
                <Eye className="w-6 h-6 text-white dark:text-gray-100" />
              </div>
              <span className="text-white dark:text-gray-100 text-xs mt-1">
                {formatNumber(short.views || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Volume Control */}
      <button
        onClick={toggleMute}
        className="absolute cursor-pointer right-6 top-6 p-2 rounded-full bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm z-10 hover:bg-white/30 dark:hover:bg-gray-700/50 transition"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white dark:text-gray-100" />
        ) : (
          <Volume2 className="w-5 h-5 text-white dark:text-gray-100" />
        )}
      </button>
    </div>
  );
}