/**
 * 🔍 VALIDATION SCHEMAS AND TYPES
 * 
 * Zod schemas for runtime validation and type inference.
 * Provides compile-time types and runtime validation for all data structures.
 */

import { z } from 'zod'

// ============================================================================
// COMMON VALIDATION UTILITIES
// ============================================================================

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid()

/**
 * URL validation schema
 */
export const urlSchema = z.string().url()

/**
 * Email validation schema
 */
export const emailSchema = z.string().email()

/**
 * ISO 8601 timestamp schema
 */
export const timestampSchema = z.string().datetime()

/**
 * Semantic version schema (semver)
 */
export const versionSchema = z.string().regex(/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)?$/)

/**
 * Non-empty string schema
 */
export const nonEmptyStringSchema = z.string().min(1).trim()

/**
 * Slug schema (URL-friendly identifier)
 */
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

/**
 * Rating schema (1-5 stars)
 */
export const ratingSchema = z.number().int().min(1).max(5)

/**
 * Percentage schema (0-100)
 */
export const percentageSchema = z.number().min(0).max(100)

/**
 * Positive integer schema
 */
export const positiveIntSchema = z.number().int().positive()

/**
 * Non-negative integer schema
 */
export const nonNegativeIntSchema = z.number().int().min(0)

// ============================================================================
// MCP SERVER VALIDATION SCHEMAS
// ============================================================================

/**
 * MCP server category enum
 */
export const mcpCategorySchema = z.enum([
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
])

/**
 * MCP server status enum
 */
export const mcpStatusSchema = z.enum([
  'online',
  'offline',
  'degraded',
  'maintenance',
  'unknown'
])

/**
 * Installation method enum
 */
export const installationMethodSchema = z.enum([
  'npm',
  'pip',
  'docker',
  'binary',
  'source'
])

/**
 * Supported platform enum
 */
export const platformSchema = z.enum([
  'node',
  'python',
  'docker'
])

/**
 * Tool parameter schema
 */
export const toolParameterSchema = z.object({
  name: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  type: z.enum(['string', 'number', 'boolean', 'array', 'object']),
  required: z.boolean(),
  defaultValue: z.unknown().optional(),
  enum: z.array(z.unknown()).optional(),
  pattern: z.string().optional(),
  minimum: z.number().optional(),
  maximum: z.number().optional()
})

/**
 * Tool example schema
 */
export const toolExampleSchema = z.object({
  description: nonEmptyStringSchema,
  parameters: z.record(z.string(), z.unknown()),
  expectedResult: nonEmptyStringSchema
})

/**
 * MCP tool schema
 */
export const mcpToolSchema = z.object({
  name: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  parameters: z.array(toolParameterSchema),
  examples: z.array(toolExampleSchema).optional(),
  category: z.string().optional(),
  tags: z.array(nonEmptyStringSchema).optional(),
  riskLevel: z.enum(['safe', 'low', 'medium', 'high', 'dangerous']).optional(),
  rateLimited: z.boolean().optional(),
  requiresAuth: z.boolean().optional()
})

/**
 * MCP resource schema
 */
export const mcpResourceSchema = z.object({
  uri: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  type: z.enum(['file', 'directory', 'database', 'api', 'stream', 'other']),
  mimeType: z.string().optional(),
  size: nonNegativeIntSchema.optional(),
  lastModified: timestampSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  permissions: z.array(z.enum(['read', 'write', 'delete'])).optional()
})

/**
 * MCP capabilities schema
 */
export const mcpCapabilitiesSchema = z.object({
  tools: z.object({
    listChanged: z.boolean().optional()
  }).optional(),
  resources: z.object({
    subscribe: z.boolean().optional(),
    listChanged: z.boolean().optional()
  }).optional(),
  prompts: z.object({
    listChanged: z.boolean().optional()
  }).optional(),
  logging: z.object({
    level: z.enum(['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency']).optional()
  }).optional(),
  experimental: z.record(z.string(), z.unknown()).optional()
})

/**
 * MCP server configuration schema
 */
export const mcpServerConfigSchema = z.object({
  serverId: uuidSchema,
  name: nonEmptyStringSchema,
  command: nonEmptyStringSchema,
  args: z.array(z.string()),
  env: z.record(z.string(), z.string()).optional(),
  cwd: z.string().optional(),
  timeout: positiveIntSchema.optional(),
  retries: nonNegativeIntSchema.optional()
})

/**
 * Full MCP server schema
 */
