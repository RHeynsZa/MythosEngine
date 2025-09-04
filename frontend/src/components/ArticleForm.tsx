import { useState } from 'react';
import type { Article, ArticleCreate, ArticleUpdate, Image } from '../types/article';
import { ArticleType } from '../types/article';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ArticleFormProps {
  article?: Article;
  images?: Image[];
  onSubmit: (data: ArticleCreate | ArticleUpdate) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ArticleForm({ 
  article, 
  images = [], 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ArticleFormProps) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    article_type: article?.article_type || ArticleType.GENERAL,
    header_image_id: article?.header_image_id || null,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      project_id: article?.project_id || 1, // This should come from context/props
      header_image_id: formData.header_image_id || undefined
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