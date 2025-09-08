/**
 * 🏥 API ROUTE - HEALTH MONITORING
 * 
 * Endpoints pour le monitoring de santé des serveurs MCP
 * GET /api/health - Status global du monitoring
 * POST /api/health/start - Démarre le monitoring
 * DELETE /api/health/stop - Arrête le monitoring
 */

import { type NextRequest, NextResponse } from 'next/server'

import { mcpDiscoveryService } from '@/lib/mcp/discovery'
import { mcpHealthMonitor } from '@/lib/mcp/health-monitor'

/**
 * GET /api/health - Status global du monitoring
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🏥 GET /api/health - Health monitoring status')

    // Récupérer le résumé du monitoring
    const summary = mcpHealthMonitor.getMonitoringSummary()
    
    // Récupérer les alertes actives
    const activeAlerts = mcpHealthMonitor.getActiveAlerts()
    
    // Construire la réponse
    const response = {
      success: true,
      data: {
        monitoring: {
          isRunning: true, // TODO: track actual monitoring state
          interval: '5 minutes',
          lastCheck: new Date().toISOString(),
        },
        summary,
        alerts: {
          total: activeAlerts.length,
          critical: activeAlerts.filter(a => a.severity === 'critical').length,
          warning: activeAlerts.filter(a => a.severity === 'warning').length,
          recent: activeAlerts.slice(0, 5), // 5 dernières alertes
        },
        servers: {
          monitored: summary.activeServers,
          healthy: summary.healthyServers,
          unhealthy: summary.unhealthyServers,
          healthPercentage: summary.activeServers > 0 
            ? Math.round((summary.healthyServers / summary.activeServers) * 100)
            : 0,
        },
      },
      timestamp: new Date().toISOString(),
    }

    console.log(`📊 Health status: ${summary.healthyServers}/${summary.activeServers} servers healthy`)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'private, no-cache, no-store', // Real-time data
      },
    })

  } catch (error) {
    console.error('❌ GET /api/health error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Health monitoring error',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

/**
 * POST /api/health/start - Démarre le monitoring automatique
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => ({}))
    const { interval = 300000 } = body // Default 5 minutes

    console.log(`🚀 POST /api/health/start - Starting monitoring (interval: ${interval}ms)`)

    // Découvrir les serveurs MCP disponibles
    const discoveryResult = await mcpDiscoveryService.discoverServers({
      timeout: 5000,
      concurrent: 3,
    })

    console.log(`🔍 Discovered ${discoveryResult.discovered.length} servers for monitoring`)

    // Ajouter les serveurs découverts au monitoring
    for (const server of discoveryResult.discovered) {
      mcpHealthMonitor.addServer({
        id: server.serverInfo.id,
        url: server.url,
        name: server.serverInfo.name,
        enabled: true,
      })
    }

    // Ajouter des serveurs de démo si aucun serveur réel découvert
    if (discoveryResult.discovered.length === 0) {
      console.log('📋 Adding demo servers for monitoring')
      
      const demoServers = [
        {
          id: 'context7-demo',
          url: 'http://localhost:8052',
          name: 'Context7 Documentation Server',
        },
        {
          id: 'serena-demo', 
          url: 'http://localhost:8053',
          name: 'Serena Code Analysis Server',
        },
        {
          id: 'archon-demo',
          url: 'http://localhost:8051',
          name: 'Archon Project Management Server',
        },
      ]

      for (const server of demoServers) {
        mcpHealthMonitor.addServer(server)
      }
    }

    // Démarrer le monitoring
    mcpHealthMonitor.start({
      interval,
      timeout: 10000,
      alertThresholds: {
        responseTime: 5000,
        uptimePercentage: 90,
        consecutiveFailures: 3,
      },
    })

    const summary = mcpHealthMonitor.getMonitoringSummary()

    const response = {
      success: true,
      data: {
        message: 'Health monitoring started',
        serversAdded: discoveryResult.discovered.length || 3, // Demo servers
        interval,
        summary,
      },
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('❌ POST /api/health/start error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to start monitoring',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

/**
 * DELETE /api/health/stop - Arrête le monitoring
 */
export async function DELETE(_request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🛑 DELETE /api/health/stop - Stopping monitoring')

    // Arrêter le monitoring
    mcpHealthMonitor.stop()

    const response = {
      success: true,
      data: {
        message: 'Health monitoring stopped',
        stoppedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('❌ DELETE /api/health/stop error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to stop monitoring',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}