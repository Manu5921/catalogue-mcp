/**
 * 🔍 SERVER DETAILS PAGE
 * 
 * Page de détail d'un serveur MCP avec informations complètes
 * Affiche: métriques santé, outils, ressources, installation
 */

import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { McpConnectionManager } from '@/lib/mcp/connection'
import { McpDiscoveryService } from '@/lib/mcp/discovery'
import { McpHealthMonitor } from '@/lib/mcp/health-monitor'
import type { McpServerDetails, HealthMetrics, McpTool, McpResource } from '@/types/mcp'

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const serverDetails = await getServerDetails(params.id)
  
  if (!serverDetails) {
    return {
      title: 'Server Not Found - MCP Catalogue'
    }
  }

  return {
    title: `${serverDetails.name} - MCP Catalogue`,
    description: serverDetails.description,
    openGraph: {
      title: serverDetails.name,
      description: serverDetails.description,
      type: 'article',
    }
  }
}

export default async function ServerDetailPage({ params }: PageProps) {
  const serverDetails = await getServerDetails(params.id)
  
  if (!serverDetails) {
    notFound()
  }

  const healthMetrics = await getHealthMetrics(params.id)
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Server Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="text-6xl">{serverDetails.category.icon}</div>
            <div className="min-w-0 flex-1">
              <h1 className="text-4xl font-bold mb-2">{serverDetails.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{serverDetails.description}</p>
              <div className="flex items-center space-x-3">
                <Badge variant="outline">v{serverDetails.version}</Badge>
                {serverDetails.isVerified && (
                  <Badge variant="info">✓ Verified</Badge>
                )}
                <Badge variant={getHealthVariant(serverDetails.healthStatus)}>
                  {serverDetails.healthStatus}
                </Badge>
                <span className="text-sm text-muted-foreground">by {serverDetails.author}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              📋 Copy Config
            </Button>
            <Button>
              🚀 Install Server
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <Badge variant="outline">{serverDetails.category.name}</Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Rating</h4>
                  <div className="flex items-center space-x-2">
                    {serverDetails.averageRating > 0 ? (
                      <>
                        <span>⭐</span>
                        <span className="font-medium">{serverDetails.averageRating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">
                          ({serverDetails.reviewCount} reviews)
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No reviews yet</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {serverDetails.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Last Updated</h4>
                <p className="text-muted-foreground">
                  {new Date(serverDetails.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Health Metrics */}
          {healthMetrics && (
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics</CardTitle>
                <CardDescription>Server performance and availability over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {(healthMetrics.uptime * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Uptime (30d)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {healthMetrics.avgResponseTime}ms
                    </div>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {healthMetrics.errorRate.toFixed(2)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Available Tools ({serverDetails.tools.length})</CardTitle>
              <CardDescription>MCP tools provided by this server</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serverDetails.tools.map((tool) => (
                  <ToolCard key={tool.name} tool={tool} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          {serverDetails.resources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resources ({serverDetails.resources.length})</CardTitle>
                <CardDescription>Data resources exposed by this server</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serverDetails.resources.map((resource) => (
                    <ResourceCard key={resource.uri} resource={resource} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Installation */}
          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Server URL</h4>
                <code className="bg-muted p-2 rounded text-sm block">
                  {serverDetails.config.serverUrl || `http://localhost:${serverDetails.config.port}`}
                </code>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Configuration</h4>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{JSON.stringify({
  name: serverDetails.name,
  url: serverDetails.config.serverUrl || `http://localhost:${serverDetails.config.port}`,
  ...(serverDetails.config.auth && { auth: serverDetails.config.auth })
}, null, 2)}
                </pre>
              </div>

              <Button className="w-full">
                📋 Copy to Claude Code
              </Button>
            </CardContent>
          </Card>

          {/* Documentation */}
          {serverDetails.documentation && (
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {serverDetails.documentation.readme && (
                  <a
                    href={serverDetails.documentation.readme}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-muted rounded hover:bg-muted/80 transition-colors"
                  >
                    📖 README
                  </a>
                )}
                {serverDetails.documentation.examples && (
                  <a
                    href={serverDetails.documentation.examples}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-muted rounded hover:bg-muted/80 transition-colors"
                  >
                    💡 Examples
                  </a>
                )}
                {serverDetails.documentation.api && (
                  <a
                    href={serverDetails.documentation.api}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-muted rounded hover:bg-muted/80 transition-colors"
                  >
                    🔧 API Docs
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                🔧 Test Connection
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📊 View Metrics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                ⚙️ Configure
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🐛 Report Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Tool Card Component
function ToolCard({ tool }: { tool: McpTool }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium">{tool.name}</h4>
        <Badge variant="outline" className="text-xs">
          {tool.inputSchema?.properties ? Object.keys(tool.inputSchema.properties).length : 0} params
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
      
      {tool.inputSchema?.properties && (
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-muted-foreground uppercase">Parameters</h5>
          <div className="flex flex-wrap gap-1">
            {Object.entries(tool.inputSchema.properties).map(([param, schema]) => (
              <Badge key={param} variant="secondary" className="text-xs">
                {param}
                {tool.inputSchema?.required?.includes(param) && '*'}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Resource Card Component
function ResourceCard({ resource }: { resource: McpResource }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium">{resource.name}</h4>
        <Badge variant="outline" className="text-xs">
          {resource.mimeType || 'unknown'}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
      <code className="text-xs bg-muted p-1 rounded">{resource.uri}</code>
    </div>
  )
}

// Helper Functions
async function getServerDetails(id: string): Promise<McpServerDetails | null> {
  try {
    // Try to get from discovery service first
    const discoveryService = McpDiscoveryService.getInstance()
    const discoveryResult = await discoveryService.discoverServers({
      includeUnhealthy: true,
      maxConcurrentChecks: 10
    })
    
    const server = discoveryResult.servers.find(s => s.id === id)
    if (server) {
      // Get additional details via connection
      const connectionManager = McpConnectionManager.getInstance()
      const connectionResult = await connectionManager.connect(server.config.serverUrl!, {
        timeout: 5000,
        retries: 1
      })
      
      if (connectionResult.success && connectionResult.connection) {
        const tools = connectionResult.connection.tools || []
        const resources = connectionResult.connection.resources || []
        
        return {
          ...server,
          tools,
          resources,
          documentation: {
            readme: server.config.documentation?.readme,
            examples: server.config.documentation?.examples,
            api: server.config.documentation?.api
          }
        } as McpServerDetails
      }
    }
    
    return null
  } catch (error) {
    console.error('Failed to get server details:', error)
    return null
  }
}

async function getHealthMetrics(serverId: string): Promise<HealthMetrics | null> {
  try {
    const healthMonitor = McpHealthMonitor.getInstance()
    return healthMonitor.calculateMetrics(serverId, '30d')
  } catch (error) {
    console.error('Failed to get health metrics:', error)
    return null
  }
}

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