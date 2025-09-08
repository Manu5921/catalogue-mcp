/**
 * 📊 HEALTH CHECKS API
 * 
 * GET /api/health/[serverId]/checks?limit=10
 * Récupère l'historique des health checks pour un serveur
 */

import { type NextRequest, NextResponse } from 'next/server'

import type { HealthCheck } from '@/types/mcp'

interface RouteContext {
  params: {
    serverId: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    const { serverId } = params
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // Validate parameters
    if (limit < 1 || limit > 100) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_LIMIT',
          message: 'Limit must be between 1 and 100'
        }
      }, { status: 400 })
    }

    if (offset < 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_OFFSET',
          message: 'Offset must be non-negative'
        }
      }, { status: 400 })
    }

    // Get recent checks (mock implementation)
    const checks: HealthCheck[] = generateMockHealthChecks(serverId, limit)

    return NextResponse.json({
      success: true,
      data: checks,
      pagination: {
        limit,
        offset,
        total: checks.length,
        hasNext: false // Simplified for now
      }
    })

  } catch (error) {
    console.error('Health checks API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve health checks'
      }
    }, { status: 500 })
  }
}

// Mock health checks generation (replace with real database queries)
function generateMockHealthChecks(serverId: string, count: number): HealthCheck[] {
  const checks: HealthCheck[] = []
  const now = new Date()
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (i * 60 * 1000)) // Every minute backwards
    const isHealthy = Math.random() > 0.1 // 90% healthy rate
    const responseTime = isHealthy ? 
      Math.floor(Math.random() * 200) + 50 : // 50-250ms for healthy
      Math.floor(Math.random() * 2000) + 1000 // 1-3s for unhealthy
    
    checks.push({
      serverId,
      timestamp: timestamp.toISOString(),
      status: isHealthy ? 'healthy' : Math.random() > 0.5 ? 'degraded' : 'unhealthy',
      responseTime,
      error: isHealthy ? '' : 'Connection timeout',
      details: {
        connectionTime: Math.floor(responseTime * 0.3),
        toolsListTime: Math.floor(responseTime * 0.4),
        resourcesListTime: Math.floor(responseTime * 0.3),
        memoryUsage: Math.floor(Math.random() * 100) + 50,
        cpuUsage: Math.floor(Math.random() * 20) + 5
      }
    })
  }
  
  return checks
}