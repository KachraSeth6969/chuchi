"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface LightboxProps {
  image: {
    id: number
    src: string
    alt: string
  }
  onClose: () => void
}

export function Lightbox({ image, onClose }: LightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 max-w-4xl max-h-[90vh] w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-8 sm:-top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-20 touch-manipulation p-2"
        >
          <X className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Image */}
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            width={800}
            height={600}
            className="max-w-full max-h-[75vh] sm:max-h-[80vh] object-contain w-full"
          />
        </div>
      </div>
    </div>
  )
}
