import { NextResponse } from 'next/server';
import { createMediaItem, assignMediaToGallery } from '../../../lib/database-operations';

// Static gallery images to add to database
const staticGalleryImages = [
  { type: "image", src: "/images/20231209_134646.JPG", filename: "20231209_134646.JPG" },
  { type: "image", src: "/images/IMG-20240223-WA0036.JPG", filename: "IMG-20240223-WA0036.JPG" },
  { type: "image", src: "/images/IMG_2916.jpeg", filename: "IMG_2916.jpeg" },
  { type: "image", src: "/images/IMG_3185.jpeg", filename: "IMG_3185.jpeg" },
  { type: "image", src: "/images/IMG_3243.jpeg", filename: "IMG_3243.jpeg" },
  { type: "image", src: "/images/IMG_3669.jpeg", filename: "IMG_3669.jpeg" },
  { type: "image", src: "/images/IMG_3984.jpeg", filename: "IMG_3984.jpeg" },
  { type: "image", src: "/images/IMG_5717.jpeg", filename: "IMG_5717.jpeg" },
  { type: "image", src: "/images/IMG_5761.jpeg", filename: "IMG_5761.jpeg" },
  { type: "image", src: "/images/IMG_6124.JPG", filename: "IMG_6124.JPG" },
  { type: "image", src: "/images/IMG_6160.jpeg", filename: "IMG_6160.jpeg" },
  { type: "image", src: "/images/IMG_6220.JPG", filename: "IMG_6220.JPG" },
  { type: "image", src: "/images/IMG_6279.jpg", filename: "IMG_6279.jpg" },
  { type: "image", src: "/images/1.jpeg", filename: "1.jpeg" },
  { type: "image", src: "/images/2.jpeg", filename: "2.jpeg" },
  { type: "image", src: "/images/3.jpeg", filename: "3.jpeg" },
  { type: "image", src: "/images/76.jpg", filename: "76.jpg" },
  { type: "image", src: "/images/23.jpg", filename: "23.jpg" },
  { type: "image", src: "/images/916.jpeg", filename: "916.jpeg" },
  { type: "image", src: "/images/915.jpeg", filename: "915.jpeg" },
  { type: "image", src: "/images/914.jpeg", filename: "914.jpeg" },
  { type: "image", src: "/images/913.jpeg", filename: "913.jpeg" },
  { type: "image", src: "/images/912.jpeg", filename: "912.jpeg" },
  { type: "image", src: "/images/911.jpeg", filename: "911.jpeg" },
  { type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695574/IMG_0492_gnhvzl.jpg", filename: "IMG_0492.jpg" },
  { type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695573/IMG_0479_zr9zez.jpg", filename: "IMG_0479.jpg" },
  { type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695570/IMG_0445_poz2nx.jpg", filename: "IMG_0445.jpg" },
];

export async function POST() {
  try {
    const results = [];
    
    for (const image of staticGalleryImages) {
      try {
        // Create media item in database
        const mediaItem = await createMediaItem({
          filename: image.filename,
          cloudinaryUrl: image.src,
          type: image.type as 'image' | 'video',
          originalFilename: image.filename,
          fileSize: 0,
          uploadedBy: 'system'
        });
        
        // Assign to gallery using the media ID
        await assignMediaToGallery(mediaItem.id);
        
        results.push({
          filename: image.filename,
          mediaId: mediaItem.id,
          success: true
        });
        
        console.log(`Added ${image.filename} to gallery (ID: ${mediaItem.id})`);
      } catch (error) {
        console.error(`Failed to add ${image.filename}:`, error);
        results.push({
          filename: image.filename,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    return NextResponse.json({
      success: true,
      message: `Gallery population complete: ${successCount} added, ${failCount} failed`,
      total: staticGalleryImages.length,
      successCount,
      failCount,
      results
    });
    
  } catch (error) {
    console.error('Gallery population error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to populate gallery',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}