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
      <div className="absolute inset-0 bg-white/95 backdrop-blur-md" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 max-w-4xl max-h-[90vh] w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-8 sm:-top-12 right-0 text-neutral-600 hover:text-neutral-900 transition-colors duration-200 z-20 bg-white rounded-full p-2 shadow-sm"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Image */}
        <div className="relative rounded-xl overflow-hidden shadow-xl bg-white">
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
