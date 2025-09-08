/**
 * 🔌 API ROUTE - MCP SERVERS
 * 
 * Endpoints pour la gestion des serveurs MCP
 * GET /api/mcps - Liste des serveurs avec filtres
 * POST /api/mcps - Ajout d'un nouveau serveur (admin)
 */

import { type NextRequest, NextResponse } from 'next/server'

import { mcpDiscoveryService } from '@/lib/mcp/discovery'
import { mcpHealthMonitor } from '@/lib/mcp/health-monitor'
import type { GetMcpsResponse, PaginatedResponse } from '@/types/api'
import type { McpServerSummary } from '@/types/api'

// Cache pour les résultats de découverte
let discoveryCache: {
  servers: McpServerSummary[]
  lastUpdated: string
  ttl: number
} | null = null

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * GET /api/mcps - Récupère la liste des serveurs MCP
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    
    // Paramètres de pagination
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    
    // Paramètres de filtrage
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const verified = searchParams.get('verified') === 'true'
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined

    console.log(`📡 GET /api/mcps - page:${page}, limit:${limit}, category:${category}`)

    // Vérifier le cache
    if (discoveryCache && 
        Date.now() - new Date(discoveryCache.lastUpdated).getTime() < discoveryCache.ttl) {
      console.log('💾 Using cached MCP servers')
    } else {
      // Découverte des serveurs MCP
      console.log('🔍 Discovering MCP servers...')
      const discoveryResult = await mcpDiscoveryService.discoverServers({
        timeout: 5000,
        concurrent: 3,
      })

      // Conversion en format API
      const servers: McpServerSummary[] = discoveryResult.discovered.map(server => ({
        id: server.serverInfo.id,
        name: server.serverInfo.name,
        description: `MCP Server: ${server.serverInfo.name}`,
        version: server.serverInfo.version,
        author: 'Auto-discovered',
        category: {
          id: server.category,
          name: server.category.charAt(0).toUpperCase() + server.category.slice(1),
          icon: getCategoryIcon(server.category),
        },
        tags: [server.category, 'auto-discovered'],
        healthStatus: 'healthy',
        averageRating: 0,
        reviewCount: 0,
        isVerified: false,
        lastUpdated: server.discoveredAt,
      }))

      // Ajouter des serveurs mock pour démo si aucun serveur réel découvert
      if (servers.length === 0) {
        servers.push(...getMockServers())
      }

      // Mise à jour du cache
      discoveryCache = {
        servers,
        lastUpdated: new Date().toISOString(),
        ttl: CACHE_TTL,
      }

      console.log(`✅ Discovered ${servers.length} MCP servers`)
    }

    let filteredServers = [...discoveryCache.servers]

    // Filtrage
    if (category) {
      filteredServers = filteredServers.filter(server => 
        server.category.id === category
      )
    }

    if (status) {
      filteredServers = filteredServers.filter(server => 
        server.healthStatus === status
      )
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredServers = filteredServers.filter(server =>
        server.name.toLowerCase().includes(searchLower) ||
        server.description.toLowerCase().includes(searchLower) ||
        server.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    if (verified !== undefined) {
      filteredServers = filteredServers.filter(server => 
        server.isVerified === verified
      )
    }

    if (minRating !== undefined) {
      filteredServers = filteredServers.filter(server =>
        server.averageRating >= minRating
      )
    }

    // Tri
    filteredServers.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'rating':
          comparison = a.averageRating - b.averageRating
          break
        case 'updated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
          break
        case 'popularity':
          comparison = a.reviewCount - b.reviewCount
          break
        default:
          comparison = a.name.localeCompare(b.name)
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })

    // Pagination
    const total = filteredServers.length
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedServers = filteredServers.slice(startIndex, endIndex)

    // Construction de la réponse
    const response: GetMcpsResponse = {
      success: true,
      data: paginatedServers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
      timestamp: new Date().toISOString(),
      facets: {
        categories: calculateCategoryFacets(discoveryCache.servers),
        statuses: calculateStatusFacets(discoveryCache.servers),
        tags: calculateTagFacets(discoveryCache.servers),
      },
    }

    console.log(`📊 Returning ${paginatedServers.length}/${total} servers`)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5min cache
      },
    })

  } catch (error) {
    console.error('❌ GET /api/mcps error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch MCP servers',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

/**
 * POST /api/mcps - Ajout d'un nouveau serveur (future implémentation admin)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Future: authentification admin requise
    // const body = await request.json()
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Manual server addition not implemented yet',
      },
      timestamp: new Date().toISOString(),
    }, { status: 501 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR', 
        message: 'Server creation failed',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

/**
 * Serveurs mock pour démo
 */
function getMockServers(): McpServerSummary[] {
  return [
    {
      id: 'context7-demo',
      name: 'Context7 Documentation Server',
      description: 'Provides up-to-date documentation and code examples for popular libraries',
      version: '1.2.0',
      author: 'Context7 Team',
      category: {
        id: 'documentation',
        name: 'Documentation',
        icon: '📚',
      },
      tags: ['documentation', 'libraries', 'examples'],
      healthStatus: 'healthy',
      averageRating: 4.6,
      reviewCount: 45,
      isVerified: true,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'serena-demo',
      name: 'Serena Code Analysis',
      description: 'Advanced code analysis, symbol manipulation, and project memory management',
      version: '2.1.3', 
      author: 'Serena Team',
      category: {
        id: 'code-analysis',
        name: 'Code Analysis',
        icon: '🛠️',
      },
      tags: ['code-analysis', 'refactoring', 'symbols'],
      healthStatus: 'healthy',
      averageRating: 4.8,
      reviewCount: 67,
      isVerified: true,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'archon-demo',
      name: 'Archon Project Management', 
      description: 'Comprehensive project management, task tracking, and RAG-powered knowledge base',
      version: '3.0.1',
      author: 'Archon Systems',
      category: {
        id: 'project-management',
        name: 'Project Management',
        icon: '📋',
      },
      tags: ['project-management', 'tasks', 'rag'],
      healthStatus: 'healthy',
      averageRating: 4.7,
      reviewCount: 123,
      isVerified: true,
      lastUpdated: new Date().toISOString(),
    },
  ]
}

/**
 * Icône pour catégorie
 */
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'documentation': '📚',
    'code-analysis': '🛠️', 
    'project-management': '📋',
    'filesystem': '📁',
    'database': '🗄️',
    'web': '🌐',
    'ai': '🤖',
    'other': '📦',
  }
  return icons[category] || '📦'
}

