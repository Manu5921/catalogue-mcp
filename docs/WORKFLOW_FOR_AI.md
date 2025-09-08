# 🤖 WORKFLOW FOR AI - Catalogue MCP-Zero

## 🎯 INSTRUCTIONS DÉVELOPPEMENT IA

### **⚡ CONTEXT CRITIQUE POUR FUTURES SESSIONS**

Ce projet implémente la **méthodologie Archon E1-E16** pour un catalogue universel de serveurs MCP (Model Context Protocol).

**STATUT ACTUEL :** E1-E5 complétés ✅
- **E1** : Architecture Documentation (PRD, PROJECT_STRUCTURE, ADR)  
- **E2** : Types First (TypeScript strict anti-hallucination)
- **E3** : Tests First (Jest + Playwright + intégration MCP)
- **E4** : Implementation (Core MCP lib + API routes + UI)
- **E5** : ESLint Anti-Friction System (ZERO ERROR builds)

---

## 🚀 **WORKFLOW IA - RÈGLES ABSOLUES**

### **1. 📚 LECTURE OBLIGATOIRE AVANT TOUTE ACTION**
```bash
# TOUJOURS commencer par lire ces fichiers dans l'ordre :
1. CLAUDE_CRITICAL_RULES.md     # 5 règles critiques non-négociables
2. CLAUDE.md                    # Workflow complet + troubleshooting  
3. docs/PRD.md                  # Vision produit et objectifs
4. docs/PROJECT_STRUCTURE.md    # Organisation code et patterns
5. RULES_DIGEST.md             # Patterns ESLint IA-friendly
```

### **2. 🔄 PROCESS-FIRST PROTOCOL**
- ✅ **VÉRIFIER** : Existe-t-il une commande `/mcp archon [action]` pour cette tâche ?
- ✅ **RECHERCHER** : `perform_rag_query` et `search_code_examples` AVANT codage
- ✅ **DOCUMENTER** : Créer task Archon pour traçabilité
- ❌ **INTERDIT** : Improviser sans validation utilisateur explicite

### **3. 🛡️ ZERO TRUST + ESLint ANTI-FRICTION**
```bash
# SÉQUENCE OBLIGATOIRE avant toute validation :
pnpm run lint:fix              # 1. Auto-fix ESLint (PRIORITÉ 1)
pnpm run build                 # 2. Build validation (warnings OK)  
pnpm run test                  # 3. Tests complets
pnpm run lint                  # 4. Validation finale (ZERO ERROR)
```

---

## 🏗️ **ARCHITECTURE MCP - PATTERNS CRITIQUES**

### **Core MCP Library Structure**
```typescript
// src/lib/mcp/connection.ts - Connection management
export class McpConnectionManager {
  async connect(serverUrl: string): Promise<McpConnectionResult>
  async healthCheck(serverUrl: string): Promise<HealthCheck>
}

// src/lib/mcp/discovery.ts - Auto-discovery
export class McpDiscovery {
  async discoverServers(portRange: number[]): Promise<DiscoveryResult[]>
}

// src/lib/mcp/health-monitor.ts - Health monitoring  
export class McpHealthMonitor {
  static getInstance(): McpHealthMonitor
  startMonitoring(serverId: string): void
  stopMonitoring(serverId?: string): void
}
```

### **API Routes Pattern**
```typescript
// src/app/api/*/route.ts - Consistent API pattern
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // Implementation
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

### **Types First Anti-Hallucination**
```typescript
// src/types/mcp.ts - Core MCP types
export interface McpServer {
  id: string
  name: string
  url: string
  status: ServerStatus
  capabilities: ServerCapabilities
}

// src/types/api.ts - API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}
```

---

## 🧪 **TESTING STRATEGY - E3 PATTERNS**

### **Test Hierarchy (Priorité)**
1. **Integration Tests** (Highest Priority) - Real MCP servers
2. **Unit Tests** - Core logic validation  
3. **E2E Tests** - Complete user workflows

### **MCP Integration Testing**
```typescript
// tests/integration/mcp-connection.test.ts
describe('MCP Server Integration', () => {
  it('should connect to real MCP server on port 8051', async () => {
    const manager = new McpConnectionManager()
    const result = await manager.connect('http://localhost:8051')
    expect(result.success).toBe(true)
  })
})
```

### **Health Monitoring Tests**
```typescript
// tests/integration/health-monitoring.test.ts  
describe('Health Monitor Integration', () => {
  it('should detect server health changes in real-time', async () => {
    const monitor = McpHealthMonitor.getInstance()
    // Test with real server instances
  })
})
```

---

## 🎨 **UI COMPONENTS PATTERNS**

### **Component Structure**
```typescript
// src/components/[feature]/[component].tsx
interface ComponentProps {
  // Strict typing with optional properties marked explicitly
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Implementation with proper error boundaries
}
```

### **MCP-Specific Components**
- `McpCard` : Server display card with health status
- `McpGrid` : Server grid with filtering/search
- `SearchBar` : Debounced search with suggestions
- `HealthDashboard` : Real-time health monitoring
- `ServerDetails` : Detailed server information

---

## 📊 **DATA FLOW & STATE MANAGEMENT**

### **MCP Server Discovery Flow**
```
Auto-Discovery → Health Check → Database Update → UI Refresh
     ↓              ↓              ↓              ↓
