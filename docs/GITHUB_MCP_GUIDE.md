# 🚀 GitHub MCP Integration Guide

Guide complet pour utiliser GitHub MCP Server avec le projet Catalogue-MCP.

## 🎯 Objectifs

Le GitHub MCP permet de :
- 📤 **Publier automatiquement** le repository sur GitHub
- 🔄 **Gérer les commits** et pull requests depuis Claude
- 📋 **Synchroniser les issues** avec les tâches Archon
- 🚀 **Automatiser les releases** et déploiements
- 📊 **Analyser les statistiques** du repository

## 🔐 Pré-requis

### 1. GitHub Personal Access Token (PAT)

1. Aller sur : https://github.com/settings/tokens/new
2. Nom : `Claude MCP - Catalogue MCP`
3. Scopes requis :
   - ✅ `repo` (Full repository access)
   - ✅ `workflow` (GitHub Actions)
   - ✅ `read:org` (Organization data)
   - ✅ `project` (Project management)
   - ✅ `read:user` (User profile data)

### 2. Docker Desktop

- Installer depuis : https://www.docker.com/products/docker-desktop
- S'assurer que Docker est démarré

## 🚀 Installation

### Méthode Automatique (Recommandée)

```bash
# 1. Configurer votre GitHub PAT
nano .env.github
# Remplacer: GITHUB_PERSONAL_ACCESS_TOKEN=your_github_pat_here

# 2. Lancer l'installation automatique
pnpm run github:setup

# 3. Ajouter à Claude (suivre les instructions affichées)
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_TOKEN -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
```

### Méthode Manuelle

```bash
# 1. Démarrer le serveur MCP GitHub
docker run -d \
  --name github-mcp-server \
  -p 8054:8054 \
  -e GITHUB_PERSONAL_ACCESS_TOKEN="YOUR_TOKEN" \
  -e PORT="8054" \
  ghcr.io/github/github-mcp-server:latest

# 2. Ajouter à Claude
claude mcp add --transport http github http://localhost:8054 -H "Authorization: Bearer YOUR_TOKEN"
```

## ✅ Vérification

```bash
# Vérifier que le serveur tourne
pnpm run github:status

# Voir les logs
pnpm run github:logs

# Tester dans Claude
claude mcp list
claude mcp get github
```

## 🛠️ Utilisation avec Claude

### Commandes Disponibles

```bash
# Publication du repository
/mcp github create_repository --name "catalogue-mcp" --description "Universal MCP Server Catalogue" --private false

# Gestion des commits
/mcp github create_commit --message "feat: Add E6 testing suite" --files "tests/**"

# Création de pull requests
/mcp github create_pull_request --title "E6 Advanced Testing" --body "Complete testing suite implementation"

# Gestion des issues
/mcp github create_issue --title "API Authentication Missing" --body "HIGH: Add authentication to admin endpoints"

# Analyse du repository
/mcp github get_repository_stats
/mcp github list_commits --limit 10
```

### Workflow Publication GitHub

1. **Initialisation Repository** :
```bash
/mcp github create_repository \
  --name "catalogue-mcp" \
  --description "🚀 Universal MCP Server Catalogue - Discover, connect, and manage Model Context Protocol servers" \
  --private false \
  --topics "mcp,model-context-protocol,ai,llm,catalogue,serverless"
```

2. **Push Code Initial** :
```bash
# Via GitHub MCP
/mcp github create_commit --message "feat: Initial Catalogue MCP implementation with E6 testing"

# Via git traditionnel (backup)
git remote add origin https://github.com/YOUR_USERNAME/catalogue-mcp.git
git push -u origin main
```

3. **Configuration Repository** :
```bash
# Activer GitHub Pages
/mcp github update_repository_settings --pages_enabled true --pages_source "gh-pages"

# Configurer branch protection
/mcp github create_branch_protection --branch "main" --require_reviews true
```

## 🔄 Integration avec Archon

### Synchronisation Tâches → Issues

