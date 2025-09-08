/**
 * 🃏 MCP SERVER CARD
 * 
 * Composant carte pour afficher un serveur MCP dans la liste
 * Affiche: nom, description, catégorie, tags, santé, rating
 */

import Link from 'next/link'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import type { McpServerSummary } from '@/types/api'

interface McpCardProps {
  server: McpServerSummary
  onClick?: (server: McpServerSummary) => void
  showHealthBadge?: boolean
  showCategory?: boolean
  showRating?: boolean
  compact?: boolean
  className?: string
}

export function McpCard({
  server,
  onClick,
  showHealthBadge = true,
  showCategory = true,
  showRating = true,
  compact = false,
  className = '',
}: McpCardProps) {
  
  const handleClick = () => {
    if (onClick) {
      onClick(server)
    }
  }

  const healthVariant = getHealthVariant(server.healthStatus)
  const categoryIcon = server.category.icon || '📦'

  if (compact) {
    return (
      <Card className={`hover:shadow-md transition-shadow cursor-pointer ${className}`} onClick={handleClick}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <span className="text-lg">{categoryIcon}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm truncate">{server.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{server.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-2">
              {showHealthBadge && (
                <Badge variant={healthVariant} className="text-xs">
                  {server.healthStatus}
                </Badge>
              )}
              {showRating && server.averageRating > 0 && (
                <div className="flex items-center text-xs">
                  <span>⭐</span>
                  <span className="ml-1">{server.averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${className}`} onClick={handleClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <span className="text-xl">{categoryIcon}</span>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg truncate">{server.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  v{server.version}
                </Badge>
                {server.isVerified && (
                  <Badge variant="info" className="text-xs">
                    ✓ Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {showHealthBadge && (
            <Badge variant={healthVariant}>
              {server.healthStatus}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {server.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Author and Category */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>by {server.author}</span>
            {showCategory && (
              <Badge variant="outline" className="text-xs">
                {server.category.name}
              </Badge>
            )}
          </div>

          {/* Tags */}
          {server.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {server.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {server.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{server.tags.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Rating and Reviews */}
          {showRating && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {server.averageRating > 0 ? (
                  <>
                    <div className="flex items-center">
                      <span>⭐</span>
                      <span className="ml-1 text-sm font-medium">
                        {server.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({server.reviewCount} reviews)
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">No reviews yet</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                Updated {formatLastUpdated(server.lastUpdated)}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <Link href={`/server/${server.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          <Button size="sm" onClick={(e) => {
            e.stopPropagation()
            // Future: Quick install action
            console.log('Install:', server.name)
          }}>
            Install
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

/**
 * Détermine la variante du badge de santé
 */
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

/**
 * Formate la date de dernière mise à jour
 */
function formatLastUpdated(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    
    // Moins d'une heure
    if (diffMs < 60 * 60 * 1000) {
      const minutes = Math.floor(diffMs / (60 * 1000))
      return `${minutes}m ago`
    }
    
    // Moins d'un jour
    if (diffMs < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diffMs / (60 * 60 * 1000))
      return `${hours}h ago`
    }
    
    // Moins d'une semaine
    if (diffMs < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diffMs / (24 * 60 * 60 * 1000))
      return `${days}d ago`
    }
    
    // Format date complète
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    })
    
  } catch {
    return 'Unknown'
  }
}