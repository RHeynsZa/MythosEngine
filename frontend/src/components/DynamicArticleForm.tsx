import { ArticleForm } from './ArticleForm';
import { SettlementForm } from './SettlementForm';
import { PersonForm } from './PersonForm';
import { ArticleType, Article, ArticleCreate, ArticleUpdate, Image } from '../types/article';

interface DynamicArticleFormProps {
  article?: Article;
  images?: Image[];
  onSubmit: (data: ArticleCreate | ArticleUpdate) => void;
  onCancel: () => void;
  isLoading?: boolean;
  articleType?: ArticleType;
}

export function DynamicArticleForm({ 
  article, 
  images = [], 
  onSubmit, 
  onCancel, 
  isLoading = false,
  articleType 
}: DynamicArticleFormProps) {
  // Determine the article type - either from the existing article or the explicitly passed type
  const currentType = article?.article_type || articleType || ArticleType.GENERAL;

  // Render the appropriate form based on the article type
  switch (currentType) {
    case ArticleType.LOCATION:
      return (
        <SettlementForm
          article={article as any}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      );
    
    case ArticleType.CHARACTER:
      return (
        <PersonForm
          article={article as any}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      );
    
    case ArticleType.GENERAL:
    case ArticleType.ITEM:
    case ArticleType.LORE:
    case ArticleType.EVENT:
    case ArticleType.ORGANIZATION:
    default:
      return (
        <ArticleForm
          article={article}
          images={images}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      );
  }
}