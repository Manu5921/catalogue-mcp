/**
 * 🏥 MCP HEALTH MONITORING
 * 
 * Système de surveillance continue de la santé des serveurs MCP
 * Checks périodiques, métriques, alertes et historique
 */

import { mcpConnectionManager } from './connection'

import type { HealthCheck, HealthStatus, HealthMetrics } from '@/types/mcp'

export interface HealthMonitorOptions {
  readonly serverId?: string // For single server monitoring
  readonly interval?: number // Default 5min
  readonly timeout?: number // Default 10s per check
  readonly retentionDays?: number // Default 30 days
  readonly alertThresholds?: AlertThresholds
}

export interface AlertThresholds {
  readonly responseTime?: number // Default 5000ms
  readonly uptimePercentage?: number // Default 90 (90%)
  readonly consecutiveFailures?: number // Default 3
}

export interface HealthMonitorResult {
  readonly serverId: string
  readonly url: string
  readonly checks: readonly HealthCheck[]
  readonly metrics: HealthMetrics
  readonly alerts: readonly HealthAlert[]
}

export interface HealthAlert {
  readonly id: string
  readonly serverId: string
  readonly type: 'response_time' | 'downtime' | 'consecutive_failures'
  readonly severity: 'warning' | 'critical'
  readonly message: string
  readonly triggeredAt: string
  readonly resolved: boolean
  readonly resolvedAt?: string
}

export interface MonitoredServer {
  readonly id: string
  readonly url: string
  readonly name: string
  readonly enabled: boolean
  readonly lastCheck?: string
  readonly status: HealthStatus
}

/**
 * Service de monitoring de santé MCP
 */
export class McpHealthMonitor {
  private static instance: McpHealthMonitor
  private monitoredServers = new Map<string, MonitoredServer>()
  private healthHistory = new Map<string, HealthCheck[]>()
  private activeAlerts = new Map<string, HealthAlert[]>()
  private monitoringInterval: NodeJS.Timeout | null = null
  private isRunning = false

  private readonly defaultOptions = {
    interval: 5 * 60 * 1000, // 5 minutes
    timeout: 10000, // 10 seconds
    retentionDays: 30,
    alertThresholds: {
      responseTime: 5000, // 5s
      uptime: 0.95, // 95%
      consecutiveFailures: 3,
    },
  }

  static getInstance(): McpHealthMonitor {
    if (!this.instance) {
      this.instance = new McpHealthMonitor()
    }
    return this.instance
  }

  /**
   * Ajoute un serveur au monitoring
   */
  addServer(server: {
    id: string
    url: string  
    name: string
    enabled?: boolean
  }): void {
    const monitoredServer: MonitoredServer = {
      id: server.id,
      url: server.url,
      name: server.name,
      enabled: server.enabled ?? true,
      status: 'unknown',
    }

    this.monitoredServers.set(server.id, monitoredServer)
    this.healthHistory.set(server.id, [])
    this.activeAlerts.set(server.id, [])

    console.log(`🏥 Added server to health monitoring: ${server.name} (${server.url})`)
  }

  /**
   * Supprime un serveur du monitoring
   */
  removeServer(serverId: string): void {
    const server = this.monitoredServers.get(serverId)
    if (server) {
      this.monitoredServers.delete(serverId)
      this.healthHistory.delete(serverId)
      this.activeAlerts.delete(serverId)
      console.log(`🗑️ Removed server from monitoring: ${server.name}`)
    }
  }

