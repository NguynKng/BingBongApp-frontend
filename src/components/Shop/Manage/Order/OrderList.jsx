import { ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { orderAPI } from "../../../../services/api";
import { formatPriceWithDollar } from "../../../../utils/formattedFunction";
import { formatDateTimeWithTime } from "../../../../utils/timeUtils";
import OrderStatus from "../../../OrderStatus";
import SpinnerLoading from "../../../SpinnerLoading";

export default function OrderList({ shop }) {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("default");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!shop?._id) return;
      setLoading(true);
      try {
        const response = await orderAPI.getShopOrders(shop._id);
        setOrders(response.data || []);
      } catch (error) {
        toast.error(error.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [shop]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (query) {
      filtered = filtered.filter(
        (order) =>
          order.orderId?.toLowerCase().includes(query.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (statusFilter !== "default") {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter);
    }
    return filtered;
  }, [orders, query, statusFilter]);

  // Status counts
  const statusCounts = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc.Pending += order.orderStatus === "Pending" ? 1 : 0;
        acc.Processing += order.orderStatus === "Processing" ? 1 : 0;
        acc.Shipping += order.orderStatus === "Shipping" ? 1 : 0;
        acc.Completed += order.orderStatus === "Completed" ? 1 : 0;
        acc.Cancelled += order.orderStatus === "Cancelled" ? 1 : 0;
        return acc;
      },
      { Pending: 0, Processing: 0, Shipping: 0, Completed: 0, Cancelled: 0 }
    );
  }, [orders]);

  // Table configuration
  const columns = [
    { title: "No.", dataIndex: "no", key: "no", align: "center", width: 60 },
    { title: "Order ID", dataIndex: "orderId", key: "orderId", align: "center" },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (value) => formatPriceWithDollar(value),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      align: "center",
      render: (status) => (
        <div className="flex items-center justify-center">
          <OrderStatus status={status} />
        </div>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date) => formatDateTimeWithTime(date),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Link
          to={`/shop/${shop.slug}/manage/orders/${record.orderId}`}
          className="px-3 py-1 rounded-md bg-blue-900 text-white hover:bg-blue-800 transition"
        >
          View Details
        </Link>
      ),
    },
  ];

  const dataSource = filteredOrders.map((order, idx) => ({
    key: order._id,
    no: idx + 1,
    orderId: order.orderId,
    total: order.total,
    orderStatus: order.orderStatus,
    createdAt: order.createdAt,
  }));

  if (loading) {
    return (
        <SpinnerLoading />
    )
  }

  return (
    <div className="lg:p-4 p-1 space-y-6">
      {/* Dashboard summary */}
      <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-6 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100">
          <span className="text-2xl font-bold">{orders.length}</span>
          <span className="text-sm text-gray-700">Total</span>
        </div>

        {[
          { label: "Pending", value: statusCounts.Pending, bg: "bg-yellow-100", text: "text-yellow-800" },
          { label: "Processing", value: statusCounts.Processing, bg: "bg-blue-100", text: "text-blue-800" },
          { label: "Shipping", value: statusCounts.Shipping, bg: "bg-purple-100", text: "text-purple-800" },
          { label: "Completed", value: statusCounts.Completed, bg: "bg-green-100", text: "text-green-800" },
          { label: "Cancelled", value: statusCounts.Cancelled, bg: "bg-red-100", text: "text-red-800" },
        ].map((item, index) => (
          <div key={index} className={`flex flex-col items-center justify-center p-4 rounded-lg ${item.bg}`}>
            <span className={`text-2xl font-bold ${item.text}`}>{item.value}</span>
            <span className="text-sm text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Header + search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Order List</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            className="flex-1 sm:flex-none rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="size-5 text-gray-600" />
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-52 border-2 border-gray-200 rounded-md">
          <select
            className="w-full px-4 py-2 appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="default">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipping">Shipping</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>
        </div>
        <span className="text-gray-700">
          Showing: <strong>{filteredOrders.length}</strong> orders
        </span>
      </div>

      {/* Orders table */}
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: "max-content" }}
        className="mt-4"
      />
    </div>
  );
}
