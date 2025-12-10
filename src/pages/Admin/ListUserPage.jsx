import { Search, Users, UserCheck, UserX, MailWarning, Filter, X } from "lucide-react";
import { useGetAllUsers } from "../../hooks/useStats";
import SpinnerLoading from "../../components/SpinnerLoading";
import useAuthStore from "../../store/authStore";
import UserTable from "../../components/Admin/Chart/UserTable";
import { useState, useMemo } from "react";

export default function ListUserPage() {
  const { onlineUsers } = useAuthStore();
  const { users, usersStats, loading } = useGetAllUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all", // all, online, offline, blocked, unverified
    gender: "all", // all, male, female, other
    verified: "all", // all, verified, unverified
  });

  const stats = [
    {
      title: "USERS",
      value: usersStats?.totalUsers || 0,
      icon: <Users className="size-8 text-orange-500 bg-orange-100 rounded-full p-1" />,
      bg: "bg-gradient-to-br from-orange-100 to-orange-300",
      text: "text-orange-700",
    },
    {
      title: "ONLINE",
      value: onlineUsers.length,
      icon: <UserCheck className="size-8 text-blue-500 bg-blue-100 rounded-full p-1" />,
      bg: "bg-gradient-to-br from-blue-100 to-blue-300",
      text: "text-blue-700",
    },
    {
      title: "BLOCK",
      value: usersStats?.totalBlockedUsers || 0,
      icon: <UserX className="size-8 text-red-500 bg-red-100 rounded-full p-1" />,
      bg: "bg-gradient-to-br from-red-100 to-red-300",
      text: "text-red-700",
    },
    {
      title: "UNVERIFIED",
      value: usersStats?.totalUnverifiedUsers || 0,
      icon: <MailWarning className="size-8 text-green-700 bg-green-100 rounded-full p-1" />,
      bg: "bg-gradient-to-br from-green-100 to-green-300",
      text: "text-green-700",
    },
  ];

  // ✅ Filter & Search Logic
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery);

      // Status filter
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "online" && onlineUsers.includes(user._id)) ||
        (filters.status === "offline" && !onlineUsers.includes(user._id)) ||
        (filters.status === "blocked" && user.isBlocked) ||
        (filters.status === "unverified" && !user.isVerified);

      // Gender filter
      const matchesGender =
        filters.gender === "all" ||
        user.gender?.toLowerCase() === filters.gender;

      // Verified filter
      const matchesVerified =
        filters.verified === "all" ||
        (filters.verified === "verified" && user.isVerified) ||
        (filters.verified === "unverified" && !user.isVerified);

      return matchesSearch && matchesStatus && matchesGender && matchesVerified;
    });
  }, [users, searchQuery, filters, onlineUsers]);

  // ✅ Reset filters
  const handleResetFilters = () => {
    setFilters({
      status: "all",
      gender: "all",
      verified: "all",
    });
    setSearchQuery("");
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== "all").length;

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <SpinnerLoading />
      </div>
    );

  return (
    <div className="p-4">
      {/* Stats Cards */}
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-6 mb-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className={`relative rounded-2xl shadow-md p-6 flex flex-col gap-2 items-start ${item.bg}`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <div>
                <h2 className={`text-sm font-semibold uppercase ${item.text}`}>
                  {item.title}
                </h2>
                <h1 className="text-2xl font-bold text-gray-800">{item.value}</h1>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar with Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h1 className="mb-3 text-gray-600 text-sm font-medium">
          🔍 Search & Filter Users
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#e91e63] bg-white shadow-sm transition"
              placeholder="Search by name, email or phone..."
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow transition ${
              showFilters || activeFiltersCount > 0
                ? "bg-[#e91e63] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="size-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-[#e91e63] rounded-full px-2 py-0.5 text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Reset Button */}
          {(searchQuery || activeFiltersCount > 0) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition"
            >
              <X className="size-4" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 grid md:grid-cols-3 grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e91e63] bg-white"
              >
                <option value="all">All Users</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="blocked">Blocked</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={filters.gender}
                onChange={(e) =>
                  setFilters({ ...filters, gender: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e91e63] bg-white"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Verified Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verification
              </label>
              <select
                value={filters.verified}
                onChange={(e) =>
                  setFilters({ ...filters, verified: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e91e63] bg-white"
              >
                <option value="all">All Users</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing <span className="font-bold text-[#e91e63]">{filteredUsers.length}</span> of{" "}
          <span className="font-bold">{users?.length || 0}</span> users
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow p-4">
        <UserTable data={filteredUsers} loading={loading} />
      </div>
    </div>
  );
}