import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PersonArticle } from '../types/article';

interface PersonViewProps {
  article: PersonArticle;
}

export function PersonView({ article }: PersonViewProps) {
  const { person_data } = article;

  if (!person_data) {
    return <div>No person data available</div>;
  }

  const formatList = (items: string[]) => {
    return items.length > 0 ? items.join(', ') : 'None';
  };

  const getAgeDescription = () => {
    if (!person_data.age) return 'Age unknown';
    
    const age = person_data.age;
    if (age < 13) return `Child (${age} years old)`;
    if (age < 20) return `Teenager (${age} years old)`;
    if (age < 30) return `Young adult (${age} years old)`;
    if (age < 50) return `Adult (${age} years old)`;
    if (age < 70) return `Middle-aged (${age} years old)`;
    return `Elder (${age} years old)`;
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
                <Badge variant="secondary">Character</Badge>
                {person_data.race && (
                  <Badge variant="outline">{person_data.race}</Badge>
                )}
                {person_data.occupation && (
                  <Badge variant="outline">{person_data.occupation}</Badge>
                )}
                <Badge 
                  variant={person_data.life_status === 'alive' ? 'default' : 'destructive'}
                >
                  {person_data.life_status.charAt(0).toUpperCase() + person_data.life_status.slice(1)}
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

          {/* Physical Appearance */}
          {(person_data.height || person_data.weight || person_data.eye_color || person_data.hair_color || person_data.distinguishing_marks.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Physical Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {person_data.height && (
                    <div>
                      <span className="font-semibold">Height:</span> {person_data.height}
                    </div>
                  )}
                  {person_data.weight && (
                    <div>
                      <span className="font-semibold">Build:</span> {person_data.weight}
                    </div>
                  )}
                  {person_data.eye_color && (
                    <div>
                      <span className="font-semibold">Eyes:</span> {person_data.eye_color}
                    </div>
                  )}
                  {person_data.hair_color && (
                    <div>
                      <span className="font-semibold">Hair:</span> {person_data.hair_color}
                    </div>
                  )}
                </div>

                {person_data.distinguishing_marks.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Distinguishing Marks</h4>
                    <div className="flex flex-wrap gap-1">
                      {person_data.distinguishing_marks.map(mark => (
                        <Badge key={mark} variant="outline" className="text-xs">
                          {mark}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Abilities & Skills */}
          {(person_data.skills.length > 0 || person_data.abilities.length > 0 || person_data.personality_traits.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Abilities & Traits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {person_data.skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {person_data.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {person_data.abilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Abilities</h4>
                    <div className="flex flex-wrap gap-1">
                      {person_data.abilities.map(ability => (
                        <Badge key={ability} variant="outline" className="text-xs">
                          {ability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {person_data.personality_traits.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Personality Traits</h4>
                    <div className="flex flex-wrap gap-1">
                      {person_data.personality_traits.map(trait => (
                        <Badge key={trait} variant="outline" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Story Elements */}
          {(person_data.goals.length > 0 || person_data.fears.length > 0 || person_data.secrets.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Story Elements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {person_data.goals.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Goals</h4>
                    <div className="flex flex-wrap gap-1">
                      {person_data.goals.map(goal => (
                        <Badge key={goal} variant="default" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {person_data.fears.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Fears</h4>
                    <div className="flex flex-wrap gap-1">
                      {person_data.fears.map(fear => (
                        <Badge key={fear} variant="destructive" className="text-xs">
                          {fear}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {person_data.secrets.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Secrets</h4>
                    <div className="flex flex-wrap gap-1">
                      {person_data.secrets.map(secret => (
                        <Badge key={secret} variant="secondary" className="text-xs">
                          {secret}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Important Dates */}
          {person_data.important_dates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Important Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {person_data.important_dates.map((date, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                      <div className="font-medium">{date.event}</div>
                      <div className="text-sm text-muted-foreground">{date.date}</div>
                      {date.location && (
                        <div className="text-sm text-muted-foreground">📍 {date.location}</div>
                      )}
                      {date.description && (
                        <div className="text-sm mt-1">{date.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Relationships */}
          {person_data.relationships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Relationships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {person_data.relationships.map((relationship, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-muted/50">
                      <div className="font-medium">{relationship.person_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {relationship.relationship_type}
                        {relationship.status !== 'active' && ` (${relationship.status})`}
                      </div>
                      {relationship.description && (
                        <div className="text-sm mt-1">{relationship.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Possessions */}
          {person_data.notable_possessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Notable Possessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {person_data.notable_possessions.map(possession => (
                    <Badge key={possession} variant="outline">
                      {possession}
                    </Badge>
                  ))}
                </div>
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
                <span className="font-semibold">Age:</span>
                <br />
                <span className="text-muted-foreground">{getAgeDescription()}</span>
              </div>

              {person_data.gender && (
                <div>
                  <span className="font-semibold">Gender:</span>
                  <br />
                  <span className="text-muted-foreground">
                    {person_data.gender.charAt(0).toUpperCase() + person_data.gender.slice(1).replace('_', ' ')}
                  </span>
                </div>
              )}

              {person_data.social_class && (
                <div>
                  <span className="font-semibold">Social Class:</span>
                  <br />
                  <span className="text-muted-foreground">{person_data.social_class}</span>
                </div>
              )}

              {person_data.wealth && (
                <div>
                  <span className="font-semibold">Wealth:</span>
                  <br />
                  <span className="text-muted-foreground">
                    {person_data.wealth.charAt(0).toUpperCase() + person_data.wealth.slice(1)}
                  </span>
                </div>
              )}

              {person_data.birthplace && (
                <div>
                  <span className="font-semibold">Birthplace:</span>
                  <br />
                  <span className="text-muted-foreground">{person_data.birthplace}</span>
                </div>
              )}

              {person_data.current_location && (
                <div>
                  <span className="font-semibold">Current Location:</span>
                  <br />
                  <span className="text-muted-foreground">{person_data.current_location}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Life Events */}
          {(person_data.birth_date || person_data.death_date) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Life Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {person_data.birth_date && (
                  <div>
                    <span className="font-semibold">Born:</span>
                    <br />
                    <span className="text-muted-foreground">{person_data.birth_date}</span>
                  </div>
                )}

                {person_data.death_date && (
                  <div>
                    <span className="font-semibold">Died:</span>
                    <br />
                    <span className="text-muted-foreground">{person_data.death_date}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Organizations & Titles */}
          {(person_data.organizations.length > 0 || person_data.titles.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Affiliations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {person_data.titles.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Titles</h4>
                    <div className="flex flex-wrap gap-1">
                      {person_data.titles.map(title => (
                        <Badge key={title} variant="default" className="text-xs">
                          {title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {person_data.organizations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Organizations</h4>
                    <div className="flex flex-wrap gap-1">
                      {person_data.organizations.map(org => (
                        <Badge key={org} variant="outline" className="text-xs">
                          {org}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
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