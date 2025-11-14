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
    <div className="flex lg:flex-row flex-col-reverse">
      <PlaceOrderModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      {/* LEFT SIDE - USER SHIPPING INFO */}
      <div className="lg:w-[60vw] w-full bg-white flex justify-center lg:justify-end">
        <div className="w-[40rem] border-b-2 border-gray-200 lg:px-10 px-4 pt-4 pb-10 mt-10 flex flex-col gap-4">
          <h1 className="text-3xl font-semibold">NguynKng</h1>
          <h1 className="text-xl font-semibold">Contact Information</h1>

          <div className="leading-8">
            <h1>
              {user?.fullName} ({user?.email})
            </h1>
            <div className="flex gap-2 items-center">
              <input type="checkbox" className="size-4 cursor-pointer" />
              <label>Send me updates and promotions via email</label>
            </div>
          </div>

          {/* SHIPPING FORM */}
          <div className="flex flex-col mt-2 gap-2">
            <h1 className="text-xl font-semibold">Shipping Address</h1>

            {/* Address */}
            <div className="relative">
              <input
                type="text"
                className="peer p-4 w-full border-2 border-gray-200 rounded-md"
                value={shipping.address}
                onChange={(e) =>
                  handleShippingChange("address", e.target.value)
                }
                required
              />
              <label
                className={`absolute left-4 transition-all duration-300 text-gray-400 ${
                  shipping.address
                    ? "text-xs top-0.5"
                    : "top-4 peer-focus:text-xs peer-focus:top-0.5"
                }`}
              >
                Address
              </label>
            </div>

            {/* Country */}
            <div className="relative">
              <select
                className="peer p-4 w-full border-2 border-gray-200 rounded-md appearance-none bg-white"
                value={shipping.country}
                onChange={(e) =>
                  handleShippingChange("country", e.target.value)
                }
                required
              >
                <option value=""></option>
                {listCountries.map((country, index) => (
                  <option key={index} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              <label
                className={`absolute left-4 transition-all duration-300 text-gray-400 ${
                  shipping.country
                    ? "text-xs top-0.5"
                    : "top-4 peer-focus:text-xs peer-focus:top-0.5"
                }`}
              >
                Country / Region
              </label>
            </div>

            {/* City */}
            <div className="relative">
              <select
                className="peer p-4 w-full border-2 border-gray-200 rounded-md appearance-none bg-white"
                value={shipping.city}
                onChange={(e) => handleShippingChange("city", e.target.value)}
                disabled={!shipping.country || isGetCities}
                required
              >
                <option value=""></option>
                {cities.map((cityName, index) => (
                  <option key={index} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
              <label
                className={`absolute left-4 transition-all duration-300 text-gray-400 ${
                  shipping.city
                    ? "text-xs top-0.5"
                    : "top-4 peer-focus:text-xs peer-focus:top-0.5"
                }`}
              >
                City
              </label>
            </div>

            {/* Name */}
            <div className="flex items-center gap-4">
              <div className="relative w-1/2">
                <input
                  type="text"
                  className="peer p-4 w-full border-2 border-gray-200 rounded-md"
                  value={shipping.firstName}
                  onChange={(e) =>
                    handleShippingChange("firstName", e.target.value)
                  }
                />
                <label
                  className={`absolute left-4 transition-all duration-300 text-gray-400 ${
                    shipping.firstName
                      ? "text-xs top-0.5"
                      : "top-4 peer-focus:text-xs peer-focus:top-0.5"
                  }`}
                >
                  First Name
                </label>
              </div>
              <div className="relative w-1/2">
                <input
                  type="text"
                  className="peer p-4 w-full border-2 border-gray-200 rounded-md"
                  value={shipping.lastName}
                  onChange={(e) =>
                    handleShippingChange("lastName", e.target.value)
                  }
                  required
                />
                <label
                  className={`absolute left-4 transition-all duration-300 text-gray-400 ${
                    shipping.lastName
                      ? "text-xs top-0.5"
                      : "top-4 peer-focus:text-xs peer-focus:top-0.5"
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
                className="peer p-4 w-full border-2 border-gray-200 rounded-md"
                value={shipping.phoneNumber}
                onChange={(e) =>
                  handleShippingChange("phoneNumber", e.target.value)
                }
                required
              />
              <label
                className={`absolute left-4 transition-all duration-300 text-gray-400 ${
                  shipping.phoneNumber
                    ? "text-xs top-0.5"
                    : "top-4 peer-focus:text-xs peer-focus:top-0.5"
                }`}
              >
                Phone Number
              </label>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
            <Link to="/cart" className="flex items-center gap-2 text-blue-700">
              <ChevronLeft />
              <span>Back to cart</span>
            </Link>
            <button
              type="submit"
              className="p-4 text-white bg-blue-700 hover:bg-blue-800 rounded-md"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - CART ITEMS */}
      <div className="lg:w-[40vw] w-full bg-gray-100 flex justify-center lg:justify-start">
        <div className="w-[32rem] lg:ml-10 p-4 pb-10 mt-10 flex flex-col">
          <div className="flex flex-col gap-4 py-6 border-b-2 border-gray-300 overflow-y-auto h-[24rem] scrollbar-hide">
            {!cart ? (
              <p className="text-gray-500 text-lg">
                Your cart is empty. Add some items to continue.
              </p>
            ) : (
              cart?.items?.map((item, index) => {
                const selectedVariant = item.product.variants.find(
                  (variant) => variant._id === item.variant
                );
                return (
                  <div key={index} className="flex items-center gap-4">
                    <Link
                      to={`/shop/${item.product.shop.slug}/product/detail/${item.product.slug}`}
                      className="min-w-20 h-16 relative"
                    >
                      <img
                        src={getBackendImgURL(selectedVariant?.image)}
                        className="w-full h-full object-contain border-2 border-blue-500"
                        loading="lazy"
                      />
                      <div className="flex items-center justify-center absolute translate-x-1/3 -translate-y-1/2 text-white w-6 h-6 top-0 right-0 bg-black opacity-50 text-xs rounded-full">
                        {item.quantity}
                      </div>
                    </Link>
                    <div className="flex items-center w-full justify-between gap-2">
                      <div className="flex flex-col">
                        <Link
                          className="text-sm text-gray-600"
                          to={`/shop/${item.product.shop.slug}`}
                        >
                          {item.product.shop.name}
                        </Link>
                        <Link
                          className="text-base font-medium"
                          to={`/shop/${item.product.shop.slug}/product/detail/${item.product.slug}`}
                        >
                          {selectedVariant?.name}
                        </Link>
                        <span className="text-gray-500">
                          {formatPriceWithDollar(selectedVariant?.price)}
                        </span>
                      </div>
                      <span className="text-xl text-blue-700 font-semibold">
                        {formatPriceWithDollar(item.price)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="py-6 border-b-2 border-gray-300">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-400">Subtotal</h3>
              <span className="font-medium">
                {cart ? formatPriceWithDollar(cart.total) : "$0.00"}
              </span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <h3 className="text-gray-400">Shipping Fee</h3>
              <span className="font-medium">Free</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-6">
            <h3 className="font-medium text-lg">Total</h3>
            <span className="text-blue-700 text-xl font-semibold">
              {cart ? formatPriceWithDollar(cart.total) : "$0.00"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
