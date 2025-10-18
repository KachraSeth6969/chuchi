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
    const queueItems = await getQueueItems();
    
    // Group by category for easier frontend handling
    const grouped = queueItems.reduce((acc, item) => {
      const category = item.queueCategory;
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<string, typeof queueItems>);

    return NextResponse.json({
      success: true,
      queue: queueItems,
      grouped,
      count: {
        total: queueItems.length,
        upload: grouped.upload?.length || 0,
        removed: grouped.removed?.length || 0,
        orphaned: grouped.orphaned?.length || 0,
      }
    });
  } catch (error) {
    console.error('Queue GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue items' },
      { status: 500 }
    );
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