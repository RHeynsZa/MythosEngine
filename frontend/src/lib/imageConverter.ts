/**
 * Client-side image conversion utilities
 */

export interface ConversionOptions {
  quality?: number; // 0.0 to 1.0, default 0.8
  maxWidth?: number; // Maximum width in pixels
  maxHeight?: number; // Maximum height in pixels
  format?: 'webp' | 'jpeg' | 'png'; // Output format, default 'webp'
}

export interface ConversionResult {
  blob: Blob;
  originalSize: number;
  convertedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
  format: string;
}

/**
 * Check if the browser supports WebP format
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    canvas.toBlob((blob) => {
      resolve(blob !== null);
    }, 'image/webp');
  });
}

/**
 * Convert a File or Blob to the specified format (default: WebP)
 */
export function convertImage(
  file: File | Blob,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  const {
    quality = 0.8,
    maxWidth,
    maxHeight,
    format = 'webp'
  } = options;

  return new Promise((resolve, reject) => {
    // Create image element
    const img = new Image();
    
    // Create object URL for the file
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Clean up object URL immediately
      URL.revokeObjectURL(objectUrl);
      
      try {
        // Calculate dimensions
        let { width, height } = calculateDimensions(
          img.naturalWidth,
          img.naturalHeight,
          maxWidth,
          maxHeight
        );

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to convert image'));
            return;
          }

          const originalSize = file.size;
          const convertedSize = blob.size;
          const compressionRatio = ((originalSize - convertedSize) / originalSize) * 100;

          resolve({
            blob,
            originalSize,
            convertedSize,
            compressionRatio,
            width,
            height,
            format
          });
        }, `image/${format}`, quality);

      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = objectUrl;
  });
}

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number,
  maxHeight?: number
): { width: number; height: number } {
  let width = originalWidth;
  let height = originalHeight;

  // Apply maximum width constraint
  if (maxWidth && width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  // Apply maximum height constraint
  if (maxHeight && height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Convert multiple files to WebP format
 */
export async function convertMultipleImages(
  files: FileList | File[],
  options: ConversionOptions = {}
): Promise<ConversionResult[]> {
  const fileArray = Array.from(files);
  const results: ConversionResult[] = [];

  for (const file of fileArray) {
    try {
      const result = await convertImage(file, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to convert ${file.name}:`, error);
      // Continue with other files even if one fails
    }
  }

  return results;
}

/**
 * Get file extension for the converted format
 */
export function getFileExtension(format: string): string {
  switch (format) {
    case 'webp':
      return '.webp';
    case 'jpeg':
      return '.jpg';
    case 'png':
      return '.png';
    default:
      return '.webp';
  }
}

/**
 * Generate a new filename with the appropriate extension
 */
export function generateConvertedFilename(originalFilename: string, format: string): string {
  const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
  const extension = getFileExtension(format);
  return `${nameWithoutExt}${extension}`;
}