import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import PropTypes from "prop-types";
import { formatPriceWithDollar } from "../utils/formattedFunction";
import { useState, memo } from "react";
import SpinnerLoading from "./SpinnerLoading";
import { getBackendImgURL } from "../utils/helper";

const ProductCard = memo(({ product, shop, viewMode = "grid" }) => {
  const [imgLoading, setImgLoading] = useState(true);

  const isGrid = viewMode === "grid";

  return (
    <Link
      to={`/shop/${shop.slug}/product/detail/${product.slug}`}
      className={`group flex-shrink-0 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b1f2b] rounded-md transition-all duration-300 hover:opacity-70 hover:scale-95 hover:shadow-lg
        ${isGrid ? "h-[22rem] min-w-[10rem]" : "h-36 flex gap-4 p-3"}
      `}
    >
      {/* IMAGE */}
      <div
        className={`relative ${
          isGrid ? "w-full h-[60%]" : "w-28 h-full flex-shrink-0"
        }`}
      >
        {imgLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-[#1b1f2b]">
            <SpinnerLoading />
          </div>
        )}

        <img
          src={getBackendImgURL(product.images[0])}
          className={`rounded-md object-contain w-full h-full`}
          onLoad={() => setImgLoading(false)}
          alt={product.name}
        />

        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-orange-400 dark:bg-orange-500 rounded-xl py-1 px-2 shadow-md">
            <p className="text-white dark:text-gray-900 text-xs font-semibold">
              -{product.discount}%
            </p>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div
        className={`flex flex-col justify-between ${
          isGrid ? "w-full px-4 py-2 h-[40%] gap-2" : "flex-1 py-1"
        }`}
      >
        {/* Category */}
        <h6 className="text-orange-500 dark:text-orange-400 text-xs font-medium uppercase tracking-wide">
          {product.category}
        </h6>

        {/* Name */}
        <h1
          title={product.name}
          className={`font-medium truncate text-gray-900 dark:text-white ${
            isGrid ? "text-base" : "text-sm max-w-[90%]"
          }`}
        >
          {product.name}
        </h1>

        {/* Rating */}
        {product.totalRating === 0 ? (
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-4 fill-yellow-500 stroke-none" />
            ))}
          </div>
        ) : (
          <div className="flex gap-1 items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`size-4 transition-colors ${
                  i <= Math.round(product.totalRating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "stroke-yellow-500 dark:stroke-yellow-400"
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              ({product.ratings.length})
            </span>
          </div>
        )}

        {/* Price */}
        {product.discount > 0 ? (
          <div className="flex gap-2 items-center">
            <h5 className="text-red-600 dark:text-red-400 font-semibold">
              {formatPriceWithDollar(
                product.basePrice - (product.basePrice * product.discount) / 100
              )}
            </h5>
            <h5 className="text-gray-500 dark:text-gray-400 line-through font-semibold text-sm">
              {formatPriceWithDollar(product.basePrice)}
            </h5>
          </div>
        ) : (
          <h5 className="font-semibold text-red-600 dark:text-red-400">
            {formatPriceWithDollar(product.basePrice)}
          </h5>
        )}
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  shop: PropTypes.object.isRequired,
  viewMode: PropTypes.oneOf(["grid", "list"]),
};

export default ProductCard;