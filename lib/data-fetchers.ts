import { db } from './db';
import { trips, mediaItems, mediaAssignments } from './db';
import { eq, desc } from 'drizzle-orm';

// Types for our data structures
export interface MediaItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  alt: string;
  description?: string;
  order?: number;
}

export interface Trip {
  id: number;
  title: string;
  location: string;
  date: string;
  description: string;
  media: MediaItem[];
}

// Static fallback data - the original static trips data
export const staticTripsData: Trip[] = [
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
    title: "Stay Together",
    location: "Special Place in Heart",
    date: "October 2025",
    description: "Poora hafta saath mai rahe , kutte jaisa paisa udaye",
    media: [
      // Images
      { id: 1001, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942166/chuchi/images/IMG_0316.jpg", alt: "" },
      { id: 1002, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942173/chuchi/images/IMG_0317.jpg", alt: "" },
      { id: 1003, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942178/chuchi/images/IMG_0323.jpg", alt: "" },
      { id: 1004, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942183/chuchi/images/IMG_0324.jpg", alt: "" },
      { id: 1005, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942188/chuchi/images/IMG_0385.jpg", alt: "" },
      { id: 1006, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942192/chuchi/images/IMG_0386.jpg", alt: "" },
      { id: 1007, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942197/chuchi/images/IMG_0387.jpg", alt: "" },
      { id: 1008, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942201/chuchi/images/IMG_0390.jpg", alt: "" },
      { id: 1009, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942204/chuchi/images/IMG_0391.jpg", alt: "" },
      { id: 1010, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942207/chuchi/images/IMG_0392.jpg", alt: "" },
      { id: 1011, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942210/chuchi/images/WhatsApp%20Image%202025-10-08%20at%201.40.28%E2%80%AFAM%20%281%29.jpg", alt: "" },
      { id: 1012, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942212/chuchi/images/WhatsApp%20Image%202025-10-08%20at%201.40.28%E2%80%AFAM.jpg", alt: "" },
      { id: 1013, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942214/chuchi/images/WhatsApp%20Image%202025-10-08%20at%201.40.36%E2%80%AFAM.jpg", alt: "" },
      { id: 1014, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942215/chuchi/images/WhatsApp%20Image%202025-10-08%20at%201.40.37%E2%80%AFAM.jpg", alt: "" },
      { id: 1016, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942218/chuchi/images/WhatsApp%20Image%202025-10-08%20at%201.40.52%E2%80%AFAM%20%281%29.jpg", alt: "" },
      { id: 1017, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942220/chuchi/images/WhatsApp%20Image%202025-10-08%20at%201.40.53%E2%80%AFAM%20%281%29.jpg", alt: "" },
      { id: 1018, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942222/chuchi/images/WhatsApp%20Image%202025-10-08%20at%201.40.53%E2%80%AFAM.jpg", alt: "" },
      { id: 1019, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942223/chuchi/images/WhatsApp%20Image%202025-10-08%20at%201.40.54%E2%80%AFAM.jpg", alt: "" },
      { id: 1020, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759942225/chuchi/images/WhatsApp%20Image%202025-10-08%20at%201.41.08%E2%80%AFAM.jpg", alt: "" },
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

const staticGalleryImages: MediaItem[] = [
  { id: 1, type: "image", src: "/images/20231209_134646.JPG", alt: "" },
  { id: 2, type: "image", src: "/images/IMG-20240223-WA0036.JPG", alt: "" },
  { id: 3, type: "image", src: "/images/IMG_2916.jpeg", alt: "" },
  { id: 4, type: "image", src: "/images/IMG_3185.jpeg", alt: "" },
  { id: 5, type: "image", src: "/images/IMG_3243.jpeg", alt: "" },
  { id: 6, type: "image", src: "/images/IMG_3669.jpeg", alt: "" },
  { id: 7, type: "image", src: "/images/IMG_3984.jpeg", alt: "" },
  { id: 8, type: "image", src: "/images/IMG_5717.jpeg", alt: "" },
  { id: 9, type: "image", src: "/images/IMG_5761.jpeg", alt: "" },
  { id: 10, type: "image", src: "/images/IMG_6124.JPG", alt: "" },
  { id: 11, type: "image", src: "/images/IMG_6160.jpeg", alt: "" },
  { id: 12, type: "image", src: "/images/IMG_6220.JPG", alt: "" },
  { id: 13, type: "image", src: "/images/IMG_6279.jpg", alt: "" },
  { id: 14, type: "image", src: "/images/1.jpeg", alt: "" },
  { id: 15, type: "image", src: "/images/2.jpeg", alt: "" },
  { id: 16, type: "image", src: "/images/3.jpeg", alt: "" },
  { id: 17, type: "image", src: "/images/76.jpg", alt: "" },
  { id: 18, type: "image", src: "/images/23.jpg", alt: "" },
  { id: 19, type: "image", src: "/images/916.jpeg", alt: "" },
  { id: 20, type: "image", src: "/images/915.jpeg", alt: "" },
  { id: 21, type: "image", src: "/images/914.jpeg", alt: "" },
  { id: 22, type: "image", src: "/images/913.jpeg", alt: "" },
  { id: 23, type: "image", src: "/images/912.jpeg", alt: "" },
  { id: 24, type: "image", src: "/images/911.jpeg", alt: "" },
  { id: 25, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695574/IMG_0492_gnhvzl.jpg", alt: "" },
  { id: 26, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695573/IMG_0479_zr9zez.jpg", alt: "" },
  { id: 27, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1760695570/IMG_0445_poz2nx.jpg", alt: "" },
];

// Function to fetch trips from database with fallback to static data
export async function getTrips(): Promise<Trip[]> {
  try {
    // Try to fetch from database
    const dbTrips = await db
      .select()
      .from(trips)
      .orderBy(desc(trips.createdAt));

    // Fetch media for each trip
    const tripsWithMedia = await Promise.all(
      dbTrips.map(async (trip) => {
        const media = await db
          .select({
            id: mediaItems.id,
            type: mediaItems.type,
            src: mediaItems.cloudinaryUrl,
            alt: mediaAssignments.description,
            order: mediaAssignments.sortOrder,
          })
          .from(mediaAssignments)
          .innerJoin(mediaItems, eq(mediaAssignments.mediaId, mediaItems.id))
          .where(eq(mediaAssignments.contextId, trip.id))
          .orderBy(mediaAssignments.sortOrder);

        return {
          id: trip.id,
          title: trip.title,
          location: trip.location,
          date: trip.date,
          description: trip.description,
          media: media.map(m => ({
            id: m.id,
            type: m.type,
            src: m.src,
            alt: m.alt || '',
            description: m.alt || undefined,
            order: m.order || undefined,
          }))
        };
      })
    );

    return tripsWithMedia;
  } catch (error) {
    console.warn('Database not available, using static data:', error);
    return staticTripsData;
  }
}

// Function to fetch gallery images from database with fallback to static data
export async function getGalleryImages(): Promise<MediaItem[]> {
  try {
    // Try to fetch from database
    const galleryMedia = await db
      .select({
        id: mediaItems.id,
        type: mediaItems.type,
        src: mediaItems.cloudinaryUrl,
        alt: mediaAssignments.description,
        order: mediaAssignments.sortOrder,
      })
      .from(mediaAssignments)
      .innerJoin(mediaItems, eq(mediaAssignments.mediaId, mediaItems.id))
      .where(eq(mediaAssignments.contextType, 'gallery'))
      .orderBy(mediaAssignments.sortOrder);

    return galleryMedia.map(m => ({
      id: m.id,
      type: m.type,
      src: m.src,
      alt: m.alt || '',
      description: m.alt || undefined,
      order: m.order || undefined,
    }));
  } catch (error) {
    console.warn('Database not available, using static data:', error);
    return staticGalleryImages;
  }
}

// Function to get a single trip by ID
export async function getTripById(id: number): Promise<Trip | null> {
  try {
    const [trip] = await db
      .select()
      .from(trips)
      .where(eq(trips.id, id));

    if (!trip) return null;

    const media = await db
      .select({
        id: mediaItems.id,
        type: mediaItems.type,
        src: mediaItems.cloudinaryUrl,
        alt: mediaAssignments.description,
        order: mediaAssignments.sortOrder,
      })
      .from(mediaAssignments)
      .innerJoin(mediaItems, eq(mediaAssignments.mediaId, mediaItems.id))
      .where(eq(mediaAssignments.contextId, trip.id))
      .orderBy(mediaAssignments.sortOrder);

    return {
      id: trip.id,
      title: trip.title,
      location: trip.location,
      date: trip.date,
      description: trip.description,
      media: media.map(m => ({
        id: m.id,
        type: m.type,
        src: m.src,
        alt: m.alt || '',
        description: m.alt || undefined,
        order: m.order || undefined,
      }))
    };
  } catch (error) {
    console.warn('Database not available, using static data:', error);
    const staticTrip = staticTripsData.find(t => t.id === id);
    return staticTrip || null;
  }
}