  /**
   * Démarre le monitoring continu (global ou pour un serveur spécifique)
   */
  start(options: HealthMonitorOptions = {}): void {
    const config = { ...this.defaultOptions, ...options }

    if (options.serverId) {
      // Monitoring d'un serveur spécifique
      const server = this.monitoredServers.get(options.serverId)
      if (server) {
        this.monitoredServers.set(options.serverId, {
          ...server,
          enabled: true
        })
        console.log(`🚀 Started monitoring for server: ${server.name}`)
      } else {
        console.warn(`⚠️ Server ${options.serverId} not found for monitoring`)
      }
      return
    }

    // Monitoring global
    if (this.isRunning) {
      console.log('⚠️ Health monitoring already running')
      return
    }
    
    console.log(`🚀 Starting health monitoring (interval: ${config.interval}ms)`)
    console.log(`📊 Monitoring ${this.monitoredServers.size} servers`)

    this.isRunning = true
    
    // Premier check immédiat
    this.performHealthChecks(config).catch(console.error)

    // Checks périodiques
    this.monitoringInterval = setInterval(() => {
      this.performHealthChecks(config).catch(console.error)
    }, config.interval)
  }

  /**
   * Arrête le monitoring (global ou pour un serveur spécifique)
   */
  stop(serverId?: string): void {
    if (serverId) {
      // Arrêt pour un serveur spécifique
      const server = this.monitoredServers.get(serverId)
      if (server) {
        this.monitoredServers.set(serverId, {
          ...server,
          enabled: false
        })
        console.log(`🛑 Monitoring stopped for server: ${server.name}`)
      }
    } else {
      // Arrêt global
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval)
        this.monitoringInterval = null
      }
      
