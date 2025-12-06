import { useState, useMemo } from "react";
import { 
  Search, 
  Shield, 
  Crown, 
  Star, 
  Users, 
  Filter,
  UserCheck,
  Mail
} from "lucide-react";
import { getBackendImgURL } from "../../utils/helper";
import { Link } from "react-router-dom";

export default function MembersTab({ group }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all, admin, moderator, member

  // Combine all members with their roles
  const allMembers = useMemo(() => {
    const memberList = [];

    // Add creator (always admin)
    memberList.push({
      ...group.createdBy,
      role: "creator",
      isAdmin: true,
      isModerator: false
    });

    // Add other admins
    group.admins.forEach(admin => {
      if (admin._id !== group.createdBy._id) {
        memberList.push({
          ...admin,
          role: "admin",
          isAdmin: true,
          isModerator: false
        });
      }
    });

    // Add moderators
    group.moderators.forEach(mod => {
      if (!memberList.find(m => m._id === mod._id)) {
        memberList.push({
          ...mod,
          role: "moderator",
          isAdmin: false,
          isModerator: true
        });
      }
    });

    // Add regular members
    group.members.forEach(member => {
      if (!memberList.find(m => m._id === member._id)) {
        memberList.push({
          ...member,
          role: "member",
          isAdmin: false,
          isModerator: false
        });
      }
    });

    return memberList;
  }, [group]);

  // Filter members based on search and role
  const filteredMembers = useMemo(() => {
    return allMembers.filter(member => {
      const matchesSearch = member.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesRole = 
        roleFilter === "all" ||
        (roleFilter === "admin" && (member.role === "creator" || member.role === "admin")) ||
        (roleFilter === "moderator" && member.role === "moderator") ||
        (roleFilter === "member" && member.role === "member");

      return matchesSearch && matchesRole;
    });
  }, [allMembers, searchQuery, roleFilter]);

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<Users className="size-5" />}
          label="Total Members"
          value={group.members.length}
          color="blue"
        />
        <StatCard
          icon={<Crown className="size-5" />}
          label="Admins"
          value={group.admins.length}
          color="purple"
        />
        <StatCard
          icon={<Shield className="size-5" />}
          label="Moderators"
          value={group.moderators.length}
          color="pink"
        />
        <StatCard
          icon={<UserCheck className="size-5" />}
          label="Active"
          value={group.members.length}
          color="green"
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-4 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-[#2b2b3d] bg-white dark:bg-[#252838] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-[#2b2b3d] bg-white dark:bg-[#252838] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="moderator">Moderators</option>
              <option value="member">Members</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          Showing <b>{filteredMembers.length}</b> of <b>{allMembers.length}</b> members
        </p>
      </div>

      {/* Members List */}
      <div className="rounded-xl bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-[#2b2b3d] shadow-sm overflow-hidden">
        {filteredMembers.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-[#2b2b3d]">
            {filteredMembers.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="size-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              No members found matching your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* Stat Card Component */
function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
  };

  return (
    <div className="rounded-xl bg-white dark:bg-[#1e1e2f] p-4 border border-gray-200 dark:border-[#2b2b3d] shadow-sm">
      <div className={`inline-flex p-2 rounded-lg mb-2 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold dark:text-gray-200">{value}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}

/* Member Card Component */
function MemberCard({ member }) {
  return (
    <Link
      to={`/profile/${member.slug}`}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#252838] transition-colors"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={getBackendImgURL(member.avatar)}
          alt={member.fullName}
          className="size-12 rounded-full object-cover"
        />
        {/* Role Badge on Avatar */}
        {member.role === "creator" && (
          <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1">
            <Crown className="size-3 text-white" />
          </div>
        )}
        {member.role === "admin" && (
          <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1">
            <Shield className="size-3 text-white" />
          </div>
        )}
        {member.role === "moderator" && (
          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
            <Star className="size-3 text-white" />
          </div>
        )}
      </div>

      {/* Member Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold dark:text-gray-200 truncate">
            {member.fullName}
          </p>
          <RoleBadge role={member.role} />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          @{member.slug}
        </p>
      </div>

      {/* Action Button */}
      <button className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2d3142] transition-colors">
        <Mail className="size-5 text-gray-600 dark:text-gray-400" />
      </button>
    </Link>
  );
}

/* Role Badge Component */
function RoleBadge({ role }) {
  const badges = {
    creator: {
      label: "Creator",
      className: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
    },
    admin: {
      label: "Admin",
      className: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
    },
    moderator: {
      label: "Moderator",
      className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
    },
    member: {
      label: "Member",
      className: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
    }
  };

  const badge = badges[role] || badges.member;

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}>
      {badge.label}
    </span>
  );
}