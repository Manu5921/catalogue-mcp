/**
 * 🛡️ TYPE GUARDS - CATALOGUE MCP
 * 
 * Fonctions de vérification de types pour la sécurité runtime
 */

import { HEALTH_STATUSES, MCP_CATEGORIES } from '@/constants'
import type { ApiError, PaginatedResponse } from '@/types/api'
import type { 
  McpServer, 
  HealthStatus,
  McpServerCategory 
} from '@/types/mcp'

// ============================================================================
// MCP TYPE GUARDS
// ============================================================================

/**
 * Vérifie si un objet est un serveur MCP valide
 */
export function isMcpServer(obj: unknown): obj is McpServer {
  if (!obj || typeof obj !== 'object') return false
  
  const server = obj as Record<string, unknown>
  
  return (
    typeof server.id === 'string' &&
    typeof server.name === 'string' &&
    typeof server.description === 'string' &&
    typeof server.version === 'string' &&
    typeof server.author === 'string' &&
    typeof server.category === 'string' &&
    Array.isArray(server.tags) &&
    typeof server.repositoryUrl === 'string' &&
    typeof server.protocolVersion === 'string' &&
    typeof server.healthStatus === 'string' &&
    isValidHealthStatus(server.healthStatus)
  )
}

/**
 * Vérifie si une valeur est un status de santé valide
 */
export function isValidHealthStatus(status: unknown): status is HealthStatus {
  return typeof status === 'string' && 
    (HEALTH_STATUSES as readonly string[]).includes(status)
}

/**
 * Vérifie si un status est "healthy"
 */
export function isHealthyStatus(status: HealthStatus): status is 'healthy' {
  return status === 'healthy'
}

/**
 * Vérifie si une catégorie MCP est valide
 */
export function isValidMcpCategory(category: unknown): category is McpServerCategory {
  return typeof category === 'string' && 
    (MCP_CATEGORIES as readonly string[]).includes(category)
}

// ============================================================================
// API TYPE GUARDS
// ============================================================================

/**
 * Vérifie si un objet est une erreur API
 */
export function isApiError(obj: unknown): obj is ApiError {
  if (!obj || typeof obj !== 'object') return false
  
  const error = obj as Record<string, unknown>
  
  return (
    error.success === false &&
    typeof error.error === 'object' &&
    error.error !== null &&
    typeof (error.error as Record<string, unknown>).code === 'string' &&
    typeof (error.error as Record<string, unknown>).message === 'string'
  )
}

/**
 * Vérifie si un objet est une réponse paginée
 */
export function isPaginatedResponse<T = unknown>(obj: unknown): obj is PaginatedResponse<T> {
  if (!obj || typeof obj !== 'object') return false
  
  const response = obj as Record<string, unknown>
  
  return (
    response.success === true &&
    Array.isArray(response.data) &&
    typeof response.pagination === 'object' &&
    response.pagination !== null &&
    typeof (response.pagination as Record<string, unknown>).page === 'number' &&
    typeof (response.pagination as Record<string, unknown>).limit === 'number' &&
    typeof (response.pagination as Record<string, unknown>).total === 'number'
  )
}

// ============================================================================
// VALIDATION TYPE GUARDS
// ============================================================================

/**
 * Vérifie si un rating est valide (1-5)
 */
export function isValidReviewRating(rating: unknown): rating is 1 | 2 | 3 | 4 | 5 {
  return typeof rating === 'number' && 
    Number.isInteger(rating) && 
    rating >= 1 && 
    rating <= 5
}

/**
 * Vérifie si une URL est valide
 */
export function isValidUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false
  
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Vérifie si un email est valide
 */
export function isValidEmail(email: unknown): email is string {
  if (typeof email !== 'string') return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Vérifie si un UUID est valide
 */
export function isValidUuid(uuid: unknown): uuid is string {
  if (typeof uuid !== 'string') return false
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Vérifie si une version semver est valide
 */
export function isValidSemver(version: unknown): version is string {
  if (typeof version !== 'string') return false
  
  const semverRegex = /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)?$/
  return semverRegex.test(version)
}

// ============================================================================
// UTILITY TYPE GUARDS
// ============================================================================

/**
 * Vérifie si une valeur n'est pas null ou undefined
 */
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Vérifie si une valeur est une string non vide
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Vérifie si une valeur est un nombre positif
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && value > 0
}

/**
 * Vérifie si une valeur est un nombre entier positif
 */
export function isPositiveInteger(value: unknown): value is number {
  return isPositiveNumber(value) && Number.isInteger(value)
}

/**
 * Vérifie si un objet a une propriété spécifique
 */
export function hasProperty<T extends string>(
  obj: unknown, 
  prop: T
): obj is Record<T, unknown> {
  return typeof obj === 'object' && obj !== null && prop in obj
}

/**
 * Vérifie si un tableau contient au moins un élément
 */
export function isNonEmptyArray<T>(arr: T[]): arr is [T, ...T[]] {
  return Array.isArray(arr) && arr.length > 0
}

// ============================================================================
// COMPLEX TYPE GUARDS
// ============================================================================

/**
 * Vérifie si un objet est un serveur MCP avec santé
 */
export function isMcpServerWithHealth(obj: unknown): obj is McpServer & { 
  lastHealthCheck: string;
  uptime: number;
} {
  return (
    isMcpServer(obj) &&
    hasProperty(obj, 'lastHealthCheck') &&
    hasProperty(obj, 'uptime') &&
    typeof obj.lastHealthCheck === 'string' &&
    typeof obj.uptime === 'number'
  )
}

/**
 * Type guard générique pour les objets avec ID
 */
export function hasId(obj: unknown): obj is { id: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    hasProperty(obj, 'id') &&
    typeof obj.id === 'string'
  )
}