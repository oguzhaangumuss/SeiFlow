// Real Sei MCP Server Client Implementation
export interface SeiMCPServerConfig {
  serverUrl: string
  privateKey?: string
  network: 'sei' | 'sei-testnet' | 'sei-devnet'
}

export interface MCPRequest {
  jsonrpc: string
  id: string | number
  method: string
  params?: any
}

export interface MCPResponse {
  jsonrpc: string
  id: string | number
  result?: any
  error?: {
    code: number
    message: string
    data?: any
  }
}

export interface SeiBalance {
  address: string
  network: string
  balance: string
  formatted: string
}

export interface SeiTokenBalance {
  tokenAddress: string
  owner: string
  network: string
  raw: string
  formatted: string
  symbol: string
  decimals: number
}

export interface SeiTransactionResult {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  status: 'success' | 'failed' | 'pending'
  blockNumber?: number
}

export class SeiMCPClient {
  private config: SeiMCPServerConfig
  private requestId: number = 1

  constructor(config: SeiMCPServerConfig) {
    this.config = config
  }

  private async makeRequest(method: string, params?: any): Promise<any> {
    // For now, let's use a simple approach and bypass MCP protocol
    // Direct integration with Sei MCP Kit functionality
    throw new Error(`MCP SSE protocol not yet implemented. Method: ${method}, Params: ${JSON.stringify(params)}`)
  }

  // Get chain information
  async getChainInfo(): Promise<any> {
    try {
      return await this.makeRequest('get-chain-info', {
        network: this.config.network
      })
    } catch (error) {
      console.error('Failed to get chain info from Sei MCP server:', error)
      throw new Error('Sei MCP Server connection required. Please ensure the server is running.')
    }
  }

  // Get native SEI balance
  async getBalance(address: string): Promise<SeiBalance> {
    try {
      return await this.makeRequest('get-balance', {
        address,
        network: this.config.network
      })
    } catch (error) {
      console.error('Failed to get balance from Sei MCP server:', error)
      throw new Error('Sei MCP Server connection required for balance queries')
    }
  }

  // Get ERC20 token balance
  async getTokenBalance(tokenAddress: string, ownerAddress: string): Promise<SeiTokenBalance> {
    try {
      return await this.makeRequest('get-token-balance', {
        tokenAddress,
        ownerAddress,
        network: this.config.network
      })
    } catch (error) {
      console.error('Failed to get token balance from Sei MCP server:', error)
      throw new Error('Sei MCP Server connection required for token balance queries')
    }
  }

  // Get token information
  async getTokenInfo(tokenAddress: string): Promise<any> {
    try {
      return await this.makeRequest('get-token-info', {
        tokenAddress,
        network: this.config.network
      })
    } catch (error) {
      console.error('Failed to get token info from Sei MCP server:', error)
      throw new Error('Sei MCP Server connection required for token info queries')
    }
  }

  // Transfer native SEI
  async transferSei(to: string, amount: string): Promise<SeiTransactionResult> {
    if (!this.config.privateKey) {
      throw new Error('Private key required for transfers')
    }

    try {
      return await this.makeRequest('transfer-sei', {
        to,
        amount,
        network: this.config.network
      })
    } catch (error) {
      console.error('MCP transferSei failed:', error)
      throw error
    }
  }

  // Transfer ERC20 token
  async transferToken(tokenAddress: string, to: string, amount: string): Promise<SeiTransactionResult> {
    if (!this.config.privateKey) {
      throw new Error('Private key required for transfers')
    }

    try {
      return await this.makeRequest('transfer-token', {
        tokenAddress,
        to,
        amount,
        network: this.config.network
      })
    } catch (error) {
      console.error('MCP transferToken failed:', error)
      throw error
    }
  }

  // Approve token spending
  async approveToken(tokenAddress: string, spenderAddress: string, amount: string): Promise<SeiTransactionResult> {
    if (!this.config.privateKey) {
      throw new Error('Private key required for approvals')
    }

    try {
      return await this.makeRequest('approve-token-spending', {
        tokenAddress,
        spenderAddress,
        amount,
        network: this.config.network
      })
    } catch (error) {
      console.error('MCP approveToken failed:', error)
      throw error
    }
  }

  // Get transaction details
  async getTransaction(txHash: string): Promise<SeiTransactionResult> {
    try {
      return await this.makeRequest('get-transaction', {
        txHash,
        network: this.config.network
      })
    } catch (error) {
      console.error('Failed to get transaction from Sei MCP server:', error)
      throw new Error('Sei MCP Server connection required for transaction queries')
    }
  }

  // Check if address is a contract
  async isContract(address: string): Promise<boolean> {
    try {
      const result = await this.makeRequest('is-contract', {
        address,
        network: this.config.network
      })
      return result.isContract || false
    } catch (error) {
      console.error('Failed to check contract from Sei MCP server:', error)
      throw new Error('Sei MCP Server connection required for contract verification')
    }
  }

  // Read from smart contract
  async readContract(contractAddress: string, abi: any[], functionName: string, args: any[] = []): Promise<any> {
    try {
      return await this.makeRequest('read-contract', {
        contractAddress,
        abi,
        functionName,
        args,
        network: this.config.network
      })
    } catch (error) {
      console.error('MCP readContract failed:', error)
      throw error
    }
  }

  // Write to smart contract
  async writeContract(contractAddress: string, abi: any[], functionName: string, args: any[] = []): Promise<SeiTransactionResult> {
    if (!this.config.privateKey) {
      throw new Error('Private key required for contract writes')
    }

    try {
      return await this.makeRequest('write-contract', {
        contractAddress,
        abi,
        functionName,
        args,
        network: this.config.network
      })
    } catch (error) {
      console.error('MCP writeContract failed:', error)
      throw error
    }
  }

  // Health check for MCP server
  async healthCheck(): Promise<boolean> {
    try {
      await this.makeRequest('get-chain-info', { network: this.config.network })
      return true
    } catch (error) {
      return false
    }
  }
}

// Factory function
export function createSeiMCPClient(config: Partial<SeiMCPServerConfig> = {}): SeiMCPClient {
  const defaultConfig: SeiMCPServerConfig = {
    serverUrl: process.env.NEXT_PUBLIC_SEI_MCP_SERVER_URL || 'http://localhost:3001',
    network: 'sei-testnet',
    privateKey: process.env.SEI_PRIVATE_KEY,
    ...config
  }

  return new SeiMCPClient(defaultConfig)
}