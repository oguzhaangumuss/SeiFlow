// Sei MCP Service Integration
import { SeiMCPClient, createSeiMCPClient } from './sei-mcp-client'

export interface SeiMCPConfig {
  privateKey?: string
  network: 'sei' | 'sei-testnet' | 'sei-devnet'
  rpcUrl?: string
  useMCPServer?: boolean
  mcpServerUrl?: string
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
  private mcpClient?: SeiMCPClient

  constructor(config: SeiMCPConfig) {
    this.config = config
    
    // Initialize MCP client if requested
    if (config.useMCPServer) {
      this.mcpClient = createSeiMCPClient({
        serverUrl: config.mcpServerUrl || 'http://localhost:3001',
        network: config.network,
        privateKey: config.privateKey
      })
    }
  }

  // Chain Information
  async getChainInfo(): Promise<SeiChainInfo> {
    try {
      if (this.mcpClient) {
        // Use real MCP server
        const info = await this.mcpClient.getChainInfo()
        return {
          chainId: info.chainId,
          blockNumber: info.blockNumber || 0,
          rpcUrl: info.rpcUrl,
          network: this.config.network
        }
      }

      // No fallback - Sei MCP Server required
      throw new Error('Sei MCP Server connection required. Please start the MCP server with: npm run sei-mcp')
    } catch (error) {
      throw new Error(`Failed to get chain info: ${error}`)
    }
  }

  // Native Token Balance
  async getBalance(address: string): Promise<string> {
    try {
      if (this.mcpClient) {
        // Use real MCP server
        const balance = await this.mcpClient.getBalance(address)
        return balance.balance
      }

      // No fallback - Sei MCP Server required
      throw new Error('Sei MCP Server connection required for balance queries')
    } catch (error) {
      throw new Error(`Failed to get balance: ${error}`)
    }
  }

  // Token Information
  async getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
    try {
      // No fallback - Sei MCP Server required
      throw new Error('Sei MCP Server connection required for token info queries')
    } catch (error) {
      throw new Error(`Failed to get token info: ${error}`)
    }
  }

  // Token Balance
  async getTokenBalance(tokenAddress: string, ownerAddress: string): Promise<TokenBalance> {
    try {
      // No fallback - Sei MCP Server required
      throw new Error('Sei MCP Server connection required for token balance queries')
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

      if (this.mcpClient) {
        // Use real MCP server
        const result = await this.mcpClient.transferSei(to, amount)
        return {
          hash: result.hash,
          from: result.from,
          to: result.to,
          value: result.value,
          gasUsed: result.gasUsed,
          status: result.status,
          blockNumber: result.blockNumber || 0
        }
      }

      // No fallback - Sei MCP Server required for transactions
      throw new Error('Sei MCP Server connection required for SEI transfers')
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

      // No fallback - Sei MCP Server required for transactions
      throw new Error('Sei MCP Server connection required for token transfers')
    } catch (error) {
      throw new Error(`Failed to transfer token: ${error}`)
    }
  }

  // Get Transaction Details
  async getTransaction(txHash: string): Promise<TransactionResult> {
    try {
      // No fallback - Sei MCP Server required
      throw new Error('Sei MCP Server connection required for transaction queries')
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
    useMCPServer: true, // Enable real MCP server by default
    mcpServerUrl: process.env.NEXT_PUBLIC_SEI_MCP_SERVER_URL || 'http://localhost:3001',
    ...config
  }
  
  return new SeiMCPService(defaultConfig)
}