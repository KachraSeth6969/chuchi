import { NextRequest, NextResponse } from 'next/server';
import { 
  getGalleryMedia,
  removeMediaFromContext,
  assignMediaToGallery,
  assignMediaToTrip 
} from '../../../lib/database-operations';

// GET - Get gallery media
export async function GET() {
  try {
    const galleryMedia = await getGalleryMedia();
    
    return NextResponse.json({
      success: true,
      media: galleryMedia,
      count: galleryMedia.length
    });
  } catch (error) {
    console.error('Media GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery media' },
      { status: 500 }
    );
  }
}

// POST - Assign media to context
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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