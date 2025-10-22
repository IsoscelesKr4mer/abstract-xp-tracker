import React, { useState, useEffect } from 'react';
import { Medal, Crown } from 'lucide-react';
import { leaderboardAPI } from '../services/api';

interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  totalXP: number;
  level: number;
  badges: number;
  weeklyChange: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        console.log('Fetching leaderboard data from backend...');
        
        const response = await leaderboardAPI.getGlobal(10);
        console.log('Leaderboard response:', response.data);
        
        if (response.data.success) {
          setLeaderboard(response.data.data);
        } else {
          setError('Failed to fetch leaderboard data');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to fetch leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-medium text-gray-500">#{rank}</span>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="mt-2 text-gray-600">See how you rank against other Abstract users</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="mt-2 text-gray-600">See how you rank against other Abstract users</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            {leaderboard.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No leaderboard data available yet.</p>
                <p className="text-sm mt-2">Be the first to earn XP!</p>
              </div>
            ) : (
              leaderboard.map((user) => (
                <div key={user.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                      </p>
                      <p className="text-sm text-gray-500">Level {user.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.totalXP.toLocaleString()} XP</p>
                    <p className={`text-sm ${user.weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {user.weeklyChange >= 0 ? '+' : ''}{user.weeklyChange}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

