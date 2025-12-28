"use client";

import { useState, useEffect } from "react";
import { Clock, Trash2, RotateCcw, Plus, ImageIcon, Video, AlertCircle, Check, X } from "lucide-react";

interface QueueItem {
  id: string;
  cloudinaryUrl: string;
  originalFilename: string;
  fileType: 'image' | 'video';
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  status: 'new' | 'removed' | 'orphaned';
  removedAt?: Date;
  removedFrom?: string; // trip name or 'gallery'
}

interface MediaQueueProps {
  className?: string;
  onSelectMedia?: (items: QueueItem[]) => void;
  selectionMode?: boolean;
  maxSelection?: number;
}

export default function MediaQueue({ 
  className = "", 
  onSelectMedia, 
  selectionMode = false,
  maxSelection 
}: MediaQueueProps) {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'removed' | 'orphaned'>('all');
  const [error, setError] = useState<string | null>(null);

  // Fetch queue items
  const fetchQueueItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/queue');
      if (!response.ok) throw new Error('Failed to fetch queue items');
      
      const data = await response.json();
      console.log('Queue API response:', data); // Debug logging
      
      // Map API response to component format
      const mappedItems = (data.queue || []).map((item: any) => ({
        id: item.id.toString(),
        cloudinaryUrl: item.cloudinaryUrl,
        originalFilename: item.filename,
        fileType: item.type,
        fileSize: 0, // Not provided by API, using default
        uploadedBy: 'user',
        uploadedAt: new Date(item.addedToQueueAt),
        status: item.queueCategory === 'upload' ? 'new' : 
                item.queueCategory === 'removed' ? 'removed' : 'orphaned',
        removedFrom: item.sourceContext
      }));
      
      setQueueItems(mappedItems);
    } catch (err) {
      console.error('Queue fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueItems();
  }, []);

  // Handle item selection
  const toggleSelection = (itemId: string) => {
    if (!selectionMode) return;
    
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      if (maxSelection && newSelection.size >= maxSelection) {
        // Remove first selected item to make room
        const firstItem = Array.from(newSelection)[0];
        newSelection.delete(firstItem);
      }
      newSelection.add(itemId);
    }
    
    setSelectedItems(newSelection);
    
    // Notify parent component
    if (onSelectMedia) {
      const selectedQueueItems = queueItems.filter(item => newSelection.has(item.id));
      onSelectMedia(selectedQueueItems);
    }
  };

  // Restore item from queue
  const restoreItem = async (itemId: string) => {
    try {
      const response = await fetch('/api/queue', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, action: 'restore' })
      });

      if (!response.ok) throw new Error('Failed to restore item');
      
      // Refresh queue
      await fetchQueueItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore item');
    }
  };

  // Permanently delete item
  const permanentlyDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to permanently delete this item? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/queue', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });

      if (!response.ok) throw new Error('Failed to delete item');
      
      // Refresh queue
      await fetchQueueItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  // Filter items
  const filteredItems = queueItems.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  // Get status info
  const getStatusInfo = (item: QueueItem) => {
    switch (item.status) {
      case 'new':
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'New Upload',
          color: 'text-blue-600 bg-blue-50 border-blue-200'
        };
      case 'removed':
        return {
          icon: <Trash2 className="w-4 h-4" />,
          text: `Removed from ${item.removedFrom}`,
          color: 'text-orange-600 bg-orange-50 border-orange-200'
        };
      case 'orphaned':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Orphaned (trip deleted)',
          color: 'text-red-600 bg-red-50 border-red-200'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'Unknown',
          color: 'text-gray-600 bg-gray-50 border-gray-200'
        };
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-neutral-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-red-200 p-6 ${className}`}>
        <div className="text-center text-red-600">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">Error loading queue</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={fetchQueueItems}
            className="mt-3 text-sm text-red-700 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-neutral-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-playfair text-xl text-neutral-900">Media Queue</h3>
          {selectionMode && (
            <div className="text-sm text-neutral-600">
              {selectedItems.size} selected
              {maxSelection && ` (max ${maxSelection})`}
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All', count: queueItems.length },
            { key: 'new', label: 'New', count: queueItems.filter(i => i.status === 'new').length },
            { key: 'removed', label: 'Removed', count: queueItems.filter(i => i.status === 'removed').length },
            { key: 'orphaned', label: 'Orphaned', count: queueItems.filter(i => i.status === 'orphaned').length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-fuchsia-200 text-neutral-900 border border-rose-200'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Queue Items */}
      <div className="p-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="font-medium mb-1">No items in queue</p>
            <p className="text-sm">
              {filter === 'all' 
                ? 'Upload some photos to get started!'
                : `No ${filter} items found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredItems.map((item) => {
              const statusInfo = getStatusInfo(item);
              const isSelected = selectedItems.has(item.id);

              return (
                <div
                  key={item.id}
                  className={`group flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    selectionMode
                      ? isSelected
                        ? 'border-fuchsia-300 bg-fuchsia-50'
                        : 'border-neutral-200 hover:border-neutral-300 cursor-pointer'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => selectionMode && toggleSelection(item.id)}
                >
                  {/* Selection indicator */}
                  {selectionMode && (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-fuchsia-500 bg-fuchsia-500'
                        : 'border-neutral-300 group-hover:border-neutral-400'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  )}

                  {/* Media preview */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
                    <img 
                      src={item.cloudinaryUrl} 
                      alt={item.originalFilename}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.fileType === 'video' ? (
                        <Video className="w-4 h-4 text-neutral-500" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-neutral-500" />
                      )}
                      <p className="font-medium text-neutral-900 truncate">
                        {item.originalFilename}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span>{formatFileSize(item.fileSize)}</span>
                      <span>by {item.uploadedBy}</span>
                      <span>{formatDate(item.uploadedAt)}</span>
                    </div>

                    {/* Status badge */}
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border mt-2 ${statusInfo.color}`}>
                      {statusInfo.icon}
                      {statusInfo.text}
                    </div>
                  </div>

                  {/* Actions */}
                  {!selectionMode && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.status !== 'new' && (
                        <button
                          onClick={() => restoreItem(item.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Restore to gallery"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => permanentlyDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete permanently"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selection Actions */}
      {selectionMode && selectedItems.size > 0 && (
        <div className="p-4 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItems(new Set())}
                className="px-3 py-1 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  const selectedQueueItems = queueItems.filter(item => selectedItems.has(item.id));
                  onSelectMedia?.(selectedQueueItems);
                }}
                className="px-4 py-1 bg-fuchsia-200 text-neutral-900 text-sm font-medium rounded-lg border border-rose-200 hover:border-rose-300 transition-colors"
              >
                Add Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}