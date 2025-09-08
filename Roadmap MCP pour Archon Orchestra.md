# 🎯 Objectif
Concevoir et déployer un **catalogue d’outils MCP** avec **découverte active (MCP‑Zero)**, branché à Archon (projets/RAG), Orchestra (orchestrateur 7 phases) et agents (Gemini/Claude), afin de réduire le contexte (−90/98 % tokens), d’améliorer la précision, et de rendre les toolchains dynamiques.

---

## 🧱 Architecture cible (vue d’ensemble)
1) **Catalogue MCP (Registry privé)**
   - DB : Supabase/Postgres (ou Qdrant + Postgres) pour stocker serveurs/tools, états santé, capacités, versions.
   - Seed initial : imports depuis listes publiques + serveurs internes (Archon façade, FS, HTTP, Gemini bridge…).
2) **Gateway MCP (optionnel mais recommandé)**
   - Unifier plusieurs serveurs sous un **endpoint unique** (reverse‑proxy SSE/HTTP/WS). Peut aussi adapter REST→MCP pour outils internes.
3) **Routeur sémantique hiérarchique (MCP‑Zero)**
   - Étape A : rank **serveurs** vs la demande (bloc `<tool_assistant>`).
   - Étape B : rank **tools** à l’intérieur des serveurs retenus.
   - **Score** : `(Sserver × Stool) × max(Sserver, Stool)` → retourne top‑k (1–3).
   - N’injecte **que** les JSON schemas des tools top‑k.
4) **Middleware Orchestra**
   - Intercepte les sorties agents → détecte `<tool_assistant>` → appelle routeur → **injection ponctuelle** → exécution tool.
   - **Gating capacités** : si `ragQuery=false` (base vide), skip silencieux des étapes RAG.
5) **Sécurité & gouvernance**
   - RBAC simple (projet/agent), vault secrets, audit log par appel tool, allow‑list/deny‑list.
6) **Observabilité & évaluation**
   - Logs corrélés (CID), métriques par phase/tool (latence, hit‑rate top‑k, tokens), jeu d’oracles + évaluateur offline.

---

## 🗂️ Schéma de données (catalogue)
**Tables (Postgres)**
- `mcp_servers(server_id PK, summary, description, version, url, transport, tags[]::text, owner, visibility, last_health_at, health_state)`
- `mcp_tools(tool_id PK, server_id FK, name, summary, input_schema_json, output_schema_json, tags[]::text, version, slo_p95_ms, err_rate)`
- `mcp_capabilities(server_id FK, ragQuery bool, write bool, auth_modes text[], limits jsonb)`
- `mcp_health(server_id FK, checked_at, ok bool, latency_ms, details jsonb)`
- `mcp_audit(ts, project_id, agent, server_id, tool_name, ok bool, latency_ms, tokens_in, tokens_out, error text)`

**Vector store**
- `servers_embeddings(server_id, embedding vector)`
- `tools_embeddings(tool_id, embedding vector)`

---

## 🔌 API du catalogue & gateway (extraits)
- `GET /catalog/servers?tag=…` → liste + santé/capacités
- `GET /catalog/servers/:id/tools` → tools + schemas résumés
- `POST /catalog/discover` → body `{ server?: string, tool: string, k?: number }` → retourne top‑k (serveur+tool+schemas)
- `POST /gateway/exec` → `{ server_id, tool_name, args }` → proxy SSE/NDJSON vers le serveur MCP concerné

---

## 🧠 Routeur sémantique (algorithme)
1) **Pré‑filtrage**: tags, visibilité, RBAC, capacités (ex: `ragQuery=true`).
2) **Rank serveurs**: cosine(query → desc/summary serveur + tags).
3) **Rank tools** (dans les N meilleurs serveurs): cosine(query → desc tool + tags).
4) **Score final**: `(Sserver × Stool) × max(Sserver, Stool)` → **top‑k (k=1..3)**.
5) **Injection**: extraire JSON schemas des tools retenus → injecter **uniquement** ceux‑ci au prochain tour agent.
6) **Apprentissage**: journaliser `(requête → candidats → outil exécuté → succès/échec)` et appliquer un **bandit** (Thompson/ε‑greedy) pour biaiser le ranking sur projets/domaines.

---

## 🧵 Middleware Orchestra (hook MCP‑Zero)
- **Détection**: parse sortie agent pour bloc `<tool_assistant>`.
- **Découverte**: `POST /catalog/discover` → reçoit top‑k (serveur+tool+schemas).
- **Injection**: ajoute les schemas dans le **contexte** du prochain appel agent.
- **Exécution**: appelle `gateway/exec` (ou directement le serveur MCP si connu).
- **Politique d’erreurs**: retry **5xx/network only**, `retry:false` sinon, avec backoff+jitter. Idempotence via `external_id`.

