'use client'

import React from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { seiTestnet } from '@/lib/wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

import '@rainbow-me/rainbowkit/styles.css'

const config = getDefaultConfig({
  appName: 'SeiFlow',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  chains: [seiTestnet, mainnet, sepolia],
  ssr: true,
})

const queryClient = new QueryClient()

interface WalletProviderProps {
  children: React.ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}