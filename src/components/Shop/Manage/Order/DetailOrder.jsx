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
    if (updating) return; // tránh bấm nhiều lần
    setUpdating(true);
    try {
      const response = await orderAPI.updateOrderStatus(order.orderId, status);
      if (response.success) {
        setOrder(response.data);
        // delay nhẹ cho smooth transition
        setTimeout(() => navigate(-1), 300);
      }
    } catch (error) {
      console.error(`Failed to update order to ${status}:`, error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10 space-y-6">
      {/* --- Header --- */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Order #{order.orderId}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Order Date: {formatDateTimeWithTime(order.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Status:</span>
          <OrderStatus status={order.orderStatus} />
        </div>
      </div>

      {/* --- Customer Info --- */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Customer Information
        </h2>
        <div className="flex flex-col gap-y-2 text-gray-700">
          <p>
            <strong>Name:</strong>{" "}
            {`${order.shipping.firstName} ${order.shipping.lastName}`}
          </p>
          <p>
            <strong>Phone:</strong> {order.shipping.phoneNumber}
          </p>
          <p>
            <strong>Email:</strong> {order.orderBy.email}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {`${order.shipping.address}, ${order.shipping.city}, ${order.shipping.country}`}
          </p>
        </div>
      </div>

      {/* --- Products --- */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Products</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left border">Image</th>
                <th className="p-3 text-left border">Product Name</th>
                <th className="p-3 text-center border">Quantity</th>
                <th className="p-3 text-right border">Price</th>
                <th className="p-3 text-right border">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, idx) => {
                const variant = item.product.variants.find(
                  (v) => v._id === item.variant
                );
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border p-2">
                      <img
                        src={getBackendImgURL(variant.image)}
                        alt={variant.name}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                    </td>
                    <td className="border p-2">{variant.name}</td>
                    <td className="border text-center p-2">{item.quantity}</td>
                    <td className="border text-right p-2">
                      {formatPriceWithDollar(variant.price)}
                    </td>
                    <td className="border text-right p-2">
                      {formatPriceWithDollar(variant.price * item.quantity)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Total --- */}
      <div className="text-right text-lg font-semibold text-gray-800">
        Total:{" "}
        <span className="text-green-600">
          {formatPriceWithDollar(order.total)}
        </span>
      </div>

      <div className="text-right space-x-2">
        {order.orderStatus === "Pending" && (
          <button
            onClick={() => handleUpdateOrder("Processing")}
            disabled={updating}
            className="flex items-center justify-center cursor-pointer gap-2 bg-green-600 text-white px-5 py-2.5 rounded-md hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updating && <SpinnerLoading className="w-5 h-5" />}
            Confirm Order
          </button>
        )}

        {order.orderStatus === "Processing" && (
          <button
            onClick={() => handleUpdateOrder("Shipping")}
            disabled={updating}
            className="flex items-center justify-center cursor-pointer gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updating && <SpinnerLoading className="w-5 h-5" />}
            Ready to Ship
          </button>
        )}
      </div>
    </div>
  );
}
