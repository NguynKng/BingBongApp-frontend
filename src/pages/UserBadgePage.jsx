import { useEffect, useState } from "react";
import { badgesAPI } from "../services/api";
import SpinnerLoading from "../components/SpinnerLoading";
import BadgeProgressCard from "../components/BadgeProgressCard";
import useAuthStore from "../store/authStore";
import { useGetUserStats } from "../hooks/useStats";

const computeBadgeProgress = (badge, stats) => {
    const cond = badge.condition;
    const statKey =
        cond.type === "posts_count"
            ? stats.posts_count
            : cond.type === "comments_count"
                ? stats.comments_count
                : cond.type === "likes_received"
                    ? stats.likes_received
                    : cond.type === "friends_count"
                        ? stats.friends_count
                        : cond.type === "account_age"
                            ? stats.account_age
                            : 0;

    return { current: statKey, target: cond.value };
};

export default function UserBadgePage() {
    const { user } = useAuthStore();
    const [badges, setBadges] = useState([]);
    const [userBadgeInventory, setUserBadgeInventory] = useState([]);
    const [equippedBadgeId, setEquippedBadgeId] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userStats, loading: statsLoading } = useGetUserStats();

    const [completionFilter, setCompletionFilter] = useState("completed");
    const [tierFilter, setTierFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("my");

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const [badgesResult, inventoryResult] = await Promise.allSettled([
                    badgesAPI.getAllBadges(),
                    badgesAPI.getUserBadgeInventory(),
                ]);

                if (badgesResult.status === "fulfilled") setBadges(badgesResult.value.data);
                if (inventoryResult.status === "fulfilled") {
                    setUserBadgeInventory(inventoryResult.value.data);
                    const equipped = inventoryResult.value.data.find(b => b.isEquipped);
                    if (equipped) setEquippedBadgeId(equipped.badgeId._id);
                }
            } catch (error) {
                console.error("Failed to fetch badges:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const ownedBadgeIds = new Set(userBadgeInventory.map(item => item.badgeId?._id || item.badgeId));

    const unclaimedCompletedCount = badges.filter(badge => {
        if (ownedBadgeIds.has(badge._id)) return false;
        const progress = computeBadgeProgress(badge, userStats || {});
        const percentage = Math.min(Math.round((progress.current / progress.target) * 100), 100);
        return percentage >= 100;
    }).length;

    const handleClaimBadge = async (badge) => {
        try {
            const res = await badgesAPI.claimBadge(badge._id);
            if (res.success) {
                setUserBadgeInventory(prev => [...prev, { badgeId: badge, isEquipped: false }]);
                setBadges(prev => prev.filter(b => b._id !== badge._id));
            }
        } catch (error) {
            console.error("Failed to claim badge:", error);
        }
    };

    const handleEquipBadge = async (badgeId) => {
        try {
            const res = await badgesAPI.equipBadge(badgeId);
            if (res.success) {
                setEquippedBadgeId(badgeId);
                setUserBadgeInventory(prev =>
                    prev.map(item => ({
                        ...item,
                        isEquipped: item.badgeId._id === badgeId,
                    }))
                );
            }
        } catch (error) {
            console.error("Failed to equip badge:", error);
        }
    };

    const handleUnequipBadge = async (badgeId) => {
        try {
            const res = await badgesAPI.unequipBadge(badgeId);
            if (res.success) {
                setEquippedBadgeId(null);
                setUserBadgeInventory(prev =>
                    prev.map(item => ({
                        ...item,
                        isEquipped: item.badgeId._id === badgeId ? false : item.isEquipped,
                    }))
                );
            }
        } catch (error) {
            console.error("Failed to unequip badge:", error);
        }
    };

    const filteredBadges = badges.filter(badge => {
        if (ownedBadgeIds.has(badge._id)) return false;
        const progress = computeBadgeProgress(badge, userStats || {});
        const percentage = Math.min(Math.round((progress.current / progress.target) * 100), 100);

        if (completionFilter === "completed" && percentage < 100) return false;
        if (completionFilter === "not_completed" && percentage >= 100) return false;
        if (tierFilter !== "all" && badge.tier !== tierFilter) return false;

        return true;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-300 dark:border-gray-700">
                <button
                    className={`px-4 py-2 cursor-pointer font-medium ${activeTab === "my" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600 dark:text-gray-300"}`}
                    onClick={() => setActiveTab("my")}
                >
                    My Badges
                </button>
                <button
                    className={`ml-4 px-4 py-2 relative cursor-pointer font-medium ${activeTab === "all" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600 dark:text-gray-300"}`}
                    onClick={() => setActiveTab("all")}
                >
                    All Badges
                    {unclaimedCompletedCount > 0 && (
                        <div className="absolute right-2 top-1 w-2 h-2 bg-red-500 rounded-full shadow"></div>

                    )}
                </button>
            </div>

            {/* Tab content */}
            <div className="max-h-screen overflow-y-auto custom-scroll">
                {activeTab === "my" ? (
                    loading || statsLoading ? (
                        <SpinnerLoading />
                    ) : userBadgeInventory.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userBadgeInventory
                                .sort((a, b) => (b.isEquipped ? 1 : 0) - (a.isEquipped ? 1 : 0))
                                .map(item => {
                                    const progress = computeBadgeProgress(item.badgeId, userStats || {});
                                    const isEquipped = equippedBadgeId === item.badgeId._id;

                                    return (
                                        <BadgeProgressCard
                                            key={item.badgeId._id}
                                            badge={item.badgeId}
                                            progress={progress}
                                            isOwned={true}
                                            isEquipped={isEquipped}
                                            onEquip={handleEquipBadge}
                                            onUnequip={handleUnequipBadge}
                                        />
                                    );
                                })}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">{"You don't own any badges yet."}</p>
                    )
                ) : (
                    <div>
                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Completion</label>
                                <select
                                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                                    value={completionFilter}
                                    onChange={(e) => setCompletionFilter(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    <option value="completed">Completed</option>
                                    <option value="not_completed">Not Completed</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Tier</label>
                                <select
                                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                                    value={tierFilter}
                                    onChange={(e) => setTierFilter(e.target.value)}
                                >
                                    <option value="all">All Tiers</option>
                                    {["Bronze","Silver","Gold","Platinum","Diamond","Master","Grandmaster","Challenger"].map(tier => (
                                        <option key={tier} value={tier}>{tier}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Badges Grid */}
                        {loading || statsLoading ? (
                            <SpinnerLoading />
                        ) : filteredBadges.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredBadges.map(badge => {
                                    const progress = computeBadgeProgress(badge, userStats || {});
                                    const isOwned = ownedBadgeIds.has(badge._id);
                                    const isEquipped = equippedBadgeId === badge._id;

                                    return (
                                        <BadgeProgressCard
                                            key={badge._id}
                                            badge={badge}
                                            progress={progress}
                                            isOwned={isOwned}
                                            isEquipped={isEquipped}
                                            onClaim={handleClaimBadge}
                                            onEquip={handleEquipBadge}
                                            onUnequip={handleUnequipBadge}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No badges found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
