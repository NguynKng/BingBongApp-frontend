import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderAPI } from "../../../../services/api";
import SpinnerLoading from "../../../SpinnerLoading";
import { formatPriceWithDollar } from "../../../../utils/formattedFunction";
import { getBackendImgURL } from "../../../../utils/helper";
import OrderStatus from "../../../OrderStatus";
import { formatDateTimeWithTime } from "../../../../utils/timeUtils";

export default function DetailOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await orderAPI.getOrderById(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <SpinnerLoading />;
  if (!order)
    return <div className="p-6 text-red-500 text-center">Order not found</div>;

  const handleUpdateOrder = async (status) => {
    if (updating) return;
    setUpdating(true);
    try {
      const response = await orderAPI.updateOrderStatus(order.orderId, status);
      if (response.success) {
        setOrder(response.data);
        setTimeout(() => navigate(-1), 300);
      }
    } catch (error) {
      console.error(`Failed to update order to ${status}:`, error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order #{order.orderId}</h1>
            <p className="text-sm text-gray-500 mt-1">{formatDateTimeWithTime(order.createdAt)}</p>
          </div>
          <OrderStatus status={order.orderStatus} />
        </div>

        {/* Customer Info */}
        <div className="border-t pt-4 space-y-2">
          <h2 className="font-semibold text-gray-700 mb-3">Customer Information</h2>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <p><span className="font-medium">Name:</span> {order.shipping.firstName} {order.shipping.lastName}</p>
            <p><span className="font-medium">Phone:</span> {order.shipping.phoneNumber}</p>
            <p><span className="font-medium">Email:</span> {order.orderBy.email}</p>
            <p><span className="font-medium">Address:</span> {order.shipping.address}, {order.shipping.city}, {order.shipping.country}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.products.map((item, idx) => {
            const variant = item.product.variants.find((v) => v._id === item.variant);
            return (
              <div key={idx} className="flex items-center gap-4 border-b pb-3 last:border-b-0">
                <img
                  src={getBackendImgURL(variant.image)}
                  alt={variant.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{variant.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPriceWithDollar(variant.price)}</p>
                </div>
                <p className="font-semibold text-gray-800">
                  {formatPriceWithDollar(variant.price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="border-t mt-4 pt-4 flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-green-600">
            {formatPriceWithDollar(order.total)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {order.orderStatus === "Pending" && (
          <button
            onClick={() => handleUpdateOrder("Processing")}
            disabled={updating}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {updating && <SpinnerLoading className="w-5 h-5" />}
            Confirm Order
          </button>
        )}

        {order.orderStatus === "Processing" && (
          <button
            onClick={() => handleUpdateOrder("Shipping")}
            disabled={updating}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {updating && <SpinnerLoading className="w-5 h-5" />}
            Ready to Ship
          </button>
        )}
      </div>
    </div>
  );
}