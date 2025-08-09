import Config from "../envVars";

export default function UserBadge({ badge }) {
    return (
        <div
            className="flex items-center gap-3 py-2 px-4 rounded-full shadow-md border border-yellow-300
                       bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-50
                       dark:from-yellow-500 dark:via-yellow-400 dark:to-yellow-300
                       hover:scale-105 transition-transform duration-200"
        >
            <img
                src={Config.BACKEND_URL + "/images/badge-icon/" + badge.icon}
                alt={badge.name}
                className="w-7 h-7 drop-shadow"
            />
            <span className="font-semibold text-yellow-800 dark:text-gray-900">
                {badge.name}
            </span>
        </div>
    );
}
