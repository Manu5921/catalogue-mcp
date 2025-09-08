/**
 * 🌐 API TYPES
 * 
 * Type definitions for API requests, responses, and data transfer objects.
 * Follows REST API conventions with consistent error handling.
 */

// ============================================================================
// GENERIC API TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  readonly success: boolean
  readonly data: T
  readonly message?: string
  readonly timestamp: string // ISO 8601
}

/**
 * API error response
 */
export interface ApiError {
  readonly success: false
  readonly error: {
    readonly code: string
    readonly message: string
    readonly details?: Record<string, unknown>
    readonly field?: string // For validation errors
  }
  readonly timestamp: string // ISO 8601
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T = unknown> {
  readonly success: true
  readonly data: readonly T[]
  readonly pagination: {
    readonly page: number
    readonly limit: number
    readonly total: number
    readonly totalPages: number
    readonly hasNext: boolean
    readonly hasPrev: boolean
  }
  readonly timestamp: string // ISO 8601
}

/**
 * API request with pagination
 */
export interface PaginationParams {
  readonly page?: number
  readonly limit?: number
}

/**
 * API request with sorting
 */
export interface SortParams {
  readonly sortBy?: string
  readonly sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// MCP SERVERS API
// ============================================================================

/**
 * Get all MCP servers request
 */
export interface GetMcpsRequest extends PaginationParams, SortParams {
  readonly category?: string
  readonly status?: 'online' | 'offline' | 'degraded' | 'maintenance' | 'unknown'
  readonly tags?: readonly string[]
  readonly search?: string
  readonly verified?: boolean
  readonly minRating?: number
}

/**
 * Get all MCP servers response
 */
export interface GetMcpsResponse extends PaginatedResponse<McpServerSummary> {
  readonly facets: {
    readonly categories: readonly { name: string; count: number }[]
    readonly statuses: readonly { status: string; count: number }[]
    readonly tags: readonly { tag: string; count: number }[]
  }
}

/**
 * MCP Server summary for list views
 */
export interface McpServerSummary {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly version: string
  readonly author: string
  readonly category: {
    readonly id: string
    readonly name: string
    readonly icon: string
  }
  readonly tags: readonly string[]
  readonly healthStatus: 'online' | 'offline' | 'degraded' | 'maintenance' | 'unknown'
  readonly averageRating: number
  readonly reviewCount: number
  readonly isVerified: boolean
  readonly lastUpdated: string // ISO 8601
}

/**
 * Get single MCP server response
 */
export interface GetMcpResponse extends ApiResponse<McpServerDetail> {
  // Extended with server detail
}

/**
 * Detailed MCP Server information
 */
export interface McpServerDetail {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly version: string
  readonly author: string
  readonly category: {
    readonly id: string
    readonly name: string
    readonly description: string
    readonly icon: string
    readonly color: string
  }
  readonly tags: readonly string[]
  
  // Repository and links
  readonly repositoryUrl: string
  readonly documentationUrl?: string
  readonly homepageUrl?: string
  readonly licenseType: string
  readonly licenseUrl?: string
  
  // Installation
  readonly installation: {
    readonly method: 'npm' | 'pip' | 'docker' | 'binary' | 'source'
    readonly packageName?: string
    readonly dockerImage?: string
    readonly configurationSchema?: Record<string, unknown>
    readonly supportedPlatforms: readonly string[]
    readonly minimumVersions?: Record<string, string>
  }
  
  // MCP Protocol
  readonly protocol: {
    readonly version: string
    readonly capabilities: Record<string, unknown>
    readonly tools: readonly ToolSummary[]
    readonly resources: readonly ResourceSummary[]
    readonly prompts?: readonly PromptSummary[]
  }
  
  // Health and metrics
  readonly health: {
    readonly status: 'online' | 'offline' | 'degraded' | 'maintenance' | 'unknown'
    readonly lastCheck: string // ISO 8601
    readonly uptime: {
      readonly '24h': number
      readonly '7d': number
      readonly '30d': number
    }
    readonly averageResponseTime: number
  }
  
