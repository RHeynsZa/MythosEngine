/**
 * Image upload service to handle uploading images to the backend
 */

export interface UploadResponse {
  id: number;
  original_filename: string;
  mime_type: string;
  file_size: number;
  width: number;
  height: number;
  url: string;
  project_id: number;
  alt_text?: string;
  created_at: string;
  updated_at: string;
}

export interface UploadError {
  message: string;
  status?: number;
}

/**
 * Upload a single image file to the backend
 */
export async function uploadImage(
  file: File,
  projectId: number,
  altText?: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('project_id', projectId.toString());
  
  if (altText) {
    formData.append('alt_text', altText);
  }

  try {
    const response = await fetch('/api/v1/images/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Upload failed due to network error');
  }
}

/**
 * Upload multiple image files to the backend
 */
export async function uploadMultipleImages(
  files: File[],
  projectId: number,
  altTexts?: string[]
): Promise<UploadResponse[]> {
  const uploadPromises = files.map((file, index) => {
    const altText = altTexts?.[index];
    return uploadImage(file, projectId, altText);
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    // If any upload fails, we still want to return the successful ones
    // Let's handle this more gracefully
    const results: UploadResponse[] = [];
    const errors: UploadError[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadImage(files[i], projectId, altTexts?.[i]);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload ${files[i].name}:`, error);
        errors.push({
          message: error instanceof Error ? error.message : 'Upload failed',
        });
      }
    }

    if (results.length === 0) {
      throw new Error('All uploads failed');
    }

    // Return successful uploads, log errors
    if (errors.length > 0) {
      console.warn(`${errors.length} out of ${files.length} uploads failed:`, errors);
    }

    return results;
  }
}

/**
 * Get the full URL for an image
 */
export function getImageUrl(imageId: number): string {
  return `/api/v1/images/${imageId}`;
}

/**
 * Delete an image
 */
export async function deleteImage(imageId: number): Promise<void> {
  try {
    const response = await fetch(`/api/v1/images/${imageId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Delete failed with status ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Delete failed due to network error');
  }
}