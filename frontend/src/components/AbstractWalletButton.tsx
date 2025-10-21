import React from 'react';
import { usePrivy, useCrossAppAccounts } from '@privy-io/react-auth';

interface AbstractWalletButtonProps {
  onSuccess?: (walletInfo: any) => void;
  onError?: (error: Error) => void;
}

export const AbstractWalletButton: React.FC<AbstractWalletButtonProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const { ready, authenticated } = usePrivy();
  const { loginWithCrossAppAccount } = useCrossAppAccounts();

  const handleAbstractLogin = async () => {
    try {
      if (!ready || !authenticated) {
        throw new Error('Privy not ready or user not authenticated');
      }

      // Replace with your actual Abstract provider app ID
      const abstractAppId = process.env.REACT_APP_ABSTRACT_APP_ID || 'your-abstract-app-id';
      
      const result = await loginWithCrossAppAccount({ 
        appId: abstractAppId 
      });

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Abstract wallet login error:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  };

  return (
    <button
      onClick={handleAbstractLogin}
      disabled={!ready || !authenticated}
      className="flex items-center gap-x-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
    >
      Connect Abstract Wallet
    </button>
  );
};

export default AbstractWalletButton;
