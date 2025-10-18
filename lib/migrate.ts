import { sql } from '@vercel/postgres';

export async function createTables() {
  try {
    console.log('Creating database tables...');

    // Create ENUM types
    await sql`
      DO $$ BEGIN
        CREATE TYPE media_type AS ENUM ('image', 'video');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        CREATE TYPE context_type AS ENUM ('gallery', 'trip');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        CREATE TYPE queue_category AS ENUM ('upload', 'removed', 'orphaned');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create trips table
    await sql`
      CREATE TABLE IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        date VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Create media_items table
    await sql`
      CREATE TABLE IF NOT EXISTS media_items (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        cloudinary_url TEXT NOT NULL,
        type media_type NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        file_size INTEGER,
        uploaded_by VARCHAR(100),
        uploaded_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Create media_assignments table
    await sql`
      CREATE TABLE IF NOT EXISTS media_assignments (
        id SERIAL PRIMARY KEY,
        media_id INTEGER REFERENCES media_items(id) NOT NULL,
        context_type context_type NOT NULL,
        context_id INTEGER,
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        assigned_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Create queue_items table
    await sql`
      CREATE TABLE IF NOT EXISTS queue_items (
        id SERIAL PRIMARY KEY,
        media_id INTEGER REFERENCES media_items(id) NOT NULL,
        source_context VARCHAR(255),
        source_description TEXT,
        queue_category queue_category NOT NULL,
        added_to_queue_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_media_assignments_context ON media_assignments(context_type, context_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_media_assignments_media ON media_assignments(media_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_queue_items_media ON queue_items(media_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_queue_items_category ON queue_items(queue_category);`;

    console.log('Database tables created successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error creating tables:', error);
    return { success: false, error };
  }
}

export async function dropTables() {
  try {
    console.log('Dropping database tables...');
    
    await sql`DROP TABLE IF EXISTS queue_items CASCADE;`;
    await sql`DROP TABLE IF EXISTS media_assignments CASCADE;`;
    await sql`DROP TABLE IF EXISTS media_items CASCADE;`;
    await sql`DROP TABLE IF EXISTS trips CASCADE;`;
    
    await sql`DROP TYPE IF EXISTS queue_category;`;
    await sql`DROP TYPE IF EXISTS context_type;`;
    await sql`DROP TYPE IF EXISTS media_type;`;
    
    console.log('Database tables dropped successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error dropping tables:', error);
    return { success: false, error };
  }
}