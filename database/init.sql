-- ============================================================================
-- CATALOGUE MCP DATABASE SCHEMA
-- 
-- PostgreSQL schema for MCP servers catalogue with health monitoring,
-- reviews system, and full-text search capabilities.
-- 
-- Version: 1.0.0
-- Created: 2024
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================================
-- CUSTOM TYPES AND ENUMS
-- ============================================================================

-- MCP server categories
CREATE TYPE mcp_category_enum AS ENUM (
    'filesystem',
    'database',
    'web',
    'ai',
    'cloud',
    'dev-tools',
    'communication',
    'productivity',
    'security',
    'monitoring',
    'other'
);

-- Server health status
CREATE TYPE health_status_enum AS ENUM (
    'online',
    'offline',
    'degraded',
    'maintenance',
    'unknown'
);

-- Installation methods
CREATE TYPE installation_method_enum AS ENUM (
    'npm',
    'pip',
    'docker',
    'binary',
    'source'
);

-- Platform support
CREATE TYPE platform_enum AS ENUM (
    'node',
    'python',
    'docker'
);

-- Health check status
CREATE TYPE check_status_enum AS ENUM (
    'healthy',
    'unhealthy',
    'degraded',
    'unknown'
);

-- Tool risk levels
CREATE TYPE risk_level_enum AS ENUM (
    'safe',
    'low',
    'medium',
    'high',
    'dangerous'
);

-- Resource types
CREATE TYPE resource_type_enum AS ENUM (
    'file',
    'directory',
    'database',
    'api',
    'stream',
    'other'
);

-- Resource permissions
CREATE TYPE permission_enum AS ENUM (
    'read',
    'write',
    'delete'
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Server categories lookup table
CREATE TABLE server_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL, -- Hex color code
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Main MCP servers table
CREATE TABLE mcp_servers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic information
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    version VARCHAR(50) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category_id UUID NOT NULL REFERENCES server_categories(id),
    tags TEXT[] DEFAULT '{}',
    
    -- Repository and documentation
    repository_url TEXT NOT NULL,
    documentation_url TEXT,
    homepage_url TEXT,
    license_type VARCHAR(50) NOT NULL,
    license_url TEXT,
    
    -- Installation details
    installation_method installation_method_enum NOT NULL,
    package_name VARCHAR(200),
    docker_image VARCHAR(300),
    configuration_schema JSONB,
    
    -- Platform support
    supported_platforms platform_enum[] NOT NULL,
    minimum_versions JSONB, -- {"node": ">=18.0.0", "python": ">=3.8"}
    
    -- MCP Protocol information
    protocol_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    capabilities JSONB NOT NULL DEFAULT '{}',
    
    -- Status and quality metrics
    health_status health_status_enum DEFAULT 'unknown',
    popularity_score INTEGER DEFAULT 0 CHECK (popularity_score >= 0 AND popularity_score <= 100),
    quality_score INTEGER DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
    review_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
    
    -- Verification and status
    is_verified BOOLEAN DEFAULT FALSE,
    is_deprecated BOOLEAN DEFAULT FALSE,
    deprecation_notice TEXT,
    security_audit_date TIMESTAMPTZ,
    
    -- Search and indexing
    search_vector tsvector,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_health_check TIMESTAMPTZ
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY, -- References auth.users.id
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    avatar_url TEXT,
    github_username VARCHAR(50),
    
    -- Reputation system
    is_verified BOOLEAN DEFAULT FALSE,
    reputation_score INTEGER DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    -- Activity tracking
    last_active_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews and ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    
    -- Community interaction
    helpful_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    
    -- Verification and moderation
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_moderated BOOLEAN DEFAULT FALSE,
    moderation_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(server_id, user_id) -- One review per user per server
);

-- Health monitoring
CREATE TABLE health_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
    
    -- Check results
    timestamp TIMESTAMPTZ NOT NULL,
    status check_status_enum NOT NULL,
    response_time INTEGER NOT NULL, -- milliseconds
    error_message TEXT,
    
    -- Detailed metrics
    details JSONB NOT NULL DEFAULT '{}', -- connection_time, tools_list_time, etc.
    
    -- Indexing
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MCP PROTOCOL TABLES
-- ============================================================================

-- Server tools
CREATE TABLE server_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
    
    -- Tool definition
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    parameters JSONB NOT NULL DEFAULT '[]',
    examples JSONB,
    
    -- Classification
    category VARCHAR(50),
    tags TEXT[] DEFAULT '{}',
    risk_level risk_level_enum DEFAULT 'safe',
    
    -- Capabilities
    rate_limited BOOLEAN DEFAULT FALSE,
    requires_auth BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(server_id, name)
);

-- Server resources
CREATE TABLE server_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
    
    -- Resource definition
    uri VARCHAR(500) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type resource_type_enum NOT NULL,
    
    -- Metadata
    mime_type VARCHAR(100),
    size BIGINT, -- bytes
    permissions permission_enum[] DEFAULT '{}',
    metadata JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(server_id, uri)
);

