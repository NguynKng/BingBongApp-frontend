import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPriceWithDollar } from "../utils/formattedFunction";
import useCartStore from "../store/cartStore";
import SpinnerLoading from "../components/SpinnerLoading";
import { getBackendImgURL } from "../utils/helper";

export default function CartPage() {
  const {
    cart,
    loading: loadingCart,
    removeFromCart,
    addToCart,
    minusFromCart,
  } = useCartStore();

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerLoading />
      </div>
    );
  }

  return (
    <div className="pt-6 px-2 min-h-screen dark:bg-[#0f172a] transition-colors duration-300">
      <div className="max-w-[76rem] mx-auto flex lg:flex-row flex-col gap-4">

        {/* PRODUCT LIST */}
        <div className="lg:w-[70%] w-full bg-white dark:bg-[#1b1f2b] rounded-xl shadow-md p-4">
          <h1 className="text-gray-700 dark:text-gray-200 text-2xl font-semibold">
            Shopping Cart
          </h1>
          <hr className="mt-4 border-gray-300 dark:border-gray-600" />

          <div className="flex flex-col mt-4 overflow-y-auto h-fit scrollbar-hide">
            {cart.items?.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Your cart is empty. Add some products to continue shopping.
              </p>
            ) : (
              <>
                {/* ITEM LIST */}
                <div className="flex flex-col gap-4">
                  {cart.items?.map((item, index) => {
                    const selectedVariant = item.product.variants.find(
                      (variant) => variant._id === item.variant
                    );

                    return (
                      <div
                        key={index}
                        className={`py-6 ${
                          index < cart.items.length - 1 &&
                          "border-b-2 dark:border-gray-600 border-gray-300"
                        }`}
                      >
                        <div className="flex gap-6">
                          <Link
                            to={`/shop/${item.product.shop.slug}/product/detail/${item.product.slug}`}
                            className="w-[10.5rem] h-36"
                          >
                            <img
                              src={getBackendImgURL(selectedVariant.image)}
                              className="size-full object-contain"
                            />
                          </Link>

                          <div className="flex w-full justify-between sm:flex-row flex-col">
                            <div className="flex flex-col gap-1">
                              <span className="text-base text-gray-500 dark:text-gray-400">
                                {item.product.shop.name}
                              </span>
                              <span className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                                {selectedVariant?.name}
                              </span>
                              <span className="text-base text-gray-500 dark:text-gray-400">
                                {item.product?.name}
                              </span>
                            </div>
                            <span className="text-orange-500 font-medium text-lg">
                              {formatPriceWithDollar(item.price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                          <div className="rounded-full flex items-center justify-center border-2 border-gray-300">
                            {item.quantity > 1 ? (
                              <div
                                className="w-10 h-10 flex items-center justify-center dark:hover:bg-gray-700 hover:bg-gray-300 rounded-full cursor-pointer"
                                onClick={() =>
                                  minusFromCart(
                                    item.product._id,
                                    selectedVariant._id
                                  )
                                }
                              >
                                <Minus className="size-4 dark:text-white" />
                              </div>
                            ) : (
                              <div
                                className="w-10 h-10 flex items-center justify-center dark:hover:bg-gray-700 hover:bg-gray-300 rounded-full cursor-pointer"
                                onClick={() =>
                                  removeFromCart(
                                    item.product._id,
                                    selectedVariant._id
                                  )
                                }
                              >
                                <Trash2 className="size-4 dark:text-white" />
                              </div>
                            )}

                            <div className="p-2 dark:text-white">
                              <span>{item.quantity}</span>
                            </div>

                            <div
                              className="w-10 h-10 flex items-center justify-center cursor-pointer text-xl dark:hover:bg-gray-700 hover:bg-gray-300 rounded-full dark:text-white"
                              onClick={() =>
                                addToCart(item.product._id, selectedVariant._id)
                              }
                            >
                              +
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:w-[30%] w-full p-6 bg-white dark:bg-[#1b1f2b] rounded-xl shadow-md h-fit">
          <h1 className="text-gray-700 dark:text-gray-200 text-2xl font-semibold">
            Order Summary
          </h1>

          <div className="py-6 border-b border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-between text-gray-700 dark:text-gray-200">
              <span className="text-lg">Subtotal</span>
              <span className="text-lg font-medium">
                {formatPriceWithDollar(cart?.total)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-gray-700 dark:text-gray-200">
              <span className="text-lg">Shipping Fee</span>
              <span className="text-lg font-medium text-green-600 dark:text-green-400">
                Free
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-300 dark:border-gray-600">
            <span className="text-lg font-medium text-gray-800 dark:text-gray-100">
              Total
            </span>
            <span className="text-lg font-medium text-blue-700 dark:text-blue-400">
              {formatPriceWithDollar(cart?.total)}
            </span>
          </div>

          <div className="pt-4">
            <Link to="/checkout">
              <button className="text-white text-lg bg-blue-600 dark:bg-blue-500 mt-4 w-full rounded-full p-4 hover:bg-blue-700 dark:hover:bg-blue-400 transition">
                Checkout
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
