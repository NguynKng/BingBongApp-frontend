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
    mainCategory: shop?.mainCategory || "Other",
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
        toast.success("Shop information updated successfully!");
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update shop information"
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
            🏪 Edit Shop Information
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scroll p-2">
          {/* About */}
          <TextareaField
            label="About"
            value={formData.about}
            onChange={(e) => handleChange("about", e.target.value)}
            placeholder="Brief description about the shop..."
          />

          {/* Address & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField
              label="Address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            <InputField
              label="Phone"
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
            label="Google Maps Link"
            value={formData.mapURL}
            onChange={(e) => handleChange("mapURL", e.target.value)}
            placeholder="Paste iframe or share link of the map..."
          />

          {/* Open/Close Time */}
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Opening Time"
              type="time"
              value={formData.openTime}
              onChange={(e) => handleChange("openTime", e.target.value)}
            />
            <InputField
              label="Closing Time"
              type="time"
              value={formData.closeTime}
              onChange={(e) => handleChange("closeTime", e.target.value)}
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Main Category"
              value={formData.mainCategory}
              onChange={(e) => handleChange("mainCategory", e.target.value)}
              placeholder="E.g.: Fashion, Food..."
            />
            <SelectField
              label="Operating Status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              options={[
                { value: "open", label: "Open" },
                { value: "closed", label: "Closed" },
                { value: "maintenance", label: "Maintenance" },
              ]}
            />
          </div>

          {/* Social Media */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Social Media
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
            Cancel
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
            {loading ? "Saving..." : "Save Changes"}
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
  isShopOwner: PropTypes.bool,
};

export default EditShopInfoModal;
