"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Edit3, X, Check, Plus, Trash2, Info } from "lucide-react";
import { Lightbox } from "../../components/lightbox";
import MediaQueue from "../../components/media-queue";
import PhotoDetailsModal from "../../components/photo-details-modal";
import { getMediaUrl } from "../../lib/media-config";
import { getGalleryImages, type MediaItem } from "../../lib/data-fetchers";

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedForRemoval, setSelectedForRemoval] = useState<Set<number>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedPhotoForDetails, setSelectedPhotoForDetails] = useState<{
    media: MediaItem;
    context: 'gallery';
  } | null>(null);

  // Load gallery images on component mount
  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const images = await getGalleryImages();
        setGalleryImages(images);
      } catch (error) {
        console.error('Error loading gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryImages();
  }, []);

  const handleImageClick = (image: MediaItem) => {
    if (isEditMode) {
      const newSelected = new Set(selectedForRemoval);
      if (newSelected.has(image.id)) {
        newSelected.delete(image.id);
      } else {
        newSelected.add(image.id);
      }
      setSelectedForRemoval(newSelected);
    } else {
      setSelectedImage(image);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
    setSelectedForRemoval(new Set());
  };

  const handleConfirmRemoval = async () => {
    if (selectedForRemoval.size === 0) return;

    setIsRemoving(true);
    try {
      const updates = Array.from(selectedForRemoval).map(imageId => ({
        mediaId: imageId,
        action: 'remove',
        source: 'gallery',
        sourceDescription: 'Removed from gallery'
      }));

      // Send batch update to API
      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (response.ok) {
        // Reload gallery images to reflect changes
        const images = await getGalleryImages();
        setGalleryImages(images);
        setSelectedForRemoval(new Set());
        setIsEditMode(false);
      }
    } catch (error) {
      console.error('Error removing images:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCancelRemoval = () => {
    setSelectedForRemoval(new Set());
  };

  const handlePhotosAdded = async () => {
    // Reload gallery images to show newly added photos
    const images = await getGalleryImages();
    setGalleryImages(images);
    setShowAddModal(false);
  };

  const handlePhotoRightClick = (e: React.MouseEvent, media: MediaItem) => {
    e.preventDefault();
    setSelectedPhotoForDetails({
      media,
      context: 'gallery'
    });
  };

  const handlePhotoInfoClick = (media: MediaItem) => {
    setSelectedPhotoForDetails({
      media,
      context: 'gallery'
    });
  };

  const handleUpdateDescriptionInGallery = async (itemId: string | number, description: string) => {
    const mediaId = typeof itemId === 'string' ? parseInt(itemId) : itemId;
    try {
      const response = await fetch(`/api/media/${mediaId}/description`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });

      if (response.ok) {
        // Reload gallery images
        const images = await getGalleryImages();
        setGalleryImages(images);
      }
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const handleRemoveFromGalleryDetails = async (itemId: string | number) => {
    const mediaId = typeof itemId === 'string' ? parseInt(itemId) : itemId;
    try {
      const updates = [{
        mediaId,
        action: 'remove',
        source: 'gallery',
        sourceDescription: 'Removed from gallery'
      }];

      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (response.ok) {
        // Reload gallery images
        const images = await getGalleryImages();
        setGalleryImages(images);
        setSelectedPhotoForDetails(null);
      }
    } catch (error) {
      console.error('Error removing from gallery:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

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
                    onClick={handleConfirmRemoval}
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
              onClick={handleEditClick}
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
                  onClick={() => handleImageClick(image)}
                  onContextMenu={(e) => handlePhotoRightClick(e, image)}
                >
                  <div className={`relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg border border-neutral-100 ${
                    isSelected ? 'opacity-75' : ''
                  }`}>
                    <Image
                      src={getMediaUrl(image.src) || "/placeholder.svg"}
                      alt="Gallery image"
                      width={400}
                      height={400}
                      className="w-full h-60 object-cover"
                    />
                    
                    {/* Selection overlay for edit mode */}
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div
                          className={`w-8 h-8 rounded-full border-4 ${
                            isSelected
                              ? 'bg-red-500 border-white'
                              : 'border-white/60'
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-4 h-4 text-white m-0.5" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Info button overlay */}
                    {!isEditMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhotoInfoClick(image);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80"
                        title="Photo details"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Add Photos Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Add Photos to Gallery</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <MediaQueue />
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <Lightbox
          image={{
            id: selectedImage.id,
            src: getMediaUrl(selectedImage.src) || '',
            alt: selectedImage.alt
          }}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Photo Details Modal */}
      <PhotoDetailsModal
        isOpen={!!selectedPhotoForDetails}
        onClose={() => setSelectedPhotoForDetails(null)}
        mediaItem={selectedPhotoForDetails ? {
          id: selectedPhotoForDetails.media.id,
          src: getMediaUrl(selectedPhotoForDetails.media.src) || '',
          alt: selectedPhotoForDetails.media.alt,
          type: selectedPhotoForDetails.media.type,
          description: selectedPhotoForDetails.media.description || selectedPhotoForDetails.media.alt
        } : null}
        onUpdateDescription={handleUpdateDescriptionInGallery}
        onUpdateOrder={async () => {}} // Gallery doesn't have ordering
        onRemove={handleRemoveFromGalleryDetails}
        context="gallery"
      />

      {/* Edit Mode Instructions */}
      {isEditMode && (
        <div className="fixed bottom-6 left-6 right-6 bg-white rounded-lg border border-neutral-200 shadow-lg p-4 z-40">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-neutral-900 font-medium mb-2">Gallery Edit Mode Active</p>
            <p className="text-neutral-600 text-sm">
              {selectedForRemoval.size === 0 
                ? 'Tap photos to select them for removal from gallery.'
                : `${selectedForRemoval.size} photo${selectedForRemoval.size !== 1 ? 's' : ''} selected for removal.`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}