/**
 * Calcul des facettes par catégorie
 */
function calculateCategoryFacets(servers: McpServerSummary[]) {
  const categories = new Map<string, number>()
  
  for (const server of servers) {
    const category = server.category.name
    categories.set(category, (categories.get(category) || 0) + 1)
  }

  return Array.from(categories.entries()).map(([name, count]) => ({
    name,
    count,
  })).sort((a, b) => b.count - a.count)
}

/**
 * Calcul des facettes par statut
 */
function calculateStatusFacets(servers: McpServerSummary[]) {
  const statuses = new Map<string, number>()
  
  for (const server of servers) {
    const status = server.healthStatus
    statuses.set(status, (statuses.get(status) || 0) + 1)
  }

  return Array.from(statuses.entries()).map(([status, count]) => ({
    status,
    count,
  })).sort((a, b) => b.count - a.count)
}

/**
 * Calcul des facettes par tag
 */
function calculateTagFacets(servers: McpServerSummary[]) {
  const tags = new Map<string, number>()
  
  for (const server of servers) {
    for (const tag of server.tags) {
      tags.set(tag, (tags.get(tag) || 0) + 1)
    }
  }

  return Array.from(tags.entries()).map(([tag, count]) => ({
    tag,
    count,
  })).sort((a, b) => b.count - a.count).slice(0, 20) // Top 20 tags
}