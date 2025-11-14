import { Route, Routes } from "react-router-dom";
import OrderList from "./Order/OrderList";
import DetailOrder from "./Order/DetailOrder";

function OrderTab({ shop }) {
  return (
    <Routes>
      <Route path="/" element={<OrderList shop={shop} />} />
      <Route path=":orderId" element={<DetailOrder />} />
    </Routes>
  );
}

export default OrderTab;
