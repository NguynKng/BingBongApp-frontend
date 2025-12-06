import { Routes, Route, Link, useLocation } from "react-router-dom";
import ProductTab from "./Manage/ProductTab";
import DashboardTab from "./Manage/DashboardTab";
import CategoryTab from "./Manage/CategoryTab";
import OrderTab from "./Manage/OrderTab";
import {
  LayoutGrid,
  Box,
  Layers,
  ShoppingBag,
  ChartNoAxesColumnIncreasing,
  Settings,
} from "lucide-react";
import useAuthStore from "../../store/authStore";

export default function ManageTab({ shop }) {
  const { user } = useAuthStore();
  const location = useLocation();

  const clean = (p) => p.replace(/\/+$/, "");
  const isCurrentTab = (tabPath) => {
    const base = `/shop/${shop.slug}/manage`;
    const current = clean(location.pathname);
    if (!tabPath) return current === clean(base);
    return current === clean(`${base}/${tabPath.toLowerCase()}`);
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutGrid, path: "" },
    { label: "Products", icon: Box, path: "products" },
    { label: "Categories", icon: Layers, path: "categories" },
    { label: "Orders", icon: ShoppingBag, path: "orders" },
    { label: "Settings", icon: Settings, path: "#" },
  ];
  
  return (
    <div className="flex flex-col gap-4">
      {/* 🔹 Top Navbar luôn hiển thị */}
      <div className="bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-[#2b2b3d] rounded-lg p-3 shadow-sm">
        <nav className="flex flex-wrap items-center gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={`/shop/${shop.slug}/manage${
                item.path ? `/${item.path}` : ""
              }`}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  isCurrentTab(item.path)
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-[#2b2b3d] dark:text-white text-gray-700"
                }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 🔹 Nội dung */}
      <div className="bg-white dark:bg-[#1e1e2f] rounded-lg shadow-sm p-4">
        <Routes>
          <Route path="/" element={<DashboardTab shop={shop} />} />
          <Route path="products/*" element={<ProductTab shop={shop} />} />
          <Route path="orders/*" element={<OrderTab shop={shop} />} />
          <Route path="categories/*" element={<CategoryTab shop={shop} />} />
        </Routes>
      </div>
    </div>
  );
}
