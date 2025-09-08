/**
 * 🛡️ SECURITY CONFIGURATION
 * 
 * Centralized security settings including Gemini's recommended allow-list
 * for user-configured insecure servers
 */

export interface SecurityConfig {
  readonly enforceHttpsInProduction: boolean
  readonly allowedInsecureUrls: readonly string[]
  readonly logSecurityWarnings: boolean
}

/**
 * 🛡️ GEMINI RECOMMENDATION 3: User-configurable allow-list for insecure servers
 * 
 * Allows users to explicitly trust specific HTTP/WS URLs (typically localhost)
 * while maintaining security by default
 */
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  enforceHttpsInProduction: true,
  allowedInsecureUrls: [
    // Default localhost exemptions for development
    'http://localhost:8051', // Archon
    'http://localhost:8052', // Context7  
    'http://localhost:8053', // Serena
    'http://localhost:8054', // GitHub MCP
    'http://localhost:8055', // Jules
    'http://127.0.0.1:8051',
    'http://127.0.0.1:8052', 
    'http://127.0.0.1:8053',
    'http://127.0.0.1:8054',
    'http://127.0.0.1:8055',
    // WebSocket variants
    'ws://localhost:8051',
    'ws://localhost:8052',
    'ws://localhost:8053', 
    'ws://localhost:8054',
    'ws://localhost:8055',
  ],
  logSecurityWarnings: true,
}

/**
 * Load security configuration from environment and user preferences
 */
export function getSecurityConfig(): SecurityConfig {
  // Allow users to extend the allow-list via environment variable
  const userAllowedUrls = process.env.MCP_ALLOWED_INSECURE_URLS?.split(',') || []
  
  return {
    enforceHttpsInProduction: process.env.MCP_DISABLE_HTTPS_ENFORCEMENT !== 'true',
    allowedInsecureUrls: [
      ...DEFAULT_SECURITY_CONFIG.allowedInsecureUrls,
      ...userAllowedUrls.map(url => url.trim()).filter(Boolean)
    ],
    logSecurityWarnings: process.env.MCP_DISABLE_SECURITY_WARNINGS !== 'true',
  }
}

/**
 * Check if an insecure URL is explicitly allowed by user configuration
 */
export function isInsecureUrlAllowed(url: string, config: SecurityConfig): boolean {
  return config.allowedInsecureUrls.includes(url)
}

/**
 * Validate URL against security policy
 */
export function validateUrl(url: string, config?: SecurityConfig): {
  allowed: boolean
  reason: string
  warning?: string
} {
  const securityConfig = config || getSecurityConfig()
  const urlObj = new URL(url)
  const isProd = process.env.NODE_ENV === 'production'
  const isSecure = urlObj.protocol === 'https:' || urlObj.protocol === 'wss:'
  
  // Always allow secure protocols
  if (isSecure) {
    return { allowed: true, reason: 'Secure protocol' }
  }
  
  // In production, check enforcement policy
  if (isProd && securityConfig.enforceHttpsInProduction) {
    // Check if URL is in allow-list
    if (isInsecureUrlAllowed(url, securityConfig)) {
      return {
        allowed: true,
        reason: 'Explicitly allowed in configuration',
        warning: `🚨 Insecure protocol ${urlObj.protocol} allowed via configuration in PRODUCTION`
      }
    }
    
    return {
      allowed: false,
      reason: `Insecure protocol ${urlObj.protocol} is disabled in production. Add to MCP_ALLOWED_INSECURE_URLS if needed.`
    }
  }
  
  // In development, warn but allow
  return {
    allowed: true,
    reason: 'Development mode allows insecure protocols',
    warning: `⚠️ Insecure protocol ${urlObj.protocol} - disabled in production`
  }
}