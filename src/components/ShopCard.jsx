import { Link } from "react-router-dom";
import { getBackendImgURL } from "../utils/helper";
import { MapPin, Users, Tag } from "lucide-react";

export default function ShopCard({ shop }) {
  // Hiển thị tối đa 3 danh mục để gọn gàng
  const displayCategories = shop.categories?.slice(0, 3) || [];

  return (
    <Link
      to={`/shop/${shop.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-[#2b2b3d] bg-white dark:bg-[#1e1e2f] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Ảnh bìa */}
      <div className="relative w-full h-36 overflow-hidden">
        <img
          src={getBackendImgURL(shop.coverPhoto)}
          alt={shop.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-70 transition"></div>

        {/* Avatar + Tên shop */}
        <div className="absolute bottom-2 left-3 flex items-center">
          <img
            src={getBackendImgURL(shop.avatar)}
            alt={shop.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md"
          />
          <div className="ml-2">
            <h3 className="text-base font-semibold text-white drop-shadow-sm">
              {shop.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-4 flex flex-col gap-2">
        {/* Địa chỉ */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-1">
          <MapPin className="size-4 shrink-0 text-gray-400" />
          <span className="truncate">
            {shop.description?.address || "Chưa có địa chỉ"}
          </span>
        </div>

        {/* Lượt follow */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-1">
          <Users className="size-4 shrink-0 text-gray-400" />
          <span>{shop.followers?.length || 0} người theo dõi</span>
        </div>

        {/* Danh mục sản phẩm */}
        {displayCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-2 text-sm">
            <Tag className="size-4 text-gray-400" />
            {displayCategories.map((cat, i) => (
              <span
                key={cat._id}
                className="px-2 py-0.5 bg-gray-100 dark:bg-[#2b2b3d] text-gray-700 dark:text-gray-300 rounded-full text-xs"
              >
                {cat.name}
              </span>
            ))}
            {shop.categories.length > 3 && (
              <span className="text-xs text-gray-400">+{shop.categories.length - 3} nữa</span>
            )}
          </div>
        )}

        {/* Nút xem shop */}
        <div className="mt-3">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded-md transition"
            type="button"
          >
            Xem shop
          </button>
        </div>
      </div>
    </Link>
  );
}
