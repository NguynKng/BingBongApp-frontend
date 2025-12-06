import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { formatPriceWithDollar } from "../utils/formattedFunction";
import { listCountries } from "../utils/countryFlag";
import PlaceOrderModal from "../components/PlaceOrderModal";
import axios from "axios";
import useCartStore from "../store/cartStore";
import { getBackendImgURL } from "../utils/helper";
import { orderAPI } from "../services/api";
import toast from "react-hot-toast";

function CheckoutPage() {
  const { user } = useAuthStore();
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [isGetCities, setIsGetCities] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Combine all shipping info into a single state
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    country: "",
    city: "",
    address: "",
  });

  const handleShippingChange = (field, value) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (
      !shipping.address ||
      !shipping.country ||
      !shipping.city ||
      !shipping.phoneNumber ||
      !shipping.firstName ||
      !shipping.lastName
    ) {
      toast.error("Please fill out all required shipping information!");
      return;
    }

    try {
      const response = await orderAPI.createOrder(shipping);
      if (response.success) {
        clearCart();
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // Fetch cities based on the selected country
  useEffect(() => {
    const fetchCities = async () => {
      if (!shipping.country) return;
      setIsGetCities(true);
      try {
        const res = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/cities",
          { country: shipping.country }
        );

        setCities(res.data.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        setCities([]);
      } finally {
        setIsGetCities(false);
      }
    };

    fetchCities();
  }, [shipping.country]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419]">
      <div className="flex lg:flex-row flex-col-reverse max-w-[1920px] mx-auto">
        <PlaceOrderModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
        />

        {/* LEFT SIDE - USER SHIPPING INFO */}
        <div className="lg:w-[60%] w-full bg-white dark:bg-[#1b1f2b] flex justify-center lg:justify-end border-r border-gray-200 dark:border-gray-700">
          <div className="w-full max-w-2xl lg:px-10 px-4 pt-8 pb-10 flex flex-col gap-6">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
                NguynKng
              </h1>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h2>
            </div>

            {/* User Info */}
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                {user?.fullName} ({user?.email})
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="promotions"
                  className="size-4 cursor-pointer accent-blue-600 dark:accent-purple-500"
                />
                <label
                  htmlFor="promotions"
                  className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                >
                  Send me updates and promotions via email
                </label>
              </div>
            </div>

            {/* SHIPPING FORM */}
            <div className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Shipping Address
              </h2>

              {/* Address */}
              <div className="relative">
                <input
                  type="text"
                  className="peer p-4 w-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a3142] text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:outline-none transition-colors"
                  value={shipping.address}
                  onChange={(e) =>
                    handleShippingChange("address", e.target.value)
                  }
                  required
                />
                <label
                  className={`absolute left-4 transition-all duration-300 text-gray-400 dark:text-gray-500 pointer-events-none ${
                    shipping.address
                      ? "text-xs -top-2 bg-white dark:bg-[#2a3142] px-1"
                      : "top-4 peer-focus:text-xs peer-focus:-top-2 peer-focus:bg-white dark:peer-focus:bg-[#2a3142] peer-focus:px-1"
                  }`}
                >
                  Address
                </label>
              </div>

              {/* Country */}
              <div className="relative">
                <select
                  className="peer p-4 w-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a3142] text-gray-900 dark:text-white rounded-lg appearance-none focus:border-blue-500 dark:focus:border-purple-500 focus:outline-none transition-colors"
                  value={shipping.country}
                  onChange={(e) =>
                    handleShippingChange("country", e.target.value)
                  }
                  required
                >
                  <option value="" className="dark:bg-[#2a3142]"></option>
                  {listCountries.map((country, index) => (
                    <option
                      key={index}
                      value={country.name}
                      className="dark:bg-[#2a3142]"
                    >
                      {country.name}
                    </option>
                  ))}
                </select>
                <label
                  className={`absolute left-4 transition-all duration-300 text-gray-400 dark:text-gray-500 pointer-events-none ${
                    shipping.country
                      ? "text-xs -top-2 bg-white dark:bg-[#2a3142] px-1"
                      : "top-4 peer-focus:text-xs peer-focus:-top-2 peer-focus:bg-white dark:peer-focus:bg-[#2a3142] peer-focus:px-1"
                  }`}
                >
                  Country / Region
                </label>
              </div>

              {/* City */}
              <div className="relative">
                <select
                  className="peer p-4 w-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a3142] text-gray-900 dark:text-white rounded-lg appearance-none focus:border-blue-500 dark:focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  value={shipping.city}
                  onChange={(e) => handleShippingChange("city", e.target.value)}
                  disabled={!shipping.country || isGetCities}
                  required
                >
                  <option value="" className="dark:bg-[#2a3142]"></option>
                  {cities.map((cityName, index) => (
                    <option
                      key={index}
                      value={cityName}
                      className="dark:bg-[#2a3142]"
                    >
                      {cityName}
                    </option>
                  ))}
                </select>
                <label
                  className={`absolute left-4 transition-all duration-300 text-gray-400 dark:text-gray-500 pointer-events-none ${
                    shipping.city
                      ? "text-xs -top-2 bg-white dark:bg-[#2a3142] px-1"
                      : "top-4 peer-focus:text-xs peer-focus:-top-2 peer-focus:bg-white dark:peer-focus:bg-[#2a3142] peer-focus:px-1"
                  }`}
                >
                  City {isGetCities && "(Loading...)"}
                </label>
              </div>

              {/* Name */}
              <div className="flex items-center gap-4">
                <div className="relative w-1/2">
                  <input
                    type="text"
                    className="peer p-4 w-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a3142] text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:outline-none transition-colors"
                    value={shipping.firstName}
                    onChange={(e) =>
                      handleShippingChange("firstName", e.target.value)
                    }
                    required
                  />
                  <label
                    className={`absolute left-4 transition-all duration-300 text-gray-400 dark:text-gray-500 pointer-events-none ${
                      shipping.firstName
                        ? "text-xs -top-2 bg-white dark:bg-[#2a3142] px-1"
                        : "top-4 peer-focus:text-xs peer-focus:-top-2 peer-focus:bg-white dark:peer-focus:bg-[#2a3142] peer-focus:px-1"
                    }`}
                  >
                    First Name
                  </label>
                </div>
                <div className="relative w-1/2">
                  <input
                    type="text"
                    className="peer p-4 w-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a3142] text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:outline-none transition-colors"
                    value={shipping.lastName}
                    onChange={(e) =>
                      handleShippingChange("lastName", e.target.value)
                    }
                    required
                  />
                  <label
                    className={`absolute left-4 transition-all duration-300 text-gray-400 dark:text-gray-500 pointer-events-none ${
                      shipping.lastName
                        ? "text-xs -top-2 bg-white dark:bg-[#2a3142] px-1"
                        : "top-4 peer-focus:text-xs peer-focus:-top-2 peer-focus:bg-white dark:peer-focus:bg-[#2a3142] peer-focus:px-1"
                    }`}
                  >
                    Last Name
                  </label>
                </div>
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  type="tel"
                  className="peer p-4 w-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a3142] text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:outline-none transition-colors"
                  value={shipping.phoneNumber}
                  onChange={(e) =>
                    handleShippingChange("phoneNumber", e.target.value)
                  }
                  required
                />
                <label
                  className={`absolute left-4 transition-all duration-300 text-gray-400 dark:text-gray-500 pointer-events-none ${
                    shipping.phoneNumber
                      ? "text-xs -top-2 bg-white dark:bg-[#2a3142] px-1"
                      : "top-4 peer-focus:text-xs peer-focus:-top-2 peer-focus:bg-white dark:peer-focus:bg-[#2a3142] peer-focus:px-1"
                  }`}
                >
                  Phone Number
                </label>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/cart"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <ChevronLeft className="size-5" />
                <span className="font-medium">Back to cart</span>
              </Link>
              <button
                type="submit"
                className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 dark:from-purple-600 dark:to-purple-700 hover:from-blue-700 hover:to-blue-800 dark:hover:from-purple-700 dark:hover:to-purple-800 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - CART ITEMS */}
        <div className="lg:w-[40%] w-full bg-gray-50 dark:bg-[#0f1419] flex justify-center lg:justify-start">
          <div className="w-full max-w-xl lg:ml-10 p-6 pb-10 mt-8 flex flex-col">
            {/* Cart Items */}
            <div className="flex flex-col gap-4 py-6 border-b-2 border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[32rem] custom-scroll">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-10 h-10 text-gray-400 dark:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg text-center">
                    Your cart is empty. Add some items to continue.
                  </p>
                </div>
              ) : (
                cart?.items?.map((item, index) => {
                  const selectedVariant = item.product.variants.find(
                    (variant) => variant._id === item.variant
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-white dark:bg-[#1b1f2b] rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <Link
                        to={`/shop/${item.product.shop.slug}/product/detail/${item.product.slug}`}
                        className="min-w-20 h-20 relative flex-shrink-0"
                      >
                        <img
                          src={getBackendImgURL(selectedVariant?.image)}
                          className="w-full h-full object-contain rounded border-2 border-gray-200 dark:border-gray-700"
                          loading="lazy"
                          alt={selectedVariant?.name}
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 dark:bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-md">
                          {item.quantity}
                        </div>
                      </Link>
                      <div className="flex items-center w-full justify-between gap-2">
                        <div className="flex flex-col">
                          <Link
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400 transition-colors"
                            to={`/shop/${item.product.shop.slug}`}
                          >
                            {item.product.shop.name}
                          </Link>
                          <Link
                            className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-purple-400 transition-colors line-clamp-2"
                            to={`/shop/${item.product.shop.slug}/product/detail/${item.product.slug}`}
                          >
                            {selectedVariant?.name}
                          </Link>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatPriceWithDollar(selectedVariant?.price)}
                          </span>
                        </div>
                        <span className="text-lg text-blue-600 dark:text-purple-400 font-semibold flex-shrink-0">
                          {formatPriceWithDollar(item.price)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pricing Summary */}
            <div className="py-6 border-b-2 border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-500 dark:text-gray-400">Subtotal</h3>
                <span className="font-medium text-gray-900 dark:text-white">
                  {cart ? formatPriceWithDollar(cart.total) : "$0.00"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-gray-500 dark:text-gray-400">
                  Shipping Fee
                </h3>
                <span className="font-medium text-green-600 dark:text-green-400">
                  Free
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-6">
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                Total
              </h3>
              <span className="text-2xl text-blue-600 dark:text-purple-400 font-bold">
                {cart ? formatPriceWithDollar(cart.total) : "$0.00"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;