import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Config from "../../envVars";
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
  Menu,
  X,
} from "lucide-react";

export default function ManageTab({ shop }) {
  const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false);

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
    { label: "Analytics", icon: ChartNoAxesColumnIncreasing, path: "#" },
    { label: "Settings", icon: Settings, path: "#" },
  ];

  return (
    <div className={`flex lg:flex-row flex-col gap-2 relative`}>
      {/* Nút mở sidebar (chỉ hiện trên mobile) */}
      <button
        className="lg:hidden flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-md w-fit"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        {openSidebar ? <X className="size-5" /> : <Menu className="size-5" />}
        <span>{openSidebar ? "Close Menu" : "Open Menu"}</span>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          bg-white dark:bg-[#1e1e2f] border border-gray-200 lg:sticky top-[8.5vh]  lg:mr-4 dark:border-[#2b2b3d]
          rounded-lg p-4 transition-all duration-300 ease-in-out
          ${openSidebar ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
          overflow-hidden lg:opacity-100 lg:max-h-fit lg:w-1/5 lg:block
        `}
      >
        <h2 className="text-lg font-semibold mb-3 dark:text-white">Chung</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                to={`/shop/${shop.slug}/manage${
                  item.path ? `/${item.path}` : ""
                }`}
                className={`flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors ${
                  isCurrentTab(item.path)
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-200 dark:hover:bg-[#2b2b3d] dark:text-white"
                }`}
                onClick={() => setOpenSidebar(false)} // đóng sidebar khi chọn menu
              >
                <item.icon className="size-5" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Nội dung */}
      <div className="lg:w-4/5 w-full rounded-md bg-white shadow-sm">
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
