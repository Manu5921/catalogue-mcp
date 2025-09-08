/**
 * 🔍 MCP SERVER DISCOVERY
 * 
 * Service de découverte automatique des serveurs MCP
 * Scan réseau, détection de nouveaux servers, catalogage automatique
 */

import { mcpConnectionManager, type McpConnectionResult } from './connection'

import type { McpServer } from '@/types/mcp'

export interface DiscoveryOptions {
  readonly timeout?: number // Default 10s per server
  readonly concurrent?: number // Default 3 concurrent connections
  readonly includeLocalhost?: boolean // Default true
  readonly portRanges?: readonly number[] // Default common MCP ports
}

export interface DiscoveryResult {
  readonly discovered: readonly DiscoveredServer[]
  readonly failed: readonly FailedDiscovery[]
  readonly duration: number
  readonly totalTested: number
}

export interface DiscoveredServer {
  readonly url: string
  readonly serverInfo: McpServerInfo
  readonly responseTime: number
  readonly discoveredAt: string
  readonly category: McpServerCategory
}

export interface FailedDiscovery {
  readonly url: string
  readonly error: string
  readonly responseTime: number
}

export interface McpServerInfo {
  readonly id: string
  readonly name: string
  readonly version: string
  readonly capabilities: Record<string, unknown>
  readonly tools: readonly string[]
  readonly resources: readonly string[]
}

export type McpServerCategory = 
  | 'documentation' 
  | 'code-analysis' 
  | 'project-management'
  | 'filesystem'
  | 'database'
  | 'web'
  | 'ai'
  | 'other'

/**
 * Service de découverte MCP
 */
export class McpDiscoveryService {
  private static instance: McpDiscoveryService
  
  // Ports communs pour serveurs MCP
  private readonly commonPorts = [
    8051, // Archon
    8052, // Context7  
    8053, // Serena
    8054, // GitHub MCP
    8055, // Jules
    3000, // Development servers
    3001,
    8000,
    8080,
    8888,
  ]

  // Serveurs MCP connus pour tests
  // 🛡️ SECURITY: Updated to HTTPS only (Jules CATA-006)
  private readonly knownServers = [
    'https://localhost:8051', // Archon
    'https://localhost:8052', // Context7
    'https://localhost:8053', // Serena
    'https://localhost:8054', // GitHub MCP
    'https://localhost:8055', // Jules
  ]

  static getInstance(): McpDiscoveryService {
    if (!this.instance) {
      this.instance = new McpDiscoveryService()
    }
    return this.instance
  }

  /**
   * Découverte automatique des serveurs MCP
   */
  async discoverServers(options: DiscoveryOptions = {}): Promise<DiscoveryResult> {
    const {
      timeout = 10000,
      concurrent = 3,
      includeLocalhost = true,
      portRanges = this.commonPorts,
    } = options

    const startTime = Date.now()
    console.log('🔍 Starting MCP server discovery...')

    // Build list of URLs to test
    const urlsToTest = this.buildDiscoveryUrls(includeLocalhost, portRanges)
    console.log(`📡 Testing ${urlsToTest.length} potential MCP servers`)

    // Découverte avec concurrence limitée
    const results = await this.discoverConcurrent(urlsToTest, concurrent, timeout)
    
    const duration = Date.now() - startTime
    console.log(`✅ Discovery completed in ${duration}ms`)
    console.log(`📊 Found ${results.discovered.length}/${urlsToTest.length} servers`)

    return {
      ...results,
      duration,
      totalTested: urlsToTest.length,
    }
  }

  /**
   * Construction de la liste d'URLs à tester
   */
  private buildDiscoveryUrls(
    includeLocalhost: boolean,
    portRanges: readonly number[]
  ): string[] {
    const urls: string[] = []

    if (includeLocalhost) {
      // Test known servers first (priorité)
      urls.push(...this.knownServers)

      // Test common ports on localhost
      for (const port of portRanges) {
        const url = `https://localhost:${port}`
        if (!urls.includes(url)) {
          urls.push(url)
        }
      }

      // Test 127.0.0.1 variants
      for (const port of portRanges.slice(0, 5)) { // Limit to avoid too many tests
        urls.push(`https://127.0.0.1:${port}`)
      }
    }

    return urls
  }

