import { X } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { shopAPI } from "../services/api";
import { toast } from "react-hot-toast";

const EditShopInfoModal = ({ shop, onClose, isShopOwner }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    about: shop?.description?.about || "",
    address: shop?.description?.address || "",
    phone: shop?.description?.phone || "",
    email: shop?.description?.email || "",
    website: shop?.description?.website || "",
    openTime: shop?.openTime || "08:00",
    closeTime: shop?.closeTime || "21:00",
    mainCategory: shop?.mainCategory || "Khác",
    status: shop?.status || "open",
    mapURL: shop?.mapURL || "",
    socials: {
      facebook: shop?.socials?.facebook || "",
      instagram: shop?.socials?.instagram || "",
      youtube: shop?.socials?.youtube || "",
      tiktok: shop?.socials?.tiktok || "",
    },
  });

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSocialChange = (platform, value) =>
    setFormData((prev) => ({
      ...prev,
      socials: { ...prev.socials, [platform]: value },
    }));

  const handleSave = async () => {
    const updatedShop = {
      description: {
        about: formData.about,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
      },
      openTime: formData.openTime,
      closeTime: formData.closeTime,
      mainCategory: formData.mainCategory,
      socials: formData.socials,
      status: formData.status,
      mapURL: formData.mapURL,
    };

    try {
      setLoading(true);
      const res = await shopAPI.updateShopInfo(shop._id, updatedShop);
      if (res.success) {
        toast.success("Cập nhật thông tin shop thành công!");
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Lỗi khi cập nhật thông tin"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isShopOwner) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-[#1e1e2f] rounded-xl shadow-lg w-full max-w-2xl p-2 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 p-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            🏪 Chỉnh sửa thông tin Shop
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nội dung */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scroll p-2">
          {/* Mô tả */}
          <TextareaField
            label="Giới thiệu"
            value={formData.about}
            onChange={(e) => handleChange("about", e.target.value)}
            placeholder="Mô tả ngắn về cửa hàng..."
          />

          {/* Địa chỉ, liên hệ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField
              label="Địa chỉ"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            <InputField
              label="Số điện thoại"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <InputField
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <InputField
              label="Website"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
            />
          </div>
          <InputField
            label="Link bản đồ Google Maps"
            value={formData.mapURL}
            onChange={(e) => handleChange("mapURL", e.target.value)}
            placeholder="Dán link iframe hoặc link chia sẻ bản đồ..."
          />
          {/* Giờ mở cửa - đóng cửa */}
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Giờ mở cửa"
              type="time"
              value={formData.openTime}
              onChange={(e) => handleChange("openTime", e.target.value)}
            />
            <InputField
              label="Giờ đóng cửa"
              type="time"
              value={formData.closeTime}
              onChange={(e) => handleChange("closeTime", e.target.value)}
            />
          </div>

          {/* Danh mục và trạng thái */}
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Danh mục chính"
              value={formData.mainCategory}
              onChange={(e) => handleChange("mainCategory", e.target.value)}
              placeholder="Ví dụ: Thời trang, Ẩm thực..."
            />
            <SelectField
              label="Trạng thái hoạt động"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              options={[
                { value: "open", label: "Đang mở cửa" },
                { value: "closed", label: "Đang đóng cửa" },
                { value: "maintenance", label: "Đang bảo trì" },
              ]}
            />
          </div>

          {/* Mạng xã hội */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Mạng xã hội
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField
                label="Facebook"
                value={formData.socials.facebook}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
              />
              <InputField
                label="Instagram"
                value={formData.socials.instagram}
                onChange={(e) =>
                  handleSocialChange("instagram", e.target.value)
                }
              />
              <InputField
                label="YouTube"
                value={formData.socials.youtube}
                onChange={(e) => handleSocialChange("youtube", e.target.value)}
              />
              <InputField
                label="TikTok"
                value={formData.socials.tiktok}
                onChange={(e) => handleSocialChange("tiktok", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 dark:border-[#2b2b3d] pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-[#2b2b3d] text-gray-700 dark:text-gray-300"
          >
            Hủy
          </button>
          <button
            disabled={loading}
            onClick={handleSave}
            className={`px-4 py-2 rounded-md text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 🔹 Subcomponents
const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] 
      bg-gray-50 dark:bg-[#23233b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const TextareaField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      rows="2"
      placeholder={placeholder}
      className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] 
      bg-gray-50 dark:bg-[#23233b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] 
      bg-gray-50 dark:bg-[#23233b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

EditShopInfoModal.propTypes = {
  shop: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onUpdated: PropTypes.func.isRequired,
  isShopOwner: PropTypes.bool,
};

export default EditShopInfoModal;
