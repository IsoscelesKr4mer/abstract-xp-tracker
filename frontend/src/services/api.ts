import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Ensure API_BASE_URL ends with /api
const normalizedBaseURL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: normalizedBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export interface User {
  walletAddress: string;
  username: string;
  totalXP: number;
  level: number;
  badges: Badge[];
  friends: Friend[];
  preferences: UserPreferences;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
  icon: string;
}

export interface Friend {
  walletAddress: string;
  username: string;
  totalXP: number;
  isOnline: boolean;
}

export interface UserPreferences {
  notifications: boolean;
  privacy: 'public' | 'private' | 'friends';
  theme: 'light' | 'dark' | 'auto';
}

export interface XPData {
  walletAddress: string;
  totalXP: number;
  level: number;
  rank: number;
  badges: Badge[];
  recentActivity: Activity[];
  weeklyXP: number;
  monthlyXP: number;
  allTimeXP: number;
}

export interface Activity {
  app: string;
  xp: number;
  timestamp: string;
  type: string;
}

export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  totalXP: number;
  level: number;
  badges: number;
  weeklyChange: number;
}

export interface AnalyticsData {
  walletAddress: string;
  period: string;
  totalXP: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  topApps: AppXP[];
  xpTrend: XPTrend[];
  badgesEarned: number;
  levelProgress: number;
  rankChange: number;
  achievements: Achievement[];
}

export interface AppXP {
  name: string;
  xp: number;
  percentage: number;
}

export interface XPTrend {
  date: string;
  xp: number;
}

export interface Achievement {
  name: string;
  value: number;
  max: number;
}

// Auth API
export const authAPI = {
  login: (walletAddress: string, signature: string, message: string) =>
    api.post('/auth/login', { walletAddress, signature, message }),
  
  logout: () =>
    api.post('/auth/logout'),
  
  verify: () =>
    api.get('/auth/verify'),
};

// User API
export const userAPI = {
  getProfile: (walletAddress: string) =>
    api.get(`/users/profile/${walletAddress}`),
  
  updateProfile: (walletAddress: string, updates: Partial<User>) =>
    api.put(`/users/profile/${walletAddress}`, updates),
  
  getFriends: (walletAddress: string) =>
    api.get(`/users/friends/${walletAddress}`),
};

// XP API
export const xpAPI = {
  getUserXP: (walletAddress: string) =>
    api.get(`/xp/user/${walletAddress}`),
  
  getXPHistory: (walletAddress: string, period?: string, limit?: number) =>
    api.get(`/xp/history/${walletAddress}`, { params: { period, limit } }),
  
  getApps: () =>
    api.get('/xp/apps'),
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobal: (limit?: number, offset?: number) =>
    api.get('/leaderboard/global', { params: { limit, offset } }),
  
  getAppLeaderboard: (appId: string, limit?: number, offset?: number) =>
    api.get(`/leaderboard/app/${appId}`, { params: { limit, offset } }),
  
  getFriendsLeaderboard: (walletAddress: string) =>
    api.get(`/leaderboard/friends/${walletAddress}`),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (walletAddress: string, period?: string) =>
    api.get(`/analytics/overview/${walletAddress}`, { params: { period } }),
  
  getComparison: (walletAddress: string, compareWith: string) =>
    api.get(`/analytics/comparison/${walletAddress}`, { params: { compareWith } }),
};

export default api;
