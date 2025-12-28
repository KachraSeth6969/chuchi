// Mobile upload utilities for enhanced camera access and file handling
// Provides mobile-specific upload features and validations

export interface CameraOptions {
  preferredCamera?: 'user' | 'environment';
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface UploadValidation {
  isValid: boolean;
  error?: string;
  warnings?: string[];
  suggestions?: string[];
}

export interface FileFormatInfo {
  originalFormat: string;
  targetFormat: string;
  needsConversion: boolean;
  supportedOnDevice: boolean;
}

// Detect if device supports specific file formats
export function getDeviceCapabilities() {
  const canvas = document.createElement('canvas');
  const webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  return {
    webp: webpSupport,
    heic: /iPhone|iPad|iPod/.test(navigator.userAgent),
    camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    fileAccess: 'File' in window && 'FileReader' in window,
    touchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  };
}

// Enhanced file validation for mobile uploads
export function validateUploadFile(file: File): UploadValidation {
  const validation: UploadValidation = { isValid: true, warnings: [], suggestions: [] };
  
  // File size validation (100MB max)
  if (file.size > 100 * 1024 * 1024) {
    validation.isValid = false;
    validation.error = 'File too large (max 100MB)';
    return validation;
  }
  
  // Large file warning (50MB+)
  if (file.size > 50 * 1024 * 1024) {
    validation.warnings?.push('Large file - upload may take longer on mobile');
  }
  
  // File type validation
  const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];
  const supportedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
  const allSupportedTypes = [...supportedImageTypes, ...supportedVideoTypes];
  
  if (!allSupportedTypes.includes(file.type)) {
    validation.isValid = false;
    validation.error = `Unsupported file format: ${file.type}`;
    validation.suggestions?.push('Try JPEG, PNG, HEIC for images or MP4, MOV for videos');
    return validation;
  }
  
  // Format conversion suggestions
  if (file.type === 'image/heic' || file.type === 'image/heif') {
    validation.suggestions?.push('HEIC will be converted to JPEG for better compatibility');
  }
  
  if (file.type === 'video/mov' || file.type === 'video/quicktime') {
    validation.suggestions?.push('MOV will be converted to MP4 for better compatibility');
  }
  
  // Video duration warning (approximate)
  if (file.type.startsWith('video/') && file.size > 20 * 1024 * 1024) {
    validation.warnings?.push('Long videos may take time to process');
  }
  
  return validation;
}

// Get file format conversion info
export function getFileFormatInfo(file: File): FileFormatInfo {
  const originalFormat = file.type;
  let targetFormat = originalFormat;
  let needsConversion = false;
  
  // Image format conversions
  if (originalFormat === 'image/heic' || originalFormat === 'image/heif') {
    targetFormat = 'image/jpeg';
    needsConversion = true;
  }
  
  // Video format conversions  
  if (originalFormat === 'video/mov' || originalFormat === 'video/quicktime') {
    targetFormat = 'video/mp4';
    needsConversion = true;
  }
  
  const capabilities = getDeviceCapabilities();
  const supportedOnDevice = originalFormat.startsWith('image/') || 
                           originalFormat === 'video/mp4' ||
                           capabilities.webp;
  
  return {
    originalFormat,
    targetFormat,
    needsConversion,
    supportedOnDevice,
  };
}

// Enhanced camera access for mobile
export async function requestCameraAccess(options: CameraOptions = {}): Promise<MediaStream | null> {
  const capabilities = getDeviceCapabilities();
  
  if (!capabilities.camera) {
    throw new Error('Camera access not supported on this device');
  }
  
  try {
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: options.preferredCamera || 'environment',
        width: options.maxWidth ? { ideal: options.maxWidth } : { ideal: 1920 },
        height: options.maxHeight ? { ideal: options.maxHeight } : { ideal: 1080 },
      },
      audio: false,
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error('Camera access error:', error);
    
    // Try fallback with basic constraints
    try {
      const basicConstraints: MediaStreamConstraints = {
        video: true,
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(basicConstraints);
      return stream;
    } catch (fallbackError) {
      console.error('Fallback camera access failed:', fallbackError);
      return null;
    }
  }
}

// Capture photo from camera stream
export function capturePhotoFromStream(stream: MediaStream, options: CameraOptions = {}): Promise<File> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    video.srcObject = stream;
    video.play();
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
          resolve(file);
        } else {
          reject(new Error('Failed to capture photo'));
        }
      }, 'image/jpeg', options.quality || 0.8);
    };
    
    video.onerror = () => {
      reject(new Error('Video stream error'));
    };
  });
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get upload time estimate based on file size and connection
export function getUploadTimeEstimate(fileSize: number): string {
  // Rough estimates based on typical mobile connection speeds
  const connection = (navigator as any).connection;
  let speedMbps = 10; // Default 10 Mbps
  
  if (connection) {
    // Use effective connection type if available
    switch (connection.effectiveType) {
      case 'slow-2g':
        speedMbps = 0.25;
        break;
      case '2g':
        speedMbps = 0.5;
        break;
      case '3g':
        speedMbps = 1.5;
        break;
      case '4g':
        speedMbps = 10;
        break;
      default:
        speedMbps = 10;
    }
  }
  
  const fileSizeMb = fileSize / (1024 * 1024);
  const estimatedSeconds = (fileSizeMb * 8) / speedMbps;
  
  if (estimatedSeconds < 60) {
    return `~${Math.ceil(estimatedSeconds)}s`;
  } else {
    const minutes = Math.ceil(estimatedSeconds / 60);
    return `~${minutes}m`;
  }
}

// Mobile-specific error messages
export function getMobileErrorMessage(error: string): string {
  const errorMap: { [key: string]: string } = {
    'File too large (max 100MB)': 'File is too large for mobile upload. Try compressing or use a smaller file.',
    'Unsupported file type': 'This file type isn\'t supported. Try JPEG, PNG, HEIC for photos or MP4, MOV for videos.',
    'Camera access not supported': 'Camera access isn\'t available on this device.',
    'Permission denied': 'Camera permission was denied. Please enable camera access in your browser settings.',
    'Network error': 'Upload failed due to poor connection. Check your internet and try again.',
    'Upload timeout': 'Upload took too long. Try a smaller file or check your connection.',
  };
  
  return errorMap[error] || error;
}

// Check if device is in portrait mode (common for mobile uploads)
export function isPortraitMode(): boolean {
  return window.innerHeight > window.innerWidth;
}

// Optimize image for mobile display
export function optimizeImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        // Calculate optimal preview size for mobile
        const maxSize = isPortraitMode() ? 300 : 200;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}