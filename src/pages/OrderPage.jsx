import OrderStatus from "../components/OrderStatus";
import { useEffect, useState, useMemo } from "react";
import { orderAPI } from "../services/api";
import SpinnerLoading from "../components/SpinnerLoading";
import OrderCard from "../components/OrderCard";

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
    <div className="pt-6 px-2 min-h-screen dark:bg-[#0f172a] transition-colors duration-300">
      <div className="max-w-[76rem] mx-auto flex flex-col gap-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold">Order History</h1>
          <p className="text-base text-gray-500">
            View and manage all your orders in one place.
          </p>
        </div>

        {/* Status Filter */}
        <div className="rounded-lg bg-white dark:bg-[#1b1f2b] p-4 space-y-3 border border-gray-100 dark:border-gray-700">
          <h1 className="text-lg font-semibold">Order Status</h1>
          <div className="flex gap-2 items-center flex-wrap">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`
                  px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition
                  ${
                    activeStatus === status
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <SpinnerLoading />
          ) : filteredOrders.length === 0 ? (
            <div className="shadow-sm flex flex-col items-center justify-center gap-2 rounded-lg w-full bg-white dark:bg-[#1b1f2b] transition-colors duration-300 mb-4 border border-gray-100 dark:border-gray-700 min-h-92">
              <img
                src="/checklist-1.png"
                className="h-32 w-32 object-contain"
              />
              <span>You don’t have any orders yet</span>
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
