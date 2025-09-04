import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SettlementArticle } from '../types/article';

interface SettlementViewProps {
  article: SettlementArticle;
}

export function SettlementView({ article }: SettlementViewProps) {
  const { settlement_data } = article;

  if (!settlement_data) {
    return <div>No settlement data available</div>;
  }

  const formatPopulation = (population?: number | null) => {
    if (!population) return 'Unknown';
    return population.toLocaleString();
  };

  const formatList = (items: string[]) => {
    return items.length > 0 ? items.join(', ') : 'None';
  };

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
                  {settlement_data.settlement_type.charAt(0).toUpperCase() + settlement_data.settlement_type.slice(1).replace('_', ' ')}
                </Badge>
                {settlement_data.wealth_level && (
                  <Badge variant="outline">
                    {settlement_data.wealth_level.charAt(0).toUpperCase() + settlement_data.wealth_level.slice(1)}
                  </Badge>
                )}
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
        <div className="lg:col-span-3 space-y-6">
          {/* Main Content */}
          {article.content?.main_content && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap">
                  {article.content.main_content}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Economic Information */}
          {(settlement_data.primary_industry || settlement_data.secondary_industries.length > 0 || settlement_data.trade_goods.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Economic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settlement_data.primary_industry && (
                  <div>
                    <h4 className="font-semibold mb-1">Primary Industry</h4>
                    <p className="text-sm text-muted-foreground">{settlement_data.primary_industry}</p>
                  </div>
                )}
                
                {settlement_data.secondary_industries.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Secondary Industries</h4>
                    <div className="flex flex-wrap gap-1">
                      {settlement_data.secondary_industries.map(industry => (
                        <Badge key={industry} variant="outline" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {settlement_data.trade_goods.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Trade Goods</h4>
                    <div className="flex flex-wrap gap-1">
                      {settlement_data.trade_goods.map(good => (
                        <Badge key={good} variant="secondary" className="text-xs">
                          {good}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notable Features */}
          {settlement_data.notable_features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Notable Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {settlement_data.notable_features.map(feature => (
                    <Badge key={feature} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cultural Information */}
          {(settlement_data.predominant_race || settlement_data.languages_spoken.length > 0 || settlement_data.religions.length > 0 || settlement_data.festivals.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Cultural Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settlement_data.predominant_race && (
                  <div>
                    <h4 className="font-semibold mb-1">Predominant Race</h4>
                    <p className="text-sm text-muted-foreground">{settlement_data.predominant_race}</p>
                  </div>
                )}

                {settlement_data.languages_spoken.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Languages Spoken</h4>
                    <div className="flex flex-wrap gap-1">
                      {settlement_data.languages_spoken.map(language => (
                        <Badge key={language} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {settlement_data.religions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Religions</h4>
                    <div className="flex flex-wrap gap-1">
                      {settlement_data.religions.map(religion => (
                        <Badge key={religion} variant="outline" className="text-xs">
                          {religion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {settlement_data.festivals.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Festivals</h4>
                    <div className="flex flex-wrap gap-1">
                      {settlement_data.festivals.map(festival => (
                        <Badge key={festival} variant="secondary" className="text-xs">
                          {festival}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Defenses */}
          {settlement_data.defenses && (
            <Card>
              <CardHeader>
                <CardTitle>Defenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{settlement_data.defenses}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Population:</span>
                <br />
                <span className="text-muted-foreground">{formatPopulation(settlement_data.population)}</span>
              </div>

              {settlement_data.government_type && (
                <div>
                  <span className="font-semibold">Government:</span>
                  <br />
                  <span className="text-muted-foreground">
                    {settlement_data.government_type.charAt(0).toUpperCase() + settlement_data.government_type.slice(1)}
                  </span>
                </div>
              )}

              {settlement_data.ruler_name && (
                <div>
                  <span className="font-semibold">Ruler:</span>
                  <br />
                  <span className="text-muted-foreground">{settlement_data.ruler_name}</span>
                </div>
              )}

              {settlement_data.founded_date && (
                <div>
                  <span className="font-semibold">Founded:</span>
                  <br />
                  <span className="text-muted-foreground">{settlement_data.founded_date}</span>
                </div>
              )}

              {settlement_data.region && (
                <div>
                  <span className="font-semibold">Region:</span>
                  <br />
                  <span className="text-muted-foreground">{settlement_data.region}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Geographic Details */}
          {(settlement_data.terrain || settlement_data.climate) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Geography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {settlement_data.terrain && (
                  <div>
                    <span className="font-semibold">Terrain:</span>
                    <br />
                    <span className="text-muted-foreground">{settlement_data.terrain}</span>
                  </div>
                )}

                {settlement_data.climate && (
                  <div>
                    <span className="font-semibold">Climate:</span>
                    <br />
                    <span className="text-muted-foreground">{settlement_data.climate}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Nearby Settlements */}
          {settlement_data.nearby_settlements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nearby Settlements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {settlement_data.nearby_settlements.map(settlement => (
                    <Badge key={settlement} variant="outline" className="text-xs">
                      {settlement}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sidebar Content */}
          {article.content?.sidebar_content && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-wrap">
                  {article.content.sidebar_content}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
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

      {/* Footer Content */}
      {article.content?.footer_content && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground whitespace-pre-wrap border-t pt-4">
              {article.content.footer_content}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}