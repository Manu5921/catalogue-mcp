/**
 * 🔧 MCP PROTOCOL TYPES
 * 
 * Type definitions for Model Context Protocol (MCP) servers, tools, and resources.
 * Based on MCP specification and real-world server implementations.
 * 
 * @see https://modelcontextprotocol.io/specification/
 */

// ============================================================================
// CORE MCP SERVER TYPES
// ============================================================================

/**
 * MCP Server categories for organization and discovery
 */
export type McpServerCategory = 
  | 'filesystem'      // File system operations
  | 'database'        // Database connections and queries  
  | 'web'            // Web scraping, HTTP requests
  | 'ai'             // AI/ML model integrations
  | 'cloud'          // Cloud service integrations
  | 'dev-tools'      // Development utilities
  | 'communication'  // Chat, email, messaging
  | 'productivity'   // Task management, calendars
  | 'security'       // Authentication, encryption
  | 'monitoring'     // System monitoring, logs
  | 'other'          // Miscellaneous

/**
 * Health status for MCP servers
 */
export type McpServerStatus = 
  | 'online'         // Server responsive and functional
  | 'offline'        // Server not reachable
  | 'degraded'       // Server reachable but slow/errors
  | 'maintenance'    // Server in maintenance mode
  | 'unknown'        // Status cannot be determined

/**
 * Core MCP Server definition
 */
export interface McpServer {
  // Basic identification
  readonly id: string
  readonly name: string
  readonly description: string
  readonly version: string
  readonly author: string
  readonly category: McpServerCategory
  readonly tags: readonly string[]
  
  // Repository and documentation
  readonly repositoryUrl: string
  readonly documentationUrl?: string
  readonly homepageUrl?: string
  readonly licenseType: string
  readonly licenseUrl?: string
  
  // Installation and configuration
  readonly installationMethod: 'npm' | 'pip' | 'docker' | 'binary' | 'source'
  readonly packageName?: string // For npm/pip packages
  readonly dockerImage?: string // For docker installations
  readonly configurationSchema?: Record<string, unknown> // JSON Schema
  
  // Runtime information
  readonly supportedPlatforms: readonly ('node' | 'python' | 'docker')[]
  readonly minimumVersions?: {
    node?: string
    python?: string
    docker?: string
  }
  
  // MCP Protocol information
  readonly protocolVersion: string
  readonly capabilities: McpCapabilities
  readonly tools: readonly McpTool[]
  readonly resources: readonly McpResource[]
  readonly prompts?: readonly McpPrompt[]
  
  // Metadata and stats
  readonly createdAt: string // ISO 8601
  readonly updatedAt: string // ISO 8601
  readonly lastHealthCheck?: string // ISO 8601
  readonly healthStatus: McpServerStatus
  readonly popularityScore: number // 0-100
  readonly qualityScore: number // 0-100
  readonly reviewCount: number
  readonly averageRating: number // 1-5
  
  // Verification and trust
  readonly isVerified: boolean // Official or community verified
  readonly isDeprecated: boolean
  readonly deprecationNotice?: string
  readonly securityAuditDate?: string // ISO 8601
}

/**
 * MCP Server configuration for connection
 */
export interface McpServerConfig {
  readonly serverId: string
  readonly name: string
  readonly command: string
  readonly args: readonly string[]
  readonly env?: Record<string, string>
  readonly cwd?: string
  readonly timeout?: number
  readonly retries?: number
}

/**
 * Active MCP connection instance
 */
export interface McpConnection {
  readonly id: string
  readonly serverId: string
  readonly status: 'connecting' | 'connected' | 'disconnected' | 'error'
  readonly connectedAt?: string // ISO 8601
  readonly lastActivity?: string // ISO 8601
  readonly error?: string
  readonly latency?: number // milliseconds
}

// ============================================================================
// MCP PROTOCOL CAPABILITIES
// ============================================================================

/**
 * MCP Server capabilities as defined in protocol
 */
export interface McpCapabilities {
  readonly tools?: {
    listChanged?: boolean
  }
  readonly resources?: {
    subscribe?: boolean
    listChanged?: boolean
  }
  readonly prompts?: {
    listChanged?: boolean
  }
  readonly logging?: {
    level?: 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'critical' | 'alert' | 'emergency'
  }
  readonly experimental?: Record<string, unknown>
}

// ============================================================================
// MCP TOOLS
// ============================================================================

