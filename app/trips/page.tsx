"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Heart, Edit3, X, Check, Plus, Trash2, Settings, Camera, Info, Upload } from "lucide-react";
import { Lightbox } from "../../components/lightbox";
import MediaQueue from "../../components/media-queue";
import TripForm from "../../components/trip-form";
import PhotoDetailsModal from "../../components/photo-details-modal";
import AuthModal from "../../components/auth-modal";
import FloatingActionButton from "../../components/floating-action-button";
import { getMediaUrl } from "../../lib/media-config";
import { getTrips, type Trip, type MediaItem } from "../../lib/data-fetchers";
import { useAuth } from "../../lib/auth-context";

export default function TripsPage() {
  // Authentication
  const { isAuthenticated } = useAuth();
  
  // Dynamic data state
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Original functionality state
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  // Edit mode state (keeping existing functionality)
  const [editMode, setEditMode] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showTripForm, setShowTripForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [selectedPhotoForDetails, setSelectedPhotoForDetails] = useState<{
    media: MediaItem;
    context: 'trip';
    tripId: number;
  } | null>(null);
  const [selectedForRemoval, setSelectedForRemoval] = useState<Set<number>>(new Set());
  const [isRemoving, setIsRemoving] = useState(false);

  // Load trips data on component mount
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const tripsData = await getTrips();
        setTrips(tripsData);
      } catch (error) {
        console.error('Error loading trips:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  // Handle media click for original lightbox functionality
  const handleMediaClick = (media: any) => {
    if (editMode) {
      // In edit mode, handle selection for removal
      const newSelected = new Set(selectedForRemoval);
      if (newSelected.has(media.id)) {
        newSelected.delete(media.id);
      } else {
        newSelected.add(media.id);
      }
      setSelectedForRemoval(newSelected);
    } else {
      // Normal mode - open lightbox/video
      if (media.type === "video") {
        setSelectedVideo(media);
      } else {
        setSelectedImage(media);
      }
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
      const updates = Array.from(selectedForRemoval).map(mediaId => ({
        mediaId,
        action: 'remove',
        source: 'trip',
        sourceDescription: 'Removed from trip'
      }));

      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (response.ok) {
        // Reload trips to reflect changes
        const tripsData = await getTrips();
        setTrips(tripsData);
        setSelectedForRemoval(new Set());
        setEditMode(false);
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

  const handleCreateTrip = async (tripData: any) => {
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });

      if (response.ok) {
        // Reload trips
        const tripsData = await getTrips();
        setTrips(tripsData);
        setShowTripForm(false);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  const handleUpdateTrip = async (tripData: any) => {
    if (!editingTrip) return;

    try {
      const response = await fetch(`/api/trips/${editingTrip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });

      if (response.ok) {
        // Reload trips
        const tripsData = await getTrips();
        setTrips(tripsData);
        setEditingTrip(null);
        setShowTripForm(false);
      }
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  };

  const handlePhotoRightClick = (e: React.MouseEvent, media: MediaItem, tripId: number) => {
    e.preventDefault();
    setSelectedPhotoForDetails({
      media,
      context: 'trip',
      tripId
    });
  };

  const handlePhotoInfoClick = (media: MediaItem, tripId: number) => {
    setSelectedPhotoForDetails({
      media,
      context: 'trip',
      tripId
    });
  };

  const handleUpdateDescriptionInTrip = async (itemId: string | number, description: string) => {
    const mediaId = typeof itemId === 'string' ? parseInt(itemId) : itemId;
    try {
      const response = await fetch(`/api/media/${mediaId}/description`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });

      if (response.ok) {
        // Reload trips
        const tripsData = await getTrips();
        setTrips(tripsData);
      }
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const handleUpdateOrderInTrip = async (itemId: string | number, direction: 'up' | 'down') => {
    const mediaId = typeof itemId === 'string' ? parseInt(itemId) : itemId;
    if (!selectedPhotoForDetails) return;

    try {
      const response = await fetch(`/api/media/${mediaId}/order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          direction,
          tripId: selectedPhotoForDetails.tripId
        })
      });

      if (response.ok) {
        // Reload trips
        const tripsData = await getTrips();
        setTrips(tripsData);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleRemoveFromTripDetails = async (itemId: string | number) => {
    const mediaId = typeof itemId === 'string' ? parseInt(itemId) : itemId;
    try {
      const updates = [{
        mediaId,
        action: 'remove',
        source: 'trip',
        sourceDescription: 'Removed from trip'
      }];

      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (response.ok) {
        // Reload trips
        const tripsData = await getTrips();
        setTrips(tripsData);
        setSelectedPhotoForDetails(null);
      }
    } catch (error) {
      console.error('Error removing from trip:', error);
    }
  };

  // FAB options for trips
  const fabOptions = [
    {
      icon: <Plus className="w-5 h-5" />,
      label: "New Trip",
      onClick: () => isAuthenticated ? setShowTripForm(true) : setShowAuthModal(true),
      color: "text-blue-600"
    },
    {
      icon: <Edit3 className="w-5 h-5" />,
      label: editMode ? "Exit Edit" : "Edit",
      onClick: () => {
        if (!isAuthenticated) {
          setShowAuthModal(true);
          return;
        }
        setEditMode(!editMode);
        setSelectedForRemoval(new Set());
      },
      color: editMode ? "text-red-600" : "text-green-600"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading trips...</p>
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

      {/* Trips Content */}
      <main className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="font-playfair text-3xl md:text-5xl font-light text-neutral-900 mb-4">
              Dekh baa
            </h1>
            <p className="text-neutral-600 text-base font-light max-w-2xl mx-auto">
              This is called as peak unemployment kya kaam nai jeevan mai so uk.....✨
            </p>
          </div>

          {/* Trips List */}
          {trips.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-neutral-600" />
              </div>
              <p className="text-neutral-600 mb-4">No trips yet</p>
              <button
                onClick={() => setShowTripForm(true)}
                className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
              >
                Create First Trip
              </button>
            </div>
          ) : (
            <div className="space-y-20">
              {trips.map((trip, index) => (
                <div key={trip.id} className="relative">
                  {/* Trip Header */}
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{trip.date}</span>
                      <span className="mx-2">•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{trip.location}</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h2 className="font-playfair text-2xl md:text-3xl font-light text-neutral-900">
                        {trip.title}
                      </h2>
                      {editMode && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTrip(trip);
                              setShowTripForm(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit trip"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Delete this trip?')) {
                                try {
                                  await fetch(`/api/trips/${trip.id}`, { method: 'DELETE' });
                                  const tripsData = await getTrips();
                                  setTrips(tripsData);
                                } catch (error) {
                                  console.error('Error deleting trip:', error);
                                }
                              }
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete trip"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                      {trip.description}
                    </p>
                  </div>

                  {/* Trip Media (Photos & Videos) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {trip.media.map((item) => (
                      <div
                        key={item.id}
                        className={`group cursor-pointer transition-all duration-200 hover:-translate-y-1 relative ${
                          editMode && selectedForRemoval.has(item.id) ? 'ring-4 ring-red-500' : ''
                        }`}
                        onClick={() => handleMediaClick(item)}
                        onContextMenu={(e) => !editMode && handlePhotoRightClick(e, item, trip.id)}
                      >
                        <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg border border-neutral-100">
                          {item.type === 'image' ? (
                            <>
                              <Image
                                src={getMediaUrl(item.src) || "/placeholder.svg"}
                                alt={item.alt}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                                {!editMode && (
                                  <Heart className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                )}
                              </div>
                              
                              {/* Info button overlay */}
                              {!editMode && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePhotoInfoClick(item, trip.id);
                                  }}
                                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80"
                                  title="Photo details"
                                >
                                  <Info className="w-3 h-3" />
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <video
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                preload="metadata"
                                muted
                                playsInline
                              >
                                <source src={getMediaUrl(item.src)} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                {!editMode && (
                                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-0 h-0 border-l-[6px] border-l-neutral-800 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                VIDEO
                              </div>
                            </>
                          )}
                        </div>

                        {/* Selection overlay for edit mode */}
                        {editMode && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div
                              className={`w-8 h-8 rounded-full border-4 ${
                                selectedForRemoval.has(item.id)
                                  ? 'bg-red-500 border-white'
                                  : 'border-white/60'
                              }`}
                            >
                              {selectedForRemoval.has(item.id) && (
                                <Check className="w-4 h-4 text-white m-0.5" />
                              )}
                            </div>
                          </div>
                        )}

                        {/* Caption for both images and videos */}
                        <p className="text-sm text-neutral-600 mt-2 text-center">{item.alt}</p>
                      </div>
                    ))}
                  </div>

                  {/* Divider (except for last trip) */}
                  {index < trips.length - 1 && (
                    <div className="flex justify-center mt-16">
                      <div className="w-48 h-px bg-neutral-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Call to action */}
          <div className="text-center mt-20 pt-16 border-t border-neutral-200">
            <p className="text-neutral-600 text-lg mb-6">
              Ready to create more memories together? 🌟
            </p>
            <Link href="/gallery">
              <button className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200">
                Open Gallery
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
              <h2 className="text-xl font-bold">Add Photos to Trips</h2>
              <button
                onClick={() => setShowQueue(false)}
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

      {/* Trip Form Modal */}
      <TripForm
        isOpen={showTripForm}
        onClose={() => {
          setShowTripForm(false);
          setEditingTrip(null);
        }}
        onSubmit={editingTrip ? handleUpdateTrip : handleCreateTrip}
        mode={editingTrip ? "edit" : "create"}
        initialData={editingTrip || undefined}
      />

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
        onUpdateDescription={handleUpdateDescriptionInTrip}
        onUpdateOrder={handleUpdateOrderInTrip}
        onRemove={handleRemoveFromTripDetails}
        context="trip"
        contextName={selectedPhotoForDetails ? trips.find(t => t.id === selectedPhotoForDetails.tripId)?.title : undefined}
      />

      {/* Lightbox for Images */}
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

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-neutral-300 transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
            <video
              className="w-full h-auto max-h-[80vh] rounded-lg"
              controls
              autoPlay
              preload="metadata"
            >
              <source src={getMediaUrl(selectedVideo.src)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="text-white text-center mt-4">{selectedVideo.alt}</p>
          </div>
        </div>
      )}

      {/* Edit Mode Instructions */}
      {editMode && (
        <div className="fixed bottom-6 left-6 right-6 bg-white rounded-lg border border-neutral-200 shadow-lg p-4 z-40">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-neutral-900 font-medium mb-2">Trip Edit Mode Active</p>
            <p className="text-neutral-600 text-sm">
              {selectedForRemoval.size === 0 
                ? 'Use the controls next to trip titles to manage trips, or tap photos to select them for removal.'
                : `${selectedForRemoval.size} photo${selectedForRemoval.size !== 1 ? 's' : ''} selected for removal across trips.`
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