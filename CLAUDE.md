# 🚀 CATALOGUE MCP - GUIDE SESSION CLAUDE CODE

## 🎯 CONTEXTE PROJET : CATALOGUE UNIVERSEL DES MCP SERVERS

**MISSION :** Créer un catalogue complet des MCP (Model Context Protocol) servers disponibles avec documentation, exemples d'usage, et intégration Claude Code.

---

## 🚨 LIRE D'ABORD : CLAUDE_CRITICAL_RULES.md
**AVANT TOUTE ACTION** → Consulter les 5 règles critiques dans `CLAUDE_CRITICAL_RULES.md`

---

## 📚 WORKFLOW E1-E16 ARCHON - ARCHITECTURE FIRST

### **🔄 ÉTAPES OBLIGATOIRES DANS L'ORDRE :**

#### **1. 📋 ARCHITECTURE FIRST (4 fichiers)**
```bash
# AVANT tout code - Planification obligatoire
docs/PRD.md                    # Product Requirements Document
docs/PROJECT_STRUCTURE.md      # Organisation du code
docs/WORKFLOW_FOR_AI.md        # Instructions IA détaillées
docs/ADR/                      # Architecture Decision Records
```

#### **2. 🏷️ TYPES FIRST (Anti-hallucination)**
```bash
# Types = ancrage IA + réduction erreurs
src/types/index.ts             # Hub central tous types
src/types/mcp.ts              # Types MCP servers
src/types/api.ts              # Types API/requests  
src/types/ui.ts               # Types interface utilisateur
```

#### **3. 🧪 TESTS FIRST (Most valuable technique)**
```bash
# Tests d'intégration prioritaires (vraies APIs)
tests/integration/            # APIs MCP réels
tests/unit/                   # Tests unitaires
tests/e2e/                    # End-to-end workflow
```

#### **4. ⚡ IMPLEMENTATION**
```bash
# Développement fonctionnalités
src/lib/                      # Logique métier
src/components/               # UI React/Next.js
src/api/                      # Endpoints API
```

#### **5. 📝 DOCUMENTATION ADR**
```bash
# Après chaque décision importante
docs/ADR/ADR-XXX-decision.md  # Contexte pour futures sessions
```

---

## 🚀 SYSTÈME ARCHON DISPONIBLE - UTILISATION PRIORITAIRE

### **🎯 NOUVEAU PARADIGME : WORKFLOW MCP NATIF RÉVOLUTIONNAIRE**

**TRANSFORMATION MAJEURE** : Archon + Context7 + Gemini + Jules intégrés nativement dans Claude via MCP !

**Services Archon Opérationnels :**
- ✅ **Archon UI :** http://localhost:3737 (interface projets/tâches)
- ✅ **Archon API :** http://localhost:8181 (backend Supabase)  
- ✅ **Archon MCP :** http://localhost:8051/mcp (FastMCP streaming)
- ✅ **GitHub MCP :** http://localhost:8054 (200+ GitHub tools)
- ✅ **Jules MCP :** http://localhost:8055 (Direct Jules communication)

### **⚡ WORKFLOW ARCHON E1-E16 - OBLIGATOIRE**

#### **ÉTAPE 1 : Vérification Système Archon**
```bash
# AVANT TOUTE CHOSE - Vérifier que Archon est disponible
/mcp archon health_check_all
/mcp archon get_services_status

# Si non disponible → Voir section TROUBLESHOOTING
```

#### **ÉTAPE 2 : Bootstrap Projet avec Archon (RECOMMANDÉ)**
```bash
# 1. Aller sur http://localhost:3737
# 2. Créer nouveau projet avec nom + description via interface
# 3. Noter l'ID projet (ex: proj_abc123)
# 4. Revenir dans Claude Code et exécuter :

# PREVIEW + VALIDATION OBLIGATOIRE (Évite refactorisations coûteuses)
/mcp archon preview_project_architecture project_id="proj_abc123"
                                        template="e1_architecture_first"

# → Génère preview complète architecture E1-E16
# → Claude propose roadmap + structure  
# → ATTENDRE validation utilisateur

# GÉNÉRATION APRÈS VALIDATION UNIQUEMENT
/mcp archon bootstrap_project project_id="proj_abc123" --confirmed

# → Génère automatiquement toute l'architecture E1-E16
# → Synchronise avec le projet Archon UI  
# → Crée les tâches et documentation
```

#### **ÉTAPE 3 : Commandes MCP Essentielles**

**Context7 - Documentation Libraries**
```bash
/mcp context7 resolve-library-id "Next.js"
/mcp context7 get-library-docs "/nextjs/next.js" --topic="App Router"
```

