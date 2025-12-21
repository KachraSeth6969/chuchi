"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Lightbox } from "../../components/lightbox";
import { getMediaUrl } from "../../lib/media-config";

// Your gallery images
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
  { id: 28, src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1766322073/IMG_1309_kb4mb3.jpg" },
  { id: 29, src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1766322074/IMG_1145_nb14ax.jpg" },
  { id: 30, src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1766322076/IMG_1389_qzqslm.jpg" },
  { id: 31, src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1766322077/IMG_1228_kblsy4.jpg" },
  { id: 32, src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1766322078/IMG_1262_g6fbiz.jpg" },
  { id: 33, src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1766322079/IMG_1308_noh0tp.jpg" },
  { id: 34, src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1766322081/IMG_1261_igalue.jpg" },
  { id: 35, src: "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1766322083/IMG_1375_tffgre.jpg" },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryImages)[0] | null
  >(null);

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

      {/* Gallery Content */}
      <main className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Gallery Title */}
          <div className="text-center mb-16">
            <h1 className="font-playfair text-3xl md:text-5xl font-light text-neutral-900 mb-4">
              Too much chuchi💀
            </h1>
            <p className="text-neutral-600 text-base font-light">
              Dekh ba aapne aap ko.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="group cursor-pointer transition-all duration-200 hover:-translate-y-1"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg border border-neutral-100">
                  <Image
                    src={getMediaUrl(image.src) || "/placeholder.svg"}
                    alt="Gallery image"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation to Trips */}
          <div className="text-center mt-16 pt-12 border-t border-neutral-200">
            <p className="text-neutral-600 text-lg mb-6">
              Want to see our adventures together? 🌍
            </p>
            <Link href="/trips">
              <button className="bg-white hover:bg-neutral-50 text-neutral-900 font-medium py-3 px-6 rounded-lg border border-neutral-300 hover:border-neutral-400 transition-all duration-200">
                View Our Trips
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
