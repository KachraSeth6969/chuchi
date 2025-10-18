"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Camera, Image, X, CheckCircle, AlertCircle } from "lucide-react";

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      status: 'pending' as const,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
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
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Upload files
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    selectedFiles.forEach(fileItem => {
      formData.append('files', fileItem.file);
    });
    formData.append('uploadedBy', 'user'); // You can make this dynamic

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

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
              error: uploadResult.error
            };
          }
          return fileItem;
        }));
      }

      setUploadProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      // Mark all as error
      setSelectedFiles(prev => prev.map(fileItem => ({
        ...fileItem,
        status: 'error' as const,
        error: 'Upload failed'
      })));
    } finally {
      setIsUploading(false);
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
          <h1 className="font-playfair text-xl text-neutral-900">Upload Photos</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          
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
                  className="group text-neutral-800 font-medium py-4 px-8 rounded-lg text-base transition-all duration-200 flex items-center gap-3 border border-neutral-300 hover:border-neutral-400"
                  style={{ backgroundColor: '#D8BFF8' }}
                >
                  <Image className="w-5 h-5" />
                  Choose Files
                </button>
                
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.setAttribute('capture', 'environment');
                      fileInputRef.current.click();
                    }
                  }}
                  className="group bg-fuchsia-200 hover:bg-fuchsia-200 text-neutral-900 font-medium py-4 px-8 rounded-lg text-base transition-all duration-200 flex items-center gap-3 border border-rose-200 hover:border-rose-300"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
              />

              <p className="text-xs text-neutral-500">
                Supports: JPEG, PNG, HEIC, MP4, MOV • Max 100MB per file
              </p>
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
                  <div key={fileItem.id} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg">
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
                      <p className="text-xs text-neutral-500">
                        {formatFileSize(fileItem.file.size)}
                      </p>
                      {fileItem.error && (
                        <p className="text-xs text-red-600 mt-1">{fileItem.error}</p>
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
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          <X className="w-5 h-5" />
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
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-fuchsia-300 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-neutral-600">{uploadProgress}% complete</p>
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
            <div className="text-center">
              <button
                onClick={uploadFiles}
                className="group bg-fuchsia-200 hover:bg-fuchsia-200 text-neutral-900 font-medium py-4 px-8 rounded-lg text-base transition-all duration-200 flex items-center gap-3 border border-rose-200 hover:border-rose-300 mx-auto"
              >
                <Upload className="w-5 h-5" />
                Upload {selectedFiles.filter(f => f.status === 'pending').length} Files
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pb-8 px-6">
        <p className="text-neutral-600 text-sm">Upload memories ✨</p>
        <p className="text-neutral-500 text-xs mt-2">Your photos will be added to the queue for organization</p>
      </footer>
    </div>
  );
}