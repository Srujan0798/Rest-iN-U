-- ============================================================================
-- Dharma Realty - PostgreSQL Initialization Script
-- ============================================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create additional schemas
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Grant permissions
GRANT ALL ON SCHEMA public TO dharma;
GRANT ALL ON SCHEMA audit TO dharma;
GRANT ALL ON SCHEMA analytics TO dharma;

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit.activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id UUID,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on audit log
CREATE INDEX IF NOT EXISTS idx_audit_table_record 
    ON audit.activity_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at 
    ON audit.activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user_id 
    ON audit.activity_log(user_id);

-- Create function for audit logging
CREATE OR REPLACE FUNCTION audit.log_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit.activity_log (
            table_name, record_id, action, old_data, user_id
        ) VALUES (
            TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), 
            current_setting('app.current_user_id', true)::UUID
        );
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit.activity_log (
            table_name, record_id, action, old_data, new_data, user_id
        ) VALUES (
            TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW),
            current_setting('app.current_user_id', true)::UUID
        );
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit.activity_log (
            table_name, record_id, action, new_data, user_id
        ) VALUES (
            TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW),
            current_setting('app.current_user_id', true)::UUID
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create analytics tables
CREATE TABLE IF NOT EXISTS analytics.page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path VARCHAR(500) NOT NULL,
    user_id UUID,
    session_id VARCHAR(100),
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    country VARCHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(20),
    browser VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics.property_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    user_id UUID,
    session_id VARCHAR(100),
    source VARCHAR(50),
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics.search_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    session_id VARCHAR(100),
    query TEXT,
    filters JSONB,
    results_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_page_views_created_at 
    ON analytics.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path 
    ON analytics.page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_property_views_property 
    ON analytics.property_views(property_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_queries_created 
    ON analytics.search_queries(created_at DESC);

-- Create helper functions
CREATE OR REPLACE FUNCTION public.calculate_distance(
    lat1 FLOAT, lon1 FLOAT,
    lat2 FLOAT, lon2 FLOAT
) RETURNS FLOAT AS $$
DECLARE
    r FLOAT := 6371; -- Earth's radius in km
    dlat FLOAT;
    dlon FLOAT;
    a FLOAT;
    c FLOAT;
BEGIN
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    RETURN r * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create materialized view for property statistics (refresh periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.property_stats AS
SELECT 
    p.city,
    p.type,
    COUNT(*) as total_properties,
    AVG(p.price) as avg_price,
    MIN(p.price) as min_price,
    MAX(p.price) as max_price,
    AVG(p.area) as avg_area,
    AVG(pv.views_count) as avg_views
FROM (
    SELECT id, city, type, price, area FROM public."Property" WHERE status = 'available'
) p
LEFT JOIN (
    SELECT property_id, COUNT(*) as views_count 
    FROM analytics.property_views 
    WHERE created_at > NOW() - INTERVAL '30 days'
    GROUP BY property_id
) pv ON p.id = pv.property_id
GROUP BY p.city, p.type;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_stats_city_type 
    ON analytics.property_stats(city, type);

-- Set up default permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO dharma;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA audit TO dharma;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA analytics TO dharma;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO dharma;

-- Print completion message
DO $$
BEGIN
    RAISE NOTICE 'Dharma Realty database initialization completed successfully!';
END $$;
