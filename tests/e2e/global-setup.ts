/**
 * 🌍 PLAYWRIGHT GLOBAL SETUP
 * 
 * Configuration globale pour les tests E2E
 * Initialisation environnement de test et données
 */

import { FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E test environment setup...')
  
  // Log test configuration
  console.log(`Base URL: ${config.use?.baseURL}`)
  console.log(`Workers: ${config.workers}`)
  console.log(`Retries: ${config.retries}`)
  
  // Wait for server to be ready
  const baseURL = config.use?.baseURL || 'http://localhost:3000'
  
  try {
    // Wait up to 30 seconds for the server to be ready
    const maxAttempts = 30
    let attempts = 0
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${baseURL}/`)
        if (response.ok) {
          console.log('✅ Development server is ready')
          break
        }
      } catch (error) {
        // Server not ready yet
      }
      
      attempts++
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (attempts === maxAttempts) {
        throw new Error(`Server not ready after ${maxAttempts} seconds`)
      }
    }
    
    // Setup test data if needed
    await setupTestData()
    
    console.log('✅ E2E test environment ready')
    
  } catch (error) {
    console.error('❌ Failed to setup E2E test environment:', error)
    throw error
  }
}

/**
 * Setup test data for E2E tests
 */
async function setupTestData() {
  console.log('📋 Setting up test data...')
  
  // In a real application, you might:
  // - Seed the test database
  // - Create test users
  // - Prepare mock MCP servers
  // - Setup authentication tokens
  
  // For now, we'll just log that data is ready
  console.log('✅ Test data prepared')
}

export default globalSetup