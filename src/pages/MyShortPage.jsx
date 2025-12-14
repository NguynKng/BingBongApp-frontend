import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  Plus,
  Search,
  ChevronLeft,
} from "lucide-react";
import { shortAPI } from "../services/api";
import toast from "react-hot-toast";
import { getBackendImgURL } from "../utils/helper";

export default function MyShortPage() {
  const navigate = useNavigate();
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedShort, setSelectedShort] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMyShorts();
  }, [filter, page]);

  const fetchMyShorts = async () => {
    try {
      setLoading(true);
      const response = await shortAPI.getMyShorts({ 
        page, 
        limit: 20,
        privacy: filter !== "all" ? filter : undefined 
      });
      
      if (response && response.success) {
        if (page === 1) {
          setShorts(response.data);
        } else {
          setShorts(prev => [...prev, ...response.data]);
        }
        setHasMore(response.pagination?.page < response.pagination?.pages);
      }
    } catch (error) {
      console.error("Failed to fetch shorts:", error);
      toast.error("Failed to load shorts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shortId) => {
    try {
      setDeleting(true);
      await shortAPI.deleteShort(shortId);
      setShorts(shorts.filter((s) => s._id !== shortId));
      setShowDeleteModal(false);
      setSelectedShort(null);
      toast.success("Short deleted successfully");
    } catch (error) {
      console.error("Failed to delete short:", error);
      toast.error(error.response?.data?.message || "Failed to delete short");
    } finally {
      setDeleting(false);
    }
  };

  const filteredShorts = shorts.filter(
    (short) =>
      short.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      short.hashtags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const getPrivacyBadge = (privacy) => {
    const badges = {
      public:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      friends:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      private: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    return badges[privacy] || badges.public;
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    setShorts([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/shorts")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  My Shorts
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredShorts.length}{" "}
                  {filteredShorts.length === 1 ? "short" : "shorts"}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/shorts/create")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <Plus className="w-5 h-5" />
              Create Short
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by caption or hashtags..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {["all", "public", "friends", "private"].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => handleFilterChange(filterOption)}
                  className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    filter === filterOption
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading && page === 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[9/16] bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredShorts.length === 0 ? (
          <div className="text-center py-20">
            <Video className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No shorts found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery
                ? "Try different search terms"
                : "Start creating your first short!"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/shorts/create")}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Create Short
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredShorts.map((short) => (
                <div
                  key={short._id}
                  className="group relative aspect-[9/16] rounded-lg overflow-hidden bg-gray-900 cursor-pointer"
                  onClick={() => navigate(`/shorts/${short._id}`)}
                >
                  {/* Thumbnail */}
                  <img
                    src={getBackendImgURL(short.thumbnailUrl)}
                    alt={short.caption || "Short"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/none-image.jfif";
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Top Info */}
                    <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getPrivacyBadge(
                          short.privacy
                        )}`}
                      >
                        {short.privacy}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedShort(short);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      {short.caption && (
                        <p className="text-white text-sm font-medium line-clamp-2 mb-2">
                          {short.caption}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-white text-xs">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{short.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{short.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{short.commentsCount || 0}</span>
                        </div>
                      </div>

                      {short.hashtags && short.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {short.hashtags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="text-blue-400 text-xs">
                              #{tag}
                            </span>
                          ))}
                          {short.hashtags.length > 2 && (
                            <span className="text-gray-400 text-xs">
                              +{short.hashtags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video Icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedShort && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Delete Short?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this short? This action cannot be
              undone.
            </p>

            {selectedShort.caption && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  "{selectedShort.caption}"
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedShort(null);
                }}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedShort._id)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}