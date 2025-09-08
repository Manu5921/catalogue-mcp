/**
 * 🔍 API ROUTE - MCP SERVER DETAIL
 * 
 * Endpoints pour un serveur MCP spécifique
 * GET /api/mcps/[id] - Détails d'un serveur
 * PATCH /api/mcps/[id] - Mise à jour serveur (admin)
 * DELETE /api/mcps/[id] - Suppression serveur (admin)
 */

import { type NextRequest, NextResponse } from 'next/server'

import { mcpConnectionManager } from '@/lib/mcp/connection'
import { mcpHealthMonitor } from '@/lib/mcp/health-monitor'
import type { GetMcpResponse, ApiError } from '@/types/api'
import type { McpServerDetail } from '@/types/api'

interface RouteContext {
  params: {
    id: string
  }
}

/**
 * GET /api/mcps/[id] - Détails complets d'un serveur MCP
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = context.params
    console.log(`🔍 GET /api/mcps/${id}`)

    // Récupérer les détails du serveur
    const serverDetail = await getServerDetail(id)
    
    if (!serverDetail) {
      const errorResponse: ApiError = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `MCP server with id "${id}" not found`,
        },
        timestamp: new Date().toISOString(),
      }
      
      return NextResponse.json(errorResponse, { status: 404 })
    }

    const response: GetMcpResponse = {
      success: true,
      data: serverDetail,
      message: `Server details for ${serverDetail.name}`,
      timestamp: new Date().toISOString(),
    }

    console.log(`✅ Retrieved details for ${serverDetail.name}`)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300', // 1min cache
      },
    })

  } catch (error) {
    console.error(`❌ GET /api/mcps/${context.params.id} error:`, error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch server details',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

/**
 * PATCH /api/mcps/[id] - Mise à jour d'un serveur (admin)
 */
