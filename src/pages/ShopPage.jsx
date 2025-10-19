import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, useParams, Link } from "react-router-dom";
import { shopAPI } from "../services/api";
import useAuthStore from "../store/authStore";
import { ChevronDown } from "lucide-react";
import Config from "../envVars";
import PostTab from "../components/Shop/PostTab";
import ProductTab from "../components/Shop/ProductTab";
import AboutTab from "../components/Shop/AboutTab";
import PhotoTab from "../components/Shop/PhotoTab";
import ManageTab from "../components/Shop/ManageTab";
import DetailProductTab from "../components/DetailProductTab";
import { toast } from "react-hot-toast";
import { userAPI } from "../services/api";
import { getBackendImgURL } from "../utils/helper";

export default function ShopPage() {
  const [isUploading, setIsUploading] = useState({
    avatar: false,
    coverPhoto: false,
  });
  const { shopSlug } = useParams();
  const avatarInputRef = useRef(null);
  const coverPhotoInputRef = useRef(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const location = useLocation();
  const clean = (p) => p.replace(/\/+$/, "");
  const isCurrentTab = (tabPath) =>
    clean(location.pathname) ===
    clean(`/shop/${shopSlug}${tabPath ? `/${tabPath.toLowerCase()}` : ""}`);
  const isMyShop = user && shop && user._id === shop.owner._id;
  const tabs = [
    { name: "Bài viết", path: "" },
    { name: "Sản phẩm", path: "product" },
    { name: "Giới thiệu", path: "about" },
    { name: "Ảnh", path: "photos" },
    ...(isMyShop ? [{ name: "Quản lý", path: "manage" }] : []),
  ];

  useEffect(() => {
    const fetchShop = async () => {
      setLoading(true);
      try {
        const res = await shopAPI.getShopBySlug(shopSlug);
        if (res.success) setShop(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [shopSlug]);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading((prev) => ({ ...prev, avatar: true }));
      const response = await userAPI.uploadAvatar(file, "Shop", shop._id);
      setShop((prev) => ({ ...prev, avatar: response.data }));
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Avatar upload error:", error);
    } finally {
      setIsUploading((prev) => ({ ...prev, avatar: false }));
    }
  };

  const handleCoverPhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading((prev) => ({ ...prev, coverPhoto: true }));
      const response = await userAPI.uploadCoverPhoto(file, "Shop", shop._id);
      setShop((prev) => ({ ...prev, coverPhoto: response.data }));
      toast.success("Cover photo updated successfully");
    } catch (error) {
      console.error("Cover photo upload error:", error);
    } finally {
      setIsUploading((prev) => ({ ...prev, coverPhoto: false }));
    }
  };

  if (loading) return <div className="p-10 text-center">Đang tải shop...</div>;

  if (!shop) return <div className="p-10 text-center">Không tìm thấy shop</div>;

  return (
    <>
      <div className="lg:px-[15%] bg-gray-100 dark:bg-[#181826]">
        <div className="relative w-full">
          <div className="relative w-full lg:h-[24rem] md:h-[22rem] sm:h-[20rem] h-[18rem] rounded-b-md">
            <img
              src={getBackendImgURL(shop.coverPhoto)}
              className="size-full lg:rounded-b-md object-cover"
              alt="Cover photo"
              loading="lazy"
            />
            {isMyShop && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={coverPhotoInputRef}
                  onChange={handleCoverPhotoUpload}
                />
                <div
                  className="absolute bottom-4 right-4 z-31 flex items-center gap-2 bg-white hover:bg-gray-300 cursor-pointer rounded-md py-2 px-4 text-black font-medium"
                  onClick={() => coverPhotoInputRef.current.click()}
                >
                  <img src="/camera.png" className="size-4 object-cover" />
                  <span className="lg:inline hidden">
                    {isUploading.coverPhoto ? "Uploading..." : "Thay ảnh bìa"}
                  </span>
                </div>
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/50 to-transparent h-[30%] rounded-md"></div>
              </>
            )}
            <div className="absolute bottom-0 lg:translate-y-1/2 translate-y-1/5 lg:left-10 left-4 bg-gray-200 dark:bg-[#23233b] hover:bg-gray-300 dark:hover:bg-[#23233b] rounded-full z-10 w-46 h-46 flex border-4 border-white items-center justify-center">
              <img
                src={Config.BACKEND_URL + shop.avatar}
                className="size-full rounded-full object-cover cursor-pointer hover:opacity-70"
                alt="Avatar"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={avatarInputRef}
                onChange={handleAvatarUpload}
              />
              {isMyShop && (
                <div
                  className="absolute bottom-4 right-0 p-2 size-9 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  onClick={() => avatarInputRef.current.click()}
                >
                  {isUploading.avatar ? (
                    <div className="size-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <img src="/camera.png" className="size-full object-cover" />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <div className="relative w-full">
              <div className="lg:px-8 px-4">
                <div className="flex lg:flex-row flex-col lg:justify-between justify-center lg:items-end items-start border-b-2 border-gray-200 dark:border-[#2b2b3d] lg:pb-4 pb-1 lg:pl-[13rem] lg:pt-4 pt-10">
                  <div className="flex lg:flex-row flex-col gap-2 justify-center items-center self-start">
                    <div className="flex flex-col justify-center items-start self-end">
                      <h1 className="text-3xl font-bold not-[]:rounded dark:text-white">
                        {shop.name || "Loading..."}
                      </h1>
                      <p className="text-gray-500 dark:text-gray-400 rounded">{`${
                        shop.followers.length || 0
                      } người theo dõi`}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end items-end py-4 z-30">
                    <div className="flex gap-2 items-center"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap py-1">
                    {tabs.map((tab, index) => (
                      <Link
                        to={`/shop/${shopSlug}/${tab.path}`}
                        key={index}
                        className={`cursor-pointer border-b-4 font-medium py-1 px-2 lg:py-3 lg:px-4 ${
                          isCurrentTab(tab.path)
                            ? "border-blue-500 text-blue-500 bg-transparent"
                            : "border-transparent text-gray-500 hover:bg-gray-200 rounded-md"
                        }`}
                      >
                        {tab.name}
                      </Link>
                    ))}
                    <div className="flex gap-2 items-center justify-center hover:bg-gray-200 cursor-pointer rounded-md py-1 px-2 lg:py-3 lg:px-4 text-gray-500 font-medium">
                      <span>Xem thêm</span>
                      <ChevronDown className="size-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="bg-gray-200 dark:bg-[#181826] lg:px-[14%] px-2 py-4 min-h-screen">
        <Routes>
          <Route path="/" element={<PostTab shop={shop} />} />
          <Route path="product" element={<ProductTab shop={shop} />} />
          <Route
            path="product/category/:category"
            element={<ProductTab shop={shop} />}
          />
          <Route
            path="product/detail/:slug"
            element={<DetailProductTab shop={shop} />}
          />
          <Route path="about" element={<AboutTab shop={shop} />} />
          <Route path="photos" element={<PhotoTab shop={shop} />} />
          {isMyShop && (
            <Route path="manage/*" element={<ManageTab shop={shop} />} />
          )}
        </Routes>
      </section>
    </>
  );
}
