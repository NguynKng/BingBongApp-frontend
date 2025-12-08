import { memo } from "react";
import { Users, UserPlus, Check, Dot } from "lucide-react";
import { getBackendImgURL } from "../utils/helper";
import { Link } from "react-router-dom";

const GroupCard = memo(({ group }) => {
  return (
    <Link to={`/group/${group.slug}`} className="block">
      <div className="bg-white dark:bg-[#1e1e2f] shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
        {/* Cover */}
        <div className="h-32 w-full overflow-hidden relative">
          <img
            src={getBackendImgURL(group.coverPhoto)}
            alt="cover"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Avatar + Name */}
          <div className="flex items-center gap-3 -mt-10 mb-3">
            <img
              src={getBackendImgURL(group.avatar)}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-[#1e1e2f] shadow-lg"
            />
            <div className="flex-1 mt-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                {group.name}
              </h2>
              <div className="flex gap-1 items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Users className="size-4" />
                  {group.members?.length || 0} members
                </p>
                <Dot />
                <p className="text-sm text-gray-500">{`${
                  group.visibility === "public" ? "Public" : "Private"
                } Group`}</p>
              </div>
            </div>
          </div>

          {/* Description - Limited to 3 lines */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.6rem]">
            {group.description || "No description available for this group."}
          </p>

          {/* Join Button */}
          <div className="mt-4">
            <Link to={`/group/${group.slug}`}>
              <button
                className="w-full flex items-center cursor-pointer justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2.5 rounded-lg"
              >
                View Group
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
});
export default GroupCard;
