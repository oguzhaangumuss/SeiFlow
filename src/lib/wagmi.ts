import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Sei Network Chain Definition
export const seiTestnet = {
  id: 713715,
  name: 'Sei Atlantic-2',
  nativeCurrency: {
    name: 'SEI',
    symbol: 'SEI',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://evm-rpc-testnet.sei-apis.com'] },
    public: { http: ['https://evm-rpc-testnet.sei-apis.com'] },
  },
  blockExplorers: {
    default: { 
      name: 'Seitrace', 
      url: 'https://seitrace.com/?chain=atlantic-2' 
    },
  },
  testnet: true,
} as const

// Wagmi Configuration
export const config = createConfig({
  chains: [seiTestnet, mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '' 
    }),
  ],
  transports: {
    [seiTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}