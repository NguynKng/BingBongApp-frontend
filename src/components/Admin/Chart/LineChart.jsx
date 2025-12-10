import { Line } from "@ant-design/plots";

export default function LineChart({ data }) {
  if (!data || !data.days) {
    return <div className="text-center text-gray-500 py-10">No activity data available</div>;
  }

  // Transform data from { days: [], users: [], posts: [], comments: [], likes: [] }
  // to array format for Line chart
  const chartData = [];
  const { days, users, posts, comments, likes } = data;

  days.forEach((day, index) => {
    chartData.push(
      { date: day, count: users[index], type: "Users" },
      { date: day, count: posts[index], type: "Posts" },
      { date: day, count: comments[index], type: "Comments" },
      { date: day, count: likes[index], type: "Likes" }
    );
  });

  const config = {
    data: chartData,
    xField: "date",
    yField: "count",
    seriesField: "type",
    smooth: true,
    autoFit: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
    legend: {
      position: "top",
      itemName: {
        style: {
          fontSize: 13,
          fontWeight: "500",
        },
      },
    },
    color: ["#2d69e0", "#10b981", "#f59e0b", "#8b5cf6"],
    point: {
      size: 4,
      shape: "circle",
      style: {
        fill: "white",
        stroke: "#2d69e0",
        lineWidth: 2,
      },
    },
    xAxis: {
      label: {
        autoRotate: false,
        style: {
          fontSize: 11,
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}`,
      },
    },
  };

  return <Line {...config} />;
}
