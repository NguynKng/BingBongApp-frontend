import { Column } from "@ant-design/plots";

export default function ColumnChart({ data }) {
  const config = {
    data,
    xField: "type",
    yField: "value",
    seriesField: "group", // separate into Users & Posts
    isGroup: true, // side-by-side columns
    autoFit: true,
    legend: {
      // 👇 specify legend for the 'group' field
      position: "top",
      itemName: {
        style: {
          fontSize: 14,
          fontWeight: "bold",
          fill: ({ group }) => (group === "Users" ? "#2d69e0" : "#f59e0b"),
        },
      },
    },
    colorField: "group", // 👈 ensures legend shows correct colors
    color: ({ group }) => (group === "Users" ? "#2d69e0" : "#f59e0b"),
    label: false
  };

  return <Column {...config} />;
}
