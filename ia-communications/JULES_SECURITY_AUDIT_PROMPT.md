# 🔒 JULES SECURITY AUDIT - PROMPT STRUCTURÉ

## 🎯 **MISSION JULES AI**

**OBJECTIF :** Audit sécurité complet du Catalogue MCP pendant que Claude implémente E6 Advanced Testing.

**CONTEXT PROJET :**
- **Nom** : Catalogue MCP - Universal Server Catalog
- **Stack** : Next.js 15 + React 19 + TypeScript + Supabase + MCP Protocol
- **Phase** : E6 Production Security Hardening
- **Codebase** : 35+ TypeScript files, 7 test files, ESLint anti-friction system

**INNOVATION UNIQUE :** Premier catalogue universel serveurs MCP avec health monitoring temps réel et intégration Claude Code.

---

## 🔍 **SCOPE AUDIT SÉCURITÉ**

### **1. OWASP Top 10 Analysis (Priority 1)**

**A01 - Broken Access Control**
```
Analyse:
- API routes authentication (/api/mcps, /api/health, /api/search)
- Authorization checks pour admin functions
- User role management via Supabase Auth
- Resource access validation

Focus Files:
- src/app/api/**/route.ts (10+ API endpoints)
- src/lib/auth/ (si existant)
- middleware.ts (Next.js middleware)
```

**A02 - Cryptographic Failures**  
```
Analyse:
- MCP connection strings storage/transmission
- Supabase API keys management
- Environment variables security
- Database connection encryption

Focus Files:
- .env files structure
- src/lib/mcp/connection.ts
- Database configuration
```

**A03 - Injection Vulnerabilities**
```
Analyse:
- SQL injection via Supabase queries
- Command injection dans MCP server connections
- NoSQL injection risques
- Input validation sanitization

Focus Files:
- src/lib/mcp/ (MCP connections)
- API routes avec user input
- Search functionality
```

**A08 - Software and Data Integrity**
```
Analyse:
- MCP servers trust validation
- Third-party dependencies security
- Package.json dependencies audit
- Supply chain attack vectors

Focus Files:
- package.json + package-lock.json
- src/lib/mcp/discovery.ts (auto-discovery risks)
```

### **2. MCP Protocol Security (Unique)**

**MCP Connection Security**
```
Analyse:
- Connection string validation
- Server certificate verification
- Man-in-the-middle attack prevention
- Untrusted MCP server handling

Focus Files:
- src/lib/mcp/connection.ts
- src/lib/mcp/discovery.ts
- src/lib/mcp/health-monitor.ts
```

**Health Monitoring Security**
```
Analyse:
- DoS attacks via health check spam
- Resource exhaustion server discovery
- Rate limiting implementation
- Concurrent connections limits

Focus Files:
- src/lib/mcp/health-monitor.ts
- API routes rate limiting
```

### **3. Next.js Specific Vulnerabilities**

**API Routes Security**
```
Analyse:
- Input validation sur tous endpoints
- Error information leakage
- Request size limits
- CORS configuration

Focus Files:
- src/app/api/**/*.ts (tous les routes)
- next.config.js
- middleware.ts
```

**Client-Side Security**
```
Analyse:
- XSS prevention dans UI components
- Client-side data exposure
- CSP headers implementation
- Sensitive data dans browser

Focus Files:
- src/components/**/*.tsx
- src/app/**/*.tsx (pages)
```

**Server-Side Rendering Risks**
```
Analyse:
- SSR data injection
- Hydration security issues
- Server-side code exposure
- Environment leakage client-side

Focus Files:
- src/app/**/page.tsx
- Layout components
```

### **4. TypeScript Security Implications**

**Type Safety Gaps**
```
Analyse:
- Runtime validation missing
- Any types security risks
- External API response validation
- User input type coercion

Focus Files:
- src/types/*.ts
- src/utils/type-guards.ts
- API integration points
```

---

## 📊 **OUTPUT REQUIREMENTS**

