/**
 * 🛡️ SECURE API ERROR HANDLING
 * 
 * Implements Gemini Recommendation 4: Secure error handling that logs details
 * server-side but only returns safe, generic messages to clients
 */

import { NextResponse } from 'next/server'

export interface ApiError {
  code: string
  message: string
  statusCode: number
  timestamp: string
}

export interface ApiErrorResponse {
  success: false
  error: ApiError
}

/**
 * 🛡️ GEMINI RECOMMENDATION 4: Secure error response
 * 
 * - Logs complete error details server-side (for debugging)
 * - Returns only safe, generic messages to client (prevents info disclosure)
 * - Includes structured error codes for client handling
 */
export function createSecureErrorResponse(
  error: unknown,
  context: string,
  statusCode: number = 500,
  clientMessage?: string
): NextResponse<ApiErrorResponse> {
  
  // 📋 LOG FULL DETAILS SERVER-SIDE (for debugging)
  const errorDetails = error instanceof Error 
    ? { name: error.name, message: error.message, stack: error.stack }
    : { raw: String(error) }
    
  console.error(`[API_ERROR] ${context}:`, {
    ...errorDetails,
    timestamp: new Date().toISOString(),
    statusCode,
  })
  
  // 🔒 RETURN SAFE MESSAGE TO CLIENT (prevents info leakage)
  const safeErrorCodes = {
    400: 'INVALID_REQUEST',
    401: 'UNAUTHORIZED', 
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    429: 'RATE_LIMITED',
    500: 'INTERNAL_ERROR',
    502: 'SERVICE_UNAVAILABLE',
    503: 'SERVICE_UNAVAILABLE',
  } as const
  
  const safeMessages = {
    400: 'The request is invalid or malformed',
    401: 'Authentication is required',
    403: 'Access to this resource is forbidden',
    404: 'The requested resource was not found',
    429: 'Too many requests. Please try again later',
    500: 'An internal server error occurred',
    502: 'The service is temporarily unavailable',
    503: 'The service is temporarily unavailable',
  } as const
  
  const errorCode = safeErrorCodes[statusCode as keyof typeof safeErrorCodes] || 'UNKNOWN_ERROR'
  const defaultMessage = safeMessages[statusCode as keyof typeof safeMessages] || 'An unknown error occurred'
  
  return NextResponse.json({
    success: false,
    error: {
      code: errorCode,
      message: clientMessage || defaultMessage,
      statusCode,
      timestamp: new Date().toISOString(),
    }
  }, { status: statusCode })
}

/**
 * Specific error types for common scenarios
 */
export const ApiErrorTypes = {
  // Authentication/Authorization
  UNAUTHORIZED: (context: string) => 
    createSecureErrorResponse(new Error('Unauthorized'), context, 401, 'Authentication required'),
  
  FORBIDDEN: (context: string) => 
    createSecureErrorResponse(new Error('Forbidden'), context, 403, 'Access forbidden'),
  
  // Resource errors
  NOT_FOUND: (context: string, resource?: string) => 
    createSecureErrorResponse(
      new Error(`${resource || 'Resource'} not found`), 
      context, 
      404, 
      `${resource || 'Resource'} not found`
    ),
  
  // Input validation
  INVALID_REQUEST: (context: string, details?: string) => 
    createSecureErrorResponse(
      new Error(`Invalid request: ${details}`), 
      context, 
      400, 
      'Invalid request parameters'
    ),
  
  // Service errors
  SERVICE_ERROR: (context: string, error: unknown) => 
    createSecureErrorResponse(error, context, 500, 'Service temporarily unavailable'),
    
  // Rate limiting
  RATE_LIMITED: (context: string) => 
    createSecureErrorResponse(
      new Error('Rate limit exceeded'), 
      context, 
      429, 
      'Too many requests. Please try again later'
    ),
} as const

/**
 * Type guard for API errors
 */
export function isApiError(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false &&
    'error' in response
  )
}

/**
 * Async wrapper that automatically handles errors
 */
export async function withSecureErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T | NextResponse<ApiErrorResponse>> {
  try {
    return await operation()
  } catch (error) {
    return ApiErrorTypes.SERVICE_ERROR(context, error)
  }
}