import { db, trips, mediaItems, mediaAssignments, queueItems } from './db';
import { eq, desc, and, inArray } from 'drizzle-orm';
import type { Trip, MediaItem, MediaAssignment, QueueItem } from './db';

// Trip operations
export async function getAllTrips() {
  return await db.select().from(trips).orderBy(desc(trips.createdAt));
}

export async function getTripById(id: number) {
  const trip = await db.select().from(trips).where(eq(trips.id, id)).limit(1);
  return trip[0] || null;
}

export async function createTrip(tripData: {
  title: string;
  location: string;
  date: string;
  description: string;
}) {
  const result = await db.insert(trips).values(tripData).returning();
  return result[0];
}

export async function updateTrip(id: number, tripData: Partial<{
  title: string;
  location: string;
  date: string;
  description: string;
}>) {
  const result = await db
    .update(trips)
    .set({ ...tripData, updatedAt: new Date() })
    .where(eq(trips.id, id))
    .returning();
  return result[0];
}

export async function deleteTrip(id: number) {
  // First, move all trip media to queue
  const tripMedia = await getTripMedia(id);
  
  for (const media of tripMedia) {
    await addToQueue(media.id, 'orphaned', `Deleted trip: "${media.tripTitle}"`);
  }
  
  // Remove media assignments for this trip
  await db.delete(mediaAssignments).where(
    and(
      eq(mediaAssignments.contextType, 'trip'),
      eq(mediaAssignments.contextId, id)
    )
  );
  
  // Delete the trip
  await db.delete(trips).where(eq(trips.id, id));
}

// Media operations
export async function getAllMedia() {
  return await db.select().from(mediaItems).orderBy(desc(mediaItems.uploadedAt));
}

export async function getMediaById(id: number) {
  const media = await db.select().from(mediaItems).where(eq(mediaItems.id, id)).limit(1);
  return media[0] || null;
}

export async function createMediaItem(mediaData: {
  filename: string;
  cloudinaryUrl: string;
  type: 'image' | 'video';
  originalFilename: string;
  fileSize?: number;
  uploadedBy?: string;
}) {
  const result = await db.insert(mediaItems).values(mediaData).returning();
  return result[0];
}

// Media assignment operations
export async function getGalleryMedia() {
  return await db
    .select({
      id: mediaItems.id,
      filename: mediaItems.filename,
      cloudinaryUrl: mediaItems.cloudinaryUrl,
      type: mediaItems.type,
      description: mediaAssignments.description,
      sortOrder: mediaAssignments.sortOrder,
    })
    .from(mediaItems)
    .innerJoin(mediaAssignments, eq(mediaItems.id, mediaAssignments.mediaId))
    .where(eq(mediaAssignments.contextType, 'gallery'))
    .orderBy(mediaAssignments.sortOrder);
}

export async function getTripMedia(tripId: number) {
  return await db
    .select({
      id: mediaItems.id,
      filename: mediaItems.filename,
      cloudinaryUrl: mediaItems.cloudinaryUrl,
      type: mediaItems.type,
      description: mediaAssignments.description,
      sortOrder: mediaAssignments.sortOrder,
      tripTitle: trips.title,
    })
    .from(mediaItems)
    .innerJoin(mediaAssignments, eq(mediaItems.id, mediaAssignments.mediaId))
    .innerJoin(trips, eq(mediaAssignments.contextId, trips.id))
    .where(
      and(
        eq(mediaAssignments.contextType, 'trip'),
        eq(mediaAssignments.contextId, tripId)
      )
    )
    .orderBy(mediaAssignments.sortOrder);
}

export async function assignMediaToGallery(mediaId: number, description?: string) {
  // Remove from queue if it exists
  await removeFromQueue(mediaId);
  
  // Get next sort order
  const maxOrder = await db
    .select({ max: mediaAssignments.sortOrder })
    .from(mediaAssignments)
    .where(eq(mediaAssignments.contextType, 'gallery'));
  
  const sortOrder = (maxOrder[0]?.max || 0) + 1;
  
  const result = await db.insert(mediaAssignments).values({
    mediaId,
    contextType: 'gallery',
    contextId: null,
    description,
    sortOrder,
  }).returning();
  
  return result[0];
}

