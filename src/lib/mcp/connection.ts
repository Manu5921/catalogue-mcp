/**
 * 🔌 MCP CONNECTION MANAGER
 * 
 * Gestionnaire de connexions aux serveurs MCP avec retry et timeout
 * Implémente le protocole MCP 0.1.0 avec health checks
 */

import type { McpServer, HealthCheck } from '@/types/mcp'

export interface McpConnectionOptions {
  readonly timeout?: number // Default 30s
  readonly retries?: number // Default 3
  readonly retryDelay?: number // Default 1000ms
}

export interface McpConnectionResult {
  readonly success: boolean
  readonly server?: McpServerInfo
  readonly error?: string
  readonly responseTime: number
}

export interface McpServerInfo {
  readonly id: string
  readonly name: string
  readonly version: string
  readonly capabilities: McpCapabilities
  readonly tools: McpToolInfo[]
  readonly resources: McpResourceInfo[]
}

export interface McpCapabilities {
  readonly tools?: { listChanged?: boolean }
  readonly resources?: { subscribe?: boolean; listChanged?: boolean }
  readonly prompts?: { listChanged?: boolean }
  readonly logging?: { level?: string }
}

export interface McpToolInfo {
  readonly name: string
  readonly description: string
  readonly inputSchema?: Record<string, unknown>
}

export interface McpResourceInfo {
  readonly uri: string
  readonly name: string
  readonly description?: string
  readonly mimeType?: string
}

/**
 * Connexion à un serveur MCP avec retry automatique
 */
export class McpConnectionManager {
  private static instance: McpConnectionManager
  private connections = new Map<string, McpConnection>()
  
  static getInstance(): McpConnectionManager {
    if (!this.instance) {
      this.instance = new McpConnectionManager()
    }
    return this.instance
  }

  /**
   * Connecte à un serveur MCP
   */
  async connect(
    serverUrl: string, 
    options: McpConnectionOptions = {}
  ): Promise<McpConnectionResult> {
    const startTime = Date.now()
    const { timeout = 30000, retries = 3, retryDelay = 1000 } = options

    let lastError = ''
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔌 MCP connection attempt ${attempt}/${retries} to ${serverUrl}`)
        
        const result = await this.attemptConnection(serverUrl, timeout)
        
        if (result.success) {
          console.log(`✅ MCP connected to ${serverUrl} in ${Date.now() - startTime}ms`)
          return {
            ...result,
            responseTime: Date.now() - startTime,
          }
        }
        
        lastError = result.error || 'Unknown connection error'
        
        if (attempt < retries) {
          await this.delay(retryDelay * attempt) // Exponential backoff
        }
        
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Connection failed'
        console.warn(`⚠️ MCP connection attempt ${attempt} failed: ${lastError}`)
        
        if (attempt < retries) {
          await this.delay(retryDelay * attempt)
        }
      }
    }

    return {
      success: false,
      error: `Failed after ${retries} attempts: ${lastError}`,
      responseTime: Date.now() - startTime,
    }
  }

  /**
   * Tentative de connexion unique
   * 🛡️ SECURITY: Force HTTPS/WSS only (CATA-006 & CATA-007)
   */
  private async attemptConnection(
    serverUrl: string,
    timeout: number
  ): Promise<McpConnectionResult> {
    
    // Parse URL to determine connection method
    const url = new URL(serverUrl)
    
    // 🔒 SECURITY GATE: Only allow secure protocols (Jules CATA-006)
    if (url.protocol === 'http:') {
      return {
        success: false,
        error: 'Insecure HTTP protocol not allowed. Use HTTPS instead for security.',
        responseTime: 0,
      }
    }
    
    if (url.protocol === 'ws:') {
      return {
        success: false,
        error: 'Insecure WebSocket protocol not allowed. Use WSS instead for security.',
        responseTime: 0,
      }
    }
    
    // Allow only secure protocols
    if (url.protocol === 'https:') {
      return this.connectHttp(serverUrl, timeout)
    }
    
    if (url.protocol === 'wss:') {
      return this.connectWebSocket(serverUrl, timeout)
    }
    
    return {
      success: false,
      error: `Unsupported protocol: ${url.protocol}. Only HTTPS and WSS are allowed.`,
      responseTime: 0,
    }
  }

  /**
   * Connexion HTTP/REST
   */
  private async connectHttp(
    serverUrl: string,
    timeout: number
  ): Promise<McpConnectionResult> {
    
    try {
      // Test basic connectivity first
      const healthResponse = await fetch(`${serverUrl}/health`, {
        signal: AbortSignal.timeout(timeout),
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Catalogue-MCP/1.0.0',
        },
      })

      if (!healthResponse.ok) {
        return {
          success: false,
          error: `HTTP ${healthResponse.status}: ${healthResponse.statusText}`,
          responseTime: 0,
        }
      }

      // Get server info
      const serverInfo = await this.discoverServerInfo(serverUrl, timeout)
      
      return {
        success: true,
        server: serverInfo,
        responseTime: 0, // Will be calculated by caller
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'HTTP connection failed',
        responseTime: 0,
      }
    }
  }

  /**
   * Connexion WebSocket
   */
  private async connectWebSocket(
    serverUrl: string,
    timeout: number
  ): Promise<McpConnectionResult> {
    
    return new Promise((resolve) => {
      const ws = new WebSocket(serverUrl)
      const timeoutId = setTimeout(() => {
        ws.close()
        resolve({
          success: false,
          error: 'WebSocket connection timeout',
          responseTime: 0,
        })
      }, timeout)

      ws.onopen = () => {
        clearTimeout(timeoutId)
        
        // Send MCP initialize message
        ws.send(JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: {
              name: 'Catalogue-MCP',
              version: '1.0.0',
            },
          },
        }))
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          
          if (message.id === 1 && message.result) {
            // Initialize successful
            const serverInfo: McpServerInfo = {
              id: `ws-${Date.now()}`,
              name: message.result.serverInfo?.name || 'WebSocket MCP Server',
              version: message.result.serverInfo?.version || '1.0.0',
              capabilities: message.result.capabilities || {},
              tools: [], // Would be populated via tools/list
              resources: [], // Would be populated via resources/list
            }
            
            ws.close()
            resolve({
              success: true,
              server: serverInfo,
              responseTime: 0,
            })
          }
        } catch (error) {
          ws.close()
          resolve({
            success: false,
            error: 'Invalid WebSocket response',
            responseTime: 0,
          })
        }
      }

      ws.onerror = () => {
        clearTimeout(timeoutId)
        resolve({
          success: false,
          error: 'WebSocket connection error',
          responseTime: 0,
        })
      }
    })
  }

  /**
   * Découverte des informations du serveur
   */
  private async discoverServerInfo(
    serverUrl: string,
    timeout: number
  ): Promise<McpServerInfo> {
    
    // Try to get server info from common endpoints
    const endpoints = ['/info', '/server-info', '/mcp/info', '/']
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${serverUrl}${endpoint}`, {
          signal: AbortSignal.timeout(timeout / endpoints.length),
          headers: { 'Accept': 'application/json' },
        })
        
