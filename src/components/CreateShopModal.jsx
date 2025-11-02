import { useState } from "react";
import { X, Plus } from "lucide-react";
import PropTypes from "prop-types";
import { shopAPI } from "../services/api";
import SpinnerLoading from "./SpinnerLoading";
import { useNavigate } from "react-router-dom";

const CreateShopModal = ({ onClose, onCreated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: {
      about: "",
      address: "",
      phone: "",
      email: "",
      website: "",
    },
    categories: [],
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddCategory = () => {
    if (categoryInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, { name: categoryInput.trim() }],
      }));
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (i) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, idx) => idx !== i),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await shopAPI.createShop(formData);
      if (res.success) {
        onCreated?.(res.data);
        onClose();
        navigate(`/shop/${res.data.slug}`);
      }
    } catch (err) {
      setError(err.message || "Tạo shop thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-7">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-center mb-5 text-gray-800 dark:text-gray-100">
          Tạo cửa hàng mới
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên cửa hàng */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Tên cửa hàng
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="Nhập tên cửa hàng..."
              required
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Giới thiệu
            </label>
            <textarea
              rows="3"
              value={formData.description.about}
              onChange={(e) =>
                handleChange("description.about", e.target.value)
              }
              placeholder="Giới thiệu ngắn gọn về cửa hàng của bạn..."
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-400 outline-none transition resize-none"
            />
          </div>

          {/* Thông tin liên hệ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Địa chỉ"
              value={formData.description.address}
              onChange={(e) =>
                handleChange("description.address", e.target.value)
              }
              className="p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={formData.description.phone}
              onChange={(e) =>
                handleChange("description.phone", e.target.value)
              }
              className="p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.description.email}
              onChange={(e) =>
                handleChange("description.email", e.target.value)
              }
              className="p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="text"
              placeholder="Website"
              value={formData.description.website}
              onChange={(e) =>
                handleChange("description.website", e.target.value)
              }
              className="p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Danh mục sản phẩm
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập danh mục..."
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="flex-1 p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-lg transition flex items-center justify-center"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Hiển thị danh mục */}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.categories.map((cat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 dark:bg-zinc-700 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-1"
                >
                  {cat.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(i)}
                    className="hover:text-red-500 text-gray-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-60"
          >
            {loading ? <SpinnerLoading size="sm" /> : "Tạo cửa hàng"}
          </button>
        </form>
      </div>
    </div>
  );
};

CreateShopModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func,
};

export default CreateShopModal;
