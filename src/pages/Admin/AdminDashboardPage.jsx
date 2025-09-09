import { MoveDownRight, MoveUpRight, Users, FileText, MessageCircle, ThumbsUp } from "lucide-react";
import ColumnChart from "../../components/Admin/Chart/ColumnChart";
import PieChart from "../../components/Admin/Chart/PieChart";
import {
  useGetGenderStats,
  useGetStats,
  useGetUserPostsStats,
} from "../../hooks/useStats";
import SpinnerLoading from "../../components/SpinnerLoading";

export default function AdminDashboardPage() {
  const { stats, loading: loadingStats, error: errorStats } = useGetStats();
  const {
    genderStats,
    loading: genderLoading,
    error: genderError,
  } = useGetGenderStats();
  const {
    userPostsStats,
    loading: userPostsLoading,
    error: userPostsError,
  } = useGetUserPostsStats();

  const statsData = [
    {
      label: "Total Users",
      value: stats?.userCount,
      change: -2.5,
      icon: <Users className="size-8 text-[#388e3c] bg-[#e0f2f1] rounded-full p-1" />,
    },
    {
      label: "Total Posts",
      value: stats?.postCount,
      change: 6.7,
      icon: <FileText className="size-8 text-[#388e3c] bg-[#e0f2f1] rounded-full p-1" />,
    },
    {
      label: "Total Comments",
      value: stats?.commentCount,
      change: -3.4,
      icon: <MessageCircle className="size-8 text-[#388e3c] bg-[#e0f2f1] rounded-full p-1" />,
    },
    {
      label: "Total Likes",
      value: stats?.likeCount,
      change: 10.4,
      icon: <ThumbsUp className="size-8 text-[#388e3c] bg-[#e0f2f1] rounded-full p-1" />,
    },
  ];

  const pieChartData = [
    { type: "Male", value: genderStats?.maleCount },
    { type: "Female", value: genderStats?.femaleCount },
    { type: "Other", value: genderStats?.otherCount },
  ].filter((item) => item.value > 0);

  return (
    <div className="p-4">
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
        {statsData.map((item) => {
          const isPositive = item.change >= 0;
          const Icon = isPositive ? MoveUpRight : MoveDownRight;

          return (
            <div
              key={item.label}
              className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
            >
              <div className="flex flex-row items-center mb-2">
                <span className="mr-2">{item.icon}</span>
                <h3 className="text-lg font-semibold">{item.label}</h3>
              </div>
              {loadingStats ? (
                <SpinnerLoading />
              ) : (
                <>
                  <h1 className="text-3xl font-bold">{item.value}</h1>
                  <div className="mt-2">
                    <div className="flex gap-1 items-center">
                      <Icon
                        className={`size-4 ${isPositive ? "text-green-500" : "text-red-500"
                          }`}
                      />
                      <span
                        className={`${isPositive ? "text-green-500" : "text-red-500"
                          }`}
                      >
                        {Math.abs(item.change)}%
                      </span>
                      <span className="text-gray-400">since last month</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex lg:flex-row flex-col gap-4">
        <div className="lg:w-[70%] w-full bg-white p-4 rounded-lg">
          <h1 className="text-2xl mb-4 font-semibold">Overview 2025</h1>
          <div className="w-full h-80 lg:h-[320px]">
            {userPostsLoading && !userPostsStats ? (
              <SpinnerLoading />
            ) : (
              <ColumnChart data={userPostsStats} />
            )}
          </div>
        </div>
        <div className="lg:w-[30%] w-full bg-white p-4 rounded-lg">
          <h1 className="text-2xl mb-4 font-semibold">Reached Audience</h1>
          <div className="w-full h-64 lg:h-[320px] flex items-center justify-center">
            {genderLoading && !genderStats ? (
              <SpinnerLoading />
            ) : (
              <PieChart data={pieChartData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
