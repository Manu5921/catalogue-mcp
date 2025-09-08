# ADR-002: Next.js 15 + React 19 + TypeScript Stack Choice

## Status
**ACCEPTED** - Implemented in E2-E4 phases

## Context
Le Catalogue MCP nécessite une stack frontend moderne pour :
- Server-side rendering pour SEO et performance
- API routes intégrées pour backend logic
- Real-time updates pour health monitoring  
- Type safety pour développement IA sans friction
- Claude Code integration native

Options évaluées :
1. **Next.js + React + TypeScript** 
2. **Vite + React + TypeScript**
3. **Remix + React + TypeScript**  
4. **SvelteKit + TypeScript**
5. **Nuxt.js + Vue + TypeScript**

## Decision
**Choix : Next.js 15 + React 19 + TypeScript strict**

### Rationale
- **Full-Stack Capability** : API routes évitent backend séparé
- **SSR/SSG** : SEO optimal pour catalogue public
- **Performance** : App Router avec streaming et suspense
- **TypeScript Integration** : Support natif excellent
- **Deployment** : Vercel integration seamless
- **Ecosystem** : Rich component libraries (Radix UI)
- **AI Development** : Excellent DX pour développement IA

## Implementation Details

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (backend)
│   ├── catalogue/         # Pages
│   └── server/[id]/       # Dynamic routes
├── components/            # React components
│   ├── ui/               # Base components (shadcn)
│   ├── catalogue/        # Feature components
│   └── health/           # Monitoring components
├── lib/                  # Core logic
│   └── mcp/             # MCP integration
└── types/               # TypeScript definitions
```

### TypeScript Configuration
```json
// tsconfig.json - Strict mode pour anti-hallucination IA
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

### Key Dependencies
```json
{
  "next": "15.0.3",
  "react": "19.0.0", 
  "typescript": "^5.6.3",
  "@radix-ui/react-*": "^1.x", // UI components
  "@supabase/supabase-js": "^2.45.4", // Database
  "@tanstack/react-query": "^5.59.16" // Data fetching
}
```

## Architecture Decisions

### App Router vs Pages Router
**Chosen: App Router (Next.js 13+)**
- Modern React patterns (Server Components)
- Better performance avec streaming
- Improved developer experience
- Future-proof architecture

### State Management
**Chosen: React Query + React State**
- Server state : TanStack Query pour caching/sync
- Client state : Built-in React hooks
- No Redux overhead pour use case catalogue

### Styling Strategy  
**Chosen: Tailwind CSS + shadcn/ui**
- Utility-first CSS pour rapidité développement
- shadcn/ui pour composants consistent
- Dark mode support natif

### API Layer
**Chosen: Next.js API Routes + Supabase**
- Colocation frontend/backend code
- TypeScript end-to-end
- Supabase pour PostgreSQL + Auth + Real-time

## Consequences

### Positive
- **Developer Experience** : Hot reload, TypeScript integration excellent
- **Performance** : SSR/SSG + App Router optimizations  
- **SEO** : Server-side rendering pour catalogue public
- **Deployment** : Zero-config Vercel deployment
- **Type Safety** : End-to-end TypeScript reduces bugs
- **Ecosystem** : Rich React/Next.js ecosystem

### Negative
- **Bundle Size** : React overhead vs lighter frameworks
- **Complexity** : App Router learning curve
- **Hydration** : SSR hydration issues possibles

### Neutral
- **Vendor Lock-in** : Some Vercel-specific optimizations
- **Learning Curve** : Next.js 13+ App Router nouveautés

## Implementation Status

### ✅ Completed (E2-E4)
- Next.js 15 setup avec App Router
- TypeScript strict configuration
- API routes pour MCP integration (/api/mcps, /api/health, /api/search)
- React components avec Radix UI base
- Tailwind CSS styling system
- ESLint + Prettier configuration

### 🎯 Next Steps (E6+)  
- Performance optimizations (bundle analysis)
- Progressive Web App features
- Advanced caching strategies
- Error boundaries et error handling
- Accessibility improvements (WCAG compliance)

## Performance Targets Met
- **Build Time** : <30s ✅
- **Page Load** : <2s pour catalogue pages
- **First Contentful Paint** : <1.5s
- **Bundle Size** : Optimized avec tree-shaking

## Alternatives Considered

### Vite + React
- **Rejected** : Pas de SSR natif, plus de setup required
- **Build speed** : Faster dev mais Next.js acceptable

### Remix  
- **Rejected** : Moins mature ecosystem, plus complex deployment
- **Architecture** : Interesting mais Next.js plus stable

### SvelteKit
- **Rejected** : Smaller bundle mais moins de resources/ecosystem
- **Learning curve** : Team plus familier avec React

## References
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Features](https://react.dev/blog/2024/04/25/react-19)
- [TypeScript Strict Mode Guide](https://www.typescriptlang.org/tsconfig#strict)

---
**Decision Date:** 2025-09-08  
**Review Date:** 2026-03-08 (6 months)  
**Last Updated:** 2025-09-08