import { Column, Tiny, Pie } from "@ant-design/plots";
import { Table } from "antd";
import {
  DollarSign,
  ShoppingBag,
  SquareRoundCorner,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { shopAPI } from "../../../services/api";
import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import SpinnerLoading from "../../SpinnerLoading";
import { formatDateTimeWithTime } from "../../../utils/timeUtils";
import { getBackendImgURL } from "../../../utils/helper";
import OrderStatus from "../../OrderStatus";
import { formatPriceWithDollar } from "../../../utils/formattedFunction";
import { Link } from "react-router-dom";

// ✅ All sub-components already have memo - GOOD!
const TopProductsTable = memo(({ data }) => {
  // ✅ Memoize columns (không thay đổi)
  const columns = useMemo(
    () => [
      { title: "No.", dataIndex: "key", align: "center" },
      {
        title: "Product",
        dataIndex: "product",
        render: (product) => (
          <div className="flex items-center gap-2">
            <img
              src={getBackendImgURL(product.image)}
              alt={product.name}
              className="size-14 object-cover rounded-lg"
              loading="lazy"
            />
            <span className="text-gray-900 dark:text-white">{product.name}</span>
          </div>
        ),
      },
      { title: "Sales", dataIndex: "sales", align: "center" },
    ],
    []
  );

  // ✅ Memoize table data
  const topProductData = useMemo(
    () =>
      data.map((product, index) => ({
        key: index + 1,
        id: product.product._id,
        product: product.product,
        sales: product.sales,
      })),
    [data]
  );

  return (
    <Table columns={columns} dataSource={topProductData} pagination={false} />
  );
});

TopProductsTable.displayName = "TopProductsTable";

const FollowUnfollowChart = memo(({ data }) => {
  // ✅ Memoize chart data
  const followUnfollowData = useMemo(
    () =>
      data.flatMap((d) => [
        { month: d.month, value: d.follow, type: "Follow" },
        { month: d.month, value: d.unfollow, type: "Unfollow" },
      ]),
    [data]
  );

  return (
    <Column
      data={followUnfollowData}
      isGroup
      xField="month"
      yField="value"
      seriesField="type"
      columnStyle={{ radius: [4, 4, 0, 0] }}
      colorField="type"
      color={["#3b82f6", "#a855f7"]}
      legend={true}
    />
  );
});

FollowUnfollowChart.displayName = "FollowUnfollowChart";

const CategoryDistributionPie = memo(({ data }) => {
  // ✅ Memoize pie data
  const categoryDistribution = useMemo(
    () => data.map((item) => ({ type: item.type, value: item.value })),
    [data]
  );

  return (
    <Pie
      data={categoryDistribution}
      angleField="value"
      colorField="type"
      radius={0.8}
      label={{
        text: "value",
        style: { fontWeight: "bold", fontSize: 20 },
      }}
      legend={{ position: "left", style: { fontSize: 20 } }}
    />
  );
});

CategoryDistributionPie.displayName = "CategoryDistributionPie";

const IncomeColumnChart = memo(({ data }) => {
  // ✅ Memoize income data
  const incomeData = useMemo(
    () => data.map((item) => ({ type: item.month, value: item.income })),
    [data]
  );

  return (
    <Column
      data={incomeData}
      xField="type"
      yField="value"
      height={400}
      autoFit
      style={{ fill: "#2d69e0" }}
      legend={false}
    />
  );
});

IncomeColumnChart.displayName = "IncomeColumnChart";

const StatArea = memo(({ stroke, fill }) => {
  // ✅ Memoize static data
  const data = useMemo(
    () =>
      [264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592].map(
        (value, index) => ({ value, index })
      ),
    []
  );

  return (
    <Tiny.Area
      data={data}
      height={60}
      padding={8}
      shapeField="smooth"
      xField="index"
      yField="value"
      style={{ fill, fillOpacity: 0.6, stroke, lineWidth: 3 }}
    />
  );
});

StatArea.displayName = "StatArea";

const StatCard = memo(
  ({ icon: Icon, color, title, value, percent, fill, stroke }) => (
    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 rounded-md">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center ${color} w-12 h-12 rounded-full`}
          >
            <Icon className="text-white" />
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400 block">{title}</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1">
            <TrendingUp className={color.replace("bg-", "text-")} />
            <span className="text-gray-900 dark:text-white">{percent}%</span>
          </div>
          <span className="text-sm text-gray-400 dark:text-gray-500">Since last week</span>
        </div>
      </div>

      <StatArea fill={fill} stroke={stroke} />
    </div>
  )
);

StatCard.displayName = "StatCard";

const RecentOrdersTable = memo(({ data }) => {
  // ✅ Memoize columns
  const columns = useMemo(
    () => [
      { title: "Order ID", dataIndex: "id", width: 160 },
      {
        title: "Customer",
        dataIndex: "customer",
        render: (customer) => (
          <div className="flex items-center gap-2">
            <img
              src={getBackendImgURL(customer.avatar)}
              alt={customer.fullName}
              className="size-10 object-cover rounded-full"
              loading="lazy"
            />
            <span className="text-gray-900 dark:text-white">{customer.fullName}</span>
          </div>
        ),
      },
      { title: "Total", dataIndex: "total" },
      {
        title: "Status",
        dataIndex: "status",
        render: (status) => <OrderStatus status={status} />,
      },
      { title: "Created At", dataIndex: "createdAt" },
      {
        title: "Details",
        dataIndex: "details",
        align: "center",
        render: (_, record) => (
          <Link
            to={`/order/${record.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            View
          </Link>
        ),
      },
    ],
    []
  );

  // ✅ Memoize table data
  const recentOrdersData = useMemo(
    () =>
      data.map((order) => ({
        key: order._id,
        id: order.orderId,
        total: formatPriceWithDollar(order.total),
        customer: order.orderBy,
        status: order.orderStatus,
        createdAt: formatDateTimeWithTime(order.createdAt),
      })),
    [data]
  );

  return (
    <Table
      columns={columns}
      dataSource={recentOrdersData}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
});

RecentOrdersTable.displayName = "RecentOrdersTable";

const TopCustomersTable = memo(({ data }) => {
  // ✅ Memoize columns
  const columns = useMemo(
    () => [
      {
        title: "Customer",
        dataIndex: "customer",
        render: (customer) => (
          <div className="flex items-center gap-2">
            <img
              src={getBackendImgURL(customer.avatar)}
              alt={customer.fullName}
              className="size-10 object-cover rounded-full"
              loading="lazy"
            />
            <span className="text-gray-900 dark:text-white">{customer.fullName}</span>
          </div>
        ),
      },
      { title: "Total", dataIndex: "totalSpent" },
      { title: "Order", dataIndex: "orderCount" },
    ],
    []
  );

  // ✅ Memoize table data
  const topCustomersData = useMemo(
    () =>
      data.map((item) => ({
        key: item.user._id,
        totalSpent: formatPriceWithDollar(item.totalSpent),
        orderCount: item.orderCount,
        customer: item.user,
      })),
    [data]
  );

  return (
    <Table columns={columns} dataSource={topCustomersData} pagination={false} />
  );
});

TopCustomersTable.displayName = "TopCustomersTable";

// ✅ Extract TopReviews component
const TopReviews = memo(({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <p className="text-gray-700 dark:text-gray-300 text-sm">
        No reviews available.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
      {reviews.slice(0, 5).map((r, idx) => (
        <ReviewCard key={`${r._id || idx}`} review={r} />
      ))}
    </div>
  );
});

TopReviews.displayName = "TopReviews";

// ✅ Extract ReviewCard
const ReviewCard = memo(({ review: r }) => (
  <div className="flex gap-3 py-4 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition rounded-md">
    {r.postedBy && (
      <img
        src={getBackendImgURL(r.postedBy.avatar)}
        alt={r.postedBy.fullName}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        loading="lazy"
      />
    )}

    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-medium text-gray-900 dark:text-white text-sm truncate">
          {r.productName}
        </h2>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${
                i < r.star
                  ? "text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.285-3.955a1 1 0 00-.364-1.118L2.049 9.382c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.955z" />
            </svg>
          ))}
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-1">
        {r.comment || "No comment"}
      </p>

      {r.postedBy && (
        <span className="text-gray-800 dark:text-gray-200 text-xs font-medium">
          {r.postedBy.fullName}
        </span>
      )}
    </div>
  </div>
));

ReviewCard.displayName = "ReviewCard";

// ✅ Main component với memo
const DashboardTab = memo(({ shop }) => {
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    income: [],
    categories: [],
    topProducts: [],
    recentOrders: [],
    topReviewedProducts: [],
    topCustomers: [],
    followUnfollowStats: [],
  });

  const [loading, setLoading] = useState(false);

  // ✅ useCallback for fetch
  const fetchData = useCallback(async () => {
    setLoading(true);

    const [
      statsResult,
      incomeResult,
      categoryResult,
      topProductResult,
      recentOrderResult,
      topReviewedProductResult,
      topCustomerResult,
      followUnfollowStatsResult,
    ] = await Promise.allSettled([
      shopAPI.getShopStats(shop._id),
      shopAPI.getShopIncome(shop._id),
      shopAPI.getShopCategoryDistribution(shop._id),
      shopAPI.getShopTopProduct(shop._id),
      shopAPI.getShopRecentOrders(shop._id),
      shopAPI.getShopProductRatings(shop._id),
      shopAPI.getShopTopCustomers(shop._id),
      shopAPI.getShopFollowStats(shop._id),
    ]);

    setDashboardData({
      stats: statsResult.status === "fulfilled" ? statsResult.value.data : {},
      income:
        incomeResult.status === "fulfilled" ? incomeResult.value.data : [],
      categories:
        categoryResult.status === "fulfilled" ? categoryResult.value.data : [],
      topProducts:
        topProductResult.status === "fulfilled"
          ? topProductResult.value.data
          : [],
      recentOrders:
        recentOrderResult.status === "fulfilled"
          ? recentOrderResult.value.data
          : [],
      topReviewedProducts:
        topReviewedProductResult.status === "fulfilled"
          ? topReviewedProductResult.value.data
          : [],
      topCustomers:
        topCustomerResult.status === "fulfilled"
          ? topCustomerResult.value.data
          : [],
      followUnfollowStats:
        followUnfollowStatsResult.status === "fulfilled"
          ? followUnfollowStatsResult.value.data
          : [],
    });

    setLoading(false);
  }, [shop._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Memoize stats array
  const stats = useMemo(
    () => [
      {
        icon: ShoppingBag,
        color: "bg-green-500",
        title: "Total Sales",
        value: dashboardData.stats.totalSales,
        percent: dashboardData.stats.salesGrowth,
        fill: "#92e67e",
        stroke: "#229407",
      },
      {
        icon: DollarSign,
        color: "bg-red-500",
        title: "Total Income",
        value: dashboardData.stats.totalIncome,
        percent: dashboardData.stats.incomeGrowth,
        fill: "#e0796e",
        stroke: "#c21e0c",
      },
      {
        icon: SquareRoundCorner,
        color: "bg-yellow-400",
        title: "Total Orders",
        value: dashboardData.stats.totalOrders,
        percent: dashboardData.stats.ordersGrowth,
        fill: "#ede795",
        stroke: "#ebde2d",
      },
      {
        icon: UsersRound,
        color: "bg-blue-500",
        title: "Total Followers",
        value: dashboardData.stats.totalFollowers,
        percent: dashboardData.stats.followersGrowth,
        fill: "#d6e3fd",
        stroke: "#2d69e0",
      },
    ],
    [dashboardData.stats]
  );

  return (
    <div className="lg:py-4 lg:px-6">
      {loading ? (
        <SpinnerLoading />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>

          <div className="mt-4 bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-300 dark:border-gray-700">
            <h1 className="text-2xl mb-4 text-gray-900 dark:text-white">Income Statistics</h1>
            <IncomeColumnChart data={dashboardData.income} />
          </div>

          <div className="mt-4 grid lg:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-300 dark:border-gray-700">
              <h1 className="text-xl mb-4 text-gray-900 dark:text-white">Product Category Breakdown</h1>
              <CategoryDistributionPie data={dashboardData.categories} />
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-300 dark:border-gray-700">
              <h1 className="text-xl mb-4 text-gray-900 dark:text-white">Top Selling Products</h1>
              <TopProductsTable data={dashboardData.topProducts} />
            </div>
          </div>

          <div className="mt-4 grid lg:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-300 dark:border-gray-700">
              <h1 className="text-xl mb-4 text-gray-900 dark:text-white">Top Customer</h1>
              <TopCustomersTable data={dashboardData.topCustomers} />
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-300 dark:border-gray-700">
              <h1 className="text-xl mb-4 text-gray-900 dark:text-white">Top Reviews</h1>
              <TopReviews reviews={dashboardData.topReviewedProducts} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-300 dark:border-gray-700 mt-4">
            <h1 className="text-xl mb-4 text-gray-900 dark:text-white">Followers Growth</h1>
            <FollowUnfollowChart data={dashboardData.followUnfollowStats} />
          </div>

          <div className="mt-4 bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-300 dark:border-gray-700">
            <h1 className="text-2xl mb-4 text-gray-900 dark:text-white">Recent Orders</h1>
            <RecentOrdersTable data={dashboardData.recentOrders} />
          </div>
        </>
      )}
    </div>
  );
});

DashboardTab.displayName = "DashboardTab";

export default DashboardTab;