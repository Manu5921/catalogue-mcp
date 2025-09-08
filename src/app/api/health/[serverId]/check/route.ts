/**
 * 🔄 MANUAL HEALTH CHECK API
 * 
 * POST /api/health/[serverId]/check
 * Déclenche un health check manuel pour un serveur
 */

import { type NextRequest, NextResponse } from 'next/server'

import { McpConnectionManager } from '@/lib/mcp/connection'
import { McpDiscoveryService } from '@/lib/mcp/discovery'
import type { HealthCheck } from '@/types/mcp'

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

    // Get server config from discovery service
    const discoveryService = McpDiscoveryService.getInstance()
    const discoveryResult = await discoveryService.discoverServers({
      concurrent: 1,
      timeout: 5000
    })
    
    const server = discoveryResult.discovered.find(s => s.serverInfo.id === serverId)
    if (!server) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'SERVER_NOT_FOUND',
          message: 'Server not found in discovery results'
        }
      }, { status: 404 })
    }

    // Perform health check
    const connectionManager = McpConnectionManager.getInstance()
    const startTime = performance.now()
    
    try {
      const healthResult = await connectionManager.healthCheck(server.url)
      
      // healthResult IS already a HealthCheck, just update the serverId
      const updatedHealthCheck: HealthCheck = {
        ...healthResult,
        serverId,
      }

      return NextResponse.json({
        success: true,
        message: 'Health check completed',
        data: updatedHealthCheck
      })

    } catch (error) {
      const endTime = performance.now()
      const responseTime = Math.round(endTime - startTime)
      
      const healthCheck: HealthCheck = {
        serverId,
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        responseTime,
        error: error instanceof Error ? error.message : 'Health check failed',
        details: {
          connectionTime: responseTime,
          toolsListTime: 0,
          resourcesListTime: 0,
          memoryUsage: 0,
          cpuUsage: 0
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Health check completed (unhealthy)',
        data: healthCheck
      })
    }

  } catch (error) {
    console.error('Manual health check API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to perform health check'
      }
    }, { status: 500 })
  }
}