      this.isRunning = false
      console.log('🛑 Health monitoring stopped')
    }
  }

  /**
   * Effectue les checks de santé pour tous les serveurs
   */
  private async performHealthChecks(options: Required<HealthMonitorOptions>): Promise<void> {
    console.log(`🔍 Performing health checks on ${this.monitoredServers.size} servers`)

    const promises = Array.from(this.monitoredServers.values())
      .filter(server => server.enabled)
      .map(server => this.checkServerHealth(server, options))

    const results = await Promise.allSettled(promises)
    
    let healthyCount = 0
    let unhealthyCount = 0

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const healthCheck = result.value
        healthCheck.status === 'healthy' ? healthyCount++ : unhealthyCount++
      } else {
        unhealthyCount++
        console.error('Health check failed:', result.reason)
      }
    }

    console.log(`✅ Health check completed: ${healthyCount} healthy, ${unhealthyCount} unhealthy`)
  }

  /**
   * Check de santé pour un serveur spécifique
   */
  private async checkServerHealth(
    server: MonitoredServer,
    options: Required<HealthMonitorOptions>
  ): Promise<HealthCheck> {
    
    try {
      const healthCheck = await mcpConnectionManager.healthCheck(server.url)
      
      // Mise à jour du statut du serveur
      const updatedServer: MonitoredServer = {
        ...server,
        lastCheck: healthCheck.timestamp,
        status: healthCheck.status,
      }
      this.monitoredServers.set(server.id, updatedServer)

      // Stockage de l'historique
      this.addHealthCheckToHistory(server.id, healthCheck, options.retentionDays)
      
      // Vérification des alertes
      await this.checkAlerts(server.id, healthCheck, options.alertThresholds)

      console.log(`🏥 ${server.name}: ${healthCheck.status} (${healthCheck.responseTime}ms)`)
      
      return healthCheck
      
    } catch (error) {
      const errorCheck: HealthCheck = {
        serverId: server.id,
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        responseTime: options.timeout,
        error: error instanceof Error ? error.message : 'Health check failed',
        details: {
          connectionTime: options.timeout,
          toolsListTime: 0,
          resourcesListTime: 0,
        },
      }

      // Mise à jour et stockage
      this.monitoredServers.set(server.id, {
        ...server,
        lastCheck: errorCheck.timestamp,
        status: 'unhealthy',
      })
      
      this.addHealthCheckToHistory(server.id, errorCheck, options.retentionDays)
      await this.checkAlerts(server.id, errorCheck, options.alertThresholds)

      console.error(`❌ ${server.name}: health check failed - ${errorCheck.error}`)
      return errorCheck
    }
  }

  /**
   * Ajoute un check à l'historique avec rétention
   */
  private addHealthCheckToHistory(
    serverId: string,
    healthCheck: HealthCheck,
    retentionDays: number
  ): void {
    const history = this.healthHistory.get(serverId) || []
    history.push(healthCheck)

    // Nettoyage basé sur la rétention
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)
    
    const filteredHistory = history.filter(check => 
      new Date(check.timestamp) > cutoffDate
    )

    this.healthHistory.set(serverId, filteredHistory)
  }

  /**
   * Vérification et génération d'alertes
   */
  private async checkAlerts(
    serverId: string,
    healthCheck: HealthCheck,
    thresholds: AlertThresholds
  ): Promise<void> {
    const server = this.monitoredServers.get(serverId)
    if (!server) return

    const alerts = this.activeAlerts.get(serverId) || []
    const history = this.healthHistory.get(serverId) || []

    // Alert: Response time trop élevé
    if (healthCheck.responseTime > thresholds.responseTime!) {
      const existingAlert = alerts.find(a => a.type === 'response_time' && !a.resolved)
      
      if (!existingAlert) {
        const alert: HealthAlert = {
          id: `${serverId}-rt-${Date.now()}`,
          serverId,
          type: 'response_time',
          severity: healthCheck.responseTime > thresholds.responseTime! * 2 ? 'critical' : 'warning',
          message: `High response time: ${healthCheck.responseTime}ms (threshold: ${thresholds.responseTime}ms)`,
          triggeredAt: healthCheck.timestamp,
          resolved: false,
        }
        
        alerts.push(alert)
        console.warn(`⚠️ ${server.name}: ${alert.message}`)
      }
    } else {
      // Résoudre l'alerte si elle existe
      const rtAlert = alerts.find(a => a.type === 'response_time' && !a.resolved)
      if (rtAlert) {
        rtAlert.resolved = true
        rtAlert.resolvedAt = healthCheck.timestamp
        console.log(`✅ ${server.name}: Response time alert resolved`)
      }
    }

    // Alert: Échecs consécutifs
    const recentChecks = history.slice(-thresholds.consecutiveFailures!)
    const allFailed = recentChecks.length >= thresholds.consecutiveFailures! &&
                     recentChecks.every(check => check.status !== 'healthy')

    if (allFailed) {
      const existingAlert = alerts.find(a => a.type === 'consecutive_failures' && !a.resolved)
      
      if (!existingAlert) {
        const alert: HealthAlert = {
          id: `${serverId}-cf-${Date.now()}`,
          serverId,
          type: 'consecutive_failures',
          severity: 'critical',
          message: `${thresholds.consecutiveFailures} consecutive failures detected`,
          triggeredAt: healthCheck.timestamp,
          resolved: false,
        }
        
        alerts.push(alert)
        console.error(`🚨 ${server.name}: ${alert.message}`)
      }
    } else if (healthCheck.status === 'healthy') {
      // Résoudre l'alerte d'échecs consécutifs
      const cfAlert = alerts.find(a => a.type === 'consecutive_failures' && !a.resolved)
      if (cfAlert) {
        cfAlert.resolved = true
        cfAlert.resolvedAt = healthCheck.timestamp
        console.log(`✅ ${server.name}: Consecutive failures alert resolved`)
      }
    }

    this.activeAlerts.set(serverId, alerts)
  }

  /**
   * Calcule les métriques de santé pour un serveur
   */
  calculateMetrics(serverId: string, period: '1h' | '24h' | '7d' | '30d'): HealthMetrics | null {
    const history = this.healthHistory.get(serverId)
    if (!history || history.length === 0) return null

    const now = new Date()
    const periodMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000, 
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    }[period]

    const cutoff = new Date(now.getTime() - periodMs)
    const periodChecks = history.filter(check => new Date(check.timestamp) > cutoff)
    
    if (periodChecks.length === 0) return null

    const healthyChecks = periodChecks.filter(check => check.status === 'healthy')
    const uptime = (healthyChecks.length / periodChecks.length) * 100
    
    const avgResponseTime = periodChecks.reduce((sum, check) => sum + check.responseTime, 0) / periodChecks.length
    const failedChecks = periodChecks.filter(check => check.status !== 'healthy')

    const lastCheck = periodChecks[periodChecks.length - 1]

    return {
      serverId,
      period,
      uptime: uptime / 100, // Convert to 0-1 range
      avgResponseTime: Math.round(avgResponseTime), // Match interface naming
      errorRate: failedChecks.length / periodChecks.length, // Add error rate
      totalChecks: periodChecks.length,
      failedChecks: failedChecks.length,
      lastCheck: lastCheck.timestamp,
      trends: {
        uptimeTrend: this.calculateUptimeTrend(periodChecks),
        performanceTrend: this.calculatePerformanceTrend(periodChecks),
      },
    }
  }

  /**
   * Calcule la tendance d'uptime
   */
  private calculateUptimeTrend(checks: HealthCheck[]): 'improving' | 'stable' | 'degrading' {
    if (checks.length < 10) return 'stable'

    const mid = Math.floor(checks.length / 2)
    const firstHalf = checks.slice(0, mid)
    const secondHalf = checks.slice(mid)

    const firstHalfUptime = firstHalf.filter(c => c.status === 'healthy').length / firstHalf.length
    const secondHalfUptime = secondHalf.filter(c => c.status === 'healthy').length / secondHalf.length

    const diff = secondHalfUptime - firstHalfUptime
    
    if (diff > 0.1) return 'improving'
    if (diff < -0.1) return 'degrading'
    return 'stable'
  }

  /**
   * Calcule la tendance de performance
   */
  private calculatePerformanceTrend(checks: HealthCheck[]): 'improving' | 'stable' | 'degrading' {
    if (checks.length < 10) return 'stable'

    const mid = Math.floor(checks.length / 2)
    const firstHalf = checks.slice(0, mid)
    const secondHalf = checks.slice(mid)

    const firstAvg = firstHalf.reduce((sum, c) => sum + c.responseTime, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, c) => sum + c.responseTime, 0) / secondHalf.length

    const diff = (secondAvg - firstAvg) / firstAvg
    
    if (diff > 0.2) return 'degrading'  // Response time increased
    if (diff < -0.2) return 'improving' // Response time decreased
    return 'stable'
  }

  /**
   * Obtient le statut de monitoring d'un serveur
   */
  getServerStatus(serverId: string): MonitoredServer | null {
    return this.monitoredServers.get(serverId) || null
  }

  /**
   * Obtient toutes les alertes actives
   */
  getActiveAlerts(): HealthAlert[] {
    const allAlerts: HealthAlert[] = []
    for (const alerts of this.activeAlerts.values()) {
      allAlerts.push(...alerts.filter(alert => !alert.resolved))
    }
    return allAlerts.sort((a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime())
  }

  /**
   * Obtient l'historique de santé d'un serveur
   */
  getHealthHistory(serverId: string, limit?: number): HealthCheck[] {
    const history = this.healthHistory.get(serverId) || []
    if (limit) {
      return history.slice(-limit)
    }
    return [...history]
  }

  /**
   * Obtient un résumé du monitoring
   */
  getMonitoringSummary(): {
    totalServers: number
    activeServers: number
    healthyServers: number
    unhealthyServers: number
    totalAlerts: number
    criticalAlerts: number
  } {
    const servers = Array.from(this.monitoredServers.values())
    const activeAlerts = this.getActiveAlerts()

    return {
      totalServers: servers.length,
      activeServers: servers.filter(s => s.enabled).length,
      healthyServers: servers.filter(s => s.status === 'healthy').length,
      unhealthyServers: servers.filter(s => s.status === 'unhealthy').length,
      totalAlerts: activeAlerts.length,
      criticalAlerts: activeAlerts.filter(a => a.severity === 'critical').length,
    }
  }
}

// Export singleton
export const mcpHealthMonitor = McpHealthMonitor.getInstance()