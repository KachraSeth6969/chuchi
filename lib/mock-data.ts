// Mock data for testing without database
export const mockGalleryImages = [
  {
    id: 1,
    filename: 'sample1.jpg',
    cloudinary_url: '/placeholder.svg',
    type: 'image' as const,
    uploaded_at: new Date().toISOString(),
    title: 'Sample Image 1',
    description: 'A beautiful sample image'
  },
  {
    id: 2,
    filename: 'sample2.jpg', 
    cloudinary_url: '/placeholder.svg',
    type: 'image' as const,
    uploaded_at: new Date().toISOString(),
    title: 'Sample Image 2',
    description: 'Another lovely image'
  }
];

export const mockQueueItems = [];

export const mockTrips = [
  {
    id: 1,
    title: 'Sample Trip',
    location: 'Test Location',
    date: '2025-01-15',
    description: 'A sample trip for testing',
    created_at: new Date().toISOString()
  }
];

// Check if database is available
export function isDatabaseAvailable(): boolean {
  return !!(process.env.POSTGRES_URL || process.env.DATABASE_URL);
}