# 🧪 TESTS - CATALOGUE MCP

## Phase E4 - Tests First Methodology

Cette architecture de tests suit les principes **E4-Tests First** d'Archon avec focus sur les **tests d'intégration avec de vrais MCP servers**.

## Structure des Tests

```
tests/
├── integration/           # Tests avec vrais MCP servers (PRIORITÉ)
│   ├── mcp-servers/      # Tests connexions MCP réels
│   ├── health-checks/    # Tests monitoring santé
│   └── discovery/        # Tests découverte automatique
├── unit/                 # Tests unitaires isolés
│   ├── type-guards/      # Validation type guards
│   ├── utils/           # Fonctions utilitaires
│   └── validation/      # Schémas Zod
├── e2e/                 # Tests bout-en-bout Playwright
│   ├── search-workflow/ # Parcours utilisateur complet
│   ├── server-detail/   # Pages détails serveurs
│   └── reviews/         # Système avis/notes
├── fixtures/            # Données de test
│   ├── mcp-servers.json # Serveurs MCP exemples
│   └── health-data.json # Données monitoring
└── mocks/              # Mocks pour tests isolés
```

## Philosophie Tests First

### 1. **Integration Tests First** 🎯
- Connecter aux vrais MCP servers disponibles
- Tester protocoles MCP réels
- Valider health checks authentiques
- Pas de mocks sauf si impossible

### 2. **Real World Data** 🌍
- Utiliser Context7, Serena, Archon comme tests
- Cataloguer serveurs MCP existants
- Valider avec données production

### 3. **Anti-Regression** 🛡️
- Tests découverte automatique nouveaux servers
- Validation breaking changes protocole MCP
- Monitoring continue santé catalogue

## Configuration Tests

- **Jest**: Framework tests unitaires/intégration
- **Testing Library**: Tests React composants
- **Playwright**: Tests E2E navigateur
- **MSW**: Mocks API quand nécessaire

## Commandes Tests

```bash
# Tous les tests
pnpm test

# Tests intégration uniquement (MCP réels)
pnpm test:integration

# Tests unitaires rapides
pnpm test:unit

# Tests E2E complets
pnpm test:e2e

# Watch mode développement
pnpm test:watch
```

## Métriques Succès

- ✅ Connexion 5+ MCP servers réels
- ✅ Health checks automatiques
- ✅ Découverte nouveaux servers
- ✅ Coverage >90% code critique
- ✅ E2E workflow complet utilisateur