"use client";

import { useState } from "react";
import { X, MapPin, Calendar, FileText } from "lucide-react";

interface TripFormData {
  title: string;
  location: string;
  date: string;
  description: string;
}

interface TripFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TripFormData) => Promise<void>;
  initialData?: TripFormData;
  mode: 'create' | 'edit';
}

export default function TripForm({ isOpen, onClose, onSubmit, initialData, mode }: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>(
    initialData || {
      title: '',
      location: '',
      date: '',
      description: ''
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<TripFormData>>({});

  if (!isOpen) return null;

  // Handle form field changes
  const handleChange = (field: keyof TripFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<TripFormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Trip title is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form for next use
      setFormData({
        title: '',
        location: '',
        date: '',
        description: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to save trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair text-xl text-neutral-900">
              {mode === 'create' ? 'Create New Trip' : 'Edit Trip'}
            </h3>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-neutral-500 hover:text-neutral-700 disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Trip Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <FileText className="w-4 h-4 inline mr-2" />
                Trip Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 transition-colors ${
                  errors.title 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-neutral-300 focus:border-fuchsia-500'
                }`}
                placeholder="Enter trip title..."
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 transition-colors ${
                  errors.location 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-neutral-300 focus:border-fuchsia-500'
                }`}
                placeholder="Where did you go?"
                disabled={isSubmitting}
              />
              {errors.location && (
                <p className="text-red-600 text-sm mt-1">{errors.location}</p>
              )}
            </div>
            
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date *
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 transition-colors ${
                  errors.date 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-neutral-300 focus:border-fuchsia-500'
                }`}
                placeholder="When was this trip? (e.g., March 2024, Last weekend)"
                disabled={isSubmitting}
              />
              {errors.date && (
                <p className="text-red-600 text-sm mt-1">{errors.date}</p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors"
                placeholder="Tell us about this adventure... (optional)"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-fuchsia-200 hover:bg-fuchsia-300 text-neutral-900 rounded-lg border border-rose-200 hover:border-rose-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? (mode === 'create' ? 'Creating...' : 'Saving...') 
                : (mode === 'create' ? 'Create Trip' : 'Save Changes')
              }
            </button>
          </div>
        </form>
        
        {/* Form Info */}
        <div className="px-6 pb-6">
          <p className="text-xs text-neutral-500">
            * Required fields. You can add photos to this trip after creating it.
          </p>
        </div>
      </div>
    </div>
  );
}