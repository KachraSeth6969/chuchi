"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Lightbox } from "../../components/lightbox";

// Your gallery images
const galleryImages = [
  { id: 1, src: "/images/20231209_134646.JPG", alt: "Beautiful Memory" },
  { id: 2, src: "/images/IMG-20240223-WA0036.JPG", alt: "Special Moment" },
  { id: 3, src: "/images/IMG_2916.jpeg", alt: "Cherished Memory" },
  { id: 4, src: "/images/IMG_3185.jpeg", alt: "Precious Moment" },
  { id: 5, src: "/images/IMG_3243.jpeg", alt: "Wonderful Memory" },
  { id: 6, src: "/images/IMG_3669.jpeg", alt: "Amazing Moment" },
  { id: 7, src: "/images/IMG_3984.jpeg", alt: "Sweet Memory" },
  { id: 8, src: "/images/IMG_5717.jpeg", alt: "Beautiful Moment" },
  { id: 9, src: "/images/IMG_5761.jpeg", alt: "Lovely Memory" },
  { id: 10, src: "/images/IMG_6124.JPG", alt: "Perfect Moment" },
  { id: 11, src: "/images/IMG_6160.jpeg", alt: "Treasured Memory" },
  { id: 12, src: "/images/IMG_6220.JPG", alt: "Golden Moment" },
  { id: 13, src: "/images/IMG_6279.jpg", alt: "Unforgettable Memory" },
  { id: 14, src: "/images/1.jpeg", alt: "New Memory" },
  { id: 15, src: "/images/2.jpeg", alt: "Fresh Moment" },
  { id: 16, src: "/images/3.jpeg", alt: "Latest Memory" },
  { id: 17, src: "/images/76.jpg", alt: "Latest Memory" },
  { id: 18, src: "/images/23.jpg", alt: "Latest Memory" },
  { id: 19, src: "/images/916.jpeg", alt: "Latest Memory" },
  { id: 20, src: "/images/915.jpeg", alt: "Latest Memory" },
  { id: 21, src: "/images/914.jpeg", alt: "Latest Memory" },
  { id: 22, src: "/images/913.jpeg", alt: "Latest Memory" },
  { id: 23, src: "/images/912.jpeg", alt: "Latest Memory" },
  { id: 24, src: "/images/911.jpeg", alt: "Latest Memory" },
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
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
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
