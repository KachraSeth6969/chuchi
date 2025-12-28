import { db } from '../lib/db';
import { trips, mediaItems, mediaAssignments } from '../lib/db';

// Static trips data to migrate
const staticTrips = [
  {
    id: 1,
    title: "Teacher bramha",
    location: "Aapke dil mein",
    date: "11 March",
    description: "Gaand fat gayi bc padhane ke liye, kabhi nahi padhaega python",
    media: [
      { id: 1, type: "image", src: "/images/11.jpg", alt: "Best picture of chuchi till date" },
      { id: 2, type: "image", src: "/images/12.jpg", alt: "" },
      { id: 3, type: "image", src: "/images/13.jpg", alt: "U look so hott uff" },
      { id: 4, type: "image", src: "/images/14.jpg", alt: "" },
      { id: 5, type: "image", src: "/images/15.jpg", alt: "Super > Nova😤" },
      { id: 6, type: "video", src: "/videos/16.mp4", alt: "Super > Nova😤" },
    ]
  },
  {
    id: 2,
    title: "January",
    location: "Still aapke dill mai",
    date: "One week of jan",
    description: "Kya toh roz milte thhe chup chupke, bc",
    media: [
      { id: 21, type: "image", src: "/images/21.jpg", alt: "Tera id kho gaya and tu poora dinn bhagi thhi" },
      { id: 25, type: "image", src: "/images/25.jpg", alt: "Mai theek se suna nahi thha" },
      { id: 22, type: "image", src: "/images/22.jpg", alt: "" },
      { id: 23, type: "image", src: "/images/23.jpg", alt: "Wtf is this" },
      { id: 24, type: "image", src: "/images/24.jpg", alt: "Sister😍" },
      { id: 26, type: "image", src: "/images/26.jpg", alt: "" },
    ]
  },
  {
    id: 3,
    title: "Recent trip to apna savagaon",
    location: "Hehehehe still aapke dill mai",
    date: "Juky mai",
    description: "Kya bolti deal done karte toh anyways world already believes us to be a thing",
    media: [
      { id: 31, type: "image", src: "/images/31.jpg", alt: "u in that kurta(mere jacket ke andhar jo pehenni hai) " },
      { id: 32, type: "image", src: "/images/32.jpg", alt: "is the second most" },
      { id: 33, type: "image", src: "/images/33.jpg", alt: "Beautiful thing" },
      { id: 35, type: "image", src: "/images/35.jpg", alt: "U know whats first😉" },
      { id: 36, type: "image", src: "/images/36.jpg", alt: "" },
      { id: 34, type: "image", src: "/images/34.jpg", alt: "Cringiest shit ive ever done" },
      { id: 37, type: "video", src: "/videos/37.mp4", alt: "" },
      { id: 38, type: "video", src: "/videos/38.mp4", alt: "" },
      { id: 39, type: "video", src: "/videos/39.mp4", alt: "" },
    ]
  },
  {
    id: 4,
    title: "Sagar Milkshakeeee",
    location: "Supernova ke beech mai(aapke dill mai)",
    date: "I dont remember the date😂",
    description: "BC mere oaas sirf itne hi kyu hai🥲",
    media: [
      { id: 41, type: "video", src: "/videos/41.mp4", alt: "😍" },
      { id: 42, type: "image", src: "/images/42.jpg", alt: "Best phtotgrapher average model" },
      { id: 43, type: "video", src: "/videos/43.mp4", alt: "" },
    ]
  },
  {
    id: 5,
    title: "Adde pe proposal",
    location: "U guessed it, in ur heart",
    date: "Feb mai kabhi toh    ",
    description: "Kya toh thha re ma yo dinn, almost u had fell for me",
    media: [
      { id: 519 , type: "video", src: "/videos/519.mp4", alt: "Adde pe proposal video" },
      { id: 516, type: "image", src: "/images/516.jpeg", alt: "🤣🤣🤣🤣" },
      { id: 51, type: "image", src: "/images/51.jpeg", alt: "" },
      { id: 52, type: "image", src: "/images/52.jpeg", alt: "" },
      { id: 53, type: "image", src: "/images/53.jpeg", alt: "" },
      { id: 54, type: "image", src: "/images/54.jpeg", alt: "" },
      { id: 55, type: "image", src: "/images/55.jpeg", alt: "" },
      { id: 56, type: "image", src: "/images/56.jpeg", alt: "" },
      { id: 57, type: "image", src: "/images/57.jpeg", alt: "" },
      { id: 58, type: "image", src: "/images/58.jpeg", alt: "" },
      { id: 59, type: "image", src: "/images/59.jpeg", alt: "" },
      { id: 510, type: "image", src: "/images/510.jpeg", alt: "" },
      { id: 511, type: "image", src: "/images/511.jpeg", alt: "" },
      { id: 512, type: "image", src: "/images/512.jpeg", alt: "" },
      { id: 514, type: "image", src: "/images/514.jpeg", alt: "" },
      { id: 515, type: "image", src: "/images/515.jpeg", alt: "" }
    ]
  },
  {
    id: 6,
    title: "10 days",
    location: "Permanently dil mai",
    date: "September is the month",
    description: "Do u have the balls to be my gf???????????????",
    media: [
      { id: 80, type: "video", src: "/videos/81.mp4", alt: "Nikaala baadme" },
      { id: 83, type: "image", src: "/images/84.jpeg", alt: "No deed performed " },
      { id: 81, type: "image", src: "/images/82.jpeg", alt: "Manifestation manifesting" },
      { id: 82, type: "image", src: "/images/83.jpeg", alt: "She has no clue whats gon happen" },
      { id: 818, type: "image", src: "/images/818.jpeg", alt: "Wanna drown in these eyes forever" },
      { id: 84, type: "image", src: "/images/85.jpeg", alt: "So happy after jiggle sesh" },
      { id: 85, type: "image", src: "/images/86.jpeg", alt: "" },
      { id: 86, type: "image", src: "/images/87.jpeg", alt: "" },
      { id: 87, type: "image", src: "/images/88.jpeg", alt: "" },
      { id: 88, type: "image", src: "/images/89.jpeg", alt: "" },
      { id: 811, type: "image", src: "/images/811.jpeg", alt: "" },
      { id: 812, type: "image", src: "/images/812.jpeg", alt: "" },
      { id: 813, type: "image", src: "/images/813.jpeg", alt: "" },
      { id: 814, type: "image", src: "/images/814.jpeg", alt: "" },
      { id: 815, type: "image", src: "/images/815.jpeg", alt: "" },
      { id: 816, type: "image", src: "/images/816.jpeg", alt: "" },
      { id: 817, type: "image", src: "/images/817.jpeg", alt: "" },
      { id: 819, type: "image", src: "/images/819.jpeg", alt: "" },
      { id: 820, type: "image", src: "/images/820.jpeg", alt: "" },
      { id: 821, type: "image", src: "/images/821.jpeg", alt: "" },
      { id: 822, type: "image", src: "/images/822.jpeg", alt: "" },
    ]
  },
  {
    id: 7,
    title: "First bike trip",
    location: "chipak chipak ke dil mai",
    date: "CIE ke baad",
    description: "Maangi hui bike leke chal pade do gareeb",
    media: [
      { id: 90, type: "image", src: "/images/924.jpeg", alt: "" },
      { id: 91, type: "image", src: "/images/925.jpeg", alt: "" },
      { id: 92, type: "image", src: "/images/926.jpeg", alt: "" },
      { id: 93, type: "image", src: "/images/927.jpeg", alt: "" },
      { id: 94, type: "image", src: "/images/928.jpeg", alt: "" },
      { id: 95, type: "image", src: "/images/929.jpeg", alt: "" },
      { id: 96, type: "image", src: "/images/930.jpeg", alt: "Mana kar rahi thhi" },
      { id: 97, type: "image", src: "/images/931.jpeg", alt: "" },
      { id: 98, type: "image", src: "/images/932.jpeg", alt: "" },
    ]
  },
  {
    id: 8,
    title: "Second Goa Trip",
    location: "Goa bc",
    date: "October 2025",
    description: "The much awaited trip ye goa the second time, loved this one",
    media: [
      // Cloudinary images
      { id: 1001, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695569/IMG_0442_rws509.jpg", alt: "" },
      { id: 1002, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695570/IMG_0445_poz2nx.jpg", alt: "" },
      { id: 1003, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695570/IMG_0446_kr71b2.jpg", alt: "" },
      { id: 1004, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695571/IMG_0454_taufvw.jpg", alt: "" },
      { id: 1005, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695571/IMG_0448_regmni.jpg", alt: "" },
      { id: 1006, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695571/IMG_0465_weybsx.jpg", alt: "" },
      { id: 1007, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695572/IMG_0455_uhjlld.jpg", alt: "" },
      { id: 1008, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695572/IMG_0485_przbm1.jpg", alt: "" },
      { id: 1009, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695573/IMG_0479_zr9zez.jpg", alt: "" },
      { id: 1010, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695573/IMG_0490_ycqbo0.jpg", alt: "" },
      { id: 1011, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695573/IMG_0449_aimmrc.jpg", alt: "" },
      { id: 1012, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695574/IMG_0495_bdobvf.jpg", alt: "" },
      { id: 1013, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695574/IMG_0492_gnhvzl.jpg", alt: "" },
      { id: 1014, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695574/IMG_0497_vil3ua.jpg", alt: "" },
      { id: 1015, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695575/IMG_0500_sgch5a.jpg", alt: "" },
      // Videos
      { id: 1021, type: "video", src: "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759942242/chuchi/videos/IMG_0315.mp4", alt: "" },
      { id: 1022, type: "video", src: "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759942265/chuchi/videos/IMG_0364.mp4", alt: "" },
      { id: 1023, type: "video", src: "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759942283/chuchi/videos/IMG_0366.mp4", alt: "" },
      { id: 1024, type: "video", src: "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759942298/chuchi/videos/IMG_0367.mp4", alt: "" },
      { id: 1025, type: "video", src: "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759942360/chuchi/videos/WhatsApp%20Video%202025-10-08%20at%201.40.55%E2%80%AFAM%20%281%29.mp4", alt: "" },
      { id: 1026, type: "video", src: "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759942368/chuchi/videos/WhatsApp%20Video%202025-10-08%20at%201.40.55%E2%80%AFAM.mp4", alt: "" }
    ]
  },
  {
    id: 9,
    title: "First Date💋",
    location: "Sozo bolke ekla hai kidhar toh bc",
    date: "10 October",
    description: "Kya toh crazy jhagda kiye thhe ek dinn pehle",
    media: [
      { id: 1101, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695569/IMG_0442_rws509.jpg", alt: "" },
      { id: 1102, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695570/IMG_0445_poz2nx.jpg", alt: "" },
      { id: 1103, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695570/IMG_0446_kr71b2.jpg", alt: "" },
      { id: 1104, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695571/IMG_0454_taufvw.jpg", alt: "" },
      { id: 1105, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695571/IMG_0448_regmni.jpg", alt: "" },
      { id: 1106, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695571/IMG_0465_weybsx.jpg", alt: "" },
      { id: 1107, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695572/IMG_0455_uhjlld.jpg", alt: "" },
      { id: 1108, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695572/IMG_0485_przbm1.jpg", alt: "" },
      { id: 1109, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695573/IMG_0479_zr9zez.jpg", alt: "" },
      { id: 1110, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695573/IMG_0490_ycqbo0.jpg", alt: "" },
      { id: 1111, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695573/IMG_0449_aimmrc.jpg", alt: "" },
      { id: 1112, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695574/IMG_0495_bdobvf.jpg", alt: "" },
      { id: 1113, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695574/IMG_0492_gnhvzl.jpg", alt: "" },
      { id: 1114, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695574/IMG_0497_vil3ua.jpg", alt: "" },
      { id: 1115, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695575/IMG_0500_sgch5a.jpg", alt: "" }
    ]
  },
  {
    id: 10,
    title: "Random Shite",
    location: "Hmm tough question I think aapke dill mai🧐",
    date: "All the best finding dates",
    description: "Inn sab ke liye seperate banane ko kya nai mila still dalneka thha so daal diya",
    media: [
      { id: 61, type: "video", src: "/videos/61.mp4", alt: "" },
      { id: 62, type: "image", src: "/images/62.JPG", alt: "" },
      { id: 63, type: "image", src: "/images/63.JPG", alt: "" },
      { id: 64, type: "image", src: "/images/64.JPG", alt: "" },
      { id: 65, type: "image", src: "/images/65.jpeg", alt: "" },
      { id: 66, type: "image", src: "/images/66.jpeg", alt: "" },
      { id: 67, type: "image", src: "/images/67.jpeg", alt: "" },
      { id: 68, type: "image", src: "/images/68.jpeg", alt: "" },
      { id: 69, type: "image", src: "/images/69.jpeg", alt: "" },
      { id: 610, type: "image", src: "/images/610.jpeg", alt: "" },
      { id: 611, type: "image", src: "/images/611.jpeg", alt: "" },
      { id: 612, type: "image", src: "/images/612.jpeg", alt: "" },
      { id: 613, type: "image", src: "/images/613.jpeg", alt: "" },
      { id: 614, type: "image", src: "/images/614.JPG", alt: "" },
      { id: 615, type: "image", src: "/images/615.jpeg", alt: "" },
      { id: 616, type: "image", src: "/images/616.jpeg", alt: "" },
      { id: 617, type: "image", src: "/images/617.jpeg", alt: "" },
      { id: 618, type: "image", src: "/images/618.JPG", alt: "" },
      { id: 619, type: "image", src: "/images/619.jpeg", alt: "" },
      { id: 620, type: "image", src: "/images/620.JPG", alt: "" },
      { id: 621, type: "image", src: "/images/621.jpg", alt: "" },
      { id: 622, type: "image", src: "/images/622.jpeg", alt: "" },
      { id: 623, type: "image", src: "/images/623.jpeg", alt: "" },
      { id: 624, type: "image", src: "/images/624.JPG", alt: "" },
      { id: 625, type: "image", src: "/images/625.JPG", alt: "" },
      { id: 626, type: "video", src: "/videos/626.mp4", alt: "" },
      { id: 627, type: "video", src: "/videos/627.mp4", alt: "" },
      { id: 71, type: "video", src: "/videos/71.mp4", alt: "" },
      { id: 72, type: "image", src: "/images/72.jpeg", alt: "" },
      { id: 73, type: "image", src: "/images/73.jpeg", alt: "" },
      { id: 74, type: "image", src: "/images/74.jpeg", alt: "" },
      { id: 75, type: "image", src: "/images/75.jpg", alt: "" },
      { id: 76, type: "image", src: "/images/76.jpg", alt: "" },
      { id: 77, type: "image", src: "/images/77.jpg", alt: "" },
      { id: 78, type: "image", src: "/images/78.jpg", alt: "" },
      { id: 79, type: "image", src: "/images/79.jpg", alt: "" },
      { id: 710, type: "image", src: "/images/710.jpg", alt: "" },  
    ]
  }
];

// Gallery images to migrate (these will be unassigned to trips)
const galleryImages = [
  { id: 1, src: "/images/20231209_134646.JPG" },
  { id: 2, src: "/images/IMG-20240223-WA0036.JPG" },
  { id: 3, src: "/images/IMG_2916.jpeg" },
  { id: 4, src: "/images/IMG_3185.jpeg" },
  { id: 5, src: "/images/IMG_3243.jpeg" },
  { id: 6, src: "/images/IMG_3669.jpeg" },
  { id: 7, src: "/images/IMG_3984.jpeg" },
  { id: 8, src: "/images/IMG_5717.jpeg" },
  { id: 9, src: "/images/IMG_5761.jpeg" },
  { id: 10, src: "/images/IMG_6124.JPG" },
  { id: 11, src: "/images/IMG_6160.jpeg" },
  { id: 12, src: "/images/IMG_6220.JPG" },
  { id: 13, src: "/images/IMG_6279.jpg" },
  { id: 14, src: "/images/1.jpeg" },
  { id: 15, src: "/images/2.jpeg" },
  { id: 16, src: "/images/3.jpeg" },
  { id: 17, src: "/images/76.jpg" },
  { id: 18, src: "/images/23.jpg" },
  { id: 19, src: "/images/916.jpeg" },
  { id: 20, src: "/images/915.jpeg" },
  { id: 21, src: "/images/914.jpeg" },
  { id: 22, src: "/images/913.jpeg" },
  { id: 23, src: "/images/912.jpeg" },
  { id: 24, src: "/images/911.jpeg" },
  { id: 25, src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695574/IMG_0492_gnhvzl.jpg" },
  { id: 26, src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695573/IMG_0479_zr9zez.jpg" },
  { id: 27, src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695570/IMG_0445_poz2nx.jpg" },
];

export async function migrateStaticData() {
  console.log('🚀 Starting data migration...');
  
  try {
    // Step 1: Migrate trips
    console.log('📋 Migrating trips...');
    for (const staticTrip of staticTrips) {
      const [tripResult] = await db.insert(trips).values({
        title: staticTrip.title,
        location: staticTrip.location,
        date: staticTrip.date,
        description: staticTrip.description,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      console.log(`✅ Created trip: ${staticTrip.title} (ID: ${tripResult.id})`);
      
      // Step 2: Migrate media items for this trip
      let mediaOrder = 1;
      for (const media of staticTrip.media) {
        // Insert media item
        const [mediaResult] = await db.insert(mediaItems).values({
          filename: `${media.type}_${media.id}`,
          cloudinaryUrl: media.src,
          type: media.type as 'image' | 'video',
          originalFilename: `${media.type}_${media.id}`,
          fileSize: 0, // We don't have this data from static
          uploadedBy: 'migration',
          uploadedAt: new Date()
        }).returning();
        
        // Create assignment to trip
        await db.insert(mediaAssignments).values({
          mediaId: mediaResult.id,
          contextType: 'trip',
          contextId: tripResult.id,
          description: media.alt || null,
          sortOrder: mediaOrder++,
          assignedAt: new Date()
        });
      }
      
      console.log(`   📸 Migrated ${staticTrip.media.length} media items for trip`);
    }
    
    // Step 3: Migrate gallery images (unassigned media)
    console.log('🖼️ Migrating gallery images...');
    for (const galleryImage of galleryImages) {
      // Insert media item
      const [mediaResult] = await db.insert(mediaItems).values({
        filename: `gallery_${galleryImage.id}`,
        cloudinaryUrl: galleryImage.src,
        type: 'image',
        originalFilename: `gallery_${galleryImage.id}`,
        fileSize: 0,
        uploadedBy: 'migration',
        uploadedAt: new Date()
      }).returning();
      
      // Create assignment to gallery
      await db.insert(mediaAssignments).values({
        mediaId: mediaResult.id,
        contextType: 'gallery',
        contextId: null,
        description: null,
        sortOrder: galleryImage.id,
        assignedAt: new Date()
      });
    }
    
    console.log(`✅ Migrated ${galleryImages.length} gallery images`);
    
    console.log('🎉 Migration completed successfully!');
    console.log(`📊 Migration summary:
    - ${staticTrips.length} trips migrated
    - ${staticTrips.reduce((sum, trip) => sum + trip.media.length, 0)} trip media items migrated
    - ${galleryImages.length} gallery images migrated
    - Total media items: ${staticTrips.reduce((sum, trip) => sum + trip.media.length, 0) + galleryImages.length}
    `);
    
    return {
      success: true,
      trips: staticTrips.length,
      tripMedia: staticTrips.reduce((sum, trip) => sum + trip.media.length, 0),
      galleryImages: galleryImages.length,
      totalMedia: staticTrips.reduce((sum, trip) => sum + trip.media.length, 0) + galleryImages.length
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

export default migrateStaticData;