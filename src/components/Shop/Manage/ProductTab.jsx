import { Route, Routes } from "react-router-dom";
import AddEditProductTab from "./Product/AddEditProductTab";
import ProductList from "./Product/ProductList";

function ProductTab({ shop }) {
  return (
    <Routes>
      <Route path="/" element={<ProductList shop={shop} />} />
      <Route path="add" element={<AddEditProductTab shop={shop} />} />
      <Route path="edit/:id" element={<AddEditProductTab shop={shop} />} />
    </Routes>
  );
}

export default ProductTab;