  /**
   * Découverte avec concurrence limitée
   */
  private async discoverConcurrent(
    urls: string[],
    concurrent: number,
    timeout: number
  ): Promise<{ discovered: DiscoveredServer[]; failed: FailedDiscovery[] }> {
    
    const discovered: DiscoveredServer[] = []
    const failed: FailedDiscovery[] = []

    // Process URLs in chunks to limit concurrency
    for (let i = 0; i < urls.length; i += concurrent) {
      const chunk = urls.slice(i, i + concurrent)
      
      const promises = chunk.map(url => this.testSingleServer(url, timeout))
      const results = await Promise.allSettled(promises)

      for (let j = 0; j < results.length; j++) {
        const result = results[j]
        const url = chunk[j]

        if (result.status === 'fulfilled' && result.value.success) {
          discovered.push(result.value.server!)
        } else {
          const error = result.status === 'rejected' 
            ? result.reason?.message || 'Unknown error'
            : result.value.error || 'Connection failed'
          
          failed.push({
            url,
            error,
            responseTime: result.status === 'fulfilled' ? result.value.responseTime : 0,
          })
        }
      }

      // Small delay between chunks to avoid overwhelming
      if (i + concurrent < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return { discovered, failed }
  }

  /**
   * Test d'un seul serveur
   */
  private async testSingleServer(
    url: string, 
    timeout: number
  ): Promise<{ success: boolean; server?: DiscoveredServer; error?: string; responseTime: number }> {
    
    try {
      const result = await mcpConnectionManager.connect(url, { 
        timeout,
        retries: 1, // Single attempt for discovery
      })

      if (result.success && result.server) {
        const discoveredServer: DiscoveredServer = {
          url,
          serverInfo: {
            id: result.server.id,
            name: result.server.name,
            version: result.server.version,
            capabilities: result.server.capabilities,
            tools: result.server.tools.map(t => t.name),
            resources: result.server.resources.map(r => r.name),
          },
          responseTime: result.responseTime,
          discoveredAt: new Date().toISOString(),
          category: this.categorizeServer(result.server.name, result.server.tools.map(t => t.name)),
        }

        console.log(`✅ Discovered: ${result.server.name} at ${url}`)
        return { success: true, server: discoveredServer, responseTime: result.responseTime }
      }

      return { 
        success: false, 
        error: result.error || 'Connection failed', 
        responseTime: result.responseTime 
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Discovery failed',
        responseTime: 0,
      }
    }
  }

  /**
   * Catégorisation automatique des serveurs
   */
  private categorizeServer(name: string, tools: readonly string[]): McpServerCategory {
    const lowerName = name.toLowerCase()
    const toolsStr = tools.join(' ').toLowerCase()

    // Documentation servers
    if (lowerName.includes('context7') || 
        lowerName.includes('documentation') ||
        lowerName.includes('docs') ||
        toolsStr.includes('library') ||
        toolsStr.includes('documentation')) {
      return 'documentation'
    }

    // Code analysis
    if (lowerName.includes('serena') ||
        lowerName.includes('code') ||
        lowerName.includes('analysis') ||
        toolsStr.includes('symbol') ||
        toolsStr.includes('refactor')) {
      return 'code-analysis'  
    }

    // Project management
    if (lowerName.includes('archon') ||
        lowerName.includes('project') ||
        lowerName.includes('task') ||
        toolsStr.includes('project') ||
        toolsStr.includes('task') ||
        toolsStr.includes('rag')) {
      return 'project-management'
    }

    // Filesystem
    if (lowerName.includes('file') ||
        lowerName.includes('filesystem') ||
        toolsStr.includes('file') ||
        toolsStr.includes('read') ||
        toolsStr.includes('write')) {
      return 'filesystem'
    }

    // Database
    if (lowerName.includes('database') ||
        lowerName.includes('db') ||
        lowerName.includes('sql') ||
        toolsStr.includes('query') ||
        toolsStr.includes('database')) {
      return 'database'
    }

    // Web services
    if (lowerName.includes('web') ||
        lowerName.includes('http') ||
        lowerName.includes('api') ||
        toolsStr.includes('fetch') ||
        toolsStr.includes('request')) {
      return 'web'
    }

    // AI services
    if (lowerName.includes('ai') ||
        lowerName.includes('llm') ||
        lowerName.includes('claude') ||
        lowerName.includes('openai') ||
        toolsStr.includes('generate') ||
        toolsStr.includes('completion')) {
      return 'ai'
    }

    return 'other'
  }

  /**
   * Conversion d'un serveur découvert en McpServer pour le catalogue
   */
  convertToMcpServer(discovered: DiscoveredServer): Partial<McpServer> {
    return {
      id: discovered.serverInfo.id,
      name: discovered.serverInfo.name,
      description: `Auto-discovered MCP server: ${discovered.serverInfo.name}`,
      version: discovered.serverInfo.version,
      author: 'Unknown', // Would need to be extracted from server info
      category: discovered.category,
      tags: [discovered.category, 'auto-discovered'],
      repositoryUrl: `https://github.com/unknown/${discovered.serverInfo.name.toLowerCase().replace(/\s+/g, '-')}`,
      protocolVersion: '0.1.0',
      healthStatus: 'healthy',
      popularityScore: 50, // Default for new discoveries
      qualityScore: 60,  // Default, would need evaluation
      reviewCount: 0,
      averageRating: 0,
      isVerified: false, // Auto-discovered servers start unverified
      isDeprecated: false,
      createdAt: discovered.discoveredAt,
      updatedAt: discovered.discoveredAt,
      // Additional fields would be populated from discovery
      tools: [], // Would be converted from discovered.serverInfo.tools
      resources: [], // Would be converted from discovered.serverInfo.resources
    }
  }

  /**
   * Surveillance continue pour nouveaux serveurs
   */
  async startContinuousDiscovery(intervalMs: number = 5 * 60 * 1000): Promise<void> {
    console.log(`🔄 Starting continuous MCP discovery (every ${intervalMs}ms)`)
    
    setInterval(async () => {
      try {
        console.log('🔍 Running scheduled MCP discovery...')
        const result = await this.discoverServers({
          timeout: 5000, // Shorter timeout for continuous discovery
          concurrent: 2, // Fewer concurrent connections
        })
        
        if (result.discovered.length > 0) {
          console.log(`📡 Continuous discovery found ${result.discovered.length} servers`)
          // Here you would typically update the database/cache
        }
      } catch (error) {
        console.error('❌ Continuous discovery error:', error)
      }
    }, intervalMs)
  }
}

// Export singleton
export const mcpDiscoveryService = McpDiscoveryService.getInstance()