import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CircleCheck,
  CircleX,
  Loader2,
  Package,
  PackageCheck,
  Truck,
} from "lucide-react";
import { chatAPI, orderAPI } from "../services/api";
import { formatPriceWithDollar } from "../utils/formattedFunction";
import { getBackendImgURL } from "../utils/helper";
import { formatDateTimeWithTime } from "../utils/timeUtils";
import useAuthStore from "../store/authStore";

export default function OrderDetailPage({ onToggleChat }) {
  const { user } = useAuthStore();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const isShopOwner = user && order && user._id === order.shop.owner;

  const fullName = order
    ? `${order.shipping.lastName} ${order.shipping.firstName}`
    : "";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOrderById(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleToggleChat = async () => {
    const response = await chatAPI.getChatIdByTypeId({
      shopId: order.shop._id,
      type: "shop",
    });
    onToggleChat(response.data);
  };

  const handleReceiveOrder = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      const updatedOrder = await orderAPI.receiveOrder(order.orderId);
      setOrder(updatedOrder.data);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="w-full flex justify-center py-10 bg-gray-50 dark:bg-[#0f1419] min-h-screen">
        <Loader2 className="animate-spin w-7 h-7 text-blue-600 dark:text-purple-500" />
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] flex items-center justify-center">
        <p className="text-center text-red-500 dark:text-red-400">
          Order not found.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen py-8 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* TITLE */}
        <div className="bg-white dark:bg-[#1b1f2b] p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Order Details
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Order ID:{" "}
            <span className="font-medium text-blue-600 dark:text-purple-400">
              {order.orderId}
            </span>
          </p>
        </div>

        <div className="flex lg:flex-row flex-col lg:gap-6 gap-4">
          {/* LEFT SIDE - ORDER SUMMARY */}
          <div className="lg:w-[35%] w-full h-fit shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b1f2b] rounded-lg p-4 space-y-4">
            <h2 className="font-semibold text-xl text-gray-900 dark:text-white">
              Your Order
            </h2>
            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Products List */}
            <div className="flex flex-col gap-4">
              {order.products.map((product) => {
                const variant = product.product.variants.find(
                  (v) => v._id === product.variant
                );
                return (
                  <div
                    key={product._id}
                    className="flex gap-3 items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <img
                      src={getBackendImgURL(variant.image)}
                      alt={variant.name}
                      className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                    />
                    <div className="flex-1 flex gap-2 items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {product.product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {variant.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {product.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-orange-500 dark:text-orange-400">
                        {formatPriceWithDollar(variant.price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                <span className="font-medium">Subtotal</span>
                <span>{formatPriceWithDollar(order.total)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                <span className="font-medium">Shipping</span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Free
                </span>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Total */}
            <div className="flex items-center justify-between text-lg">
              <span className="font-bold text-gray-900 dark:text-white">
                Total
              </span>
              <span className="font-bold text-blue-600 dark:text-purple-400">
                {formatPriceWithDollar(order.total)}
              </span>
            </div>
          </div>

          {/* RIGHT SIDE - ORDER TRACKING */}
          <div className="lg:w-[65%] w-full space-y-6">
            {/* Progress Tracker */}
            <div className="bg-white dark:bg-[#1b1f2b] p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col gap-4">
                {/* Progress Bar */}
                <div className="relative flex items-center justify-between">
                  {/* Base Line */}
                  <div className="absolute top-1/2 w-[100%] h-1 bg-gray-200 dark:bg-gray-700 z-0"></div>

                  {/* Progress Line */}
                  <div
                    className="absolute w-full top-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 z-0 transition-all duration-500"
                    style={{
                      width: order.completedAt
                        ? "100%"
                        : order.shippingAt
                        ? "60%"
                        : order.confirmedAt
                        ? "35%"
                        : "15%",
                    }}
                  ></div>

                  {/* Step Icons */}
                  <div className="flex flex-col z-10 w-1/4 items-center">
                    <div
                      className={`size-14 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${
                        order.createdAt
                          ? "bg-blue-600 dark:bg-purple-600 border-blue-700 dark:border-purple-700 text-white"
                          : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      <Package className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex flex-col w-1/4 z-10 items-center">
                    <div
                      className={`size-14 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${
                        order.confirmedAt
                          ? "bg-blue-600 dark:bg-purple-600 border-blue-700 dark:border-purple-700 text-white"
                          : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      <PackageCheck className="w-6 h-6" />
                    </div>
                  </div>

                  {!order.cancelledAt && (
                    <div className="flex flex-col z-10 w-1/4 items-center">
                      <div
                        className={`size-14 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${
                          order.shippingAt
                            ? "bg-blue-600 dark:bg-purple-600 border-blue-700 dark:border-purple-700 text-white"
                            : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        <Truck className="w-6 h-6" />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col z-10 w-1/4 items-center">
                    <div
                      className={`size-14 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${
                        order.cancelledAt
                          ? "bg-red-600 dark:bg-red-700 border-red-700 dark:border-red-800 text-white"
                          : order.completedAt
                          ? "bg-green-600 dark:bg-green-700 border-green-700 dark:border-green-800 text-white"
                          : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {order.cancelledAt ? (
                        <CircleX className="w-6 h-6" />
                      ) : (
                        <CircleCheck className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Step Labels */}
                <div className="flex items-center justify-between">
                  <div className="w-1/4 text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Order Placed
                    </p>
                    {order.createdAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDateTimeWithTime(order.createdAt)}
                      </p>
                    )}
                  </div>
                  <div className="w-1/4 text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Confirmed
                    </p>
                    {order.confirmedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDateTimeWithTime(order.confirmedAt)}
                      </p>
                    )}
                  </div>
                  <div className="w-1/4 text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Shipping
                    </p>
                    {order.shippingAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDateTimeWithTime(order.shippingAt)}
                      </p>
                    )}
                  </div>
                  <div className="w-1/4 text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.cancelledAt ? "Cancelled" : "Completed"}
                    </p>
                    {(order.completedAt || order.cancelledAt) && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDateTimeWithTime(
                          order.completedAt || order.cancelledAt
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="bg-white dark:bg-[#1b1f2b] p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex lg:flex-row flex-col justify-between gap-4">
                <div className="flex flex-col justify-between lg:w-[65%] w-full space-y-3">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    Delivery attempt should be made by 05-01-2023
                  </p>
                  {!isShopOwner && (
                    <button
                      onClick={handleToggleChat}
                      className="rounded-lg cursor-pointer bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 py-2 px-4 text-white transition-colors font-medium w-fit"
                    >
                      Chat with customer support
                    </button>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Confirm order receive after you receive the goods
                    successfully
                  </p>
                </div>
                {order.orderStatus === "Shipping" && (
                  <div className="lg:w-[35%] w-full flex flex-col gap-3">
                    <button
                      className="w-full h-12 cursor-pointer text-white text-center rounded-lg bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 transition-colors font-medium shadow-md"
                      disabled={updating || order.orderStatus !== "Shipping"} onClick={handleReceiveOrder}
                    >
                      Order Received
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white dark:bg-[#1b1f2b] p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                Delivery Address
              </h2>
              <div className="flex lg:flex-row flex-col gap-6">
                {/* Address Info */}
                <div className="lg:w-[35%] w-full space-y-1 text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {fullName}
                  </p>
                  <p>{order.shipping.phoneNumber}</p>
                  <p>{`${order.shipping.address}, ${order.shipping.city}`}</p>
                  <p>{order.shipping.country}</p>
                </div>

                {/* Divider */}
                <div className="lg:w-px lg:h-auto h-px bg-gray-300 dark:bg-gray-700"></div>

                {/* Timeline */}
                <div className="lg:w-[60%] w-full">
                  <div className="relative flex flex-col gap-6">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-300 dark:bg-gray-700 -translate-x-1/2"></div>

                    {/* Timeline Items */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm w-[40%] text-right text-gray-600 dark:text-gray-400">
                        {formatDateTimeWithTime(order.createdAt)}
                      </p>
                      <div className="w-[20%] flex justify-center relative">
                        <div className="size-8 rounded-full flex items-center justify-center border-2 bg-blue-600 dark:bg-purple-600 border-blue-700 dark:border-purple-700 text-white z-10 shadow-md">
                          <Package className="size-4" />
                        </div>
                      </div>
                      <p className="text-sm w-[40%] text-gray-900 dark:text-white font-medium">
                        Order placed
                      </p>
                    </div>

                    {order.confirmedAt && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm w-[40%] text-right text-gray-600 dark:text-gray-400">
                          {formatDateTimeWithTime(order.confirmedAt)}
                        </p>
                        <div className="w-[20%] flex justify-center relative">
                          <div className="size-8 rounded-full flex items-center justify-center border-2 bg-blue-600 dark:bg-purple-600 border-blue-700 dark:border-purple-700 text-white z-10 shadow-md">
                            <PackageCheck className="size-4" />
                          </div>
                        </div>
                        <p className="text-sm w-[40%] text-gray-900 dark:text-white font-medium">
                          Shop confirmed
                        </p>
                      </div>
                    )}

                    {order.shippingAt && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm w-[40%] text-right text-gray-600 dark:text-gray-400">
                          {formatDateTimeWithTime(order.shippingAt)}
                        </p>
                        <div className="w-[20%] flex justify-center relative">
                          <div className="size-8 rounded-full flex items-center justify-center border-2 bg-blue-600 dark:bg-purple-600 border-blue-700 dark:border-purple-700 text-white z-10 shadow-md">
                            <Truck className="size-4" />
                          </div>
                        </div>
                        <p className="text-sm w-[40%] text-gray-900 dark:text-white font-medium">
                          Shipping
                        </p>
                      </div>
                    )}

                    {order.completedAt && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm w-[40%] text-right text-gray-600 dark:text-gray-400">
                          {formatDateTimeWithTime(order.completedAt)}
                        </p>
                        <div className="w-[20%] flex justify-center relative">
                          <div className="size-8 rounded-full flex items-center justify-center border-2 bg-green-600 dark:bg-green-700 border-green-700 dark:border-green-800 text-white z-10 shadow-md">
                            <CircleCheck className="size-4" />
                          </div>
                        </div>
                        <p className="text-sm w-[40%] text-gray-900 dark:text-white font-medium">
                          Completed
                        </p>
                      </div>
                    )}

                    {order.cancelledAt && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm w-[40%] text-right text-gray-600 dark:text-gray-400">
                          {formatDateTimeWithTime(order.cancelledAt)}
                        </p>
                        <div className="w-[20%] flex justify-center relative">
                          <div className="size-8 rounded-full flex items-center justify-center border-2 bg-red-600 dark:bg-red-700 border-red-700 dark:border-red-800 text-white z-10 shadow-md">
                            <CircleX className="size-4" />
                          </div>
                        </div>
                        <p className="text-sm w-[40%] text-red-600 dark:text-red-400 font-medium">
                          Order Cancelled
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
