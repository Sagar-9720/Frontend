import React, { useState, useRef } from 'react';
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { uploadService } from '../../services/uploadService';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
  uploadProvider?: 'aws' | 'cloudinary' | 'server';
  maxSize?: number;
  allowResize?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Image',
  required = false,
  className = '',
  uploadProvider = 'server',
  maxSize = 5 * 1024 * 1024, // 5MB
  allowResize = true
}) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState(value);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = uploadService.validateFile(file, { maxSize });
    if (validation) {
      alert(validation);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      let fileToUpload = file;
      
      // Resize image if needed and allowed
      if (allowResize && file.size > 1024 * 1024) { // Resize if > 1MB
        try {
          fileToUpload = await uploadService.resizeImage(file, 1920, 1080, 0.8);
          setUploadProgress(30);
        } catch (error) {
          console.warn('Failed to resize image, uploading original:', error);
        }
      }
      
      setUploadProgress(50);
      
      // Upload file
      const result = await uploadService.upload(fileToUpload, uploadProvider, {
        folder: 'destinations',
        maxSize
      });
      
      setUploadProgress(100);
      onChange(result.url);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim() && uploadService.isValidImageUrl(urlInput.trim())) {
      onChange(urlInput.trim());
    } else {
      alert('Please enter a valid image URL');
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Upload Method Toggle */}
      <div className="flex space-x-2 mb-4">
        <Button
          type="button"
          size="sm"
          variant={uploadMethod === 'file' ? 'primary' : 'outline'}
          onClick={() => setUploadMethod('file')}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <Button
          type="button"
          size="sm"
          variant={uploadMethod === 'url' ? 'primary' : 'outline'}
          onClick={() => setUploadMethod('url')}
        >
          <Link className="w-4 h-4 mr-2" />
          Image URL
        </Button>
      </div>

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            {isUploading ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-gray-600">Uploading...</span>
                </div>
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload an image</p>
                <p className="text-sm text-gray-400 mt-1">
                  PNG, JPG, GIF up to {Math.round(maxSize / (1024 * 1024))}MB
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* URL Input */}
      {uploadMethod === 'url' && (
        <div className="flex space-x-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim() || !uploadService.isValidImageUrl(urlInput.trim())}
          >
            Add
          </Button>
        </div>
      )}

      {/* Image Preview */}
      {value && (
        <div className="relative inline-block">
          <div className="relative group">
            <img
              src={value}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEg4OFY4OEg0MFY0MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTU2IDU2QzU2IDU5LjMxMzcgNTguNjg2MyA2MiA2MiA2MkM2NS4zMTM3IDYyIDY4IDU5LjMxMzcgNjggNTZDNjggNTIuNjg2MyA2NS4zMTM3IDUwIDYyIDUwQzU4LjY4NjMgNTAgNTYgNTIuNjg2MyA1NiA1NloiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTQ0IDc2TDU2IDY0TDY4IDc2SDQ0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-500 max-w-32 truncate">
            {value.startsWith('blob:') || value.includes('amazonaws.com') || value.includes('cloudinary.com') || value.includes(window.location.origin) 
              ? 'Uploaded file' 
              : 'External URL'}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!value && uploadMethod === 'url' && (
        <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
    </div>
  );
};