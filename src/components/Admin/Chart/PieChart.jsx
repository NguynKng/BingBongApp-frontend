import { Pie } from "@ant-design/plots";

export default function PieChart({ data }) {
  const config = {
    data: data,
    angleField: "value",
    colorField: "type",
    label: {
      text: "value",
      style: {
        fontWeight: "bold",
        fontSize: 20,
      },
    },
    legend: {
      color: {
        title: true,
        position: "right",
        rowPadding: 5,
      },
    },
  };
  return <Pie {...config} />;
}
