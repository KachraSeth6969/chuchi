import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { GlobalAudioProvider } from "../components/global-audio-provider"
import { GlobalAudioPlayer } from "../components/global-audio-player"
import { AuthProvider } from "../components/auth-provider"
import AuthGuard from "../components/auth-guard"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
})

export const metadata: Metadata = {
  title: "Chuchi's World",
  description: "A curated collection of moments, memories, and melodies",
  generator: 'v0.dev',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Chuchi's World",
    description: "A curated collection of moments, memories, and melodies",
    type: 'website',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  viewportFit: 'cover',
  themeColor: '#fdf2f8'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <GlobalAudioProvider>
          <AuthProvider>
            <GlobalAudioPlayer />
            <AuthGuard>
              {children}
            </AuthGuard>
          </AuthProvider>
        </GlobalAudioProvider>
      </body>
    </html>
  )
}
