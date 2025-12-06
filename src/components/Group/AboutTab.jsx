import { 
  Globe, 
  Lock, 
  Tag, 
  Settings, 
  Users, 
  Shield, 
  CheckCircle2, 
  XCircle,
  Crown,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { getBackendImgURL } from "../../utils/helper";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function AboutTab({ group }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const MAX_LENGTH = 300; // Maximum characters before truncating
  
  const description = group.description || "No description available for this group.";
  const shouldTruncate = description.length > MAX_LENGTH;
  const displayDescription = shouldTruncate && !showFullDescription
    ? description.slice(0, MAX_LENGTH) + "..."
    : description;

  return (
    <div className="space-y-4">
      {/* Description */}
      <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-5 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
        <h2 className="text-lg font-bold mb-3 dark:text-gray-200 flex items-center gap-2">
          About This Group
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {displayDescription}
        </p>
        
        {/* See More/Less Button */}
        {shouldTruncate && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-3 flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {showFullDescription ? (
              <>
                See Less <ChevronUp className="size-4" />
              </>
            ) : (
              <>
                See More <ChevronDown className="size-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Visibility */}
        <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-5 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
          <div className="flex gap-3 items-start">
            <div className={`p-2 rounded-lg ${
              group.visibility === "public" 
                ? "bg-green-100 dark:bg-green-900/30" 
                : "bg-gray-100 dark:bg-gray-800"
            }`}>
              {group.visibility === "public" ? (
                <Globe className="size-5 text-green-600 dark:text-green-400" />
              ) : (
                <Lock className="size-5 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            <div>
              <p className="font-semibold text-base capitalize dark:text-gray-200 mb-1">
                {group.visibility} Group
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {group.visibility === "public"
                  ? "Anyone can see who's in the group and what they post."
                  : "Only members can see who's in the group and what they post."}
              </p>
            </div>
          </div>
        </div>

        {/* Member Stats */}
        <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-5 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
          <h3 className="font-semibold mb-3 dark:text-gray-200 flex items-center gap-2">
            <Users className="size-5 text-blue-600 dark:text-blue-400" />
            Members
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {group.members.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {group.admins.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Admins</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {group.moderators.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Moderators</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {group.tags?.length > 0 && (
        <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-5 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
          <h3 className="font-semibold mb-3 dark:text-gray-200 flex items-center gap-2">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Admin */}
      <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-5 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
        <h3 className="font-semibold mb-3 dark:text-gray-200 flex items-center gap-2">
          Administrator
        </h3>
        <Link
          to={`/profile/${group.createdBy.slug}`}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#252838] transition-colors"
        >
          <div className="relative">
            <img
              src={getBackendImgURL(group.createdBy.avatar)}
              className="size-12 rounded-full object-cover"
              alt="admin"
            />
            <div className="absolute -bottom-0.5 -right-0.5 bg-amber-500 rounded-full p-0.5">
              <Shield className="size-3 text-white" />
            </div>
          </div>
          <div>
            <p className="font-medium dark:text-gray-200">
              {group.createdBy.fullName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Group Creator
            </p>
          </div>
        </Link>
      </div>

      {/* Rules */}
      {group.rules?.length > 0 && (
        <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-5 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
          <h3 className="font-semibold mb-3 dark:text-gray-200 flex items-center gap-2">
            Rules
          </h3>
          <div className="space-y-3">
            {group.rules.map((rule, idx) => (
              <div 
                key={idx} 
                className="border-l-2 border-blue-500 bg-gray-50 dark:bg-[#252838] p-3 rounded-r-lg"
              >
                <p className="font-semibold dark:text-gray-200 mb-1 flex items-center gap-2">
                  <span className="bg-blue-600 text-white size-5 rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  {rule.title}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm pl-7">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Members */}
      <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-5 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
        <h3 className="font-semibold mb-3 dark:text-gray-200 flex items-center gap-2">
          Recent Members
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {group.members.slice(0, 12).map((mem) => (
            <Link 
              key={mem._id} 
              to={`/profile/${mem.slug}`}
              title={mem.fullName}
            >
              <img
                src={getBackendImgURL(mem.avatar)}
                className="size-10 rounded-full object-cover border border-gray-300 dark:border-gray-700 hover:scale-110 transition-transform"
                alt={mem.fullName}
              />
            </Link>
          ))}
          {group.members.length > 12 && (
            <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              +{group.members.length - 12}
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-5 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
        <h3 className="font-semibold mb-3 dark:text-gray-200 flex items-center gap-2">
          Settings
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          <SettingCard
            label="Members Can Post"
            value={group.settings.allowMemberPost}
          />
          <SettingCard
            label="Post Approval"
            value={group.settings.requirePostApproval}
          />
          <SettingCard
            label="Join Approval"
            value={group.settings.requireJoinApproval}
          />
        </div>
      </div>
    </div>
  );
}

/* Setting Card */
function SettingCard({ label, value }) {
  return (
    <div className={`p-4 rounded-lg border ${
      value 
        ? "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800" 
        : "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
    }`}>
      <div className="flex items-center gap-2 mb-1">
        {value ? (
          <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
        ) : (
          <XCircle className="size-4 text-red-600 dark:text-red-400" />
        )}
        <p className={`text-sm font-semibold ${
          value ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
        }`}>
          {value ? "On" : "Off"}
        </p>
      </div>
      <p className="text-xs text-gray-700 dark:text-gray-300">
        {label}
      </p>
    </div>
  );
}