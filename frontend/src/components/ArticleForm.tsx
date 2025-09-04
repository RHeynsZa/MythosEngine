import { useState } from 'react';
import { Article, ArticleCreate, ArticleUpdate, ArticleType, Image } from '../types/article';

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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter article title"
          />
        </div>

        {/* Article Type */}
        <div>
          <label htmlFor="article_type" className="block text-sm font-medium text-gray-700 mb-2">
            Article Type
          </label>
          <select
            id="article_type"
            value={formData.article_type}
            onChange={(e) => setFormData(prev => ({ ...prev, article_type: e.target.value as ArticleType }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(ArticleType).map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Header Image */}
        <div>
          <label htmlFor="header_image" className="block text-sm font-medium text-gray-700 mb-2">
            Header Image
          </label>
          <select
            id="header_image"
            value={formData.header_image_id || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              header_image_id: e.target.value ? parseInt(e.target.value) : null 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No header image</option>
            {images.map(image => (
              <option key={image.id} value={image.id}>
                {image.original_filename} ({image.width}x{image.height})
              </option>
            ))}
          </select>
          {formData.header_image_id && (
            <div className="mt-2">
              {(() => {
                const selectedImage = images.find(img => img.id === formData.header_image_id);
                return selectedImage ? (
                  <div className="text-sm text-gray-600">
                    <p>Selected: {selectedImage.original_filename}</p>
                    <p>Size: {selectedImage.width}x{selectedImage.height} ({(selectedImage.file_size / 1024).toFixed(1)} KB)</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
            Summary
          </label>
          <textarea
            id="summary"
            value={formData.content.summary}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: { ...prev.content, summary: e.target.value }
            }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief summary of the article"
          />
        </div>

        {/* Main Content */}
        <div>
          <label htmlFor="main_content" className="block text-sm font-medium text-gray-700 mb-2">
            Main Content
          </label>
          <textarea
            id="main_content"
            value={formData.content.main_content}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: { ...prev.content, main_content: e.target.value }
            }))}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your article content here..."
          />
        </div>

        {/* Sidebar Content */}
        <div>
          <label htmlFor="sidebar_content" className="block text-sm font-medium text-gray-700 mb-2">
            Sidebar Content
          </label>
          <textarea
            id="sidebar_content"
            value={formData.content.sidebar_content}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: { ...prev.content, sidebar_content: e.target.value }
            }))}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional sidebar content"
          />
        </div>

        {/* Footer Content */}
        <div>
          <label htmlFor="footer_content" className="block text-sm font-medium text-gray-700 mb-2">
            Footer Content
          </label>
          <textarea
            id="footer_content"
            value={formData.content.footer_content}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: { ...prev.content, footer_content: e.target.value }
            }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional footer content"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.content.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (article ? 'Update Article' : 'Create Article')}
        </button>
      </div>
    </form>
  );
}