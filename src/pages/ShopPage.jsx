import { useEffect, useState } from "react";
import { shopAPI } from "../services/api";
import ShopCard from "../components/ShopCard";
import CreateShopModal from "../components/CreateShopModal";
import { Plus, Search } from "lucide-react";

export default function ShopPage() {
  const [shops, setShops] = useState([]);
  const [myShops, setMyShops] = useState([]);
  const [followedShops, setFollowedShops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [all, mine, followed] = await Promise.all([
          shopAPI.getAllShops(),
          shopAPI.getMyShops(),
          shopAPI.getFollowedShops(),
        ]);
        setShops(all.data);
        setMyShops(mine.data);
        setFollowedShops(followed.data);
        setFiltered(all.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (activeTab === "all") setFiltered(shops);
    else if (activeTab === "my") setFiltered(myShops);
    else setFiltered(followedShops);
  }, [activeTab, shops, myShops, followedShops]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const source =
      activeTab === "all"
        ? shops
        : activeTab === "my"
        ? myShops
        : followedShops;

    if (!value.trim()) return setFiltered(source);

    const lower = value.toLowerCase();
    setFiltered(
      source.filter(
        (shop) =>
          shop.name.toLowerCase().includes(lower) ||
          shop.description?.toLowerCase().includes(lower) ||
          shop.address?.toLowerCase().includes(lower)
      )
    );
  };

  const handleShopCreated = (newShop) => {
    setMyShops((prev) => [...prev, newShop]);
    if (activeTab === "my") setFiltered((prev) => [...prev, newShop]);
  };

  return (
    <div className="flex flex-col gap-6 px-2 lg:px-8 lg:w-[90%] mx-auto py-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-[#2b2b3d] rounded-lg p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "all", label: "All Shops" },
            { key: "my", label: "My Shops" },
            { key: "followed", label: "Followed Shops" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-md font-medium ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-[#2b2b3d] text-gray-700 dark:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <input
            type="text"
            placeholder="Search shops..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-gray-50 dark:bg-[#2b2b3d] border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
        >
          <Plus className="size-4" /> Create Shop
        </button>
      </div>

      {/* List */}
      <div>
        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Loading shops...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No shops found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateShopModal
          onClose={() => setShowModal(false)}
          onCreated={handleShopCreated}
        />
      )}
    </div>
  );
}