**Serena - Analyse Code**
```bash
/mcp serena get_symbols_overview "src/"
/mcp serena find_symbol "McpServer"
/mcp serena search_for_pattern "interface.*Server"
```

**Archon - Project Management & Quality**
```bash
# Project Management
/mcp archon get_project project_id="latest"
/mcp archon list_tasks filter_by="status" filter_value="todo"
/mcp archon create_task project_id="latest" title="[Feature]" description="[Détails]"

# Synchronisation complète (CRITIQUE)
/mcp archon MAJ  # Met à jour tasks + vérifie cohérence projet

# Recherche & Patterns
/mcp archon perform_rag_query query="[question]" match_count=5
/mcp archon search_code_examples query="[pattern]" match_count=3
/mcp archon query_golden_patterns feature="authentication"

# Validation & Quality Gates
/mcp archon validate_code_quality project_id="latest"
/mcp archon audit_best_practices standards="E1,E2,E3,E8"
/mcp archon quality_gates_check gates="P0,P1,P2,P3,P4"
```

### **🏆 GOLDEN CODE PATTERNS - RÉVOLUTION DÉVELOPPEMENT**

**Concept :** Au lieu de générer du code from scratch, Archon utilise des **patterns battle-tested** de la communauté avec Health Scores 9.8-9.9/10.

**Patterns Disponibles :**
- **Authentication** : Supabase + Next.js App Router (Score 9.8/10)
- **Payments** : Stripe Subscriptions (Score 9.9/10) 
- **Plus patterns communautaires validés**

```bash
# Activer patterns automatiquement
/mcp archon apply_golden_pattern pattern="e2_types_anti_hallucination"
/mcp archon apply_golden_pattern pattern="e3_tests_integration_first"
```

### **🔄 WORKFLOW DÉVELOPPEMENT avec Archon**

```bash
# Pour chaque nouvelle feature :

# 1. Créer tâche Archon
/mcp archon create_task project_id="latest" 
                       title="[Nom de la feature]"
                       assignee="AI IDE Agent"
                       feature="[nom-feature]"

# 2. Recherche patterns et exemples
/mcp archon search_code_examples query="[votre-feature] patterns" match_count=3

# 3. Smart Review avant développement
/mcp archon smart_review_workflow task="Architecture validation [feature]"
                                 requirements="E1-E16 compliance"

# 4. Développement avec validation continue
[Développer la feature...]

# 5. Synchronisation finale
/mcp archon MAJ
/mcp archon update_task task_id="[task-id]" status="review"
```

---

## 🛡️ ZERO TRUST VALIDATION + ESLint ANTI-FRICTION

### **🚀 NOUVEAU : Système ESLint Anti-Friction Opérationnel**

**RÉVOLUTION DÉVELOPPEMENT IA :**
- ✅ **ZERO ERROR Build** : Warnings uniquement, build toujours réussi
- ✅ **Auto-Fix Intelligent** : `pnpm run lint:fix` résout 90% des issues
- ✅ **Patterns IA-Friendly** : `_` prefix, type imports, overrides contextuels
- ✅ **Pre-commit Guards** : Validation automatique via Husky

### **Workflow Validation ESLint-Powered :**
```bash
# 1. Auto-fix ESLint (NOUVEAU - Priorité 1)
pnpm run lint:fix
# → Résout automatiquement imports, unused vars, type imports

# 2. Build validation (maintenant sans friction)
pnpm run build 2>&1 | tee build.log
# → GARANTI "BUILD SUCCESSFUL" avec warnings acceptables

# 3. Linting validation
pnpm run lint 2>&1 | tee lint.log
# → Warnings OK, ZERO ERROR requis

# 4. Tests complets  
pnpm run test 2>&1 | tee test.log
# → Confirmer "All tests passed"

# 5. Type checking
pnpm run typecheck 2>&1 | tee types.log
# → 0 erreurs TypeScript critiques
```

### **🔧 Commands ESLint Anti-Friction :**
```bash
# Développement quotidien
pnpm run lint:fix          # Auto-fix immédiat
pnpm run prepush           # Pre-commit validation complète

# Debugging ESLint
cat RULES_DIGEST.md        # Guide patterns IA-friendly
```

### **Definition of Done :**
- ✅ Code écrit et testé
- ✅ Build successful avec logs
- ✅ Tests passent avec rapport
- ✅ Linting clean
- ✅ Documentation ADR mise à jour

---

## 🎯 SPÉCIFICITÉS CATALOGUE MCP

