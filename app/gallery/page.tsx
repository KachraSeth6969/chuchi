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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Audio Player */}
      <AudioPlayer />

      {/* Toast Notification */}
      <Toast
        show={showToast}
        message="Now playing your favourite song 🎶"
        onClose={() => setShowToast(false)}
      />

      {/* Header */}
      <header className="p-4 sm:p-6">
        <Link href="/">
          <button className="group flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300 touch-manipulation">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </button>
        </Link>
      </header>

      {/* Gallery Content */}
      <main className="px-3 sm:px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Gallery Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-4 px-2">
              Too much chuchi💀
            </h1>
            <p className="text-slate-300 text-base sm:text-lg px-4">
              Dekh ba aapne aap ko and listen to ur fav song
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    width={400}
                    height={300}
                    className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
