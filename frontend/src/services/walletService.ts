// Abstract Wallet Service with Privy integration
export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  isConnected: boolean;
  isAbstractWallet: boolean;
  network: string;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}

class AbstractWalletService {
  private provider: any = null;
  private signer: any = null;
  private walletInfo: WalletInfo | null = null;
  private isAbstractEcosystem = false;

  constructor() {
    this.checkAbstractEcosystem();
    this.initializePrivy();
  }

  private checkAbstractEcosystem(): void {
    // Check if we're in the Abstract ecosystem
    this.isAbstractEcosystem = typeof window !== 'undefined' && 
      (window.location.hostname.includes('abs.xyz') || 
       window.location.hostname.includes('abstract.xyz') ||
       localStorage.getItem('abstract_wallet_connected') === 'true');
  }

  private async initializePrivy(): Promise<void> {
    // Note: Privy SDK integration removed due to dependency conflicts
    // This is a simulation-only implementation for development
    console.log('Using Abstract wallet simulation - real Privy integration requires proper setup');
  }

  async connectWallet(): Promise<WalletInfo | null> {
    try {
      this.checkAbstractEcosystem();

      if (this.isAbstractEcosystem) {
        return await this.connectAbstractWallet();
      } else {
        return await this.connectMetaMaskWallet();
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  }

  private async connectAbstractWallet(): Promise<WalletInfo> {
    try {
      // For development/testing - show user what's happening
      const shouldProceed = window.confirm(
        'Abstract Wallet Integration\n\n' +
        'This is a development simulation. In production, this would:\n' +
        '• Connect to your Abstract Global Wallet\n' +
        '• Use Privy SDK for authentication\n' +
        '• Provide real blockchain functionality\n\n' +
        'Continue with simulation?'
      );

      if (!shouldProceed) {
        throw new Error('User cancelled Abstract wallet connection');
      }

      // Simulate Abstract wallet connection
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      
      // Store connection state
      localStorage.setItem('abstract_wallet_connected', 'true');
      localStorage.setItem('abstract_wallet_address', mockAddress);

      this.walletInfo = {
        address: mockAddress,
        balance: '0.0',
        chainId: 1, // Ethereum mainnet
        isConnected: true,
        isAbstractWallet: true,
        network: 'Abstract Mainnet (Simulated)'
      };

      return this.walletInfo;
    } catch (error) {
      console.error('Abstract wallet connection error:', error);
      throw error;
    }
  }

  private async connectMetaMaskWallet(): Promise<WalletInfo> {
    try {
      if (!window.ethereum) {
        throw new Error('No wallet found. Please install MetaMask or connect to Abstract ecosystem.');
      }

      const { ethers } = await import('ethers');
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      const network = await this.provider.getNetwork();

      this.walletInfo = {
        address,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
        isConnected: true,
        isAbstractWallet: false,
        network: network.name
      };

      return this.walletInfo;
    } catch (error) {
      console.error('MetaMask wallet connection error:', error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      if (this.isAbstractEcosystem) {
        return await this.signAbstractMessage(message);
      } else {
        return await this.signMetaMaskMessage(message);
      }
    } catch (error) {
      console.error('Message signing error:', error);
      throw error;
    }
  }

  private async signAbstractMessage(message: string): Promise<string> {
    try {
      // Mock signature for Abstract - replace with actual Privy signing
      const mockSignature = '0x' + Math.random().toString(16).substr(2, 130);
      return mockSignature;
    } catch (error) {
      console.error('Abstract message signing error:', error);
      throw error;
    }
  }

  private async signMetaMaskMessage(message: string): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('MetaMask wallet not connected');
      }
      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('MetaMask message signing error:', error);
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
          message,
          isAbstractWallet: this.walletInfo.isAbstractWallet
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
    
    // Clear Abstract wallet state
    localStorage.removeItem('abstract_wallet_connected');
    localStorage.removeItem('abstract_wallet_address');
  }

  getWalletInfo(): WalletInfo | null {
    return this.walletInfo;
  }

  isConnected(): boolean {
    return this.walletInfo?.isConnected || false;
  }

  isAbstractWallet(): boolean {
    return this.walletInfo?.isAbstractWallet || false;
  }

  async switchToAbstractNetwork(): Promise<void> {
    try {
      if (this.isAbstractEcosystem) {
        // Already in Abstract ecosystem
        return;
      }

      // For development/testing, simulate Abstract connection
      const shouldConnect = window.confirm(
        'Switch to Abstract wallet? This will simulate Abstract ecosystem connection for testing.'
      );

      if (shouldConnect) {
        localStorage.setItem('abstract_wallet_connected', 'true');
        this.checkAbstractEcosystem();
        await this.connectWallet();
      }
    } catch (error) {
      console.error('Network switch error:', error);
      throw error;
    }
  }

  // Helper method to detect Abstract ecosystem
  isInAbstractEcosystem(): boolean {
    return this.isAbstractEcosystem;
  }
}

export const walletService = new AbstractWalletService();
