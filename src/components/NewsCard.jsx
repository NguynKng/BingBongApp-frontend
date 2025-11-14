import { Link } from "react-router-dom";
import { formatTime } from "../utils/timeUtils";

const NewsCard = ({ news }) => {
  const {
    source,
    author,
    title,
    description,
    url,
    urlToImage,
    publishedAt,
    content,
  } = news; 
  return (
    <div className="flex w-full h-[10rem] p-2 items-center group">
      <Link
        to={url}
        className="w-[25%] h-32 group-hover:scale-105 transition-transform duration-300"
      >
        <img
          src={urlToImage || "/none-image.jfif"}
          alt={title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover rounded-lg transition-opacity duration-500 opacity-0"
          onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
        />
      </Link>
      <div className="w-[75%] flex flex-col justify-center gap-1 px-6 py-4">
        <span className="sm:text-lg text-sm font-bold text-green-500">
          {source.name}
        </span>
        <Link
          to={url}
          className="dark:text-gray-200 sm:text-xl hover:underline hover:underline-offset-2 font-semibold"
          target="_blank"
        >
          {title}
        </Link>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-500 dark:text-gray-400 hover:underline hover:underline-offset-2">
            {author || "Author"}
          </span>
          <span className="text-gray-500 dark:text-gray-400">-</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatTime(publishedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
