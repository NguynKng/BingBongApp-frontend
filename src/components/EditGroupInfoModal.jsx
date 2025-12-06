import { useState } from "react";
import {
  X,
  Loader2,
  Globe,
  Lock,
  Save,
  Plus,
  Trash2,
  Shield,
  Settings as SettingsIcon,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { groupAPI } from "../services/api";

export default function EditGroupInfoModal({ group, isOpen, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState("basic"); // basic, rules, settings
  const [formData, setFormData] = useState({
    name: group.name || "",
    description: group.description || "",
    visibility: group.visibility || "public",
    tags: group.tags ? group.tags.join(", ") : "",
    rules: group.rules || [],
    settings: {
      allowMemberPost: group.settings?.allowMemberPost ?? true,
      requireJoinApproval: group.settings?.requireJoinApproval ?? false,
    },
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingToggle = (settingName) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [settingName]: !prev.settings[settingName],
      },
    }));
  };

  const handleAddRule = () => {
    setFormData((prev) => ({
      ...prev,
      rules: [...prev.rules, { title: "", description: "" }],
    }));
  };

  const handleRemoveRule = (index) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleRuleChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.map((rule, i) =>
        i === index ? { ...rule, [field]: value } : rule
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      // Filter out empty rules
      const validRules = formData.rules.filter(
        (rule) => rule.title.trim() || rule.description.trim()
      );

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        visibility: formData.visibility,
        tags: tagsArray,
        rules: validRules,
        settings: formData.settings,
      };

      const response = await groupAPI.updateGroup(group._id, payload);

      if (response.success) {
        toast.success("Group updated successfully!");
        onUpdate(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.error || "Failed to update group");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4 bg-white dark:bg-[#1e1e2f] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#2b2b3d] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#2b2b3d] bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Group Settings
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <X className="size-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#252838]">
          <button
            onClick={() => setActiveTab("basic")}
            className={`flex-1 px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === "basic"
                ? "text-blue-600 dark:text-purple-400 border-b-2 border-blue-600 dark:border-purple-400 bg-white dark:bg-[#1e1e2f]"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <FileText className="size-4" />
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`flex-1 px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === "rules"
                ? "text-blue-600 dark:text-purple-400 border-b-2 border-blue-600 dark:border-purple-400 bg-white dark:bg-[#1e1e2f]"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <Shield className="size-4" />
            Rules
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === "settings"
                ? "text-blue-600 dark:text-purple-400 border-b-2 border-blue-600 dark:border-purple-400 bg-white dark:bg-[#1e1e2f]"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <SettingsIcon className="size-4" />
            Settings
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* BASIC INFO TAB */}
          {activeTab === "basic" && (
            <>
              {/* Group Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Enter group name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252838] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formData.name.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  maxLength={1000}
                  placeholder="Describe your group..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252838] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Group Visibility <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, visibility: "public" }))
                    }
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      formData.visibility === "public"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-green-400"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        formData.visibility === "public"
                          ? "bg-green-100 dark:bg-green-900/40"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <Globe
                        className={`size-5 ${
                          formData.visibility === "public"
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Public
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Anyone can see posts
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, visibility: "private" }))
                    }
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      formData.visibility === "private"
                        ? "border-gray-500 bg-gray-50 dark:bg-gray-800/50"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        formData.visibility === "private"
                          ? "bg-gray-200 dark:bg-gray-700"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <Lock
                        className={`size-5 ${
                          formData.visibility === "private"
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Private
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Members only
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="tech, programming, community (comma-separated)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252838] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Separate tags with commas
                </p>
                {formData.tags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag)
                      .map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* RULES TAB */}
          {activeTab === "rules" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set guidelines for your group members to follow
                </p>
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <Plus className="size-4" />
                  Add Rule
                </button>
              </div>

              {formData.rules.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <Shield className="size-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    No rules yet
                  </p>
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="text-blue-600 dark:text-purple-400 font-semibold hover:underline"
                  >
                    Add your first rule
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.rules.map((rule, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#252838] space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={rule.title}
                            onChange={(e) =>
                              handleRuleChange(index, "title", e.target.value)
                            }
                            placeholder={`Rule ${index + 1} Title`}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e1e2f] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500"
                          />
                          <textarea
                            value={rule.description}
                            onChange={(e) =>
                              handleRuleChange(index, "description", e.target.value)
                            }
                            placeholder="Rule description (optional)"
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e1e2f] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 resize-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(index)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Configure how members interact with your group
              </p>

              {/* Allow Member Post */}
              <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#252838]">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Allow Member Posts
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Let members create posts in the group. If disabled, only admins
                    can post.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSettingToggle("allowMemberPost")}
                  className={`relative ml-4 flex-shrink-0 w-14 h-7 rounded-full transition-colors ${
                    formData.settings.allowMemberPost
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      formData.settings.allowMemberPost
                        ? "translate-x-7"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Require Join Approval */}
              <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#252838]">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Require Join Approval
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    New members must be approved by admins before joining the group.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSettingToggle("requireJoinApproval")}
                  className={`relative ml-4 flex-shrink-0 w-14 h-7 rounded-full transition-colors ${
                    formData.settings.requireJoinApproval
                      ? "bg-yellow-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      formData.settings.requireJoinApproval
                        ? "translate-x-7"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#252838]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.name.trim()}
            className="flex-1 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}