-- Server prompts (optional MCP feature)
CREATE TABLE server_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
    
    -- Prompt definition
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    arguments JSONB DEFAULT '[]',
    template TEXT NOT NULL,
    
    -- Classification
    category VARCHAR(50),
    tags TEXT[] DEFAULT '{}',
    
    -- Examples
    examples JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(server_id, name)
);

-- ============================================================================
-- ANALYTICS AND METRICS TABLES
-- ============================================================================

-- Server usage analytics
CREATE TABLE server_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
    
    -- Metrics
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    installs INTEGER DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    
    -- Health metrics
    uptime_percentage DECIMAL(5,2),
    avg_response_time INTEGER, -- milliseconds
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(server_id, date)
);

-- Health summaries (materialized view data)
CREATE TABLE health_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
    
    -- Time period
    period VARCHAR(10) NOT NULL, -- '1h', '24h', '7d', '30d'
    
    -- Aggregated metrics
    uptime_percentage DECIMAL(5,2) NOT NULL,
    average_response_time INTEGER NOT NULL,
    total_checks INTEGER NOT NULL,
    failed_checks INTEGER NOT NULL,
    last_check_status check_status_enum NOT NULL,
    last_check_time TIMESTAMPTZ NOT NULL,
    
    -- Timestamps
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(server_id, period)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- MCP servers indexes
CREATE INDEX idx_mcp_servers_category ON mcp_servers(category_id);
CREATE INDEX idx_mcp_servers_status ON mcp_servers(health_status);
CREATE INDEX idx_mcp_servers_verified ON mcp_servers(is_verified);
CREATE INDEX idx_mcp_servers_rating ON mcp_servers(average_rating DESC);
CREATE INDEX idx_mcp_servers_popularity ON mcp_servers(popularity_score DESC);
CREATE INDEX idx_mcp_servers_updated ON mcp_servers(updated_at DESC);
CREATE INDEX idx_mcp_servers_tags ON mcp_servers USING GIN(tags);
CREATE INDEX idx_mcp_servers_platforms ON mcp_servers USING GIN(supported_platforms);
CREATE INDEX idx_mcp_servers_search ON mcp_servers USING GIN(search_vector);

-- Full-text search index
CREATE INDEX idx_mcp_servers_text_search ON mcp_servers USING GIN(
    to_tsvector('english', 
        coalesce(name, '') || ' ' || 
        coalesce(description, '') || ' ' || 
        coalesce(author, '') || ' ' ||
        array_to_string(tags, ' ')
    )
);

