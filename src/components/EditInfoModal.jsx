import { X } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { userAPI } from "../services/api";
import { toast } from "react-hot-toast";

const EditInfoModal = ({ user, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [showEdu, setShowEdu] = useState(!!user?.education?.school);
  const [showWork, setShowWork] = useState(!!user?.work?.company);
  const [showSocial, setShowSocial] = useState(
    Array.isArray(user?.socialLinks) && user.socialLinks.length > 0
  );

  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    address: user?.address || "",
    website: user?.website || "",
    phoneNumber: user?.phoneNumber || "",
    education: user?.education || {},
    work: user?.work || {},
    socialLinks: user?.socialLinks || [],
  });

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleNestedChange = (section, key, value) =>
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));

  const handleSocialChange = (index, key, value) => {
    const updated = [...formData.socialLinks];
    updated[index][key] = value;
    setFormData((prev) => ({ ...prev, socialLinks: updated }));
  };

  const addSocialLink = () => {
    setShowSocial(true);
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };

  const removeSocialLink = (index) => {
    const updated = formData.socialLinks.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, socialLinks: updated }));
    if (updated.length === 0) setShowSocial(false);
  };

  const handleSave = async () => {
    const updatedUser = {
      bio: formData.bio,
      address: formData.address,
      website: formData.website,
      education: showEdu ? formData.education : {},
      work: showWork ? formData.work : {},
      socialLinks: showSocial ? formData.socialLinks : [],
    };

    try {
      setLoading(true);
      const res = await userAPI.updateUserInfo(user._id, updatedUser);
      toast.success("Cập nhật thông tin thành công!");
      onUpdated(res.data);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-[#1e1e2f] rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Chỉnh sửa thông tin
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Tiểu sử */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tiểu sử
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#23233b] text-gray-900 dark:text-white"
              rows="2"
              placeholder="Giới thiệu ngắn gọn về bạn..."
            />
          </div>

          {/* Địa chỉ & website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Địa chỉ
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#23233b]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Website
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#23233b]"
              />
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Học vấn
            </h3>
            {!showEdu ? (
              <button
                onClick={() => setShowEdu(true)}
                className="text-sm text-blue-500 hover:underline"
              >
                + Thêm học vấn
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.education.school || ""}
                  onChange={(e) =>
                    handleNestedChange("education", "school", e.target.value)
                  }
                  placeholder="Trường học"
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#23233b]"
                />
                <input
                  type="text"
                  value={formData.education.major || ""}
                  onChange={(e) =>
                    handleNestedChange("education", "major", e.target.value)
                  }
                  placeholder="Ngành học"
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#23233b]"
                />
                <input
                  type="text"
                  value={formData.education.year || ""}
                  onChange={(e) =>
                    handleNestedChange("education", "year", e.target.value)
                  }
                  placeholder="Thời gian học (VD: 2019 - 2023)"
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#23233b]"
                />
              </div>
            )}
          </div>

          {/* Work */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Công việc
            </h3>
            {!showWork ? (
              <button
                onClick={() => setShowWork(true)}
                className="text-sm text-blue-500 hover:underline"
              >
                + Thêm công việc
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.work.company || ""}
                  onChange={(e) =>
                    handleNestedChange("work", "company", e.target.value)
                  }
                  placeholder="Công ty"
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#23233b]"
                />
                <input
                  type="text"
                  value={formData.work.position || ""}
                  onChange={(e) =>
                    handleNestedChange("work", "position", e.target.value)
                  }
                  placeholder="Vị trí"
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#23233b]"
                />
                <input
                  type="text"
                  value={formData.work.duration || ""}
                  onChange={(e) =>
                    handleNestedChange("work", "duration", e.target.value)
                  }
                  placeholder="Thời gian làm việc (VD: 2021 - nay)"
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#23233b]"
                />
              </div>
            )}
          </div>

          {/* Social links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Mạng xã hội
            </h3>
            {!showSocial ? (
              <button
                onClick={addSocialLink}
                className="text-sm text-blue-500 hover:underline"
              >
                + Thêm liên kết
              </button>
            ) : (
              <>
                {formData.socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={link.platform}
                      onChange={(e) =>
                        handleSocialChange(index, "platform", e.target.value)
                      }
                      placeholder="Nền tảng (Facebook, Instagram...)"
                      className="flex-1 p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#23233b]"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) =>
                        handleSocialChange(index, "url", e.target.value)
                      }
                      placeholder="Liên kết"
                      className="flex-1 p-2 rounded-md border border-gray-300 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#23233b]"
                    />
                    <button
                      onClick={() => removeSocialLink(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={addSocialLink}
                  className="text-sm text-blue-500 hover:underline"
                >
                  + Thêm liên kết khác
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end gap-3 border-t border-gray-200 dark:border-[#2b2b3d] pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-[#2b2b3d] text-gray-700 dark:text-gray-300"
          >
            Hủy
          </button>
          <button
            disabled={loading}
            onClick={handleSave}
            className={`px-4 py-2 rounded-md text-white ${
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

EditInfoModal.propTypes = {
  user: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onUpdated: PropTypes.func.isRequired,
};

export default EditInfoModal;
