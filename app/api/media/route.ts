import { NextRequest, NextResponse } from 'next/server';
import { 
  getGalleryMedia,
  removeMediaFromContext,
  assignMediaToGallery,
  assignMediaToTrip,
  getMediaIdFromQueueItem
} from '../../../lib/database-operations';

// GET - Get gallery media
export async function GET() {
  try {
    // Check if we're in development mode without database
    if (!process.env.POSTGRES_URL || process.env.USE_MOCK_DATA === 'true') {
      // Return sample gallery data for testing
      const mockGallery = [
        {
          id: 1,
          filename: 'sample1.jpg',
          cloudinary_url: '/placeholder.svg',
          type: 'image',
          uploaded_at: new Date().toISOString(),
          title: 'Sample Photo 1'
        },
        {
          id: 2, 
          filename: 'sample2.jpg',
          cloudinary_url: '/placeholder.svg', 
          type: 'image',
          uploaded_at: new Date().toISOString(),
          title: 'Sample Photo 2'
        }
      ];
      
      return NextResponse.json({
        success: true,
        media: mockGallery,
        count: mockGallery.length,
        message: 'Running in development mode with sample data'
      });
    }
    
    const galleryMedia = await getGalleryMedia();
    
    return NextResponse.json({
      success: true,
      media: galleryMedia,
      count: galleryMedia.length
    });
  } catch (error) {
    console.error('Media GET error:', error);
    
    // Fallback to mock data on error
    return NextResponse.json({
      success: true,
      media: [],
      count: 0,
      message: 'Database unavailable, using fallback data'
    });
  }
}

// POST - Assign media to context (batch operations)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle batch assignment from queue
    if (body.queueItemIds && body.assignTo) {
      const { queueItemIds, assignTo, tripId } = body;
      
      const results = [];
      for (const queueItemId of queueItemIds) {
        try {
          // Get the actual mediaId from the queue item
          const mediaId = await getMediaIdFromQueueItem(queueItemId);
          
          if (assignTo === 'gallery') {
            await assignMediaToGallery(mediaId);
          } else if (assignTo === 'trip' && tripId) {
            await assignMediaToTrip(mediaId, tripId);
          }
          results.push({ queueItemId, mediaId, success: true });
        } catch (error) {
          console.error(`Failed to assign queue item ${queueItemId}:`, error);
          results.push({ queueItemId, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }
      
      return NextResponse.json({
        success: true,
        message: `Assigned ${results.filter(r => r.success).length} items to ${assignTo}`,
        results
      });
    }

    // Handle single media assignment (legacy)
    const { action, mediaId, contextType, contextId, description } = body;

    if (!action || !mediaId || !contextType) {
      return NextResponse.json(
        { error: 'Missing required fields: action, mediaId, contextType' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'assign':
        if (contextType === 'gallery') {
          await assignMediaToGallery(mediaId, description);
        } else if (contextType === 'trip') {
          if (!contextId) {
            return NextResponse.json(
              { error: 'Trip ID required for trip assignment' },
              { status: 400 }
            );
          }
          await assignMediaToTrip(mediaId, contextId, description);
        } else {
          return NextResponse.json(
            { error: 'Invalid context type' },
            { status: 400 }
          );
        }
        
        return NextResponse.json({
          success: true,
          message: `Media assigned to ${contextType}`
        });

      case 'remove':
        await removeMediaFromContext(mediaId, contextType, contextId);
        
        return NextResponse.json({
          success: true,
          message: `Media removed from ${contextType} and moved to queue`
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Media POST error:', error);
    return NextResponse.json(
      { error: 'Media operation failed' },
      { status: 500 }
    );
  }
}

// DELETE - Remove media (soft delete to queue)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle batch removal from gallery
    if (body.mediaIds && body.source === 'gallery' && body.action === 'soft-delete') {
      const { mediaIds } = body;
      
      const results = [];
      for (const mediaId of mediaIds) {
        try {
          await removeMediaFromContext(mediaId, 'gallery', undefined);
          results.push({ mediaId, success: true });
        } catch (error) {
          console.error(`Failed to remove media ${mediaId}:`, error);
          results.push({ mediaId, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }
      
      return NextResponse.json({
        success: true,
        message: `Moved ${results.filter(r => r.success).length} photos to queue`,
        results
      });
    }
    
    // Handle removal from trips
    if (body.assignments && body.action === 'remove-from-trip') {
      const { assignments } = body;
      
      const results = [];
      for (const assignment of assignments) {
        try {
          await removeMediaFromContext(assignment.mediaId, 'trip', assignment.tripId);
          results.push({ ...assignment, success: true });
        } catch (error) {
          console.error(`Failed to remove media ${assignment.mediaId} from trip ${assignment.tripId}:`, error);
          results.push({ ...assignment, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }
      
      return NextResponse.json({
        success: true,
        message: `Removed ${results.filter(r => r.success).length} photos from trips`,
        results
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid delete operation' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Media DELETE error:', error);
    return NextResponse.json(
      { error: 'Delete operation failed' },
      { status: 500 }
    );
  }
}