import { useEffect, useState, useMemo } from "react";
import { productAPI } from "../../services/api";
import ProductCard from "../ProductCard";
import { Link, useParams } from "react-router-dom";
import SpinnerLoading from "../SpinnerLoading";
import { Search, Filter } from "lucide-react";

export default function ProductTab({ shop }) {
  const { category } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = shop.categories.find((c) => c.slug === category);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // 🔹 Lấy toàn bộ sản phẩm 1 lần duy nhất
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProductsByShop(shop._id);
        if (response.success) setAllProducts(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    if (shop) fetchProducts();
  }, [shop]);

  // 🔹 Lọc sản phẩm — chỉ chạy lại khi deps thay đổi
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Lọc theo danh mục
    if (selectedCategory) {
      result = result.filter(
        (p) => p.category && p.category === selectedCategory.name
      );
    }

    // Lọc theo giá
    if (minPrice > 0) result = result.filter((p) => p.basePrice >= minPrice);
    if (maxPrice > 0) result = result.filter((p) => p.basePrice <= maxPrice);

    // Lọc sản phẩm giảm giá
    if (isDiscounted) result = result.filter((p) => p.discount > 0);

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(search));
    }

    return result;
  }, [allProducts, selectedCategory, minPrice, maxPrice, isDiscounted, searchTerm]);

  return (
    <div className="flex lg:flex-row flex-col gap-6 relative">
      {/* 🔘 Nút bật/tắt bộ lọc (mobile) */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md w-fit"
        >
          <Filter className="w-5 h-5" />
          {showFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
        </button>
      </div>

      {/* 🧩 Sidebar bộ lọc */}
      <aside
        className={`bg-white dark:bg-[#1e1e2f] lg:sticky top-[8.5vh] origin-top h-fit border border-gray-200 dark:border-[#2b2b3d] rounded-lg p-4 
        transition-all duration-300 ease-in-out
        ${showFilter ? "opacity-100 scale-y-100" : "hidden"} lg:block`}
      >
        <h2 className="text-lg font-semibold mb-3 dark:text-white">Danh mục</h2>
        <ul className="space-y-2 mb-6">
          <li>
            <Link
              to={`/shop/${shop.slug}/product`}
              className={`block cursor-pointer px-2 py-1 rounded-md ${
                !category
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-[#2b2b3d]"
              }`}
            >
              Tất cả
            </Link>
          </li>
          {shop.categories.map((cat) => (
            <li key={cat._id}>
              <Link
                to={`/shop/${shop.slug}/product/category/${cat.slug}`}
                className={`block cursor-pointer px-2 py-1 rounded-md ${
                  selectedCategory && selectedCategory._id === cat._id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-[#2b2b3d]"
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Bộ lọc giá */}
        <div className="border-t border-gray-300 dark:border-[#2b2b3d] pt-4">
          <h3 className="text-lg font-semibold mb-3 dark:text-white">
            Lọc theo giá
          </h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Tối thiểu: {minPrice.toLocaleString()}$
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Tối đa: {maxPrice.toLocaleString()}$
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        {/* Giảm giá */}
        <div className="mt-6 border-t border-gray-300 dark:border-[#2b2b3d] pt-4">
          <label className="flex items-center gap-2 cursor-pointer dark:text-white">
            <input
              type="checkbox"
              checked={isDiscounted}
              onChange={(e) => setIsDiscounted(e.target.checked)}
              className="accent-blue-500"
            />
            Đang giảm giá
          </label>
        </div>
      </aside>

      {/* 🛍️ Danh sách sản phẩm */}
      <div className="flex-1 bg-white dark:bg-[#1e1e2f] p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedCategory ? selectedCategory.name : "Tất cả sản phẩm"}
          </h1>

          {/* 🔍 Thanh tìm kiếm */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-[#2b2b3d]
                         dark:bg-[#1e1e2f] dark:text-white focus:outline-none focus:ring-2 
                         focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <SpinnerLoading />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} shop={shop} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-10">
            Không có sản phẩm nào phù hợp.
          </p>
        )}
      </div>
    </div>
  );
}
