# RULES DIGEST - ESLint Anti-Friction

## Règles Clés pour Développement AI-Friendly

### Variables Temporaires
```typescript
// ✅ Préfixer avec _ pour variables temporaires
const _tempData = processData();
const _unused = getValue();
const handleClick = (_event: MouseEvent) => { /* logic */ };
```

### Imports TypeScript
```typescript
// ✅ Utiliser inline type imports (auto-fix disponible)
import { type User, createUser } from './user';
import { type Config } from './config';
```

### Overrides Spécialisés

**Tests** : `**/*.test.*`, `**/*.spec.*`, `**/__tests__/**`
- `@typescript-eslint/no-explicit-any: off`
- `@typescript-eslint/no-unused-vars: off`

**API Routes** : `src/app/api/**/route.ts`, `scripts/**`
- `no-console: off`

### Auto-Fix Disponible
- Import ordering (alphabétique + newlines)
- Type imports inline
- Unused variables (préfixer _)

### Commandes Rapides
```bash
pnpm run lint        # Check only
pnpm run lint:fix    # Auto-fix
pnpm run prepush     # Pre-commit validation
```

### Philosophy
- WARN instead of ERROR when possible
- Smart patterns recognition
- Context-aware rules
- AI-développement optimisé