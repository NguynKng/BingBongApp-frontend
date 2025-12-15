import OrderStatus from "./OrderStatus";
import { getBackendImgURL } from "../utils/helper";
import { formatDateTimeWithTime } from "../utils/timeUtils";
import { formatPriceWithDollar } from "../utils/formattedFunction";
import { Store } from "lucide-react";
import { Link } from "react-router-dom";
import { memo } from "react";
import Swal from "sweetalert2";
import { orderAPI } from "../services/api";

const OrderCard = memo(({ order, onOrderCancelled }) => {
  const handleCancelOrder = async () => {
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        const response = await orderAPI.cancelOrder(order.orderId);
        if (response.success) {
          await Swal.fire({
            title: "Cancelled!",
            text: "Your order has been cancelled successfully.",
            icon: "success",
            confirmButtonColor: "#3b82f6",
          });
          if (onOrderCancelled) {
            onOrderCancelled();
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to cancel order",
          icon: "error",
          confirmButtonColor: "#3b82f6",
        });
      }
    }
  };

  return (
    <div className="shadow-sm rounded-lg w-full bg-white dark:bg-[#1b1f2b] transition-colors duration-300 mb-4 border border-gray-100 dark:border-gray-700">
      {/* Header: Order ID + Status + Shop */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-gray-200 dark:border-gray-700 gap-2 sm:gap-0">
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <span className="font-semibold text-gray-700 dark:text-gray-200">{`#${order.orderId}`}</span>
          <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">
            |
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <img
              src={getBackendImgURL(order.shop.avatar)}
              alt={order.shop.name}
              className="w-6 h-6 object-cover rounded-full border border-gray-200 dark:border-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {order.shop.name}
            </span>
            <Link to={`/shop/${order.shop.slug}`}>
              <button className="flex items-center cursor-pointer gap-1 text-xs text-blue-600 dark:text-blue-400 px-2 py-1 border border-blue-200 dark:border-blue-500 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition">
                <Store className="w-3 h-3" /> View shop
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-2 sm:mt-0">
          <OrderStatus status={order.orderStatus} />
        </div>
      </div>

      {/* Order Date */}
      <div className="px-4 pt-4 text-xs sm:text-sm text-gray-500">
        {formatDateTimeWithTime(order.createdAt)}
      </div>

      {/* Products List */}
      <div className="px-4 py-2 flex flex-col gap-3">
        {order.products.map((item) => {
          const variant = item.product.variants.find(
            (v) => v._id === item.variant
          );
          return (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getBackendImgURL(variant.image)}
                  alt={variant.name}
                  className="w-16 h-16 object-contain border border-gray-200 dark:border-gray-700 rounded"
                  loading="lazy"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-700 dark:text-gray-200">
                    {item.product.name}
                  </span>
                  <span className="text-sm text-gray-500">{variant.name}</span>
                  <span className="text-sm text-gray-500">{`x${item.quantity}`}</span>
                </div>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {formatPriceWithDollar(variant.price)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer: Total + Actions */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <div className="text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <span>Total:</span>
          <span className="text-orange-500 font-semibold text-lg">
            {formatPriceWithDollar(order.total)}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to={`/order/${order.orderId}`}>
            <button className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-500 transition w-full sm:w-auto text-sm">
              View Details
            </button>
          </Link>
          {order.orderStatus === "Pending" && (
            <button
              onClick={handleCancelOrder}
              className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded hover:bg-red-400 transition w-full sm:w-auto text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
export default OrderCard;
