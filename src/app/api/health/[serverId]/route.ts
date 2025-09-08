/**
 * 🔍 API ROUTE - HEALTH DETAIL BY SERVER
 * 
 * Endpoints pour le monitoring d'un serveur spécifique
 * GET /api/health/[serverId] - Détails santé d'un serveur
 * POST /api/health/[serverId]/check - Force un health check
 */

import { type NextRequest, NextResponse } from 'next/server'

import { mcpConnectionManager } from '@/lib/mcp/connection'
import { mcpHealthMonitor } from '@/lib/mcp/health-monitor'

interface RouteContext {
  params: {
    serverId: string
  }
}

/**
 * GET /api/health/[serverId] - Détails de santé pour un serveur
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { serverId } = context.params
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') || '24h') as '1h' | '24h' | '7d' | '30d'
    const historyLimit = parseInt(searchParams.get('historyLimit') || '50', 10)

    console.log(`🏥 GET /api/health/${serverId} - period: ${period}`)

    // Récupérer le status du serveur
    const serverStatus = mcpHealthMonitor.getServerStatus(serverId)
    
    if (!serverStatus) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Server ${serverId} not found in monitoring`,
        },
        timestamp: new Date().toISOString(),
      }, { status: 404 })
    }

    // Récupérer les métriques pour la période demandée
    const metrics = mcpHealthMonitor.calculateMetrics(serverId, period)
    
    // Récupérer l'historique des checks
    const healthHistory = mcpHealthMonitor.getHealthHistory(serverId, historyLimit)
    
    // Récupérer les alertes pour ce serveur
    const allAlerts = mcpHealthMonitor.getActiveAlerts()
    const serverAlerts = allAlerts.filter(alert => alert.serverId === serverId)

    // Construire la réponse
    const response = {
      success: true,
      data: {
        server: {
          id: serverStatus.id,
          name: serverStatus.name,
          url: serverStatus.url,
          enabled: serverStatus.enabled,
          currentStatus: serverStatus.status,
          lastCheck: serverStatus.lastCheck,
        },
        metrics: metrics || {
          serverId,
          period,
          uptime: 0,
          averageResponseTime: 0,
          totalChecks: 0,
          failedChecks: 0,
          lastCheck: new Date().toISOString(),
          trends: {
            uptimeTrend: 'stable' as const,
            performanceTrend: 'stable' as const,
          },
        },
        alerts: {
          active: serverAlerts.filter(a => !a.resolved),
          resolved: serverAlerts.filter(a => a.resolved).slice(0, 10), // 10 dernières résolues
          total: serverAlerts.length,
        },
        healthHistory: healthHistory.slice(0, historyLimit),
        summary: {
          isHealthy: serverStatus.status === 'healthy',
          lastCheckTime: serverStatus.lastCheck,
          nextCheckIn: '5 minutes', // Based on monitoring interval
          monitoringEnabled: serverStatus.enabled,
        },
      },
      timestamp: new Date().toISOString(),
    }

    console.log(`📊 Health details for ${serverStatus.name}: ${serverStatus.status}`)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=30', // 30s cache for health data
      },
    })

  } catch (error) {
    console.error(`❌ GET /api/health/${context.params.serverId} error:`, error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch server health',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

/**
 * POST /api/health/[serverId]/check - Force un health check immédiat
 */
export async function POST(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { serverId } = context.params
    
    console.log(`🔍 POST /api/health/${serverId}/check - Manual health check`)

    // Récupérer le serveur
    const serverStatus = mcpHealthMonitor.getServerStatus(serverId)
    
    if (!serverStatus) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Server ${serverId} not found in monitoring`,
        },
        timestamp: new Date().toISOString(),
      }, { status: 404 })
    }

    // Effectuer un health check immédiat
    const startTime = Date.now()
    const healthCheck = await mcpConnectionManager.healthCheck(serverStatus.url)
    const duration = Date.now() - startTime

    console.log(`✅ Manual health check completed for ${serverStatus.name}: ${healthCheck.status} (${duration}ms)`)

    // Construire la réponse
    const response = {
      success: true,
      data: {
        server: {
          id: serverStatus.id,
          name: serverStatus.name,
          url: serverStatus.url,
        },
        healthCheck: {
          ...healthCheck,
          checkType: 'manual',
          requestedAt: new Date().toISOString(),
          duration,
        },
        result: {
          isHealthy: healthCheck.status === 'healthy',
          statusChanged: serverStatus.status !== healthCheck.status,
          previousStatus: serverStatus.status,
          newStatus: healthCheck.status,
        },
      },
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error(`❌ POST /api/health/${context.params.serverId}/check error:`, error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Health check failed',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}