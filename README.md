# SeiFlow

AI-powered cross-chain intent orchestrator for Sei Network. Execute complex blockchain operations using natural language commands.

## ✨ Features

- **Natural Language Interface**: Execute blockchain operations with simple commands like "Send 100 USDC from Ethereum to Sei"
- **AI-Powered Intent Parsing**: Advanced LLM integration for understanding user intents
- **Cross-Chain Bridge Integration**: Seamless token transfers across multiple networks
- **Sei Network Integration**: Native support for Sei blockchain operations via MCP
- **Real-time Transaction Monitoring**: Track operation progress with live updates
- **Secure Wallet Integration**: Connect with popular wallets using RainbowKit

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A wallet with test tokens
- Sei MCP Server running locally

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd seiflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

### Environment Setup

```bash
# .env.local
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_SEI_MCP_SERVER_URL=http://localhost:3001
GROQ_API_KEY=your_groq_api_key
SEI_PRIVATE_KEY=your_private_key_for_mcp_operations
```

### Start Sei MCP Server

```bash
# In a separate terminal
npm run sei-mcp

# Or run both together
npm run dev:with-mcp
```

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS, shadcn/ui
- **Web3**: Wagmi, Viem, RainbowKit
- **AI**: Groq SDK, Anthropic SDK
- **Blockchain**: Sei MCP Server, Model Context Protocol
- **State**: React Query, Context API

## 🌉 Supported Operations

- **Balance Queries**: Check token balances across chains
- **Token Transfers**: Send tokens within the same network
- **Cross-Chain Bridges**: Transfer tokens between different networks
- **Token Swaps**: Exchange tokens on supported DEXs
- **DeFi Operations**: Stake, unstake, and yield farming

## 🔗 Supported Networks

- Ethereum
- Sei Network
- Sei Testnet
- Binance Smart Chain
- Polygon

## 📚 Usage Examples

```typescript
// Natural language commands
"What is my SEI balance?"
"Transfer 10 USDC to 0x..."
"Bridge 100 USDC from Ethereum to Sei"
"Swap 1 ETH for USDC on Sei"
```

## 🛠️ Development

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 🔗 Links

- [Sei Network Documentation](https://docs.sei.io/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Sei MCP Server](https://github.com/sei-protocol/sei-mcp-server)