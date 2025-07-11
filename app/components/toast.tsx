"use client"

import { useEffect } from "react"
import { CheckCircle, X } from "lucide-react"

interface ToastProps {
  show: boolean
  message: string
  onClose: () => void
}

export function Toast({ show, message, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fadeInUp">
      <div className="bg-green-600/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-lg border border-green-500/20 flex items-center gap-3 max-w-sm">
        <CheckCircle className="w-5 h-5 text-green-200" />
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-green-200 hover:text-white transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
