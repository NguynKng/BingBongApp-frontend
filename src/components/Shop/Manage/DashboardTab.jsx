import { Column, Tiny } from "@ant-design/plots";
import {
  DollarSign,
  ShoppingBag,
  SquareRoundCorner,
  TrendingUp,
  UsersRound,
} from "lucide-react";

const DemoColumn = () => {
  const config = {
    data: [
      { type: "January", value: 0.16 },
      { type: "February", value: 0.125 },
      { type: "March", value: 0.24 },
      { type: "April", value: 0.19 },
      { type: "May", value: 0.22 },
      { type: "June", value: 0.05 },
      { type: "July", value: 0.01 },
      { type: "August", value: 0.015 },
      { type: "September", value: 0.22 },
      { type: "October", value: 0.05 },
      { type: "November", value: 0.01 },
      { type: "December", value: 0.015 },
    ],
    xField: "type",
    yField: "value",
    height: 300,
    autoFit: true,
    style: { fill: "#2d69e0" },
    label: {
      text: (d) => (d.value < 0.05 ? `${(d.value * 100).toFixed(1)}%` : ""),
      offset: 10,
    },
    legend: false,
  };
  return <Column {...config} />;
};

const DemoArea = ({ stroke, fill }) => {
  const data = [264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592].map(
    (value, index) => ({ value, index })
  );
  const config = {
    data,
    height: 60,
    padding: 8,
    shapeField: "smooth",
    xField: "index",
    yField: "value",
    style: { fill, fillOpacity: 0.6, stroke, lineWidth: 3 },
  };
  return <Tiny.Area {...config} />;
};

const StatCard = ({
  icon: Icon,
  color,
  title,
  value,
  percent,
  fill,
  stroke,
}) => (
  <div className="border border-gray-300 bg-white p-4 rounded-md">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center justify-center ${color} w-12 h-12 rounded-full`}
        >
          <Icon className="text-white" />
        </div>
        <div>
          <span className="text-gray-600 block">{title}</span>
          <span className="text-2xl font-bold">{value}</span>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1">
          <TrendingUp className={color.replace("bg-", "text-")} />
          <span>{percent}%</span>
        </div>
        <span className="text-sm text-gray-400">Since last week</span>
      </div>
    </div>
    <div className="w-full">
      <DemoArea fill={fill} stroke={stroke} />
    </div>
  </div>
);

export default function DashboardTab() {
  const stats = [
    {
      icon: ShoppingBag,
      color: "bg-green-500",
      title: "Total Sales",
      value: "34,945",
      percent: 4.5,
      fill: "#92e67e",
      stroke: "#229407",
    },
    {
      icon: DollarSign,
      color: "bg-red-500",
      title: "Total Income",
      value: "$34,945",
      percent: 4.5,
      fill: "#e0796e",
      stroke: "#c21e0c",
    },
    {
      icon: SquareRoundCorner,
      color: "bg-yellow-400",
      title: "Total Orders",
      value: "64",
      percent: 4.5,
      fill: "#ede795",
      stroke: "#ebde2d",
    },
    {
      icon: UsersRound,
      color: "bg-blue-500",
      title: "Total Visitors",
      value: "100",
      percent: 4.5,
      fill: "#d6e3fd",
      stroke: "#2d69e0",
    },
  ];

  return (
    <div className="py-4 px-6">
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="mt-4 bg-white p-4 rounded-md">
        <h1 className="text-2xl mb-4">Income Statistics</h1>
        <DemoColumn />
      </div>

      <div className="mt-4 bg-white p-4 rounded-md">
        <h1 className="text-2xl mb-4">Recent Orders</h1>
      </div>
    </div>
  );
}
