import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllTrips, 
  createTrip, 
  updateTrip, 
  deleteTrip,
  getTripById,
  getTripMedia 
} from '../../../lib/database-operations';

// GET - Get all trips or specific trip
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('id');

    if (tripId) {
      // Get specific trip with media
      const trip = await getTripById(parseInt(tripId));
      if (!trip) {
        return NextResponse.json(
          { error: 'Trip not found' },
          { status: 404 }
        );
      }

      const media = await getTripMedia(parseInt(tripId));
      
      return NextResponse.json({
        success: true,
        trip: {
          ...trip,
          media
        }
      });
    } else {
      // Get all trips
      const trips = await getAllTrips();
      
      // Get media count for each trip
      const tripsWithMedia = await Promise.all(
        trips.map(async (trip) => {
          const media = await getTripMedia(trip.id);
          return {
            ...trip,
            mediaCount: media.length
          };
        })
      );

      return NextResponse.json({
        success: true,
        trips: tripsWithMedia
      });
    }
  } catch (error) {
    console.error('Trips GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}

// POST - Create new trip
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, location, date, description } = body;

    if (!title || !location || !date || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: title, location, date, description' },
        { status: 400 }
      );
    }

    const trip = await createTrip({
      title,
      location,
      date,
      description
    });

    return NextResponse.json({
      success: true,
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    console.error('Trips POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    );
  }
}

// PUT - Update trip
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, location, date, description } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Trip ID required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (location !== undefined) updateData.location = location;
    if (date !== undefined) updateData.date = date;
    if (description !== undefined) updateData.description = description;

    const trip = await updateTrip(id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Trip updated successfully',
      trip
    });
  } catch (error) {
    console.error('Trips PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    );
  }
}

// DELETE - Delete trip (moves media to queue)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('id');

    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID required' },
        { status: 400 }
      );
    }

    await deleteTrip(parseInt(tripId));

    return NextResponse.json({
      success: true,
      message: 'Trip deleted successfully, media moved to queue'
    });
  } catch (error) {
    console.error('Trips DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete trip' },
      { status: 500 }
    );
  }
}