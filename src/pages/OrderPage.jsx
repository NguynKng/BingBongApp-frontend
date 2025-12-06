import OrderStatus from "../components/OrderStatus";
import { useEffect, useState, useMemo } from "react";
import { orderAPI } from "../services/api";
import SpinnerLoading from "../components/SpinnerLoading";
import OrderCard from "../components/OrderCard";
import { Package } from "lucide-react";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("All");

  const statuses = [
    "All",
    "Pending",
    "Processing",
    "Shipping",
    "Completed",
    "Cancelled",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getUserOrders();
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ✔️ Lọc theo trạng thái
  const filteredOrders = useMemo(() => {
    if (activeStatus === "All") return orders;
    return orders.filter((order) => order.orderStatus === activeStatus);
  }, [orders, activeStatus]);

  return (
    <div className="pt-6 px-2 min-h-screen transition-colors duration-300">
      <div className="max-w-[76rem] mx-auto flex flex-col gap-4">
        {/* Title */}
        <div className="bg-white dark:bg-[#1b1f2b] p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Order History
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
            View and manage all your orders in one place.
          </p>
        </div>

        {/* Status Filter */}
        <div className="rounded-lg bg-white dark:bg-[#1b1f2b] p-4 space-y-3 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order Status
          </h2>
          <div className="flex gap-2 items-center flex-wrap">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`
                  px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all duration-200
                  ${
                    activeStatus === status
                      ? "bg-blue-600 dark:bg-purple-600 text-white border-blue-600 dark:border-purple-600 shadow-md hover:bg-blue-700 dark:hover:bg-purple-700"
                      : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-[#2a3142] hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-purple-400"
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="flex flex-col gap-2">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <SpinnerLoading />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="shadow-sm flex flex-col items-center justify-center gap-4 rounded-lg w-full bg-white dark:bg-[#1b1f2b] transition-colors duration-300 mb-4 border border-gray-200 dark:border-gray-700 py-16">
              {/* Icon Background */}
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                <Package className="w-12 h-12 text-gray-400 dark:text-gray-600" />
              </div>
              
              {/* Empty State Text */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  No Orders Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {"You don't have any orders yet."}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Start shopping to see your orders here!
                </p>
              </div>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}