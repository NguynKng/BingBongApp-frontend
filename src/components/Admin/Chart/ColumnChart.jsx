import { Column } from "@ant-design/plots";

export default function ColumnChart({ data }) {
  // Dynamic color mapping for different chart types
  const getColor = (group) => {
    const colorMap = {
      // Community colors
      Users: "#2d69e0",
      Groups: "#8b5cf6",
      Shops: "#f59e0b",
      // Content colors
      Posts: "#10b981",
      Comments: "#3b82f6",
      Reactions: "#ec4899",
      Likes: "#ec4899",
    };
    return colorMap[group] || "#6b7280";
  };

  const config = {
    data,
    xField: "type",
    yField: "value",
    seriesField: "group",
    isGroup: true,
    autoFit: true,
    legend: {
      position: "top",
      itemName: {
        style: {
          fontSize: 13,
          fontWeight: "600",
        },
      },

    },
    colorField: "group",
    color: ({ group }) => getColor(group),
    label: false,
  };

  return <Column {...config} />;
}
