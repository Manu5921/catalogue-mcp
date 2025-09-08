/**
 * 🗄️ DATABASE TYPES
 * 
 * Type definitions for database schema and operations.
 * Includes both Supabase generated types and custom database models.
 * 
 * This file will be auto-generated from Supabase schema using:
 * pnpm db:generate
 */

// ============================================================================
// SUPABASE GENERATED TYPES (PLACEHOLDER)
// ============================================================================
// Note: These will be auto-generated from actual database schema

export interface Database {
  public: {
    Tables: {
      mcp_servers: {
        Row: DbMcpServer
        Insert: DbMcpServerInsert
        Update: DbMcpServerUpdate
      }
      health_checks: {
        Row: DbHealthCheck
        Insert: DbHealthCheckInsert
        Update: DbHealthCheckUpdate
      }
      reviews: {
        Row: DbReview
        Insert: DbReviewInsert
        Update: DbReviewUpdate
      }
      users: {
        Row: DbUser
        Insert: DbUserInsert
        Update: DbUserUpdate
      }
      server_categories: {
        Row: DbServerCategory
        Insert: DbServerCategoryInsert
        Update: DbServerCategoryUpdate
      }
      server_tools: {
        Row: DbServerTool
        Insert: DbServerToolInsert
        Update: DbServerToolUpdate
      }
      server_resources: {
        Row: DbServerResource
        Insert: DbServerResourceInsert
        Update: DbServerResourceUpdate
      }
    }
    Views: {
      server_stats: {
        Row: DbServerStats
      }
      health_summaries: {
        Row: DbHealthSummary
      }
    }
    Functions: {
      calculate_server_score: {
        Args: { server_id: string }
        Returns: number
      }
      get_server_uptime: {
        Args: { server_id: string; period: string }
        Returns: number
      }
    }
  }
}

// Convenience type aliases
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// ============================================================================
// MCP SERVERS TABLE
// ============================================================================

export interface DbMcpServer {
  id: string
  name: string
  description: string
  version: string
  author: string
  category_id: string
  tags: string[]
  
  // Repository and documentation
  repository_url: string
  documentation_url: string | null
  homepage_url: string | null
  license_type: string
  license_url: string | null
  
  // Installation
  installation_method: 'npm' | 'pip' | 'docker' | 'binary' | 'source'
  package_name: string | null
  docker_image: string | null
  configuration_schema: Record<string, unknown> | null
  
  // Runtime
  supported_platforms: string[]
  minimum_versions: Record<string, string> | null
  
  // MCP Protocol
  protocol_version: string
  capabilities: Record<string, unknown>
  
  // Status and metrics
  health_status: 'online' | 'offline' | 'degraded' | 'maintenance' | 'unknown'
  popularity_score: number
  quality_score: number
  review_count: number
  average_rating: number
  
  // Verification
  is_verified: boolean
  is_deprecated: boolean
  deprecation_notice: string | null
  security_audit_date: string | null
  
  // Timestamps
  created_at: string
  updated_at: string
  last_health_check: string | null
}

export interface DbMcpServerInsert {
  id?: string
  name: string
  description: string
  version: string
  author: string
  category_id: string
  tags?: string[]
  repository_url: string
  documentation_url?: string | null
  homepage_url?: string | null
  license_type: string
  license_url?: string | null
  installation_method: 'npm' | 'pip' | 'docker' | 'binary' | 'source'
  package_name?: string | null
  docker_image?: string | null
  configuration_schema?: Record<string, unknown> | null
  supported_platforms: string[]
  minimum_versions?: Record<string, string> | null
  protocol_version: string
  capabilities: Record<string, unknown>
  health_status?: 'online' | 'offline' | 'degraded' | 'maintenance' | 'unknown'
  popularity_score?: number
  quality_score?: number
  is_verified?: boolean
  is_deprecated?: boolean
  deprecation_notice?: string | null
  security_audit_date?: string | null
}

