import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBackendImgURL } from "../utils/helper";
import UserBadge from "./UserBadge";
import { getEquippedBadge } from "../utils/helper";
import { userAPI, shopAPI } from "../services/api";
import { BriefcaseBusiness, MapPin, Globe, Info, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { getProfileLink } from "../utils/helper";
import useAuthStore from "../store/authStore";

export default function HoverProfileCard({ slug, type }) {
  const { theme } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const equippedBadge = useMemo(() => getEquippedBadge(data), [data]);

  useEffect(() => {
    if (!slug || !type) return;

    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        let result;
        if (type === "User") {
          result = await userAPI.getUserProfileBySlug(slug);
        } else if (type === "Shop") {
          result = await shopAPI.getShopBySlug(slug);
        }

        if (!ignore) {
          setData(result?.data || null);
        }
      } catch (error) {
        console.error("HoverProfile fetch error:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 200);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [slug, type]);

  if (!data || loading) return null;

  // === Helpers ===
  const renderWork = () => {
    if (!data.work) return null;
    const { position, company, duration } = data.work;
    if (!position && !company && !duration) return null;

    return (
      <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
        <BriefcaseBusiness className="fill-gray-500 text-white size-5 dark:text-black flex-shrink-0" />
        <div>
          {position && <strong>{position}</strong>}
          {company && (
            <>
              {position ? " at " : "Work at "}
              <strong>{company}</strong>
            </>
          )}
          {duration && (
            <>
              {" ("}
              <strong>{duration}</strong>
              {")"}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderAbout = () => {
    const about = type === "Shop" ? data.description.about : null;
    if (!about) return null;

    return (
      <div className="flex items-start gap-1 text-gray-700 dark:text-gray-300">
        <Info className="fill-gray-500 text-white size-5 dark:text-black flex-shrink-0" />
        <span>{about}</span>
      </div>
    );
  };

  const renderLocation = () => {
    const address = type === "User" ? data.address : data.description?.address;
    if (!address) return null;

    return (
      <div className="flex items-start gap-1 text-gray-700 dark:text-gray-300">
        <MapPin className="fill-gray-500 text-white size-5 dark:text-black flex-shrink-0" />
        <span>
          {type === "User" ? "Lives in " : "Located at "}
          <strong>{address}</strong>
        </span>
      </div>
    );
  };

  const renderWebsite = () => {
    const website = type === "Shop" ? data.description?.website : data.website;
    if (!website) return null;

    return (
      <div className="flex items-start gap-1 text-gray-700 dark:text-gray-300">
        <Globe className="fill-gray-500 text-white size-5 dark:text-black flex-shrink-0 mt-0.5" />
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline break-all"
        >
          {website}
        </a>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.18 }}
        className="absolute left-0 bottom-6 -translate-x-1/4 z-50 w-96 bg-white dark:bg-[#1b1f2b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 text-gray-800 dark:text-gray-200"
      >
        <div className="flex items-start gap-2">
          {/* Avatar */}
          <div className="w-1/4">
            <Link to={getProfileLink(data, type)}>
              <img
                src={getBackendImgURL(data.avatar)}
                alt={data.fullName || data.name}
                className="w-20 h-20 rounded-full mx-auto border border-gray-300 dark:border-gray-600 object-cover"
              />
            </Link>

            {/* Bio */}
            {data.bio && (
              <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-3 line-clamp-2 overflow-hidden">
                {data.bio}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex gap-2 items-center">
              <Link
                to={getProfileLink(data, type)}
                className="font-semibold text-lg hover:underline underline-offset-2"
              >
                {data.fullName || data.name}
              </Link>
              {equippedBadge && type === "User" && (
                <UserBadge badge={equippedBadge} />
              )}
            </div>

            <div className="space-y-1 mt-2">
              {renderAbout()}
              {renderWork()}
              {renderLocation()}
              {renderWebsite()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <button className="flex gap-2 items-center justify-center bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#262638] cursor-pointer rounded-md py-2 px-4 text-black dark:text-white font-medium">
            <img
              src={
                theme === "light"
                  ? "/messenger-icon.png"
                  : "/messenger-icon-white.png"
              }
              className="object-cover size-5"
            />
            <span>Message</span>
          </button>
          <Link
            to={getProfileLink(data, type)}
            className="flex-1 gap-2 items-center justify-center bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-md py-2 px-4 text-white font-medium flex"
          >
            <span>View</span>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
