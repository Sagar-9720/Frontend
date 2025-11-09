// Upload service for handling file uploads to various storage providers
import { logger } from '../utils/logger';

const log = logger.forSource('UploadService');

export interface UploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  folder?: string;
}

export interface UploadResult {
  url: string;
  publicId?: string;
  size: number;
  type: string;
}

class UploadService {
  private readonly defaultOptions: UploadOptions = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    folder: 'uploads'
  };

  // Validate file before upload
  validateFile(file: File, options: UploadOptions = {}): string | null {
    const opts = { ...this.defaultOptions, ...options };

    if (opts.maxSize && file.size > opts.maxSize) {
      return `File size must be less than ${this.formatFileSize(opts.maxSize)}`;
    }

    if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
      return `File type not allowed. Supported types: ${opts.allowedTypes.join(', ')}`;
    }

    return null;
  }

  // Upload to AWS S3 (mock implementation)
  async uploadToS3(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    const validation = this.validateFile(file, options);
    if (validation) {
      throw new Error(validation);
    }

    // Mock S3 upload
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve({
            url: `https://your-bucket.s3.amazonaws.com/${options.folder || 'uploads'}/${Date.now()}-${file.name}`,
            publicId: `${Date.now()}-${file.name}`,
            size: file.size,
            type: file.type
          });
        } else {
          reject(new Error('Upload failed'));
        }
      }, 1000 + Math.random() * 2000); // 1-3 second delay
    });
  }

  // Upload to Cloudinary (mock implementation)
  async uploadToCloudinary(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    const validation = this.validateFile(file, options);
    if (validation) {
      throw new Error(validation);
    }

    // Mock Cloudinary upload
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          const publicId = `${options.folder || 'uploads'}/${Date.now()}-${file.name.split('.')[0]}`;
          resolve({
            url: `https://res.cloudinary.com/your-cloud/image/upload/v1/${publicId}.${file.name.split('.').pop()}`,
            publicId,
            size: file.size,
            type: file.type
          });
        } else {
          reject(new Error('Upload failed'));
        }
      }, 1500 + Math.random() * 2000); // 1.5-3.5 second delay
    });
  }

  // Upload to local server (mock implementation)
  async uploadToServer(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    const validation = this.validateFile(file, options);
    if (validation) {
      throw new Error(validation);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', options.folder || 'uploads');

    // Mock server upload
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.05) { // 95% success rate
          resolve({
            url: `${window.location.origin}/uploads/${options.folder || 'uploads'}/${Date.now()}-${file.name}`,
            size: file.size,
            type: file.type
          });
        } else {
          reject(new Error('Server upload failed'));
        }
      }, 800 + Math.random() * 1200); // 0.8-2 second delay
    });
  }

  // Generic upload method that tries different providers
  async upload(file: File, provider: 'aws' | 'cloudinary' | 'server' = 'server', options: UploadOptions = {}): Promise<UploadResult> {
    log.info('Uploading file', { provider, size: file.size, type: file.type });
    switch (provider) {
      case 'aws':
        return this.uploadToS3(file, options);
      case 'cloudinary':
        return this.uploadToCloudinary(file, options);
      case 'server':
        return this.uploadToServer(file, options);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  // Validate URL
  isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  // Format file size for display
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get image dimensions
  async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }

  // Resize image before upload (client-side)
  async resizeImage(file: File, maxWidth: number, maxHeight: number, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = img;
        
        // Calculate new dimensions
        let newWidth = width;
        let newHeight = height;
        
        if (width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (height * maxWidth) / width;
        }
        
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (newWidth * maxHeight) / newHeight;
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

export const uploadService = new UploadService();
