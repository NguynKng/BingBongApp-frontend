import {
  MoveDownRight,
  MoveUpRight,
  Users,
  FileText,
  MessageCircle,
  ThumbsUp,
  Store,
  Package,
  UsersRound,
  Award,
  TrendingUp,
  Activity,
} from "lucide-react";
import ColumnChart from "../../components/Admin/Chart/ColumnChart";
import PieChart from "../../components/Admin/Chart/PieChart";
import LineChart from "../../components/Admin/Chart/LineChart";
import {
  useGetGenderStats,
  useGetStats,
  useGetUserGroupShopStats,
  useGetPostCommentReactionStats,
  useGetRecentActivity,
  useGetTopUsers,
  useGetGroupStats,
  useGetShopStats,
} from "../../hooks/useStats";
import SpinnerLoading from "../../components/SpinnerLoading";
import { getBackendImgURL } from "../../utils/helper";

export default function DashboardPage() {
  const { stats, loading: loadingStats, error: errorStats } = useGetStats();
  const {
    genderStats,
    loading: genderLoading,
    error: genderError,
  } = useGetGenderStats();
  const {
    userGroupShopStats,
    loading: userGroupShopLoading,
    error: userGroupShopError,
  } = useGetUserGroupShopStats();
  const {
    postCommentReactionStats,
    loading: postCommentReactionLoading,
    error: postCommentReactionError,
  } = useGetPostCommentReactionStats();
  const {
    recentActivity,
    loading: recentActivityLoading,
    error: recentActivityError,
  } = useGetRecentActivity();
  const {
    topUsers,
    loading: topUsersLoading,
    error: topUsersError,
  } = useGetTopUsers();
  const {
    groupStats,
    loading: groupStatsLoading,
    error: groupStatsError,
  } = useGetGroupStats();
  const {
    shopStats,
    loading: shopStatsLoading,
    error: shopStatsError,
  } = useGetShopStats();

  // ✅ Dynamic stats data from API - Updated with new structure
  const statsData = [
    {
      label: "Total Users",
      value: stats?.overview?.community?.userCount || 0,
      change: stats?.growth?.users?.value || 0,
      trend: stats?.growth?.users?.trend || "up",
      icon: (
        <Users className="size-8 text-[#388e3c] bg-[#e0f2f1] rounded-full p-1" />
      ),
    },
    {
      label: "Total Posts",
      value: stats?.overview?.content?.postCount || 0,
      change: stats?.growth?.posts?.value || 0,
      trend: stats?.growth?.posts?.trend || "up",
      icon: (
        <FileText className="size-8 text-[#1976d2] bg-[#e3f2fd] rounded-full p-1" />
      ),
    },
    {
      label: "Total Comments",
      value: stats?.overview?.content?.commentCount || 0,
      change: stats?.growth?.comments?.value || 0,
      trend: stats?.growth?.comments?.trend || "up",
      icon: (
        <MessageCircle className="size-8 text-[#f57c00] bg-[#fff3e0] rounded-full p-1" />
      ),
    },
    {
      label: "Total Likes",
      value: stats?.overview?.content?.likeCount || 0,
      change: 0, // No growth data for likes yet
      trend: "up",
      icon: (
        <ThumbsUp className="size-8 text-[#e91e63] bg-[#fce4ec] rounded-full p-1" />
      ),
    },
    {
      label: "Total Groups",
      value: stats?.overview?.community?.groupCount || 0,
      change: 0,
      trend: "up",
      icon: (
        <UsersRound className="size-8 text-[#9c27b0] bg-[#f3e5f5] rounded-full p-1" />
      ),
    },
    {
      label: "Total Shops",
      value: stats?.overview?.community?.shopCount || 0,
      change: 0,
      trend: "up",
      icon: (
        <Store className="size-8 text-[#ff9800] bg-[#fff3e0] rounded-full p-1" />
      ),
    },
    {
      label: "Total Products",
      value: stats?.overview?.others?.productCount || 0,
      change: 0,
      trend: "up",
      icon: (
        <Package className="size-8 text-[#795548] bg-[#efebe9] rounded-full p-1" />
      ),
    },
    {
      label: "Total Badges",
      value: stats?.overview?.others?.badgeCount || 0,
      change: stats?.growth?.badges?.value || 0,
      trend: stats?.growth?.badges?.trend || "up",
      icon: (
        <Award className="size-8 text-[#ffc107] bg-[#fff8e1] rounded-full p-1" />
      ),
    },
  ];

  // ✅ Dynamic pie chart data
  const pieChartData = [
    { type: "Male", value: genderStats?.total?.maleCount || 0 },
    { type: "Female", value: genderStats?.total?.femaleCount || 0 },
    { type: "Other", value: genderStats?.total?.otherCount || 0 },
  ].filter((item) => item.value > 0);

  return (
    <div className="p-4">
      {/* Stats Grid */}
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {statsData.map((item) => {
          const isPositive = item.trend === "up";
          const Icon = isPositive ? MoveUpRight : MoveDownRight;

          return (
            <div
              key={item.label}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col justify-between"
            >
              <div className="flex flex-row items-center mb-2">
                <span className="mr-2">{item.icon}</span>
                <h3 className="text-sm font-semibold text-gray-700">
                  {item.label}
                </h3>
              </div>
              {loadingStats ? (
                <SpinnerLoading />
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {item.value.toLocaleString()}
                  </h1>
                  {item.change !== 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 items-center">
                        <Icon
                          className={`size-4 ${
                            isPositive ? "text-green-500" : "text-red-500"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            isPositive ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {Math.abs(item.change)}%
                        </span>
                        <span className="text-xs text-gray-400">
                          vs last month
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Last Month Summary */}
      {stats?.lastMonth && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            {stats.lastMonth.monthName} Summary
          </h2>
          <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">New Users</p>
              <p className="text-xl font-bold text-blue-600">
                {stats.lastMonth.users}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">New Posts</p>
              <p className="text-xl font-bold text-green-600">
                {stats.lastMonth.posts}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">New Comments</p>
              <p className="text-xl font-bold text-orange-600">
                {stats.lastMonth.comments}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">New Groups</p>
              <p className="text-xl font-bold text-purple-600">
                {stats.lastMonth.groups}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">New Shops</p>
              <p className="text-xl font-bold text-amber-600">
                {stats.lastMonth.shops}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">New Badges</p>
              <p className="text-xl font-bold text-yellow-600">
                {stats.lastMonth.badges}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Metrics */}
      {stats?.engagement && (
        <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Engagement Metrics
          </h2>
          <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Active Users (7d)</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.engagement.activeUsersCount}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Avg Comments/Post</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.engagement.avgCommentsPerPost}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Avg Likes/Post</p>
              <p className="text-2xl font-bold text-pink-600">
                {stats.engagement.avgLikesPerPost}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Avg Group Members</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.engagement.avgGroupMembers}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Engagement Rate</p>
              <p className="text-2xl font-bold text-indigo-600">
                {stats.engagement.engagementRate}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Community Growth 2025
        </h1>
        <div className="w-full h-80 lg:h-[320px]">
          {userGroupShopLoading && !userGroupShopStats ? (
            <SpinnerLoading />
          ) : (
            <ColumnChart data={userGroupShopStats} />
          )}
        </div>
      </div>
      <div className="w-full bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="size-5 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">
            Content Activity
          </h1>
        </div>
        <div className="w-full h-80">
          {postCommentReactionLoading && !postCommentReactionStats ? (
            <SpinnerLoading />
          ) : (
            <ColumnChart data={postCommentReactionStats} />
          )}
        </div>
      </div>

      {/* Charts Row 2: Activity & Demographics */}
      <div className="mt-6 flex lg:flex-row flex-col gap-4">
        <div className="lg:w-[60%] w-full bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="size-5 text-green-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              7-Day Activity Trends
            </h1>
          </div>
          <div className="w-full h-80">
            {recentActivityLoading && !recentActivity ? (
              <SpinnerLoading />
            ) : (
              <LineChart data={recentActivity} />
            )}
          </div>
        </div>
        <div className="lg:w-[40%] w-full bg-white p-4 rounded-xl shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">
            User Demographics
          </h1>
          <div className="w-full h-64 lg:h-80 flex items-center justify-center">
            {genderLoading && !genderStats ? (
              <SpinnerLoading />
            ) : (
              <PieChart data={pieChartData} />
            )}
          </div>
        </div>
      </div>

      {/* Top Users & Group Stats */}
      <div className="mt-6 flex lg:flex-row flex-col gap-4">
        <div className="lg:w-[50%] w-full bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="size-5 text-purple-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              Top Contributors
            </h1>
          </div>
          <div className="space-y-2">
            {topUsersLoading && !topUsers ? (
              <SpinnerLoading />
            ) : (
              topUsers?.slice(0, 5)?.map((user, index) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <img
                        src={getBackendImgURL(user.avatar)}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <p className="font-semibold text-gray-800">
                        {user.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {user.postCount}
                    </p>
                    <p className="text-xs text-gray-500">posts</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="lg:w-[50%] w-full bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <UsersRound className="size-5 text-indigo-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              Top Groups
            </h1>
          </div>
          <div className="space-y-3">
            {groupStatsLoading && !groupStats ? (
              <SpinnerLoading />
            ) : (
              <>
                <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Groups</p>
                      <p className="text-3xl font-bold text-indigo-600">
                        {groupStats?.totalGroups || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">New Last Month</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {groupStats?.lastMonthGroups || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Top 5 by Members:
                  </p>
                  {groupStats?.topGroups?.slice(0, 5)?.map((group, index) => (
                    <div
                      key={group._id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-400">
                          #{index + 1}
                        </span>
                        <img
                          src={getBackendImgURL(group.avatar)}
                          alt={group.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <p className="text-sm font-semibold text-gray-800">
                          {group.name}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-indigo-600">
                        {group.memberCount} members
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Shop Performance */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Store className="size-5 text-amber-600" />
          <h1 className="text-xl font-semibold text-gray-800">
            Shop Performance
          </h1>
        </div>
        {shopStatsLoading && !shopStats ? (
          <SpinnerLoading />
        ) : (
          <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mb-4">
              <div className="p-4 bg-amber-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Shops</p>
                <p className="text-3xl font-bold text-amber-600">
                  {shopStats?.totalShops || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-green-600">
                  {shopStats?.totalProducts || 0}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Avg Products/Shop</p>
                <p className="text-3xl font-bold text-orange-600">
                  {shopStats?.avgProductsPerShop || 0}
                </p>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">New Shops Last Month</p>
                <p className="text-2xl font-bold text-amber-600">
                  {shopStats?.lastMonth?.shops || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <p className="text-sm text-gray-600">New Products Last Month</p>
                <p className="text-2xl font-bold text-green-600">
                  {shopStats?.lastMonth?.products || 0}
                </p>
              </div>
            </div>
            {shopStats?.topShops && shopStats.topShops.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Top Shops by Products:
                </p>
                <div className="space-y-2">
                  {shopStats.topShops.slice(0, 5).map((shop, index) => (
                    <div
                      key={shop._id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-400">
                          #{index + 1}
                        </span>
                        <img
                          src={getBackendImgURL(shop.shopAvatar)}
                          alt={shop.shopName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <p className="text-sm font-semibold text-gray-800">
                          {shop.shopName}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-amber-600">
                        {shop.productCount} products
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
