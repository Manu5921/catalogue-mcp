# 🏗️ ARCHITECTURE CATALOGUE MCP - GUIDE COMPLET E1-E16

## 🎯 VISION PRODUIT

**Créer le catalogue universel de référence des MCP (Model Context Protocol) servers** avec documentation complète, tests fonctionnels, et intégration native Claude Code.

---

## 📋 PRODUCT REQUIREMENTS DOCUMENT (PRD)

### **🚀 PROBLÈME À RÉSOUDRE**

#### **Pain Points Actuels :**
- 😞 **Découvrabilité** : MCP servers éparpillés, difficiles à trouver
- 📚 **Documentation** : Inconsistante, souvent incomplete ou obsolète  
- 🧪 **Fiabilité** : Pas de tests systématiques, servers peuvent être cassés
- 🔗 **Intégration** : Pas d'interface unifiée pour tester/utiliser MCPs
- ⭐ **Qualité** : Aucun système de rating/review communautaire

### **🎯 FONCTIONNALITÉS CORE**

#### **MVP Phase 1 (2-3 semaines)**

**1. 📋 Catalogue Base**
- **Liste MCPs** : Nom, description, auteur, catégorie
- **Détail MCP** : Documentation, installation, configuration
- **Recherche** : Par nom, catégorie, tags
- **Filtrage** : Status (active/deprecated), popularité, rating

**2. 🧪 Health Monitoring**
- **Tests automatisés** : Connexion, endpoints basiques
- **Status real-time** : UP/DOWN avec latence
- **Historique** : Uptime tracking 30 jours
- **Alertes** : Notification si MCP devient indisponible

**3. 📖 Documentation**
- **Setup guide** : Instructions installation pas-à-pas
- **Usage examples** : Code samples fonctionnels
- **API reference** : Tools disponibles avec paramètres
- **Integration guide** : Spécifique Claude Code

#### **Phase 2 (1-2 semaines)**

**4. ⭐ Rating System**
- **Reviews utilisateurs** : 1-5 étoiles + commentaires
- **Métriques usage** : Downloads, intégrations actives
- **Quality score** : Automatique basé sur tests + reviews
- **Badges** : Verified, Popular, Well-Documented

**5. 🔗 Claude Code Integration**
- **One-click install** : Bouton "Add to Claude Code"
- **Configuration wizard** : Setup guidé avec validation
- **Live testing** : Tester MCP directement depuis l'interface
- **Usage analytics** : Tracking utilisation par MCP

### **⚡ CRITÈRES SUCCÈS**

#### **Métriques Quantitatives :**
- 📊 **50+ MCPs catalogués** dans les 30 jours
- 👥 **100+ utilisateurs actifs** mensuels
- ⭐ **Rating moyen >4.2/5** sur MCPs top 10
- 🔄 **80%+ uptime** sur health monitoring
- 📈 **20+ nouveaux MCPs/mois** découverts

#### **Métriques Qualitatives :**
- ✅ **Documentation complète** : 90%+ MCPs avec guide setup
- 🧪 **Tests fonctionnels** : 100% MCPs testés automatiquement
- 🚀 **Adoption Claude Code** : Intégration native utilisée
- 💬 **Community engagement** : Reviews actives, feedback constructif

---

## 🏗️ ARCHITECTURE TECHNIQUE E1-E16

### **E1: ARCHITECTURE FIRST - STRUCTURE PROJET**

