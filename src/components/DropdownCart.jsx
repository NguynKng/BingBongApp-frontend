import { Link } from "react-router-dom";
import SpinnerLoading from "./SpinnerLoading";
import { formatPriceWithDollar } from "../utils/formattedFunction";
import { X } from "lucide-react";
import useCartStore from "../store/cartStore";
import { getBackendImgURL } from "../utils/helper";

function DropdownCart({ onClose }) {
  const {
    cart,
    loading: isLoadingCart,
    removeFromCart,
  } = useCartStore();

  return (
    <div className="absolute right-0 top-[110%] w-80 bg-white rounded-xl shadow-xl z-50 p-4 dark:bg-[rgb(35,35,35)]">
      {isLoadingCart ? (
        <SpinnerLoading />
      ) : (
        <>
          {/* Title */}
          <div className="font-semibold text-lg text-blue-800 dark:text-blue-400 mb-3">
            Shopping Cart
          </div>

          {/* Product List */}
          <div className="lg:py-4 border-y-2 border-gray-200 dark:border-gray-700">
            <div className="overflow-y-auto flex flex-col h-[14rem] custom-scroll gap-4">
              {cart.items?.length > 0 ? (
                cart.items.map((cartItem) => {
                  const selectedVariant = cartItem.product.variants.find(
                    (variant) => variant._id === cartItem.variant
                  );
                  return (
                    <div
                      key={cartItem._id}
                      className="flex items-center justify-between"
                      onClick={onClose}
                    >
                      <div className="relative flex items-center gap-4 w-full"
                      >
                        {/* Product Image */}
                        <Link
                          to={`/shop/${cartItem.product.shop.slug}/product/detail/${cartItem.product.slug}`}
                        >
                          <img
                            src={getBackendImgURL(selectedVariant?.image)}
                            alt={selectedVariant?.name}
                            className="w-16 h-16 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex flex-col">
                          <Link
                            to={`/shop/${cartItem.product.shop.slug}`}
                            className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate max-w-[10rem]"
                            title={cartItem.product.shop.name}
                          >
                            {cartItem.product.shop.name}
                          </Link>
                          <Link
                            to={`/shop/${cartItem.product.shop.slug}/product/detail/${cartItem.product.slug}`}
                            className="text-[15px] font-semibold truncate max-w-[10rem] text-gray-800 dark:text-gray-100"
                            title={selectedVariant?.name}
                          >
                            {selectedVariant?.name}
                          </Link>
                          <span className="text-gray-500 dark:text-gray-400 text-[15px]">
                            {cartItem.quantity} x{" "}
                            <span className="text-blue-800 dark:text-blue-400 font-semibold">
                              {formatPriceWithDollar(selectedVariant?.price)}
                            </span>
                          </span>
                        </div>

                        {/* Remove Button */}
                        <X
                          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-blue-800 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition"
                          onClick={() =>
                            removeFromCart(
                              cartItem.product._id,
                              cartItem.variant
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  Your cart is empty
                </div>
              )}
            </div>
          </div>

          {/* Total + Action Buttons */}
          <div className="mt-4">
            <div className="w-full rounded-md bg-gray-100 dark:bg-transparent p-4 flex items-center justify-between">
              <span className="font-semibold text-base text-gray-800 dark:text-gray-100">
                Total:
              </span>
              <span className="font-bold text-lg text-blue-800 dark:text-blue-400">
                {formatPriceWithDollar(cart.total)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Link
                to="/checkout"
                className="mt-4 w-full text-center bg-blue-700 dark:bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-800 dark:hover:bg-blue-500 transition-all"
                onClick={onClose}
              >
                Checkout
              </Link>
              <Link
                to="/cart"
                className="mt-4 w-full text-center bg-blue-700 dark:bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-800 dark:hover:bg-blue-500 transition-all"
                onClick={onClose}
              >
                View Cart
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DropdownCart;
