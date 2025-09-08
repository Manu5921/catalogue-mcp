/**
 * 🏷️ TYPE DEFINITIONS HUB - CATALOGUE MCP
 * 
 * Central hub for all TypeScript definitions following E2-Types First methodology.
 * This file serves as the main entry point for type imports throughout the application.
 * 
 * Architecture: Barrel exports pattern for clean imports
 * Example: import { McpServer, HealthStatus } from '@/types'
 */

// ============================================================================
// MCP CORE TYPES
// ============================================================================
export type {
  // Server and connection types
  McpServer,
  McpServerStatus,
  McpServerCategory,
  McpServerConfig,
  McpConnection,
  McpCapabilities,
  
  // Tools and resources
  McpTool,
  McpResource,
  McpPrompt,
  McpToolParameter,
  McpResourceType,
  
  // Health monitoring
  HealthStatus,
  HealthCheck,
  HealthMetrics,
  UptimeData,
  PerformanceMetrics,
  
  // Server metadata
  ServerManifest,
  ServerDocumentation,
  ServerExample,
  InstallationGuide,
} from './mcp'

// ============================================================================
// DATABASE TYPES
// ============================================================================
export type {
  // Supabase generated types
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  
  // Custom database types
  DbMcpServer,
  DbHealthCheck,
  DbReview,
  DbUser,
  
  // Relationships
  McpServerWithReviews,
  McpServerWithHealth,
  ReviewWithUser,
} from './database'

// ============================================================================
// API TYPES
// ============================================================================
export type {
  // Request/Response patterns
  ApiResponse,
  ApiError,
  PaginatedResponse,
  
  // MCP API endpoints
  GetMcpsResponse,
  GetMcpResponse,
  CreateMcpRequest,
  UpdateMcpRequest,
  
  // Health API endpoints
  HealthCheckRequest,
  HealthCheckResponse,
  BulkHealthCheckResponse,
  
  // Review API endpoints
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewsResponse,
  
  // Search API
  SearchMcpsRequest,
  SearchMcpsResponse,
  SearchFilters,
} from './api'

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================
export type {
  // Form types
  McpSearchForm,
  McpFilterForm,
  ReviewSubmissionForm,
  
  // Component props
  McpCardProps,
  McpDetailProps,
  HealthBadgeProps,
  ReviewListProps,
  
  // State management
  CatalogueState,
  FilterState,
  SearchState,
  
  // UI utilities
  SortOption,
  ViewMode,
  LoadingState,
} from './ui'

// ============================================================================
// UTILITY TYPES
// ============================================================================
export type {
  // Generic utilities
  Prettify,
  Optional,
  RequiredFields,
  PartialFields,
  
  // API utilities
  WithPagination,
  WithTimestamps,
  WithMetadata,
  
  // Error handling
  ErrorType,
  ValidationError,
  DatabaseError,
  
  // Environment
  AppConfig,
  FeatureFlags,
} from './utils'

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
export type {
  // Zod inferred types
  McpServerSchema,
  ReviewSchema,
  SearchRequestSchema,
  
  // Validation results
  ValidationResult,
  FieldError,
} from './validation'

// ============================================================================
// CONSTANTS & ENUMS
// ============================================================================
export {
  // MCP Categories
  MCP_CATEGORIES,
  
  // Health statuses
  HEALTH_STATUSES,
  
  // API endpoints
  API_ENDPOINTS,
  
  // UI constants
  SORT_OPTIONS,
  VIEW_MODES,
  
  // Error codes
  ERROR_CODES,
} from '../constants'

// ============================================================================
// TYPE GUARDS
// ============================================================================
export {
  // MCP type guards
  isMcpServer,
  isValidHealthStatus,
  isHealthyStatus,
  
  // API type guards
  isApiError,
  isPaginatedResponse,
  
  // Validation guards
  isValidMcpCategory,
  isValidReviewRating,
} from '../utils/type-guards'

// ============================================================================
// GLOBAL TYPES
// ============================================================================

/**
 * Global application configuration
 */
export interface GlobalConfig {
  readonly app: {
    name: string
    version: string
    description: string
    author: string
  }
  readonly features: {
    healthMonitoring: boolean
    reviewSystem: boolean
    claudeCodeIntegration: boolean
    realTimeUpdates: boolean
  }
  readonly limits: {
    maxServersPerPage: number
    maxReviewsPerServer: number
    healthCheckInterval: number
    cacheTimeout: number
  }
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  readonly theme: 'light' | 'dark' | 'system'
  readonly defaultView: 'grid' | 'list' | 'compact'
  readonly preferredSort: 'name-asc' | 'name-desc' | 'rating-asc' | 'rating-desc' | 'updated-asc' | 'updated-desc' | 'popularity-asc' | 'popularity-desc'
  readonly notifications: {
    healthAlerts: boolean
    newServers: boolean
    reviews: boolean
  }
}

/**
 * Application-wide error boundary props
 */
export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}