### **Format Rapport Sécurité**
```json
{
  "audit_summary": {
    "total_issues": 0,
    "critical": 0,
    "high": 0, 
    "medium": 0,
    "low": 0,
    "info": 0
  },
  "executive_summary": "Brief overview for stakeholders",
  "vulnerabilities": [
    {
      "id": "CATA-001",
      "title": "Vulnerability Title",
      "severity": "HIGH|MEDIUM|LOW",
      "category": "OWASP Category",
      "description": "Detailed vulnerability description",
      "location": {
        "file": "src/path/to/file.ts",
        "line_range": "45-52",
        "function": "functionName"
      },
      "impact": "Security impact description",
      "likelihood": "HIGH|MEDIUM|LOW",
      "remediation": {
        "priority": "IMMEDIATE|SOON|LATER",
        "effort": "LOW|MEDIUM|HIGH",
        "steps": ["Step 1", "Step 2", "Step 3"],
        "code_example": "// Secure code example"
      }
    }
  ],
  "security_recommendations": [
    {
      "category": "Architecture",
      "priority": "HIGH",
      "recommendation": "Detailed recommendation",
      "rationale": "Why this is important"
    }
  ],
  "mcp_specific_security": [
    {
      "area": "Connection Management",
      "issues": ["List of MCP-specific issues"],
      "recommendations": ["List of solutions"]
    }
  ]
}
```

### **Deliverables Attendus**

**1. Executive Security Report (Markdown)**
- Executive summary pour stakeholders business
- Risk assessment et impact analysis
- Prioritized action plan avec timeline
- Compliance status (OWASP, industry standards)

**2. Technical Vulnerability Report (JSON + Markdown)**
- Detailed technical findings
- Code-level vulnerability analysis
- Specific remediation steps avec code examples
- Testing procedures pour validate fixes

**3. MCP Security Best Practices Guide**
- Security patterns pour MCP integration
- Connection security recommendations  
- Health monitoring security considerations
- Auto-discovery security risks mitigation

**4. CI/CD Security Integration Recommendations**
- Automated security testing integration
- Pre-commit security hooks suggestions
- Continuous monitoring setup
- Security metrics tracking

---

## ⚡ **PRIORITÉS ANALYSE**

### **Immediate Priority (Critical)**
1. **API Authentication/Authorization** - Public endpoints exposure
2. **MCP Connection Security** - Untrusted server connections
3. **Input Validation** - User input dans search/filters
4. **Environment Security** - API keys et secrets management

### **High Priority** 
1. **Rate Limiting** - DoS protection health monitoring
2. **Error Handling** - Information leakage prevention
3. **CORS Configuration** - Cross-origin security
4. **Database Security** - Supabase configuration review

### **Medium Priority**
1. **Dependency Audit** - Third-party package vulnerabilities
2. **TypeScript Security** - Type safety security implications
3. **Client-Side Security** - XSS et data exposure
4. **Logging Security** - Sensitive information dans logs

---

## 🤝 **COLLABORATION WORKFLOW**

### **Timeline Coordination**
- **Jules Start** : Immédiatement (parallèle à Claude E6)
- **Progress Check** : Après 2h (status update)
- **Preliminary Report** : 4h (initial findings)
- **Final Report** : 6-8h (comprehensive audit)

### **Communication Format**
- **Status Updates** : Brief progress messages
- **Findings Alerts** : Critical vulnerabilities immédiate notification
- **Final Delivery** : Complete structured report package

### **Integration avec Claude E6**
- **Parallel Execution** : Jules security pendant Claude testing
- **Findings Integration** : Security fixes dans E6 implementation
- **Final Validation** : Combined testing + security validation

---

**🎯 ACTION JULES :** Démarre audit sécurité complet selon ce scope. Focus priorité CRITICAL/HIGH issues. Rapport structuré JSON + Markdown pour intégration immediate dans E6 phase.

**🔗 Codebase Location :** `/Users/manu/Documents/DEV/catalogue-mcp2/`

**⚠️ URGENT :** Notify immédiatement si vulnerabilités CRITICAL découvertes.