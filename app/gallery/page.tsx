"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Edit3, X, Check, Plus, Trash2 } from "lucide-react";
import { Lightbox } from "../../components/lightbox";
import MediaQueue from "../../components/media-queue";
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
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryImages)[0] | null
  >(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedForRemoval, setSelectedForRemoval] = useState<Set<number>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedForRemoval(new Set());
  };

  // Handle photo selection for removal
  const togglePhotoSelection = (imageId: number) => {
    if (!isEditMode) return;
    
    const newSelection = new Set(selectedForRemoval);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedForRemoval(newSelection);
  };

  // Remove selected photos (move to queue)
  const removeSelectedPhotos = async () => {
    if (selectedForRemoval.size === 0) return;
    
    setIsRemoving(true);
    try {
      // Call API to move photos to queue (soft delete)
      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaIds: Array.from(selectedForRemoval),
          source: 'gallery',
          action: 'soft-delete'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove photos');
      }

      const result = await response.json();
      console.log('Photos moved to queue:', result);
      
      // Reset selection and exit edit mode
      setSelectedForRemoval(new Set());
      setIsEditMode(false);
      
      // TODO: Refresh gallery data from database
      // This would trigger a re-fetch of gallery images
    } catch (error) {
      console.error('Failed to remove photos:', error);
      alert('Failed to remove photos. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  // Handle adding photos from queue
  const handleAddPhotos = async (queueItems: any[]) => {
    try {
      // Call API to assign queue items to gallery
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queueItemIds: queueItems.map(item => item.id),
          assignTo: 'gallery'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add photos to gallery');
      }

      const result = await response.json();
      console.log('Photos added to gallery:', result);
      
      setShowAddModal(false);
      // TODO: Refresh gallery data from database
    } catch (error) {
      console.error('Failed to add photos:', error);
      alert('Failed to add photos. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <button className="group flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors duration-200">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </button>
          </Link>
          
          {/* Edit Mode Controls */}
          <div className="flex items-center gap-3">
            {isEditMode && (
              <>
                {selectedForRemoval.size > 0 && (
                  <button
                    onClick={removeSelectedPhotos}
                    disabled={isRemoving}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isRemoving ? 'Removing...' : `Remove ${selectedForRemoval.size}`}
                  </button>
                )}
                
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-fuchsia-200 hover:bg-fuchsia-300 text-neutral-900 font-medium py-2 px-4 rounded-lg border border-rose-200 hover:border-rose-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Photos
                </button>
              </>
            )}
            
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition-colors ${
                isEditMode
                  ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900'
                  : 'text-neutral-800 border border-neutral-300 hover:border-neutral-400'
              }`}
              style={!isEditMode ? { backgroundColor: '#D8BFF8' } : undefined}
            >
              {isEditMode ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Edit
                </>
              )}
            </button>
          </div>
        </div>
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
            {galleryImages.map((image) => {
              const isSelected = selectedForRemoval.has(image.id);
              
              return (
                <div
                  key={image.id}
                  className={`group cursor-pointer transition-all duration-200 ${
                    !isEditMode ? 'hover:-translate-y-1' : ''
                  } ${isSelected ? 'ring-4 ring-red-400' : ''}`}
                  onClick={() => 
                    isEditMode 
                      ? togglePhotoSelection(image.id)
                      : setSelectedImage(image)
                  }
                >
                  <div className={`relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg border border-neutral-100 ${
                    isSelected ? 'opacity-75' : ''
                  }`}>
                    <Image
                      src={getMediaUrl(image.src) || "/placeholder.svg"}
                      alt="Gallery image"
                      width={400}
                      height={300}
                      className={`w-full h-64 object-cover transition-transform duration-300 ${
                        !isEditMode ? 'group-hover:scale-105' : ''
                      }`}
                    />
                    
                    {/* Edit Mode Overlay */}
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-red-500 border-red-500' 
                            : 'bg-white bg-opacity-80 border-neutral-300 hover:border-neutral-400'
                        }`}>
                          {isSelected && <Check className="w-5 h-5 text-white" />}
                        </div>
                      </div>
                    )}
                    
                    {/* Selection Counter */}
                    {isEditMode && isSelected && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {Array.from(selectedForRemoval).indexOf(image.id) + 1}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
      {selectedImage && !isEditMode && (
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Add Photos Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="font-playfair text-xl text-neutral-900">Add Photos from Queue</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
              <MediaQueue
                selectionMode={true}
                onSelectMedia={handleAddPhotos}
                maxSelection={10}
                className="border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Mode Instructions */}
      {isEditMode && (
        <div className="fixed bottom-6 left-6 right-6 bg-white rounded-lg border border-neutral-200 shadow-lg p-4 z-40">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-neutral-900 font-medium mb-2">Edit Mode Active</p>
            <p className="text-neutral-600 text-sm">
              {selectedForRemoval.size === 0 
                ? 'Tap photos to select them for removal, or add new photos from the queue.'
                : `${selectedForRemoval.size} photo${selectedForRemoval.size !== 1 ? 's' : ''} selected for removal. They will be moved to the queue (not permanently deleted).`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