### **Objectifs Business :**
- 📋 Répertorier TOUS les MCP servers disponibles
- 📖 Documentation usage détaillée par server
- 🔗 Intégration native Claude Code
- 🧪 Tests fonctionnels sur MCP réels
- 📊 Système rating/review communautaire

### **Stack Technique Recommandé :**
- **Frontend** : Next.js 15 + React + TypeScript
- **Backend** : Next.js API routes + Supabase
- **Database** : PostgreSQL (via Supabase)
- **Styling** : Tailwind CSS
- **Testing** : Jest + Playwright E2E
- **Deployment** : Vercel

### **Architecture MCP :**
- Connexions multiples MCP servers simultanées
- Discovery automatique nouveaux servers
- Health checks réguliers servers
- Caching intelligent responses
- Rate limiting par server

---

## 🚨 CRITICAL SUCCESS FACTORS

### **1. Architecture Solide FIRST**
- Pas de code avant architecture complète
- ADR documenter TOUTES les décisions
- Types stricts éliminer hallucinations

### **2. Tests Integration-First**
- Connecter vrais MCP servers
- Pas de mocks sauf impossible
- E2E workflow complet utilisateur

### **3. Zero Trust Systematic**
- Preuves objectives chaque affirmation
- Build/test logs complets obligatoires
- Validation croisée Gemini sur décisions

### **4. Process-First Always**
- Vérifier MCP Archon disponible
- Suivre CLAUDE.md workflows
- Communiquer processus utilisé

---

## 📊 MÉTRIQUES SUCCÈS

### **Technique :**
- ✅ Build time <30s
- ✅ Tests pass rate 100%
- ✅ Type coverage >95%
- ✅ Lint warnings 0

### **Business :**
- 📋 50+ MCP servers catalogués
- 👥 100+ utilisateurs actifs
- ⭐ Rating système fonctionnel
- 🔄 Auto-discovery nouveaux MCPs

---

## 🔍 TROUBLESHOOTING

### **Si Système Archon Non Disponible :**
```bash
# 1. Vérifier services Archon
curl -s http://localhost:3737 | head -2     # UI React
curl -s http://localhost:8181/health        # API Backend
curl -s http://localhost:8051/mcp           # MCP Server

# 2. Si Archon down → Redémarrage rapide (3-4 min)
# Terminal 1: Orchestra
cd /Users/manu/Documents/DEV/archon-orchestrator && node setup-gemini-bridge.js setup &

# Terminal 2: Archon Principal  
cd /Users/manu/Documents/DEV/archon && make dev

# 3. Diagnostic complet
/mcp archon diagnose_system
/mcp archon test_all_integrations
```

### **Si MCP Commands Échouent :**
```bash
# Diagnostic MCP natif
/mcp archon health_check_all
/mcp archon get_services_status

# Test Context7 
/mcp context7 connection_test

# Auto-repair si possible
/mcp archon auto_repair_services
```

### **Si Build Fails :**
```bash
# 1. ESLint Anti-Friction FIRST (NOUVEAU)
pnpm run lint:fix
cat RULES_DIGEST.md  # Consulter patterns IA-friendly

# 2. Zero Trust debugging avec validation MCP
/mcp archon validate_build --show-logs
/mcp archon run_command "pnpm run build" --capture-output
/mcp archon run_command "pnpm run typecheck" --capture-output
/mcp archon run_command "pnpm run lint:fix" --capture-output
```

### **Si ESLint Friction (NOUVEAU) :**
```bash
# Diagnostic ESLint
pnpm run lint:fix              # Auto-fix patterns courants
cat .eslintrc.json             # Vérifier configuration
cat RULES_DIGEST.md           # Patterns IA validés

# Overrides temporaires si nécessaire
# API routes : déjà configuré no-unused-vars: off
# Tests : déjà configuré no-explicit-any: off
```

### **Si Architecture Confusion :**
```bash
# Retour aux fondamentaux
cat docs/PRD.md
cat docs/PROJECT_STRUCTURE.md  
cat docs/ADR/*.md

# Ou utiliser Archon pour guidance
/mcp archon get_project project_id="latest"
/mcp archon perform_rag_query query="architecture guidance catalogue MCP" match_count=5
```

### **Si Validation Échoue :**
```bash
# Validation complète avec Archon + Multi-IA
/mcp archon smart_review_workflow code="./src/" task="Validation complète"
/mcp archon gemini_prevalidate code="./src/" checklist="imports,types,syntax"
/mcp archon validate_code_quality project_id="latest" --with-score
```

---

**🎉 Ce guide garantit cohérence intersessions et succès projet !**