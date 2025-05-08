import { useState, useEffect } from "react";
import axios from "axios";
import Config from "../../envVars";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/userScore/leaderboard",
          { withCredentials: true }
        );
        const data = response.data;

        if (Array.isArray(data.leaderboard)) {
          setLeaderboard(data.leaderboard);
        } else {
          throw new Error("Dữ liệu trả về không đúng định dạng");
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy bảng xếp hạng:", err);
        setError("Không thể tải bảng xếp hạng");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-center mt-10 text-xl">⏳ Đang tải bảng xếp hạng...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 mb-8 animate-pulse drop-shadow-lg">
        🌟 Bảng Xếp Hạng Tổng 🌟
      </h1>

      <div className="overflow-x-auto rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl">
          <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-bold">Hạng</th>
              <th className="px-6 py-3 text-left font-bold">Người Chơi</th>
              <th className="px-6 py-3 text-left font-bold">Tổng Điểm</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr
                key={player.user?._id || index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition`}
              >
                <td className="px-6 py-4 font-semibold text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 flex items-center gap-2 text-gray-700">
                  {player.user?.avatar && (
                    <img
                      src={`${Config.BACKEND_URL}${player.user.avatar}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span>{player.user?.fullName || "Ẩn danh"}</span>
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium">{player.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;