/**
 * ▶️ START MONITORING API
 * 
 * POST /api/health/[serverId]/start
 * Démarre le monitoring de santé pour un serveur
 */

import { type NextRequest, NextResponse } from 'next/server'

import { McpHealthMonitor } from '@/lib/mcp/health-monitor'

interface RouteContext {
  params: {
    serverId: string
  }
}

interface StartMonitoringRequest {
  interval?: number // Check interval in milliseconds
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    const { serverId } = params
    
    // Parse request body
    let body: StartMonitoringRequest = {}
    try {
      body = await request.json()
    } catch {
      // Body is optional
    }

    const interval = body.interval || 60000 // Default 1 minute

    // Validate interval
    if (interval < 10000 || interval > 300000) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INTERVAL',
          message: 'Interval must be between 10 seconds and 5 minutes'
        }
      }, { status: 400 })
    }

    // Get health monitor instance
    const healthMonitor = McpHealthMonitor.getInstance()
    
    // Start monitoring
    healthMonitor.start({
      serverId,
      interval,
      alertThresholds: {
        responseTime: 5000,        // 5 seconds
        uptimePercentage: 90,      // 90%
        consecutiveFailures: 3     // 3 failures before alert
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Health monitoring started',
      data: {
        serverId,
        interval,
        startedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Start monitoring API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to start health monitoring'
      }
    }, { status: 500 })
  }
}