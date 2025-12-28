-- Database schema for Chuchi app
-- Run this script in your Neon PostgreSQL database

-- Create enum types
CREATE TYPE media_type AS ENUM ('image', 'video');
CREATE TYPE context_type AS ENUM ('gallery', 'trip');
CREATE TYPE queue_category AS ENUM ('upload', 'removed', 'orphaned');

-- Trips table - stores trip metadata
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Media items table - stores all uploaded media
CREATE TABLE media_items (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    cloudinary_url TEXT NOT NULL,
    type media_type NOT NULL,
    original_filename VARCHAR(255),
    file_size INTEGER,
    uploaded_by VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Media assignments table - links media to contexts (gallery/trips)
CREATE TABLE media_assignments (
    id SERIAL PRIMARY KEY,
    media_id INTEGER REFERENCES media_items(id) ON DELETE CASCADE,
    context_type context_type NOT NULL,
    context_id INTEGER, -- NULL for gallery, trip ID for trips
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    assigned_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_trip FOREIGN KEY (context_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Queue items table - temporary storage for unassigned media
CREATE TABLE queue_items (
    id SERIAL PRIMARY KEY,
    media_id INTEGER REFERENCES media_items(id) ON DELETE CASCADE,
    queue_category queue_category NOT NULL,
    source_context VARCHAR(255),
    source_description TEXT,
    added_to_queue_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_media_assignments_media_id ON media_assignments(media_id);
CREATE INDEX idx_media_assignments_context ON media_assignments(context_type, context_id);
CREATE INDEX idx_queue_items_media_id ON queue_items(media_id);
CREATE INDEX idx_queue_items_category ON queue_items(queue_category);

-- Insert some sample data for testing
INSERT INTO trips (title, location, date, description) VALUES 
('Sample Trip', 'Test Location', '2025-01-15', 'A sample trip for testing');

COMMENT ON TABLE trips IS 'Stores trip metadata and information';
COMMENT ON TABLE media_items IS 'Stores all uploaded media files with Cloudinary URLs';
COMMENT ON TABLE media_assignments IS 'Links media items to contexts (gallery or specific trips)';
COMMENT ON TABLE queue_items IS 'Temporary storage for unassigned or removed media items';