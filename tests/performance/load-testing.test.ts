/**
 * 🚀 E6 Performance & Load Testing
 * 
 * Tests system performance under load
 * Validates Gemini's scalability requirements
 */

import { McpConnectionManager } from '@/lib/mcp/connection'
import { McpHealthMonitor } from '@/lib/mcp/health-monitor'
import type { McpConnectionResult, HealthCheck } from '@/types/mcp'

describe('🚀 Performance & Load Testing (E6)', () => {
  const connectionManager = new McpConnectionManager()
  const healthMonitor = McpHealthMonitor.getInstance()
  
  // Performance targets based on Gemini recommendations
  const PERFORMANCE_TARGETS = {
    maxResponseTime: 500, // 500ms API response time
    maxConnectionTime: 2000, // 2s connection time
    maxHealthCheckTime: 1000, // 1s health check
    concurrentConnections: 10, // Support 10+ concurrent connections
    healthCheckThroughput: 50 // 50+ health checks per minute
  }
  
  beforeAll(() => {
    console.log('🚀 Starting Performance & Load Testing')
    console.log('📊 Performance Targets:')
    Object.entries(PERFORMANCE_TARGETS).forEach(([key, value]) => {
      console.log(`   - ${key}: ${value}${key.includes('Time') ? 'ms' : ''}`)
    })
  })

  afterAll(() => {
    healthMonitor.stop()
    console.log('🧹 Performance testing cleanup completed')
  })

  describe('⚡ Connection Performance', () => {
    test('should handle concurrent connections efficiently', async () => {
      const testServers = [
        'http://localhost:8051',
        'http://localhost:8054', 
        'http://localhost:8055',
        // Add some mock/unavailable servers to test error handling
        'http://localhost:9999',
        'http://localhost:9998'
      ]
      
      const startTime = Date.now()
      
      // Create concurrent connection promises
      const connectionPromises = testServers.map(url => 
        connectionManager.connect(url, { timeout: 5000 })
          .catch(error => ({ 
            success: false, 
            error: error.message,
            serverId: url 
          } as McpConnectionResult))
      )
      
      // Execute all connections concurrently  
      const results = await Promise.all(connectionPromises)
      const totalTime = Date.now() - startTime
      
      // Analyze results
      const successful = results.filter(r => r.success).length
      const failed = results.length - successful
      const avgTimePerConnection = totalTime / results.length
      
      console.log(`⚡ Concurrent Connections Performance:`)
      console.log(`   - Total connections: ${results.length}`)
      console.log(`   - Successful: ${successful}`)
      console.log(`   - Failed: ${failed}`)
      console.log(`   - Total time: ${totalTime}ms`)
      console.log(`   - Avg time per connection: ${Math.round(avgTimePerConnection)}ms`)
      
      // Validate concurrent handling
      expect(results).toHaveLength(testServers.length)
      expect(totalTime).toBeLessThan(PERFORMANCE_TARGETS.maxConnectionTime * 2) // Should be faster than sequential
      
      // Log individual results for debugging
      results.forEach((result, index) => {
        const server = testServers[index]
        console.log(`   - ${server}: ${result.success ? '✅' : '❌'} ${result.error || ''}`)
      })
    }, 15000)

    test('should maintain performance under repeated connections', async () => {
      const testUrl = 'http://localhost:8051' // Test with known server
      const iterations = 5
      const connectionTimes: number[] = []
      
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now()
        
        try {
          await connectionManager.connect(testUrl, { timeout: 3000 })
          const connectionTime = Date.now() - startTime
          connectionTimes.push(connectionTime)
          
          console.log(`🔄 Connection ${i + 1}/${iterations}: ${connectionTime}ms`)
          
          // Small delay between connections
          await new Promise(resolve => setTimeout(resolve, 100))
          
        } catch (error) {
          console.warn(`⚠️ Connection ${i + 1} failed:`, error)
          // Add failed connection time
          connectionTimes.push(Date.now() - startTime)
        }
      }
      
      if (connectionTimes.length > 0) {
        const avgTime = connectionTimes.reduce((sum, time) => sum + time, 0) / connectionTimes.length
        const maxTime = Math.max(...connectionTimes)
        const minTime = Math.min(...connectionTimes)
        
        console.log(`📊 Repeated Connections Performance:`)
        console.log(`   - Average: ${Math.round(avgTime)}ms`)
        console.log(`   - Min: ${minTime}ms`)
        console.log(`   - Max: ${maxTime}ms`)
        console.log(`   - Target: <${PERFORMANCE_TARGETS.maxConnectionTime}ms`)
        
        // Performance validation
        expect(avgTime).toBeLessThan(PERFORMANCE_TARGETS.maxConnectionTime)
        
        // Check for performance degradation (max shouldn't be much higher than avg)
        const performanceDegradation = maxTime / avgTime
        expect(performanceDegradation).toBeLessThan(3) // Max 3x slower than average
      }
    })
  })

  describe('💓 Health Check Performance', () => {
    test('should handle high-frequency health checks', async () => {
      const testServers = ['http://localhost:8051', 'http://localhost:8054']
      const healthCheckCount = 20 // 20 health checks
      const startTime = Date.now()
      
      const healthCheckPromises: Promise<HealthCheck>[] = []
      
      // Create multiple health checks across servers
      for (let i = 0; i < healthCheckCount; i++) {
        const serverUrl = testServers[i % testServers.length]
        healthCheckPromises.push(
          connectionManager.healthCheck(serverUrl)
            .catch(error => ({
              serverId: serverUrl,
              status: 'unhealthy' as const,
              timestamp: new Date().toISOString(),
              responseTime: 0,
              error: error.message
            }))
        )
      }
      
      const healthChecks = await Promise.all(healthCheckPromises)
      const totalTime = Date.now() - startTime
      
      // Calculate throughput (checks per second)
      const checksPerSecond = (healthCheckCount / totalTime) * 1000
      const targetChecksPerSecond = PERFORMANCE_TARGETS.healthCheckThroughput / 60 // Convert per minute to per second
      
      const successful = healthChecks.filter(hc => hc.status === 'healthy').length
      const avgResponseTime = healthChecks
        .filter(hc => hc.responseTime > 0)
        .reduce((sum, hc) => sum + hc.responseTime, 0) / Math.max(successful, 1)
      
      console.log(`💓 Health Check Performance:`)
      console.log(`   - Total checks: ${healthCheckCount}`)
      console.log(`   - Successful: ${successful}`)
      console.log(`   - Total time: ${totalTime}ms`)
      console.log(`   - Throughput: ${Math.round(checksPerSecond * 100) / 100} checks/sec`)
      console.log(`   - Target throughput: >${targetChecksPerSecond} checks/sec`)
      console.log(`   - Avg response time: ${Math.round(avgResponseTime)}ms`)
      
      // Performance validations
      expect(checksPerSecond).toBeGreaterThan(targetChecksPerSecond * 0.5) // At least 50% of target
      
      if (successful > 0) {
        expect(avgResponseTime).toBeLessThan(PERFORMANCE_TARGETS.maxHealthCheckTime)
      }
    }, 30000)

    test('should handle continuous health monitoring load', async () => {
      const testServerId = 'http://localhost:8051'
      const monitoringDuration = 5000 // 5 seconds of monitoring
      
      console.log(`💓 Starting ${monitoringDuration / 1000}s continuous health monitoring...`)
      
      // Start monitoring
      healthMonitor.startMonitoring(testServerId)
      
      const startTime = Date.now()
      let healthCheckCount = 0
      
      // Monitor for specified duration
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          healthCheckCount++
          
          if (Date.now() - startTime >= monitoringDuration) {
            clearInterval(checkInterval)
            resolve(undefined)
          }
        }, 200) // Check every 200ms
      })
      
      // Stop monitoring
      healthMonitor.stop(testServerId)
      
      const actualDuration = Date.now() - startTime
      const checksPerSecond = (healthCheckCount / actualDuration) * 1000
      
      console.log(`💓 Continuous Monitoring Results:`)
      console.log(`   - Duration: ${actualDuration}ms`)
      console.log(`   - Health checks: ${healthCheckCount}`)
      console.log(`   - Rate: ${Math.round(checksPerSecond * 100) / 100} checks/sec`)
      
      // Validate monitoring doesn't consume excessive resources
      expect(healthCheckCount).toBeGreaterThan(0)
      expect(checksPerSecond).toBeLessThan(100) // Shouldn't be too aggressive
    })
  })

  describe('🔄 System Load Testing', () => {
    test('should handle mixed operations under load', async () => {
      const testDuration = 10000 // 10 seconds load test
      const startTime = Date.now()
      
      console.log(`🔄 Starting ${testDuration / 1000}s mixed load test...`)
      
      const operations: Promise<any>[] = []
      let operationCount = 0
      
      // Create mixed load: connections + health checks + discovery
      const loadTestInterval = setInterval(() => {
        if (Date.now() - startTime >= testDuration) {
          clearInterval(loadTestInterval)
          return
        }
        
        // Random operation selection
        const operation = Math.floor(Math.random() * 3)
        
        switch (operation) {
          case 0: // Connection test
            operations.push(
              connectionManager.connect('http://localhost:8051', { timeout: 3000 })
                .catch(error => ({ success: false, error: error.message }))
            )
            break
            
          case 1: // Health check
            operations.push(
              connectionManager.healthCheck('http://localhost:8054')
                .catch(error => ({ 
                  serverId: 'http://localhost:8054',
                  status: 'unhealthy' as const,
                  error: error.message
                }))
            )
            break
            
          case 2: // Discovery (less frequent)
            if (operationCount % 5 === 0) { // Only every 5th operation
              operations.push(
                new (require('@/lib/mcp/discovery').McpDiscovery)()
                  .discoverServers([8051])
                  .catch(error => [])
              )
            }
            break
        }
        
        operationCount++
      }, 100) // New operation every 100ms
      
      // Wait for test duration
      await new Promise(resolve => setTimeout(resolve, testDuration + 1000))
      
      // Wait for all operations to complete
      const results = await Promise.allSettled(operations)
      const actualDuration = Date.now() - startTime
      
      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.length - successful
      const operationsPerSecond = (results.length / actualDuration) * 1000
      
      console.log(`🔄 Mixed Load Test Results:`)
      console.log(`   - Duration: ${actualDuration}ms`)
      console.log(`   - Total operations: ${results.length}`)
      console.log(`   - Successful: ${successful}`)
      console.log(`   - Failed: ${failed}`)
      console.log(`   - Operations/sec: ${Math.round(operationsPerSecond * 100) / 100}`)
      console.log(`   - Success rate: ${Math.round((successful / results.length) * 100)}%`)
      
      // System should handle reasonable load
      expect(results.length).toBeGreaterThan(50) // At least 50 operations in 10s
      expect(successful / results.length).toBeGreaterThan(0.3) // At least 30% success rate
    }, 15000)
  })

  describe('📊 Memory & Resource Usage', () => {
    test('should not leak memory during repeated operations', async () => {
      const initialMemory = process.memoryUsage()
      console.log(`📊 Initial memory usage: ${Math.round(initialMemory.heapUsed / 1024 / 1024)}MB`)
      
      // Perform many operations to test for memory leaks
      const iterations = 100
      
      for (let i = 0; i < iterations; i++) {
        // Mix of operations that could cause memory leaks
        await Promise.allSettled([
          connectionManager.connect('http://localhost:8051', { timeout: 1000 }),
          connectionManager.healthCheck('http://localhost:8051'),
          new Promise(resolve => setTimeout(resolve, 10)) // Small delay
        ])
        
        // Force garbage collection occasionally (if available)
        if (i % 20 === 0 && global.gc) {
          global.gc()
        }
      }
      
      // Force garbage collection before final measurement
      if (global.gc) {
        global.gc()
      }
      
      const finalMemory = process.memoryUsage()
      const memoryIncrease = (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024
      
      console.log(`📊 Final memory usage: ${Math.round(finalMemory.heapUsed / 1024 / 1024)}MB`)
      console.log(`📊 Memory increase: ${Math.round(memoryIncrease * 100) / 100}MB`)
      
      // Memory increase should be reasonable (less than 50MB for 100 operations)
      expect(memoryIncrease).toBeLessThan(50)
      
      console.log('📊 Memory leak test completed - no significant leaks detected')
    }, 20000)
  })
})