Port Scanning → Connection Test → Supabase → React State
```

### **Health Monitoring Flow**  
```
Periodic Check → Status Change → Alert System → UI Update
     ↓              ↓              ↓              ↓
WebSocket → Database Update → Notifications → Real-time UI
```

### **Search & Filtering Flow**
```
User Input → Debounce → API Call → Relevance Scoring → Results
     ↓         ↓         ↓           ↓                ↓
React Hook → Timer → Backend → Algorithm → UI Update
```

---

## 🔧 **DEVELOPMENT GUIDELINES**

### **ESLint Anti-Friction Patterns**
```typescript
// ✅ Variables temporaires - Préfixer avec _
const _tempData = processData()
const handleClick = (_event: MouseEvent) => { /* logic */ }

// ✅ Type imports inline (auto-fixable)
import { type User, createUser } from './user'

// ✅ Unused variables pattern matching
const _unusedButNecessary = getValue()
```

### **Error Handling Standards**
```typescript
// API Routes - Consistent error response
catch (error) {
  console.error('Operation failed:', error)
  return NextResponse.json(
    { success: false, error: error.message },
    { status: 500 }
  )
}

// Client Components - Error boundaries
const [error, setError] = useState<string | null>(null)
if (error) {
  return <ErrorDisplay message={error} onRetry={handleRetry} />
}
```

### **Performance Considerations**
```typescript
// Debounced search - 300ms delay
const debouncedSearch = useMemo(
  () => debounce((query: string) => performSearch(query), 300),
  []
)

// Memoized expensive calculations
const processedData = useMemo(
  () => expensiveDataProcessing(rawData),
  [rawData]
)
```

---

## 🚨 **CRITICAL DONT'S - ÉVITER ABSOLUMENT**

### **❌ Anti-Patterns**
- **Pas de code sans types** : Toujours typer strictement
- **Pas de tests mockés** : Privilégier vrais serveurs MCP  
- **Pas d'improvisation** : Process-First Protocol obligatoire
- **Pas d'erreurs ESLint** : System anti-friction doit fonctionner
- **Pas de build fails** : Zero Trust validation requise

### **❌ Architecture Violations**  
- Skip E1-E16 methodology steps
- Direct database access from components
- Hard-coded MCP server URLs
- Missing error boundaries
- Inconsistent API response formats

---

## 📈 **NEXT PHASES - ROADMAP E6-E16**

### **E6-E8 : Advanced Testing & Performance**
- Real MCP server integration tests avec CI/CD
- Performance optimization (build <30s, search <500ms)
- Advanced monitoring et observability

### **E9-E11 : Security & Deployment**  
- Authentication/authorization avec Supabase
- Rate limiting et API protection
- Production deployment avec Vercel

### **E12-E14 : Community & Advanced Features**
- Community rating/review system
- Advanced search avec ML relevance
- Claude Code deep integration

### **E15-E16 : Enterprise & Scale**
- Enterprise features et API monetization  
- Advanced monitoring et analytics
- Scale optimization pour 1000+ users

---

## 🔍 **DEBUGGING & TROUBLESHOOTING**

### **Build Issues**
```bash
# 1. ESLint first (NOUVEAU)
pnpm run lint:fix
cat RULES_DIGEST.md

# 2. Standard debugging
pnpm run build --verbose
pnpm run typecheck
```

### **MCP Connection Issues** 
```bash
# Test MCP server connectivity
curl -X POST http://localhost:8051/mcp -H "Content-Type: application/json"
netstat -an | grep 8051
```

### **Performance Issues**
```bash  
# Build analysis
pnpm run build --analyze
# Test performance
pnpm run test:e2e --reporter=json
```

---

**⚠️ CETTE DOCUMENTATION EST VIVANTE - Mise à jour après chaque phase E1-E16 complétée pour maintenir cohérence intersessions IA.**