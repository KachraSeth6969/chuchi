import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  varchar,
  pgEnum
} from 'drizzle-orm/pg-core';

// Define enums for better type safety
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video']);
export const contextTypeEnum = pgEnum('context_type', ['gallery', 'trip']);
export const queueCategoryEnum = pgEnum('queue_category', ['upload', 'removed', 'orphaned']);

// Trips table - stores trip metadata
export const trips = pgTable('trips', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  date: varchar('date', { length: 100 }).notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Media items table - stores all photos/videos
export const mediaItems = pgTable('media_items', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  cloudinaryUrl: text('cloudinary_url').notNull(),
  type: mediaTypeEnum('type').notNull(),
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  fileSize: integer('file_size'),
  uploadedBy: varchar('uploaded_by', { length: 100 }),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

// Media assignments - tracks which media belongs to which context
export const mediaAssignments = pgTable('media_assignments', {
  id: serial('id').primaryKey(),
  mediaId: integer('media_id').references(() => mediaItems.id).notNull(),
  contextType: contextTypeEnum('context_type').notNull(),
  contextId: integer('context_id'), // null for gallery, trip_id for trips
  description: text('description'), // alt text for the media
  sortOrder: integer('sort_order').default(0),
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
});

// Queue items - tracks items in the queue for assignment
export const queueItems = pgTable('queue_items', {
  id: serial('id').primaryKey(),
  mediaId: integer('media_id').references(() => mediaItems.id).notNull(),
  sourceContext: varchar('source_context', { length: 255 }), // e.g., "Deleted trip: Goa Adventure"
  sourceDescription: text('source_description'), // original description
  queueCategory: queueCategoryEnum('queue_category').notNull(),
  addedToQueueAt: timestamp('added_to_queue_at').defaultNow().notNull(),
});

// Initialize Drizzle with Vercel Postgres
export const db = drizzle(sql);

// Export types for use in components
export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
export type MediaItem = typeof mediaItems.$inferSelect;
export type NewMediaItem = typeof mediaItems.$inferInsert;
export type MediaAssignment = typeof mediaAssignments.$inferSelect;
export type NewMediaAssignment = typeof mediaAssignments.$inferInsert;
export type QueueItem = typeof queueItems.$inferSelect;
export type NewQueueItem = typeof queueItems.$inferInsert;