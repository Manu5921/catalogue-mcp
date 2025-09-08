/**
 * 🔍 API ROUTE - SEARCH
 * 
 * Endpoints pour la recherche de serveurs MCP
 * GET /api/search?q=... - Recherche full-text avec filtres
 * POST /api/search - Recherche avancée avec critères complexes
 */

import { type NextRequest, NextResponse } from 'next/server'

import { mcpDiscoveryService } from '@/lib/mcp/discovery'
import type { SearchMcpsResponse } from '@/types/api'

/**
 * GET /api/search - Recherche simple par query string
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    
    // Paramètres de recherche
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const verified = searchParams.get('verified') === 'true'
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined
    
    // Paramètres de pagination
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50)

    console.log(`🔍 GET /api/search - query: "${query}", category: ${category}`)

    if (!query && !category && tags.length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Search query, category, or tags required',
        },
        timestamp: new Date().toISOString(),
      }, { status: 400 })
    }

    // Effectuer la recherche
    const searchResults = await performSearch({
      query,
      category,
      tags,
      verified,
      minRating,
      page,
      limit,
    })

    console.log(`📊 Search returned ${searchResults.results.length} results`)

    return NextResponse.json(searchResults, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=120, stale-while-revalidate=300', // 2min cache
      },
    })

  } catch (error) {
    console.error('❌ GET /api/search error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Search failed',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

/**
 * POST /api/search - Recherche avancée avec critères complexes
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    
    const {
      query = '',
      filters = {},
      sort = { field: 'relevance', order: 'desc' },
      page = 1,
      limit = 20,
      boost = {},
    } = body

    console.log(`🔍 POST /api/search - advanced search`)
    console.log(`Query: "${query}"`)
    console.log(`Filters:`, filters)

    // Validation
    if (!query && Object.keys(filters).length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Search query or filters required',
        },
        timestamp: new Date().toISOString(),
      }, { status: 400 })
    }

    // Effectuer la recherche avancée
    const searchResults = await performAdvancedSearch({
      query,
      filters,
      sort,
      page: Math.max(1, page),
      limit: Math.min(Math.max(1, limit), 50),
      boost,
    })

    console.log(`📊 Advanced search returned ${searchResults.results.length} results`)

    return NextResponse.json(searchResults, { status: 200 })

  } catch (error) {
    console.error('❌ POST /api/search error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Advanced search failed',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

/**
 * Effectue une recherche simple
 */
