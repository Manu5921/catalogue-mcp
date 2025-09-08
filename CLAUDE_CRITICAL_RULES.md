# 🚨 RÈGLES CRITIQUES - CLAUDE DOIT SUIVRE ABSOLUMENT

## ⚡ AVANT TOUTE ACTION TECHNIQUE - 5 RÈGLES OBLIGATOIRES

### **1. 🔄 PROCESS-FIRST Protocol**
- ✅ **VÉRIFIER** : Existe-t-il `/mcp archon [commande]` pour cette tâche ?
- ✅ **CONSULTER** : Section CLAUDE.md pertinente pour ce workflow  
- ✅ **COMMUNIQUER** : Mentionner explicitement le processus suivi
- ❌ **INTERDIT** : Improviser sans demander "Dois-je improviser ?"

### **2. 📚 CONTEXT7 MCP - UTILISATION AUTOMATIQUE**
- ✅ **WORKFLOW OBLIGATOIRE** : `/mcp context7 resolve-library-id` → `get-library-docs` → code généré
- ✅ **S'APPLIQUE À** : Next.js, Supabase, TypeScript, Stripe, toute library externe
- ✅ **AVANT** : Setup auth, config TypeScript, patterns architecture, résolution bugs

### **3. 🔧 SERENA MCP - OUTILS CODE PRÉFÉRÉS**
- ✅ **UTILISER** : `/mcp serena` pour opérations sur code (find, replace, structure)
- ✅ **PRÉFÉRER** : Serena aux commandes bash pour analyse de code
- ✅ **USAGE** : Analyse projet, recherche patterns, refactoring, navigation code

### **4. 🛡️ ZERO TRUST PROTOCOL + ESLint ANTI-FRICTION - PREUVES OBLIGATOIRES**
- ❌ **JAMAIS** accepter "c'est fait" sans preuve
- ✅ **PRIORITÉ 1** : `pnpm run lint:fix` → Auto-fix avant toute validation
- ✅ **OBLIGATOIRE** : `pnpm run build` → Build réussi (warnings OK)
- ✅ **OBLIGATOIRE** : `pnpm run test` → Rapport complet avec nombres  
- ✅ **OBLIGATOIRE** : `pnpm run lint` → ZERO ERROR, warnings acceptables

### **5. 📦 PNPM UNIQUEMENT - COHÉRENCE TECHNIQUE**
- ❌ **INTERDIT** : npm (bannement configuré dans projets)
- ✅ **OBLIGATOIRE** : pnpm pour toutes les opérations
- ✅ **SCRIPTS** : build, test, test:integration, lint, dev, etc.

---

## 🚩 RED FLAGS - ARRÊT IMMÉDIAT SI :
- Action technique sans mentionner processus
- Code library sans Context7 docs  
- Bash au lieu de Serena pour code
- "Ça marche" sans logs build/test
- Utilisation npm au lieu pnpm

## ✅ VALIDATION RÉUSSIE = 
- Processus explicitement mentionné ✅
- Preuves objectives fournies ✅  
- Tools appropriés utilisés ✅
- Standards techniques respectés ✅

**⚠️ CES RÈGLES ÉVITENT L'AMNÉSIE INTERSESSIONS ET GARANTISSENT LA COHÉRENCE !**