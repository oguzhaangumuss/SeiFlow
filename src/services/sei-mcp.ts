// Sei MCP Service Integration
export interface SeiMCPConfig {
  privateKey?: string
  network: 'sei' | 'sei-testnet' | 'sei-devnet'
  rpcUrl?: string
}

export interface SeiChainInfo {
  chainId: number
  blockNumber: number
  rpcUrl: string
  network: string
}

export interface TokenInfo {
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: string
}

export interface TokenBalance {
  tokenAddress: string
  owner: string
  network: string
  raw: string
  formatted: string
  symbol: string
  decimals: number
}

export interface TransactionResult {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  status: 'success' | 'failed'
  blockNumber: number
}

export class SeiMCPService {
  private config: SeiMCPConfig

  constructor(config: SeiMCPConfig) {
    this.config = config
  }

  // Chain Information
  async getChainInfo(): Promise<SeiChainInfo> {
    try {
      // This would normally call the MCP server
      // For now, return mock data for the selected network
      const chainConfigs = {
        'sei': { chainId: 1329, rpcUrl: 'https://evm-rpc.sei-apis.com' },
        'sei-testnet': { chainId: 1328, rpcUrl: 'https://evm-rpc-testnet.sei-apis.com' },
        'sei-devnet': { chainId: 713715, rpcUrl: 'https://evm-rpc-arctic-1.sei-apis.com' }
      }

      const chainConfig = chainConfigs[this.config.network]
      
      return {
        chainId: chainConfig.chainId,
        blockNumber: 0, // Would be fetched from MCP
        rpcUrl: chainConfig.rpcUrl,
        network: this.config.network
      }
    } catch (error) {
      throw new Error(`Failed to get chain info: ${error}`)
    }
  }

  // Native Token Balance
  async getBalance(address: string): Promise<string> {
    try {
      // Mock implementation - would use MCP tool "get-balance"
      return "1000000000000000000" // 1 SEI in wei
    } catch (error) {
      throw new Error(`Failed to get balance: ${error}`)
    }
  }

  // Token Information
  async getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
    try {
      // Mock implementation - would use MCP tool "get-token-info"
      return {
        address: tokenAddress,
        name: "Mock Token",
        symbol: "MOCK",
        decimals: 18,
        totalSupply: "1000000000000000000000000"
      }
    } catch (error) {
      throw new Error(`Failed to get token info: ${error}`)
    }
  }

  // Token Balance
  async getTokenBalance(tokenAddress: string, ownerAddress: string): Promise<TokenBalance> {
    try {
      // Mock implementation - would use MCP tool "get-token-balance"
      return {
        tokenAddress,
        owner: ownerAddress,
        network: this.config.network,
        raw: "1000000000000000000000",
        formatted: "1000",
        symbol: "MOCK",
        decimals: 18
      }
    } catch (error) {
      throw new Error(`Failed to get token balance: ${error}`)
    }
  }

  // Transfer Native Token (SEI)
  async transferSei(to: string, amount: string): Promise<TransactionResult> {
    try {
      if (!this.config.privateKey) {
        throw new Error('Private key required for transfers')
      }

      // Mock implementation - would use MCP tool "transfer-sei"
      return {
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        from: "0x0000000000000000000000000000000000000000",
        to,
        value: amount,
        gasUsed: "21000",
        status: 'success',
        blockNumber: 1234567
      }
    } catch (error) {
      throw new Error(`Failed to transfer SEI: ${error}`)
    }
  }

  // Transfer ERC20 Token
  async transferToken(tokenAddress: string, to: string, amount: string): Promise<TransactionResult> {
    try {
      if (!this.config.privateKey) {
        throw new Error('Private key required for transfers')
      }

      // Mock implementation - would use MCP tool "transfer-token"
      return {
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        from: "0x0000000000000000000000000000000000000000",
        to: tokenAddress, // Contract address for token transfer
        value: "0", // No ETH value for token transfer
        gasUsed: "65000",
        status: 'success',
        blockNumber: 1234567
      }
    } catch (error) {
      throw new Error(`Failed to transfer token: ${error}`)
    }
  }

  // Get Transaction Details
  async getTransaction(txHash: string): Promise<TransactionResult> {
    try {
      // Mock implementation - would use MCP tool "get-transaction"
      return {
        hash: txHash,
        from: "0x0000000000000000000000000000000000000000",
        to: "0x1111111111111111111111111111111111111111",
        value: "1000000000000000000",
        gasUsed: "21000",
        status: 'success',
        blockNumber: 1234567
      }
    } catch (error) {
      throw new Error(`Failed to get transaction: ${error}`)
    }
  }

  // Utility: Format Wei to Ether
  formatFromWei(wei: string, decimals: number = 18): string {
    const divisor = BigInt(10 ** decimals)
    const value = BigInt(wei)
    const whole = value / divisor
    const remainder = value % divisor
    
    if (remainder === 0n) {
      return whole.toString()
    }
    
    const remainderStr = remainder.toString().padStart(decimals, '0').replace(/0+$/, '')
    return `${whole}.${remainderStr}`
  }

  // Utility: Format Ether to Wei
  formatToWei(ether: string, decimals: number = 18): string {
    const [whole, fraction = ''] = ether.split('.')
    const fractionPadded = fraction.padEnd(decimals, '0').slice(0, decimals)
    const wei = BigInt(whole) * BigInt(10 ** decimals) + BigInt(fractionPadded)
    return wei.toString()
  }
}

// Factory function for creating SeiMCP service
export function createSeiMCPService(config: Partial<SeiMCPConfig> = {}): SeiMCPService {
  const defaultConfig: SeiMCPConfig = {
    network: 'sei-testnet',
    privateKey: process.env.SEI_PRIVATE_KEY,
    ...config
  }
  
  return new SeiMCPService(defaultConfig)
}