import { memo, useMemo, useState, useCallback, useRef, useEffect } from "react";
import {
  Music,
  Upload,
  Play,
  Pause,
  Trash2,
  Check,
  Search,
  X,
  Volume2,
  Music2,
  Edit2,
  Save,
} from "lucide-react";
import propTypes from "prop-types";
import { getBackendVideoURL } from "../../utils/helper";

import SpinnerLoading from "../SpinnerLoading";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import { userAPI } from "../../services/api";
import Swal from "sweetalert2";

const MusicTab = memo(({ displayedUser }) => {
  const { user } = useAuthStore();
  const [ringtones, setRingtones] = useState(displayedUser.ringtones || []);
  const [activeRingtone, setActiveRingtone] = useState(displayedUser.activeRingtone);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [uploadName, setUploadName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const pendingFileRef = useRef(null);

  // ✅ Sync with displayedUser when it changes
  useEffect(() => {
    setRingtones(displayedUser.ringtones || []);
    setActiveRingtone(displayedUser.activeRingtone);
  }, [displayedUser.ringtones, displayedUser.activeRingtone]);

  // ✅ Check if current user is viewing their own profile
  const isOwnProfile = useMemo(
    () => user?._id === displayedUser._id,
    [user, displayedUser]
  );

  // ✅ Filter ringtones by search
  const filteredRingtones = useMemo(() => {
    if (!searchQuery.trim()) return ringtones;

    const query = searchQuery.toLowerCase();
    return ringtones.filter((ringtone) =>
      ringtone.name.toLowerCase().includes(query)
    );
  }, [ringtones, searchQuery]);

  // ✅ Handle file select - Show name input
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Store file and show name input
    pendingFileRef.current = file;
    setUploadName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
    setShowNameInput(true);
  }, []);

  // ✅ Handle upload with custom name
  const handleUpload = useCallback(async () => {
    const file = pendingFileRef.current;
    if (!file || !uploadName.trim()) {
      toast.error("Please enter a name for the ringtone");
      return;
    }

    setIsUploading(true);

    try {
      // ✅ Use userAPI.addUserRingtone
      const response = await userAPI.addUserRingtone(file, uploadName.trim());

      toast.success(response.message || "Ringtone uploaded successfully!");

      // ✅ Update local state with new ringtone
      if (response.success && response.data) {
        setRingtones((prev) => [...prev, response.data]);
      }

      // Reset states
      setShowNameInput(false);
      setUploadName("");
      pendingFileRef.current = null;
    } catch (error) {
      // Error already handled in userAPI with toast
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [uploadName]);

  // ✅ Handle cancel upload
  const handleCancelUpload = useCallback(() => {
    setShowNameInput(false);
    setUploadName("");
    pendingFileRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // ✅ Handle play/pause
  const handlePlayPause = useCallback(
    (ringtoneId, url) => {
      if (playingId === ringtoneId) {
        audioRef.current?.pause();
        setPlayingId(null);
      } else {
        if (audioRef.current) {
          audioRef.current.src = getBackendVideoURL(url);
          audioRef.current.play();
          setPlayingId(ringtoneId);
        }
      }
    },
    [playingId]
  );

  // ✅ Handle audio end
  const handleAudioEnd = useCallback(() => {
    setPlayingId(null);
  }, []);

  // ✅ Handle rename ringtone
  const handleRename = useCallback(async (ringtoneId, newName) => {
    if (!newName.trim()) {
      toast.error("Ringtone name cannot be empty");
      return;
    }

    try {
      const response = await userAPI.renameUserRingtone(
        ringtoneId,
        newName.trim()
      );

      toast.success(response.message || "Ringtone renamed successfully!");

      setRingtones((prev) =>
        prev.map((ringtone) =>
          ringtone._id === ringtoneId
            ? { ...ringtone, name: newName.trim() }
            : ringtone
        )
      );
    } catch (error) {
      // Error already handled in userAPI with toast
      console.error("Rename error:", error);
    }
  }, []);

  // ✅ Handle set active ringtone
  const handleSetActive = useCallback(async (ringtoneId) => {
    try {
      // ✅ Use userAPI.setActiveRingtone
      const response = await userAPI.setActiveRingtone(ringtoneId);

      toast.success(response.message || "Ringtone set as active!");

      // ✅ Update local state
      setActiveRingtone(ringtoneId);
    } catch (error) {
      // Error already handled in userAPI with toast
      console.error("Set active error:", error);
    }
  }, []);

  // ✅ Handle delete ringtone
  const handleDelete = useCallback(
    async (ringtoneId) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this ringtone?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;

      try {
        // ✅ Use userAPI.deleteUserRingtone
        const response = await userAPI.deleteUserRingtone(ringtoneId);

        toast.success(response.message || "Ringtone deleted successfully!");

        // Stop playing if deleted ringtone is currently playing
        if (playingId === ringtoneId) {
          audioRef.current?.pause();
          setPlayingId(null);
        }

        // ✅ Update local state - remove deleted ringtone
        setRingtones((prev) =>
          prev.filter((ringtone) => ringtone._id !== ringtoneId)
        );

        // ✅ Clear active ringtone if it was deleted
        if (activeRingtone === ringtoneId) {
          setActiveRingtone(null);
        }
      } catch (error) {
        // Error already handled in userAPI with toast
        console.error("Delete error:", error);
      }
    },
    [playingId, activeRingtone]
  );

  // ✅ Handle search
  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // ✅ Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="bg-white dark:bg-[#1b1f2b] rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Ringtones
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {ringtones.length}{" "}
                {ringtones.length === 1 ? "ringtone" : "ringtones"}
              </p>
            </div>
          </div>

          {/* Upload Button - Only for own profile */}
          {isOwnProfile && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || showNameInput}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>Upload</span>
              </button>
            </div>
          )}
        </div>

        {/* Name Input for Upload */}
        {showNameInput && (
          <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ringtone Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleUpload()}
                placeholder="Enter ringtone name..."
                className="flex-1 px-3 py-2 bg-white dark:bg-[#2a3142] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                autoFocus
              />
              <button
                onClick={handleUpload}
                disabled={isUploading || !uploadName.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <SpinnerLoading size="sm" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCancelUpload}
                disabled={isUploading}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {ringtones.length > 0 && !showNameInput && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search ringtones..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-[#2a3142] border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {ringtones.length === 0 ? (
          <EmptyState isOwnProfile={isOwnProfile} />
        ) : filteredRingtones.length === 0 ? (
          <NoResults searchQuery={searchQuery} />
        ) : (
          <div className="space-y-3">
            {filteredRingtones.map((ringtone) => (
              <RingtoneItem
                key={ringtone._id}
                ringtone={ringtone}
                isActive={activeRingtone === ringtone._id}
                isPlaying={playingId === ringtone._id}
                isOwnProfile={isOwnProfile}
                onPlayPause={handlePlayPause}
                onRename={handleRename}
                onSetActive={handleSetActive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hidden Audio Player */}
      <audio ref={audioRef} onEnded={handleAudioEnd} />
    </div>
  );
});

MusicTab.displayName = "MusicTab";

MusicTab.propTypes = {
  displayedUser: propTypes.shape({
    _id: propTypes.string.isRequired,
    ringtones: propTypes.arrayOf(
      propTypes.shape({
        _id: propTypes.string.isRequired,
        name: propTypes.string.isRequired,
        url: propTypes.string.isRequired,
        uploadedAt: propTypes.string,
      })
    ),
    activeRingtone: propTypes.string,
  }).isRequired,
};

// ✅ RingtoneItem Component
const RingtoneItem = memo(
  ({
    ringtone,
    isActive,
    isPlaying,
    isOwnProfile,
    onPlayPause,
    onRename,
    onSetActive,
    onDelete,
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(ringtone.name);

    const formattedDate = useMemo(() => {
      if (!ringtone.uploadedAt) return "";
      return new Date(ringtone.uploadedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }, [ringtone.uploadedAt]);

    const handleSaveEdit = useCallback(() => {
      if (editName.trim() !== ringtone.name) {
        onRename(ringtone._id, editName);
      }
      setIsEditing(false);
    }, [editName, ringtone._id, ringtone.name, onRename]);

    const handleCancelEdit = useCallback(() => {
      setEditName(ringtone.name);
      setIsEditing(false);
    }, [ringtone.name]);

    return (
      <div
        className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
          isActive
            ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500 dark:border-purple-400"
            : "bg-gray-50 dark:bg-[#2a3142] border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        }`}
      >
        {/* Play/Pause Button */}
        <button
          onClick={() => onPlayPause(ringtone._id, ringtone.url)}
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-full transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          ) : (
            <Play className="w-5 h-5 text-purple-600 dark:text-purple-400 ml-0.5" />
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                className="flex-1 px-2 py-1 bg-white dark:bg-[#1b1f2b] border border-purple-300 dark:border-purple-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                autoFocus
              />
              <button
                onClick={handleSaveEdit}
                className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                title="Save"
              >
                <Save className="w-4 h-4 text-green-600 dark:text-green-400" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {ringtone.name}
              </h3>
              {isActive && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full flex-shrink-0">
                  <Volume2 className="w-3 h-3" />
                  Active
                </span>
              )}
            </div>
          )}
          {formattedDate && !isEditing && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Uploaded {formattedDate}
            </p>
          )}
        </div>

        {/* Actions - Only for own profile */}
        {isOwnProfile && !isEditing && (
          <div className="flex items-center gap-2">
            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
              title="Rename ringtone"
            >
              <Edit2 className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </button>

            {/* Set Active Button */}
            {!isActive && (
              <button
                onClick={() => onSetActive(ringtone._id)}
                className="p-2 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors group"
                title="Set as active ringtone"
              >
                <Check className="w-5 h-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
              </button>
            )}

            {/* Delete Button */}
            <button
              onClick={() => onDelete(ringtone._id)}
              className="p-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
              title="Delete ringtone"
            >
              <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

RingtoneItem.displayName = "RingtoneItem";

RingtoneItem.propTypes = {
  ringtone: propTypes.shape({
    _id: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    url: propTypes.string.isRequired,
    uploadedAt: propTypes.string,
  }).isRequired,
  isActive: propTypes.bool.isRequired,
  isPlaying: propTypes.bool.isRequired,
  isOwnProfile: propTypes.bool.isRequired,
  onPlayPause: propTypes.func.isRequired,
  onRename: propTypes.func.isRequired,
  onSetActive: propTypes.func.isRequired,
  onDelete: propTypes.func.isRequired,
};

// ✅ EmptyState Component
const EmptyState = memo(({ isOwnProfile }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
      <Music2 className="w-12 h-12 text-purple-400 dark:text-purple-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      No ringtones yet
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
      {isOwnProfile
        ? "Upload your first ringtone to personalize your call experience."
        : "This user hasn't uploaded any ringtones yet."}
    </p>
  </div>
));

EmptyState.displayName = "EmptyState";

EmptyState.propTypes = {
  isOwnProfile: propTypes.bool.isRequired,
};

// ✅ NoResults Component
const NoResults = memo(({ searchQuery }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
      <Search className="w-12 h-12 text-gray-400 dark:text-gray-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      No results found
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
      No ringtones found matching{" "}
      <span className="font-medium text-gray-700 dark:text-gray-300">
        &ldquo;{searchQuery}&rdquo;
      </span>
    </p>
  </div>
));

NoResults.displayName = "NoResults";

NoResults.propTypes = {
  searchQuery: propTypes.string.isRequired,
};

export default MusicTab;