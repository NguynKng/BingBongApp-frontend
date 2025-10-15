import { useState } from "react";
import Config from "../../envVars";

export default function ProductTab({ shop, user }) {
  const isMyShop = shop.owner._id === user?._id;
  const [activeCategory, setActiveCategory] = useState(null);
  return (
    <div className="flex gap-6">
      {/* Sidebar danh mục */}
      <aside className="w-1/4 hidden lg:block bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-[#2b2b3d] rounded-lg p-4 h-fit">
        <h2 className="text-lg font-semibold mb-3 dark:text-white">Danh mục</h2>
        <ul className="space-y-2">
          <li
            className={`cursor-pointer px-2 py-1 rounded-md ${
              !activeCategory
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-[#2b2b3d]"
            }`}
            onClick={() => setActiveCategory(null)}
          >
            Tất cả
          </li>
          {shop.categories.map((cat) => (
            <li
              key={cat._id}
              className={`cursor-pointer px-2 py-1 rounded-md ${
                activeCategory === cat
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-[#2b2b3d]"
              }`}
              onClick={() => setActiveCategory(cat.name)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Danh sách sản phẩm */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sản phẩm
          </h1>
          <div className="flex gap-3 items-center">
            <select className="border rounded-md px-3 py-2 text-sm dark:bg-[#1e1e2f] dark:text-white">
              <option value="newest">Mới nhất</option>
              <option value="priceLow">Giá thấp → cao</option>
              <option value="priceHigh">Giá cao → thấp</option>
              <option value="name">Tên A → Z</option>
            </select>
          </div>
        </div>

        {shop.products && shop.products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shop.products
              .filter((p) => !activeCategory || p.category === activeCategory)
              .map((product) => (
                <div
                  key={product._id}
                  className="bg-white dark:bg-[#1e1e2f] rounded-lg border border-gray-200 dark:border-[#2b2b3d] overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer"
                >
                  <img
                    src={Config.BACKEND_URL + product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3 space-y-2">
                    <h2 className="text-base font-semibold text-gray-800 dark:text-white truncate">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {product.price?.toLocaleString()} ₫
                    </p>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-2 rounded-md">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-10">
            Chưa có sản phẩm nào.
          </p>
        )}
      </div>
    </div>
  );
}
