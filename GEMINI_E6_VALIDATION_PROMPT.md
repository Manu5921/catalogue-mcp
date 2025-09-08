# 🚀 PROMPT GEMINI - VALIDATION PHASE E6 CATALOGUE MCP

## 🎯 CONTEXTE MISSION
**Projet:** Catalogue MCP - Système universel de découverte et monitoring des serveurs Model Context Protocol
**Phase Actuelle:** E6 - Tests & Validation
**Objectif:** Valider l'implémentation complète avec les serveurs MCP réels et garantir la qualité production

## 📋 ÉTAT ACTUEL DU PROJET

### ✅ Phases Complétées:
- **E1-E2:** Architecture & Types ✅
- **E3:** Environment Validation ✅  
- **E4:** Tests First (structure Jest/Playwright) ✅
- **E5:** Implementation complète ✅
  - Lib MCP (connection, discovery, health)
  - API Routes (mcps, health, search)
  - UI Components (catalogue, détails, monitoring)
  - Intégration health dashboard

### 🏗️ Architecture Implémentée:
```
catalogue-mcp2/
├── src/
│   ├── lib/mcp/           # Core MCP library
│   │   ├── connection.ts   # Connection manager singleton
│   │   ├── discovery.ts    # Auto-discovery service
│   │   └── health-monitor.ts # Health monitoring system
│   ├── app/
│   │   ├── api/           # Next.js API routes
│   │   ├── catalogue/     # Catalogue browser page
│   │   └── server/[id]/   # Server detail pages
│   ├── components/        # React components
│   └── types/            # TypeScript definitions
└── tests/
    ├── unit/             # Unit tests
    ├── integration/      # Integration tests
    └── e2e/             # Playwright E2E tests
```

## 🎮 SERVEURS MCP DISPONIBLES

