import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createMediaItem, addToQueue } from '../../../lib/database-operations';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to determine file type
function getFileType(mimeType: string): 'image' | 'video' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  throw new Error(`Unsupported file type: ${mimeType}`);
}

// Helper function to standardize filename
function standardizeFilename(originalName: string, type: 'image' | 'video'): string {
  const timestamp = Date.now();
  const extension = type === 'image' ? 'jpg' : 'mp4';
  return `${timestamp}_${Math.random().toString(36).substring(7)}.${extension}`;
}

// Helper function to upload to Cloudinary
async function uploadToCloudinary(file: File, type: 'image' | 'video') {
  return new Promise((resolve, reject) => {
    const arrayBuffer = file.arrayBuffer();
    
    arrayBuffer.then(buffer => {
      const uploadOptions: any = {
        resource_type: type,
        format: type === 'image' ? 'jpg' : 'mp4',
        quality: 'auto',
        // Set folder based on file type
        folder: type === 'image' ? 'chuchi/images' : 'chuchi/videos',
      };

      // For images, add transformation for standardization
      if (type === 'image') {
        uploadOptions.transformation = [
          { quality: 'auto', format: 'jpg' },
          { width: 1920, height: 1920, crop: 'limit' }
        ];
      }

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(Buffer.from(buffer));
    }).catch(reject);
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const uploadedBy = formData.get('uploadedBy') as string || 'anonymous';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const results = [];

    for (const file of files) {
      try {
        // Validate file
        if (!file || !(file instanceof File)) {
          throw new Error('Invalid file');
        }

        // Check file size (100MB max)
        if (file.size > 100 * 1024 * 1024) {
          throw new Error('File too large (max 100MB)');
        }

        // Determine file type
        const type = getFileType(file.type);
        
        // Validate file types
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];
        const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
        
        if (type === 'image' && !allowedImageTypes.includes(file.type)) {
          throw new Error(`Unsupported image type: ${file.type}`);
        }
        
        if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
          throw new Error(`Unsupported video type: ${file.type}`);
        }

        // Generate standardized filename
        const standardizedFilename = standardizeFilename(file.name, type);

        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(file, type) as any;

        // Save to database
        const mediaItem = await createMediaItem({
          filename: standardizedFilename,
          cloudinaryUrl: cloudinaryResult.secure_url,
          type,
          originalFilename: file.name,
          fileSize: file.size,
          uploadedBy,
        });

        // Add to upload queue
        await addToQueue(mediaItem.id, 'upload', 'New upload');

        results.push({
          success: true,
          mediaId: mediaItem.id,
          filename: standardizedFilename,
          originalFilename: file.name,
          cloudinaryUrl: cloudinaryResult.secure_url,
          type,
          fileSize: file.size,
        });

      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
        results.push({
          success: false,
          filename: file.name,
          error: fileError instanceof Error ? fileError.message : 'Unknown error',
        });
      }
    }

    // Check if any files were successfully uploaded
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      message: `Upload complete: ${successCount} successful, ${failCount} failed`,
      results,
      summary: {
        total: files.length,
        successful: successCount,
        failed: failCount,
      }
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { 
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check upload status or get queue info
export async function GET() {
  return NextResponse.json({
    message: 'Upload API endpoint',
    supportedFormats: {
      images: ['JPEG', 'JPG', 'PNG', 'HEIC', 'HEIF'],
      videos: ['MP4', 'MOV', 'AVI', 'QuickTime'],
    },
    maxFileSize: '100MB',
    features: [
      'Automatic format conversion (HEIC → JPG, MOV → MP4)',
      'Cloudinary optimization',
      'Queue management',
      'Progress tracking'
    ]
  });
}