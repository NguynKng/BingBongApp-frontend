import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, TrendingUpDown } from "lucide-react";
import PropTypes from "prop-types";
import Config from "../envVars";
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
      className="group w-full min-w-[12.5rem] max-w-[15rem] h-[24rem] rounded-md flex-none bg-white border-[2px] border-gray-200 transition-all duration-300 ease-in-out hover:opacity-60 relative hover:scale-95"
    >
      {/* Inner content of the card */}
      <div className="absolute top-4 right-2 z-20 flex flex-col gap-3 opacity-0 translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-x-0">
        <div className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
          <Heart
            className={`size-5 cursor-pointer fill-red-500
              `}
            onClick={(e) => {}}
          />
        </div>

        <div className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
          <TrendingUpDown className="text-black size-5" />
        </div>

        <div className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
          <ShoppingBag
            className="text-black size-5"
            onClick={(e) => {
              e.preventDefault();
            }}
          />
        </div>
      </div>

      <div className="relative w-full h-[60%] rounded-t-md">
        {imgLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white rounded-t-md">
            <SpinnerLoading />
          </div>
        )}
        <img
          src={getBackendImgURL(product.images[0])}
          className="size-full rounded-t-md object-cover"
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
        <h1 className="font-medium text-base min-h-12 max-h-12 text-ellipsis overflow-hidden">
          {product.name}
        </h1>
        {product.discount > 0 ? (
          <div className="flex gap-2 items-center">
            <h5 className="text-gray-500 line-through font-semibold">
              {formatPriceWithDollar(product.basePrice)}
            </h5>
            <h5 className="text-red-600 font-semibold">
              {formatPriceWithDollar(
                product.basePrice - (product.basePrice * product.discount) / 100
              )}
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
