#!/bin/bash
# 🚀 GitHub MCP Server Setup Script

set -e

echo "🔐 Setting up GitHub MCP Server for Catalogue-MCP..."

# Configuration
GITHUB_MCP_PORT=${GITHUB_MCP_PORT:-8054}
CONTAINER_NAME="github-mcp-server"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to load GitHub token from .env.github
load_env() {
    if [ ! -f ".env.github" ]; then
        echo "❌ .env.github file not found!"
        echo "📝 Please create .env.github with your GitHub PAT:"
        echo "   GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here"
        exit 1
    fi
    
    source .env.github
    
    if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ] || [ "$GITHUB_PERSONAL_ACCESS_TOKEN" = "your_github_pat_here" ]; then
        echo "❌ Please set your GitHub Personal Access Token in .env.github"
        exit 1
    fi
}

# Function to start GitHub MCP server
start_mcp_server() {
    echo "🚀 Starting GitHub MCP server on port $GITHUB_MCP_PORT..."
    
    # Stop existing container if running
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    
    # Start new container
    docker run -d \
        --name $CONTAINER_NAME \
        -p $GITHUB_MCP_PORT:$GITHUB_MCP_PORT \
        -e GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_PERSONAL_ACCESS_TOKEN" \
        -e PORT="$GITHUB_MCP_PORT" \
        ghcr.io/github/github-mcp-server:latest
    
    echo "✅ GitHub MCP server started at http://localhost:$GITHUB_MCP_PORT"
}

# Function to test the server
test_server() {
    echo "🧪 Testing GitHub MCP server..."
    sleep 2
    
    if curl -f http://localhost:$GITHUB_MCP_PORT/health > /dev/null 2>&1; then
        echo "✅ GitHub MCP server is healthy!"
    else
        echo "⚠️ Server might be starting up... Check logs with: docker logs $CONTAINER_NAME"
    fi
}

# Function to add Claude configuration
configure_claude() {
    echo "🔧 Adding GitHub MCP to Claude configuration..."
    
    # Method 1: Docker-based (recommended)
    echo "📝 Run this command to add GitHub MCP to Claude:"
    echo "   claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PERSONAL_ACCESS_TOKEN -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server"
    
    # Method 2: HTTP endpoint (alternative)
    echo ""
    echo "🔄 Alternative HTTP method:"
    echo "   claude mcp add --transport http github http://localhost:$GITHUB_MCP_PORT -H \"Authorization: Bearer $GITHUB_PERSONAL_ACCESS_TOKEN\""
}

# Main execution
main() {
    echo "🏁 Starting GitHub MCP setup process..."
    check_docker
    load_env
    start_mcp_server
    test_server
    configure_claude
    
    echo ""
    echo "🎉 GitHub MCP setup completed!"
    echo "📚 Next steps:"
    echo "   1. Run the claude mcp add command shown above"
    echo "   2. Verify with: claude mcp list"
    echo "   3. Test with: claude mcp get github"
    echo ""
    echo "🔍 Useful commands:"
    echo "   - View logs: docker logs $CONTAINER_NAME"
    echo "   - Stop server: docker stop $CONTAINER_NAME"
    echo "   - Restart: bash scripts/github-mcp-setup.sh"
}

main "$@"