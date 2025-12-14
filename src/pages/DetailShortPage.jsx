import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MoreVertical, Trash2, ChevronLeft } from "lucide-react";
import { shortAPI } from "../services/api";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import SpinnerLoading from "../components/SpinnerLoading";
import ShortCard from "../components/ShortCard";
import CommentsSidebar from "../components/CommentsSidebar";

export default function DetailShortPage() {
  const { shortId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [short, setShort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchShortDetail();
    incrementViews();
  }, [shortId]);

  const fetchShortDetail = async () => {
    try {
      setLoading(true);
      const response = await shortAPI.getShortById(shortId);
      if (response && response.success) {
        setShort(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch short:", error);
      toast.error("Failed to load short");
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await shortAPI.incrementViews(shortId);
    } catch (error) {
      console.error("Failed to increment views:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this short?")) return;

    try {
      await shortAPI.deleteShort(shortId);
      toast.success("Short deleted successfully");
      navigate("/shorts/me");
    } catch (error) {
      console.error("Failed to delete short:", error);
      toast.error("Failed to delete short");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[92vh] bg-gray-50 dark:bg-gray-900">
        <SpinnerLoading />
      </div>
    );
  }

  if (!short) {
    return (
      <div className="h-[92vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl text-gray-900 dark:text-gray-100 font-bold mb-4">
          Short not found
        </h2>
        <button
          onClick={() => navigate("/shorts")}
          className="px-6 py-3 cursor-pointer bg-blue-500 rounded-lg hover:bg-blue-600 transition text-white"
        >
          Back to Shorts
        </button>
      </div>
    );
  }

  return (
    <div className="h-[92vh] relative overflow-hidden">
      {/* Menu Button (Owner Only) */}
      {user?._id === short.user?._id && (
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/50 transition"
          >
            <MoreVertical className="w-6 h-6 text-white dark:text-gray-100" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
              <button
                onClick={handleDelete}
                className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-gray-700 w-full transition"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute cursor-pointer top-6 left-6 z-20 p-2 rounded-full bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/50 transition"
      >
        <ChevronLeft className="w-6 h-6 text-white dark:text-gray-100" />
      </button>

      {/* Video Container */}
      <div className="h-full max-w-4xl mx-auto flex items-center justify-center">
        <ShortCard
          short={short}
          onComment={() => setShowComments(true)}
        />
      </div>

      {/* Comments Sidebar */}
      {showComments && (
        <CommentsSidebar
          shortId={shortId}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
}