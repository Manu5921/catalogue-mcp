/**
 * 🛠️ UTILITY TYPES
 * 
 * Generic utility types, error handling, and common type transformations.
 * Provides reusable type utilities across the application.
 */

// ============================================================================
// GENERIC UTILITY TYPES
// ============================================================================

/**
 * Makes a type more readable by flattening intersections
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

/**
 * Makes specified keys optional
 */
export type Optional<T, K extends keyof T> = Prettify<Omit<T, K> & Partial<Pick<T, K>>>

/**
 * Makes specified keys required
 */
export type RequiredFields<T, K extends keyof T> = Prettify<T & Required<Pick<T, K>>>

/**
 * Makes specified keys partial
 */
export type PartialFields<T, K extends keyof T> = Prettify<Omit<T, K> & Partial<Pick<T, K>>>

/**
 * Extracts the value type from an array type
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never

/**
 * Creates a union type from an object's values
 */
export type ValueOf<T> = T[keyof T]

/**
 * Creates a union type from an array's values
 */
export type ArrayToUnion<T extends readonly unknown[]> = T[number]

/**
 * Deep readonly type
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Exclude null and undefined from type
 */
export type NonNullable<T> = T extends null | undefined ? never : T

/**
 * Extract promise type
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

/**
 * Function parameter types
 */
export type Parameters<T> = T extends (...args: infer P) => unknown ? P : never

/**
 * Function return type
 */
export type ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : unknown

// ============================================================================
// API UTILITY TYPES
// ============================================================================

/**
 * Adds pagination metadata to a type
 */
export interface WithPagination<T> {
  readonly data: readonly T[]
  readonly pagination: {
    readonly page: number
    readonly limit: number
    readonly total: number
    readonly totalPages: number
    readonly hasNext: boolean
    readonly hasPrev: boolean
  }
}

/**
 * Adds timestamp fields to a type
 */
export type WithTimestamps<T> = T & {
  readonly createdAt: string // ISO 8601
  readonly updatedAt: string // ISO 8601
}

/**
 * Adds metadata fields to a type
 */
export type WithMetadata<T> = T & {
  readonly metadata: {
    readonly version: string
    readonly source: string
    readonly checksum?: string
    readonly tags?: readonly string[]
  }
}

/**
 * Adds soft delete capability
 */
export type WithSoftDelete<T> = T & {
  readonly deletedAt: string | null // ISO 8601
  readonly isDeleted: boolean
}

/**
 * API operation result wrapper
 */
export interface OperationResult<T> {
  readonly success: boolean
  readonly data?: T
  readonly error?: string
  readonly timestamp: string // ISO 8601
}

/**
 * Async operation state
 */
export interface AsyncState<T> {
  readonly data: T | null
  readonly loading: boolean
  readonly error: string | null
  readonly lastUpdated: string | null // ISO 8601
}

// ============================================================================
// ERROR HANDLING TYPES
// ============================================================================

/**
 * Error types enumeration
 */
export type ErrorType =
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'not_found'
  | 'conflict'
  | 'rate_limit'
  | 'server_error'
  | 'network_error'
  | 'timeout'
  | 'unknown'

/**
 * Structured error object
 */
export interface AppError {
  readonly type: ErrorType
  readonly message: string
  readonly code: string
  readonly details?: Record<string, unknown>
  readonly timestamp: string // ISO 8601
  readonly trace?: string
}

/**
 * Validation error details
 */
export interface ValidationError {
  readonly field: string
  readonly message: string
  readonly code: string
  readonly value?: unknown
}

/**
 * Database operation error
 */
export interface DatabaseError {
  readonly operation: 'select' | 'insert' | 'update' | 'delete'
  readonly table: string
  readonly constraint?: string
  readonly sqlState?: string
  readonly message: string
}

/**
 * Network request error
 */
export interface NetworkError {
  readonly url: string
  readonly method: string
  readonly status?: number
  readonly statusText?: string
  readonly timeout?: boolean
  readonly message: string
}

/**
 * Error boundary error info
 */
