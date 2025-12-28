"use client";

import { useState, useEffect } from "react";
import { X, Save, Edit3, ArrowUp, ArrowDown, Trash2, Image as ImageIcon, Video } from "lucide-react";

interface MediaItem {
  id: string | number;
  src: string;
  alt?: string;
  type: 'image' | 'video';
  description?: string;
  order?: number;
}

interface PhotoDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItem: MediaItem | null;
  onUpdateDescription: (itemId: string | number, description: string) => Promise<void>;
  onUpdateOrder: (itemId: string | number, direction: 'up' | 'down') => Promise<void>;
  onRemove: (itemId: string | number) => Promise<void>;
  context: 'gallery' | 'trip';
  contextName?: string;
}

export default function PhotoDetailsModal({
  isOpen,
  onClose,
  mediaItem,
  onUpdateDescription,
  onUpdateOrder,
  onRemove,
  context,
  contextName
}: PhotoDetailsModalProps) {
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Initialize description when modal opens
  useEffect(() => {
    if (mediaItem) {
      setDescription(mediaItem.description || mediaItem.alt || '');
    }
  }, [mediaItem]);

  if (!isOpen || !mediaItem) return null;

  // Handle description save
  const handleSaveDescription = async () => {
    if (!mediaItem) return;
    
    setIsSaving(true);
    try {
      await onUpdateDescription(mediaItem.id, description);
    } catch (error) {
      console.error('Failed to update description:', error);
      alert('Failed to update description. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle order change
  const handleOrderChange = async (direction: 'up' | 'down') => {
    if (!mediaItem) return;
    
    try {
      await onUpdateOrder(mediaItem.id, direction);
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order. Please try again.');
    }
  };

  // Handle remove
  const handleRemove = async () => {
    if (!mediaItem) return;
    
    const confirmMessage = context === 'gallery' 
      ? 'Remove this photo from the gallery? It will be moved to the queue.'
      : `Remove this photo from "${contextName}"? It will be moved to the queue.`;
    
    if (!confirm(confirmMessage)) return;
    
    setIsRemoving(true);
    try {
      await onRemove(mediaItem.id);
      onClose();
    } catch (error) {
      console.error('Failed to remove media:', error);
      alert('Failed to remove photo. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {mediaItem.type === 'video' ? (
                <Video className="w-5 h-5 text-neutral-600" />
              ) : (
                <ImageIcon className="w-5 h-5 text-neutral-600" />
              )}
              <h3 className="font-playfair text-xl text-neutral-900">
                Photo Details
                {contextName && (
                  <span className="text-neutral-600 text-base font-normal ml-2">
                    in {contextName}
                  </span>
                )}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Media Preview */}
          <div className="lg:w-2/3 p-6 bg-neutral-50 flex items-center justify-center">
            {mediaItem.type === 'image' ? (
              <img
                src={mediaItem.src}
                alt={mediaItem.alt}
                className="max-w-full max-h-[50vh] lg:max-h-[60vh] object-contain rounded-lg shadow-lg"
              />
            ) : (
              <video
                src={mediaItem.src}
                controls
                className="max-w-full max-h-[50vh] lg:max-h-[60vh] rounded-lg shadow-lg"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Details Panel */}
          <div className="lg:w-1/3 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Description Editor */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Edit3 className="w-4 h-4 inline mr-2" />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors"
                  rows={4}
                  placeholder="Add a description for this photo..."
                />
                <button
                  onClick={handleSaveDescription}
                  disabled={isSaving}
                  className="mt-2 flex items-center gap-2 bg-fuchsia-200 hover:bg-fuchsia-300 text-neutral-900 font-medium py-2 px-4 rounded-lg border border-rose-200 hover:border-rose-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Description'}
                </button>
              </div>

              {/* Order Controls */}
              {context === 'trip' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Photo Order
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOrderChange('up')}
                      className="flex items-center gap-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                      Move Up
                    </button>
                    <button
                      onClick={() => handleOrderChange('down')}
                      className="flex items-center gap-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" />
                      Move Down
                    </button>
                  </div>
                </div>
              )}

              {/* Media Info */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Media Information
                </label>
                <div className="bg-neutral-100 p-3 rounded-lg text-sm">
                  <p><strong>Type:</strong> {mediaItem.type === 'image' ? 'Photo' : 'Video'}</p>
                  <p><strong>ID:</strong> {mediaItem.id}</p>
                  {mediaItem.order && (
                    <p><strong>Order:</strong> {mediaItem.order}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-neutral-200">
                <button
                  onClick={handleRemove}
                  disabled={isRemoving}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {isRemoving ? 'Removing...' : `Remove from ${context === 'gallery' ? 'Gallery' : 'Trip'}`}
                </button>
                <p className="text-xs text-neutral-500 mt-2 text-center">
                  This will move the photo to the queue, not delete it permanently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}