        if (response.ok) {
          const data = await response.json()
          
          return {
            id: data.id || `http-${Date.now()}`,
            name: data.name || this.extractServerName(serverUrl),
            version: data.version || '1.0.0',
            capabilities: data.capabilities || {},
            tools: data.tools || [],
            resources: data.resources || [],
          }
        }
      } catch {
        // Try next endpoint
        continue
      }
    }
    
    // Fallback to basic info
    return {
      id: `http-${Date.now()}`,
      name: this.extractServerName(serverUrl),
      version: '1.0.0',
      capabilities: {},
      tools: [],
      resources: [],
    }
  }

  /**
   * Extrait le nom du serveur depuis l'URL
   */
  private extractServerName(serverUrl: string): string {
    try {
      const url = new URL(serverUrl)
      const hostname = url.hostname
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `MCP Server :${url.port || '80'}`
      }
      
      return hostname.replace(/^www\./, '')
    } catch {
      return 'Unknown MCP Server'
    }
  }

  /**
   * Effectue un health check sur un serveur
   */
  async healthCheck(serverUrl: string): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      const response = await fetch(`${serverUrl}/health`, {
        signal: AbortSignal.timeout(5000), // 5s timeout for health checks
      })
      
      const responseTime = Date.now() - startTime
      
      if (response.ok) {
        return {
          serverId: this.extractServerName(serverUrl),
          timestamp: new Date().toISOString(),
          status: 'healthy',
          responseTime,
          details: {
            connectionTime: responseTime,
            toolsListTime: 0, // Would be measured separately
            resourcesListTime: 0, // Would be measured separately
          },
        }
      }
      
      return {
        serverId: this.extractServerName(serverUrl),
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        responseTime,
        error: `HTTP ${response.status}`,
        details: {
          connectionTime: responseTime,
          toolsListTime: 0,
          resourcesListTime: 0,
        },
      }
      
    } catch (error) {
      return {
        serverId: this.extractServerName(serverUrl),
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Health check failed',
        details: {
          connectionTime: Date.now() - startTime,
          toolsListTime: 0,
          resourcesListTime: 0,
        },
      }
    }
  }

  /**
   * Utilitaire pour delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Ferme toutes les connexions
   */
  async closeAll(): Promise<void> {
    for (const [url, connection] of this.connections) {
      try {
        await connection.close()
        console.log(`🔌 Closed connection to ${url}`)
      } catch (error) {
        console.warn(`⚠️ Error closing connection to ${url}:`, error)
      }
    }
    this.connections.clear()
  }
}

/**
 * Interface pour une connexion MCP active
 */
export interface McpConnection {
  readonly url: string
  readonly serverInfo: McpServerInfo
  readonly connected: boolean
  close(): Promise<void>
}

// Export singleton instance
export const mcpConnectionManager = McpConnectionManager.getInstance()