/**
 * 🔍 SEARCH BAR COMPONENT
 * 
 * Barre de recherche pour les serveurs MCP avec suggestions
 * Debounced search et filtres rapides
 */

import React, { useState, useCallback, useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void
  loading?: boolean
  placeholder?: string
  className?: string
  showQuickFilters?: boolean
  initialQuery?: string
}

interface SearchFilters {
  category?: string
  verified?: boolean
  minRating?: number
}

const QUICK_FILTERS = [
  { label: 'Verified Only', key: 'verified', value: true },
  { label: 'High Rating', key: 'minRating', value: 4.0 },
  { label: 'Documentation', key: 'category', value: 'documentation' },
  { label: 'Dev Tools', key: 'category', value: 'dev-tools' },
  { label: 'Productivity', key: 'category', value: 'productivity' },
]

const SEARCH_SUGGESTIONS = [
  'Context7',
  'Serena', 
  'Archon',
  'documentation server',
  'code analysis',
  'project management',
  'filesystem tools',
  'database connectors',
]

export function SearchBar({
  onSearch,
  loading = false,
  placeholder = 'Search MCP servers...',
  className = '',
  showQuickFilters = true,
  initialQuery = '',
}: SearchBarProps) {
  
  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchQuery: string, searchFilters: SearchFilters) => {
      onSearch(searchQuery, searchFilters)
    }, 300),
    [onSearch]
  )

  // Effect pour déclencher la recherche
  useEffect(() => {
    debouncedSearch(query, filters)
  }, [query, filters, debouncedSearch])

  // Gestion des suggestions
  useEffect(() => {
    if (query.length >= 2) {
      const filteredSuggestions = SEARCH_SUGGESTIONS.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      setSuggestions(filteredSuggestions.slice(0, 5))
      setShowSuggestions(filteredSuggestions.length > 0 && document.activeElement?.getAttribute('data-search-input') === 'true')
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Délai pour permettre le clic sur une suggestion
    setTimeout(() => setShowSuggestions(false), 200)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
  }

  const handleQuickFilter = (filterKey: string, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: prev[filterKey as keyof SearchFilters] === value ? undefined : value,
    }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query, filters)
  }

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined).length

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search input with suggestions */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className="pr-12 text-base"
            data-search-input="true"
            disabled={loading}
          />
          
          {/* Search button */}
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            ) : (
              <span className="text-lg">🔍</span>
            )}
          </Button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-accent transition-colors text-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="text-muted-foreground">🔍</span>
                  <span className="ml-2">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Quick filters */}
      {showQuickFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Quick Filters</h3>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-6 px-2"
              >
                Clear ({activeFiltersCount})
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {QUICK_FILTERS.map((filter) => {
              const isActive = filters[filter.key as keyof SearchFilters] === filter.value
              
              return (
                <Badge
                  key={`${filter.key}-${filter.value}`}
                  variant={isActive ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleQuickFilter(filter.key, filter.value)}
                >
                  {filter.label}
                  {isActive && <span className="ml-1">✓</span>}
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {/* Search status */}
      {query && (
        <div className="text-sm text-muted-foreground">
          {loading ? (
            <span>Searching for &quot;{query}&quot;...</span>
          ) : (
            <span>
              Results for &quot;{query}&quot;
              {activeFiltersCount > 0 && ` with ${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''}`}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Utilitaire de debounce
 */
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}