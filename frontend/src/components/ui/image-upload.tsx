import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { convertImage, supportsWebP, type ConversionOptions, type ConversionResult } from '@/lib/imageConverter';

export interface ImageUploadProps {
  onUpload?: (files: File[]) => Promise<void>;
  onConvert?: (results: ConversionResult[]) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  convertToWebP?: boolean;
  conversionOptions?: ConversionOptions;
  className?: string;
  disabled?: boolean;
}

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
  converting?: boolean;
  converted?: boolean;
  conversionResult?: ConversionResult;
  error?: string;
}

export function ImageUpload({
  onUpload,
  onConvert,
  multiple = false,
  accept = 'image/*',
  maxFiles = 5,
  maxFileSize = 10, // 10MB default
  convertToWebP = true,
  conversionOptions = { quality: 0.8, maxWidth: 2048, maxHeight: 2048 },
  className = '',
  disabled = false
}: ImageUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [webPSupported, setWebPSupported] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check WebP support on component mount
  React.useEffect(() => {
    if (convertToWebP) {
      supportsWebP().then(setWebPSupported);
    }
  }, [convertToWebP]);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'File must be an image';
    }

    return null;
  };

  const processFiles = useCallback(async (fileList: FileList) => {
    const newFiles: FileWithPreview[] = [];
    const filesToProcess = Array.from(fileList).slice(0, maxFiles - files.length);

    for (const file of filesToProcess) {
      const error = validateFile(file);
      if (error) {
        console.error(`File validation failed for ${file.name}: ${error}`);
        continue;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      
      newFiles.push({
        file,
        preview,
        id,
        converting: false,
        converted: false
      });
    }

    setFiles(prev => [...prev, ...newFiles]);

    // Convert to WebP if enabled and supported
    if (convertToWebP && webPSupported && newFiles.length > 0) {
      await convertFiles(newFiles);
    }
  }, [files.length, maxFiles, maxFileSize, convertToWebP, webPSupported, conversionOptions]);

  const convertFiles = async (filesToConvert: FileWithPreview[]) => {
    const conversionResults: ConversionResult[] = [];

    for (const fileWithPreview of filesToConvert) {
      // Mark as converting
      setFiles(prev => prev.map(f => 
        f.id === fileWithPreview.id 
          ? { ...f, converting: true }
          : f
      ));

      try {
        const result = await convertImage(fileWithPreview.file, conversionOptions);
        
        // Create new file from converted blob
        const convertedFile = new File(
          [result.blob],
          fileWithPreview.file.name.replace(/\.[^/.]+$/, '.webp'),
          { type: 'image/webp' }
        );

        // Update file with conversion result
        setFiles(prev => prev.map(f => 
          f.id === fileWithPreview.id 
            ? { 
                ...f, 
                file: convertedFile,
                converting: false,
                converted: true,
                conversionResult: result
              }
            : f
        ));

        conversionResults.push(result);
      } catch (error) {
        console.error('Conversion failed:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileWithPreview.id 
            ? { 
                ...f, 
                converting: false,
                error: error instanceof Error ? error.message : 'Conversion failed'
              }
            : f
        ));
      }
    }

    if (conversionResults.length > 0 && onConvert) {
      onConvert(conversionResults);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0 || !onUpload) return;

    setIsUploading(true);
    try {
      const filesToUpload = files.map(f => f.file);
      await onUpload(filesToUpload);
      
      // Clear files after successful upload
      files.forEach(f => URL.revokeObjectURL(f.preview));
      setFiles([]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 px-6 text-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {multiple ? 'Drop images here or click to browse' : 'Drop image here or click to browse'}
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, GIF, WebP (max {maxFileSize}MB each)
              {multiple && ` • Up to ${maxFiles} files`}
            </p>
            {convertToWebP && webPSupported && (
              <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Images will be converted to WebP for better compression
              </p>
            )}
            {convertToWebP && webPSupported === false && (
              <p className="text-xs text-amber-600 flex items-center justify-center gap-1">
                <AlertCircle className="h-3 w-3" />
                WebP not supported in this browser
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Selected Images</Label>
          <div className="grid gap-3">
            {files.map((fileWithPreview) => (
              <Card key={fileWithPreview.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={fileWithPreview.preview}
                      alt="Preview"
                      className="h-16 w-16 rounded object-cover"
                    />
                    {fileWithPreview.converting && (
                      <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      </div>
                    )}
                    {fileWithPreview.converted && (
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {fileWithPreview.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(fileWithPreview.file.size)}
                    </p>
                    
                    {fileWithPreview.converting && (
                      <p className="text-xs text-blue-600">Converting to WebP...</p>
                    )}
                    
                    {fileWithPreview.converted && fileWithPreview.conversionResult && (
                      <p className="text-xs text-green-600">
                        WebP • {fileWithPreview.conversionResult.compressionRatio.toFixed(1)}% smaller
                      </p>
                    )}
                    
                    {fileWithPreview.error && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {fileWithPreview.error}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(fileWithPreview.id);
                    }}
                    disabled={disabled || fileWithPreview.converting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && onUpload && (
        <Button 
          onClick={handleUpload}
          disabled={disabled || isUploading || files.some(f => f.converting)}
          className="w-full"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload {files.length} {files.length === 1 ? 'Image' : 'Images'}
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default ImageUpload;