export async function assignMediaToTrip(mediaId: number, tripId: number, description?: string) {
  // Remove from queue if it exists
  await removeFromQueue(mediaId);
  
  // Get next sort order for this trip
  const maxOrder = await db
    .select({ max: mediaAssignments.sortOrder })
    .from(mediaAssignments)
    .where(
      and(
        eq(mediaAssignments.contextType, 'trip'),
        eq(mediaAssignments.contextId, tripId)
      )
    );
  
  const sortOrder = (maxOrder[0]?.max || 0) + 1;
  
  const result = await db.insert(mediaAssignments).values({
    mediaId,
    contextType: 'trip',
    contextId: tripId,
    description,
    sortOrder,
  }).returning();
  
  return result[0];
}

export async function removeMediaFromContext(mediaId: number, contextType: 'gallery' | 'trip', contextId?: number) {
  // Get current assignment for source context
  const whereConditions = [
    eq(mediaAssignments.mediaId, mediaId),
    eq(mediaAssignments.contextType, contextType),
  ];
  
  if (contextId !== undefined) {
    whereConditions.push(eq(mediaAssignments.contextId, contextId));
  }
  
  const assignment = await db
    .select()
    .from(mediaAssignments)
    .where(and(...whereConditions))
    .limit(1);
  
  if (assignment[0]) {
    // Add to queue with source context
    const sourceContext = contextType === 'gallery' 
      ? 'Removed from Gallery'
      : `Removed from trip`;
    
    await addToQueue(mediaId, 'removed', sourceContext, assignment[0].description || undefined);
    
    // Remove assignment
    await db.delete(mediaAssignments).where(eq(mediaAssignments.id, assignment[0].id));
  }
}

// Queue operations
export async function getQueueItems() {
  return await db
    .select({
      id: queueItems.id,
      mediaId: queueItems.mediaId,
      sourceContext: queueItems.sourceContext,
      sourceDescription: queueItems.sourceDescription,
      queueCategory: queueItems.queueCategory,
      addedToQueueAt: queueItems.addedToQueueAt,
      filename: mediaItems.filename,
      cloudinaryUrl: mediaItems.cloudinaryUrl,
      type: mediaItems.type,
    })
    .from(queueItems)
    .innerJoin(mediaItems, eq(queueItems.mediaId, mediaItems.id))
    .orderBy(desc(queueItems.addedToQueueAt));
}

export async function addToQueue(
  mediaId: number, 
  category: 'upload' | 'removed' | 'orphaned',
  sourceContext?: string,
  sourceDescription?: string
) {
  const result = await db.insert(queueItems).values({
    mediaId,
    queueCategory: category,
    sourceContext,
    sourceDescription,
  }).returning();
  
  return result[0];
}

export async function removeFromQueue(mediaId: number) {
  await db.delete(queueItems).where(eq(queueItems.mediaId, mediaId));
}

// Utility functions
export async function getMediaWithAssignments(mediaId: number) {
  return await db
    .select({
      id: mediaItems.id,
      filename: mediaItems.filename,
      cloudinaryUrl: mediaItems.cloudinaryUrl,
      type: mediaItems.type,
      assignments: mediaAssignments,
    })
    .from(mediaItems)
    .leftJoin(mediaAssignments, eq(mediaItems.id, mediaAssignments.mediaId))
    .where(eq(mediaItems.id, mediaId));
}

// Helper function to get mediaId from queueItemId
export async function getMediaIdFromQueueItem(queueItemId: number): Promise<number> {
  const result = await db
    .select({ mediaId: queueItems.mediaId })
    .from(queueItems)
    .where(eq(queueItems.id, queueItemId))
    .limit(1);
  
  if (result.length === 0) {
    throw new Error(`Queue item ${queueItemId} not found`);
  }
  
  return result[0].mediaId;
}