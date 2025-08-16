// Sei Network Configuration
export const SEI_NETWORKS = {
  MAINNET: {
    chainId: 531,
    name: 'Sei Network',
    rpcUrl: 'https://evm-rpc.sei-apis.com',
    nativeCurrency: {
      name: 'SEI',
      symbol: 'SEI',
      decimals: 18,
    },
    blockExplorer: 'https://seitrace.com',
  },
  TESTNET: {
    chainId: 713715,
    name: 'Sei Atlantic-2',
    rpcUrl: 'https://evm-rpc-testnet.sei-apis.com',
    nativeCurrency: {
      name: 'SEI',
      symbol: 'SEI',
      decimals: 18,
    },
    blockExplorer: 'https://seitrace.com/?chain=atlantic-2',
  },
  DEVNET: {
    chainId: 713715,
    name: 'Sei Devnet',
    rpcUrl: 'https://evm-rpc-arctic-1.sei-apis.com',
    nativeCurrency: {
      name: 'SEI',
      symbol: 'SEI',
      decimals: 18,
    },
    blockExplorer: 'https://seitrace.com/?chain=arctic-1',
  },
} as const

// Supported Bridges
export const BRIDGES = {
  WORMHOLE: {
    name: 'Wormhole',
    baseUrl: 'https://api.wormhole.com',
    chains: ['ethereum', 'bsc', 'polygon', 'sei'],
  },
  AXELAR: {
    name: 'Axelar',
    baseUrl: 'https://api.axelar.network',
    chains: ['ethereum', 'bsc', 'polygon', 'sei'],
  },
} as const

// Supported Chains for Cross-Chain Operations
export const SUPPORTED_CHAINS = {
  ETHEREUM: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC || 'https://rpc.ankr.com/eth',
  },
  BSC: {
    id: 56,
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    rpcUrl: process.env.NEXT_PUBLIC_BSC_RPC || 'https://rpc.ankr.com/bsc',
  },
  POLYGON: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC || 'https://rpc.ankr.com/polygon',
  },
} as const

// Intent Processing Constants
export const INTENT_TYPES = {
  TRANSFER: 'transfer',
  BRIDGE: 'bridge',
  SWAP: 'swap',
  STAKE: 'stake',
  ARBITRAGE: 'arbitrage',
  PORTFOLIO_REBALANCE: 'portfolio_rebalance',
} as const

// AI Models
export const AI_MODELS = {
  OPENAI: {
    MODEL: 'gpt-4o-mini',
    MAX_TOKENS: 4000,
  },
  ANTHROPIC: {
    MODEL: 'claude-3-sonnet-20240229',
    MAX_TOKENS: 4000,
  },
} as const