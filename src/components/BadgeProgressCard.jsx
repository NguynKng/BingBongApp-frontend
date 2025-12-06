import { CheckCircle } from "lucide-react";
import { badgeTierToColor } from "../utils/helper";
import { memo } from "react";

const accentColor = "#3B82F6"; // màu chung cho progress bar và nút claim

const BadgeProgressCard = memo(({
    badge,
    progress,
    isOwned,
    isEquipped,
    onClaim,
    onEquip,
    onUnequip,
}) => {
    const percentage = Math.min(
        Math.round((progress.current / progress.target) * 100),
        100
    );

    const tierColor = badgeTierToColor(badge.tier);

    return (
        <div className={`p-4 rounded-lg shadow flex flex-col gap-3 w-full max-w-sm transition-all bg-white dark:bg-gray-800
            ${isEquipped ? "border-2 border-blue-500" : ""}`}>
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: tierColor }}
                    >
                        {badge.tier[0]}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                        {badge.name}
                    </h3>
                </div>
                {isOwned && !isEquipped && <CheckCircle className="w-6 h-6 text-green-500" />}
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-sm">{badge.description}</p>

            {/* Progress */}
            {!isOwned && (
                <>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Progress: {progress.current} / {progress.target}
                    </p>
                    <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all"
                            style={{ width: `${percentage}%`, backgroundColor: accentColor }}
                        />
                    </div>
                </>
            )}

            {/* Buttons */}
            <div className="mt-2">
                {!isOwned ? (
                    percentage >= 100 ? (
                        <button
                            className="px-3 py-1 text-white rounded-lg cursor-pointer shadow hover:opacity-90 transition"
                            style={{ backgroundColor: accentColor }}
                            onClick={() => onClaim(badge)}
                        >
                            Claim
                        </button>
                    ) : (
                        <span className="text-gray-500 text-xs">Keep going...</span>
                    )
                ) : isEquipped ? (
                    <button
                        className="px-3 py-1 rounded-lg cursor-pointer bg-red-500 text-white text-sm font-semibold hover:opacity-90 transition"
                        onClick={() => onUnequip(badge._id)}
                    >
                        Unequip
                    </button>
                ) : (
                    <button
                        className="px-3 py-1 rounded-lg cursor-pointer bg-green-600 text-white text-sm font-semibold hover:opacity-90 transition"
                        onClick={() => onEquip(badge._id)}
                    >
                        Equip
                    </button>
                )}
            </div>
        </div>
    );
}
);
export default BadgeProgressCard;