"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Lightbox } from "../../components/lightbox";
import { Toast } from "../../components/toast";
import { AudioPlayer } from "../../components/audio-player";

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
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryImages)[0] | null
  >(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Show toast when page loads
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Audio Player */}
      <AudioPlayer />

      {/* Toast Notification */}
      <Toast
        show={showToast}
        message="Now playing your favourite song 🎶"
        onClose={() => setShowToast(false)}
      />

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
              Dekh ba aapne aap ko and listen to ur fav song (Just press play if
              it isnt playing)
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
