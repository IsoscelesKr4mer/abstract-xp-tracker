import React from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';

const Leaderboard: React.FC = () => {
  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, wallet: '0x1234...5678', xp: 50000, level: 50, change: '+5' },
    { rank: 2, wallet: '0x2345...6789', xp: 48500, level: 48, change: '+2' },
    { rank: 3, wallet: '0x3456...7890', xp: 47000, level: 47, change: '-1' },
    { rank: 4, wallet: '0x4567...8901', xp: 45000, level: 45, change: '+3' },
    { rank: 5, wallet: '0x5678...9012', xp: 43000, level: 43, change: '+1' },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-medium text-gray-500">#{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="mt-2 text-gray-600">See how you rank against other Abstract users</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Global Rankings</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md">
                Global
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Friends
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {leaderboard.map((user) => (
              <div key={user.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(user.rank)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.wallet}</p>
                    <p className="text-sm text-gray-500">Level {user.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.xp.toLocaleString()} XP</p>
                  <p className={`text-sm ${user.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {user.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

