import { useState } from 'react';
import type { Article, ArticleCreate, ArticleUpdate, Image } from '../types/article';
import { ArticleType } from '../types/article';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { uploadMultipleImages } from '@/lib/uploadService';
import type { ConversionResult } from '@/lib/imageConverter';

interface ArticleFormProps {
  article?: Article;
  images?: Image[];
  onSubmit: (data: ArticleCreate | ArticleUpdate) => void;
  onCancel: () => void;
  isLoading?: boolean;
  projectId?: number; // Add projectId for uploads
  onImagesUploaded?: (newImages: Image[]) => void; // Callback when new images are uploaded
}

export function ArticleForm({ 
  article, 
  images = [], 
  onSubmit, 
  onCancel, 
  isLoading = false,
  projectId = 1,
  onImagesUploaded
}: ArticleFormProps) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    article_type: article?.article_type || ArticleType.GENERAL,
    header_image_id: article?.header_image_id || null,
    spotify_url: article?.spotify_url || '',
    content: {
      main_content: article?.content?.main_content || '',
      sidebar_content: article?.content?.sidebar_content || '',
      footer_content: article?.content?.footer_content || '',
      summary: article?.content?.summary || '',
      tags: article?.content?.tags || [],
      metadata: article?.content?.metadata || {}
    }
  });

  const [newTag, setNewTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      project_id: article?.project_id || 1, // This should come from context/props
      header_image_id: formData.header_image_id || undefined,
      spotify_url: formData.spotify_url || undefined
    };
    onSubmit(submitData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.content.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          tags: [...prev.content.tags, newTag.trim()]
        }
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        tags: prev.content.tags.filter(tag => tag !== tagToRemove)
      }
    }));
  };

  const handleImageUpload = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(`Uploading ${files.length} image${files.length > 1 ? 's' : ''}...`);

    try {
      const uploadedImages = await uploadMultipleImages(files, projectId);
      
      // Convert to the Image type expected by the component
      const newImages: Image[] = uploadedImages.map(img => ({
        id: img.id,
        filename: img.original_filename, // Use original_filename as filename
        original_filename: img.original_filename,
        mime_type: img.mime_type,
        file_size: img.file_size,
        width: img.width,
        height: img.height,
        file_path: img.url, // Use the URL as file_path
        is_s3_stored: false, // Assume local storage for now
        project_id: img.project_id,
        alt_text: img.alt_text,
        created_at: img.created_at,
        updated_at: img.updated_at
      }));

      setUploadProgress('Upload completed successfully!');
      
      // Notify parent component about new images
      if (onImagesUploaded) {
        onImagesUploaded(newImages);
      }

      // Clear progress after a short delay
      setTimeout(() => setUploadProgress(''), 2000);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Clear error after a longer delay
      setTimeout(() => setUploadProgress(''), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConversionComplete = (results: ConversionResult[]) => {
    const totalSavings = results.reduce((acc, result) => acc + result.compressionRatio, 0);
    const avgSavings = totalSavings / results.length;
    
    console.log(`Images converted to WebP with average ${avgSavings.toFixed(1)}% size reduction`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter article title"
          />
        </div>

        {/* Article Type */}
        <div className="space-y-2">
          <Label htmlFor="article_type">Article Type</Label>
          <Select
            value={formData.article_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, article_type: value as ArticleType }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select article type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ArticleType).map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Header Image */}
        {images.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="header_image">Header Image</Label>
            <Select
              value={formData.header_image_id?.toString() || ''}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                header_image_id: value ? parseInt(value) : null 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select header image" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No header image</SelectItem>
                {images.map(image => (
                  <SelectItem key={image.id} value={image.id.toString()}>
                    {image.original_filename} ({image.width}x{image.height})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.header_image_id && (
              <div className="mt-2">
                {(() => {
                  const selectedImage = images.find(img => img.id === formData.header_image_id);
                  return selectedImage ? (
                    <div className="text-sm text-muted-foreground">
                      <p>Selected: {selectedImage.original_filename}</p>
                      <p>Size: {selectedImage.width}x{selectedImage.height} ({(selectedImage.file_size / 1024).toFixed(1)} KB)</p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        )}

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Upload New Images</Label>
          <ImageUpload
            onUpload={handleImageUpload}
            onConvert={handleConversionComplete}
            multiple={true}
            maxFiles={5}
            maxFileSize={10}
            convertToWebP={true}
            conversionOptions={{
              quality: 0.8,
              maxWidth: 2048,
              maxHeight: 2048
            }}
            disabled={isUploading || isLoading}
          />
          {uploadProgress && (
            <p className={`text-sm ${uploadProgress.includes('failed') ? 'text-red-600' : uploadProgress.includes('completed') ? 'text-green-600' : 'text-blue-600'}`}>
              {uploadProgress}
            </p>
          )}
        </div>

        {/* Spotify URL */}
        <div className="space-y-2">
          <Label htmlFor="spotify_url">Spotify URL (Mood Music)</Label>
          <Input
            id="spotify_url"
            value={formData.spotify_url}
            onChange={(e) => setFormData(prev => ({ ...prev, spotify_url: e.target.value }))}
            placeholder="https://open.spotify.com/track/... or spotify:track:..."
          />
          <p className="text-sm text-muted-foreground">
            Add a Spotify track URL to set the mood/tone for this article. 
            Supports both web URLs and Spotify URIs.
          </p>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={formData.content.summary || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: { ...prev.content, summary: e.target.value }
            }))}
            rows={3}
            placeholder="Brief summary of the article"
          />
        </div>

        {/* Main Content */}
        <div className="space-y-2">
          <Label htmlFor="main_content">Main Content</Label>
          <Textarea
            id="main_content"
            value={formData.content.main_content || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: { ...prev.content, main_content: e.target.value }
            }))}
            rows={10}
            placeholder="Write your article content here..."
          />
        </div>

        {/* Sidebar Content */}
        <div className="space-y-2">
          <Label htmlFor="sidebar_content">Sidebar Content</Label>
          <Textarea
            id="sidebar_content"
            value={formData.content.sidebar_content || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: { ...prev.content, sidebar_content: e.target.value }
            }))}
            rows={5}
            placeholder="Optional sidebar content"
          />
        </div>

        {/* Footer Content */}
        <div className="space-y-2">
          <Label htmlFor="footer_content">Footer Content</Label>
          <Textarea
            id="footer_content"
            value={formData.content.footer_content || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: { ...prev.content, footer_content: e.target.value }
            }))}
            rows={3}
            placeholder="Optional footer content"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag"
              className="flex-1"
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.content.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-primary hover:text-primary/80"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (article ? 'Update Article' : 'Create Article')}
        </Button>
      </div>
    </form>
  );
}