-- Reviews indexes
CREATE INDEX idx_reviews_server ON reviews(server_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

-- Health checks indexes
CREATE INDEX idx_health_checks_server ON health_checks(server_id);
CREATE INDEX idx_health_checks_timestamp ON health_checks(timestamp DESC);
CREATE INDEX idx_health_checks_status ON health_checks(status);

-- Server tools indexes
CREATE INDEX idx_server_tools_server ON server_tools(server_id);
CREATE INDEX idx_server_tools_category ON server_tools(category);
CREATE INDEX idx_server_tools_risk ON server_tools(risk_level);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Server stats view
CREATE VIEW server_stats AS
SELECT 
    s.id as server_id,
    s.name,
    s.category_id,
    c.name as category_name,
    s.health_status,
    s.average_rating,
    s.review_count,
    s.is_verified,
    s.created_at,
    s.updated_at,
    COALESCE(hs_7d.uptime_percentage, 0) as uptime_7d,
    COALESCE(hs_30d.uptime_percentage, 0) as uptime_30d,
    COUNT(t.id) as tool_count,
    COUNT(r.id) as resource_count
FROM mcp_servers s
LEFT JOIN server_categories c ON s.category_id = c.id
LEFT JOIN health_summaries hs_7d ON s.id = hs_7d.server_id AND hs_7d.period = '7d'
LEFT JOIN health_summaries hs_30d ON s.id = hs_30d.server_id AND hs_30d.period = '30d'
LEFT JOIN server_tools t ON s.id = t.server_id
LEFT JOIN server_resources r ON s.id = r.server_id
GROUP BY s.id, s.name, s.category_id, c.name, s.health_status, s.average_rating, 
         s.review_count, s.is_verified, s.created_at, s.updated_at,
         hs_7d.uptime_percentage, hs_30d.uptime_percentage;

-- Popular servers view
CREATE VIEW popular_servers AS
SELECT 
    s.*,
    c.name as category_name,
    c.icon as category_icon,
    COALESCE(a.views, 0) as daily_views,
    COALESCE(a.downloads, 0) as daily_downloads
FROM mcp_servers s
LEFT JOIN server_categories c ON s.category_id = c.id
LEFT JOIN server_analytics a ON s.id = a.server_id AND a.date = CURRENT_DATE
WHERE s.is_deprecated = FALSE
ORDER BY s.popularity_score DESC, s.average_rating DESC;

-- ============================================================================
-- FUNCTIONS AND PROCEDURES
-- ============================================================================

-- Update search vector trigger function
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        coalesce(NEW.name, '') || ' ' ||
        coalesce(NEW.description, '') || ' ' ||
        coalesce(NEW.author, '') || ' ' ||
        array_to_string(NEW.tags, ' ')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calculate server quality score function
CREATE OR REPLACE FUNCTION calculate_quality_score(server_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    server_record RECORD;
    tool_count INTEGER;
    resource_count INTEGER;
    recent_health_checks INTEGER;
BEGIN
    -- Get server details
    SELECT * INTO server_record FROM mcp_servers WHERE id = server_id_param;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Base score from verification and completeness
    IF server_record.is_verified THEN score := score + 30; END IF;
    IF server_record.documentation_url IS NOT NULL THEN score := score + 10; END IF;
    IF server_record.homepage_url IS NOT NULL THEN score := score + 5; END IF;
    IF array_length(server_record.tags, 1) >= 3 THEN score := score + 5; END IF;
    
    -- Score from tools and resources
    SELECT COUNT(*) INTO tool_count FROM server_tools WHERE server_id = server_id_param;
    SELECT COUNT(*) INTO resource_count FROM server_resources WHERE server_id = server_id_param;
    
    score := score + LEAST(tool_count * 2, 20); -- Max 20 points for tools
    score := score + LEAST(resource_count, 10); -- Max 10 points for resources
    
    -- Score from reviews and ratings
    IF server_record.review_count > 0 THEN
        score := score + LEAST(server_record.review_count * 2, 20); -- Max 20 points
        score := score + (server_record.average_rating * 2)::INTEGER; -- Max 10 points
    END IF;
    
    -- Score from health monitoring
    SELECT COUNT(*) INTO recent_health_checks 
    FROM health_checks 
    WHERE server_id = server_id_param 
    AND timestamp > NOW() - INTERVAL '7 days';
    
    IF recent_health_checks > 0 THEN score := score + 10; END IF;
    
    RETURN LEAST(score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql;

-- Get server uptime function
CREATE OR REPLACE FUNCTION get_server_uptime(server_id_param UUID, period_param TEXT)
RETURNS DECIMAL AS $$
DECLARE
    uptime_percentage DECIMAL;
    start_time TIMESTAMPTZ;
BEGIN
    -- Determine start time based on period
    CASE period_param
        WHEN '1h' THEN start_time := NOW() - INTERVAL '1 hour';
        WHEN '24h' THEN start_time := NOW() - INTERVAL '24 hours';
        WHEN '7d' THEN start_time := NOW() - INTERVAL '7 days';
        WHEN '30d' THEN start_time := NOW() - INTERVAL '30 days';
        ELSE start_time := NOW() - INTERVAL '24 hours';
    END CASE;
    
    -- Calculate uptime percentage
    SELECT 
        COALESCE(
            (COUNT(CASE WHEN status = 'healthy' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100,
            0
        )
    INTO uptime_percentage
    FROM health_checks
    WHERE server_id = server_id_param
    AND timestamp >= start_time;
    
    RETURN COALESCE(uptime_percentage, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update search vector on server changes
CREATE TRIGGER trigger_update_search_vector
    BEFORE INSERT OR UPDATE ON mcp_servers
    FOR EACH ROW
    EXECUTE FUNCTION update_search_vector();

-- Update timestamps
CREATE TRIGGER trigger_mcp_servers_updated_at
    BEFORE UPDATE ON mcp_servers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default categories
INSERT INTO server_categories (name, description, icon, color, display_order) VALUES
('filesystem', 'File system operations and management', 'folder', '#3B82F6', 1),
('database', 'Database connections and queries', 'database', '#10B981', 2),
('web', 'Web scraping and HTTP requests', 'globe', '#8B5CF6', 3),
('ai', 'AI and machine learning integrations', 'brain', '#F59E0B', 4),
('cloud', 'Cloud service integrations', 'cloud', '#06B6D4', 5),
('dev-tools', 'Development utilities and tools', 'code', '#84CC16', 6),
('communication', 'Chat, email, and messaging', 'message-circle', '#EC4899', 7),
('productivity', 'Task management and productivity', 'calendar', '#6366F1', 8),
('security', 'Authentication and security tools', 'shield', '#EF4444', 9),
('monitoring', 'System monitoring and logging', 'activity', '#14B8A6', 10),
('other', 'Miscellaneous tools and utilities', 'package', '#6B7280', 11);

-- Create indexes on inserted data
REINDEX TABLE mcp_servers;
REINDEX TABLE reviews;
REINDEX TABLE health_checks;

-- ============================================================================
-- GRANTS AND PERMISSIONS
-- ============================================================================

-- Grant permissions for application user
-- Note: In production, create a specific application user with limited permissions

-- Example grants (adjust based on your security requirements):
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO catalogue_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO catalogue_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO catalogue_app_user;