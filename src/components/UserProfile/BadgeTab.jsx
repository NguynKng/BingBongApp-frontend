import { memo, useMemo, useState, useCallback } from "react";
import {
  Award,
  Search,
  X,
  Trophy,
  Star,
  Crown,
  Shield,
  Sparkles,
  Zap,
  Flame,
  Diamond,
} from "lucide-react";
import propTypes from "prop-types";
import UserBadge from "../UserBadge";
import { badgeTierToColor } from "../../utils/helper";

const BadgeTab = memo(({ displayedUser, mode = "large" }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Get badges from badgeInventory
  const badges = useMemo(() => {
    return (displayedUser.badgeInventory || [])
      .filter((item) => item.badgeId) // Only badges with valid badgeId
      .map((item) => ({
        ...item.badgeId, // Badge details
        earnedAt: item.earnedAt,
        isEquipped: item.isEquipped,
        _id: item.badgeId._id,
      }));
  }, [displayedUser.badgeInventory]);

  // ✅ Filter badges by search
  const filteredBadges = useMemo(() => {
    if (!searchQuery.trim()) return badges;

    const query = searchQuery.toLowerCase();
    return badges.filter(
      (badge) =>
        badge.name.toLowerCase().includes(query) ||
        badge.tier.toLowerCase().includes(query) ||
        badge.description?.toLowerCase().includes(query)
    );
  }, [badges, searchQuery]);

  // ✅ Group badges by tier (Bronze → Challenger)
  const badgesByTier = useMemo(() => {
    const grouped = {
      Challenger: [],
      Grandmaster: [],
      Master: [],
      Diamond: [],
      Platinum: [],
      Gold: [],
      Silver: [],
      Bronze: [],
    };

    filteredBadges.forEach((badge) => {
      if (grouped[badge.tier]) {
        grouped[badge.tier].push(badge);
      }
    });

    return grouped;
  }, [filteredBadges]);

  // ✅ Get tier stats
  const tierStats = useMemo(() => {
    return {
      Challenger: badges.filter((b) => b.tier === "Challenger").length,
      Grandmaster: badges.filter((b) => b.tier === "Grandmaster").length,
      Master: badges.filter((b) => b.tier === "Master").length,
      Diamond: badges.filter((b) => b.tier === "Diamond").length,
      Platinum: badges.filter((b) => b.tier === "Platinum").length,
      Gold: badges.filter((b) => b.tier === "Gold").length,
      Silver: badges.filter((b) => b.tier === "Silver").length,
      Bronze: badges.filter((b) => b.tier === "Bronze").length,
    };
  }, [badges]);

  // ✅ Get equipped badge
  const equippedBadge = useMemo(() => {
    return badges.find((b) => b.isEquipped);
  }, [badges]);

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
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Badges
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {badges.length} {badges.length === 1 ? "badge" : "badges"}{" "}
                earned
              </p>
            </div>
          </div>

          {/* Equipped Badge */}
          {equippedBadge && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 text-white rounded-full text-sm font-medium shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${badgeTierToColor(
                  equippedBadge.tier
                )} 0%, ${badgeTierToColor(equippedBadge.tier)}dd 100%)`,
              }}
            >
              <Star className="w-4 h-4" />
              <span>Equipped: {equippedBadge.name}</span>
            </div>
          )}
        </div>

        {/* Top Tier Stats (Top 4) */}
        {badges.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <TierStat tier="Challenger" count={tierStats.Challenger} icon={Flame} />
            <TierStat tier="Grandmaster" count={tierStats.Grandmaster} icon={Crown} />
            <TierStat tier="Master" count={tierStats.Master} icon={Zap} />
            <TierStat tier="Diamond" count={tierStats.Diamond} icon={Diamond} />
          </div>
        )}

        {/* Search Bar */}
        {badges.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search badges..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-[#2a3142] border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
        {badges.length === 0 ? (
          <EmptyState />
        ) : filteredBadges.length === 0 ? (
          <NoResults searchQuery={searchQuery} />
        ) : (
          <div className="space-y-6">
            {Object.entries(badgesByTier).map(
              ([tier, tierBadges]) =>
                tierBadges.length > 0 && (
                  <BadgeTierSection
                    key={tier}
                    tier={tier}
                    badges={tierBadges}
                    mode={mode}
                  />
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
});

BadgeTab.displayName = "BadgeTab";

BadgeTab.propTypes = {
  displayedUser: propTypes.shape({
    _id: propTypes.string.isRequired,
    badgeInventory: propTypes.arrayOf(
      propTypes.shape({
        badgeId: propTypes.shape({
          _id: propTypes.string.isRequired,
          name: propTypes.string.isRequired,
          description: propTypes.string.isRequired,
          tier: propTypes.oneOf([
            "Bronze",
            "Silver",
            "Gold",
            "Platinum",
            "Diamond",
            "Master",
            "Grandmaster",
            "Challenger",
          ]).isRequired,
          condition: propTypes.object,
          isActive: propTypes.bool,
        }),
        earnedAt: propTypes.string,
        isEquipped: propTypes.bool,
      })
    ),
  }).isRequired,
  mode: propTypes.oneOf(["mini", "large"]),
};

// ✅ TierStat Component with dynamic colors
const TierStat = memo(({ tier, count, icon: Icon }) => {
  const bgColor = badgeTierToColor(tier);

  return (
    <div
      className="relative overflow-hidden rounded-lg p-3 text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <Icon className="w-4 h-4" />
          <span className="text-2xl font-bold">{count}</span>
        </div>
        <p className="text-xs font-medium opacity-90">{tier}</p>
      </div>
      {/* Background decoration */}
      <div className="absolute -right-2 -bottom-2 opacity-20">
        <Icon className="w-16 h-16" />
      </div>
    </div>
  );
});

TierStat.displayName = "TierStat";

TierStat.propTypes = {
  tier: propTypes.string.isRequired,
  count: propTypes.number.isRequired,
  icon: propTypes.elementType.isRequired,
};

// ✅ BadgeTierSection Component with dynamic colors
const BadgeTierSection = memo(({ tier, badges, mode }) => {
  const getTierIcon = (tier) => {
    switch (tier) {
      case "Challenger":
        return Flame;
      case "Grandmaster":
        return Crown;
      case "Master":
        return Zap;
      case "Diamond":
        return Diamond;
      case "Platinum":
        return Sparkles;
      case "Gold":
        return Trophy;
      case "Silver":
        return Star;
      case "Bronze":
        return Shield;
      default:
        return Award;
    }
  };

  const Icon = getTierIcon(tier);
  const tierColor = badgeTierToColor(tier);

  return (
    <div>
      {/* Tier Header */}
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5" style={{ color: tierColor }} />
        <h3 className="text-lg font-semibold" style={{ color: tierColor }}>
          {tier}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({badges.length})
        </span>
      </div>

      {/* Badges Grid */}
      <div className="flex flex-wrap gap-4">
        {badges.map((badge) => (
          <div
            key={badge._id}
            className="relative flex items-center justify-center p-4 bg-gray-50 dark:bg-[#2a3142] rounded-lg border-2 transition-all hover:shadow-lg"
            style={{
              borderColor: badge.isEquipped ? tierColor : undefined,
              boxShadow: badge.isEquipped
                ? `0 0 20px ${tierColor}40`
                : undefined,
            }}
          >
            {/* Equipped Badge Indicator */}
            {badge.isEquipped && (
              <div
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: tierColor }}
              >
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
            )}

            <UserBadge badge={badge} mode={mode} />
          </div>
        ))}
      </div>
    </div>
  );
});

BadgeTierSection.displayName = "BadgeTierSection";

BadgeTierSection.propTypes = {
  tier: propTypes.string.isRequired,
  badges: propTypes.arrayOf(
    propTypes.shape({
      _id: propTypes.string.isRequired,
      name: propTypes.string.isRequired,
      tier: propTypes.string.isRequired,
      description: propTypes.string,
      earnedAt: propTypes.string,
      isEquipped: propTypes.bool,
    })
  ).isRequired,
  mode: propTypes.oneOf(["mini", "large"]).isRequired,
};

// ✅ EmptyState Component
const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-24 h-24 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-6">
      <Trophy className="w-12 h-12 text-yellow-400 dark:text-yellow-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      No badges yet
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
      Complete challenges and milestones to earn badges and show off your
      achievements!
    </p>
  </div>
));

EmptyState.displayName = "EmptyState";

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
      No badges found matching{" "}
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

export default BadgeTab;