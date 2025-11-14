import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, TrendingUpDown } from "lucide-react";
import PropTypes from "prop-types";
import { formatPriceWithDollar } from "../utils/formattedFunction";
import { useState } from "react";
import SpinnerLoading from "./SpinnerLoading";
import { getBackendImgURL } from "../utils/helper";

function ProductCard({ product, shop }) {
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <Link
      key={product._id}
      to={`/shop/${shop.slug}/product/detail/${product.slug}`}
      className="group w-full min-w-[12.5rem] max-w-[15rem] h-[22rem] rounded-md flex-none bg-white border-[2px] border-gray-200 transition-all duration-300 ease-in-out hover:opacity-60 relative hover:scale-95"
    >
      <div className="relative w-full h-[60%] rounded-t-md">
        {imgLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white rounded-t-md">
            <SpinnerLoading />
          </div>
        )}
        <img
          src={getBackendImgURL(product.images[0])}
          className="size-full rounded-t-md object-contain"
          alt="Product Thumbnail"
          onLoad={() => setImgLoading(false)}
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-orange-400 rounded-xl py-1 px-2">
            <p className="text-black text-xs">-{product.discount}%</p>
          </div>
        )}
      </div>

      <div className="w-full px-4 py-2 flex flex-col gap-2 h-[40%] z-10">
        <h6 className="text-orange-500 text-sm">{product.category}</h6>
        <h1 title={product.name} className="font-medium text-base truncate overflow-hidden">
          {product.name}
        </h1>
        {product.totalRating === 0 ? (
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-4 fill-yellow-500 stroke-none" />
            ))}
          </div>
        ) : (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`size-4 ${
                  i <= Math.round(product.totalRating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "stroke-yellow-500"
                }`}
              />
            ))}
          </div>
        )}
        {product.discount > 0 ? (
          <div className="flex gap-2 items-center">
            <h5 className="text-red-600 font-semibold">
              {formatPriceWithDollar(
                product.basePrice - (product.basePrice * product.discount) / 100
              )}
            </h5>
            <h5 className="text-gray-500 line-through font-semibold">
              {formatPriceWithDollar(product.basePrice)}
            </h5>
          </div>
        ) : (
          <h5 className="font-semibold text-red-600">
            {formatPriceWithDollar(product.basePrice)}
          </h5>
        )}
      </div>
    </Link>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object,
};

export default ProductCard;
