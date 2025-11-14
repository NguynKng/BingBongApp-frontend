export default function OrderStatus({ status }) {
  const statusStyles = {
    Pending: {
      label: "Pending",
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      dot: "bg-yellow-500",
    },
    Processing: {
      label: "Processing",
      bg: "bg-blue-100",
      text: "text-blue-800",
      dot: "bg-blue-500",
    },
    Shipping: {
      label: "Shipping",
      bg: "bg-purple-100",
      text: "text-purple-800",
      dot: "bg-purple-500",
    },
    Completed: {
      label: "Completed",
      bg: "bg-green-100",
      text: "text-green-800",
      dot: "bg-green-500",
    },
    Cancelled: {
      label: "Cancelled",
      bg: "bg-red-100",
      text: "text-red-800",
      dot: "bg-red-500",
    },
  };

  const style = statusStyles[status] || statusStyles.Pending;

  return (
    <div
      className={`rounded-full w-fit flex items-center justify-center py-2 px-4 ${style.bg} gap-2`}
    >
      <div className={`size-3 rounded-full ${style.dot}`}></div>
      <span className={`text-sm font-medium ${style.text}`}>{style.label}</span>
    </div>
  );
}