export interface DbMcpServerUpdate {
  name?: string
  description?: string
  version?: string
  author?: string
  category_id?: string
  tags?: string[]
  repository_url?: string
  documentation_url?: string | null
  homepage_url?: string | null
  license_type?: string
  license_url?: string | null
  installation_method?: 'npm' | 'pip' | 'docker' | 'binary' | 'source'
  package_name?: string | null
  docker_image?: string | null
  configuration_schema?: Record<string, unknown> | null
  supported_platforms?: string[]
  minimum_versions?: Record<string, string> | null
  protocol_version?: string
  capabilities?: Record<string, unknown>
  health_status?: 'online' | 'offline' | 'degraded' | 'maintenance' | 'unknown'
  popularity_score?: number
  quality_score?: number
  is_verified?: boolean
  is_deprecated?: boolean
  deprecation_notice?: string | null
  security_audit_date?: string | null
  updated_at?: string
}

// ============================================================================
// HEALTH CHECKS TABLE
// ============================================================================

export interface DbHealthCheck {
  id: string
  server_id: string
  timestamp: string
  status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown'
  response_time: number
  error_message: string | null
  details: {
    connection_time: number
    tools_list_time: number
    resources_list_time: number
    memory_usage?: number
    cpu_usage?: number
  }
  created_at: string
}

export interface DbHealthCheckInsert {
  id?: string
  server_id: string
  timestamp: string
  status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown'
  response_time: number
  error_message?: string | null
  details: {
    connection_time: number
    tools_list_time: number
    resources_list_time: number
    memory_usage?: number
    cpu_usage?: number
  }
}

export interface DbHealthCheckUpdate {
  status?: 'healthy' | 'unhealthy' | 'degraded' | 'unknown'
  response_time?: number
  error_message?: string | null
  details?: {
    connection_time: number
    tools_list_time: number
    resources_list_time: number
    memory_usage?: number
    cpu_usage?: number
  }
}

// ============================================================================
// REVIEWS TABLE
// ============================================================================

export interface DbReview {
  id: string
  server_id: string
  user_id: string
  rating: number // 1-5
  title: string
  content: string
  helpful_count: number
  reported_count: number
  is_verified_purchase: boolean
  is_moderated: boolean
  moderation_reason: string | null
  created_at: string
  updated_at: string
}

export interface DbReviewInsert {
  id?: string
  server_id: string
  user_id: string
  rating: number
  title: string
  content: string
  is_verified_purchase?: boolean
}

export interface DbReviewUpdate {
  rating?: number
  title?: string
  content?: string
  helpful_count?: number
  reported_count?: number
  is_moderated?: boolean
  moderation_reason?: string | null
  updated_at?: string
}

// ============================================================================
// USERS TABLE
// ============================================================================

export interface DbUser {
  id: string
  email: string
  username: string
  full_name: string | null
  avatar_url: string | null
  github_username: string | null
  is_verified: boolean
  reputation_score: number
  review_count: number
  last_active_at: string | null
  created_at: string
  updated_at: string
}

export interface DbUserInsert {
  id: string // Supabase auth user ID
  email: string
  username: string
  full_name?: string | null
  avatar_url?: string | null
  github_username?: string | null
}

export interface DbUserUpdate {
  username?: string
  full_name?: string | null
  avatar_url?: string | null
  github_username?: string | null
  last_active_at?: string | null
  updated_at?: string
}

// ============================================================================
// SUPPORTING TABLES
// ============================================================================

export interface DbServerCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  order: number
  created_at: string
}

export interface DbServerCategoryInsert {
  id?: string
  name: string
  description: string
  icon: string
  color: string
  order: number
}

export interface DbServerCategoryUpdate {
  name?: string
  description?: string
  icon?: string
  color?: string
  order?: number
}

export interface DbServerTool {
  id: string
  server_id: string
  name: string
  description: string
  parameters: Record<string, unknown>[]
  examples: Record<string, unknown>[] | null
  category: string | null
  risk_level: 'safe' | 'low' | 'medium' | 'high' | 'dangerous'
  rate_limited: boolean
  requires_auth: boolean
  created_at: string
}

