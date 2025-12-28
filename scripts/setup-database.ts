import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { trips, mediaItems, mediaAssignments } from '../lib/db';

// Load environment variables
config({ path: '.env.local' });

export async function setupDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test database connection
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful');

    const db = drizzle(sql);
    
    // Check if tables exist
    console.log('🔍 Checking database schema...');
    
    try {
      // Try to query each table to see if it exists
      await db.select().from(trips).limit(1);
      console.log('✅ Trips table exists');
    } catch (error) {
      console.log('⚠️ Trips table missing - creating schema...');
      throw new Error('Database schema needs to be created. Please run: npx drizzle-kit push:pg');
    }

    try {
      await db.select().from(mediaItems).limit(1);
      console.log('✅ Media items table exists');
    } catch (error) {
      console.log('⚠️ Media items table missing');
      throw new Error('Database schema needs to be created. Please run: npx drizzle-kit push:pg');
    }

    try {
      await db.select().from(mediaAssignments).limit(1);
      console.log('✅ Media assignments table exists');
    } catch (error) {
      console.log('⚠️ Media assignments table missing');
      throw new Error('Database schema needs to be created. Please run: npx drizzle-kit push:pg');
    }

    console.log('🎉 Database setup complete!');
    return db;
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Database setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}