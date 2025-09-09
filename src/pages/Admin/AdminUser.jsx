import { Search, Users, UserCheck, UserX, MailWarning } from "lucide-react";
import { useGetAllUsers } from "../../hooks/useStats";
import SpinnerLoading from "../../components/SpinnerLoading";
import useAuthStore from "../../store/authStore";
import UserTable from "../../components/Admin/Chart/UserTable";

export default function AdminUser() {
  const { onlineUsers } = useAuthStore();
  const { users, usersStats, loading } = useGetAllUsers();

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <SpinnerLoading />
      </div>
    );

  const stats = [
    {
      title: "USERS",
      value: usersStats?.totalUsers || 0,
      icon: (
        <Users className="size-8 text-orange-500 bg-orange-100 rounded-full p-1" />
      ),
      bg: "bg-gradient-to-br from-orange-100 to-orange-300",
      text: "text-orange-700",
    },
    {
      title: "ONLINE",
      value: onlineUsers.length,
      icon: (
        <UserCheck className="size-8 text-blue-500 bg-blue-100 rounded-full p-1" />
      ),
      bg: "bg-gradient-to-br from-blue-100 to-blue-300",
      text: "text-blue-700",
    },
    {
      title: "BLOCK",
      value: usersStats?.totalBlockedUsers || 0,
      icon: (
        <UserX className="size-8 text-red-500 bg-red-100 rounded-full p-1" />
      ),
      bg: "bg-gradient-to-br from-red-100 to-red-300",
      text: "text-red-700",
    },
    {
      title: "UNVERIFIED",
      value: usersStats?.totalUnverifiedUsers || 0,
      icon: (
        <MailWarning className="size-8 text-green-700 bg-green-100 rounded-full p-1" />
      ),
      bg: "bg-gradient-to-br from-green-100 to-green-300",
      text: "text-green-700",
    },
  ];

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
                <h2
                  className={`text-sm font-semibold uppercase ${item.text}`}
                >
                  {item.title}
                </h2>
                <h1 className="text-2xl font-bold text-gray-800">
                  {item.value}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <h1 className="mb-2 text-gray-400 text-sm">
        Search by Full name, Email or Phone
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <input
            className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#e91e63] bg-white shadow-sm transition"
            placeholder="Search users..."
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#e91e63] text-white font-semibold shadow hover:bg-pink-600 transition">
          <Search className="size-4" />
          <span>Search</span>
        </button>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow p-4">
        <UserTable data={users || []} loading={loading} />
      </div>
    </div>
  );
}
