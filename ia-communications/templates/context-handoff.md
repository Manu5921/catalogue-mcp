# 🔄 Template Context Handoff Multi-Agents

## 📋 Informations de Passation
**De :** [Claude/Gemini]  
**Vers :** [Gemini/Claude]  
**Timestamp :** [TIMESTAMP_COMPLET]  
**Tâche Archon :** [TASK_ID]  
**Raison Handoff :** [Spécialisation/Optimisation/Validation/Autre]  

## 🏗️ État Actuel du Projet

### Architecture Globale
**Phase E1-E16 :** [E1/E2/E3/E4...]  
**Avancement :** [Pourcentage estimé]  
**Dernière validation :** [Timestamp derniers tests passés]

### Structure Fichiers Actuelle
```
catalogue-mcp/
├── [ARBRE STRUCTURE COMPLÈTE AVEC STATUS]
│   ├── ✅ Fichiers complétés
│   ├── 🚧 Fichiers en cours
│   └── ❌ Fichiers manquants
```

### Stack Technique Confirmée
- **Frontend :** Next.js 15 + React 19 + TypeScript strict
- **Backend :** Next.js API routes + Supabase
- **Database :** PostgreSQL via Supabase (Schema créé/en cours/manquant)
- **Styling :** Tailwind CSS (Configuration OK/KO)
- **Testing :** Jest + Playwright (Configuré/Non configuré)
- **Package Manager :** PNPM (Lock file présent/absent)

## 💼 Tâches Accomplies

### Développement
- [x] [Tâche complétée 1] - [Timestamp]
- [x] [Tâche complétée 2] - [Timestamp]
- [ ] [Tâche partiellement complétée] - [Détails état]

### Validation Effectuée
- ✅ `pnpm run build` : [Status avec timestamp]
- ✅ `pnpm run test` : [Nombre tests passés/échoués]
- ✅ `pnpm run lint` : [Nombre erreurs/warnings]
- ✅ `pnpm run typecheck` : [Status TypeScript]

### Documentation Créée
- [x] [ADR-XXX-titre.md] : [Résumé décision]
- [x] [README section] : [Mise à jour apportée]

## ❌ Problèmes Identifiés

### Issues Techniques
1. **[Problème 1]**
   - **Nature :** [Description précise]
   - **Impact :** [Critique/Majeur/Mineur]
   - **Tentatives résolution :** [Actions testées]
   - **Status :** [Bloqué/En cours/À investiguer]

### Debt Technique
- [Dette 1] : [Description et priorité]
- [Dette 2] : [Description et priorité]

### Dépendances Bloquantes
- [Dépendance externe] : [Status et impact]
- [Validation utilisateur] : [Attendue pour quoi]

## 🎯 Mission pour l'Agent Suivant

### Objectif Principal
[DÉCRIRE CLAIREMENT CE QUI EST ATTENDU]

### Sous-Objectifs Spécifiques
1. **[Sous-objectif 1]** : [Critères acceptation]
2. **[Sous-objectif 2]** : [Critères acceptation]
3. **[Sous-objectif 3]** : [Critères acceptation]

### Contraintes Particulières
- **Performance :** [Critères spécifiques]
- **Compatibilité :** [Versions/Browser support]
- **Sécurité :** [Considérations spéciales]

## 🔧 Configuration Environnement

### Variables d'Environnement
```env
# Status des variables requises
NEXT_PUBLIC_SUPABASE_URL=[CONFIGURÉ/MANQUANT]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[CONFIGURÉ/MANQUANT]
DATABASE_URL=[CONFIGURÉ/MANQUANT]
```

### Dependencies Critiques
```json
{
  "dependencies": {
    "next": "15.0.0", // [INSTALLÉ/À INSTALLER]
    "@supabase/supabase-js": "^2.45.0", // [STATUS]
    "typescript": "^5.6.0" // [STATUS]
  }
}
```

### Base de Données
- **Schema :** [Créé/En cours/À créer]
- **Tables :** [Liste avec status]
- **Migrations :** [Appliquées/En attente]
- **Seed data :** [Présent/À créer]

## 📚 Context Technique Détaillé

### Patterns Établis
- **Architecture :** [Pattern utilisé avec justification]
- **State Management :** [Approche choisie]
- **Error Handling :** [Strategy établie]
- **Authentication :** [Implémentation actuelle]

### APIs/Endpoints
```typescript
// Status des endpoints
GET /api/mcps - [CRÉÉ/EN COURS/À CRÉER]
POST /api/mcps/health - [STATUS]
// ... autres endpoints
```

### Types TypeScript
- **Hub central :** `src/types/index.ts` [Status]
- **Types MCP :** `src/types/mcp.ts` [Status]
- **Types Database :** [Générés/À générer]

## 🧪 Tests et Validation

### Coverage Actuel
- **Tests unitaires :** [Pourcentage coverage]
- **Tests intégration :** [Nombre tests MCP réels]
- **Tests E2E :** [Workflows couverts]

### Test Data
- **MCPs de test :** [Liste serveurs test disponibles]
- **Mock data :** [Datasets créés]

## 🚨 Points d'Attention Critiques

### Red Flags Techniques
- [Point critique 1 à surveiller]
- [Point critique 2 à surveiller]

### Process-First Rappels
- ✅ Utiliser `/mcp archon` avant actions techniques
- ✅ Context7 pour docs Next.js/Supabase
- ✅ Serena pour opérations code
- ✅ Zero Trust : preuves build/test obligatoires
- ✅ PNPM uniquement (jamais npm)

## 📊 Métriques de Performance

### Build Metrics
- **Temps build :** [Dernière mesure]
- **Bundle size :** [Taille actuelle]
- **Type checking :** [Temps TypeScript]

### Runtime Metrics
- **Page load :** [Mesures actuelles]
- **API response :** [Temps moyens]

## 🔄 Handoff Follow-up

### Validation Attendue
- [ ] Confirmation compréhension mission
- [ ] Questions clarification si nécessaires
- [ ] Plan d'action proposé

### Communication
**Retour attendu dans :** [Délai souhaité]  
**Format :** [Via quel template]  
**Escalation si bloquage :** [Procédure]

---

**🎯 Ce context handoff assure une transmission complète et précise pour la continuité optimale du développement du Catalogue MCP-Zero.**