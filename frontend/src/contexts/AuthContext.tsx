import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { walletService, WalletInfo } from '../services/walletService';
import { authAPI, userAPI, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  walletInfo: WalletInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  authenticate: () => Promise<void>;
  disconnect: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await authAPI.verify();
          if (response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const wallet = await walletService.connectWallet();
      setWalletInfo(wallet);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async () => {
    try {
      setIsLoading(true);
      const result = await walletService.authenticate();
      
      if (result.success && result.token) {
        localStorage.setItem('authToken', result.token);
        setUser(result.user);
        setIsAuthenticated(true);
      } else {
        throw new Error(result.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    localStorage.removeItem('authToken');
    walletService.disconnect();
    setUser(null);
    setWalletInfo(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    if (!user?.walletAddress) return;
    
    try {
      const response = await userAPI.getProfile(user.walletAddress);
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value: AuthContextType = {
    user,
    walletInfo,
    isAuthenticated,
    isLoading,
    connectWallet,
    authenticate,
    disconnect,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