export async function PATCH(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // Future: authentification admin requise
    const { id } = context.params
    // const body = await _request.json()
    
    console.log(`🔧 PATCH /api/mcps/${id} (not implemented)`)

    return NextResponse.json({
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Server update not implemented yet',
      },
      timestamp: new Date().toISOString(),
    }, { status: 501 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server update failed',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

/**
 * DELETE /api/mcps/[id] - Suppression d'un serveur (admin)
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // Future: authentification admin requise
    const { id } = context.params
    
    console.log(`🗑️ DELETE /api/mcps/${id} (not implemented)`)

    return NextResponse.json({
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Server deletion not implemented yet',
      },
      timestamp: new Date().toISOString(),
    }, { status: 501 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server deletion failed',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

/**
 * Récupère les détails complets d'un serveur MCP
 */
async function getServerDetail(id: string): Promise<McpServerDetail | null> {
  try {
    // Essayer de récupérer depuis le monitoring d'abord
    const monitoredServer = mcpHealthMonitor.getServerStatus(id)
    
    if (monitoredServer) {
      // Connexion live pour récupérer les détails
      const connectionResult = await mcpConnectionManager.connect(monitoredServer.url, {
        timeout: 10000,
        retries: 2,
      })

      if (connectionResult.success && connectionResult.server) {
        return buildServerDetail(id, connectionResult.server, monitoredServer.url)
      }
    }

    // Fallback: serveurs de démo
    const mockServer = getMockServerDetail(id)
    if (mockServer) {
      return mockServer
    }

    return null

  } catch (error) {
    console.error(`Error getting server detail for ${id}:`, error)
    return null
  }
}

/**
 * Construction des détails du serveur depuis les informations de connexion
 */
function buildServerDetail(
  id: string,
  serverInfo: any,
  _url: string
): McpServerDetail {

  return {
    id,
    name: serverInfo.name,
    description: `MCP Server: ${serverInfo.name}`,
    version: serverInfo.version,
    author: 'Auto-discovered',
    category: {
      id: 'other',
      name: 'Other', 
      description: 'General purpose MCP servers',
      icon: '📦',
      color: 'gray'
    },
    tags: ['auto-discovered'],
    
    // Repository et documentation
    repositoryUrl: `https://github.com/unknown/${serverInfo.name.toLowerCase()}`,
    licenseType: 'Unknown',
    
    // Installation  
    installation: {
      method: 'binary' as const,
      supportedPlatforms: ['unknown']
    },
    
    // MCP Protocol
    protocol: {
      version: '0.1.0',
      capabilities: serverInfo.capabilities || {},
      tools: serverInfo.tools?.map((tool: any) => ({
        name: tool.name,
        description: tool.description || ''
      })) || [],
      resources: serverInfo.resources?.map((resource: any) => ({
        uri: resource.uri,
        name: resource.name || resource.uri,
        description: resource.description || ''
      })) || []
    },
    
    // Health and metrics
    health: {
      status: 'unknown' as const,
      lastCheck: new Date().toISOString(),
      uptime: { '24h': 0, '7d': 0, '30d': 0 },
      averageResponseTime: 0
    },
    
    // Reviews and ratings
    reviews: {
      count: 0,
      averageRating: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    },
    
    // Metadata
    isVerified: false,
    isDeprecated: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

/**
 * Serveurs mock pour démo
 */
function getMockServerDetail(id: string): McpServerDetail | null {
  const mockServers: Record<string, McpServerDetail> = {
    'context7-demo': {
      id: 'context7-demo',
      name: 'Context7 Documentation Server',
      description: 'Provides up-to-date documentation and code examples for popular libraries and frameworks. Context7 offers comprehensive API documentation, usage examples, and best practices for hundreds of popular development libraries.',
      version: '1.2.0',
      author: 'Context7 Team',
      category: {
        id: 'documentation',
        name: 'Documentation',
        description: 'Documentation and knowledge resources',
        icon: '📚',
        color: 'blue'
      },
      tags: ['documentation', 'libraries', 'examples', 'developer-tools'],
      
      repositoryUrl: 'https://github.com/context7/mcp-server',
      documentationUrl: 'https://docs.context7.dev',
      homepageUrl: 'https://context7.dev',
      licenseType: 'MIT',
      licenseUrl: 'https://github.com/context7/mcp-server/blob/main/LICENSE',
      
      installationMethod: 'docker',
      packageName: undefined,
      dockerImage: 'context7/mcp-server:latest',
      configurationSchema: {
        apiKey: { type: 'string', required: false },
        cacheSize: { type: 'number', default: 1000 },
      },
      
      supportedPlatforms: ['docker', 'node'],
      minimumVersions: {
        node: '18.0.0',
        docker: '20.0.0',
      },
      
      protocolVersion: '0.1.0',
      capabilities: {
        tools: { listChanged: true },
        resources: { subscribe: true, listChanged: true },
        prompts: { listChanged: false },
      },
      tools: [
        {
          name: 'resolve-library-id',
          description: 'Resolves a package name to a Context7-compatible library ID',
          inputSchema: {
            type: 'object',
            properties: {
              libraryName: { type: 'string' },
            },
            required: ['libraryName'],
          },
        },
        {
          name: 'get-library-docs',
          description: 'Fetches up-to-date documentation for a library',
          inputSchema: {
            type: 'object',
            properties: {
              context7CompatibleLibraryID: { type: 'string' },
              tokens: { type: 'number' },
              topic: { type: 'string' },
            },
            required: ['context7CompatibleLibraryID'],
          },
        },
      ],
      resources: [
        {
          uri: 'context7://libraries',
          name: 'Available Libraries',
          description: 'List of all available libraries in Context7',
          mimeType: 'application/json',
        },
        {
          uri: 'context7://popular',
          name: 'Popular Libraries',
          description: 'Most popular libraries by usage',
          mimeType: 'application/json',
        },
      ],
      
      healthStatus: 'healthy',
      popularityScore: 92,
      qualityScore: 89,
      reviewCount: 45,
      averageRating: 4.6,
      
      isVerified: true,
      isDeprecated: false,
      deprecationNotice: undefined,
      securityAuditDate: '2024-11-01T10:00:00Z',
      
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: new Date().toISOString(),
      lastHealthCheck: new Date().toISOString(),
    },
    
    'serena-demo': {
      id: 'serena-demo',
      name: 'Serena Code Analysis Server',
      description: 'Advanced code analysis, symbol manipulation, and project memory management for development workflows. Serena provides powerful tools for code refactoring, symbol search, and intelligent code modifications.',
      version: '2.1.3',
      author: 'Serena Development Team',
      category: {
        id: 'dev-tools',
        name: 'Development Tools',
        icon: '🛠️',
      },
      tags: ['code-analysis', 'refactoring', 'symbols', 'memory', 'ide-tools'],
      
      repositoryUrl: 'https://github.com/serena/mcp-server',
      documentationUrl: 'https://serena.dev/docs',
      homepageUrl: 'https://serena.dev',
      licenseType: 'Apache-2.0',
      licenseUrl: 'https://github.com/serena/mcp-server/blob/main/LICENSE',
      
      installationMethod: 'pip',
      packageName: 'serena-mcp',
      dockerImage: undefined,
      configurationSchema: {
        workspaceRoot: { type: 'string', required: true },
        excludePatterns: { type: 'array', default: ['node_modules', '.git'] },
      },
      
      supportedPlatforms: ['python', 'node'],
      minimumVersions: {
        python: '3.8.0',
        node: '16.0.0',
      },
      
      protocolVersion: '0.1.0',
      capabilities: {
        tools: { listChanged: true },
        resources: { subscribe: false, listChanged: true },
        prompts: { listChanged: true },
      },
      tools: [
        {
          name: 'get_symbols_overview',
          description: 'Gets an overview of symbols in a file or directory',
          inputSchema: {
            type: 'object',
            properties: {
              relative_path: { type: 'string' },
              max_answer_chars: { type: 'number', default: 200000 },
            },
            required: ['relative_path'],
          },
        },
        {
          name: 'find_symbol',
          description: 'Finds symbols matching a name pattern',
          inputSchema: {
            type: 'object',
            properties: {
              name_path: { type: 'string' },
              relative_path: { type: 'string' },
              depth: { type: 'number', default: 0 },
            },
            required: ['name_path'],
          },
        },
        {
          name: 'replace_symbol_body',
          description: 'Replaces the body of a symbol',
          inputSchema: {
            type: 'object',
            properties: {
              name_path: { type: 'string' },
              relative_path: { type: 'string' },
              body: { type: 'string' },
            },
            required: ['name_path', 'relative_path', 'body'],
          },
        },
      ],
      resources: [
        {
          uri: 'serena://workspace',
          name: 'Workspace Overview',
          description: 'Current workspace symbol tree',
          mimeType: 'application/json',
        },
        {
          uri: 'serena://memories',
          name: 'Project Memories',
          description: 'Stored project context and memories',
          mimeType: 'application/json',
        },
      ],
      
      healthStatus: 'healthy',
      popularityScore: 87,
      qualityScore: 94,
      reviewCount: 67,
      averageRating: 4.8,
      
      isVerified: true,
      isDeprecated: false,
      deprecationNotice: undefined,
      securityAuditDate: '2024-10-15T14:20:00Z',
      
      createdAt: '2024-02-20T09:15:00Z',
      updatedAt: new Date().toISOString(),
      lastHealthCheck: new Date().toISOString(),
    },
    
    'archon-demo': {
      id: 'archon-demo',
      name: 'Archon Project Management Server',
      description: 'Comprehensive project management, task tracking, and RAG-powered knowledge base for development teams. Archon combines project organization with AI-powered search and knowledge management.',
      version: '3.0.1',
      author: 'Archon Systems',
      category: {
        id: 'productivity',
        name: 'Productivity',
        icon: '📋',
      },
      tags: ['project-management', 'tasks', 'rag', 'knowledge-base', 'ai'],
      
      repositoryUrl: 'https://github.com/archon/mcp-server',
      documentationUrl: 'https://archon.dev/mcp-docs',
      homepageUrl: 'https://archon.dev',
      licenseType: 'AGPL-3.0',
      licenseUrl: 'https://github.com/archon/mcp-server/blob/main/LICENSE',
      
      installationMethod: 'docker',
      packageName: undefined,
      dockerImage: 'archon/mcp-server:latest',
      configurationSchema: {
        database: { type: 'string', required: true },
        ragModel: { type: 'string', default: 'sentence-transformers' },
        enableAnalytics: { type: 'boolean', default: false },
      },
      
      supportedPlatforms: ['docker', 'node'],
      minimumVersions: {
        node: '18.0.0',
        docker: '20.0.0',
      },
      
      protocolVersion: '0.1.0',
      capabilities: {
        tools: { listChanged: true },
        resources: { subscribe: true, listChanged: true },
        prompts: { listChanged: true },
        experimental: { streaming: true, rag: true },
      },
      tools: [
        {
          name: 'create_project',
          description: 'Creates a new project with AI assistance',
          inputSchema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              github_repo: { type: 'string' },
            },
            required: ['title'],
          },
        },
        {
          name: 'perform_rag_query',
          description: 'Search knowledge base using RAG',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string' },
              source_domain: { type: 'string' },
              match_count: { type: 'number', default: 5 },
            },
            required: ['query'],
          },
        },
        {
          name: 'search_code_examples',
          description: 'Search for relevant code examples',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string' },
              match_count: { type: 'number', default: 3 },
            },
            required: ['query'],
          },
        },
      ],
      resources: [
        {
          uri: 'archon://projects',
          name: 'Active Projects',
          description: 'List of all active projects',
          mimeType: 'application/json',
        },
        {
          uri: 'archon://knowledge-base',
          name: 'Knowledge Base',
          description: 'RAG-powered knowledge base',
          mimeType: 'application/json',
        },
      ],
      
      healthStatus: 'healthy',
      popularityScore: 95,
      qualityScore: 91,
      reviewCount: 123,
      averageRating: 4.7,
      
      isVerified: true,
      isDeprecated: false,
      deprecationNotice: undefined,
      securityAuditDate: '2024-11-20T16:45:00Z',
      
      createdAt: '2024-01-10T11:00:00Z',
      updatedAt: new Date().toISOString(),
      lastHealthCheck: new Date().toISOString(),
    },
  }

  return mockServers[id] || null
}