export interface ErrorInfo {
  readonly componentStack: string
  readonly errorBoundary?: string
  readonly eventType?: string
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Application configuration
 */
export interface AppConfig {
  readonly app: {
    readonly name: string
    readonly version: string
    readonly description: string
    readonly author: string
    readonly homepage: string
    readonly repository: string
  }
  readonly api: {
    readonly baseUrl: string
    readonly timeout: number
    readonly retries: number
    readonly rateLimit: {
      readonly requests: number
      readonly window: number // milliseconds
    }
  }
  readonly database: {
    readonly url: string
    readonly maxConnections: number
    readonly timeout: number
    readonly ssl: boolean
  }
  readonly cache: {
    readonly ttl: number // seconds
    readonly maxSize: number // bytes
    readonly compression: boolean
  }
  readonly monitoring: {
    readonly enabled: boolean
    readonly interval: number // milliseconds
    readonly timeout: number // milliseconds
    readonly retries: number
  }
  readonly features: FeatureFlags
}

/**
 * Feature flags configuration
 */
export interface FeatureFlags {
  readonly healthMonitoring: boolean
  readonly reviewSystem: boolean
  readonly claudeCodeIntegration: boolean
  readonly realTimeUpdates: boolean
  readonly advancedSearch: boolean
  readonly analytics: boolean
  readonly beta: {
    readonly serverSubmission: boolean
    readonly aiRecommendations: boolean
    readonly performanceBenchmarks: boolean
  }
}

/**
 * Environment variables type
 */
export interface Environment {
  readonly NODE_ENV: 'development' | 'test' | 'production'
  readonly NEXT_PUBLIC_SUPABASE_URL: string
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  readonly SUPABASE_SERVICE_KEY: string
  readonly DATABASE_URL: string
  readonly REDIS_URL?: string
  readonly SENTRY_DSN?: string
  readonly ANALYTICS_ID?: string
  readonly CLAUDE_CODE_API_KEY?: string
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Validation result wrapper
 */
export interface ValidationResult<T = unknown> {
  readonly success: boolean
  readonly data?: T
  readonly errors?: readonly ValidationError[]
}

/**
 * Field validation rule
 */
export interface ValidationRule {
  readonly field: string
  readonly required?: boolean
  readonly type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'url'
  readonly minLength?: number
  readonly maxLength?: number
  readonly min?: number
  readonly max?: number
  readonly pattern?: RegExp
  readonly enum?: readonly unknown[]
  readonly custom?: (value: unknown) => string | null
}

/**
 * Schema validation configuration
 */
export interface ValidationSchema {
  readonly rules: readonly ValidationRule[]
  readonly strict?: boolean
  readonly allowUnknown?: boolean
}

// ============================================================================
// QUERY AND FILTER TYPES
// ============================================================================

/**
 * Generic query parameters
 */
export interface QueryParams {
  readonly page?: number
  readonly limit?: number
  readonly sort?: string
  readonly order?: 'asc' | 'desc'
  readonly search?: string
  readonly filters?: Record<string, unknown>
}

/**
 * Filter operator types
 */
export type FilterOperator =
  | 'eq'        // equals
  | 'ne'        // not equals
  | 'gt'        // greater than
  | 'gte'       // greater than or equal
  | 'lt'        // less than
  | 'lte'       // less than or equal
  | 'in'        // in array
  | 'nin'       // not in array
  | 'contains'  // contains substring
  | 'starts'    // starts with
  | 'ends'      // ends with
  | 'regex'     // regular expression

/**
 * Filter condition
 */
export interface FilterCondition {
  readonly field: string
  readonly operator: FilterOperator
  readonly value: unknown
}

/**
 * Complex filter with logical operators
 */
export interface FilterExpression {
  readonly and?: readonly FilterExpression[]
  readonly or?: readonly FilterExpression[]
  readonly condition?: FilterCondition
}

// ============================================================================
// CACHE TYPES
// ============================================================================

/**
 * Cache entry metadata
 */
export interface CacheEntry<T> {
  readonly key: string
  readonly value: T
  readonly ttl: number // seconds
  readonly createdAt: string // ISO 8601
  readonly expiresAt: string // ISO 8601
  readonly hits: number
  readonly tags?: readonly string[]
}

/**
 * Cache operation options
 */
export interface CacheOptions {
  readonly ttl?: number // seconds
  readonly tags?: readonly string[]
  readonly version?: string
  readonly compress?: boolean
}

// ============================================================================
// PERFORMANCE TYPES
// ============================================================================

/**
 * Performance measurement
 */
export interface PerformanceMeasurement {
  readonly name: string
  readonly startTime: number
  readonly endTime: number
  readonly duration: number
  readonly metadata?: Record<string, unknown>
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  readonly requestId: string
  readonly timestamp: string // ISO 8601
  readonly measurements: readonly PerformanceMeasurement[]
  readonly totalDuration: number
  readonly memoryUsage?: {
    readonly used: number
    readonly total: number
    readonly percentage: number
  }
}

// ============================================================================
// TYPE GUARDS AND PREDICATES
// ============================================================================

/**
 * Type predicate function
 */
export type TypePredicate<T> = (value: unknown) => value is T

/**
 * Type guard result
 */
export interface TypeGuardResult<T> {
  readonly isValid: boolean
  readonly value?: T
  readonly error?: string
}

// ============================================================================
// BRANDED TYPES
// ============================================================================

/**
 * Brand type for creating nominal types
 */
declare const brand: unique symbol
export type Brand<T, B> = T & { readonly [brand]: B }

/**
 * Common branded types
 */
export type ServerId = Brand<string, 'ServerId'>
export type UserId = Brand<string, 'UserId'>
export type ReviewId = Brand<string, 'ReviewId'>
export type CategoryId = Brand<string, 'CategoryId'>
export type Email = Brand<string, 'Email'>
export type URL = Brand<string, 'URL'>
export type UUID = Brand<string, 'UUID'>
export type Timestamp = Brand<string, 'Timestamp'>

// ============================================================================
// CONDITIONAL TYPES
// ============================================================================

/**
 * Conditional type based on environment
 */
export type IfDevelopment<T, F = never> = 
  typeof process.env.NODE_ENV extends 'development' ? T : F

/**
 * Conditional type for optional fields in production
 */
export type ProductionOptional<T, K extends keyof T> = 
  typeof process.env.NODE_ENV extends 'production' 
    ? Optional<T, K> 
    : T