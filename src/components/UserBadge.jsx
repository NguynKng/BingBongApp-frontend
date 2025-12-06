import { getContrastColor, badgeTierToColor } from "../utils/helper";
import { useState, memo } from "react";

const UserBadge = memo(({ badge, mode = "mini" }) => {
  const bgColor = badgeTierToColor(badge.tier);
  const textColor = getContrastColor(bgColor);

  const [hover, setHover] = useState(false);

  const isLarge = mode === "large";

  return (
    <div className="relative inline-flex items-center">
      <div
        className={`
                    flex items-center gap-2 border font-semibold cursor-default transition-all
                    ${
                      isLarge
                        ? "px-3 py-2 rounded-lg text-sm"
                        : "px-2 py-1 rounded-md text-[11px]"
                    }
                `}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderColor: bgColor,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Tier circle */}
        <span
          className={`
                        flex items-center justify-center font-bold rounded-full
                        ${
                          isLarge ? "w-5 h-5 text-[11px]" : "w-3 h-3 text-[8px]"
                        }
                    `}
          style={{ backgroundColor: textColor, color: bgColor }}
        >
          {badge.tier[0]}
        </span>

        {/* Badge name */}
        <span>{badge.name}</span>
      </div>

      {/* Tooltip chỉ hiện ở chế độ large */}
      {isLarge && hover && (
        <div
          className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-xs 
                               bg-black text-white px-3 py-1 rounded shadow opacity-90 w-max z-50"
        >
          {badge.description}
        </div>
      )}
    </div>
  );
});

export default UserBadge;
