// Test script to verify Cloudinary connection
// Run this with: npm run test-cloudinary

const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dm1qjbqpx',
  api_key: process.env.CLOUDINARY_API_KEY || '655861924474297',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'T_70wt4n7lnbd_S6dTsWGBXzOpw',
});

async function testConnection() {
  try {
    console.log('🔧 Testing Cloudinary connection...');
    console.log('Cloud Name:', cloudinary.config().cloud_name);
    
    // Test API connection
    const result = await cloudinary.api.resources({ max_results: 1 });
    console.log('✅ Connection successful!');
    console.log('📁 Current files in account:', result.resources.length);
    
    if (result.resources.length > 0) {
      console.log('⚠️  WARNING: Found existing files. You should clean them up first.');
    } else {
      console.log('🧹 Account is clean - ready for migration!');
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('🔍 Check your credentials in .env.local');
  }
}

testConnection();