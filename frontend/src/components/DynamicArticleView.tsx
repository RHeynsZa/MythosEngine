import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SettlementView } from './SettlementView';
import { PersonView } from './PersonView';
import { SpotifyEmbed } from './SpotifyEmbed';
import { ArticleType, Article } from '../types/article';

interface DynamicArticleViewProps {
  article: Article;
}

// Generic article view for non-specialized types
function GenericArticleView({ article }: { article: Article }) {
  return (
    <div className="space-y-6">
      {/* Header Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{article.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  {article.article_type.charAt(0).toUpperCase() + article.article_type.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        {article.content?.summary && (
          <CardContent>
            <p className="text-muted-foreground">{article.content.summary}</p>
          </CardContent>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap">
                {article.content?.main_content || 'No content available.'}
              </div>

              {article.content?.footer_content && (
                <div className="mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {article.content.footer_content}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {article.spotify_url && (
            <SpotifyEmbed spotifyUrl={article.spotify_url} />
          )}

          {article.content?.sidebar_content && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-wrap">
                  {article.content.sidebar_content}
                </div>
              </CardContent>
            </Card>
          )}

          {article.content?.tags && article.content.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {article.content.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export function DynamicArticleView({ article }: DynamicArticleViewProps) {
  // Render the appropriate view based on the article type
  switch (article.article_type) {
    case ArticleType.LOCATION:
      return <SettlementView article={article as any} />;
    
    case ArticleType.CHARACTER:
      return <PersonView article={article as any} />;
    
    case ArticleType.GENERAL:
    case ArticleType.ITEM:
    case ArticleType.LORE:
    case ArticleType.EVENT:
    case ArticleType.ORGANIZATION:
    default:
      return <GenericArticleView article={article} />;
  }
}