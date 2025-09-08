/**
 * 🔢 CONSTANTS - CATALOGUE MCP
 * 
 * Constantes et énumérations pour l'application
 */

// ============================================================================
// MCP CATEGORIES
// ============================================================================
export const MCP_CATEGORIES = [
  'filesystem',
  'database', 
  'web',
  'ai',
  'cloud',
  'dev-tools',
  'communication',
  'productivity',
  'security',
  'monitoring',
  'other'
] as const

// ============================================================================
// HEALTH STATUSES
// ============================================================================
export const HEALTH_STATUSES = [
  'healthy',
  'unhealthy', 
  'degraded',
  'unknown'
] as const

// ============================================================================
// API ENDPOINTS
// ============================================================================
export const API_ENDPOINTS = {
  MCPS: '/api/mcps',
  MCP_DETAIL: (id: string) => `/api/mcps/${id}`,
  HEALTH_CHECK: (id: string) => `/api/mcps/${id}/health`,
  SEARCH: '/api/search',
  REVIEWS: '/api/reviews',
  CATEGORIES: '/api/categories',
  STATS: '/api/stats'
} as const

// ============================================================================
// UI CONSTANTS
// ============================================================================
export const SORT_OPTIONS = [
  'name-asc',
  'name-desc', 
  'rating-asc',
  'rating-desc',
  'updated-asc',
  'updated-desc',
  'popularity-asc',
  'popularity-desc',
  'health-asc',
  'health-desc'
] as const

export const VIEW_MODES = [
  'grid',
  'list', 
  'compact'
] as const

// ============================================================================
// ERROR CODES
// ============================================================================
export const ERROR_CODES = {
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_EXISTS: 'RESOURCE_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  
  // MCP specific errors
  MCP_CONNECTION_FAILED: 'MCP_CONNECTION_FAILED',
  MCP_TIMEOUT: 'MCP_TIMEOUT',
  MCP_PROTOCOL_ERROR: 'MCP_PROTOCOL_ERROR',
  
  // Health monitoring errors
  HEALTH_CHECK_FAILED: 'HEALTH_CHECK_FAILED',
  MONITORING_ERROR: 'MONITORING_ERROR'
} as const

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================
export const APP_CONFIG = {
  // Pagination defaults
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Health monitoring
  HEALTH_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes
  HEALTH_CHECK_TIMEOUT: 30 * 1000, // 30 seconds
  
  // Cache timeouts
  CACHE_TIMEOUT_SHORT: 5 * 60 * 1000, // 5 minutes
  CACHE_TIMEOUT_MEDIUM: 30 * 60 * 1000, // 30 minutes
  CACHE_TIMEOUT_LONG: 24 * 60 * 60 * 1000, // 24 hours
  
  // Rate limits
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  
  // File uploads
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // Search
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
  SEARCH_DEBOUNCE_MS: 300
} as const

// ============================================================================
// STATUS MAPPINGS
// ============================================================================
export const STATUS_COLORS = {
  online: 'green',
  offline: 'red',
  degraded: 'yellow', 
  maintenance: 'blue',
  unknown: 'gray'
} as const

export const STATUS_ICONS = {
  online: '🟢',
  offline: '🔴',
  degraded: '🟡',
  maintenance: '🔵', 
  unknown: '⚪'
} as const

// ============================================================================
// REGEX PATTERNS
// ============================================================================
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  GITHUB_URL: /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/,
  NPM_PACKAGE: /^[@a-z0-9-~][a-z0-9-._~]*\/[a-z0-9-~][a-z0-9-._~]*$|^[a-z0-9-~][a-z0-9-._~]*$/,
  SEMVER: /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)?$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
} as const

// ============================================================================
// FEATURE FLAGS
// ============================================================================
export const FEATURES = {
  HEALTH_MONITORING: true,
  REVIEW_SYSTEM: true,
  CLAUDE_CODE_INTEGRATION: true,
  REAL_TIME_UPDATES: false,
  ADVANCED_SEARCH: true,
  ANALYTICS: false,
  BETA_FEATURES: {
    SERVER_SUBMISSION: false,
    AI_RECOMMENDATIONS: false,
    PERFORMANCE_BENCHMARKS: false
  }
} as const