### Serveurs Réels à Tester:
1. **Archon MCP** (http://localhost:8051)
   - Project management, RAG, tasks
   - Health endpoint: /mcp/health
   
2. **Context7** (http://localhost:8052)
   - Documentation libraries
   - Health endpoint: /health

3. **Serena** (http://localhost:8053)
   - Code analysis & memory
   - Health endpoint: /status

## 🔍 MISSION E6 - VALIDATION COMPLÈTE

### 1️⃣ **Tests Fonctionnels MCP Réels**
```typescript
// À valider:
- Discovery automatique ports 8051-8055
- Connection réussie à chaque serveur
- Listing des tools disponibles
- Listing des resources exposées
- Health checks temps réel
- Métriques de performance (uptime, response time)
```

### 2️⃣ **Tests d'Intégration UI/API**
```typescript
// Parcours utilisateur complet:
1. Page d'accueil → Navigation catalogue
2. Recherche serveur "Archon" → Résultats filtrés
3. Click sur serveur → Page détails avec tools
4. Activation monitoring → Dashboard temps réel
5. Export configuration → Claude Code ready
```

### 3️⃣ **Validation Performance**
```bash
# Métriques cibles:
- Discovery < 3s pour 5 serveurs
- Health check < 500ms par serveur
- Search response < 200ms
- UI First Paint < 1s
- Build time < 30s
```

### 4️⃣ **Tests de Robustesse**
```typescript
// Scénarios d'erreur:
- Serveur MCP offline → Fallback gracieux
- Timeout connection → Retry avec backoff
- Rate limiting → Queue management
- Erreur health check → Alert système
```

## 📝 CHECKLIST VALIDATION E6

### **A. Tests Automatisés**
```bash
□ pnpm test:unit       # 100% pass
□ pnpm test:integration # Connexion vrais MCPs
□ pnpm test:e2e        # Parcours complet
□ pnpm test:coverage   # >80% coverage
```

### **B. Validation Manuelle**
```bash
□ Discovery trouve Archon, Context7, Serena
□ Health monitoring affiche métriques réelles
□ Search retourne résultats pertinents
□ UI responsive mobile/desktop
□ Export config fonctionne pour Claude Code
```

### **C. Quality Gates**
```bash
□ pnpm run build      # BUILD SUCCESS
□ pnpm run lint       # 0 errors critiques
□ pnpm run typecheck  # 0 type errors
□ Lighthouse score >90 # Performance web
```

### **D. Documentation**
```markdown
□ README.md avec setup instructions
□ API documentation complète
□ Architecture Decision Records (ADR)
□ Changelog avec tous les changements
```

## 🚨 ACTIONS GEMINI ATTENDUES

### 1. **Analyse Code Review**
```markdown
- Vérifier architecture respect patterns E1-E16
- Identifier code smells ou anti-patterns
- Suggérer optimisations performance
- Valider sécurité (no secrets, sanitization)
```

### 2. **Tests Validation**
```bash
# Exécuter et analyser:
1. git pull latest changes
2. pnpm install
3. pnpm run build
4. pnpm test
5. pnpm run dev → Test manuel UI
```

### 3. **Rapport Validation E6**
```markdown
## VALIDATION REPORT E6

### ✅ SUCCESSES
- [Liste points validés]

### ⚠️ ISSUES FOUND
- [Liste problèmes avec sévérité]

### 🔧 RECOMMENDATIONS
- [Actions correctives prioritaires]

### 📊 METRICS
- Build time: XXs
- Test coverage: XX%
- Bundle size: XXkB
- Lighthouse: XX/100

### 🎯 E6 STATUS: [PASS/FAIL]
```

## 💡 CONSEILS POUR GEMINI

### Priorités Validation:
1. **CRITIQUE:** Connexion réelle aux MCPs (pas seulement mocks)
2. **IMPORTANT:** Health monitoring avec données live
3. **NICE-TO-HAVE:** Optimisations performance

### Points d'Attention:
- Vérifier CORS headers pour connexions cross-origin
- Tester rate limiting pour éviter DDoS
- Valider error boundaries React
- S'assurer no memory leaks dans monitoring

### Success Criteria E6:
```yaml
mandatory:
  - Connexion réussie à au moins 1 vrai MCP
  - Health dashboard affiche données réelles
  - Build & tests passent sans erreurs
  
optional:
  - 100% des serveurs découverts
  - Métriques < seuils performance
  - Documentation 100% complète
```

## 🎬 COMMANDE DE DÉMARRAGE

```bash
# Pour Gemini sur ia-communications:
cd /path/to/catalogue-mcp2
git status # Vérifier état clean
pnpm install # Installer dépendances
pnpm run dev # Lancer en mode dev

# Ouvrir http://localhost:3000
# Vérifier que les serveurs MCP sont UP:
curl http://localhost:8051/mcp # Archon
curl http://localhost:8052/health # Context7
curl http://localhost:8053/status # Serena

# Lancer validation complète:
pnpm run validate:e6 # Script custom si créé
# OU
pnpm test && pnpm build && pnpm run lighthouse
```

## 📊 OUTPUT ATTENDU

Gemini devrait fournir:
1. **Confirmation connexion réelle** aux MCPs (screenshots)
2. **Rapport de test** avec couverture
3. **Métriques performance** mesurées
4. **Liste issues** priorisées
5. **Recommandations** pour E7

---

**🔥 PROMPT FINAL POUR GEMINI:**

> "Valide la Phase E6 du Catalogue MCP en testant la connexion réelle aux serveurs Archon (8051), Context7 (8052) et Serena (8053). Vérifie que le health monitoring affiche des données live, que la discovery fonctionne, et que l'UI permet de naviguer entre les serveurs. Exécute les tests automatisés, mesure les performances, et fournis un rapport de validation complet avec status PASS/FAIL pour E6."

---

**Note:** Si les serveurs MCP ne sont pas disponibles sur ia-communications, Gemini peut valider avec les mocks mais doit le signaler clairement dans le rapport.