```
catalogue-mcp/
├── 📋 CLAUDE.md                          # Session guide complet
├── 🚨 CLAUDE_CRITICAL_RULES.md           # 5 règles critiques
├── 🏗️ ARCHITECTURE.md                   # Ce fichier
├── 📦 package.json                       # Dependencies + scripts
├── 🔧 pnpm-lock.yaml                     # Lock file PNPM
├── ⚙️  next.config.js                     # Configuration Next.js
├── 📝 tsconfig.json                      # Configuration TypeScript strict
├── 🎨 tailwind.config.js                 # Configuration Tailwind CSS
├── 🧪 jest.config.js                     # Configuration tests
├── 📊 playwright.config.ts               # Configuration E2E tests
│
├── 📚 docs/                              # Documentation complète
│   ├── 📋 PRD.md                         # Product Requirements Document
│   ├── 🏗️ PROJECT_STRUCTURE.md           # Organisation détaillée
│   ├── 🤖 WORKFLOW_FOR_AI.md             # Instructions IA
│   ├── 📊 API_SPECIFICATION.md           # Spec API complète
│   └── 📁 ADR/                           # Architecture Decision Records
│       ├── ADR-001-next-js-app-router.md
│       ├── ADR-002-supabase-backend.md
│       ├── ADR-003-mcp-protocol-spec.md
│       └── ADR-004-health-monitoring.md
│
├── 🏷️ src/types/                         # E2: TYPES FIRST
│   ├── 📦 index.ts                       # Hub central tous types
│   ├── 🔌 mcp.ts                         # Types MCP servers
│   ├── 🌐 api.ts                         # Types API/requests
│   ├── 🎨 ui.ts                          # Types interface utilisateur
│   ├── 📊 database.ts                    # Types Supabase DB
│   └── 🔍 search.ts                      # Types recherche/filtrage
│
├── 🧪 tests/                             # E3: TESTS FIRST
│   ├── 🔗 integration/                   # Tests APIs MCP réels (PRIORITÉ)
│   │   ├── mcp-connection.test.ts
│   │   ├── health-monitoring.test.ts
│   │   └── search-functionality.test.ts
│   ├── 🔧 unit/                          # Tests unitaires
│   │   ├── utils/
│   │   ├── components/
│   │   └── lib/
│   └── 🎭 e2e/                           # End-to-end tests
│       ├── user-journey.spec.ts
│       └── mcp-catalogue-flow.spec.ts
│
├── 🎨 src/app/                           # Next.js App Router
│   ├── 📄 layout.tsx                     # Root layout
│   ├── 🏠 page.tsx                       # Page accueil
│   ├── 🔍 search/page.tsx                # Recherche MCPs
│   ├── 📋 catalogue/
│   │   ├── page.tsx                      # Liste MCPs
│   │   └── [id]/page.tsx                 # Détail MCP
│   ├── ⭐ reviews/[mcpId]/page.tsx       # System reviews
│   ├── 🔐 auth/                          # Pages auth (signin/signup)
│   └── 🌐 api/                           # API Routes
│       ├── mcps/
│       ├── health/
│       └── search/
│
├── 🎨 src/components/                    # Composants React
│   ├── 🧩 ui/                            # Composants de base (Shadcn)
│   ├── 📋 catalogue/                     # Composants catalogue
│   ├── 🔍 search/                        # Composants recherche
│   ├── ⭐ reviews/                       # Composants reviews
│   ├── 📊 monitoring/                    # Composants health monitoring
│   └── 🔐 auth/                          # Composants authentification
│
└── 🔧 src/lib/                           # Logique métier
    ├── 🔌 mcp/                           # MCP Protocol handling
    │   ├── client.ts                     # Client MCP générique
    │   ├── health-checker.ts             # Health monitoring
    │   └── discovery.ts                  # Auto-discovery MCPs
    ├── 🗄️ database/                      # Supabase interactions
    │   ├── client.ts                     # Client Supabase
    │   ├── mcps.ts                       # CRUD MCPs
    │   └── reviews.ts                    # CRUD reviews
    ├── 🔐 auth/                          # Authentication logic
    ├── 🔍 search/                        # Search functionality
    └── 🛠️ utils/                         # Utilitaires généraux
```

### **E2: TYPES FIRST (Anti-hallucination)**

#### **Hub Central Types**
```typescript
// src/types/index.ts - POINT D'ENTRÉE UNIQUE
export * from './mcp';
export * from './api';
export * from './ui';
export * from './database';
export * from './search';

// RÈGLE CRITIQUE : Tous imports via cette interface
import { McpServer, HealthStatus, SearchFilters } from '@/src/types';
```

#### **Types MCP Core**
```typescript
// src/types/mcp.ts
export interface McpServer {
  id: string;
  name: string;
  description: string;
  serverUrl: string;
  protocol: 'ws' | 'http';
  category: McpCategory;
  author: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  status: HealthStatus;
  uptime: number;
  averageResponseTime: number;
  lastHealthCheck: Date;
  rating: number;
  reviewCount: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthStatus {
  status: 'UP' | 'DOWN' | 'DEGRADED' | 'UNKNOWN';
  responseTime: number;
  lastError?: string;
  uptime: number;
  checks: {
    connection: boolean;
    authentication: boolean;
    endpoints: boolean;
  };
}

export interface McpCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
```

### **E3: TESTS FIRST (Most Valuable Technique)**

