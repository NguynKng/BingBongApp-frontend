import { useState, useEffect } from "react";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    storedLeaderboard.sort((a, b) => b.score - a.score);
    setLeaderboard(storedLeaderboard);
  }, []);

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
              <tr
                key={index}
                className={`transition duration-300 ${
                  index % 2 === 0
                    ? "bg-white hover:bg-blue-50"
                    : "bg-blue-50 hover:bg-white"
                }`}
              >
                <td className="px-6 py-4 text-gray-700 font-semibold">{index + 1}</td>
                <td className="px-6 py-4 text-gray-700">{player.name}</td>
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
