# 🚀 Catalogue MCP - Universal MCP Server Directory

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Manu5921/catalogue-mcp)
[![MCP Version](https://img.shields.io/badge/MCP-latest-blue.svg)](https://modelcontextprotocol.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Built_with-Claude_Code-purple.svg)](https://claude.ai/code)
[![Archon E1-E16](https://img.shields.io/badge/Methodology-Archon_E1--E16-gold.svg)](docs/ADR/ADR-004-archon-e1-e16-methodology.md)

> **The definitive catalogue of Model Context Protocol (MCP) servers** - Complete directory with documentation, integration examples, and Claude Code native support.

## 🌟 **What is Catalogue MCP?**

Catalogue MCP is a comprehensive, community-driven directory of **Model Context Protocol servers** that extends Claude's capabilities. Discover, integrate, and manage MCP servers with:

- 📋 **50+ Curated MCP Servers** with real-time health monitoring  
- 🔍 **Advanced Search & Filtering** by category, rating, and functionality
- ⚡ **One-Click Integration** with Claude Code via native MCP support
- 🧪 **Live Testing Environment** connecting to real MCP servers
- 📊 **Community Reviews** and performance benchmarks
- 🛡️ **Security Audited** with multi-AI validation (Claude + Jules + Gemini)

## 🚀 **Quick Start**

### Install & Run (30 seconds)

```bash
# Clone repository
git clone https://github.com/Manu5921/catalogue-mcp.git
cd catalogue-mcp

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Visit **http://localhost:3000** to browse the catalogue!

### Add to Claude Code

```bash
# Add MCP servers directly to Claude
claude mcp add archon -- docker run -p 8051:8051 archon/mcp-server
claude mcp add github -- docker run -p 8054:8054 github/mcp-server
```

## 🏗️ **Architecture Highlights**

Built with the revolutionary **Archon E1-E16 methodology** featuring:

- ✅ **Architecture-First Design** - Complete system design before coding
- ✅ **Types-First Development** - Zero hallucination TypeScript patterns  
- ✅ **ESLint Anti-Friction** - 3-layer system eliminating build failures
- ✅ **Real MCP Integration** - Live connections to ports 8051-8055
- ✅ **Multi-AI Orchestration** - Claude + Jules + Gemini collaboration
- ✅ **Zero Trust Validation** - Comprehensive testing and security audits

### Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 15 + React 19 + TypeScript | Modern, type-safe UI |
| **Backend** | Next.js API Routes + Supabase | Scalable API with PostgreSQL |
| **MCP Integration** | Native MCP Protocol | Direct server connections |
| **Testing** | Jest + Playwright + Real MCP servers | Comprehensive validation |
| **Security** | Jules AI + ESLint + Husky hooks | Multi-layer protection |
| **Deployment** | Docker + GitHub Actions | Automated CI/CD |

## 📊 **Featured MCP Servers**

| Name | Category | Rating | Port | Status |
|------|----------|--------|------|--------|
| **Archon** | Project Management | ⭐ 9.8/10 | 8051 | 🟢 Online |
| **GitHub** | Development | ⭐ 9.7/10 | 8054 | 🟢 Online |
| **Jules** | Security | ⭐ 9.9/10 | 8055 | 🟢 Online |
| **Context7** | Documentation | ⭐ 9.6/10 | 8056 | 🟢 Online |
| **Serena** | Code Analysis | ⭐ 9.5/10 | 8057 | 🟢 Online |

[**View All Servers →**](http://localhost:3000/catalogue)

## 🎯 **Key Features**

### 🔍 **Smart Discovery**
- **Auto-Detection** of running MCP servers on your system
- **Health Monitoring** with real-time status updates  
- **Performance Metrics** including response times and reliability scores

### 📚 **Comprehensive Documentation**
- **Integration Examples** for each MCP server
- **API Reference** with complete tool and resource listings
- **Best Practices** for MCP development and deployment

### 🛡️ **Enterprise Security**
- **Multi-AI Security Audit** (Claude + Jules + Gemini validation)
- **Zero Trust Architecture** with comprehensive logging
- **Automated Security Gate** in CI/CD pipeline

### ⚡ **Developer Experience**
- **ESLint Anti-Friction** system eliminating common AI development errors
- **Hot Reload** with real MCP server connections
- **Type-Safe** development with comprehensive TypeScript definitions

## 📖 **Documentation**

| Document | Description |
|----------|-------------|
| [**Product Requirements**](docs/PRD.md) | Complete project vision and goals |
| [**Architecture Guide**](docs/PROJECT_STRUCTURE.md) | System design and component structure |
| [**AI Workflow**](docs/WORKFLOW_FOR_AI.md) | Instructions for AI-assisted development |
| [**GitHub MCP Guide**](docs/GITHUB_MCP_GUIDE.md) | GitHub integration setup and usage |
| [**ADR Collection**](docs/ADR/) | Architecture Decision Records |

## 🧪 **Testing & Quality**

```bash
# Run complete validation suite
pnpm run validate-all

# Test real MCP server connections  
pnpm run test:integration

# Performance benchmarks
pnpm run test:performance

# Security audit
pnpm run security:audit
```

### Test Coverage
- ✅ **Unit Tests** - Type guards, utilities, components
- ✅ **Integration Tests** - Real MCP server connections
- ✅ **E2E Tests** - Complete user workflows  
- ✅ **Performance Tests** - Load testing and benchmarks
- ✅ **Security Tests** - Vulnerability scanning

## 🤝 **Contributing**

We welcome contributions! This project follows the **Archon E1-E16 methodology**:

1. **Read** [Architecture Documentation](docs/ADR/)
2. **Follow** [AI Development Workflow](docs/WORKFLOW_FOR_AI.md)  
3. **Use** [ESLint Anti-Friction](RULES_DIGEST.md) patterns
4. **Test** with real MCP servers
5. **Submit** PR with comprehensive validation

[**Contributing Guide →**](CONTRIBUTING.md)

## 🎉 **Community**

- 🐛 **Report Issues** - [GitHub Issues](https://github.com/Manu5921/catalogue-mcp/issues)
- 💡 **Request Features** - [Feature Requests](https://github.com/Manu5921/catalogue-mcp/issues/new?template=feature_request.md)
- 📝 **Submit MCP Server** - [Add New Server](https://github.com/Manu5921/catalogue-mcp/issues/new?template=mcp_server.md)
- 💬 **Discussions** - [GitHub Discussions](https://github.com/Manu5921/catalogue-mcp/discussions)

## 📈 **Roadmap**

- [x] **E1-E6**: Core catalogue with 50+ servers
- [ ] **E7**: Community engagement & contribution system  
- [ ] **E8**: Advanced analytics and insights
- [ ] **E9**: MCP marketplace with ratings
- [ ] **E10**: Enterprise deployment tools

[**Full Roadmap →**](ROADMAP.md)

## 🏆 **Recognition**

- ✨ **Built with** [Claude Code](https://claude.ai/code) - Next-generation AI development
- 🏗️ **Methodology** - Archon E1-E16 Architecture-First approach
- 🔬 **Quality** - Multi-AI validation with Claude + Jules + Gemini  
- 🚀 **Innovation** - Revolutionary MCP-native development workflow

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**⭐ Star this repository if it's helpful!**

Built with ❤️ using [Claude Code](https://claude.ai/code) and the **Archon E1-E16 methodology**

[**🚀 Get Started**](http://localhost:3000) • [**📚 Documentation**](docs/) • [**🤝 Contribute**](CONTRIBUTING.md)

</div>