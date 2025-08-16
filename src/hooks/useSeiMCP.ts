'use client'

import { useState, useEffect, useCallback } from 'react'
import { SeiMCPService, createSeiMCPService, type SeiChainInfo, type TokenBalance, type TransactionResult } from '@/services/sei-mcp'

interface UseSeiMCPOptions {
  network?: 'sei' | 'sei-testnet' | 'sei-devnet'
  privateKey?: string
}

interface UseSeiMCPReturn {
  seiMCP: SeiMCPService | null
  chainInfo: SeiChainInfo | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
  
  // Methods
  getBalance: (address: string) => Promise<string>
  getTokenBalance: (tokenAddress: string, ownerAddress: string) => Promise<TokenBalance>
  transferSei: (to: string, amount: string) => Promise<TransactionResult>
  transferToken: (tokenAddress: string, to: string, amount: string) => Promise<TransactionResult>
  getTransaction: (txHash: string) => Promise<TransactionResult>
  
  // Utils
  formatFromWei: (wei: string, decimals?: number) => string
  formatToWei: (ether: string, decimals?: number) => string
}

export function useSeiMCP(options: UseSeiMCPOptions = {}): UseSeiMCPReturn {
  const [seiMCP, setSeiMCP] = useState<SeiMCPService | null>(null)
  const [chainInfo, setChainInfo] = useState<SeiChainInfo | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize Sei MCP Service
  useEffect(() => {
    const initializeSeiMCP = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const service = createSeiMCPService({
          network: options.network || 'sei-testnet',
          privateKey: options.privateKey
        })

        setSeiMCP(service)

        // Get chain info to verify connection
        const info = await service.getChainInfo()
        setChainInfo(info)
        setIsConnected(true)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize Sei MCP')
        setIsConnected(false)
      } finally {
        setIsLoading(false)
      }
    }

    initializeSeiMCP()
  }, [options.network, options.privateKey])

  // Get native token balance
  const getBalance = useCallback(async (address: string): Promise<string> => {
    if (!seiMCP) throw new Error('Sei MCP not initialized')
    
    try {
      setError(null)
      return await seiMCP.getBalance(address)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get balance'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [seiMCP])

  // Get token balance
  const getTokenBalance = useCallback(async (tokenAddress: string, ownerAddress: string): Promise<TokenBalance> => {
    if (!seiMCP) throw new Error('Sei MCP not initialized')
    
    try {
      setError(null)
      return await seiMCP.getTokenBalance(tokenAddress, ownerAddress)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get token balance'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [seiMCP])

  // Transfer native SEI
  const transferSei = useCallback(async (to: string, amount: string): Promise<TransactionResult> => {
    if (!seiMCP) throw new Error('Sei MCP not initialized')
    
    try {
      setError(null)
      return await seiMCP.transferSei(to, amount)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to transfer SEI'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [seiMCP])

  // Transfer ERC20 token
  const transferToken = useCallback(async (tokenAddress: string, to: string, amount: string): Promise<TransactionResult> => {
    if (!seiMCP) throw new Error('Sei MCP not initialized')
    
    try {
      setError(null)
      return await seiMCP.transferToken(tokenAddress, to, amount)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to transfer token'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [seiMCP])

  // Get transaction details
  const getTransaction = useCallback(async (txHash: string): Promise<TransactionResult> => {
    if (!seiMCP) throw new Error('Sei MCP not initialized')
    
    try {
      setError(null)
      return await seiMCP.getTransaction(txHash)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get transaction'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [seiMCP])

  // Format utilities
  const formatFromWei = useCallback((wei: string, decimals: number = 18): string => {
    if (!seiMCP) throw new Error('Sei MCP not initialized')
    return seiMCP.formatFromWei(wei, decimals)
  }, [seiMCP])

  const formatToWei = useCallback((ether: string, decimals: number = 18): string => {
    if (!seiMCP) throw new Error('Sei MCP not initialized')
    return seiMCP.formatToWei(ether, decimals)
  }, [seiMCP])

  return {
    seiMCP,
    chainInfo,
    isConnected,
    isLoading,
    error,
    getBalance,
    getTokenBalance,
    transferSei,
    transferToken,
    getTransaction,
    formatFromWei,
    formatToWei
  }
}