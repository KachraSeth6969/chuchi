"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Heart } from "lucide-react";
import { Lightbox } from "../../components/lightbox";
import { getMediaUrl } from "../../lib/media-config";

// Trip data - you can add more trips here
const trips = [
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

      // Add videos like this: { id: 4, type: "video", src: "/videos/first-trip.mp4", alt: "First adventure video" },
    ]
  },
  {
    id: 2,
    title: "January",
    location: "Still aapke dill mai",
    date: "One week of jan",
    description: "Kya toh roz milte thhe chup chupke, bc",
    media: [
      // Auto-scanned files starting with 2 followed by digits (21, 22, 23, etc.)
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
      // Auto-scanned files starting with 3 followed by digits (31, 32, 33, etc.)
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
      // Auto-scanned files starting with 4 followed by digits (41, 42, 43, etc.)
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
      // Auto-scanned converted files starting with 5 followed by digits (51-59, 510-516)
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
      { id: 99, type: "image", src: "/images/933.jpeg", alt: "" },
      { id: 901, type: "image", src: "/images/934.jpeg", alt: "" },
      { id: 902, type: "image", src: "/images/935.jpeg", alt: "" },
      { id: 903, type: "image", src: "/images/936.jpeg", alt: "" },

      { id: 905, type: "image", src: "/images/938.jpeg", alt: "" },
      { id: 906, type: "image", src: "/images/939.jpeg", alt: "" },
      { id: 907, type: "video", src: "/videos/921.mp4", alt: "" },
      { id: 908, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759248594/116_vd8djo.jpg",alt:""},
      { id: 909, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759248596/115_rtme6h.jpg",alt:""},
      { id: 910, type: "video", src: "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759248857/113_qzx1if.mp4",alt:""},
      { id: 911, type: "video", src: "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759248887/112_fycjln.mp4",alt:""},
      { id: 912, type: "video", src: "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759248894/111_aaefef.mp4",alt:""},
      { id: 913, type: "video", src: "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759248983/114_kcli30.mp4",alt:""},
      { id: 914, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759318177/119_uq2b6h.jpg",alt:""},
      { id: 915, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759318175/120_ptxwyh.jpg",alt:""},
      { id: 916, type: "image", src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759318173/118_hmftcv.jpg",alt:""},
      { id: 917, type: "video", src: "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759318111/117_gq1vkd.mp4",alt:""},
    ]
  },
  {
    id: 8,
    title: "Random Shite",
    location: "Hmm tough question I think aapke dill mai🧐",
    date: "All the best finding dates",
    description: "Inn sab ke liye seperate banane ko kya nai mila still dalneka thha so daal diya",
    media: [
      // Auto-scanned files starting with 6 followed by digits
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

export default function TripsPage() {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="p-6">
        <Link href="/">
          <button className="group flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors duration-200">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
          </button>
        </Link>
      </header>

      {/* Trips Content */}
      <main className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="font-playfair text-3xl md:text-5xl font-light text-neutral-900 mb-4">
              Dekh baa
            </h1>
            <p className="text-neutral-600 text-base font-light max-w-2xl mx-auto">
              This is called as peak unemployment kya kaam nai jeevan mai so uk.....✨
            </p>
          </div>

          {/* Trips List */}
          <div className="space-y-20">
            {trips.map((trip, index) => (
              <div key={trip.id} className="relative">
                {/* Trip Header */}
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{trip.date}</span>
                    <span className="mx-2">•</span>
                    <MapPin className="w-4 h-4" />
                    <span>{trip.location}</span>
                  </div>
                  <h2 className="font-playfair text-2xl md:text-3xl font-light text-neutral-900 mb-4">
                    {trip.title}
                  </h2>
                  <p className="text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                    {trip.description}
                  </p>
                </div>

                {/* Trip Media (Photos & Videos) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {trip.media.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer transition-all duration-200 hover:-translate-y-1"
                      onClick={() => item.type === 'image' ? setSelectedImage(item) : setSelectedVideo(item)}
                    >
                      <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg border border-neutral-100">
                        {item.type === 'image' ? (
                          <>
                            <Image
                              src={getMediaUrl(item.src) || "/placeholder.svg"}
                              alt={item.alt}
                              width={400}
                              height={300}
                              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                              <Heart className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </>
                        ) : (
                          <>
                            <video
                              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                              preload="metadata"
                              muted
                              playsInline
                            >
                              <source src={getMediaUrl(item.src)} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                              <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-0 h-0 border-l-[6px] border-l-neutral-800 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                              </div>
                            </div>
                            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                              VIDEO
                            </div>
                          </>
                        )}
                      </div>
                      {/* Caption for both images and videos */}
                      <p className="text-sm text-neutral-600 mt-2 text-center">{item.alt}</p>
                    </div>
                  ))}
                </div>

                {/* Divider (except for last trip) */}
                {index < trips.length - 1 && (
                  <div className="flex justify-center mt-16">
                    <div className="w-48 h-px bg-neutral-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="text-center mt-20 pt-16 border-t border-neutral-200">
            <p className="text-neutral-600 text-lg mb-6">
              Ready to create more memories together? 🌟
            </p>
            <Link href="/gallery">
              <button className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200">
                View All Photos
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Lightbox for Images */}
      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-neutral-300 transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
            <video
              className="w-full h-auto max-h-[80vh] rounded-lg"
              controls
              autoPlay
              preload="metadata"
            >
              <source src={getMediaUrl(selectedVideo.src)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="text-white text-center mt-4">{selectedVideo.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
}