export interface DbServerToolInsert {
  id?: string
  server_id: string
  name: string
  description: string
  parameters: Record<string, unknown>[]
  examples?: Record<string, unknown>[] | null
  category?: string | null
  risk_level?: 'safe' | 'low' | 'medium' | 'high' | 'dangerous'
  rate_limited?: boolean
  requires_auth?: boolean
}

export interface DbServerToolUpdate {
  name?: string
  description?: string
  parameters?: Record<string, unknown>[]
  examples?: Record<string, unknown>[] | null
  category?: string | null
  risk_level?: 'safe' | 'low' | 'medium' | 'high' | 'dangerous'
  rate_limited?: boolean
  requires_auth?: boolean
}

export interface DbServerResource {
  id: string
  server_id: string
  uri: string
  name: string
  description: string
  type: 'file' | 'directory' | 'database' | 'api' | 'stream' | 'other'
  mime_type: string | null
  size: number | null
  permissions: string[]
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface DbServerResourceInsert {
  id?: string
  server_id: string
  uri: string
  name: string
  description: string
  type: 'file' | 'directory' | 'database' | 'api' | 'stream' | 'other'
  mime_type?: string | null
  size?: number | null
  permissions: string[]
  metadata?: Record<string, unknown> | null
}

export interface DbServerResourceUpdate {
  uri?: string
  name?: string
  description?: string
  type?: 'file' | 'directory' | 'database' | 'api' | 'stream' | 'other'
  mime_type?: string | null
  size?: number | null
  permissions?: string[]
  metadata?: Record<string, unknown> | null
}

// ============================================================================
// DATABASE VIEWS
// ============================================================================

export interface DbServerStats {
  server_id: string
  total_reviews: number
  average_rating: number
  health_uptime_7d: number
  health_uptime_30d: number
  last_health_check: string | null
  popularity_rank: number
  category_name: string
}

export interface DbHealthSummary {
  server_id: string
  period: '1h' | '24h' | '7d' | '30d'
  uptime_percentage: number
  average_response_time: number
  total_checks: number
  failed_checks: number
  last_check_status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown'
  last_check_time: string
}

// ============================================================================
// RELATIONSHIP TYPES
// ============================================================================

export interface McpServerWithReviews extends DbMcpServer {
  reviews: DbReview[]
  category: DbServerCategory
}

export interface McpServerWithHealth extends DbMcpServer {
  health_checks: DbHealthCheck[]
  health_summary: DbHealthSummary
  category: DbServerCategory
}

export interface ReviewWithUser extends DbReview {
  user: Pick<DbUser, 'username' | 'avatar_url' | 'is_verified' | 'reputation_score'>
}

export interface ServerWithFullDetails extends DbMcpServer {
  category: DbServerCategory
  tools: DbServerTool[]
  resources: DbServerResource[]
  reviews: ReviewWithUser[]
  health_checks: DbHealthCheck[]
  health_summary: DbHealthSummary
}

// ============================================================================
// QUERY RESULT TYPES
// ============================================================================

export interface ServerSearchResult {
  servers: McpServerWithReviews[]
  total_count: number
  facets: {
    categories: { name: string; count: number }[]
    health_statuses: { status: string; count: number }[]
    ratings: { rating: number; count: number }[]
  }
}

export interface PopularServersResult {
  trending: DbMcpServer[]
  top_rated: DbMcpServer[]
  most_reviewed: DbMcpServer[]
  recently_added: DbMcpServer[]
}

// ============================================================================
// DATABASE OPERATION TYPES
// ============================================================================

export interface DatabaseError {
  code: string
  message: string
  details: string | null
  hint: string | null
}

export interface QueryOptions {
  limit?: number
  offset?: number
  order_by?: string
  order_direction?: 'asc' | 'desc'
  filters?: Record<string, unknown>
}