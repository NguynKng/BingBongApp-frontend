import { X } from "lucide-react";
import Config from "../envVars";

function NotificationPopup({ content, onClose }) {
  const { title, author_name, author_img } = content;
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg w-80 animate-fade-in">
      <div className="relative w-full h-full flex items-center gap-2 p-4">
        <img
          src={author_img ? `${Config.BACKEND_URL}${author_img}` : "/user.png"}
          className="object-cover size-11 rounded-full"
        />
        <p className="text-sm mt-1">{`${author_name} ${title}`}</p>
        <X
          className="absolute top-1 right-1 size-5 hover:text-red-500 cursor-pointer"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

export default NotificationPopup;
