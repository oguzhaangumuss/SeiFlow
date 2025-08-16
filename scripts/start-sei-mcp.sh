#!/bin/bash

# Start Sei MCP Server
# This script starts the Sei MCP Server in HTTP mode for SeiFlow integration

echo "🚀 Starting Sei MCP Server..."

# Check if port 3001 is available
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 3001 is already in use"
    echo "🔍 Process using port 3001:"
    lsof -i :3001
    echo ""
    echo "💡 To kill the process: sudo kill -9 \$(lsof -t -i:3001)"
    exit 1
fi

# Check if SEI_PRIVATE_KEY is set
if [ -z "$SEI_PRIVATE_KEY" ]; then
    echo "⚠️  WARNING: SEI_PRIVATE_KEY environment variable not set"
    echo "📖 Some MCP operations will be read-only"
    echo ""
fi

# Start the server
echo "🔧 Starting Sei MCP Server on http://localhost:3001"
echo "📝 Network: sei-testnet"
echo "🔗 Endpoint: http://localhost:3001/mcp"
echo ""

# Run the Sei MCP Server with HTTP SSE transport
SERVER_TRANSPORT=http-sse SERVER_PORT=3001 SERVER_HOST=localhost npx -y @sei-js/mcp-server

echo "🛑 Sei MCP Server stopped"