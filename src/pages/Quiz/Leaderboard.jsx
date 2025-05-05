import { useState, useEffect } from "react";
import axios from "axios";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null); // Lưu thông báo lỗi
  const [loading, setLoading] = useState(true); // Biến trạng thái loading

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Sửa lại endpoint theo route đúng của bạn
        const response = await axios.get("http://localhost:8000/api/v1/rank/leaderboard", {
          withCredentials: true, // Nếu có dùng cookie để xác thực
        });
        console.log("📌 Dữ liệu trả về từ API:", response.data);
        const data = response.data;

        // Kiểm tra nếu data.leaderboard là mảng thì set vào state
        if (Array.isArray(data.leaderboard)) {
          setLeaderboard(data.leaderboard);
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", data);
        }

        setLoading(false); // Đã tải xong
      } catch (error) {
        console.error("Lỗi khi lấy bảng xếp hạng:", error);
        setError("Lỗi khi tải bảng xếp hạng"); // Lưu thông báo lỗi
        setLoading(false); // Đã tải xong dù có lỗi
      }
    };

    fetchLeaderboard();
  }, []); // Chạy 1 lần khi component mount

  if (loading) {
    return <div>Đang tải bảng xếp hạng...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 mb-8 text-center drop-shadow-lg animate-pulse">
        🌟 Bảng Xếp Hạng 🌟
      </h1>

      <div className="overflow-x-auto rounded-2xl shadow-2xl transform hover:scale-[1.01] transition duration-500">
        <table className="min-w-full table-auto bg-gradient-to-br from-white via-blue-100 to-white border border-gray-300 rounded-xl backdrop-blur-lg">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
              <th className="px-6 py-4 text-left text-lg font-bold">#</th>
              <th className="px-6 py-4 text-left text-lg font-bold">Tên Người Chơi</th>
              <th className="px-6 py-4 text-left text-lg font-bold">Điểm</th>
            </tr>
          </thead>
          <tbody>
          {leaderboard.map((player, index) => (
          <tr key={index} className={`...`}>
            <td className="px-6 py-4 text-gray-700 font-semibold">{index + 1}</td>
            <td className="px-6 py-4 text-gray-700">{player.user?.name || "Ẩn danh"}</td>
            <td className="px-6 py-4 text-gray-700">{player.score}</td>
          </tr>
        ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