#### **Tests Integration PRIORITAIRES**
```typescript
// tests/integration/mcp-connection.test.ts
describe('MCP Server Connection', () => {
  // OBLIGATOIRE : Tests avec VRAIS servers MCP
  const TEST_MCP_SERVERS = [
    'ws://localhost:8080/mcp',
    'wss://demo-mcp.example.com'
  ];

  it('should connect to real MCP server', async () => {
    const client = new McpClient(TEST_MCP_SERVERS[0]);
    const connection = await client.connect();
    
    expect(connection.status).toBe('connected');
    expect(connection.capabilities).toBeDefined();
    
    await client.disconnect();
  });

  it('should handle connection failures gracefully', async () => {
    const client = new McpClient('ws://invalid-server:9999');
    
    await expect(client.connect()).rejects.toThrow('Connection failed');
  });
});
```

#### **Health Monitoring Tests**
```typescript
// tests/integration/health-monitoring.test.ts
describe('MCP Health Monitoring', () => {
  it('should track server uptime', async () => {
    const monitor = new McpHealthMonitor();
    const serverId = 'test-server-1';
    
    const stats = await monitor.trackUptime(serverId, 10000);
    
    expect(stats.uptime).toBeGreaterThanOrEqual(0);
    expect(stats.responseTime).toBeLessThan(5000);
    expect(stats.status).toMatch(/UP|DOWN|DEGRADED/);
  });
});
```

---

## 🔌 SPÉCIFICITÉS MCP PROTOCOL

### **🎯 MCP Connection Pattern**
```typescript
// src/lib/mcp/client.ts
export class McpClient {
  private connection: WebSocket | null = null;
  private config: McpConfig;

  constructor(config: McpConfig) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    };
  }

  async connect(): Promise<McpConnection> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.config.serverUrl);
      
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('Connection timeout'));
      }, this.config.timeout);

      ws.onopen = () => {
        clearTimeout(timeout);
        this.connection = ws;
        resolve({
          status: 'connected',
          capabilities: this.negotiateCapabilities()
        });
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        reject(new Error(`Connection failed: ${error}`));
      };
    });
  }

  async healthCheck(): Promise<HealthStatus> {
    if (!this.connection || this.connection.readyState !== WebSocket.OPEN) {
      return {
        status: 'DOWN',
        responseTime: 0,
        uptime: 0,
        checks: {
          connection: false,
          authentication: false,
          endpoints: false
        }
      };
    }

    const startTime = Date.now();
    
    try {
      // Ping server
      await this.sendMessage({ type: 'ping' });
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'UP',
        responseTime,
        uptime: this.calculateUptime(),
        checks: {
          connection: true,
          authentication: await this.checkAuthentication(),
          endpoints: await this.checkEndpoints()
        }
      };
    } catch (error) {
      return {
        status: 'DOWN',
        responseTime: Date.now() - startTime,
        uptime: 0,
        lastError: error.message,
        checks: {
          connection: false,
          authentication: false,
          endpoints: false
        }
      };
    }
  }
}
```

### **🔍 Auto-Discovery System**
```typescript
// src/lib/mcp/discovery.ts
export class McpDiscovery {
  private sources: DiscoverySource[] = [
    {
      type: 'github',
      searchPattern: 'mcp-server language:TypeScript',
      validator: this.validateGitHubRepo
    },
    {
      type: 'npm',
      searchPattern: 'mcp server',
      validator: this.validateNpmPackage
    }
  ];

  async discoverNewServers(): Promise<McpServer[]> {
    const discoveries: McpServer[] = [];
    
    for (const source of this.sources) {
      try {
        const results = await this.searchSource(source);
        const validated = await this.validateDiscoveries(results);
        discoveries.push(...validated);
      } catch (error) {
        console.error(`Discovery failed for ${source.type}:`, error);
      }
    }
    
    return discoveries;
  }
}
```

---

## 🗄️ DATABASE SCHEMA SUPABASE

### **Tables Essentielles**
```sql
-- MCP Servers table
CREATE TABLE mcp_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  server_url VARCHAR(500) NOT NULL,
  protocol VARCHAR(10) NOT NULL CHECK (protocol IN ('ws', 'http')),
  category_id UUID REFERENCES mcp_categories(id),
  author VARCHAR(255),
  repository_url VARCHAR(500),
  documentation_url VARCHAR(500),
  status health_status_enum NOT NULL DEFAULT 'unknown',
  uptime_percentage DECIMAL(5,2) DEFAULT 0.0,
  average_response_time INTEGER DEFAULT 0,
  last_health_check TIMESTAMPTZ,
  rating_average DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health monitoring logs
CREATE TABLE mcp_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES mcp_servers(id) ON DELETE CASCADE,
  status health_status_enum NOT NULL,
  response_time INTEGER,
  error_message TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews system
CREATE TABLE mcp_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES mcp_servers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(server_id, user_id)
);

-- Categories
CREATE TABLE mcp_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index critiques
CREATE INDEX idx_mcp_servers_status ON mcp_servers(status);
CREATE INDEX idx_mcp_servers_category ON mcp_servers(category_id);
CREATE INDEX idx_mcp_servers_rating ON mcp_servers(rating_average DESC);
CREATE INDEX idx_mcp_servers_search ON mcp_servers 
  USING gin(to_tsvector('english', name || ' ' || description));
```