/**
 * Parameter definition for MCP tools
 */
export interface McpToolParameter {
  readonly name: string
  readonly description: string
  readonly type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  readonly required: boolean
  readonly defaultValue?: unknown
  readonly enum?: readonly unknown[]
  readonly pattern?: string // For string validation
  readonly minimum?: number // For numeric validation
  readonly maximum?: number // For numeric validation
}

/**
 * MCP Tool definition
 */
export interface McpTool {
  readonly name: string
  readonly description: string
  readonly parameters: readonly McpToolParameter[]
  readonly examples?: readonly {
    readonly description: string
    readonly parameters: Record<string, unknown>
    readonly expectedResult: string
  }[]
  readonly category?: string
  readonly tags?: readonly string[]
  readonly riskLevel?: 'safe' | 'low' | 'medium' | 'high' | 'dangerous'
  readonly rateLimited?: boolean
  readonly requiresAuth?: boolean
}

// ============================================================================
// MCP RESOURCES
// ============================================================================

/**
 * MCP Resource types
 */
export type McpResourceType = 'file' | 'directory' | 'database' | 'api' | 'stream' | 'other'

/**
 * MCP Resource definition
 */
export interface McpResource {
  readonly uri: string
  readonly name: string
  readonly description: string
  readonly type: McpResourceType
  readonly mimeType?: string
  readonly size?: number // bytes
  readonly lastModified?: string // ISO 8601
  readonly metadata?: Record<string, unknown>
  readonly permissions?: readonly ('read' | 'write' | 'delete')[]
}

// ============================================================================
// MCP PROMPTS
// ============================================================================

/**
 * MCP Prompt definition for prompt templates
 */
export interface McpPrompt {
  readonly name: string
  readonly description: string
  readonly arguments?: readonly McpToolParameter[]
  readonly template: string
  readonly category?: string
  readonly tags?: readonly string[]
  readonly examples?: readonly {
    readonly description: string
    readonly arguments: Record<string, unknown>
    readonly expectedOutput: string
  }[]
}

// ============================================================================
// HEALTH MONITORING TYPES
// ============================================================================

/**
 * Health check status enum
 */
export type HealthStatus = 'healthy' | 'unhealthy' | 'degraded' | 'unknown'

/**
 * Individual health check result
 */
export interface HealthCheck {
  readonly serverId: string
  readonly timestamp: string // ISO 8601
  readonly status: HealthStatus
  readonly responseTime: number // milliseconds
  readonly error?: string
  readonly details: {
    readonly connectionTime: number // milliseconds
    readonly toolsListTime: number // milliseconds
    readonly resourcesListTime: number // milliseconds
    readonly memoryUsage?: number // MB
    readonly cpuUsage?: number // percentage
  }
}

/**
 * Historical health metrics
 */
export interface HealthMetrics {
  readonly serverId: string
  readonly period: '1h' | '24h' | '7d' | '30d'
  readonly uptime: number // percentage 0-100
  readonly averageResponseTime: number // milliseconds
  readonly totalChecks: number
  readonly failedChecks: number
  readonly lastCheck: string // ISO 8601
  readonly trends: {
    readonly uptimeTrend: 'improving' | 'stable' | 'degrading'
    readonly performanceTrend: 'improving' | 'stable' | 'degrading'
  }
}

/**
 * Uptime data for charting
 */
export interface UptimeData {
  readonly timestamp: string // ISO 8601
  readonly status: HealthStatus
  readonly responseTime: number // milliseconds
}

/**
 * Performance metrics for benchmarking
 */
export interface PerformanceMetrics {
  readonly serverId: string
  readonly benchmark: {
    readonly connectionTime: number
    readonly toolExecutionTime: number
    readonly resourceAccessTime: number
    readonly throughput: number // operations per second
  }
  readonly comparativeScore: number // 0-100 compared to similar servers
  readonly lastBenchmark: string // ISO 8601
}

// ============================================================================
// DOCUMENTATION AND METADATA
// ============================================================================

/**
 * Server manifest with extended metadata
 */
export interface ServerManifest {
  readonly name: string
  readonly version: string
  readonly description: string
  readonly author: string
  readonly license: string
  readonly homepage?: string
  readonly repository?: string
  readonly bugs?: string
  readonly keywords: readonly string[]
  readonly engines?: Record<string, string>
  readonly dependencies?: Record<string, string>
  readonly mcpMetadata: {
    readonly protocolVersion: string
    readonly capabilities: McpCapabilities
    readonly configuration?: Record<string, unknown>
    readonly examples?: readonly ServerExample[]
  }
}

