/**
 * 🔲 MCP SERVER GRID
 * 
 * Composant grille pour afficher une liste de serveurs MCP
 * Supporte différents modes d'affichage et responsive design
 */

import React from 'react'

import { McpCard } from './mcp-card'

import type { McpServerSummary } from '@/types/api'

interface McpGridProps {
  servers: McpServerSummary[]
  loading?: boolean
  error?: string
  viewMode?: 'grid' | 'list' | 'compact'
  onServerClick?: (server: McpServerSummary) => void
  onLoadMore?: () => void
  hasMore?: boolean
  className?: string
}

export function McpGrid({
  servers,
  loading = false,
  error,
  viewMode = 'grid',
  onServerClick,
  onLoadMore,
  hasMore = false,
  className = '',
}: McpGridProps) {

  // Loading state
  if (loading && servers.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Discovering MCP servers...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && servers.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="text-lg font-medium mb-2">Failed to load servers</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Empty state
  if (servers.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium mb-2">No MCP servers found</h3>
          <p className="text-muted-foreground mb-6">
            No servers match your current filters. Try adjusting your search criteria.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>💡 Make sure MCP servers are running on your system</p>
            <p>🔗 Check localhost ports: 8051, 8052, 8053</p>
          </div>
        </div>
      </div>
    )
  }

  // Determine grid classes based on view mode
  const gridClasses = getGridClasses(viewMode)
  const compact = viewMode === 'compact'

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found {servers.length} MCP server{servers.length !== 1 ? 's' : ''}
        </p>
        {loading && servers.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Loading more...</span>
          </div>
        )}
      </div>

      {/* Server grid */}
      <div className={gridClasses}>
        {servers.map((server) => (
          <McpCard
            key={server.id}
            server={server}
            onClick={onServerClick}
            compact={compact}
            showHealthBadge={true}
            showCategory={!compact}
            showRating={!compact}
          />
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="text-center py-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                <span>Loading...</span>
              </div>
            ) : (
              'Load More Servers'
            )}
          </button>
        </div>
      )}

      {/* Loading overlay for additional servers */}
      {loading && servers.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-md shadow-lg px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Loading servers...</span>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Détermine les classes CSS pour la grille selon le mode d'affichage
 */
function getGridClasses(viewMode: 'grid' | 'list' | 'compact'): string {
  switch (viewMode) {
    case 'grid':
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    case 'list':
      return 'grid grid-cols-1 lg:grid-cols-2 gap-4'
    case 'compact':
      return 'grid grid-cols-1 gap-2'
    default:
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
  }
}

/**
 * Skeleton loader pour les cartes
 */
export function McpGridSkeleton({ 
  count = 8, 
  viewMode = 'grid' 
}: { 
  count?: number
  viewMode?: 'grid' | 'list' | 'compact'
}) {
  const gridClasses = getGridClasses(viewMode)
  const compact = viewMode === 'compact'

  return (
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={`bg-card border rounded-lg ${compact ? 'h-16' : 'h-64'} animate-pulse`}
        >
          <div className={`p-${compact ? '4' : '6'} space-y-${compact ? '2' : '4'}`}>
            <div className={`h-${compact ? '4' : '6'} bg-muted rounded`} />
            <div className={`h-${compact ? '3' : '4'} bg-muted rounded w-3/4`} />
            {!compact && (
              <>
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}