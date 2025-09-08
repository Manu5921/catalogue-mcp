/**
 * ⏹️ STOP MONITORING API
 * 
 * POST /api/health/[serverId]/stop
 * Arrête le monitoring de santé pour un serveur
 */

import { type NextRequest, NextResponse } from 'next/server'

import { McpHealthMonitor } from '@/lib/mcp/health-monitor'

interface RouteContext {
  params: {
    serverId: string
  }
}

export async function POST(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    const { serverId } = params

    // Get health monitor instance
    const healthMonitor = McpHealthMonitor.getInstance()
    
    // Stop monitoring
    healthMonitor.stop(serverId)

    return NextResponse.json({
      success: true,
      message: 'Health monitoring stopped',
      data: {
        serverId,
        stoppedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Stop monitoring API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to stop health monitoring'
      }
    }, { status: 500 })
  }
}