/**
 * Structured documentation
 */
export interface ServerDocumentation {
  readonly serverId: string
  readonly sections: readonly {
    readonly title: string
    readonly content: string
    readonly order: number
  }[]
  readonly installation: InstallationGuide
  readonly configuration?: Record<string, unknown>
  readonly troubleshooting?: readonly {
    readonly issue: string
    readonly solution: string
    readonly tags: readonly string[]
  }[]
  readonly changelog?: readonly {
    readonly version: string
    readonly date: string
    readonly changes: readonly string[]
  }[]
}

/**
 * Usage examples and code samples
 */
export interface ServerExample {
  readonly title: string
  readonly description: string
  readonly category: 'installation' | 'configuration' | 'usage' | 'integration'
  readonly code: string
  readonly language: 'javascript' | 'typescript' | 'python' | 'bash' | 'json' | 'yaml'
  readonly tags: readonly string[]
  readonly difficulty: 'beginner' | 'intermediate' | 'advanced'
}

/**
 * Installation guide with multiple methods
 */
export interface InstallationGuide {
  readonly methods: readonly {
    readonly type: 'npm' | 'pip' | 'docker' | 'binary' | 'source'
    readonly title: string
    readonly description: string
    readonly steps: readonly {
      readonly step: number
      readonly description: string
      readonly command?: string
      readonly notes?: string
    }[]
    readonly verification?: {
      readonly command: string
      readonly expectedOutput: string
    }
  }[]
  readonly requirements: {
    readonly system: readonly string[]
    readonly software: readonly {
      readonly name: string
      readonly version: string
      readonly optional: boolean
    }[]
    readonly environment?: Record<string, string>
  }
  readonly troubleshooting: readonly {
    readonly issue: string
    readonly solution: string
  }[]
}

// ============================================================================
// CATALOGUE-SPECIFIC TYPES
// ============================================================================

/**
 * Simplified MCP server category for UI display
 */
export interface McpServerCategory {
  readonly name: string
  readonly icon: string
}

/**
 * Simplified MCP server configuration for connection
 */
export interface McpServerConfig {
  readonly serverUrl?: string
  readonly port?: number
  readonly protocol?: 'http' | 'https' | 'ws' | 'wss'
  readonly auth?: {
    readonly type: 'bearer' | 'basic' | 'api-key'
    readonly token?: string
  }
  readonly timeout?: number
  readonly retries?: number
  readonly documentation?: {
    readonly readme?: string
    readonly examples?: string
    readonly api?: string
  }
}

/**
 * Simplified MCP server summary for catalogue listing
 */
export interface McpServerSummary {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly version: string
  readonly author: string
  readonly category: McpServerCategory
  readonly tags: readonly string[]
  readonly healthStatus: 'healthy' | 'degraded' | 'unhealthy' | 'unknown'
  readonly lastUpdated: string
  readonly config: McpServerConfig
  readonly averageRating: number
  readonly reviewCount: number
  readonly isVerified: boolean
}

/**
 * Extended server details for detail pages
 */
export interface McpServerDetails extends McpServerSummary {
  readonly tools: readonly McpTool[]
  readonly resources: readonly McpResource[]
  readonly documentation?: {
    readonly readme?: string
    readonly examples?: string
    readonly api?: string
  }
}

/**
 * MCP Tool with simplified schema structure
 */
export interface McpTool {
  readonly name: string
  readonly description: string
  readonly inputSchema?: {
    readonly type: 'object'
    readonly properties?: Record<string, unknown>
    readonly required?: readonly string[]
  }
}

/**
 * Corrected HealthMetrics interface with proper naming
 */
export interface HealthMetrics {
  readonly serverId: string
  readonly period: '1h' | '24h' | '7d' | '30d'
  readonly uptime: number // percentage 0-1
  readonly avgResponseTime: number // milliseconds (renamed from averageResponseTime)
  readonly errorRate: number // percentage 0-1
  readonly totalChecks: number
  readonly failedChecks: number
  readonly lastCheck: string // ISO 8601
  readonly trends?: {
    readonly uptimeTrend: 'improving' | 'stable' | 'degrading'
    readonly performanceTrend: 'improving' | 'stable' | 'degrading'
  }
}