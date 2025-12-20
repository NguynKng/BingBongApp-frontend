import { useState } from "react";
import {
  Users,
  UserPlus,
  UserMinus,
  Shield,
  ShieldCheck,
  Crown,
  Clock,
  Check,
  X,
  Search,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";
import { groupAPI } from "../../services/api";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import { getBackendImgURL } from "../../utils/helper";
import Swal from "sweetalert2";

export default function ManageTab({ group }) {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState("members"); // members, pending, roles
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [localGroup, setLocalGroup] = useState(group);

  const isCreator = user && localGroup.createdBy._id === user._id;
  const isAdmin =
    user && localGroup.admins.some((admin) => admin._id === user._id);
  const isModerator =
    user && localGroup.moderators.some((mod) => mod._id === user._id);

  // Filter members based on search
  const filteredMembers = localGroup.members.filter(
    (member) =>
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPending = localGroup.pendingMembers?.filter(
    (member) =>
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get member role
  const getMemberRole = (memberId) => {
    if (localGroup.createdBy._id === memberId) return "Creator";
    if (localGroup.admins.some((admin) => admin._id === memberId))
      return "Admin";
    if (localGroup.moderators.some((mod) => mod._id === memberId))
      return "Moderator";
    return "Member";
  };

  // Approve pending member
  const handleApproveMember = async (userId) => {
    setLoading(true);
    try {
      await groupAPI.approveMember(localGroup._id, userId);
      toast.success("Member approved!");

      // Update local state
      setLocalGroup((prev) => ({
        ...prev,
        members: [
          ...prev.members,
          prev.pendingMembers.find((m) => m._id === userId),
        ],
        pendingMembers: prev.pendingMembers.filter((m) => m._id !== userId),
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to approve member");
    } finally {
      setLoading(false);
    }
  };

  // Reject pending member
  const handleRejectMember = async (userId) => {
    setLoading(true);
    try {
      await groupAPI.rejectMember(localGroup._id, userId);
      toast.success("Member rejected");

      setLocalGroup((prev) => ({
        ...prev,
        pendingMembers: prev.pendingMembers.filter((m) => m._id !== userId),
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to reject member");
    } finally {
      setLoading(false);
    }
  };

  // Remove member
  const handleRemoveMember = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to remove this member?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await groupAPI.removeMember(localGroup._id, userId);
      toast.success("Member removed");

      setLocalGroup((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m._id !== userId),
        admins: prev.admins.filter((a) => a._id !== userId),
        moderators: prev.moderators.filter((m) => m._id !== userId),
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to remove member");
    } finally {
      setLoading(false);
      setShowMenu(null);
    }
  };

  // Manage role
  const handleManageRole = async (userId, action, role) => {
    setLoading(true);
    try {
      const response = await groupAPI.manageRole(
        localGroup._id,
        userId,
        role,
        action
      );

      // Update local state
      setLocalGroup(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update role");
    } finally {
      setLoading(false);
      setShowMenu(null);
    }
  };

  // Permission checks
  const canManageRoles = isCreator || isAdmin;
  const canRemoveMembers = isCreator || isAdmin || isModerator;
  const canApprovePending = isCreator || isAdmin || isModerator;

  if (!canManageRoles && !canRemoveMembers) {
    return (
      <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-12 border border-gray-200 dark:border-[#2b2b3d] shadow-sm text-center">
        <AlertTriangle className="size-16 mx-auto text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Access
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {"You don't have permission to manage this group."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-6 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Group Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage members, approve join requests, and assign roles
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="rounded-xl bg-white dark:bg-[#1e1e2f] border border-gray-200 min-h-screen dark:border-[#2b2b3d] shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-[#2b2b3d]">
          <button
            onClick={() => setActiveSection("members")}
            className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeSection === "members"
                ? "text-blue-600 dark:text-purple-400 bg-blue-50 dark:bg-purple-900/20 border-b-2 border-blue-600 dark:border-purple-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#252838]"
            }`}
          >
            <Users className="size-5" />
            Members ({localGroup.members.length})
          </button>

          {canApprovePending && (
            <button
              onClick={() => setActiveSection("pending")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 relative ${
                activeSection === "pending"
                  ? "text-blue-600 dark:text-purple-400 bg-blue-50 dark:bg-purple-900/20 border-b-2 border-blue-600 dark:border-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#252838]"
              }`}
            >
              <Clock className="size-5" />
              Pending ({localGroup.pendingMembers?.length || 0})
              {localGroup.pendingMembers?.length > 0 && (
                <span className="absolute top-2 right-2 size-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-[#2b2b3d]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252838] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* MEMBERS TAB */}
          {activeSection === "members" && (
            <div className="space-y-3">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="size-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery ? "No members found" : "No members yet"}
                  </p>
                </div>
              ) : (
                filteredMembers.map((member) => {
                  const role = getMemberRole(member._id);
                  const isCurrentUser = member._id === user?._id;
                  const isMemberCreator =
                    member._id === localGroup.createdBy._id;

                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#252838] hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={
                            member.avatar
                              ? getBackendImgURL(member.avatar)
                              : "/default-avatar.png"
                          }
                          alt={member.fullName}
                          className="size-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {member.fullName}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                  (You)
                                </span>
                              )}
                            </h3>
                            {role !== "Member" && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  role === "Creator"
                                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                    : role === "Admin"
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                }`}
                              >
                                {role === "Creator" && (
                                  <Crown className="inline size-3 mr-1" />
                                )}
                                {role === "Admin" && (
                                  <ShieldCheck className="inline size-3 mr-1" />
                                )}
                                {role === "Moderator" && (
                                  <Shield className="inline size-3 mr-1" />
                                )}
                                {role}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            @{member.slug || member.username}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      {!isCurrentUser && !isMemberCreator && canManageRoles && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowMenu(
                                showMenu === member._id ? null : member._id
                              )
                            }
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <MoreVertical className="size-5 text-gray-600 dark:text-gray-400" />
                          </button>

                          {showMenu === member._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-10 overflow-hidden">
                              {/* Role Management */}
                              {isCreator && role !== "Admin" && (
                                <button
                                  onClick={() =>
                                    handleManageRole(member._id, "add", "admin")
                                  }
                                  disabled={loading}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <ShieldCheck className="size-4" />
                                  Make Admin
                                </button>
                              )}

                              {isCreator && role === "Admin" && (
                                <button
                                  onClick={() =>
                                    handleManageRole(
                                      member._id,
                                      "remove",
                                      "admin"
                                    )
                                  }
                                  disabled={loading}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <X className="size-4" />
                                  Remove Admin
                                </button>
                              )}

                              {(isCreator || isAdmin) &&
                                role !== "Moderator" &&
                                role !== "Admin" && (
                                  <button
                                    onClick={() =>
                                      handleManageRole(
                                        member._id,
                                        "add",
                                        "moderator"
                                      )
                                    }
                                    disabled={loading}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <Shield className="size-4" />
                                    Make Moderator
                                  </button>
                                )}

                              {(isCreator || isAdmin) &&
                                role === "Moderator" && (
                                  <button
                                    onClick={() =>
                                      handleManageRole(
                                        member._id,
                                        "remove",
                                        "moderator"
                                      )
                                    }
                                    disabled={loading}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <X className="size-4" />
                                    Remove Moderator
                                  </button>
                                )}

                              {/* Remove Member */}
                              {canRemoveMembers && (
                                <>
                                  <div className="border-t border-gray-200 dark:border-gray-600" />
                                  <button
                                    onClick={() =>
                                      handleRemoveMember(member._id)
                                    }
                                    disabled={loading}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <UserMinus className="size-4" />
                                    Remove Member
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* PENDING TAB */}
          {activeSection === "pending" && (
            <div className="space-y-3">
              {filteredPending?.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="size-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery
                      ? "No pending requests found"
                      : "No pending join requests"}
                  </p>
                </div>
              ) : (
                filteredPending?.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={getBackendImgURL(member.avatar)}
                        alt={member.fullName}
                        className="size-12 rounded-full object-cover border-2 border-yellow-300 dark:border-yellow-600"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {member.fullName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          @{member.slug || member.username}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveMember(member._id)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Check className="size-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectMember(member._id)}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <X className="size-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
