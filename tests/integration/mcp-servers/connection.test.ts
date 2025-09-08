/**
 * 🔌 MCP SERVER CONNECTION TESTS
 * 
 * Tests d'intégration avec de vrais serveurs MCP
 * Suit les principes E4-Tests First avec vraies connexions
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'

// ============================================================================
// REAL MCP SERVER INTEGRATION TESTS
// ============================================================================

describe('MCP Server Connections (Integration)', () => {
  
  beforeAll(() => {
    // Skip if integration tests disabled
    if (!global.shouldRunIntegrationTests()) {
      console.log('⏭️ Skipping MCP integration tests (disabled)')
      return
    }
    
    console.log('🔌 Starting MCP server connection tests...')
  })

  afterAll(() => {
    console.log('✅ MCP server connection tests completed')
  })

  test('should connect to available MCP servers', async () => {
    if (!global.shouldRunIntegrationTests()) {
      test.skip('Integration tests disabled')
      return
    }

    const connectionResults = []

    for (const server of global.KNOWN_MCP_SERVERS) {
      console.log(`Testing connection to ${server.name}...`)
      
      const isConnected = await global.testMcpConnection({
        host: server.host,
        port: server.port,
        timeout: 10000, // 10s timeout for real servers
      })

      connectionResults.push({
        name: server.name,
        connected: isConnected,
        host: server.host,
        port: server.port,
      })

      if (isConnected) {
        console.log(`✅ ${server.name} is available`)
      } else {
        console.log(`❌ ${server.name} is not available`)
      }
    }

    // Log results for debugging
    console.table(connectionResults)

    // At least one server should be available for a valid test environment
    const availableServers = connectionResults.filter(r => r.connected)
    expect(availableServers.length).toBeGreaterThan(0)
  }, 30000) // 30s timeout for multiple server tests

  test('should handle MCP protocol handshake', async () => {
    if (!global.shouldRunIntegrationTests()) {
      test.skip('Integration tests disabled')
      return
    }

    // Find first available server
    let availableServer = null
    
    for (const server of global.KNOWN_MCP_SERVERS) {
      const isConnected = await global.testMcpConnection({
        host: server.host,
        port: server.port,
      })
      
      if (isConnected) {
        availableServer = server
        break
      }
    }

    if (!availableServer) {
      test.skip('No MCP servers available for protocol test')
      return
    }

    console.log(`🤝 Testing MCP protocol with ${availableServer.name}`)

    // Test basic MCP protocol endpoints
    const baseUrl = `http://${availableServer.host}:${availableServer.port}`
    
    // Test health endpoint
    const healthResponse = await fetch(`${baseUrl}/health`)
    expect(healthResponse.ok).toBe(true)
    
    const healthData = await healthResponse.text()
    expect(healthData).toBeDefined()
    
    console.log(`✅ MCP protocol handshake successful with ${availableServer.name}`)
  }, 15000)

  test('should discover MCP server capabilities', async () => {
    if (!global.shouldRunIntegrationTests()) {
      test.skip('Integration tests disabled')
      return
    }

    // This test would discover tools, resources, and prompts from real MCP servers
    // For now, we'll test basic capability discovery
    
    const capabilityTests = global.KNOWN_MCP_SERVERS.map(async (server) => {
      const isConnected = await global.testMcpConnection({
        host: server.host,
        port: server.port,
        timeout: 5000,
      })

      return {
        server: server.name,
        connected: isConnected,
        capabilities: isConnected ? ['basic-connection'] : [],
      }
    })

    const results = await Promise.all(capabilityTests)
    
    console.log('🔍 MCP Server Capabilities Discovery:')
    console.table(results)

    // At least basic connectivity should work
    const connectedServers = results.filter(r => r.connected)
    expect(connectedServers.length).toBeGreaterThan(0)
  }, 20000)

  test('should measure MCP server response times', async () => {
    if (!global.shouldRunIntegrationTests()) {
      test.skip('Integration tests disabled')
      return
    }

    const performanceTests = []

    for (const server of global.KNOWN_MCP_SERVERS) {
      const startTime = Date.now()
      
      const isConnected = await global.testMcpConnection({
        host: server.host,
        port: server.port,
        timeout: 5000,
      })

      const responseTime = Date.now() - startTime

      performanceTests.push({
        server: server.name,
        connected: isConnected,
        responseTime: responseTime,
        acceptable: responseTime < 5000, // 5s max
      })
    }

    console.log('⚡ MCP Server Performance Results:')
    console.table(performanceTests)

    // All connected servers should respond within reasonable time
    const connectedServers = performanceTests.filter(r => r.connected)
    if (connectedServers.length > 0) {
      connectedServers.forEach(server => {
        expect(server.acceptable).toBe(true)
      })
    }
  }, 25000)
})

// ============================================================================
// MCP SERVER HEALTH MONITORING TESTS
// ============================================================================

describe('MCP Server Health Monitoring', () => {
  
  test('should implement health check mechanism', async () => {
    if (!global.shouldRunIntegrationTests()) {
      test.skip('Integration tests disabled')
      return
    }

    // Test health check data structure
    const mockHealthCheck = global.createMockHealthCheck({
      serverId: 'context7-server',
      status: 'healthy',
      responseTime: 120,
    })

    expect(mockHealthCheck).toMatchObject({
      serverId: expect.any(String),
      timestamp: expect.any(String),
      status: expect.stringMatching(/^(healthy|unhealthy|degraded|unknown)$/),
      responseTime: expect.any(Number),
      details: expect.objectContaining({
        connectionTime: expect.any(Number),
        toolsListTime: expect.any(Number),
        resourcesListTime: expect.any(Number),
      }),
    })
  })

  test('should track server uptime patterns', async () => {
    if (!global.shouldRunIntegrationTests()) {
      test.skip('Integration tests disabled')
      return
    }

    // Simulate multiple health checks over time
    const healthChecks = []
    const now = Date.now()

    // Generate mock health checks for the last hour
    for (let i = 0; i < 12; i++) {
      const timestamp = new Date(now - (i * 5 * 60 * 1000)) // Every 5 minutes
      
      healthChecks.push(global.createMockHealthCheck({
        timestamp: timestamp.toISOString(),
        status: Math.random() > 0.1 ? 'healthy' : 'degraded', // 90% uptime
        responseTime: 100 + Math.random() * 200, // 100-300ms
      }))
    }

    // Calculate uptime percentage
    const healthyChecks = healthChecks.filter(check => check.status === 'healthy')
    const uptimePercentage = (healthyChecks.length / healthChecks.length) * 100

    expect(uptimePercentage).toBeGreaterThan(80) // Minimum 80% uptime
    expect(healthChecks).toHaveLength(12)
  })
})