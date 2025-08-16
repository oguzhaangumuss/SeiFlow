// Quick test of Sei MCP Server connection
async function testSeiMCP() {
  try {
    console.log('🧪 Testing Sei MCP Server connection...')
    
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'get-chain-info',
      params: { network: 'sei-testnet' }
    }

    const response = await fetch('http://localhost:3001', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Success! Chain info:', data)
    
    // Test balance query
    const balanceRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'get-balance',
      params: { 
        address: '0x742d35Cc6634C0532925a3b8D4C4d4b4f1F7c7f7',
        network: 'sei-testnet'
      }
    }

    const balanceResponse = await fetch('http://localhost:3001/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(balanceRequest)
    })

    const balanceData = await balanceResponse.json()
    console.log('💰 Balance query result:', balanceData)

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testSeiMCP()