import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI, AnalyticsData } from '../services/api';
import SimpleChart, { chartConfigs } from '../components/SimpleChart';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    if (user?.walletAddress) {
      fetchAnalytics();
    }
  }, [user, period]);

  const fetchAnalytics = async () => {
    if (!user?.walletAddress) return;
    
    try {
      setLoading(true);
      const response = await analyticsAPI.getOverview(user.walletAddress, period);
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">Deep insights into your XP earning patterns</p>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">Deep insights into your XP earning patterns</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">Deep insights into your XP earning patterns</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPeriod('7d')}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              period === '7d' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              period === '30d' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setPeriod('90d')}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              period === '90d' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total XP</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.totalXP.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Weekly Growth</dt>
                  <dd className="text-lg font-medium text-gray-900">+{analytics.weeklyGrowth}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Growth</dt>
                  <dd className="text-lg font-medium text-gray-900">+{analytics.monthlyGrowth}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Apps */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Apps by XP</h3>
          <div className="space-y-4">
            {analytics.topApps.map((app, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{app.name}</p>
                    <p className="text-sm text-gray-500">{app.percentage}% of total XP</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{app.xp.toLocaleString()} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* XP Growth Chart */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">XP Growth Over Time</h3>
          <div className="h-64">
            <SimpleChart
              type="line"
              data={{
                labels: analytics.xpTrend.map(point => point.date),
                datasets: [
                  {
                    label: 'XP Earned',
                    data: analytics.xpTrend.map(point => point.xp),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                  },
                ],
              }}
              options={chartConfigs.xpTrend.options}
            />
          </div>
        </div>
      </div>

      {/* XP Distribution Chart */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">XP Distribution by App</h3>
          <div className="h-64">
            <SimpleChart
              type="doughnut"
              data={{
                labels: analytics.topApps.map(app => app.name),
                datasets: [
                  {
                    data: analytics.topApps.map(app => app.xp),
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(16, 185, 129, 0.8)',
                      'rgba(245, 158, 11, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(139, 92, 246, 0.8)',
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                  },
                ],
              }}
              options={chartConfigs.xpDistribution.options}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

