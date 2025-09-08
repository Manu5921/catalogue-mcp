# 🤖 Template Prompt pour Gemini

## 📋 Contexte de la Mission
**Projet :** Catalogue MCP-Zero  
**Phase Actuelle :** [À REMPLIR]  
**Tâche Archon ID :** [À REMPLIR]  
**Timestamp :** [À REMPLIR]  

## 🎯 Objectif Spécifique
[DÉCRIRE PRÉCISÉMENT CE QUE GEMINI DOIT ACCOMPLIR]

### Sous-objectifs :
- [ ] [Sous-objectif 1]
- [ ] [Sous-objectif 2]
- [ ] [Sous-objectif 3]

## 🏗️ Contexte Technique

### Stack Utilisée
- **Frontend :** Next.js 15 + React + TypeScript strict
- **Backend :** Next.js API routes + Supabase
- **Database :** PostgreSQL (via Supabase)
- **Styling :** Tailwind CSS
- **Testing :** Jest + Playwright E2E
- **Package Manager :** PNPM (OBLIGATOIRE)

### Architecture E1-E16
- **E1 :** Architecture FIRST (docs/ complète)
- **E2 :** Types FIRST (src/types/ hub central)
- **E3 :** Tests FIRST (integration avec MCPs réels)

### Fichiers Existants Relevants
[LISTER LES FICHIERS DÉJÀ CRÉÉS PERTINENTS]

## 🚨 Contraintes Critiques (Non-Négociables)

### 5 Commandements CLAUDE_CRITICAL_RULES.md
1. **Process-First Protocol** : Vérifier `/mcp archon [commande]` avant actions
2. **Context7 MCP** : Utiliser pour Next.js, Supabase, TypeScript docs
3. **Serena MCP** : Préférer pour opérations code vs bash
4. **Zero Trust Protocol** : Preuves obligatoires (build, test, lint logs)
5. **PNPM Uniquement** : Interdiction npm, utilisation exclusive pnpm

### Standards Techniques
- TypeScript strict mode OBLIGATOIRE
- Tests d'intégration avec MCPs réels (pas de mocks)
- Documentation ADR pour toute décision architecture
- Conformité workflow E1-E16

## 📦 Requirements Spécifiques
[DÉTAILLER LES REQUIREMENTS FONCTIONNELS ET TECHNIQUES]

### Fonctionnalités Attendues
- [Fonctionnalité 1 avec critères acceptation]
- [Fonctionnalité 2 avec critères acceptation]

### Critères de Performance
- [Critère performance 1]
- [Critère performance 2]

## 🧪 Validation Attendue

### Definition of Done
- [ ] Code écrit et testé
- [ ] `pnpm run build` successful avec logs complets
- [ ] `pnpm run test` tous tests passent avec rapport
- [ ] `pnpm run lint` aucune erreur
- [ ] `pnpm run typecheck` 0 erreurs TypeScript
- [ ] Documentation ADR mise à jour

### Tests Requis
- [ ] Tests unitaires pour nouvelles fonctions
- [ ] Tests d'intégration avec MCPs réels si applicable
- [ ] Tests E2E pour workflows utilisateur
- [ ] Validation performance (<2s page load, <500ms API)

## 📤 Format de Réponse Souhaité

### Structure Attendue
1. **Analyse de la tâche** (compréhension requirements)
2. **Approche technique** (décisions architecture/implémentation)
3. **Code généré** (avec commentaires justifications)
4. **Tests créés** (unitaires, intégration, E2E)
5. **Validation complète** (logs build/test/lint)
6. **Documentation** (ADR si décisions architecture)
7. **Next steps** (recommandations suite)

### Preuves Objectives Requises
- Sortie complète `pnpm run build`
- Rapport détaillé `pnpm run test` 
- Résultat `pnpm run lint`
- Screenshots/logs validation fonctionnelle

## 🔄 Handoff Prévu
**Retour vers :** Claude  
**Pour :** [DÉCRIRE ÉTAPE SUIVANTE]  
**Context à préserver :** [ÉLÉMENTS CRITIQUES À TRANSMETTRE]

---

**⚡ Ce template garantit une communication Claude→Gemini précise et complète pour la réussite du projet Catalogue MCP-Zero.**