```javascript
// Script d'intégration (scripts/sync-archon-github.js)
const archonTasks = await archon.list_tasks()
const criticalTasks = archonTasks.filter(task => 
  task.status === 'todo' && 
  task.description.includes('HIGH') || task.description.includes('CRITICAL')
)

for (const task of criticalTasks) {
  await github.create_issue({
    title: task.title,
    body: `**Archon Task**: ${task.id}\n\n${task.description}`,
    labels: ['archon-sync', task.feature || 'general']
  })
}
```

### Pipeline CI/CD Enhanced

```yaml
# .github/workflows/archon-sync.yml
name: Archon-GitHub Sync
on:
  issues:
    types: [closed]
  pull_request:
    types: [merged]

jobs:
  sync-to-archon:
    runs-on: ubuntu-latest
    steps:
      - name: Update Archon Task Status
        run: |
          # Marquer les tâches Archon comme 'done' quand PR mergée
          archon update_task --task_id "${{ github.event.pull_request.body }}" --status "done"
```

## 📊 Monitoring & Analytics

### Dashboard Repository

```bash
# Statistiques en temps réel
/mcp github get_repository_insights

# Analyse des contributions
/mcp github get_contributor_stats

# Performance CI/CD
/mcp github list_workflow_runs --workflow "ci.yml" --limit 5
```

### Métriques Importantes

- 📈 **Stars/Forks** : Adoption communautaire
- 🐛 **Issues Ouvertes** : Feedback utilisateurs
- ✅ **CI Success Rate** : Qualité code
- 📝 **PR Velocity** : Rythme développement

## 🚨 Sécurité & Bonnes Pratiques

### Protection Token

```bash
# ❌ JAMAIS faire ça :
git add .env.github
echo "GITHUB_TOKEN=..." >> README.md

# ✅ Configuration correcte :
echo ".env.github" >> .gitignore
echo ".github-token" >> .gitignore
```

### Permissions Minimales

- 🔒 **Repository** : Accès aux repos nécessaires uniquement
- ⚡ **Workflows** : Seulement si CI/CD requis
- 👥 **Organization** : Read-only sauf si admin

### Audit & Monitoring

```bash
# Audit des accès token
/mcp github audit_token_usage

# Vérification permissions
/mcp github check_permissions

# Logs d'activité
pnpm run github:logs
```

## 🛟 Troubleshooting

### Problèmes Fréquents

**1. Docker ne démarre pas**
```bash
# Vérifier Docker Desktop
docker info
# Si erreur → Redémarrer Docker Desktop
```

**2. Token invalide**
```bash
# Tester le token
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/user
# Si 401 → Régénérer le token sur GitHub
```

**3. Port 8054 occupé**
```bash
# Trouver le processus
lsof -i :8054
# Changer le port dans .env.github
echo "GITHUB_MCP_PORT=8055" >> .env.github
```

**4. Claude ne trouve pas le MCP**
```bash
# Vérifier la configuration Claude
claude mcp list
# Supprimer et ré-ajouter
claude mcp remove github
# Puis ré-exécuter github:setup
```

### Logs & Debugging

```bash
# Logs serveur MCP
pnpm run github:logs

# Logs Claude MCP
tail -f ~/.claude/mcp.log

# Test connectivité
curl http://localhost:8054/health
```

## 🚀 Commandes Utiles

```bash
# Setup & Management
pnpm run github:setup      # Installation complète
pnpm run github:status     # Statut serveur
pnpm run github:logs       # Voir les logs
pnpm run github:stop       # Arrêter le serveur

# Development Workflow
pnpm run ci:validate && \
pnpm run github:setup && \
echo "✅ Ready for GitHub publication!"

# Sync avec Archon
node scripts/sync-archon-github.js
```

## 📚 Ressources

- **Documentation GitHub MCP** : https://github.com/github/github-mcp-server
- **API GitHub** : https://docs.github.com/en/rest
- **MCP Protocol** : https://modelcontextprotocol.io
- **Archon Integration** : http://localhost:3737

---

**🎯 Résultat Final** : Repository GitHub publié avec CI/CD, synchronisation Archon, et workflows automatisés ! 🚀✨