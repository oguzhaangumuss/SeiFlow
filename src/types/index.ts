// Core types for SeiFlow - Strategic Showcase

export type Address = `0x${string}`
export type ChainId = number

export interface Chain {
  id: ChainId
  name: string
  symbol: string
  rpcUrl: string
  explorer: string
}

export interface Token {
  address: Address
  symbol: string
  name: string
  decimals: number
  chainId: ChainId
}

export interface Intent {
  id: string
  userInput: string
  type: 'transfer' | 'bridge' | 'swap' | 'stake'
  fromChain?: ChainId
  toChain?: ChainId
  amount?: string
  token?: Token
  targetAddress?: Address
  status: 'parsing' | 'ready' | 'executing' | 'completed' | 'failed'
}

export interface ExecutionPlan {
  id: string
  steps: ExecutionStep[]
  estimatedCost: string
  estimatedTime: number
  riskScore: number
}

export interface ExecutionStep {
  id: string
  type: 'bridge' | 'transfer' | 'approve'
  description: string
  cost: string
  timeEstimate: number
  status: 'pending' | 'executing' | 'completed' | 'failed'
}

export interface WalletState {
  address?: Address
  isConnected: boolean
  chainId?: ChainId
  balance?: string
}