import { Link } from "react-router-dom";

const NewsCard = ({ news }) => {
  const { title, category, link_cat, link, link_author, author, image, time } = news;
  return (
    <div className="flex w-full h-[10rem] p-2 items-center group">
      <Link to={link} className="w-[25%] h-32 group-hover:scale-105 transition-transform duration-300">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      </Link>
      <div className="w-[75%] flex flex-col justify-center gap-1 px-6 py-4">
        <Link
          to={link_cat}
          className="sm:text-lg text-sm font-bold text-green-500"
        >
          {category}
        </Link>
        <Link to={link} className="dark:text-gray-200 sm:text-xl hover:underline hover:underline-offset-2 font-semibold">{title}</Link>
        <div className="flex items-center gap-1">
          <Link to={link_author} className="text-sm text-gray-500 dark:text-gray-400 hover:underline hover:underline-offset-2">
            {author}
          </Link>
          <span className="text-gray-500 dark:text-gray-400">-</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
