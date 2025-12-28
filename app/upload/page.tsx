"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Camera, Image, X, CheckCircle, AlertCircle, Smartphone, Wifi, WifiOff } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { 
  validateUploadFile, 
  getFileFormatInfo, 
  getDeviceCapabilities,
  formatFileSize,
  getUploadTimeEstimate,
  getMobileErrorMessage,
  optimizeImagePreview
} from "../../lib/mobile-upload";
import { MobileCameraCapture, type CameraCapture } from "../../lib/mobile-camera";
import CameraModal from "../../components/camera-modal";

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  warning?: string;
  suggestion?: string;
  estimatedTime?: string;
  formatInfo?: {
    originalFormat: string;
    targetFormat: string;
    needsConversion: boolean;
  };
}

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'slow'>('online');
  const [deviceCapabilities, setDeviceCapabilities] = useState<any>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Initialize device capabilities and connection monitoring
  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);

    // Check camera availability
    const checkCamera = async () => {
      const available = await MobileCameraCapture.isCameraAvailable();
      setCameraAvailable(available);
    };
    checkCamera();

    // Monitor connection status
    const updateConnectionStatus = () => {
      if (!navigator.onLine) {
        setConnectionStatus('offline');
      } else {
        const connection = (navigator as any).connection;
        if (connection && connection.effectiveType === 'slow-2g') {
          setConnectionStatus('slow');
        } else {
          setConnectionStatus('online');
        }
      }
    };

    updateConnectionStatus();
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, []);

  // Handle file selection with enhanced validation
  const handleFileSelect = async (files: FileList) => {
    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(files)) {
      const validation = validateUploadFile(file);
      const formatInfo = getFileFormatInfo(file);
      
      let preview: string | undefined;
      try {
        if (file.type.startsWith('image/')) {
          preview = await optimizeImagePreview(file);
        }
      } catch (error) {
        console.warn('Failed to generate preview:', error);
        preview = URL.createObjectURL(file);
      }

      const uploadedFile: UploadedFile = {
        file,
        id: `${Date.now()}-${Math.random()}`,
        status: validation.isValid ? 'pending' : 'error',
        preview,
        error: validation.error,
        warning: validation.warnings?.[0],
        suggestion: validation.suggestions?.[0],
        estimatedTime: validation.isValid ? getUploadTimeEstimate(file.size) : undefined,
        formatInfo: {
          originalFormat: formatInfo.originalFormat,
          targetFormat: formatInfo.targetFormat,
          needsConversion: formatInfo.needsConversion,
        },
      };

      newFiles.push(uploadedFile);
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  // Handle camera capture
  const handleCameraCapture = async (capture: CameraCapture) => {
    const uploadedFile: UploadedFile = {
      file: capture.file,
      id: `camera-${Date.now()}-${Math.random()}`,
      status: 'pending',
      preview: capture.preview,
      estimatedTime: getUploadTimeEstimate(capture.file.size),
      formatInfo: {
        originalFormat: 'image/jpeg',
        targetFormat: 'image/jpeg',
        needsConversion: false,
      },
    };

    setSelectedFiles(prev => [...prev, uploadedFile]);
    setIsCameraModalOpen(false);
  };

  // Remove file from selection
  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  // Clear all files
  const clearAllFiles = () => {
    selectedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setSelectedFiles([]);
  };

  // Format file size
  const formatFileSizeDisplay = (bytes: number) => {
    return formatFileSize(bytes);
  };

  // Enhanced upload with better progress tracking
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    // Check connection before upload
    if (connectionStatus === 'offline') {
      alert('No internet connection. Please check your connection and try again.');
      return;
    }

    if (connectionStatus === 'slow') {
      const confirmSlow = confirm('Slow connection detected. Upload may take longer. Continue?');
      if (!confirmSlow) return;
    }

    // Prevent auth reset during upload
    sessionStorage.setItem('preventAuthReset', 'true');
    
    setIsUploading(true);
    setUploadProgress(0);

    const pendingFiles = selectedFiles.filter(f => f.status === 'pending');
    const formData = new FormData();
    
    pendingFiles.forEach(fileItem => {
      formData.append('files', fileItem.file);
    });
    formData.append('uploadedBy', 'user');

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 90) return prev + Math.random() * 10;
          return prev;
        });
      }, 500);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      const result = await response.json();

      if (result.results) {
        // Update file statuses based on results
        setSelectedFiles(prev => prev.map(fileItem => {
          const uploadResult = result.results.find((r: any) => 
            r.originalFilename === fileItem.file.name
          );
          
          if (uploadResult) {
            return {
              ...fileItem,
              status: uploadResult.success ? 'success' : 'error',
              error: uploadResult.error ? getMobileErrorMessage(uploadResult.error) : undefined
            };
          }
          return fileItem;
        }));
      }

      setUploadProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      const mobileError = getMobileErrorMessage('Network error');
      
      // Mark pending files as error
      setSelectedFiles(prev => prev.map(fileItem => 
        fileItem.status === 'pending' ? {
          ...fileItem,
          status: 'error' as const,
          error: mobileError
        } : fileItem
      ));
    } finally {
      setIsUploading(false);
      // Clear auth reset prevention
      sessionStorage.removeItem('preventAuthReset');
    }
  };

  const successCount = selectedFiles.filter(f => f.status === 'success').length;
  const errorCount = selectedFiles.filter(f => f.status === 'error').length;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-playfair text-xl text-neutral-900">Upload Photos</h1>
            {/* Connection Status Indicator */}
            <div className="flex items-center gap-1">
              {connectionStatus === 'offline' && (
                <span title="Offline">
                  <WifiOff className="w-4 h-4 text-red-500" />
                </span>
              )}
              {connectionStatus === 'slow' && (
                <span title="Slow connection">
                  <Wifi className="w-4 h-4 text-yellow-500" />
                </span>
              )}
              {connectionStatus === 'online' && (
                <span title="Online">
                  <Wifi className="w-4 h-4 text-green-500" />
                </span>
              )}
              {isMobile && (
                <span title="Mobile device">
                  <Smartphone className="w-4 h-4 text-neutral-500" />
                </span>
              )}
            </div>
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Mobile Upload Tips */}
          {isMobile && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Mobile Upload Tips
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <span className="font-medium">📸</span>
                  <span>Use "Take Photo" for best camera quality</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium">📱</span>
                  <span>HEIC photos will be automatically converted to JPEG</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium">🎥</span>
                  <span>MOV videos will be converted to MP4</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium">💡</span>
                  <span>Keep your device connected to power for large uploads</span>
                </div>
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div className="bg-white rounded-lg border border-neutral-200 p-8 mb-6">
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-full mb-4">
                  <Upload className="w-8 h-8 text-neutral-600" />
                </div>
                <h2 className="font-playfair text-2xl text-neutral-900 mb-2">Select Photos & Videos</h2>
                <p className="text-neutral-600 text-sm">Choose multiple files to upload to your collection</p>
              </div>

              {/* Upload Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={connectionStatus === 'offline'}
                  className="group text-neutral-800 font-medium py-4 px-8 rounded-lg text-base transition-all duration-200 flex items-center gap-3 border border-neutral-300 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  style={{ backgroundColor: connectionStatus === 'offline' ? '#f3f4f6' : '#D8BFF8' }}
                >
                  <Image className="w-5 h-5" />
                  Choose Files
                </button>
                
                {cameraAvailable && (
                  <button
                    onClick={() => setIsCameraModalOpen(true)}
                    disabled={connectionStatus === 'offline'}
                    className="group bg-fuchsia-200 hover:bg-fuchsia-200 text-neutral-900 font-medium py-4 px-8 rounded-lg text-base transition-all duration-200 flex items-center gap-3 border border-rose-200 hover:border-rose-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    <Camera className="w-5 h-5" />
                    {isMobile ? 'Open Camera' : 'Camera'}
                  </button>
                )}

                {/* Fallback camera button for devices without advanced camera API */}
                {!cameraAvailable && deviceCapabilities?.camera && (
                  <button
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.setAttribute('capture', 'environment');
                        fileInputRef.current.click();
                      }
                    }}
                    disabled={connectionStatus === 'offline'}
                    className="group bg-fuchsia-200 hover:bg-fuchsia-200 text-neutral-900 font-medium py-4 px-8 rounded-lg text-base transition-all duration-200 flex items-center gap-3 border border-rose-200 hover:border-rose-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    <Camera className="w-5 h-5" />
                    {isMobile ? 'Take Photo' : 'Camera'}
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
              />

              <div className="text-center space-y-2">
                <p className="text-xs text-neutral-500">
                  Supports: JPEG, PNG, HEIC, MP4, MOV • Max 100MB per file
                </p>
                {connectionStatus === 'slow' && (
                  <p className="text-xs text-yellow-600">
                    ⚠️ Slow connection detected - uploads may take longer
                  </p>
                )}
                {connectionStatus === 'offline' && (
                  <p className="text-xs text-red-600">
                    ❌ No internet connection - please check your network
                  </p>
                )}
                {isMobile && (
                  <p className="text-xs text-blue-600">
                    📱 Mobile upload optimized for your device
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-neutral-900">
                  Selected Files ({selectedFiles.length})
                </h3>
                <button
                  onClick={clearAllFiles}
                  className="text-neutral-500 hover:text-neutral-700 text-sm"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedFiles.map((fileItem) => (
                  <div key={fileItem.id} className="flex items-start gap-4 p-3 bg-neutral-50 rounded-lg">
                    {/* Preview */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
                      {fileItem.preview ? (
                        <img src={fileItem.preview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-6 h-6 text-neutral-400" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {fileItem.file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                        <span>{formatFileSizeDisplay(fileItem.file.size)}</span>
                        {fileItem.estimatedTime && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">{fileItem.estimatedTime}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Format conversion info */}
                      {fileItem.formatInfo?.needsConversion && (
                        <p className="text-xs text-purple-600 mt-1">
                          Will convert {fileItem.formatInfo.originalFormat.split('/')[1].toUpperCase()} → {fileItem.formatInfo.targetFormat.split('/')[1].toUpperCase()}
                        </p>
                      )}
                      
                      {/* Warnings and suggestions */}
                      {fileItem.warning && (
                        <p className="text-xs text-yellow-600 mt-1">⚠️ {fileItem.warning}</p>
                      )}
                      {fileItem.suggestion && (
                        <p className="text-xs text-blue-600 mt-1">💡 {fileItem.suggestion}</p>
                      )}
                      {fileItem.error && (
                        <p className="text-xs text-red-600 mt-1">❌ {fileItem.error}</p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {fileItem.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {fileItem.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      {fileItem.status === 'pending' && (
                        <button
                          onClick={() => removeFile(fileItem.id)}
                          className="text-neutral-400 hover:text-neutral-600 p-1 hover:bg-white rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
              <div className="text-center">
                <h3 className="font-medium text-neutral-900 mb-4">Uploading Files...</h3>
                <div className="w-full bg-neutral-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-fuchsia-300 to-purple-300 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-neutral-600">{uploadProgress}% complete</p>
                  {connectionStatus === 'slow' && (
                    <p className="text-xs text-yellow-600">Slow connection - please be patient</p>
                  )}
                  {isMobile && (
                    <p className="text-xs text-blue-600">Keep this tab open while uploading</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload Results */}
          {(successCount > 0 || errorCount > 0) && !isUploading && (
            <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
              <h3 className="font-medium text-neutral-900 mb-4">Upload Complete</h3>
              <div className="space-y-2">
                {successCount > 0 && (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span>{successCount} files uploaded successfully</span>
                  </div>
                )}
                {errorCount > 0 && (
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span>{errorCount} files failed to upload</span>
                  </div>
                )}
              </div>
              
              {successCount > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-3">
                    Your photos are now in the queue. You can organize them in the gallery or trips pages.
                  </p>
                  <div className="flex gap-3">
                    <Link href="/gallery">
                      <button className="text-neutral-800 font-medium py-2 px-4 rounded-lg text-sm border border-neutral-300 hover:border-neutral-400 transition-colors">
                        Organize in Gallery
                      </button>
                    </Link>
                    <Link href="/trips">
                      <button className="bg-fuchsia-200 hover:bg-fuchsia-200 text-neutral-900 font-medium py-2 px-4 rounded-lg text-sm border border-rose-200 hover:border-rose-300 transition-colors">
                        Add to Trip
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Button */}
          {selectedFiles.length > 0 && !isUploading && selectedFiles.some(f => f.status === 'pending') && (
            <div className="text-center space-y-3">
              <button
                onClick={uploadFiles}
                disabled={connectionStatus === 'offline'}
                className="group bg-fuchsia-200 hover:bg-fuchsia-200 text-neutral-900 font-medium py-4 px-8 rounded-lg text-base transition-all duration-200 flex items-center gap-3 border border-rose-200 hover:border-rose-300 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                Upload {selectedFiles.filter(f => f.status === 'pending').length} Files
              </button>
              
              {connectionStatus === 'slow' && (
                <p className="text-xs text-yellow-600">
                  ⚠️ Slow connection - upload may take longer than estimated
                </p>
              )}
              
              {isMobile && selectedFiles.some(f => f.file.size > 20 * 1024 * 1024) && (
                <p className="text-xs text-blue-600">
                  💡 Large files detected - consider using Wi-Fi for faster upload
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pb-8 px-6">
        <p className="text-neutral-600 text-sm">Upload memories ✨</p>
        <p className="text-neutral-500 text-xs mt-2">Your photos will be added to the queue for organization</p>
      </footer>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
        onError={(error) => {
          console.error('Camera error:', error);
          // Could show a toast notification here
        }}
      />
    </div>
  );
}