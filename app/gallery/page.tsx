"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Edit3, X, Check, Plus, Trash2, Camera, Upload } from "lucide-react";
import { Lightbox } from "../../components/lightbox";
import MediaQueue from "../../components/media-queue";
import PhotoDetailsModal from "../../components/photo-details-modal";
import AuthModal from "../../components/auth-modal";
import FloatingActionButton from "../../components/floating-action-button";
import { getMediaUrl } from "../../lib/media-config";
import { getGalleryImages, type MediaItem } from "../../lib/data-fetchers";
import { useAuth } from "../../lib/auth-context";

export default function GalleryPage() {
  // Authentication
  const { isAuthenticated } = useAuth();
  
  // Dynamic data state
  const [galleryImages, setGalleryImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Original functionality state
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPhotoForDetails, setSelectedPhotoForDetails] = useState<{
    media: MediaItem;
    context: 'gallery';
  } | null>(null);
  const [selectedForRemoval, setSelectedForRemoval] = useState<Set<number>>(new Set());
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedQueueItems, setSelectedQueueItems] = useState<any[]>([]);
  const [isAddingToGallery, setIsAddingToGallery] = useState(false);

  // Load gallery data on component mount
  useEffect(() => {
    const loadGallery = async () => {
      try {
        // Use the API endpoint instead of direct database function
        const response = await fetch('/api/media');
        const data = await response.json();
        
        if (data.success) {
          // Transform API response to match component expectations
          const galleryData = data.media.map((item: any) => ({
            id: item.id,
            type: item.type,
            src: item.cloudinaryUrl,
            alt: item.filename,
            description: item.description,
            order: item.sortOrder
          }));
          console.log('Loaded gallery data:', galleryData);
          console.log('Gallery count:', galleryData.length);
          console.log('Loaded gallery data:', galleryData);
          console.log('Gallery count:', galleryData.length);
          setGalleryImages(galleryData);
        } else {
          throw new Error('Failed to load gallery data');
        }
      } catch (error) {
        console.error('Error loading gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  // Handle image click for original lightbox functionality
  const handleImageClick = (image: any) => {
    if (editMode) {
      // In edit mode, handle selection for removal
      const newSelected = new Set(selectedForRemoval);
      if (newSelected.has(image.id)) {
        newSelected.delete(image.id);
      } else {
        newSelected.add(image.id);
      }
      setSelectedForRemoval(newSelected);
    } else {
      // Normal mode - open lightbox
      setSelectedImage(image);
    }
  };

  // Edit mode handlers
  const handleEditClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setEditMode(!editMode);
    setSelectedForRemoval(new Set());
  };

  const handleConfirmRemoval = async () => {
    if (selectedForRemoval.size === 0) return;

    setIsRemoving(true);
    try {
      // Convert to the format expected by the DELETE API
      const mediaIds = Array.from(selectedForRemoval);

      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mediaIds,
          source: 'gallery',
          action: 'soft-delete'
        })
      });

      if (response.ok) {
        // Reload gallery to reflect changes using API endpoint
        const galleryResponse = await fetch('/api/media');
        const galleryData = await galleryResponse.json();
        
        if (galleryData.success) {
          const transformedData = galleryData.media.map((item: any) => ({
            id: item.id,
            type: item.type,
            src: item.cloudinaryUrl,
            alt: item.filename,
            description: item.description,
            order: item.sortOrder
          }));
          setGalleryImages(transformedData);
        }
        
        setSelectedForRemoval(new Set());
        setEditMode(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove photos');
      }
    } catch (error) {
      console.error('Error removing photos:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCancelRemoval = () => {
    setSelectedForRemoval(new Set());
  };

  const handlePhotoRightClick = (e: React.MouseEvent, media: MediaItem) => {
    e.preventDefault();
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
        // Reload gallery
        const galleryData = await getGalleryImages();
        setGalleryImages(galleryData);
      }
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const handleUpdateOrderInGallery = async (itemId: string | number, direction: 'up' | 'down') => {
    const mediaId = typeof itemId === 'string' ? parseInt(itemId) : itemId;
    try {
      const response = await fetch(`/api/media/${mediaId}/order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction })
      });

      if (response.ok) {
        // Reload gallery
        const galleryData = await getGalleryImages();
        setGalleryImages(galleryData);
      }
    } catch (error) {
      console.error('Error updating order:', error);
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
        // Reload gallery
        const galleryData = await getGalleryImages();
        setGalleryImages(galleryData);
        setSelectedPhotoForDetails(null);
      }
    } catch (error) {
      console.error('Error removing from gallery:', error);
    }
  };

  // Handle adding selected queue items to gallery
  const handleAddToGallery = async () => {
    if (selectedQueueItems.length === 0) return;

    setIsAddingToGallery(true);
    try {
      // Send queue item IDs - the API will handle getting the mediaIds
      const queueItemIds = selectedQueueItems.map(item => parseInt(item.id));

      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          queueItemIds,
          assignTo: 'gallery'
        })
      });

      const apiResult = await response.json();

      if (response.ok) {
        // Reload gallery to show new items using API endpoint
        const galleryResponse = await fetch('/api/media');
        const galleryData = await galleryResponse.json();
        
        if (galleryData.success) {
          const transformedData = galleryData.media.map((item: any) => ({
            id: item.id,
            type: item.type,
            src: item.cloudinaryUrl,
            alt: item.filename,
            description: item.description,
            order: item.sortOrder
          }));
          setGalleryImages(transformedData);
        }
        
        // Close modal and reset selections
        setShowQueue(false);
        setSelectedQueueItems([]);
      } else {
        throw new Error(apiResult.error || 'Failed to add items to gallery');
      }
    } catch (error) {
      console.error('Error adding to gallery:', error);
      alert('Failed to add photos to gallery. Please try again.');
    } finally {
      setIsAddingToGallery(false);
    }
  };

  // FAB options for gallery
  const fabOptions = [
    {
      icon: <Plus className="w-5 h-5" />,
      label: "Add Photos",
      onClick: () => isAuthenticated ? setShowQueue(true) : setShowAuthModal(true),
      color: "text-blue-600"
    },
    {
      icon: <Edit3 className="w-5 h-5" />,
      label: editMode ? "Exit Edit" : "Edit",
      onClick: handleEditClick,
      color: editMode ? "text-red-600" : "text-green-600"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading gallery...</p>
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
          
          {/* Edit Mode Actions - only show during edit mode */}
          {editMode && (
            <div className="flex items-center gap-2">
              {selectedForRemoval.size > 0 && (
                <button
                  onClick={handleConfirmRemoval}
                  disabled={isRemoving}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {isRemoving ? 'Removing...' : `Remove (${selectedForRemoval.size})`}
                </button>
              )}
              <button
                onClick={handleCancelRemoval}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
                Done
              </button>
            </div>
          )}
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
          {galleryImages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-neutral-600" />
              </div>
              <p className="text-neutral-600 mb-4">No photos in gallery yet</p>
              <button
                onClick={() => setShowQueue(true)}
                className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
              >
                Add First Photo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className={`group cursor-pointer transition-all duration-200 hover:-translate-y-1 relative ${
                    editMode && selectedForRemoval.has(image.id) ? 'ring-4 ring-red-500' : ''
                  }`}
                  onClick={() => handleImageClick(image)}
                  onContextMenu={(e) => !editMode && handlePhotoRightClick(e, image)}
                >
                  <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg border border-neutral-100">
                    <Image
                      src={getMediaUrl(image.src) || "/placeholder.svg"}
                      alt={image.alt || "Gallery image"}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Selection overlay for edit mode */}
                  {editMode && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div
                        className={`w-8 h-8 rounded-full border-4 ${
                          selectedForRemoval.has(image.id)
                            ? 'bg-red-500 border-white'
                            : 'border-white/60'
                        }`}
                      >
                        {selectedForRemoval.has(image.id) && (
                          <Check className="w-4 h-4 text-white m-0.5" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Navigation to Trips */}
          <div className="text-center mt-16 pt-12 border-t border-neutral-200">
            <p className="text-neutral-600 text-lg mb-6">
              Want to see our adventures together? 🌍
            </p>
            <Link href="/trips">
              <button className="bg-white hover:bg-neutral-50 text-neutral-900 font-medium py-3 px-6 rounded-lg border border-neutral-300 hover:border-neutral-400 transition-all duration-200">
                View Our Moments
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Add Photos Modal */}
      {showQueue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Add Photos to Gallery</h2>
              <button
                onClick={() => {
                  setShowQueue(false);
                  setSelectedQueueItems([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
              <MediaQueue 
                selectionMode={true}
                onSelectMedia={setSelectedQueueItems}
              />
            </div>
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                {selectedQueueItems.length > 0 
                  ? `${selectedQueueItems.length} photo${selectedQueueItems.length !== 1 ? 's' : ''} selected`
                  : 'Select photos to add to gallery'
                }
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowQueue(false);
                    setSelectedQueueItems([]);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToGallery}
                  disabled={selectedQueueItems.length === 0 || isAddingToGallery}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAddingToGallery ? 'Adding...' : `Add ${selectedQueueItems.length > 0 ? selectedQueueItems.length : ''} Photo${selectedQueueItems.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          </div>
        </div>
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
        onUpdateOrder={handleUpdateOrderInGallery}
        onRemove={handleRemoveFromGalleryDetails}
        context="gallery"
        contextName="Gallery"
      />

      {/* Lightbox Modal */}
      {selectedImage && (
        <Lightbox
          image={{
            id: selectedImage.id,
            src: getMediaUrl(selectedImage.src) || '',
            alt: selectedImage.alt || "Gallery image"
          }}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Edit Mode Instructions */}
      {editMode && (
        <div className="fixed bottom-6 left-6 right-6 bg-white rounded-lg border border-neutral-200 shadow-lg p-4 z-40">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-neutral-900 font-medium mb-2">Gallery Edit Mode Active</p>
            <p className="text-neutral-600 text-sm">
              {selectedForRemoval.size === 0 
                ? 'Tap photos to select them for removal, or right-click for photo details.'
                : `${selectedForRemoval.size} photo${selectedForRemoval.size !== 1 ? 's' : ''} selected for removal.`
              }
            </p>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          setEditMode(true);
        }}
      />

      {/* Floating Action Button */}
      <FloatingActionButton options={fabOptions} />
    </div>
  );
}