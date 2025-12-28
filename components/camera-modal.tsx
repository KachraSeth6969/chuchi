"use client";

import { useState, useEffect, useRef } from "react";
import { X, Camera, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import { MobileCameraCapture, type CameraCapture, type CameraError } from "../lib/mobile-camera";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (capture: CameraCapture) => void;
  onError?: (error: string) => void;
}

export default function CameraModal({ isOpen, onClose, onCapture, onError }: CameraModalProps) {
  const [cameraCapture, setCameraCapture] = useState<MobileCameraCapture | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewCapture, setPreviewCapture] = useState<CameraCapture | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen) {
      initializeCamera();
    } else {
      cleanup();
    }

    return () => cleanup();
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const initializeCamera = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Check if camera is available
      const isAvailable = await MobileCameraCapture.isCameraAvailable();
      if (!isAvailable) {
        throw new Error("Camera not available on this device");
      }

      const capture = new MobileCameraCapture();
      await capture.startCamera('environment'); // Start with back camera
      
      setCameraCapture(capture);
      
      // Set video element
      if (videoRef.current) {
        const videoElement = capture.getVideoElement();
        if (videoElement) {
          videoRef.current.srcObject = videoElement.srcObject;
          videoRef.current.play();
        }
      }
    } catch (err: any) {
      const errorMessage = err.type === 'permission-denied' 
        ? "Camera permission denied. Please allow camera access and try again."
        : err.type === 'not-supported'
        ? "Camera not supported on this device."
        : err.message || "Failed to access camera";
      
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapturePhoto = async () => {
    if (!cameraCapture) return;

    setIsCapturing(true);
    try {
      const optimalSettings = MobileCameraCapture.getOptimalSettings();
      const capture = await cameraCapture.capturePhoto(optimalSettings.quality);
      setPreviewCapture(capture);
    } catch (err: any) {
      setError(err.message || "Failed to capture photo");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSwitchCamera = async () => {
    if (!cameraCapture) return;

    setIsLoading(true);
    try {
      await cameraCapture.switchCamera();
      
      // Update video element
      if (videoRef.current) {
        const videoElement = cameraCapture.getVideoElement();
        if (videoElement) {
          videoRef.current.srcObject = videoElement.srcObject;
          videoRef.current.play();
        }
      }
    } catch (err: any) {
      setError("Failed to switch camera");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCapture = () => {
    if (previewCapture) {
      onCapture(previewCapture);
      handleClose();
    }
  };

  const handleRetake = () => {
    if (previewCapture) {
      URL.revokeObjectURL(previewCapture.preview);
      setPreviewCapture(null);
    }
  };

  const handleClose = () => {
    cleanup();
    onClose();
  };

  const cleanup = () => {
    if (cameraCapture) {
      cameraCapture.stopCamera();
      setCameraCapture(null);
    }
    if (previewCapture) {
      URL.revokeObjectURL(previewCapture.preview);
      setPreviewCapture(null);
    }
    setError("");
    setIsLoading(false);
    setIsCapturing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-md mx-auto overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3 className="font-medium text-neutral-900">Take Photo</h3>
          <button
            onClick={handleClose}
            className="text-neutral-500 hover:text-neutral-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {error ? (
            // Error State
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h4 className="font-medium text-neutral-900 mb-2">Camera Error</h4>
              <p className="text-sm text-neutral-600 mb-4">{error}</p>
              <div className="space-y-2">
                <button
                  onClick={initializeCamera}
                  className="w-full bg-fuchsia-200 text-neutral-900 font-medium py-2 px-4 rounded-lg text-sm border border-rose-200 hover:border-rose-300 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="w-full text-neutral-600 font-medium py-2 px-4 rounded-lg text-sm border border-neutral-300 hover:border-neutral-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : isLoading ? (
            // Loading State
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-fuchsia-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-neutral-600">Initializing camera...</p>
            </div>
          ) : previewCapture ? (
            // Preview State
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={previewCapture.preview}
                  alt="Captured photo"
                  className="w-full rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {previewCapture.metadata.resolution.width} × {previewCapture.metadata.resolution.height}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleRetake}
                  className="flex-1 text-neutral-600 font-medium py-2 px-4 rounded-lg text-sm border border-neutral-300 hover:border-neutral-400 transition-colors"
                >
                  Retake
                </button>
                <button
                  onClick={handleConfirmCapture}
                  className="flex-1 bg-fuchsia-200 text-neutral-900 font-medium py-2 px-4 rounded-lg text-sm border border-rose-200 hover:border-rose-300 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Use Photo
                </button>
              </div>
            </div>
          ) : (
            // Camera State
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3]">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                
                {/* Camera Controls Overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                  <button
                    onClick={handleSwitchCamera}
                    disabled={isCapturing}
                    className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleCapturePhoto}
                    disabled={isCapturing}
                    className="bg-white text-neutral-900 p-4 rounded-full shadow-lg hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-neutral-600">
                  Position your subject and tap the camera button to take a photo
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}