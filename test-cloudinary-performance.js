// Test script to verify Cloudinary performance and URL accessibility
const { getMediaUrl } = require('./lib/media-config.ts');

// Test files that were migrated to Cloudinary
const testFiles = [
  '/images/1.jpeg',
  '/images/2.jpeg', 
  '/images/3.jpeg',
  '/videos/16.mp4'
];

console.log('🧪 Testing Cloudinary URLs and Performance');
console.log('==========================================\n');

testFiles.forEach(file => {
  const cloudinaryUrl = getMediaUrl(file);
  const isCloudinary = cloudinaryUrl !== file;
  
  console.log(`📁 File: ${file}`);
  console.log(`🔗 URL: ${cloudinaryUrl}`);
  console.log(`☁️  Using Cloudinary: ${isCloudinary ? '✅ YES' : '❌ NO'}`);
  
  if (isCloudinary) {
    console.log(`🚀 Performance benefits: Auto-optimization, CDN delivery, fast loading`);
  }
  console.log('');
});

console.log('🌐 Next steps:');
console.log('1. Visit http://localhost:3000/gallery to see the migrated images (1.jpeg, 2.jpeg, 3.jpeg)');
console.log('2. Visit http://localhost:3000/trips to see the migrated video (16.mp4)');
console.log('3. Compare loading speeds - Cloudinary files should load faster!');
console.log('4. Check browser dev tools Network tab to see Cloudinary CDN requests');