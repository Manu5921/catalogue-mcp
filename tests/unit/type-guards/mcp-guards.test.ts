/**
 * 🛡️ MCP TYPE GUARDS UNIT TESTS
 * 
 * Tests unitaires pour les fonctions de validation de types MCP
 * Validation des type guards critiques pour la sécurité runtime
 */

import { describe, test, expect } from '@jest/globals'
import {
  isMcpServer,
  isValidHealthStatus,
  isHealthyStatus,
  isValidMcpCategory,
  isValidReviewRating,
  isValidUrl,
  isValidEmail,
  isValidUuid,
  isValidSemver,
  isNotNull,
  isNonEmptyString,
  isPositiveNumber,
  isPositiveInteger,
  hasProperty,
  isNonEmptyArray,
} from '../../../src/utils/type-guards'

// ============================================================================
// MCP TYPE GUARDS TESTS
// ============================================================================

describe('MCP Type Guards', () => {
  
  describe('isMcpServer', () => {
    test('should validate complete MCP server objects', () => {
      const validServer = global.createMockMcpServer()
      
      expect(isMcpServer(validServer)).toBe(true)
    })

    test('should reject incomplete MCP server objects', () => {
      const incompleteServer = {
        id: 'test-id',
        name: 'Test Server',
        // Missing required fields
      }
      
      expect(isMcpServer(incompleteServer)).toBe(false)
    })

    test('should reject non-objects', () => {
      expect(isMcpServer(null)).toBe(false)
      expect(isMcpServer(undefined)).toBe(false)
      expect(isMcpServer('string')).toBe(false)
      expect(isMcpServer(123)).toBe(false)
      expect(isMcpServer([])).toBe(false)
    })

    test('should validate required string fields', () => {
      const serverWithInvalidTypes = {
        id: 123, // Should be string
        name: 'Test Server',
        description: 'Test Description',
        version: '1.0.0',
        author: 'Test Author',
        category: 'test',
        tags: ['test'],
        repositoryUrl: 'https://github.com/test/test',
        protocolVersion: '0.1.0',
        healthStatus: 'healthy',
      }
      
      expect(isMcpServer(serverWithInvalidTypes)).toBe(false)
    })

    test('should validate health status field', () => {
      const serverWithInvalidHealth = global.createMockMcpServer({
        healthStatus: 'invalid-status',
      })
      
      expect(isMcpServer(serverWithInvalidHealth)).toBe(false)
    })
  })

  describe('isValidHealthStatus', () => {
    test('should accept valid health statuses', () => {
      expect(isValidHealthStatus('healthy')).toBe(true)
      expect(isValidHealthStatus('unhealthy')).toBe(true)
      expect(isValidHealthStatus('degraded')).toBe(true)
      expect(isValidHealthStatus('unknown')).toBe(true)
    })

    test('should reject invalid health statuses', () => {
      expect(isValidHealthStatus('online')).toBe(false)
      expect(isValidHealthStatus('offline')).toBe(false)
      expect(isValidHealthStatus('good')).toBe(false)
      expect(isValidHealthStatus('')).toBe(false)
      expect(isValidHealthStatus(null)).toBe(false)
      expect(isValidHealthStatus(123)).toBe(false)
    })
  })

  describe('isHealthyStatus', () => {
    test('should only return true for healthy status', () => {
      expect(isHealthyStatus('healthy')).toBe(true)
      expect(isHealthyStatus('unhealthy')).toBe(false)
      expect(isHealthyStatus('degraded')).toBe(false)
      expect(isHealthyStatus('unknown')).toBe(false)
    })
  })

  describe('isValidMcpCategory', () => {
    test('should accept valid MCP categories', () => {
      expect(isValidMcpCategory('filesystem')).toBe(true)
      expect(isValidMcpCategory('database')).toBe(true)
      expect(isValidMcpCategory('web')).toBe(true)
      expect(isValidMcpCategory('ai')).toBe(true)
      expect(isValidMcpCategory('other')).toBe(true)
    })

    test('should reject invalid MCP categories', () => {
      expect(isValidMcpCategory('invalid-category')).toBe(false)
      expect(isValidMcpCategory('')).toBe(false)
      expect(isValidMcpCategory(null)).toBe(false)
      expect(isValidMcpCategory(123)).toBe(false)
    })
  })
})

// ============================================================================
// VALIDATION TYPE GUARDS TESTS
// ============================================================================

