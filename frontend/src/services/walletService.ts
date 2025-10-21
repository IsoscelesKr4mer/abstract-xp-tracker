import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  isConnected: boolean;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}

class WalletService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private walletInfo: WalletInfo | null = null;

  async connectWallet(): Promise<WalletInfo | null> {
    try {
      if (!window.ethereum) {
        throw new Error('No wallet found. Please install MetaMask or another Web3 wallet.');
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      const network = await this.provider.getNetwork();

      this.walletInfo = {
        address,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
        isConnected: true
      };

      return this.walletInfo;
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Message signing error:', error);
      throw error;
    }
  }

  async authenticate(): Promise<AuthResult> {
    try {
      if (!this.walletInfo) {
        throw new Error('Wallet not connected');
      }

      const message = `Welcome to Abstract XP Tracker!\n\nPlease sign this message to authenticate.\n\nWallet: ${this.walletInfo.address}\nTimestamp: ${Date.now()}`;
      const signature = await this.signMessage(message);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: this.walletInfo.address,
          signature,
          message
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null;
    this.signer = null;
    this.walletInfo = null;
  }

  getWalletInfo(): WalletInfo | null {
    return this.walletInfo;
  }

  isConnected(): boolean {
    return this.walletInfo?.isConnected || false;
  }

  async switchToAbstractNetwork(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('No wallet found');
    }

    try {
      // Abstract network configuration
      const abstractNetwork = {
        chainId: '0x1', // Ethereum mainnet for now
        chainName: 'Abstract',
        rpcUrls: [process.env.REACT_APP_ABSTRACT_RPC_URL || 'https://api.abstract.xyz/v1'],
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://etherscan.io'],
      };

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [abstractNetwork],
      });
    } catch (error) {
      console.error('Network switch error:', error);
      throw error;
    }
  }
}

export const walletService = new WalletService();
