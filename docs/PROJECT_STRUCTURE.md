# 🏗️ PROJECT STRUCTURE - Catalogue MCP-Zero

## 📁 ARCHITECTURE GÉNÉRALE E1-E16

### **🎯 Principes Architecturaux**
- **E1 : Architecture First** → Documentation complète AVANT code
- **E2 : Types First** → Types TypeScript stricts anti-hallucination  
- **E3 : Tests First** → Tests d'intégration MCP réels prioritaires
- **E4 : Implementation** → Développement guidé par architecture

---

## 📂 STRUCTURE COMPLÈTE PROJET

```
catalogue-mcp/
├── 📋 CLAUDE.md                          # Guide session Claude Code
├── 🚨 CLAUDE_CRITICAL_RULES.md           # 5 commandements non-négociables
├── 🏗️ ARCHITECTURE.md                   # North Star technique
├── 📦 package.json                       # Dependencies pnpm + scripts
├── 🔧 pnpm-lock.yaml                     # Lock file STRICT
├── ⚙️ next.config.ts                     # Configuration Next.js 15 TypeScript
├── 📝 tsconfig.json                      # TypeScript STRICT mode
├── 🎨 tailwind.config.ts                 # Tailwind CSS + Shadcn setup
├── 🧪 jest.config.js                     # Configuration tests unitaires
├── 📊 playwright.config.ts               # Configuration E2E tests
├── 🐳 docker-compose.yml                 # Stack Next.js + Supabase
├── 📄 database/init.sql                  # Schema PostgreSQL initial
├── 📄 database/seed.sql                  # Données de test/développement
├── 📜 LICENSE                            # MIT License open-source
├── 📖 README.md                          # Installation, usage, contribution
├── 🤝 CONTRIBUTING.md                    # Guidelines développement
├── 🔒 .env.example                       # Variables environnement template
├── 📝 .env.local                         # Variables développement (gitignored)
├── ⚙️ .eslintrc.json                     # Configuration linting strict
├── 🎨 .prettierrc                        # Configuration formatage code
├── 📄 .gitignore                         # Exclusions Git
├── 🚫 .npmrc                             # Configuration pnpm (bannit npm)
│
├── 🤖 ia-communications/                  # ✨ COLLABORATION IA MULTI-AGENTS
│   ├── 📋 README.md                      # Rôle handoffs multi-agents
│   ├── 📁 templates/                     # Templates standardisés
│   │   ├── 📝 gemini-prompt-template.md  # Format prompts Gemini
│   │   ├── 📝 claude-response-template.md # Format réponses Claude
│   │   ├── 📝 context-handoff.md         # Passation contexte
│   │   └── 📝 validation-checklist.md    # Checklist validation
│   ├── 📁 sessions/                      # Historique communications
│   │   └── [YYYY-MM-DD-HH-MM-session.md] # Archives par timestamp
│   └── 📁 protocols/                     # Protocoles spécifiques
│       ├── 📝 architecture-decisions.md  # Handoffs décisions architecture
│       ├── 📝 code-reviews.md            # Handoffs revue code
│       └── 📝 testing-validation.md      # Handoffs validation tests
│
├── 📚 docs/                              # E1: DOCUMENTATION ARCHITECTURE FIRST
│   ├── 📋 PRD.md                         # Product Requirements Document
│   ├── 🏗️ PROJECT_STRUCTURE.md          # Ce fichier - Organisation détaillée
│   ├── 🤖 WORKFLOW_FOR_AI.md             # Instructions IA futures sessions
│   ├── 📊 API_SPECIFICATION.md           # Spec API REST complète
│   ├── 🎨 UI_DESIGN_SYSTEM.md            # Design tokens, composants
│   ├── 🔐 SECURITY_GUIDELINES.md         # Standards sécurité
│   ├── 🚀 DEPLOYMENT_GUIDE.md            # Guide déploiement production
│   └── 📁 ADR/                           # Architecture Decision Records
│       ├── 📄 ADR-001-next-js-app-router.md    # Choix Next.js 15 vs alternatives
│       ├── 📄 ADR-002-supabase-backend.md      # Supabase vs Firebase/custom
│       ├── 📄 ADR-003-mcp-protocol-spec.md     # Conformité protocole MCP
│       ├── 📄 ADR-004-health-monitoring.md     # Stratégie monitoring temps réel
│       ├── 📄 ADR-005-testing-strategy.md      # Tests MCP réels vs mocks
│       ├── 📄 ADR-006-search-implementation.md # PostgreSQL vs Elasticsearch
│       └── 📄 ADR-007-auth-strategy.md         # Supabase Auth vs alternatives
│
├── 🏷️ src/types/                        # E2: TYPES FIRST - Anti-hallucination
│   ├── 📦 index.ts                       # Hub central - Point entrée unique
│   ├── 🔌 mcp.ts                         # Types MCP servers/tools/protocol
│   ├── 🌐 api.ts                         # Types API REST requests/responses
│   ├── 🎨 ui.ts                          # Types composants React/props
│   ├── 📊 database.ts                    # Types Supabase auto-générés
│   ├── 🔍 search.ts                      # Types recherche/filtrage
│   ├── 📈 analytics.ts                   # Types métriques/tracking
│   ├── 🔐 auth.ts                        # Types authentification/session
│   └── 🛠️ utils.ts                       # Types utilitaires/helpers
│
├── 🧪 tests/                             # E3: TESTS FIRST - Priorité absolue
│   ├── 🔗 integration/                   # Tests APIs MCP RÉELS (CRITIQUE)
│   │   ├── 📄 mcp-connection.test.ts     # Connexions WebSocket/HTTP réelles
│   │   ├── 📄 health-monitoring.test.ts  # Monitoring temps réel fonctionnel
│   │   ├── 📄 tool-discovery.test.ts     # Découverte automatique MCPs
│   │   ├── 📄 semantic-search.test.ts    # Recherche sémantique précision
│   │   ├── 📄 database-operations.test.ts # CRUD Supabase end-to-end
│   │   └── 📄 api-endpoints.test.ts      # API REST avec données réelles
│   │
│   ├── 🔧 unit/                          # Tests unitaires composants/utils
│   │   ├── 📁 components/                # Tests composants React
│   │   │   ├── 📄 McpCard.test.tsx       # Card affichage MCP
│   │   │   ├── 📄 SearchBar.test.tsx     # Composant recherche
│   │   │   ├── 📄 HealthStatus.test.tsx  # Indicateur status
│   │   │   └── 📄 RatingDisplay.test.tsx # Affichage reviews
│   │   │
│   │   ├── 📁 lib/                       # Tests logique métier
│   │   │   ├── 📄 mcpClient.test.ts      # Client MCP protocol
│   │   │   ├── 📄 healthChecker.test.ts  # Service monitoring
│   │   │   ├── 📄 searchEngine.test.ts   # Moteur recherche
│   │   │   └── 📄 ratingSystem.test.ts   # Système reviews
│   │   │
│   │   └── 📁 utils/                     # Tests utilitaires
│   │       ├── 📄 validators.test.ts     # Validation données
│   │       ├── 📄 formatters.test.ts     # Formatage affichage
│   │       └── 📄 parsers.test.ts        # Parsing configurations MCP
│   │
│   ├── 🎭 e2e/                           # Tests end-to-end Playwright
│   │   ├── 📄 user-journey.spec.ts       # Parcours utilisateur complet
│   │   ├── 📄 mcp-catalogue-flow.spec.ts # Navigation catalogue
│   │   ├── 📄 search-functionality.spec.ts # Recherche avancée
│   │   ├── 📄 health-monitoring.spec.ts  # Interface monitoring
│   │   └── 📄 reviews-system.spec.ts     # Système reviews end-to-end
│   │
│   ├── 📁 fixtures/                      # Données test/mocks
│   │   ├── 📄 mcp-servers.json           # Exemples servers MCP
│   │   ├── 📄 health-responses.json      # Réponses health checks
│   │   └── 📄 user-reviews.json          # Reviews utilisateurs test
│   │
│   └── 📁 helpers/                       # Utilitaires tests
│       ├── 📄 setup-tests.ts             # Configuration Jest/Playwright
│       ├── 📄 mock-supabase.ts           # Mocks Supabase pour units
│       └── 📄 test-utils.tsx             # Helpers composants React
│
├── 🎨 src/app/                           # E4: Next.js 15 App Router
│   ├── 📄 layout.tsx                     # Root layout + providers
│   ├── 📄 page.tsx                       # Page accueil + hero
│   ├── 📄 globals.css                    # Styles globaux Tailwind
│   ├── 📄 loading.tsx                    # Loading UI partagé
│   ├── 📄 error.tsx                      # Error boundary global
│   ├── 📄 not-found.tsx                  # Page 404 personnalisée
│   │
│   ├── 📁 (dashboard)/                   # Route group dashboard
│   │   ├── 📄 layout.tsx                 # Layout dashboard
│   │   └── 📄 page.tsx                   # Dashboard analytics
│   │
│   ├── 🔍 search/                        # Recherche MCPs
│   │   ├── 📄 page.tsx                   # Interface recherche avancée
│   │   └── 📄 loading.tsx                # Loading search results
│   │
│   ├── 📋 catalogue/                     # Navigation catalogue
│   │   ├── 📄 page.tsx                   # Liste MCPs avec filtres
│   │   ├── 📄 loading.tsx                # Loading liste
│   │   └── 📁 [id]/                      # Détail MCP dynamique
│   │       ├── 📄 page.tsx               # Page détail MCP
│   │       ├── 📄 loading.tsx            # Loading détail
│   │       └── 📄 opengraph-image.tsx    # OG image dynamique
│   │
│   ├── ⭐ reviews/                       # Système reviews
│   │   └── 📁 [mcpId]/                   # Reviews par MCP
│   │       ├── 📄 page.tsx               # Liste reviews + form
│   │       └── 📄 loading.tsx            # Loading reviews
│   │
│   ├── 📊 health/                        # Monitoring dashboard
│   │   ├── 📄 page.tsx                   # Dashboard status global
│   │   └── 📁 [serverId]/                # Status server spécifique
│   │       └── 📄 page.tsx               # Détail health + historique
│   │
│   ├── 🔐 auth/                          # Pages authentification
│   │   ├── 📄 signin/page.tsx            # Connexion utilisateur
│   │   ├── 📄 signup/page.tsx            # Inscription utilisateur
│   │   ├── 📄 forgot/page.tsx            # Mot de passe oublié
│   │   └── 📄 callback/page.tsx          # OAuth callback
│   │
│   ├── 👤 profile/                       # Profil utilisateur
│   │   ├── 📄 page.tsx                   # Profil + paramètres
│   │   └── 📄 reviews/page.tsx           # Reviews utilisateur
│   │
│   └── 🌐 api/                           # API Routes Next.js
│       ├── 📁 mcps/                      # Endpoints MCPs
│       │   ├── 📄 route.ts               # GET/POST MCPs
│       │   ├── 📁 [id]/                  # CRUD MCP spécifique
│       │   │   └── 📄 route.ts           # GET/PATCH/DELETE MCP
│       │   ├── 📁 health/                # Health checks
│       │   │   └── 📄 route.ts           # POST health check
│       │   └── 📁 search/                # Recherche API
│       │       └── 📄 route.ts           # POST recherche avancée
│       │
│       ├── 📁 reviews/                   # API Reviews
│       │   ├── 📄 route.ts               # GET/POST reviews
│       │   └── 📁 [id]/                  # CRUD review spécifique
│       │       └── 📄 route.ts           # GET/PATCH/DELETE review
│       │
│       ├── 📁 auth/                      # API Auth Supabase
│       │   ├── 📄 callback/route.ts      # OAuth callback handler
│       │   └── 📄 signout/route.ts       # Déconnexion
│       │
│       ├── 📁 analytics/                 # Métriques/tracking
│       │   └── 📄 route.ts               # POST événements analytics
│       │
│       └── 📁 webhooks/                  # Webhooks externes
│           ├── 📄 github/route.ts        # GitHub webhooks MCP discovery
│           └── 📄 health/route.ts        # Health monitoring webhooks
│
├── 🎨 src/components/                    # Composants React réutilisables
│   ├── 🧩 ui/                            # Composants base (Shadcn/ui)
│   │   ├── 📄 button.tsx                 # Composant Button
│   │   ├── 📄 input.tsx                  # Composant Input
│   │   ├── 📄 card.tsx                   # Composant Card
│   │   ├── 📄 badge.tsx                  # Composant Badge
│   │   ├── 📄 dialog.tsx                 # Composant Modal/Dialog
│   │   ├── 📄 dropdown.tsx               # Composant Dropdown
│   │   ├── 📄 loading.tsx                # Composant Loading/Spinner
│   │   └── 📄 toast.tsx                  # Composant Notifications
│   │
│   ├── 📋 catalogue/                     # Composants catalogue
│   │   ├── 📄 McpCard.tsx                # Card affichage MCP
│   │   ├── 📄 McpGrid.tsx                # Grille MCPs
│   │   ├── 📄 McpFilters.tsx             # Filtres recherche
│   │   ├── 📄 CategoryBadge.tsx          # Badge catégorie
│   │   └── 📄 McpDetail.tsx              # Vue détaillée MCP
│   │
│   ├── 🔍 search/                        # Composants recherche
│   │   ├── 📄 SearchBar.tsx              # Barre recherche principale
│   │   ├── 📄 SearchFilters.tsx          # Filtres avancés
│   │   ├── 📄 SearchResults.tsx          # Affichage résultats
│   │   └── 📄 SearchSuggestions.tsx      # Suggestions auto-complète
│   │
│   ├── ⭐ reviews/                       # Composants reviews
│   │   ├── 📄 ReviewCard.tsx             # Card review utilisateur
│   │   ├── 📄 ReviewForm.tsx             # Formulaire review
│   │   ├── 📄 RatingStars.tsx            # Affichage étoiles
│   │   ├── 📄 RatingDistribution.tsx     # Graphique distribution notes
│   │   └── 📄 ReviewsList.tsx            # Liste reviews paginée
│   │
│   ├── 📊 monitoring/                    # Composants health monitoring
│   │   ├── 📄 HealthStatus.tsx           # Indicateur status UP/DOWN
│   │   ├── 📄 UptimeChart.tsx            # Graphique uptime historique
│   │   ├── 📄 ResponseTimeChart.tsx      # Graphique temps réponse
│   │   ├── 📄 HealthDashboard.tsx        # Dashboard global
│   │   └── 📄 AlertsPanel.tsx            # Panel alertes monitoring
│   │
│   ├── 🔐 auth/                          # Composants authentification
│   │   ├── 📄 LoginForm.tsx              # Formulaire connexion
│   │   ├── 📄 SignupForm.tsx             # Formulaire inscription
│   │   ├── 📄 AuthProvider.tsx           # Provider context auth
│   │   ├── 📄 ProtectedRoute.tsx         # Guard routes privées
│   │   └── 📄 UserMenu.tsx               # Menu utilisateur connecté
│   │
│   ├── 📊 analytics/                     # Composants analytics
│   │   ├── 📄 StatsCards.tsx             # Cards métriques principales
│   │   ├── 📄 UsageChart.tsx             # Graphiques utilisation
│   │   └── 📄 PopularityRanking.tsx      # Ranking MCPs populaires
│   │
│   └── 🎨 layout/                        # Composants layout
│       ├── 📄 Header.tsx                 # Header navigation
│       ├── 📄 Footer.tsx                 # Footer site
│       ├── 📄 Sidebar.tsx                # Sidebar navigation
│       ├── 📄 Breadcrumbs.tsx            # Fil d'Ariane
│       └── 📄 ThemeProvider.tsx          # Provider thème dark/light
│
└── 🔧 src/lib/                           # E4: Logique métier & utilitaires
    ├── 🔌 mcp/                           # MCP Protocol handling
    │   ├── 📄 client.ts                  # Client MCP générique WebSocket/HTTP
    │   ├── 📄 health-checker.ts          # Service monitoring automatique
    │   ├── 📄 discovery.ts               # Auto-discovery GitHub/NPM
    │   ├── 📄 parser.ts                  # Parsing specs/configs MCP
    │   ├── 📄 validator.ts               # Validation protocole MCP
    │   └── 📄 types.ts                   # Types internes MCP
    │
    ├── 🗄️ database/                      # Interactions Supabase
    │   ├── 📄 client.ts                  # Client Supabase configuré
    │   ├── 📄 mcps.ts                    # CRUD MCPs + requêtes complexes
    │   ├── 📄 reviews.ts                 # CRUD reviews + agrégations
    │   ├── 📄 analytics.ts               # Requêtes métriques/stats
    │   ├── 📄 health-logs.ts             # Logging health checks
    │   └── 📄 migrations.ts              # Gestion migrations schema
    │
    ├── 🔐 auth/                          # Logique authentification
    │   ├── 📄 supabase-auth.ts           # Integration Supabase Auth
    │   ├── 📄 session-manager.ts         # Gestion sessions utilisateur
    │   ├── 📄 permissions.ts             # RBAC et permissions
    │   └── 📄 middleware.ts              # Middleware auth routes
    │
    ├── 🔍 search/                        # Moteur recherche
    │   ├── 📄 search-engine.ts           # Logique recherche principale
    │   ├── 📄 filters.ts                 # Logique filtres avancés
    │   ├── 📄 indexing.ts                # Indexation contenu recherche
    │   ├── 📄 ranking.ts                 # Algorithme ranking résultats
    │   └── 📄 suggestions.ts             # Auto-complétion recherche
    │
    ├── 📊 analytics/                     # Système analytics
    │   ├── 📄 tracker.ts                 # Tracking événements utilisateur
    │   ├── 📄 metrics.ts                 # Calculs métriques business
    │   ├── 📄 aggregator.ts              # Agrégation données analytics
    │   └── 📄 reporter.ts                # Génération rapports
    │
    ├── ⚡ cache/                         # Système caching
    │   ├── 📄 redis-client.ts            # Client Redis (future)
    │   ├── 📄 memory-cache.ts            # Cache mémoire local
    │   └── 📄 cache-strategies.ts        # Stratégies invalidation
    │
    ├── 🌐 api/                           # Clients API externes
    │   ├── 📄 github-client.ts           # Client GitHub API
    │   ├── 📄 npm-client.ts              # Client NPM registry
    │   └── 📄 webhook-handlers.ts        # Handlers webhooks entrants
    │
    ├── 🛠️ utils/                         # Utilitaires généraux
    │   ├── 📄 validators.ts              # Fonctions validation données
    │   ├── 📄 formatters.ts              # Formatage affichage
    │   ├── 📄 parsers.ts                 # Parsing configurations
    │   ├── 📄 date-utils.ts              # Utilitaires dates
    │   ├── 📄 string-utils.ts            # Manipulation strings
    │   ├── 📄 error-handler.ts           # Gestion erreurs centralisée
    │   └── 📄 logger.ts                  # Système logging structuré
    │
    └── 📁 config/                        # Configuration application
        ├── 📄 constants.ts               # Constantes application
        ├── 📄 env.ts                     # Validation env variables
        ├── 📄 database-config.ts         # Configuration Supabase
        └── 📄 app-config.ts              # Configuration générale app
```

