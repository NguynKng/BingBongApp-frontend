import { useState, useEffect } from "react";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    // Sắp xếp theo điểm từ cao đến thấp
    storedLeaderboard.sort((a, b) => b.score - a.score);
    setLeaderboard(storedLeaderboard);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng Xếp Hạng</h1>
      <table className="min-w-full table-auto bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b text-left text-lg font-semibold text-gray-700">#</th>
            <th className="px-6 py-3 border-b text-left text-lg font-semibold text-gray-700">Tên Người Chơi</th>
            <th className="px-6 py-3 border-b text-left text-lg font-semibold text-gray-700">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr key={index}>
              <td className="px-6 py-3 border-b text-lg text-gray-700">{index + 1}</td>
              <td className="px-6 py-3 border-b text-lg text-gray-700">{player.name}</td>
              <td className="px-6 py-3 border-b text-lg text-gray-700">{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;