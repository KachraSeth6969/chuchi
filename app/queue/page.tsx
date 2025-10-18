import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import MediaQueue from "@/components/media-queue";

export default function QueuePage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <h1 className="font-playfair text-xl text-neutral-900">Media Queue</h1>
          <Link href="/upload" className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors">
            <Upload className="w-5 h-5" />
            <span className="font-medium">Upload</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Description */}
          <div className="mb-8 text-center">
            <h2 className="font-playfair text-2xl text-neutral-900 mb-3">Manage Your Media</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Your uploaded photos and videos live here until you organize them into trips or the gallery. 
              Removed items are kept safe in the queue - nothing is ever permanently lost unless you choose to delete it.
            </p>
          </div>

          {/* Queue Component */}
          <MediaQueue className="mb-8" />

          {/* Help Section */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h3 className="font-medium text-neutral-900 mb-3">How the Queue Works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-neutral-900 mb-1">New Uploads</p>
                  <p className="text-neutral-600">Photos and videos you've uploaded that haven't been organized yet.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-neutral-900 mb-1">Removed Items</p>
                  <p className="text-neutral-600">Media removed from trips or gallery, but safely preserved here.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-neutral-900 mb-1">Orphaned Media</p>
                  <p className="text-neutral-600">Photos from deleted trips that need to be reassigned.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pb-8 px-6">
        <p className="text-neutral-600 text-sm">Organize your memories ✨</p>
        <p className="text-neutral-500 text-xs mt-2">Nothing is ever permanently lost in the queue</p>
      </footer>
    </div>
  );
}