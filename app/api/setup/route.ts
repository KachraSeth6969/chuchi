import { NextRequest, NextResponse } from 'next/server';
import { createTables } from '../../../lib/migrate';

export async function POST(request: NextRequest) {
  try {
    const result = await createTables();
    
    if (result.success) {
      return NextResponse.json({ 
        message: 'Database setup completed successfully!',
        success: true 
      });
    } else {
      return NextResponse.json({ 
        message: 'Database setup failed',
        success: false,
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      message: 'Database setup failed',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Database setup endpoint. Use POST to create tables.' 
  });
}