/**
 * 📊 HEALTH METRICS API
 * 
 * GET /api/health/[serverId]/metrics?period=24h
 * Récupère les métriques de santé pour un serveur sur une période donnée
 */

import { type NextRequest, NextResponse } from 'next/server'

import { McpHealthMonitor } from '@/lib/mcp/health-monitor'

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
    const period = (searchParams.get('period') || '24h') as '1h' | '24h' | '7d' | '30d'

    // Validate period
    if (!['1h', '24h', '7d', '30d'].includes(period)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_PERIOD',
          message: 'Period must be one of: 1h, 24h, 7d, 30d'
        }
      }, { status: 400 })
    }

    // Get health monitor instance
    const healthMonitor = McpHealthMonitor.getInstance()
    
    // Calculate metrics
    const metrics = healthMonitor.calculateMetrics(serverId, period)

    if (!metrics) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NO_DATA',
          message: 'No health data available for this server and period'
        }
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: metrics
    })

  } catch (error) {
    console.error('Health metrics API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve health metrics'
      }
    }, { status: 500 })
  }
}