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

  const getRowColor = (index) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-gray-800 font-bold"; // 🥇 Top 1 vàng rực
    if (index === 1) return "bg-gradient-to-r from-gray-400 to-gray-300 hover:from-gray-500 hover:to-gray-400 text-gray-800 font-bold"; // 🥈 Top 2 bạc sáng
    if (index === 2) return "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-gray-800 font-bold"; // 🥉 Top 3 đồng ánh kim
    return index % 2 === 0 ? "bg-gray-50 hover:bg-blue-50" : "bg-white hover:bg-blue-50"; // Các dòng còn lại
  };

  const getMedalIcon = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 mt-10 overflow-visible">
      <h1 className="text-4xl md:text-5xl leading-tight font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 mb-6 animate-pulse drop-shadow-lg break-words overflow-visible">
        🌟 Bảng Xếp Hạng Tổng 🌟
      </h1>

      <div className="overflow-x-auto rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl text-center">
          <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <tr>
              <th className="px-6 py-3 font-bold">Hạng</th>
              <th className="px-6 py-3 font-bold">Người Chơi</th>
              <th className="px-6 py-3 font-bold">Tổng Điểm</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr
                key={player.user?._id || index}
                className={`transition ${getRowColor(index)}`}
              >
                <td className="px-6 py-4 font-semibold text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-gray-700">
                  <div className="flex items-center justify-center gap-2">
                    {player.user?.avatar && (
                      <img
                        src={`${Config.BACKEND_URL}${player.user.avatar}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="flex items-center gap-1">
                      {getMedalIcon(index) && <span>{getMedalIcon(index)}</span>}
                      {player.user?.fullName || "Ẩn danh"}
                    </span>
                  </div>
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
