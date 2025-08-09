import { useEffect, useState } from "react";
import { badgesAPI } from "../services/api";
import UserBadge from "../components/UserBadge";

export default function UserBadgePage() {
  const [badges, setBadges] = useState([]);
  const [userBadgeInventory, setUserBadgeInventory] = useState([]);
  const [filter, setFilter] = useState("all"); // all | owned | unowned

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allBadges = await badgesAPI.getAllBadges();
        setBadges(allBadges);

        const inventory = await badgesAPI.getUserBadgeInventory();
        setUserBadgeInventory(inventory);
      } catch (error) {
        console.error("Failed to fetch badges:", error);
      }
    };

    fetchData();
  }, []);

  const ownedBadgeIds = new Set(
    userBadgeInventory.map((item) => item.badgeId?._id || item.badgeId)
  );

  const filteredBadges = badges.filter((badge) => {
    if (filter === "all") return true;
    if (filter === "owned") return ownedBadgeIds.has(badge._id);
    if (filter === "unowned") return !ownedBadgeIds.has(badge._id);
    return true;
  });

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cột trái */}
      <div className="space-y-6 md:col-span-1">
        {/* Bộ lọc */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Bộ lọc</h2>
          <div className="flex flex-col gap-2">
            <button
              className={`px-4 py-2 rounded-lg border text-left ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`px-4 py-2 rounded-lg border text-left ${
                filter === "owned"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
              onClick={() => setFilter("owned")}
            >
              Đã sở hữu
            </button>
            <button
              className={`px-4 py-2 rounded-lg border text-left ${
                filter === "unowned"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
              onClick={() => setFilter("unowned")}
            >
              Chưa sở hữu
            </button>
          </div>
        </div>

        {/* Badge đang sở hữu */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Danh hiệu của bạn</h2>
          {userBadgeInventory.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {userBadgeInventory.map((item) => (
                <UserBadge
                  key={item.badgeId?._id || item.badgeId}
                  badge={item.badgeId}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Bạn chưa sở hữu danh hiệu nào.
            </p>
          )}
        </div>
      </div>

      {/* Cột phải */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:col-span-2">
        <h2 className="text-lg font-semibold mb-3">Tất cả danh hiệu</h2>
        {filteredBadges.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {filteredBadges.map((badge) => (
              <UserBadge key={badge._id} badge={badge} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Không có danh hiệu nào.</p>
        )}
      </div>
    </div>
  );
}