---

## 🔐 Sécurité & gouvernance
- **RBAC**: règles par projet/agent → filtres côté routeur.
- **Secrets**: vault (env scoping), jamais dans les prompts.
- **Audit**: trace E2E avec CID, horodatage, inputs signifiants tronqués.
- **Policies**: allow‑list par phase (ex: Phase 1: read‑only FS ; Phase 2: Archon write).

---

## 📈 Observabilité & évaluation
**KPI**
- Hit‑rate **top‑1 ≥ 85 %**, **top‑3 ≥ 95 %** sur set oracle.
- Réduction tokens **≥ 90 %** (cible **95–98 %**).
- P95 latence discovery→exec **< 2 s**.
- Taux d’échec outils **< 3 %** (hors réseau/quotas).

**Évaluateur offline**
- 50–100 tâches oracles (FS, Archon, HTTP, RAG…).
- Rapports comparant *full‑inject* vs *MCP‑Zero*.

---

## 🛠️ Stack & composants
- **DB** : Supabase/Postgres (+ PGVector) **ou** Qdrant (+ Postgres pour métadonnées).
- **Embeddings** : `text-embedding-3-small` (ou SBERT local si offline).
- **Gateway** : OSS (ex: Unla / Docker MCP Gateway) **ou** implémentation maison minimaliste.
- **Server** : Node.js ESM (Pino logs, OpenTelemetry en option), Fastify/Express.
- **Agents** : Gemini CLI bridge existant, façade Archon MCP, Claude Code.

---

## 📅 Roadmap détaillée (12 semaines max)
### Semaine 1 – 2 : Catalogue MVP & Seed
- **Modèle** : créer tables `mcp_servers`, `mcp_tools`, `mcp_capabilities`.
- **Ingestion** : importer 200–500 serveurs (publics + internes). Normaliser `summary/description/tags`.
- **Health** : job cron (HTTP/`--version`) → `mcp_health`, mise à jour `capabilities` (ex: `ragQuery`).
- **API** : `GET /catalog/*` (lecture seule), auth simple (clé projet).
- **DOD** : 3 serveurs internes (Archon, FS, Gemini) listés & sains.

### Semaine 3 : Embeddings & Discovery API
- **Embeddings** : calcul pour serveurs & tools (batch + upsert).
- **API** : `POST /catalog/discover` (pré‑filtrage RBAC + ranking 2‑étages + score composite).
- **Cache** : LRU (clé = hash requête + scope projet).
- **DOD** : top‑k stable sur 10 requêtes de test.

### Semaine 4 : Gateway & Exec
- **Gateway** : proxy SSE/NDJSON vers serveurs MCP (auth, timeouts, logs CID).
- **Exec** : `POST /gateway/exec` + mapping server_id → transport (http/ws/stdio).
- **DOD** : exécution de 3 tools hétérogènes en E2E (FS.read, Archon.manageTask, Gemini.ask).

### Semaine 5 : Middleware Orchestra (hook MCP‑Zero)
- **Parsing** : détection `<tool_assistant>` dans sorties agents.
- **Injection** : ajout des schemas top‑k à l’appel suivant (Claude/Gemini).
- **Gating** : `ragQuery=false` ⇒ skip RAG.
- **DOD** : 2 phases du workflow consomment le hook sans échec.

### Semaine 6 : Sécurité v1 & Audit
- **RBAC** : allow‑list par projet/agent/phase.
- **Secrets** : scoping par serveur (env/secret store), jamais injectés au LLM.
- **Audit** : table `mcp_audit` + export JSONL.
- **DOD** : revocation d’un tool reflétée en < 60 s.

### Semaine 7 – 8 : Évaluation & Bandit
- **Oracles** : 50–100 tâches; runner offline; métriques (hit‑rate, tokens, P95).
- **Bandit** : biaisage probabiliste par projet/domaine.
- **DOD** : top‑1 ≥ 85 %, tokens −90 % vs full‑inject.

### Semaine 9 – 10 : UI Console & Ops
- **UI** : liste serveurs/tools, santé, capacités, filtres RBAC, recherche.
- **Ops** : dashboards (latence, erreurs, retries), alertes basiques.
- **DOD** : admin peut activer/désactiver un serveur et voir l’impact.

### Semaine 11 – 12 : Hardening & Beta
- **Résilience** : circuit‑breakers, backpressure, limites de taux.
- **Docs** : guides “brancher Claude/Gemini/Archon”, playbooks.
- **Beta** : pilote sur 2–3 projets internes; triage bug‑bash.
- **Go/No‑Go** : KPIs atteints (hit‑rate, tokens, P95, err %).