---

## 🚀 API ARCHITECTURE

### **Endpoints Critiques**
```typescript
// app/api/mcps/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  
  const { data, error, count } = await supabase
    .from('mcp_servers')
    .select('*, mcp_categories(name)', { count: 'exact' })
    .ilike('name', `%${query}%`)
    .eq('category_id', category)
    .eq('status', status)
    .range((page - 1) * 20, page * 20 - 1)
    .order('rating_average', { ascending: false });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ 
    data, 
    pagination: {
      page,
      totalItems: count,
      totalPages: Math.ceil(count / 20),
      itemsPerPage: 20
    }
  });
}

// app/api/health/[serverId]/route.ts
export async function POST(request: NextRequest, { params }: { params: { serverId: string } }) {
  const { serverId } = params;
  
  try {
    const healthResult = await performHealthCheck(serverId);
    
    // Update database
    await supabase
      .from('mcp_servers')
      .update({
        status: healthResult.status,
        uptime_percentage: healthResult.uptime,
        average_response_time: healthResult.responseTime,
        last_health_check: new Date().toISOString()
      })
      .eq('id', serverId);
    
    // Log health check
    await supabase
      .from('mcp_health_logs')
      .insert({
        server_id: serverId,
        status: healthResult.status,
        response_time: healthResult.responseTime,
        error_message: healthResult.lastError
      });
    
    return NextResponse.json(healthResult);
  } catch (error) {
    return NextResponse.json(
      { error: 'Health check failed', details: error.message },
      { status: 500 }
    );
  }
}
```

---

## 🎯 IMPLEMENTATION WORKFLOW

### **Phase 1: Foundation (Semaine 1)**
1. **Setup projet** : Next.js 15 + TypeScript + Tailwind
2. **Base Supabase** : Schema + Auth configuration  
3. **Types definition** : Tous types MCP dans src/types/
4. **Tests setup** : Jest + Playwright configuration

### **Phase 2: Core Features (Semaine 2-3)**
1. **MCP Client** : Connection + Health monitoring
2. **Catalogue UI** : Liste + Détail + Recherche
3. **API Routes** : CRUD MCPs + Health checks
4. **Tests integration** : Connexions MCP réelles

### **Phase 3: Advanced Features (Semaine 4-5)**
1. **Reviews system** : Rating + Comments
2. **Auto-discovery** : GitHub + NPM scanning
3. **Claude Code integration** : One-click install
4. **Performance optimization** : Caching + CDN

---

## ⚡ QUALITY GATES OBLIGATOIRES

### **Definition of Done par Feature :**

1. **✅ Architecture Documentation**
   - ADR créé dans docs/ADR/
   - Types définis dans src/types/
   - Tests d'intégration écrits

2. **✅ Build & Tests**
   ```bash
   pnpm run build       # 0 erreurs TypeScript
   pnpm run test        # Tous tests passent
   pnpm run lint        # 0 erreurs linting
   pnpm run typecheck   # Couverture types >95%
   ```

3. **✅ MCP Integration Test**
   - Feature testée avec au moins 1 MCP server réel
   - Health check fonctionnel
   - Error handling validé

4. **✅ Performance**
   - Page load <2s
   - API response <500ms
   - Health check <5s

---

## 🚨 CRITICAL SUCCESS FACTORS

### **1. Process-First Always**
- Vérifier MCP Archon disponible avant actions
- Suivre workflows documentés
- Communiquer processus utilisés

### **2. Real MCP Testing**
- Jamais de mocks pour tests d'intégration
- Connexions authentiques servers MCP
- Health monitoring en conditions réelles

### **3. Zero Trust Validation**
- Preuves objectives pour chaque affirmation
- Build/test logs complets obligatoires
- Validation croisée sur décisions critiques

### **4. Types-First Development**
- Définir types AVANT implémentation
- Hub central src/types/index.ts
- TypeScript strict mode obligatoire

---

**🏆 Cette architecture garantit un catalogue MCP industriel avec tests réels, monitoring robuste, et intégration Claude Code native !**