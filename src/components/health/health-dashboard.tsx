/**
 * 📊 HEALTH DASHBOARD COMPONENT
 * 
 * Dashboard de monitoring pour serveurs MCP avec métriques temps réel
 * Affiche: uptime, temps de réponse, taux d'erreur, tendances
 */

'use client'

import React, { useState, useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import type { HealthMetrics, HealthCheck } from '@/types/mcp'

interface HealthDashboardProps {
  serverId: string
  className?: string
  showControls?: boolean
  autoRefresh?: boolean
  refreshInterval?: number // milliseconds
}

interface HealthState {
  metrics: HealthMetrics | null
  recentChecks: HealthCheck[]
  loading: boolean
  error: string | null
  isMonitoring: boolean
}

export function HealthDashboard({
  serverId,
  className = '',
  showControls = true,
  autoRefresh = true,
  refreshInterval = 30000,
}: HealthDashboardProps) {
  
  const [state, setState] = useState<HealthState>({
    metrics: null,
    recentChecks: [],
    loading: true,
    error: null,
    isMonitoring: false,
  })

  const [selectedPeriod, setSelectedPeriod] = useState<'1h' | '24h' | '7d' | '30d'>('24h')

  // Load initial metrics
  useEffect(() => {
    loadMetrics()
  }, [serverId, selectedPeriod])

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh || !state.isMonitoring) return

    const interval = setInterval(() => {
      loadMetrics(false)
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, state.isMonitoring, serverId, selectedPeriod])

  const loadMetrics = async (showLoading = true) => {
    if (showLoading) {
      setState(prev => ({ ...prev, loading: true, error: null }))
    }

    try {
      // Get health metrics
      const metricsResponse = await fetch(`/api/health/${serverId}/metrics?period=${selectedPeriod}`)
      let metrics: HealthMetrics | null = null
      
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json()
        metrics = metricsData.success ? metricsData.data : null
      }

      // Get recent checks
      const checksResponse = await fetch(`/api/health/${serverId}/checks?limit=10`)
      let recentChecks: HealthCheck[] = []
      
      if (checksResponse.ok) {
        const checksData = await checksResponse.json()
        recentChecks = checksData.success ? checksData.data : []
      }

      setState(prev => ({
        ...prev,
        metrics,
        recentChecks,
        loading: false,
        error: null,
      }))

    } catch (error) {
      console.error('Failed to load health metrics:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load metrics',
      }))
    }
  }

  const startMonitoring = async () => {
    try {
      const response = await fetch(`/api/health/${serverId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: 60000 }) // Check every minute
      })

      if (response.ok) {
        setState(prev => ({ ...prev, isMonitoring: true }))
      }
    } catch (error) {
      console.error('Failed to start monitoring:', error)
    }
  }

  const stopMonitoring = async () => {
    try {
      const response = await fetch(`/api/health/${serverId}/stop`, {
        method: 'POST',
      })

      if (response.ok) {
        setState(prev => ({ ...prev, isMonitoring: false }))
      }
    } catch (error) {
      console.error('Failed to stop monitoring:', error)
    }
  }

  const triggerHealthCheck = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      const response = await fetch(`/api/health/${serverId}/check`, {
        method: 'POST',
      })

      if (response.ok) {
        // Reload metrics after check
        await loadMetrics(false)
      }
    } catch (error) {
      console.error('Failed to trigger health check:', error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const { metrics, recentChecks, loading, error, isMonitoring } = state

  if (error && !metrics) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium mb-2">Health Monitoring Unavailable</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => loadMetrics()} disabled={loading}>
            {loading ? 'Retrying...' : 'Retry'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Health Monitoring</h2>
        
        {showControls && (
          <div className="flex items-center space-x-3">
            {/* Period selector */}
            <div className="flex items-center space-x-1 border rounded-md p-1">
              {(['1h', '24h', '7d', '30d'] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className="px-3"
                >
                  {period}
                </Button>
              ))}
            </div>

            {/* Control buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={triggerHealthCheck}
              disabled={loading}
            >
              🔄 Check Now
            </Button>
            
            <Button
              variant={isMonitoring ? 'destructive' : 'default'}
              size="sm"
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
            >
              {isMonitoring ? '⏹️ Stop' : '▶️ Start'} Monitoring
            </Button>
          </div>
        )}
      </div>

      {loading && !metrics ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading health metrics...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">UPTIME</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl font-bold text-green-600">
                    {metrics ? (metrics.uptime * 100).toFixed(1) : '---'}%
                  </div>
                  {metrics?.trends?.uptimeTrend && (
                    <Badge variant={getTrendVariant(metrics.trends.uptimeTrend)} className="text-xs">
                      {getTrendIcon(metrics.trends.uptimeTrend)} {metrics.trends.uptimeTrend}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedPeriod} period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">RESPONSE TIME</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl font-bold text-blue-600">
                    {metrics ? metrics.avgResponseTime : '---'}ms
                  </div>
                  {metrics?.trends?.performanceTrend && (
                    <Badge variant={getTrendVariant(metrics.trends.performanceTrend)} className="text-xs">
                      {getTrendIcon(metrics.trends.performanceTrend)} {metrics.trends.performanceTrend}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Average response
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">ERROR RATE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl font-bold text-orange-600">
                    {metrics ? (metrics.errorRate * 100).toFixed(2) : '---'}%
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {metrics ? `${metrics.failedChecks}/${metrics.totalChecks}` : 'No data'} checks failed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Health Checks */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Health Checks</CardTitle>
              <CardDescription>Latest health check results</CardDescription>
            </CardHeader>
            <CardContent>
              {recentChecks.length > 0 ? (
                <div className="space-y-3">
                  {recentChecks.slice(0, 5).map((check, index) => (
                    <div key={`${check.timestamp}-${index}`} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                      <div className="flex items-center space-x-3">
                        <Badge variant={getHealthVariant(check.status)}>
                          {check.status}
                        </Badge>
                        <span className="text-sm">
                          {new Date(check.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{check.responseTime}ms</span>
                        {check.error && (
                          <span className="text-destructive text-xs max-w-xs truncate">
                            {check.error}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-muted-foreground">
                    No health checks available yet. Start monitoring to see results.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monitoring Status */}
          <Card className={`border-l-4 ${isMonitoring ? 'border-l-green-500 bg-green-50/30' : 'border-l-gray-300'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="font-medium">
                    {isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}
                  </span>
                </div>
                {metrics && (
                  <span className="text-sm text-muted-foreground">
                    Last check: {new Date(metrics.lastCheck).toLocaleString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

// Helper Functions
function getHealthVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' {
  switch (status) {
    case 'healthy':
      return 'success'
    case 'degraded':
      return 'warning'
    case 'unhealthy':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function getTrendVariant(trend: string): 'success' | 'warning' | 'destructive' {
  switch (trend) {
    case 'improving':
      return 'success'
    case 'stable':
      return 'warning'
    case 'degrading':
      return 'destructive'
    default:
      return 'warning'
  }
}

function getTrendIcon(trend: string): string {
  switch (trend) {
    case 'improving':
      return '↗️'
    case 'stable':
      return '→'
    case 'degrading':
      return '↘️'
    default:
      return '→'
  }
}