---

## 🎯 CONVENTIONS DÉVELOPPEMENT

### **📛 Naming Conventions**
- **Fichiers** : kebab-case (`mcp-health-checker.ts`)
- **Composants** : PascalCase (`McpCard.tsx`)
- **Fonctions** : camelCase (`validateMcpConfig`)
- **Constants** : UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT_MS`)
- **Types** : PascalCase (`McpServerStatus`)

### **📁 Organisation Fichiers**
- **1 fichier = 1 responsabilité** principale
- **Index files** pour réexports propres
- **Co-location** : Tests près du code testé
- **Separation concerns** : UI / Logic / Data

### **📦 Imports/Exports**
```typescript
// ✅ Bon - Import depuis hub central
import { McpServer, HealthStatus } from '@/src/types'

// ❌ Mauvais - Import direct
import { McpServer } from '@/src/types/mcp'
```

### **🔧 Configuration Tools**
- **TypeScript** : Strict mode, no implicit any
- **ESLint** : Max warnings 0, strict rules
- **Prettier** : Auto-formatting, trailing commas
- **Jest** : Coverage threshold 80%+
- **Playwright** : Parallel tests, retry on failure

---

## 🚀 DÉVELOPPEMENT WORKFLOW

### **Phase 1 : Architecture (E1)**
1. Créer structure `docs/` complète
2. Définir tous ADR pour décisions majeures
3. Valider avec stakeholders avant code

### **Phase 2 : Types (E2)**
1. Créer hub `src/types/index.ts`
2. Définir tous types stricts
3. Pas de `any` autorisé

### **Phase 3 : Tests (E3)**
1. Tests d'intégration MCP PRIORITÉ
2. Tests unitaires pour logique métier
3. Tests E2E workflows utilisateur

### **Phase 4 : Implémentation (E4)**
1. Composants UI avec Storybook
2. API routes avec validation
3. Integration continue

---

## 🛡️ QUALITY GATES

### **Definition of Done**
- [ ] Code écrit et testé (>80% coverage)
- [ ] `pnpm run build` successful
- [ ] `pnpm run test` tous passent
- [ ] `pnpm run lint` 0 erreurs
- [ ] `pnpm run typecheck` 0 erreurs TypeScript
- [ ] Documentation mise à jour
- [ ] ADR créé si décision architecture

### **Code Review Checklist**
- [ ] Conformité E1-E16 respectée
- [ ] Types stricts utilisés
- [ ] Tests couvrent edge cases
- [ ] Performance acceptable
- [ ] Sécurité validée
- [ ] Accessibilité respectée

---

**🎯 Cette structure garantit un développement scalable, maintenable et conforme aux meilleures pratiques pour le succès du Catalogue MCP-Zero.**