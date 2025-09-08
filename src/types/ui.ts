/**
 * 🎨 UI COMPONENT TYPES
 * 
 * Type definitions for React components, forms, and UI state management.
 * Includes component props, form schemas, and UI utilities.
 */

import { type ReactNode } from 'react'

import type { ReviewData, McpServerSummary } from './api'
import type { McpServer, HealthStatus } from './mcp'

// ============================================================================
// FORM TYPES
// ============================================================================

/**
 * MCP search form data
 */
export interface McpSearchForm {
  readonly query: string
  readonly category?: string
  readonly tags: readonly string[]
  readonly status?: 'online' | 'offline' | 'degraded' | 'maintenance' | 'unknown'
  readonly verified?: boolean
  readonly minRating?: number
  readonly installationMethod?: 'npm' | 'pip' | 'docker' | 'binary' | 'source'
  readonly platform?: string
}

/**
 * Advanced filter form
 */
export interface McpFilterForm {
  readonly categories: readonly string[]
  readonly tags: readonly string[]
  readonly statuses: readonly ('online' | 'offline' | 'degraded' | 'maintenance' | 'unknown')[]
  readonly verified?: boolean
  readonly hasDocumentation?: boolean
  readonly minRating: number
  readonly maxRating: number
  readonly installationMethods: readonly ('npm' | 'pip' | 'docker' | 'binary' | 'source')[]
  readonly platforms: readonly string[]
  readonly licenses: readonly string[]
  readonly updatedWithin?: '1d' | '7d' | '30d' | '90d' | 'all'
}

/**
 * Review submission form
 */
export interface ReviewSubmissionForm {
  readonly rating: 1 | 2 | 3 | 4 | 5
  readonly title: string
  readonly content: string
  readonly serverId: string
}

/**
 * MCP server submission form
 */
