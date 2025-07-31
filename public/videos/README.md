# Videos Directory

This directory is for storing video files from your trips together.

## How to add photos and videos to trips:

1. **For Photos**: Place image files in `/public/images/`
2. **For Videos**: Place video files (MP4, MOV, etc.) in this directory (`/public/videos/`)
3. Update the trips data in `/app/trips/page.tsx` 
4. Add media objects to the `media` array like this:

```javascript
media: [
  // For images
  { id: 1, type: "image", src: "/images/trip-photo.jpg", alt: "Description of the photo" },
  
  // For videos
  { id: 2, type: "video", src: "/videos/trip-video.mp4", alt: "Description of the video" },
  
  // Mix them in any order
  { id: 3, type: "image", src: "/images/another-photo.jpg", alt: "Another moment" },
  { id: 4, type: "video", src: "/videos/fun-moment.mp4", alt: "Fun moment caught on camera" }
]
```

## Features:
- **Unified Gallery**: Photos and videos display together in a seamless grid
- **Click to View**: Click photos for lightbox view, click videos for full-screen playback  
- **Visual Indicators**: Videos show a "VIDEO" badge and play button on hover
- **Responsive Design**: Works perfectly on all devices

## Supported formats:
- **Images**: JPG, JPEG, PNG, WebP
- **Videos**: MP4 (recommended), MOV, WebM, AVI

## Tips:
- Keep video file sizes reasonable for web loading (under 50MB recommended)
- Use descriptive filenames and alt text
- Consider compressing large videos for better performance
- Mix photos and videos in chronological order for the best storytelling experience
