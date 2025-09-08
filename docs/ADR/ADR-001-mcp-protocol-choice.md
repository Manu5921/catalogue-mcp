# ADR-001: Model Context Protocol (MCP) as Core Integration Standard

## Status
**ACCEPTED** - Implemented in E2-E4 phases

## Context
Le projet Catalogue MCP nécessite un protocole standard pour communiquer avec les serveurs d'IA tools/resources. Plusieurs options étaient disponibles :

1. **Custom REST API** - Protocole propriétaire
2. **GraphQL** - Standard query flexible  
3. **gRPC** - High-performance RPC
4. **Model Context Protocol (MCP)** - Standard émergent Anthropic

## Decision
**Choix : Model Context Protocol (MCP) comme protocole d'intégration principal**

### Rationale
- **Future-Proof** : Standard officiel Anthropic avec adoption croissante
- **Native Claude Integration** : Intégration directe avec Claude Code ecosystem
- **Standardization** : Protocole unifié pour tools/resources AI
- **Community Growth** : Écosystème MCP en expansion rapide
- **Technical Fit** : JSON-RPC base adaptée aux besoins catalogue

## Implementation Details

### MCP Connection Layer
```typescript
// src/lib/mcp/connection.ts
export class McpConnectionManager {
  async connect(serverUrl: string): Promise<McpConnectionResult>
  async listTools(): Promise<Tool[]>
  async listResources(): Promise<Resource[]>
  async healthCheck(): Promise<HealthStatus>
}
```

### Discovery System  
```typescript
// src/lib/mcp/discovery.ts
export class McpDiscovery {
  async discoverServers(portRange: number[]): Promise<DiscoveryResult[]>
  // Auto-discovery sur ports standards 8051-8055
}
```

### Health Monitoring
```typescript
// src/lib/mcp/health-monitor.ts  
export class McpHealthMonitor {
  // Singleton pattern pour monitoring centralisé
  // WebSocket connections pour real-time updates
}
```

## Consequences

### Positive
- **Standardization** : Code réutilisable pour tous serveurs MCP
- **Claude Ecosystem** : Intégration native avec outils développement
- **Future Extensions** : Protocol évolutions supportées automatiquement
- **Community** : Contributions et servers MCP tiers facilités

### Negative  
- **Early Adoption Risk** : Protocol encore en évolution
- **Limited Ecosystem** : Moins de servers disponibles vs REST APIs
- **Documentation** : Specs MCP parfois incomplètes

### Neutral
- **Learning Curve** : Équipe doit apprendre spécificités MCP
- **Debugging** : Outils debugging MCP limités vs HTTP standard

## Alternatives Considered

### Custom REST API
- **Rejected** : Pas de standardization, travail duplicate
- **Maintenance burden** : Documentation et versioning manuel

### GraphQL
- **Rejected** : Over-engineering pour use case catalogue
- **Complexity** : Schema management overhead

### gRPC
- **Rejected** : Performance gains non nécessaires
- **Web compatibility** : Complexité browser integration

## Implementation Status

### ✅ Completed (E2-E4)
- MCP connection management avec retry logic
- Auto-discovery system sur ports standards
- Health monitoring avec metrics collection
- API routes exposant MCP functionality
- TypeScript types pour MCP protocol entities

### 🎯 Next Steps (E6+)
- Advanced MCP protocol features (streaming, subscriptions)
- Security layer pour MCP connections
- Caching strategies pour MCP responses
- Error recovery et fallback mechanisms

## References
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Anthropic MCP Documentation](https://docs.anthropic.com/mcp)
- [Implementation Examples](https://github.com/anthropics/mcp-examples)

---
**Decision Date:** 2025-09-08  
**Review Date:** 2025-12-08 (3 months)  
**Last Updated:** 2025-09-08