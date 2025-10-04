import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Config from "../../envVars";
import ProductTab from "./Manage/ProductTab";
import DashboardTab from "./Manage/DashboardTab";
import CategoryTab from "./Manage/CategoryTab";
import OrderTab from "./Manage/OrderTab";
import { LayoutGrid, Box, Layers, ShoppingBag, ChartNoAxesColumnIncreasing, Settings } from "lucide-react";

export default function ManageTab({ shop, user }) {
  const location = useLocation();
  const isMyShop = shop.owner._id === user?._id;

  // Chuẩn hóa path
  const clean = (p) => p.replace(/\/+$/, "");

  const isCurrentTab = (tabPath) => {
    const base = `/shop/${shop.slug}/manage`;
    const current = clean(location.pathname);

    if (!tabPath) {
      // Dashboard (nếu path là base hoặc base/)
      return current === clean(base);
    }
    return current === clean(`${base}/${tabPath.toLowerCase()}`);
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutGrid, path: "" },
    { label: "Products", icon: Box, path: "products" },
    { label: "Categories", icon: Layers, path: "categories" },
    { label: "Orders", icon: ShoppingBag, path: "orders" },
    { label: "Analytics", icon: ChartNoAxesColumnIncreasing, path: "#" },
    { label: "Settings", icon: Settings, path: "#" },
  ];

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-1/5 hidden lg:block bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-[#2b2b3d] rounded-lg p-4 h-fit">
        <h2 className="text-lg font-semibold mb-3 dark:text-white">Chung</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                to={`/shop/${shop.slug}/manage${
                  item.path ? `/${item.path}` : ""
                }`}
                className={`flex items-center gap-2 cursor-pointer p-2 rounded-md ${
                  isCurrentTab(item.path)
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-200 dark:hover:bg-[#2b2b3d] dark:text-white"
                }`}
              >
                <item.icon className="size-5" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Nội dung */}
      <div className="w-4/5 rounded-md bg-white">
        <Routes>
          <Route path="/" element={<DashboardTab shop={shop} />} />
          <Route path="products/*" element={<ProductTab shop={shop} />} />
          <Route path="orders" element={<OrderTab shop={shop} />} />
          <Route path="categories" element={<CategoryTab shop={shop} />} />
        </Routes>
      </div>
    </div>
  );
}
