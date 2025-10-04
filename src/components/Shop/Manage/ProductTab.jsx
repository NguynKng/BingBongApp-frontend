import { ChevronDown, Search } from "lucide-react";
import { Link, Route, Routes } from "react-router-dom";
import { Table } from "antd";
import { useEffect, useState } from "react";
import Config from "../../../envVars";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import AddEditProductTab from "./Product/AddEditProductTab";
import ProductList from "./Product/ProductList";

function ProductTab({shop}) {
  return (
    <Routes>
      <Route path="/" element={<ProductList shop={shop} />} />
      <Route path="add" element={<AddEditProductTab shop={shop} />} />
      <Route path="edit/:id" element={<AddEditProductTab shop={shop} />} />
    </Routes>
  );
}

export default ProductTab;
