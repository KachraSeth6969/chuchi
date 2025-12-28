"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Heart, Edit3, X, Check, Plus, Trash2, Settings, Camera, Info } from "lucide-react";
import { Lightbox } from "../../components/lightbox";
import MediaQueue from "../../components/media-queue";
import TripForm from "../../components/trip-form";
import PhotoDetailsModal from "../../components/photo-details-modal";
import { getMediaUrl } from "../../lib/media-config";
import { getTrips, type Trip, type MediaItem } from "../../lib/data-fetchers";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showTripForm, setShowTripForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [selectedPhotoForDetails, setSelectedPhotoForDetails] = useState<{
    media: MediaItem;
    context: 'trip';
    tripId: number;
  } | null>(null);

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

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedForRemoval, setSelectedForRemoval] = useState<Set<string>>(new Set());
  const [showAddPhotosModal, setShowAddPhotosModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [showPhotoDetails, setShowPhotoDetails] = useState(false);
  const [selectedPhotoForDetailsOld, setSelectedPhotoForDetailsOld] = useState<any>(null);
  const [selectedPhotoTripId, setSelectedPhotoTripId] = useState<number | null>(null);

  const handleMediaClick = (media: any, allMedia: any[]) => {
    if (media.type === "video") {
      setSelectedVideo(media);
    } else {
      setSelectedImage(media);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
    setSelectedForRemoval(new Set());
  };

  const handlePhotoClick = (media: any, tripId: number) => {
    if (isEditMode) {
      const key = `${tripId}-${media.id}`;
      const newSelected = new Set(selectedForRemoval);
      if (newSelected.has(key)) {
        newSelected.delete(key);
      } else {
        newSelected.add(key);
      }
      setSelectedForRemoval(newSelected);
    } else {
      const trip = trips.find(t => t.id === tripId);
      if (trip) {
        handleMediaClick(media, trip.media);
      }
    }
  };

  const handleConfirmRemoval = async () => {
    if (selectedForRemoval.size === 0) return;

    try {
      const updates = Array.from(selectedForRemoval).map(key => {
        const [tripId, mediaId] = key.split('-');
        return {
          mediaId: parseInt(mediaId),
          action: 'remove',
          source: 'trip',
          sourceId: parseInt(tripId),
          sourceDescription: `Removed from trip: ${trips.find(t => t.id === parseInt(tripId))?.title}`
        };
      });

      // Send batch update to API
      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (response.ok) {
        // Reload trips data to reflect changes
        const tripsData = await getTrips();
        setTrips(tripsData);
        setSelectedForRemoval(new Set());
        setIsEditMode(false);
      }
    } catch (error) {
      console.error('Error removing photos:', error);
    }
  };

  const handleCancelRemoval = () => {
    setSelectedForRemoval(new Set());
  };

  const handleTripDelete = async (tripId: number) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Reload trips data
        const tripsData = await getTrips();
        setTrips(tripsData);
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const handleTripEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setShowTripForm(true);
  };

  const handleCreateTrip = async (tripData: any) => {
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });

      if (response.ok) {
        // Reload trips data
        const tripsData = await getTrips();
        setTrips(tripsData);
        setShowTripForm(false);
        setEditingTrip(null);
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
        // Reload trips data
        const tripsData = await getTrips();
        setTrips(tripsData);
        setShowTripForm(false);
        setEditingTrip(null);
      }
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  };

  const handleAddPhotosToTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowAddPhotosModal(true);
  };

  const handlePhotosAssigned = async () => {
    // Reload trips data to show newly assigned photos
    const tripsData = await getTrips();
    setTrips(tripsData);
    setShowAddPhotosModal(false);
    setSelectedTrip(null);
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

  const handleUpdateDescriptionInTrip = async (mediaId: number, description: string) => {
    try {
      const response = await fetch(`/api/media/${mediaId}/description`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });

      if (response.ok) {
        // Reload trips data
        const tripsData = await getTrips();
        setTrips(tripsData);
      }
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const handleUpdateOrderInTrip = async (mediaId: number, direction: 'up' | 'down') => {
    if (!selectedPhotoForDetails) return;

    try {
      const response = await fetch(`/api/media/${mediaId}/order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction, tripId: selectedPhotoForDetails.tripId })
      });

      if (response.ok) {
        // Reload trips data
        const tripsData = await getTrips();
        setTrips(tripsData);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleRemoveFromTripDetails = async (mediaId: number) => {
    if (!selectedPhotoForDetails) return;

    try {
      const updates = [{
        mediaId,
        action: 'remove',
        source: 'trip',
        sourceId: selectedPhotoForDetails.tripId,
        sourceDescription: `Removed from trip: ${trips.find(t => t.id === selectedPhotoForDetails.tripId)?.title}`
      }];

      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (response.ok) {
        // Reload trips data
        const tripsData = await getTrips();
        setTrips(tripsData);
        setSelectedPhotoForDetails(null);
      }
    } catch (error) {
      console.error('Error removing from trip:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-pink-600 hover:text-pink-700">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-neutral-900">Our Trips</h1>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode ? (
              <>
                <button
                  onClick={() => setShowQueue(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4" />
                  Queue
                </button>
                <button
                  onClick={() => setShowTripForm(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                  New Trip
                </button>
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {selectedForRemoval.size > 0 && (
                  <button
                    onClick={handleConfirmRemoval}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove ({selectedForRemoval.size})
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
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {trips.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No trips yet. Create your first memory!</p>
            <button
              onClick={() => setShowTripForm(true)}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Create First Trip
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Trip Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-neutral-900 mb-2">{trip.title}</h2>
                      <div className="flex items-center gap-4 text-neutral-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{trip.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{trip.date}</span>
                        </div>
                      </div>
                      <p className="text-neutral-700">{trip.description}</p>
                    </div>
                    {isEditMode && (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleAddPhotosToTrip(trip)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Add photos"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleTripEdit(trip)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                          title="Edit trip"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleTripDelete(trip.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete trip"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trip Media */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {trip.media.map((media) => (
                      <div
                        key={media.id}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${
                          isEditMode && selectedForRemoval.has(`${trip.id}-${media.id}`)
                            ? 'ring-4 ring-red-500'
                            : ''
                        }`}
                        onClick={() => handlePhotoClick(media, trip.id)}
                        onContextMenu={(e) => handlePhotoRightClick(e, media, trip.id)}
                      >
                        {media.type === "image" ? (
                          <Image
                            src={getMediaUrl(media.src) || ''}
                            alt={media.alt}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <video
                            src={getMediaUrl(media.src) || ''}
                            className="w-full h-full object-cover"
                            muted
                          />
                        )}
                        
                        {/* Info button overlay */}
                        {!isEditMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePhotoInfoClick(media, trip.id);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80"
                            title="Photo details"
                          >
                            <Info className="w-3 h-3" />
                          </button>
                        )}

                        {/* Selection overlay for edit mode */}
                        {isEditMode && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div
                              className={`w-8 h-8 rounded-full border-4 ${
                                selectedForRemoval.has(`${trip.id}-${media.id}`)
                                  ? 'bg-red-500 border-white'
                                  : 'border-white/60'
                              }`}
                            >
                              {selectedForRemoval.has(`${trip.id}-${media.id}`) && (
                                <Check className="w-4 h-4 text-white m-0.5" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Queue Modal */}
      {showQueue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Media Queue</h2>
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

      {/* Add Photos Modal */}
      {showAddPhotosModal && selectedTrip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Add Photos to {selectedTrip.title}</h2>
              <button
                onClick={() => setShowAddPhotosModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <MediaQueue 
                mode="assign" 
                targetTripId={selectedTrip.id}
                onAssignment={handlePhotosAssigned}
              />
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

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <video
              src={getMediaUrl(selectedVideo.src) || ''}
              controls
              autoPlay
              className="w-full h-auto max-h-[90vh]"
            />
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
        trip={editingTrip}
        onSubmit={editingTrip ? handleUpdateTrip : handleCreateTrip}
        mode={editingTrip ? "edit" : "create"}
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

      {/* Edit Mode Instructions */}
      {isEditMode && (
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
    </div>
  );
}