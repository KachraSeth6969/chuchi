// Enhanced mobile camera utility for better photo capture experience
// Provides camera access, photo capture, and mobile-specific optimizations

export interface CameraCapture {
  file: File;
  preview: string;
  metadata: {
    timestamp: number;
    deviceType: string;
    cameraFacing: 'user' | 'environment' | 'unknown';
    resolution: { width: number; height: number };
  };
}

export interface CameraError {
  type: 'permission-denied' | 'not-supported' | 'unknown';
  message: string;
  suggestions: string[];
}

export class MobileCameraCapture {
  private stream: MediaStream | null = null;
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private facing: 'user' | 'environment' = 'environment';

  constructor() {
    this.canvas = document.createElement('canvas');
    this.video = document.createElement('video');
    this.video.playsInline = true;
    this.video.muted = true;
  }

  // Check if camera is available
  static async isCameraAvailable(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
      }
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch {
      return false;
    }
  }

  // Get available cameras
  static async getAvailableCameras(): Promise<{ deviceId: string; label: string; facing?: string }[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || 'Unknown Camera',
          facing: device.label.toLowerCase().includes('front') ? 'user' : 
                  device.label.toLowerCase().includes('back') ? 'environment' : undefined
        }));
    } catch {
      return [];
    }
  }

  // Request camera permission and start stream
  async startCamera(facing: 'user' | 'environment' = 'environment'): Promise<void> {
    this.facing = facing;
    
    try {
      // First try with facing mode
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
        },
        audio: false,
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (this.video) {
        this.video.srcObject = this.stream;
        await this.video.play();
      }
    } catch (error) {
      // Fallback to any camera
      try {
        const fallbackConstraints: MediaStreamConstraints = {
          video: true,
          audio: false,
        };
        
        this.stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        
        if (this.video) {
          this.video.srcObject = this.stream;
          await this.video.play();
        }
      } catch (fallbackError) {
        this.handleCameraError(fallbackError);
      }
    }
  }

  // Switch between front and back camera
  async switchCamera(): Promise<void> {
    const newFacing = this.facing === 'user' ? 'environment' : 'user';
    await this.stopCamera();
    await this.startCamera(newFacing);
  }

  // Capture photo from current stream
  async capturePhoto(quality: number = 0.85): Promise<CameraCapture> {
    if (!this.video || !this.canvas || !this.stream) {
      throw new Error('Camera not initialized');
    }

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context not available');
    }

    // Set canvas size to video dimensions
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    // Draw current video frame
    context.drawImage(this.video, 0, 0);

    // Convert to blob and file
    return new Promise((resolve, reject) => {
      this.canvas!.toBlob((blob) => {
        if (blob) {
          const timestamp = Date.now();
          const file = new File([blob], `camera_photo_${timestamp}.jpg`, { 
            type: 'image/jpeg',
            lastModified: timestamp 
          });
          
          const preview = URL.createObjectURL(blob);
          
          const metadata = {
            timestamp,
            deviceType: this.getDeviceType(),
            cameraFacing: this.facing,
            resolution: {
              width: this.video!.videoWidth,
              height: this.video!.videoHeight,
            },
          };

          resolve({ file, preview, metadata });
        } else {
          reject(new Error('Failed to capture photo'));
        }
      }, 'image/jpeg', quality);
    });
  }

  // Stop camera and clean up
  async stopCamera(): Promise<void> {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.video) {
      this.video.srcObject = null;
    }
  }

  // Get video element for preview
  getVideoElement(): HTMLVideoElement | null {
    return this.video;
  }

  // Get current camera capabilities
  getCameraCapabilities(): MediaTrackCapabilities | null {
    if (!this.stream) return null;
    
    const videoTrack = this.stream.getVideoTracks()[0];
    return videoTrack ? videoTrack.getCapabilities() : null;
  }

  // Handle camera errors with helpful messages
  private handleCameraError(error: any): never {
    let cameraError: CameraError;

    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      cameraError = {
        type: 'permission-denied',
        message: 'Camera permission was denied',
        suggestions: [
          'Click the camera icon in your browser address bar',
          'Go to browser settings and allow camera access',
          'Refresh the page and try again'
        ]
      };
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      cameraError = {
        type: 'not-supported',
        message: 'No camera found on this device',
        suggestions: [
          'Check if your device has a camera',
          'Try connecting an external camera',
          'Use the file picker to select photos instead'
        ]
      };
    } else {
      cameraError = {
        type: 'unknown',
        message: error.message || 'Failed to access camera',
        suggestions: [
          'Check your internet connection',
          'Try refreshing the page',
          'Use a different browser',
          'Try the file picker instead'
        ]
      };
    }

    throw cameraError;
  }

  // Detect device type
  private getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipod/.test(userAgent)) return 'iPhone';
    if (/ipad/.test(userAgent)) return 'iPad';
    if (/android/.test(userAgent)) return 'Android';
    if (/mobile/.test(userAgent)) return 'Mobile';
    
    return 'Desktop';
  }

  // Get optimal photo settings for current device
  static getOptimalSettings(): { quality: number; maxWidth: number; maxHeight: number } {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSlowDevice = 'connection' in navigator && (navigator as any).connection?.effectiveType?.includes('2g');
    
    if (isSlowDevice) {
      return { quality: 0.7, maxWidth: 1280, maxHeight: 960 };
    } else if (isMobile) {
      return { quality: 0.8, maxWidth: 1920, maxHeight: 1080 };
    } else {
      return { quality: 0.85, maxWidth: 1920, maxHeight: 1080 };
    }
  }
}

// Utility functions for mobile photo enhancement

// Compress image for faster upload on mobile
export async function compressImageForMobile(file: File, maxSizeMB: number = 2): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate compression ratio
      const maxDimension = 1920;
      const ratio = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
      
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Try different quality levels to meet size requirement
        let quality = 0.8;
        const targetSizeBytes = maxSizeMB * 1024 * 1024;
        
        const tryCompress = (q: number) => {
          canvas.toBlob((blob) => {
            if (blob) {
              if (blob.size <= targetSizeBytes || q <= 0.3) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                tryCompress(q - 0.1);
              }
            } else {
              reject(new Error('Compression failed'));
            }
          }, 'image/jpeg', q);
        };
        
        tryCompress(quality);
      } else {
        reject(new Error('Canvas context not available'));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Get mobile-friendly file size limit based on connection
export function getMobileFileSizeLimit(): number {
  const connection = (navigator as any).connection;
  
  if (!connection) return 10; // Default 10MB
  
  switch (connection.effectiveType) {
    case 'slow-2g':
    case '2g':
      return 2; // 2MB for very slow connections
    case '3g':
      return 5; // 5MB for moderate connections
    case '4g':
    default:
      return 10; // 10MB for fast connections
  }
}

// Show mobile-specific upload guidance
export function getMobileUploadGuidance(): string[] {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  const baseGuidance = [
    'Connect to Wi-Fi for faster uploads',
    'Keep your device plugged in for large uploads',
    'Close other apps to free up memory'
  ];
  
  if (isIOS) {
    return [
      ...baseGuidance,
      'HEIC photos will be automatically converted to JPEG',
      'Use "Take Photo" button for best quality'
    ];
  } else if (isAndroid) {
    return [
      ...baseGuidance,
      'Grant camera permission for "Take Photo" feature',
      'Some older videos may need conversion'
    ];
  }
  
  return baseGuidance;
}