---

## ⏱️ Estimation d’effort (MVP utile ≈ 3–5 semaines)
- Catalogue + health + API lecture : 1–1.5 sem.
- Embeddings + discovery + score + cache : 1 sem.
- Gateway + exec E2E : 0.5–1 sem.
- Middleware Orchestra + gating : 0.5 sem.
- RBAC+Audit v1 : 0.5–1 sem.

---

## ⚠️ Risques & parades
- **Drift de schémas tools** : versionner inputs/outputs; déprécations gérées.
- **Coût embeddings** : batch + cache + modèles locaux si besoin.
- **Bruit vectoriel** : pré‑filtrage symbolique (tags, ownership) avant cosine.
- **Sécurité** : deny‑list stricte (ex : write‑ops) par défaut; secrets hors prompts.
- **Latence** : cache LRU, prefetch des schemas récurrents.

---

## ✅ Definition of Done (DOD) globale
- Hook MCP‑Zero actif dans Orchestra (détection → discovery → injection → exec).
- KPIs atteints : **top‑3 ≥ 95 %**, **tokens −90 %** min, **P95<2 s**.
- RBAC+Audit opérationnels; logs corrélés bout‑à‑bout (CID).
- Docs & smoke tests fournis; packaging Docker Compose.

---

## 🧩 Backlog « nice‑to‑have »
- SSO (OAuth/OIDC), UI policies, multi‑tenant.
- Explainability du routeur (pourquoi tel tool).
- Apprentissage actif avec feedback utilisateur (thumbs up/down).
- Export catalogue public/privé (fédération de registries).



---

## 🔗 Open‑source accélérateurs (mapping aux jalons)
### S1–S2 · Catalogue MVP & Seed
- **Registry de référence** (seed initial, format des entrées) : `modelcontextprotocol/registry`.
- **Collections d’exemples** (pour enrichir descriptions/summaries) : `modelcontextprotocol/servers`, `mcpservers.org` (sections *Servers* & *Remote Servers*).

### S3 · Embeddings & Discovery API
- **Embeddings** : utilise ton provider actuel ou SBERT local; pas de repo imposé.
- **Échantillons de descriptions tools** : réutilise les *readme* des serveurs listés ci‑dessus pour générer les texts à embedder.

### S4 · Gateway & Exec
- **Gateway prêt‑à‑l’emploi (HTTP/WS, reverse proxy MCP)** : 
  - Option A : `AmoyLab/Unla` (Go, léger, REST→MCP possible par config).
  - Option B : `microsoft/mcp-gateway` (Kubernetes‑ready, gestion de sessions).

### S5 · Middleware Orchestra (hook MCP‑Zero)
- **Clients/bridges Gemini** (pour tests E2E réels) :
  - `centminmod/gemini-cli-mcp-server` (riche en tools, OpenRouter en option).
  - `aliargun/mcp-server-gemini` (TypeScript, Gemini 2.5, vision/embeddings).
  - `jamubc/gemini-mcp-tool` (CLI Gemini orienté analyse codebase).
  - `eLyiN/gemini-bridge` (multi‑client MCP, léger).
  - Alternative Python minimale : `RaiAnsar/claude_code-gemini-mcp`.

### S6 · Sécurité & Audit
- **Gateway** : s’appuyer sur les capacités RBAC/limits de la gateway sélectionnée (Unla/Microsoft) + audit maison (table `mcp_audit`).

### S7–S8 · Évaluation & Bandit
- **Jeux d’oracles** : dériver des tâches des serveurs *GitHub/FS/HTTP/Archon* importés.
- **Bench** : comparer *full‑inject* vs *MCP‑Zero* (tokens/latence/hit‑rate).

### S9–S10 · UI & Ops
- **UI** : starters web (Next/Tailwind) ; pour les données, réutilise les endpoints du **catalogue** et de la **gateway**.

### S11–S12 · Hardening & Beta
- **Circuit‑breakers & backpressure** : mettre en place au niveau gateway + middleware Orchestra.
- **Docs d’intégration** : générer des snippets `claude_desktop_config.json`/CLI pour brancher le *Unified MCP* (gateway) + Archon façade.

---

## 📦 Choix par défaut (recommandés pour démarrer vite)
- **Registry seed** : `modelcontextprotocol/registry` + `mcpservers.org`.
- **Gateway** : `AmoyLab/Unla` en dev; `microsoft/mcp-gateway` si K8s/prod.
- **Gemini bridge** : `centminmod/gemini-cli-mcp-server` (riche) ou `aliargun/mcp-server-gemini` (TS moderne).