async function performSearch(params: {
  query: string
  category?: string | null
  tags: string[]
  verified?: boolean
  minRating?: number
  page: number
  limit: number
}): Promise<SearchMcpsResponse> {
  
  const { query, category, tags, verified, minRating, page, limit } = params

  // Découverte des serveurs disponibles (avec cache)
  const discoveryResult = await mcpDiscoveryService.discoverServers({
    timeout: 3000,
    concurrent: 2,
  })

  // Conversion en format de recherche
  let servers = discoveryResult.discovered.map(server => ({
    id: server.serverInfo.id,
    name: server.serverInfo.name,
    description: `MCP Server: ${server.serverInfo.name}`,
    version: server.serverInfo.version,
    author: 'Auto-discovered',
    category: server.category,
    tags: [server.category, 'auto-discovered'],
    healthStatus: 'healthy' as const,
    averageRating: 0,
    reviewCount: 0,
    isVerified: false,
    lastUpdated: server.discoveredAt,
    responseTime: server.responseTime,
    relevanceScore: 0, // Sera calculé
  }))

  // Ajouter des serveurs mock si nécessaire
  if (servers.length === 0) {
    servers = getMockSearchServers()
  }

  // Filtrage par query (recherche full-text simple)
  if (query) {
    const queryLower = query.toLowerCase()
    servers = servers.filter(server =>
      server.name.toLowerCase().includes(queryLower) ||
      server.description.toLowerCase().includes(queryLower) ||
      server.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
      server.author.toLowerCase().includes(queryLower)
    )
    
    // Calcul du score de pertinence
    servers.forEach(server => {
      let score = 0
      const qLower = queryLower
      
      // Nom exact match = +10, partial = +5
      if (server.name.toLowerCase() === qLower) score += 10
      else if (server.name.toLowerCase().includes(qLower)) score += 5
      
      // Description match = +3
      if (server.description.toLowerCase().includes(qLower)) score += 3
      
      // Tags match = +2 per tag
      server.tags.forEach(tag => {
        if (tag.toLowerCase().includes(qLower)) score += 2
      })
      
      // Author match = +1
      if (server.author.toLowerCase().includes(qLower)) score += 1
      
      server.relevanceScore = score
    })
  }

  // Filtrage par catégorie
  if (category) {
    servers = servers.filter(server => server.category === category)
  }

  // Filtrage par tags
  if (tags.length > 0) {
    servers = servers.filter(server =>
      tags.some(tag => 
        server.tags.some(serverTag => 
          serverTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    )
  }

  // Filtrage par vérification
  if (verified !== undefined) {
    servers = servers.filter(server => server.isVerified === verified)
  }

  // Filtrage par rating minimum
  if (minRating !== undefined) {
    servers = servers.filter(server => server.averageRating >= minRating)
  }

  // Tri par pertinence ou critère demandé
  servers.sort((a, b) => {
    if (query) {
      return b.relevanceScore - a.relevanceScore
    }
    return a.name.localeCompare(b.name)
  })

  // Pagination
  const total = servers.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedServers = servers.slice(startIndex, endIndex)

  // Statistiques de recherche
  const stats = {
    totalFound: total,
    searchTime: Date.now(), // Simplified
    categories: [...new Set(servers.map(s => s.category))],
    avgRelevanceScore: servers.length > 0 
      ? servers.reduce((sum, s) => sum + s.relevanceScore, 0) / servers.length
      : 0,
  }

  return {
    success: true,
    query,
    results: paginatedServers,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    stats,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Recherche avancée (placeholder pour future extension)
 */
async function performAdvancedSearch(params: any): Promise<SearchMcpsResponse> {
  // Pour l'instant, déléguer à la recherche simple
  return performSearch({
    query: params.query,
    category: params.filters.category,
    tags: params.filters.tags || [],
    verified: params.filters.verified,
    minRating: params.filters.minRating,
    page: params.page,
    limit: params.limit,
  })
}

/**
 * Serveurs mock pour la recherche de démo
 */
function getMockSearchServers() {
  return [
    {
      id: 'context7-demo',
      name: 'Context7 Documentation Server',
      description: 'Provides up-to-date documentation and code examples for popular libraries and frameworks',
      version: '1.2.0',
      author: 'Context7 Team',
      category: 'documentation',
      tags: ['documentation', 'libraries', 'examples', 'developer-tools'],
      healthStatus: 'healthy' as const,
      averageRating: 4.6,
      reviewCount: 45,
      isVerified: true,
      lastUpdated: new Date().toISOString(),
      responseTime: 120,
      relevanceScore: 0,
    },
    {
      id: 'serena-demo',
      name: 'Serena Code Analysis Server',
      description: 'Advanced code analysis, symbol manipulation, and project memory management for development workflows',
      version: '2.1.3',
      author: 'Serena Development Team', 
      category: 'dev-tools',
      tags: ['code-analysis', 'refactoring', 'symbols', 'memory'],
      healthStatus: 'healthy' as const,
      averageRating: 4.8,
      reviewCount: 67,
      isVerified: true,
      lastUpdated: new Date().toISOString(),
      responseTime: 95,
      relevanceScore: 0,
    },
    {
      id: 'archon-demo',
      name: 'Archon Project Management Server',
      description: 'Comprehensive project management, task tracking, and RAG-powered knowledge base for development teams',
      version: '3.0.1',
      author: 'Archon Systems',
      category: 'productivity',
      tags: ['project-management', 'tasks', 'rag', 'knowledge-base'],
      healthStatus: 'healthy' as const,
      averageRating: 4.7,
      reviewCount: 123,
      isVerified: true,
      lastUpdated: new Date().toISOString(),
      responseTime: 180,
      relevanceScore: 0,
    },
    {
      id: 'filesystem-basic',
      name: 'Basic Filesystem MCP',
      description: 'Simple filesystem operations with read/write capabilities for file management tasks',
      version: '1.0.5',
      author: 'Open Source Community',
      category: 'filesystem',
      tags: ['filesystem', 'files', 'basic', 'utilities'],
      healthStatus: 'degraded' as const,
      averageRating: 3.9,
      reviewCount: 28,
      isVerified: false,
      lastUpdated: '2024-10-15T09:10:00Z',
      responseTime: 2500,
      relevanceScore: 0,
    },
  ]
}