# 🤖 IA Communications - Handoffs Multi-Agents

## 🎯 Objectif
Ce dossier gère la **communication structurée** et les **handoffs** entre les agents IA (Claude, Gemini) via un système de templates standardisés pour garantir la cohérence et la continuité dans le développement du projet Catalogue MCP-Zero.

## 🔄 Workflow Collaboration
1. **Claude** → Analyse, planification, architecture
2. **Gemini** → Implémentation, optimisation, validation  
3. **Templates** → Garantir transfert contexte complet
4. **Orchestra** → Coordination automatique handoffs

## 📁 Structure
- `templates/` : Formats standardisés communication
- `sessions/` : Historique handoffs pour traçabilité
- `protocols/` : Protocoles spécifiques par type de tâche

## 🛡️ Conformité Process-First
Tous les handoffs respectent les 5 commandements CLAUDE_CRITICAL_RULES.md et utilisent les outils MCP appropriés (Archon, Context7, Serena).

## 🎯 Templates Disponibles

### 📝 `gemini-prompt-template.md`
Template pour structurer les prompts envoyés à Gemini avec :
- Contexte technique complet
- Objectifs spécifiques
- Contraintes et requirements
- Format de réponse attendu

### 📝 `claude-response-template.md`  
Template pour structurer les réponses de Claude avec :
- Analyse de la tâche
- Décisions techniques prises
- Code généré avec justifications
- Next steps recommandés

### 📝 `context-handoff.md`
Template pour la passation de contexte entre agents :
- État actuel du projet
- Tâches complétées
- Problèmes rencontrés
- Dépendances techniques

### 📝 `validation-checklist.md`
Checklist de validation inter-agents :
- Tests passés
- Code quality gates
- Documentation mise à jour
- Performance vérifiée

## ⚡ Utilisation

### Handoff Claude → Gemini
1. Utiliser `claude-response-template.md` pour documenter le travail
2. Remplir `context-handoff.md` avec l'état complet
3. Préparer `gemini-prompt-template.md` pour la suite
4. Archiver dans `sessions/` avec timestamp

### Handoff Gemini → Claude
1. Utiliser `validation-checklist.md` pour vérifier la qualité
2. Documenter les résultats dans `context-handoff.md`
3. Préparer le prochain cycle de développement

## 🔗 Intégration Orchestra
Ce système s'intègre avec Orchestra pour automatiser :
- Détection des points de handoff
- Application automatique des templates
- Validation des transfers de contexte
- Traçabilité complète des handoffs

---

**🎯 Ce système garantit une collaboration IA fluide et traçable pour le succès du projet Catalogue MCP-Zero.**