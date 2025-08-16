import { Chain } from '@/types'

export const SEI_MAINNET: Chain = {
  id: 531,
  name: 'Sei Network',
  symbol: 'SEI',
  rpcUrl: 'https://evm-rpc.sei-apis.com',
  explorer: 'https://seitrace.com'
}

export const SEI_TESTNET: Chain = {
  id: 713715,
  name: 'Sei Atlantic-2',
  symbol: 'SEI',
  rpcUrl: 'https://evm-rpc-testnet.sei-apis.com',
  explorer: 'https://seitrace.com/?chain=atlantic-2'
}

export const ETHEREUM: Chain = {
  id: 1,
  name: 'Ethereum',
  symbol: 'ETH',
  rpcUrl: 'https://rpc.ankr.com/eth',
  explorer: 'https://etherscan.io'
}

export const SUPPORTED_CHAINS = [SEI_TESTNET, ETHEREUM] as const

export const getChainById = (chainId: number): Chain | undefined => {
  return SUPPORTED_CHAINS.find(chain => chain.id === chainId)
}