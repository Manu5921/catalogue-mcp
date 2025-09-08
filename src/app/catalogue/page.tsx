/**
 * 📋 CATALOGUE PAGE
 * 
 * Page principale du catalogue des serveurs MCP
 * Recherche, filtres, liste des serveurs avec pagination
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'

import { McpGrid, McpGridSkeleton } from '@/components/catalogue/mcp-grid'
import { SearchBar } from '@/components/catalogue/search-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { McpServerSummary, GetMcpsResponse } from '@/types/api'

interface SearchFilters {
  category?: string
  verified?: boolean
  minRating?: number
}

interface CatalogueState {
  servers: McpServerSummary[]
  loading: boolean
  error: string | null
  searchQuery: string
  filters: SearchFilters
  viewMode: 'grid' | 'list' | 'compact'
  page: number
  hasMore: boolean
  total: number
}

const VIEW_MODES: Array<{ 
  key: 'grid' | 'list' | 'compact'
  label: string
  icon: string 
}> = [
  { key: 'grid', label: 'Grid', icon: '⊞' },
  { key: 'list', label: 'List', icon: '☰' },
  { key: 'compact', label: 'Compact', icon: '≡' },
]

export default function CataloguePage() {
  const [state, setState] = useState<CatalogueState>({
    servers: [],
    loading: true,
    error: null,
    searchQuery: '',
    filters: {},
    viewMode: 'grid',
    page: 1,
    hasMore: false,
    total: 0,
  })

  // Chargement initial des serveurs
  useEffect(() => {
    loadServers(true)
  }, [])

  // Chargement des serveurs MCP
  const loadServers = useCallback(async (reset: boolean = false) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }))

    try {
      const params = new URLSearchParams({
        page: reset ? '1' : state.page.toString(),
        limit: '20',
        ...(state.searchQuery && { search: state.searchQuery }),
        ...(state.filters.category && { category: state.filters.category }),
        ...(state.filters.verified !== undefined && { verified: state.filters.verified.toString() }),
        ...(state.filters.minRating && { minRating: state.filters.minRating.toString() }),
      })

      const response = await fetch(`/api/mcps?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: GetMcpsResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to load servers')
      }

      setState(prev => ({
        ...prev,
        servers: reset ? data.data : [...prev.servers, ...data.data],
        loading: false,
        error: null,
        page: reset ? 2 : prev.page + 1,
        hasMore: data.pagination.hasNext,
        total: data.pagination.total,
      }))

    } catch (error) {
      console.error('Failed to load MCP servers:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load servers',
      }))
    }
  }, [state.page, state.searchQuery, state.filters])

  // Gestion de la recherche
  const handleSearch = useCallback((query: string, filters: SearchFilters = {}) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      filters,
      page: 1,
      servers: [],
    }))

    // Déclencher le rechargement avec les nouveaux critères
    setTimeout(() => loadServers(true), 100)
  }, [loadServers])

  // Changement de mode d'affichage
  const handleViewModeChange = (mode: 'grid' | 'list' | 'compact') => {
    setState(prev => ({ ...prev, viewMode: mode }))
  }

  // Clic sur un serveur
  const handleServerClick = (server: McpServerSummary) => {
    console.log('Server clicked:', server.name)
    // Future: Navigation vers la page de détail
    window.location.href = `/server/${server.id}`
  }

  // Charger plus de serveurs
  const handleLoadMore = () => {
    if (!state.loading && state.hasMore) {
      loadServers(false)
    }
  }

  // Retry en cas d'erreur
  const handleRetry = () => {
    loadServers(true)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">MCP Server Catalogue</h1>
        <p className="text-lg text-muted-foreground">
          Discover and connect to Model Context Protocol servers
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          loading={state.loading}
          placeholder="Search servers, tools, or categories..."
          showQuickFilters={true}
          initialQuery={state.searchQuery}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            {state.loading && state.servers.length === 0 ? (
              'Searching...'
            ) : state.error ? (
              'Search failed'
            ) : (
              `${state.total} server${state.total !== 1 ? 's' : ''} found`
            )}
          </div>

          {/* Active filters */}
          {Object.entries(state.filters).map(([key, value]) => {
            if (value === undefined) return null
            
            return (
              <Badge key={key} variant="outline" className="text-xs">
                {key}: {value.toString()}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => {
                    const newFilters = { ...state.filters }
                    delete newFilters[key as keyof SearchFilters]
                    handleSearch(state.searchQuery, newFilters)
                  }}
                >
                  ×
                </button>
              </Badge>
            )
          })}
        </div>

        {/* View mode selector */}
        <div className="flex items-center space-x-1 border rounded-md p-1">
          {VIEW_MODES.map((mode) => (
            <Button
              key={mode.key}
              variant={state.viewMode === mode.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange(mode.key)}
              className="px-3"
            >
              <span className="mr-1">{mode.icon}</span>
              {mode.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-6">
        {/* Error state */}
        {state.error && state.servers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-medium mb-2">Failed to load servers</h3>
            <p className="text-muted-foreground mb-6">{state.error}</p>
            <Button onClick={handleRetry}>Try Again</Button>
          </div>
        )}

        {/* Loading skeleton */}
        {state.loading && state.servers.length === 0 && !state.error && (
          <McpGridSkeleton count={8} viewMode={state.viewMode} />
        )}

        {/* Server grid */}
        {!state.error && (
          <McpGrid
            servers={state.servers}
            loading={state.loading}
            viewMode={state.viewMode}
            onServerClick={handleServerClick}
            onLoadMore={handleLoadMore}
            hasMore={state.hasMore}
          />
        )}

        {/* Empty state for search */}
        {!state.loading && !state.error && state.servers.length === 0 && state.searchQuery && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium mb-2">No servers found</h3>
            <p className="text-muted-foreground mb-6">
              No servers match your search "{state.searchQuery}". Try different keywords or remove filters.
            </p>
            <Button 
              variant="outline"
              onClick={() => handleSearch('', {})}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>
          MCP servers are automatically discovered from your local environment.
        </p>
        <p className="mt-1">
          Make sure your MCP servers are running and accessible.
        </p>
      </div>
    </div>
  )
}