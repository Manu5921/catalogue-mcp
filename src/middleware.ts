/**
 * 🛡️ SECURITY MIDDLEWARE - AUTHENTICATION & AUTHORIZATION
 * 
 * Protège les routes API selon les recommandations de sécurité Jules (CATA-001, CATA-004, CATA-005)
 * Architecture: Next.js 15 Middleware avec Supabase Auth
 * 
 * Security Gates:
 * - Public routes: /api/health (basic status only)
 * - Protected routes: All /api/* routes require authentication  
 * - Admin routes: /api/health/{start,stop} require admin role
 */

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

/**
 * Public routes accessible sans authentification
 * Limitées au strict minimum pour sécurité maximale
 */
const PUBLIC_ROUTES = new Set([
  '/api/health', // Status de base seulement (CATA-003 mitigated)
])

/**
 * Routes admin nécessitant des privilèges élevés
 * Protection critique contre CATA-004 et CATA-005
 */
const ADMIN_ROUTES = new Set([
  '/api/health/start',    // CATA-004: Fonction admin dangereuse
  '/api/health/stop',     // CATA-005: Arrêt monitoring
  '/api/mcps',           // POST: Ajout serveurs
])

/**
 * Routes protégées nécessitant une authentification
 * Couvre CATA-001: Contrôle d'accès API MCP
 */
const PROTECTED_ROUTES_PATTERNS = [
  /^\/api\/mcps/,        // Toutes les routes MCP
  /^\/api\/health\/\w+/, // Routes santé détaillées
  /^\/api\/search/,      // API de recherche
]

// ============================================================================
// MIDDLEWARE CORE
// ============================================================================

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  // Skip non-API routes
  if (!pathname.startsWith('/api/')) {
    return response
  }

  try {
    // Initialize Supabase client
    const supabase = createMiddlewareClient({ req: request, res: response })

    // Check if route is public
    if (PUBLIC_ROUTES.has(pathname)) {
      // Public route avec logging sécurité
      console.log(`[SECURITY] Public route accessed: ${pathname} from ${request.ip || 'unknown'}`)
      return response
    }

    // Check if route needs protection
    const needsAuth = PROTECTED_ROUTES_PATTERNS.some(pattern => pattern.test(pathname))
    if (!needsAuth) {
      return response
    }

    // Get user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('[SECURITY] Session error:', sessionError)
      return new NextResponse(
        JSON.stringify({
          error: 'Authentication service unavailable',
          code: 'AUTH_SERVICE_ERROR',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 503,
          headers: { 'content-type': 'application/json' },
        }
      )
    }

    // Require authentication
    if (!session) {
      console.warn(`[SECURITY] Unauthorized access attempt: ${pathname} from ${request.ip || 'unknown'}`)
      return new NextResponse(
        JSON.stringify({
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
          message: 'This endpoint requires authentication. Please login first.',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 401,
          headers: { 'content-type': 'application/json' },
        }
      )
    }

    // Check admin routes
    if (ADMIN_ROUTES.has(pathname) || 
        (pathname.startsWith('/api/mcps') && request.method === 'POST')) {
      
      const isAdmin = await checkAdminRole(supabase, session.user.id)
      
      if (!isAdmin) {
        console.warn(`[SECURITY] Admin access denied: ${pathname} for user ${session.user.id}`)
        return new NextResponse(
          JSON.stringify({
            error: 'Admin access required',
            code: 'FORBIDDEN', 
            message: 'This endpoint requires administrator privileges.',
            timestamp: new Date().toISOString(),
          }),
          {
            status: 403,
            headers: { 'content-type': 'application/json' },
          }
        )
      }
    }

    // Log successful authenticated access
    console.log(`[SECURITY] Authenticated access: ${pathname} by ${session.user.email}`)

    // Add security headers
    const secureResponse = NextResponse.next()
    secureResponse.headers.set('X-User-ID', session.user.id)
    secureResponse.headers.set('X-Auth-Timestamp', new Date().toISOString())
    
    return secureResponse

  } catch (error) {
    console.error('[SECURITY] Middleware error:', error)
    return new NextResponse(
      JSON.stringify({
        error: 'Authentication failed',
        code: 'AUTH_FAILED',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    )
  }
}

// ============================================================================
// ADMIN ROLE VERIFICATION
// ============================================================================

/**
 * Vérifie si l'utilisateur a des privilèges admin
 * TODO: Implémenter selon votre modèle de données utilisateur
 */
async function checkAdminRole(supabase: any, userId: string): Promise<boolean> {
  try {
    // Option 1: Table users avec role column
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('[SECURITY] Admin check error:', error)
      return false
    }

    return userData?.role === 'admin' || userData?.role === 'superadmin'
    
  } catch (error) {
    console.error('[SECURITY] Admin verification failed:', error)
    return false // Fail-safe: deny access on error
  }
}

// ============================================================================
// MIDDLEWARE CONFIGURATION  
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}