export interface McpSubmissionForm {
  readonly name: string
  readonly description: string
  readonly version: string
  readonly author: string
  readonly categoryId: string
  readonly tags: readonly string[]
  readonly repositoryUrl: string
  readonly documentationUrl?: string
  readonly homepageUrl?: string
  readonly licenseType: string
  readonly licenseUrl?: string
  readonly installationMethod: 'npm' | 'pip' | 'docker' | 'binary' | 'source'
  readonly packageName?: string
  readonly dockerImage?: string
  readonly supportedPlatforms: readonly string[]
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * MCP server card component props
 */
export interface McpCardProps {
  readonly server: McpServerSummary
  readonly onClick?: (server: McpServerSummary) => void
  readonly showHealthBadge?: boolean
  readonly showCategory?: boolean
  readonly showRating?: boolean
  readonly compact?: boolean
  readonly className?: string
}

/**
 * MCP server detail page props
 */
export interface McpDetailProps {
  readonly serverId: string
  readonly server: McpServer
  readonly reviews: readonly ReviewData[]
  readonly healthMetrics: readonly {
    readonly timestamp: string
    readonly status: HealthStatus
    readonly responseTime: number
  }[]
  readonly onReviewSubmit?: (review: ReviewSubmissionForm) => Promise<void>
  readonly onInstallClick?: (server: McpServer) => void
}

/**
 * Health status badge props
 */
export interface HealthBadgeProps {
  readonly status: HealthStatus
  readonly lastCheck?: string
  readonly uptime?: number
  readonly showDetails?: boolean
  readonly size?: 'sm' | 'md' | 'lg'
  readonly className?: string
}

/**
 * Review list component props
 */
export interface ReviewListProps {
  readonly reviews: readonly ReviewData[]
  readonly loading?: boolean
  readonly onLoadMore?: () => void
  readonly hasMore?: boolean
  readonly onHelpfulClick?: (reviewId: string) => void
  readonly onReportClick?: (reviewId: string) => void
}

/**
 * Search results component props
 */
export interface SearchResultsProps {
  readonly results: readonly McpServerSummary[]
  readonly loading?: boolean
  readonly error?: string
  readonly total: number
  readonly query: string
  readonly onServerClick?: (server: McpServerSummary) => void
  readonly onLoadMore?: () => void
  readonly hasMore?: boolean
}

/**
 * Filter sidebar component props
 */
export interface FilterSidebarProps {
  readonly filters: McpFilterForm
  readonly onFiltersChange: (filters: Partial<McpFilterForm>) => void
  readonly availableCategories: readonly { id: string; name: string; count: number }[]
  readonly availableTags: readonly { name: string; count: number }[]
  readonly isOpen: boolean
  readonly onToggle: () => void
}

/**
 * Pagination component props
 */
export interface PaginationProps {
  readonly currentPage: number
  readonly totalPages: number
  readonly onPageChange: (page: number) => void
  readonly showFirstLast?: boolean
  readonly showPrevNext?: boolean
  readonly maxVisiblePages?: number
  readonly className?: string
}

/**
 * Sort selector props
 */
export interface SortSelectorProps {
  readonly value: SortOption
  readonly onChange: (sort: SortOption) => void
  readonly options: readonly SortOption[]
  readonly className?: string
}

/**
 * Installation modal props
 */
export interface InstallationModalProps {
  readonly server: McpServer
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onInstall?: (config: { method: string; config: Record<string, unknown> }) => void
}

// ============================================================================
// STATE MANAGEMENT TYPES
// ============================================================================

/**
 * Global catalogue state
 */
export interface CatalogueState {
  readonly servers: readonly McpServerSummary[]
  readonly selectedServer: McpServer | null
  readonly loading: boolean
  readonly error: string | null
  readonly pagination: {
    readonly page: number
    readonly limit: number
    readonly total: number
    readonly hasMore: boolean
  }
}

/**
 * Filter state management
 */
export interface FilterState {
  readonly active: McpFilterForm
  readonly applied: McpFilterForm
  readonly hasChanges: boolean
  readonly presets: readonly {
    readonly name: string
    readonly filters: McpFilterForm
  }[]
}

/**
 * Search state
 */
export interface SearchState {
  readonly query: string
  readonly filters: McpFilterForm
  readonly sort: SortOption
  readonly viewMode: ViewMode
  readonly results: readonly McpServerSummary[]
  readonly loading: boolean
  readonly error: string | null
  readonly suggestions: readonly string[]
}

/**
 * Review state
 */
export interface ReviewState {
  readonly reviews: readonly ReviewData[]
  readonly loading: boolean
  readonly error: string | null
  readonly submitting: boolean
  readonly canSubmit: boolean
  readonly userReview?: ReviewData
}

/**
 * Health monitoring state
 */
export interface HealthState {
  readonly checks: Record<string, {
    readonly status: HealthStatus
    readonly lastCheck: string
    readonly uptime: number
    readonly responseTime: number
  }>
  readonly monitoring: boolean
  readonly interval: number
}

// ============================================================================
// UI UTILITY TYPES
// ============================================================================

/**
 * Sort options for server listings
 */
export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'rating-asc'
  | 'rating-desc'
  | 'updated-asc'
  | 'updated-desc'
  | 'popularity-asc'
  | 'popularity-desc'
  | 'health-asc'
  | 'health-desc'

/**
 * View modes for server listings
 */
export type ViewMode = 'grid' | 'list' | 'compact'

/**
 * Loading states
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * Theme configuration
 */
export interface ThemeConfig {
  readonly mode: 'light' | 'dark' | 'system'
  readonly colors: {
    readonly primary: string
    readonly secondary: string
    readonly accent: string
    readonly background: string
    readonly foreground: string
  }
  readonly fonts: {
    readonly sans: string
    readonly mono: string
  }
}

/**
 * Responsive breakpoints
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Animation variants
 */
export interface AnimationVariants {
  readonly initial: Record<string, unknown>
  readonly animate: Record<string, unknown>
  readonly exit: Record<string, unknown>
  readonly transition: Record<string, unknown>
}

// ============================================================================
// HOOK TYPES
// ============================================================================

/**
 * Use MCP servers hook return type
 */
export interface UseMcpServersResult {
  readonly servers: readonly McpServerSummary[]
  readonly loading: boolean
  readonly error: string | null
  readonly refetch: () => void
  readonly loadMore: () => void
  readonly hasMore: boolean
}

/**
 * Use search hook return type
 */
export interface UseSearchResult {
  readonly query: string
  readonly setQuery: (query: string) => void
  readonly filters: McpFilterForm
  readonly setFilters: (filters: Partial<McpFilterForm>) => void
  readonly sort: SortOption
  readonly setSort: (sort: SortOption) => void
  readonly results: readonly McpServerSummary[]
  readonly loading: boolean
  readonly error: string | null
  readonly search: () => void
  readonly clearSearch: () => void
}

/**
 * Use health monitoring hook return type
 */
export interface UseHealthMonitoringResult {
  readonly healthData: Record<string, {
    readonly status: HealthStatus
    readonly uptime: number
    readonly lastCheck: string
  }>
  readonly isMonitoring: boolean
  readonly startMonitoring: () => void
  readonly stopMonitoring: () => void
  readonly checkHealth: (serverId: string) => Promise<void>
}

// ============================================================================
// LAYOUT AND NAVIGATION
// ============================================================================

/**
 * Navigation item
 */
export interface NavItem {
  readonly label: string
  readonly href: string
  readonly icon?: ReactNode
  readonly badge?: string | number
  readonly children?: readonly NavItem[]
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  readonly label: string
  readonly href?: string
  readonly icon?: ReactNode
  readonly current?: boolean
}

/**
 * Layout props
 */
export interface LayoutProps {
  readonly children: ReactNode
  readonly title?: string
  readonly description?: string
  readonly showSidebar?: boolean
  readonly showHeader?: boolean
  readonly showFooter?: boolean
  readonly className?: string
}

/**
 * Modal props
 */
export interface ModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly title?: string
  readonly description?: string
  readonly children: ReactNode
  readonly size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  readonly closeOnOverlayClick?: boolean
  readonly closeOnEscape?: boolean
}

// ============================================================================
// DATA VISUALIZATION
// ============================================================================

/**
 * Chart data point
 */
export interface ChartDataPoint {
  readonly x: string | number
  readonly y: string | number
  readonly label?: string
  readonly color?: string
}

/**
 * Health chart props
 */
export interface HealthChartProps {
  readonly data: readonly {
    readonly timestamp: string
    readonly status: HealthStatus
    readonly responseTime: number
  }[]
  readonly period: '1h' | '24h' | '7d' | '30d'
  readonly height?: number
  readonly showLegend?: boolean
  readonly interactive?: boolean
}

/**
 * Stats card props
 */
export interface StatsCardProps {
  readonly title: string
  readonly value: string | number
  readonly change?: {
    readonly value: number
    readonly direction: 'up' | 'down' | 'neutral'
    readonly period: string
  }
  readonly icon?: ReactNode
  readonly color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
  readonly loading?: boolean
}