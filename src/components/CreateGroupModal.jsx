import { useState } from "react";
import { groupAPI } from "../services/api";
import { X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateGroupModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [rules, setRules] = useState([]);
  const [ruleTitle, setRuleTitle] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");

  const [settings, setSettings] = useState({
    allowMemberPost: true,
    requireJoinApproval: false,
  });

  const toggleSetting = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  // ➕ Add Tag
  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    if (tags.includes(tag)) {
      toast.error("Tag already exists");
      return;
    }
    setTags((prev) => [...prev, tag]);
    setTagInput("");
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  // ➕ Add Rule (with title and description)
  const addRule = () => {
    const title = ruleTitle.trim();
    const desc = ruleDescription.trim();

    if (!title) {
      toast.error("Rule title is required");
      return;
    }

    setRules((prev) => [
      ...prev,
      {
        title,
        description: desc,
      },
    ]);

    setRuleTitle("");
    setRuleDescription("");
  };

  const removeRule = (index) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Group name is required");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      visibility,
      settings,
      tags,
      rules,
    };

    setLoading(true);
    try {
      const res = await groupAPI.createGroup(payload);
      toast.success("Group created successfully!");
      onCreated?.(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div onClick={onClose} className="absolute inset-0" />

      <div className="relative bg-white dark:bg-[#1e1e2f] w-full max-w-2xl mx-4 rounded-2xl shadow-2xl border border-gray-200 dark:border-[#2b2b3d] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#2b2b3d] bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Group
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="size-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter group name"
              maxLength={100}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252838] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {name.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252838] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your group..."
              rows={4}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {description.length}/1000 characters
            </p>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Visibility <span className="text-red-500">*</span>
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252838] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="public">🌍 Public – Anyone can join and view posts</option>
              <option value="private">🔒 Private – Only members can view posts</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252838] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Add tag (e.g., tech, programming)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
              />
              <button
                onClick={addTag}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Plus className="size-4" />
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(idx)}
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Rules */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Group Rules
            </label>
            <div className="space-y-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#252838]">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e1e2f] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Rule title (e.g., Be respectful)"
                value={ruleTitle}
                onChange={(e) => setRuleTitle(e.target.value)}
              />
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e1e2f] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Rule description (optional)"
                rows={2}
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
              />
              <button
                onClick={addRule}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="size-4" />
                Add Rule
              </button>
            </div>

            {rules.length > 0 && (
              <div className="space-y-3 mt-3">
                {rules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#252838]"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {idx + 1}. {rule.title}
                        </h4>
                        {rule.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {rule.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeRule(idx)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-[#252838]">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Group Settings
            </h3>

            {[
              ["allowMemberPost", "Allow members to post"],
              ["requireJoinApproval", "Require join approval"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-white dark:bg-[#1e1e2f] rounded-lg"
              >
                <span className="text-gray-700 dark:text-gray-300">{label}</span>

                <button
                  onClick={() => toggleSetting(key)}
                  className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-colors ${
                    settings[key] ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                      settings[key] ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-[#2b2b3d] bg-gray-50 dark:bg-[#252838]">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="flex-1 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}