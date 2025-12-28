#!/usr/bin/env tsx

import { setupDatabase } from './setup-database';
import { staticTripsData } from '../lib/data-fetchers';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { trips, mediaItems, mediaAssignments } from '../lib/db';

async function runMigration() {
  console.log('🚀 Starting migration from static data to database...\n');

  try {
    // First, try to set up database connection
    console.log('📋 Step 1: Database Connection Setup');
    let db;
    
    try {
      db = await setupDatabase();
      console.log('✅ Database connection established\n');
    } catch (error) {
      console.log('❌ Database connection failed:');
      console.log(error);
      console.log('\n📝 Migration Status: SKIPPED');
      console.log('💡 To complete migration:');
      console.log('   1. Set up your database connection in .env.local');
      console.log('   2. Add: POSTGRES_URL="your-connection-string"');
      console.log('   3. Run: npm run migrate-data');
      console.log('\n📊 Static Data Summary:');
      console.log(`   • ${staticTripsData.length} trips ready for migration`);
      console.log(`   • ${staticTripsData.reduce((acc: number, trip: any) => acc + trip.media.length, 0)} media items ready for migration`);
      return;
    }

    // Count existing data
    const existingTrips = await db.select().from(trips);
    const existingMedia = await db.select().from(mediaItems);
    
    if (existingTrips.length > 0) {
      console.log(`⚠️ Found ${existingTrips.length} existing trips in database`);
      console.log('❓ Migration options:');
      console.log('   1. Skip migration (data already exists)');
      console.log('   2. Clear and re-migrate');
      console.log('\n📝 Skipping migration to prevent data loss');
      console.log('💡 To force migration: npm run migrate-data --force');
      return;
    }

    console.log('📋 Step 2: Migrating Trips and Media');
    
    let tripCount = 0;
    let mediaCount = 0;
    let assignmentCount = 0;

    for (const trip of staticTripsData) {
      console.log(`📍 Migrating trip: "${trip.title}"`);
      
      // Insert trip
      const [insertedTrip] = await db.insert(trips).values({
        title: trip.title,
        location: trip.location,
        date: trip.date,
        description: trip.description,
      }).returning();
      
      tripCount++;
      console.log(`  ✅ Trip created with ID: ${insertedTrip.id}`);

      // Process media for this trip
      let mediaOrder = 0;
      for (const media of trip.media) {
        // Create media item
        const [insertedMedia] = await db.insert(mediaItems).values({
          filename: `static_${media.id}`,
          cloudinaryUrl: media.src,
          type: media.type,
          originalFilename: media.src.split('/').pop() || `media_${media.id}`,
          uploadedBy: 'migration',
        }).returning();

        mediaCount++;

        // Create assignment to trip
        await db.insert(mediaAssignments).values({
          mediaId: insertedMedia.id,
          contextType: 'trip',
          contextId: insertedTrip.id,
          description: media.alt,
          sortOrder: mediaOrder++,
        });

        assignmentCount++;
      }
      
      console.log(`  📷 ${trip.media.length} media items migrated`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('📊 Migration Summary:');
    console.log(`   • ${tripCount} trips migrated`);
    console.log(`   • ${mediaCount} media items migrated`);
    console.log(`   • ${assignmentCount} assignments created`);
    console.log('\n💡 Your app will now use database data instead of static fallback!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your database connection string');
    console.log('   2. Ensure database schema is created');
    console.log('   3. Verify network connectivity');
    process.exit(1);
  }
}

// Also create a status check function
export async function getMigrationStatus() {
  try {
    const db = drizzle(sql);
    const existingTrips = await db.select().from(trips);
    const existingMedia = await db.select().from(mediaItems);
    
    return {
      connected: true,
      trips: existingTrips.length,
      media: existingMedia.length,
      staticTrips: staticTripsData.length,
      staticMedia: staticTripsData.reduce((acc: number, trip: any) => acc + trip.media.length, 0),
      migrationNeeded: existingTrips.length === 0
    };
  } catch (error: any) {
    return {
      connected: false,
      error: error.message,
      staticTrips: staticTripsData.length,
      staticMedia: staticTripsData.reduce((acc: number, trip: any) => acc + trip.media.length, 0),
      migrationNeeded: true
    };
  }
}

if (require.main === module) {
  runMigration();
}