  // Reviews and ratings
  readonly reviews: {
    readonly count: number
    readonly averageRating: number
    readonly distribution: {
      readonly 1: number
      readonly 2: number
      readonly 3: number
      readonly 4: number
      readonly 5: number
    }
  }
  
  // Metadata
  readonly isVerified: boolean
  readonly isDeprecated: boolean
  readonly deprecationNotice?: string
  readonly securityAuditDate?: string // ISO 8601
  readonly createdAt: string // ISO 8601
  readonly updatedAt: string // ISO 8601
}

/**
 * Tool summary for API responses
 */
export interface ToolSummary {
  readonly name: string
  readonly description: string
  readonly parameterCount: number
  readonly riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'dangerous'
  readonly requiresAuth: boolean
}

/**
 * Resource summary for API responses
 */
export interface ResourceSummary {
  readonly uri: string
  readonly name: string
  readonly type: 'file' | 'directory' | 'database' | 'api' | 'stream' | 'other'
  readonly permissions: readonly string[]
}

/**
 * Prompt summary for API responses
 */
export interface PromptSummary {
  readonly name: string
  readonly description: string
  readonly category?: string
}

/**
 * Create MCP server request
 */
export interface CreateMcpRequest {
  readonly name: string
  readonly description: string
  readonly version: string
  readonly author: string
  readonly categoryId: string
  readonly tags: readonly string[]
  readonly repositoryUrl: string
  readonly documentationUrl?: string
  readonly homepageUrl?: string
  readonly licenseType: string
  readonly licenseUrl?: string
  readonly installationMethod: 'npm' | 'pip' | 'docker' | 'binary' | 'source'
  readonly packageName?: string
  readonly dockerImage?: string
  readonly supportedPlatforms: readonly string[]
  readonly protocolVersion: string
  readonly capabilities: Record<string, unknown>
}

/**
 * Update MCP server request
 */
export interface UpdateMcpRequest {
  readonly description?: string
  readonly version?: string
  readonly categoryId?: string
  readonly tags?: readonly string[]
  readonly documentationUrl?: string
  readonly homepageUrl?: string
  readonly licenseType?: string
  readonly licenseUrl?: string
  readonly capabilities?: Record<string, unknown>
}

// ============================================================================
// HEALTH MONITORING API
// ============================================================================

/**
 * Health check request
 */
export interface HealthCheckRequest {
  readonly serverId: string
  readonly timeout?: number
  readonly includeDetails?: boolean
}

/**
 * Health check response
 */
export interface HealthCheckResponse extends ApiResponse<HealthCheckResult> {}

/**
 * Health check result
 */
export interface HealthCheckResult {
  readonly serverId: string
  readonly status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown'
  readonly responseTime: number
  readonly timestamp: string // ISO 8601
  readonly error?: string
  readonly details?: {
    readonly connectionTime: number
    readonly toolsListTime: number
    readonly resourcesListTime: number
    readonly memoryUsage?: number
    readonly cpuUsage?: number
  }
}

/**
 * Bulk health check response
 */
export interface BulkHealthCheckResponse extends ApiResponse<readonly HealthCheckResult[]> {}

/**
 * Health metrics request
 */
export interface HealthMetricsRequest {
  readonly serverId: string
  readonly period: '1h' | '24h' | '7d' | '30d'
}

/**
 * Health metrics response
 */
export interface HealthMetricsResponse extends ApiResponse<HealthMetricsData> {}

/**
 * Health metrics data
 */
export interface HealthMetricsData {
  readonly serverId: string
  readonly period: '1h' | '24h' | '7d' | '30d'
  readonly uptime: number // percentage
  readonly averageResponseTime: number
  readonly totalChecks: number
  readonly failedChecks: number
  readonly lastCheck: string // ISO 8601
  readonly dataPoints: readonly {
    readonly timestamp: string // ISO 8601
    readonly status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown'
    readonly responseTime: number
  }[]
}

// ============================================================================
// REVIEWS API
// ============================================================================

/**
 * Create review request
 */
export interface CreateReviewRequest {
  readonly serverId: string
  readonly rating: 1 | 2 | 3 | 4 | 5
  readonly title: string
  readonly content: string
}

/**
 * Create review response
 */
export interface CreateReviewResponse extends ApiResponse<ReviewData> {}

/**
 * Get reviews request
 */
export interface GetReviewsRequest extends PaginationParams, SortParams {
  readonly serverId: string
  readonly rating?: 1 | 2 | 3 | 4 | 5
  readonly verified?: boolean
}

/**
 * Get reviews response
 */
export interface GetReviewsResponse extends PaginatedResponse<ReviewData> {}

/**
 * Review data
 */
export interface ReviewData {
  readonly id: string
  readonly rating: 1 | 2 | 3 | 4 | 5
  readonly title: string
  readonly content: string
  readonly helpfulCount: number
  readonly isVerifiedPurchase: boolean
  readonly user: {
    readonly username: string
    readonly avatarUrl?: string
    readonly isVerified: boolean
    readonly reputationScore: number
  }
  readonly createdAt: string // ISO 8601
  readonly updatedAt: string // ISO 8601
}

// ============================================================================
// SEARCH API
// ============================================================================

/**
 * Search MCP servers request
 */
export interface SearchMcpsRequest extends PaginationParams {
  readonly query: string
  readonly filters?: SearchFilters
  readonly boost?: SearchBoostOptions
}

/**
 * Search filters
 */
export interface SearchFilters {
  readonly categories?: readonly string[]
  readonly tags?: readonly string[]
  readonly status?: readonly ('online' | 'offline' | 'degraded' | 'maintenance' | 'unknown')[]
  readonly verified?: boolean
  readonly minRating?: number
  readonly maxRating?: number
  readonly hasDocumentation?: boolean
  readonly installationMethods?: readonly ('npm' | 'pip' | 'docker' | 'binary' | 'source')[]
  readonly platforms?: readonly string[]
  readonly licenses?: readonly string[]
}

/**
 * Search boost options for relevance scoring
 */
export interface SearchBoostOptions {
  readonly name?: number        // Boost matches in name field
  readonly description?: number // Boost matches in description field
  readonly tags?: number       // Boost matches in tags field
  readonly verified?: number   // Boost verified servers
  readonly rating?: number     // Boost higher rated servers
  readonly popularity?: number // Boost popular servers
}

/**
 * Search MCP servers response
 */
export interface SearchMcpsResponse extends PaginatedResponse<SearchResult> {
  readonly query: string
  readonly executionTime: number // milliseconds
  readonly suggestions?: readonly string[]
  readonly facets: {
    readonly categories: readonly { name: string; count: number }[]
    readonly tags: readonly { tag: string; count: number }[]
    readonly statuses: readonly { status: string; count: number }[]
    readonly ratings: readonly { rating: number; count: number }[]
  }
}

/**
 * Search result item
 */
export interface SearchResult extends McpServerSummary {
  readonly relevanceScore: number
  readonly matchedFields: readonly string[]
  readonly highlights: {
    readonly name?: string
    readonly description?: string
    readonly tags?: readonly string[]
  }
}

// ============================================================================
// CATEGORIES API
// ============================================================================

/**
 * Get categories response
 */
export interface GetCategoriesResponse extends ApiResponse<readonly CategoryData[]> {}

/**
 * Category data
 */
export interface CategoryData {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly icon: string
  readonly color: string
  readonly serverCount: number
  readonly order: number
}

// ============================================================================
// STATISTICS API
// ============================================================================

/**
 * Get statistics response
 */
export interface GetStatsResponse extends ApiResponse<CatalogueStats> {}

/**
 * Catalogue statistics
 */
export interface CatalogueStats {
  readonly totalServers: number
  readonly onlineServers: number
  readonly verifiedServers: number
  readonly totalReviews: number
  readonly averageRating: number
  readonly categoriesCount: number
  readonly recentlyAdded: {
    readonly last24h: number
    readonly last7d: number
    readonly last30d: number
  }
  readonly healthSummary: {
    readonly healthy: number
    readonly degraded: number
    readonly unhealthy: number
    readonly unknown: number
  }
  readonly topCategories: readonly {
    readonly name: string
    readonly count: number
    readonly percentage: number
  }[]
  readonly platformDistribution: readonly {
    readonly platform: string
    readonly count: number
    readonly percentage: number
  }[]
}