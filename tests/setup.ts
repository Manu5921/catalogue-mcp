/**
 * 🧪 JEST SETUP - CATALOGUE MCP
 * 
 * Configuration globale pour tous les tests
 * Includes mocks, polyfills, and testing utilities
 */

import '@testing-library/jest-dom'
import 'whatwg-fetch' // Polyfill for fetch in Node environment

// ============================================================================
// GLOBAL TEST CONFIGURATION
// ============================================================================

// Increase timeout for integration tests with real MCP servers
jest.setTimeout(30000)

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.NODE_ENV = 'test'

// ============================================================================
// CONSOLE UTILITIES FOR TESTS
// ============================================================================

// Suppress console warnings in tests unless explicitly needed
const originalConsoleWarn = console.warn
const originalConsoleError = console.error

beforeAll(() => {
  console.warn = jest.fn()
  console.error = jest.fn()
})

afterAll(() => {
  console.warn = originalConsoleWarn
  console.error = originalConsoleError
})

// ============================================================================
// GLOBAL TEST UTILITIES
// ============================================================================

/**
 * Create a test server response mock
 */
global.createMockResponse = <T>(data: T, success = true) => ({
  success,
  data,
  timestamp: new Date().toISOString(),
})

/**
 * Create a paginated response mock
 */
global.createMockPaginatedResponse = <T>(
  data: T[], 
  page = 1, 
  limit = 20,
  total = data.length
) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  },
  timestamp: new Date().toISOString(),
})

/**
 * Wait for async operations in tests
 */
global.waitFor = (ms: number = 100) =>
  new Promise(resolve => setTimeout(resolve, ms))

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

/**
 * Generate mock MCP server data
 */
global.createMockMcpServer = (overrides = {}) => ({
  id: 'test-server-' + Math.random().toString(36).substr(2, 9),
  name: 'Test MCP Server',
  description: 'A test MCP server for testing purposes',
  version: '1.0.0',
  author: 'Test Author',
  category: 'test',
  tags: ['test', 'mock'],
  repositoryUrl: 'https://github.com/test/test-mcp',
  protocolVersion: '0.1.0',
  healthStatus: 'healthy' as const,
  popularityScore: 75,
  qualityScore: 85,
  reviewCount: 10,
  averageRating: 4.2,
  isVerified: true,
  isDeprecated: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

/**
 * Generate mock health check data
 */
global.createMockHealthCheck = (overrides = {}) => ({
  serverId: 'test-server-id',
  timestamp: new Date().toISOString(),
  status: 'healthy' as const,
  responseTime: 150,
  details: {
    connectionTime: 50,
    toolsListTime: 75,
    resourcesListTime: 25,
  },
  ...overrides,
})

// ============================================================================
// INTEGRATION TEST HELPERS
// ============================================================================

/**
 * Check if we should run integration tests
 * Skip integration tests in CI or when MCP servers unavailable
 */
global.shouldRunIntegrationTests = () => {
  if (process.env.CI === 'true' && !process.env.RUN_INTEGRATION_TESTS) {
    return false
  }
  
  if (process.env.SKIP_INTEGRATION_TESTS === 'true') {
    return false
  }
  
  return true
}

/**
 * Test MCP server connection helper
 */
global.testMcpConnection = async (serverConfig: {
  host: string
  port: number
  timeout?: number
}) => {
  const { host, port, timeout = 5000 } = serverConfig
  
  try {
    const response = await fetch(`http://${host}:${port}/health`, {
      signal: AbortSignal.timeout(timeout),
    })
    return response.ok
  } catch {
    return false
  }
}

// ============================================================================
// REAL MCP SERVERS FOR TESTING
// ============================================================================

/**
 * Known MCP servers for integration testing
 * These should be real, available MCP servers
 */
global.KNOWN_MCP_SERVERS = [
  {
    name: 'Context7',
    host: 'localhost',
    port: 8052,
    description: 'Documentation and code examples server',
  },
  {
    name: 'Serena', 
    host: 'localhost',
    port: 8053,
    description: 'Code analysis and manipulation server',
  },
  {
    name: 'Archon',
    host: 'localhost', 
    port: 8051,
    description: 'Project management and RAG server',
  },
]

console.log('🧪 Test setup completed - Ready for E4 Tests First phase')