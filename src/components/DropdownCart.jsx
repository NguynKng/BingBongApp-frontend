import { Link } from "react-router-dom";
import { useEffect } from "react";
import SpinnerLoading from "./SpinnerLoading";
import Config from "../envVars";
import propTypes from "prop-types";
import { listProducts } from "../data/product";
import { formatPriceWithDollar } from "../utils/formattedFunction";
import { X } from "lucide-react";

function DropdownCart() {
  return (
    <div className="absolute right-0 top-[110%] w-80 bg-white rounded-xl shadow-xl z-50 p-4 h-fit min-h-0 dark:bg-[rgb(35,35,35)]">
      <div className="font-semibold text-lg text-blue-800 mb-3 dark:text-white">
        Giỏ hàng
      </div>
      <div className="lg:py-4 border-y-2 border-gray-200">
        <div className="overflow-y-auto flex flex-col h-[10rem] custom-scroll gap-4">
          {listProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="relative flex items-center gap-4 w-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold">
                    {product.name}
                  </span>
                  <span className="text-gray-400 text-[15px]">
                    {product.quantity} x{" "}
                    <span className="text-blue-800 font-semibold">
                      {formatPriceWithDollar(product.price)}
                    </span>
                  </span>
                </div>
                <X className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-blue-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full rounded-md bg-gray-100 p-4 flex items-center justify-between">
          <span className="font-semibold text-base">Tổng cộng:</span>
          <span className="font-bold text-lg text-blue-800">
            {formatPriceWithDollar(1000)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/checkout"
            className="mt-4 w-full text-center bg-blue-800 text-white py-2 rounded-md font-semibold hover:bg-blue-900 transition-all"
          >
            Thanh toán
          </Link>
          <Link
            to="/cart"
            className="mt-4 w-full text-center bg-blue-800 text-white py-2 rounded-md font-semibold hover:bg-blue-900 transition-all"
          >
            Xem giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

DropdownCart.propTypes = {
  cart: propTypes.array.isRequired,
};

export default DropdownCart;