describe('Validation Type Guards', () => {
  
  describe('isValidReviewRating', () => {
    test('should accept valid ratings (1-5)', () => {
      expect(isValidReviewRating(1)).toBe(true)
      expect(isValidReviewRating(2)).toBe(true)
      expect(isValidReviewRating(3)).toBe(true)
      expect(isValidReviewRating(4)).toBe(true)
      expect(isValidReviewRating(5)).toBe(true)
    })

    test('should reject invalid ratings', () => {
      expect(isValidReviewRating(0)).toBe(false)
      expect(isValidReviewRating(6)).toBe(false)
      expect(isValidReviewRating(1.5)).toBe(false)
      expect(isValidReviewRating('3')).toBe(false)
      expect(isValidReviewRating(null)).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    test('should accept valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
      expect(isValidUrl('https://github.com/user/repo')).toBe(true)
      expect(isValidUrl('ftp://files.example.com')).toBe(true)
    })

    test('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('just-text')).toBe(false)
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl(null)).toBe(false)
      expect(isValidUrl(123)).toBe(false)
    })
  })

  describe('isValidEmail', () => {
    test('should accept valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('test+tag@gmail.com')).toBe(true)
    })

    test('should reject invalid email addresses', () => {
      expect(isValidEmail('not-an-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail(null)).toBe(false)
    })
  })

  describe('isValidUuid', () => {
    test('should accept valid UUIDs', () => {
      expect(isValidUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true)
      expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
    })

    test('should reject invalid UUIDs', () => {
      expect(isValidUuid('not-a-uuid')).toBe(false)
      expect(isValidUuid('123-456-789')).toBe(false)
      expect(isValidUuid('')).toBe(false)
      expect(isValidUuid(null)).toBe(false)
    })
  })

  describe('isValidSemver', () => {
    test('should accept valid semantic versions', () => {
      expect(isValidSemver('1.0.0')).toBe(true)
      expect(isValidSemver('2.1.3')).toBe(true)
      expect(isValidSemver('1.0.0-alpha')).toBe(true)
      expect(isValidSemver('2.0.0-beta.1')).toBe(true)
    })

    test('should reject invalid semantic versions', () => {
      expect(isValidSemver('1.0')).toBe(false)
      expect(isValidSemver('v1.0.0')).toBe(false)
      expect(isValidSemver('not-a-version')).toBe(false)
      expect(isValidSemver('')).toBe(false)
      expect(isValidSemver(null)).toBe(false)
    })
  })
})

// ============================================================================
// UTILITY TYPE GUARDS TESTS
// ============================================================================

describe('Utility Type Guards', () => {
  
  describe('isNotNull', () => {
    test('should accept non-null values', () => {
      expect(isNotNull('string')).toBe(true)
      expect(isNotNull(123)).toBe(true)
      expect(isNotNull({})).toBe(true)
      expect(isNotNull([])).toBe(true)
      expect(isNotNull(false)).toBe(true)
    })

    test('should reject null and undefined', () => {
      expect(isNotNull(null)).toBe(false)
      expect(isNotNull(undefined)).toBe(false)
    })
  })

  describe('isNonEmptyString', () => {
    test('should accept non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true)
      expect(isNonEmptyString(' text ')).toBe(true)
      expect(isNonEmptyString('   a   ')).toBe(true)
    })

    test('should reject empty or non-string values', () => {
      expect(isNonEmptyString('')).toBe(false)
      expect(isNonEmptyString('   ')).toBe(false)
      expect(isNonEmptyString(123)).toBe(false)
      expect(isNonEmptyString(null)).toBe(false)
      expect(isNonEmptyString(undefined)).toBe(false)
    })
  })

  describe('isPositiveNumber', () => {
    test('should accept positive numbers', () => {
      expect(isPositiveNumber(1)).toBe(true)
      expect(isPositiveNumber(0.1)).toBe(true)
      expect(isPositiveNumber(100)).toBe(true)
      expect(isPositiveNumber(3.14159)).toBe(true)
    })

    test('should reject non-positive numbers and non-numbers', () => {
      expect(isPositiveNumber(0)).toBe(false)
      expect(isPositiveNumber(-1)).toBe(false)
      expect(isPositiveNumber(NaN)).toBe(false)
      expect(isPositiveNumber('123')).toBe(false)
      expect(isPositiveNumber(null)).toBe(false)
    })
  })

  describe('isPositiveInteger', () => {
    test('should accept positive integers', () => {
      expect(isPositiveInteger(1)).toBe(true)
      expect(isPositiveInteger(100)).toBe(true)
      expect(isPositiveInteger(42)).toBe(true)
    })

    test('should reject non-positive or non-integer values', () => {
      expect(isPositiveInteger(0)).toBe(false)
      expect(isPositiveInteger(-1)).toBe(false)
      expect(isPositiveInteger(3.14)).toBe(false)
      expect(isPositiveInteger('123')).toBe(false)
      expect(isPositiveInteger(null)).toBe(false)
    })
  })

  describe('hasProperty', () => {
    test('should detect existing properties', () => {
      const obj = { name: 'test', value: 123 }
      
      expect(hasProperty(obj, 'name')).toBe(true)
      expect(hasProperty(obj, 'value')).toBe(true)
    })

    test('should reject missing properties', () => {
      const obj = { name: 'test' }
      
      expect(hasProperty(obj, 'missing')).toBe(false)
      expect(hasProperty(null, 'name')).toBe(false)
      expect(hasProperty(undefined, 'name')).toBe(false)
    })
  })

  describe('isNonEmptyArray', () => {
    test('should accept non-empty arrays', () => {
      expect(isNonEmptyArray([1])).toBe(true)
      expect(isNonEmptyArray(['a', 'b'])).toBe(true)
      expect(isNonEmptyArray([{}, null, 'test'])).toBe(true)
    })

    test('should reject empty arrays and non-arrays', () => {
      expect(isNonEmptyArray([])).toBe(false)
      expect(isNonEmptyArray('not-array')).toBe(false)
      expect(isNonEmptyArray(null)).toBe(false)
      expect(isNonEmptyArray({})).toBe(false)
    })
  })
})