export const mcpServerSchema = z.object({
  id: uuidSchema,
  name: nonEmptyStringSchema.max(100),
  description: nonEmptyStringSchema.max(1000),
  version: versionSchema,
  author: nonEmptyStringSchema.max(100),
  category: mcpCategorySchema,
  tags: z.array(slugSchema).max(10),
  
  // Repository and documentation
  repositoryUrl: urlSchema,
  documentationUrl: urlSchema.optional(),
  homepageUrl: urlSchema.optional(),
  licenseType: nonEmptyStringSchema.max(50),
  licenseUrl: urlSchema.optional(),
  
  // Installation
  installationMethod: installationMethodSchema,
  packageName: nonEmptyStringSchema.optional(),
  dockerImage: nonEmptyStringSchema.optional(),
  configurationSchema: z.record(z.string(), z.unknown()).optional(),
  
  // Runtime
  supportedPlatforms: z.array(platformSchema).min(1),
  minimumVersions: z.record(z.string(), z.string()).optional(),
  
  // MCP Protocol
  protocolVersion: versionSchema,
  capabilities: mcpCapabilitiesSchema,
  tools: z.array(mcpToolSchema).default([]),
  resources: z.array(mcpResourceSchema).default([]),
  
  // Status and metrics
  healthStatus: mcpStatusSchema,
  popularityScore: percentageSchema,
  qualityScore: percentageSchema,
  reviewCount: nonNegativeIntSchema,
  averageRating: z.number().min(0).max(5),
  
  // Verification
  isVerified: z.boolean(),
  isDeprecated: z.boolean(),
  deprecationNotice: z.string().max(500).optional(),
  securityAuditDate: timestampSchema.optional(),
  
  // Timestamps
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  lastHealthCheck: timestampSchema.optional()
})

// ============================================================================
// HEALTH CHECK VALIDATION SCHEMAS
// ============================================================================

/**
 * Health status enum
 */
export const healthStatusSchema = z.enum([
  'healthy',
  'unhealthy',
  'degraded',
  'unknown'
])

/**
 * Health check details schema
 */
export const healthCheckDetailsSchema = z.object({
  connectionTime: nonNegativeIntSchema,
  toolsListTime: nonNegativeIntSchema,
  resourcesListTime: nonNegativeIntSchema,
  memoryUsage: nonNegativeIntSchema.optional(),
  cpuUsage: percentageSchema.optional()
})

/**
 * Health check result schema
 */
export const healthCheckSchema = z.object({
  serverId: uuidSchema,
  timestamp: timestampSchema,
  status: healthStatusSchema,
  responseTime: nonNegativeIntSchema,
  error: z.string().optional(),
  details: healthCheckDetailsSchema
})

/**
 * Health metrics schema
 */
export const healthMetricsSchema = z.object({
  serverId: uuidSchema,
  period: z.enum(['1h', '24h', '7d', '30d']),
  uptime: percentageSchema,
  averageResponseTime: nonNegativeIntSchema,
  totalChecks: nonNegativeIntSchema,
  failedChecks: nonNegativeIntSchema,
  lastCheck: timestampSchema,
  trends: z.object({
    uptimeTrend: z.enum(['improving', 'stable', 'degrading']),
    performanceTrend: z.enum(['improving', 'stable', 'degrading'])
  })
})

// ============================================================================
// REVIEW VALIDATION SCHEMAS
// ============================================================================

/**
 * Review creation schema
 */
export const createReviewSchema = z.object({
  serverId: uuidSchema,
  rating: ratingSchema,
  title: nonEmptyStringSchema.max(100),
  content: nonEmptyStringSchema.min(10).max(2000)
})

/**
 * Review update schema
 */
export const updateReviewSchema = z.object({
  rating: ratingSchema.optional(),
  title: nonEmptyStringSchema.max(100).optional(),
  content: nonEmptyStringSchema.min(10).max(2000).optional()
})

/**
 * Full review schema
 */
export const reviewSchema = z.object({
  id: uuidSchema,
  serverId: uuidSchema,
  userId: uuidSchema,
  rating: ratingSchema,
  title: nonEmptyStringSchema.max(100),
  content: nonEmptyStringSchema.max(2000),
  helpfulCount: nonNegativeIntSchema,
  reportedCount: nonNegativeIntSchema,
  isVerifiedPurchase: z.boolean(),
  isModerated: z.boolean(),
  moderationReason: z.string().max(500).optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema
})

// ============================================================================
// API REQUEST/RESPONSE SCHEMAS
// ============================================================================

/**
 * Pagination parameters schema
 */
export const paginationSchema = z.object({
  page: positiveIntSchema.default(1),
  limit: z.number().int().min(1).max(100).default(20)
})

/**
 * Sort parameters schema
 */
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})

/**
 * Search filters schema
 */
export const searchFiltersSchema = z.object({
  categories: z.array(mcpCategorySchema).optional(),
  tags: z.array(slugSchema).optional(),
  status: z.array(mcpStatusSchema).optional(),
  verified: z.boolean().optional(),
  minRating: z.number().min(1).max(5).optional(),
  maxRating: z.number().min(1).max(5).optional(),
  hasDocumentation: z.boolean().optional(),
  installationMethods: z.array(installationMethodSchema).optional(),
  platforms: z.array(platformSchema).optional(),
  licenses: z.array(nonEmptyStringSchema).optional()
})

/**
 * Search request schema
 */