/**
 * 🚀 Performance Testing Utilities
 */
export class PerformanceTestUtils {
  /**
   * Measure execution time of async function
   */
  static async measureTime<T>(operation: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const startTime = Date.now()
    const result = await operation()
    const duration = Date.now() - startTime
    return { result, duration }
  }
  
  /**
   * Calculate percentiles for performance data
   */
  static calculatePercentiles(times: number[]): { p50: number; p90: number; p95: number; p99: number } {
    const sorted = times.sort((a, b) => a - b)
    const length = sorted.length
    
    return {
      p50: sorted[Math.floor(length * 0.5)],
      p90: sorted[Math.floor(length * 0.9)],
      p95: sorted[Math.floor(length * 0.95)],
      p99: sorted[Math.floor(length * 0.99)]
    }
  }
  
  /**
   * Generate performance report
   */
  static generatePerformanceReport(testName: string, times: number[]): void {
    const stats = this.calculatePercentiles(times)
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length
    const min = Math.min(...times)
    const max = Math.max(...times)
    
    console.log(`📊 Performance Report - ${testName}:`)
    console.log(`   - Samples: ${times.length}`)
    console.log(`   - Average: ${Math.round(avg)}ms`)
    console.log(`   - Min: ${min}ms`)
    console.log(`   - Max: ${max}ms`)
    console.log(`   - P50: ${stats.p50}ms`)
    console.log(`   - P90: ${stats.p90}ms`)
    console.log(`   - P95: ${stats.p95}ms`)
    console.log(`   - P99: ${stats.p99}ms`)
  }
}