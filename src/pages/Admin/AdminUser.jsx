import { Search } from "lucide-react";
import { useGetAllUsers } from "../../hooks/useStats";
import SpinnerLoading from "../../components/SpinnerLoading";
import useAuthStore from "../../store/authStore";
import UserTable from "../../components/Admin/Chart/UserTable";

export default function AdminUser() {
  const { onlineUsers } = useAuthStore();
  const { users, usersStats, loading } = useGetAllUsers();

  if (loading)
    return (
      <div className="h-screen">
        <SpinnerLoading />
      </div>
    );

  const stats = [
    {
      title: "USERS",
      value: usersStats?.totalUsers || 0,
      bg: "bg-orange-400",
      img: "/user-admin.png",
    },
    {
      title: "ONLINE",
      value: onlineUsers.length,
      bg: "bg-blue-400",
      img: "/clock-admin.png",
    },
    {
      title: "BLOCK",
      value: usersStats?.totalBlockedUsers || 0,
      bg: "bg-red-400",
      img: "/minus.png",
    },
    {
      title: "UNVERIFIED",
      value: usersStats?.totalUnverifiedUsers || 0,
      bg: "bg-green-700",
      img: "/mail-admin.png",
    },
  ];

  return (
    <div className="p-4">
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-2">
        {stats.map((item) => (
          <div
            key={item.title}
            className={`relative text-white rounded-xl p-6 overflow-hidden ${item.bg}`}
          >
            {/* Text always on top */}
            <div className="relative z-10">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <h1 className="text-3xl font-bold">{item.value}</h1>
            </div>

            {/* Image behind text */}
            <img
              src={item.img}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 opacity-50 z-0"
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="flex gap-2">
          <input
            className="border border-gray-300 rounded-md py-2 px-4 w-92"
            placeholder="Search users..."
          />
          <button className="flex items-center justify-center cursor-pointer hover:bg-gray-400 rounded-md gap-2 py-2 px-4 bg-gray-300">
            <Search className="size-4" />
            <span>Search</span>
          </button>
        </div>
        <h1 className="mt-2 text-gray-400">
          Search by Full name, Email or Phone
        </h1>
        <div className="mt-2">
          <UserTable data={users || []} loading={loading} />
        </div>
      </div>
    </div>
  );
}