export const searchRequestSchema = paginationSchema.merge(z.object({
  query: nonEmptyStringSchema,
  filters: searchFiltersSchema.optional(),
  boost: z.object({
    name: z.number().positive().optional(),
    description: z.number().positive().optional(),
    tags: z.number().positive().optional(),
    verified: z.number().positive().optional(),
    rating: z.number().positive().optional(),
    popularity: z.number().positive().optional()
  }).optional()
}))

/**
 * Get servers request schema
 */
export const getServersRequestSchema = paginationSchema
  .merge(sortSchema)
  .merge(z.object({
    category: mcpCategorySchema.optional(),
    status: mcpStatusSchema.optional(),
    tags: z.array(slugSchema).optional(),
    search: z.string().optional(),
    verified: z.boolean().optional(),
    minRating: z.number().min(1).max(5).optional()
  }))

// ============================================================================
// FORM VALIDATION SCHEMAS
// ============================================================================

/**
 * MCP server submission form schema
 */
export const mcpSubmissionSchema = z.object({
  name: nonEmptyStringSchema.max(100),
  description: nonEmptyStringSchema.min(10).max(1000),
  version: versionSchema,
  author: nonEmptyStringSchema.max(100),
  categoryId: uuidSchema,
  tags: z.array(slugSchema).max(10),
  repositoryUrl: urlSchema,
  documentationUrl: urlSchema.optional(),
  homepageUrl: urlSchema.optional(),
  licenseType: nonEmptyStringSchema.max(50),
  licenseUrl: urlSchema.optional(),
  installationMethod: installationMethodSchema,
  packageName: nonEmptyStringSchema.optional(),
  dockerImage: nonEmptyStringSchema.optional(),
  supportedPlatforms: z.array(platformSchema).min(1)
})

/**
 * User preferences schema
 */
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  defaultView: z.enum(['grid', 'list', 'compact']).default('grid'),
  preferredSort: z.enum([
    'name-asc',
    'name-desc',
    'rating-asc',
    'rating-desc',
    'updated-asc',
    'updated-desc',
    'popularity-asc',
    'popularity-desc'
  ]).default('name-asc'),
  notifications: z.object({
    healthAlerts: z.boolean().default(true),
    newServers: z.boolean().default(false),
    reviews: z.boolean().default(false)
  })
})

// ============================================================================
// TYPE INFERENCE FROM SCHEMAS
// ============================================================================

// Export inferred types for use throughout the application
export type McpServerSchema = z.infer<typeof mcpServerSchema>
export type CreateReviewSchema = z.infer<typeof createReviewSchema>
export type UpdateReviewSchema = z.infer<typeof updateReviewSchema>
export type ReviewSchema = z.infer<typeof reviewSchema>
export type HealthCheckSchema = z.infer<typeof healthCheckSchema>
export type HealthMetricsSchema = z.infer<typeof healthMetricsSchema>
export type SearchRequestSchema = z.infer<typeof searchRequestSchema>
export type SearchFiltersSchema = z.infer<typeof searchFiltersSchema>
export type GetServersRequestSchema = z.infer<typeof getServersRequestSchema>
export type McpSubmissionSchema = z.infer<typeof mcpSubmissionSchema>
export type UserPreferencesSchema = z.infer<typeof userPreferencesSchema>
export type PaginationSchema = z.infer<typeof paginationSchema>
export type SortSchema = z.infer<typeof sortSchema>

// ============================================================================
// VALIDATION RESULT TYPES
// ============================================================================

/**
 * Generic validation result
 */
export interface ValidationResult<T> {
  readonly success: boolean
  readonly data?: T
  readonly errors?: readonly {
    readonly path: readonly (string | number)[]
    readonly code: string
    readonly message: string
    readonly expected?: string
    readonly received?: string
  }[]
}

/**
 * Field-specific error
 */
export interface FieldError {
  readonly field: string
  readonly message: string
  readonly code: string
  readonly value?: unknown
}

/**
 * Form validation errors
 */
export interface FormErrors {
  [field: string]: string | undefined
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Transform Zod errors to field errors
 */
export function transformZodErrors(zodErrors: z.ZodError): readonly FieldError[] {
  return zodErrors.errors.map(error => ({
    field: error.path.join('.'),
    message: error.message,
    code: error.code,
    value: undefined // ZodError doesn't expose input value directly
  }))
}

/**
 * Transform Zod errors to form errors object
 */
export function transformToFormErrors(zodErrors: z.ZodError): FormErrors {
  const errors: FormErrors = {}
  
  for (const error of zodErrors.errors) {
    const field = error.path.join('.')
    if (!errors[field]) {
      errors[field] = error.message
    }
  }
  
  return errors
}

/**
 * Validate data against schema
 */
export function validateData<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): ValidationResult<T> {
  try {
    const validated = schema.parse(data)
    return {
      success: true,
      data: validated
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          path: err.path,
          code: err.code,
          message: err.message
        }))
      }
    }
    
    return {
      success: false,
      errors: [{
        path: [],
        code: 'unknown_error',
        message: 'An unknown validation error occurred'
      }]
    }
  }
}