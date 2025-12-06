import { useEffect, useState, useMemo } from "react";
import { productAPI } from "../../services/api";
import ProductCard from "../ProductCard";
import { Link, useParams } from "react-router-dom";
import SpinnerLoading from "../SpinnerLoading";
import { Grid2x2, List, Search } from "lucide-react";

export default function ProductTab({ shop }) {
  const { category } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  const selectedCategory = shop.categories.find((c) => c.slug === category);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all products once
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

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    if (selectedCategory) {
      result = result.filter(
        (p) => p.category && p.category === selectedCategory.name
      );
    }

    if (minPrice > 0) result = result.filter((p) => p.basePrice >= minPrice);
    if (maxPrice > 0) result = result.filter((p) => p.basePrice <= maxPrice);
    if (isDiscounted) result = result.filter((p) => p.discount > 0);

    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(search));
    }

    return result;
  }, [
    allProducts,
    selectedCategory,
    minPrice,
    maxPrice,
    isDiscounted,
    searchTerm,
  ]);

  return (
    <div className="bg-white dark:bg-[#1e1e2f] p-4 rounded-lg min-h-screen">
      {/* Filter bar */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 border-b border-gray-300 dark:border-[#2b2b3d] pb-4">
        {/* Category filter */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/shop/${shop.slug}/product`}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              !category
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-[#2b2b3d] hover:bg-gray-200 dark:hover:bg-[#3b3b4f] text-gray-800 dark:text-gray-200"
            }`}
          >
            All
          </Link>
          {shop.categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop/${shop.slug}/product/category/${cat.slug}`}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                selectedCategory && selectedCategory._id === cat._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-[#2b2b3d] hover:bg-gray-200 dark:hover:bg-[#3b3b4f] text-gray-800 dark:text-gray-200"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Price filter + discount + search */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Price filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm dark:text-gray-200">Price:</label>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-[#2b2b3d] dark:bg-[#1e1e2f] dark:text-white text-sm"
            />
            <span className="text-gray-500 dark:text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-[#2b2b3d] dark:bg-[#1e1e2f] dark:text-white text-sm"
            />
          </div>

          {/* Discount checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-gray-200">
            <input
              type="checkbox"
              checked={isDiscounted}
              onChange={(e) => setIsDiscounted(e.target.checked)}
              className="accent-blue-500"
            />
            Discounted
          </label>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-md border border-gray-300 dark:border-[#2b2b3d]
                         dark:bg-[#1e1e2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            {/* GRID BUTTON */}
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-full cursor-pointer transition border-[1px] ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 dark:bg-[#2b2b3d] dark:text-gray-200 border-gray-300 hover:bg-gray-200 dark:hover:bg-[#3b3b4f]"
              }`}
            >
              <Grid2x2 />
            </button>

            {/* LIST BUTTON */}
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-full border-[1px] cursor-pointer transition ${
                viewMode === "list"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 dark:bg-[#2b2b3d] border-gray-300 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3b3b4f]"
              }`}
            >
              <List />
            </button>
          </div>
        </div>
      </div>

      {/* Product list */}
      {loading ? (
        <SpinnerLoading />
      ) : filteredProducts.length > 0 ? (
        <div
          className={`grid ${
            viewMode === "list"
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          } gap-4`}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              shop={shop}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-10">
          No matching products found.
        </p>
      )}
    </div>
  );
}
