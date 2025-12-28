import { NextRequest, NextResponse } from 'next/server';
import { 
  getQueueItems, 
  removeFromQueue,
  assignMediaToGallery,
  assignMediaToTrip 
} from '../../../lib/database-operations';

// GET - Get all queue items
export async function GET() {
  try {
    // Check if we're in development mode without database
    if (!process.env.POSTGRES_URL || process.env.USE_MOCK_DATA === 'true') {
      // Return empty queue for local testing
      return NextResponse.json({
        success: true,
        queue: [],
        count: 0,
        message: 'Running in development mode'
      });
    }
    
    const queueData = await getQueueItems();
    
    return NextResponse.json({
      success: true,
      queue: queueData,
      count: queueData.length
    });
  } catch (error) {
    console.error('Queue GET error:', error);
    
    // Fallback for any database errors
    return NextResponse.json({
      success: true,
      queue: [],
      count: 0,
      message: 'Database unavailable, using mock data'
    });
  }
}

// POST - Assign media from queue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, mediaId, targetContext, targetId, description } = body;

    if (!action || !mediaId) {
      return NextResponse.json(
        { error: 'Missing required fields: action, mediaId' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'assign_to_gallery':
        await assignMediaToGallery(mediaId, description);
        return NextResponse.json({
          success: true,
          message: 'Media assigned to gallery'
        });

      case 'assign_to_trip':
        if (!targetId) {
          return NextResponse.json(
            { error: 'Trip ID required for assign_to_trip' },
            { status: 400 }
          );
        }
        await assignMediaToTrip(mediaId, targetId, description);
        return NextResponse.json({
          success: true,
          message: 'Media assigned to trip'
        });

      case 'remove_from_queue':
        await removeFromQueue(mediaId);
        return NextResponse.json({
          success: true,
          message: 'Media removed from queue'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Queue POST error:', error);
    return NextResponse.json(
      { error: 'Queue operation failed' },
      { status: 500 }
    );
  }
}

// DELETE - Remove media from queue (hard delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return NextResponse.json(
        { error: 'Media ID required' },
        { status: 400 }
      );
    }

    await removeFromQueue(parseInt(mediaId));
    
    return NextResponse.json({
      success: true,
      message: 'Media removed from queue'
    });
  } catch (error) {
    console.error('Queue DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from queue' },
      { status: 500 }
    );
  }
}