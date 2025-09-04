import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { DynamicArticleForm } from '@/components/DynamicArticleForm'
import { DynamicArticleView } from '@/components/DynamicArticleView'
import type { Article } from '@/types/article'
import { ArticleType } from '@/types/article'

export const Route = createFileRoute('/projects/$projectId/$articleId/')({
  component: ArticleEditPage,
})

// Mock data - this will be replaced with API calls later
const mockArticles: Record<string, Article> = {
  '1': {
    id: 1,
    title: 'Riverdale',
    article_type: ArticleType.LOCATION,
    project_id: 1,
    content: {
      main_content: 'A prosperous trading town situated at the confluence of two major rivers. Riverdale serves as a crucial hub for merchants traveling between the northern kingdoms and the southern territories. The town is known for its bustling markets, skilled craftsmen, and the famous Riverdale Bridge - an architectural marvel that spans the wider of the two rivers.',
      sidebar_content: 'The town\'s strategic location has made it wealthy, but also a target for raiders and political intrigue.',
      footer_content: 'Last updated by the Merchant\'s Guild cartographers',
      summary: 'A prosperous trading town at the confluence of two major rivers',
      tags: ['town', 'trade', 'rivers', 'bridge'],
      metadata: {}
    },
    settlement_data: {
      settlement_type: 'town' as any,
      population: 8500,
      government_type: 'council' as any,
      ruler_name: 'Mayor Gareth Blackwater',
      founded_date: '1247 AC',
      notable_features: ['The Great Bridge', 'River Markets', 'Merchant Quarter', 'Watermills'],
      trade_goods: ['Grain', 'Textiles', 'River Fish', 'Pottery', 'Iron Tools'],
      defenses: 'Stone walls on three sides, with the rivers providing natural barriers. A small garrison of 200 guards maintains order.',
      climate: 'Temperate',
      terrain: 'River valley',
      wealth_level: 'wealthy',
      coordinates: null,
      region: 'Central Kingdoms',
      nearby_settlements: ['Millhaven', 'Crossroads Keep', 'Oakenford'],
      primary_industry: 'Trade and Commerce',
      secondary_industries: ['Fishing', 'Milling', 'Crafts'],
      predominant_race: 'Human',
      languages_spoken: ['Common', 'Trader\'s Cant'],
      religions: ['Temple of Commerce', 'River Spirits'],
      festivals: ['Harvest Fair', 'River Festival', 'Bridge Day']
    },
    spotify_url: 'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh',
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
  } as any,
  '2': {
    id: 2,
    title: 'Sir Marcus Ironwood',
    article_type: ArticleType.CHARACTER,
    project_id: 1,
    content: {
      main_content: 'A veteran knight of the Silver Order, Sir Marcus has served the realm for over twenty years. Known for his unwavering honor and tactical brilliance, he has led numerous successful campaigns against bandits and monsters threatening the borderlands. Despite his stern exterior, those who know him well speak of his dry humor and deep compassion for the common folk.',
      sidebar_content: 'Currently stationed at Ironhold Keep, overseeing border defenses.',
      footer_content: 'Records maintained by the Silver Order',
      summary: 'A veteran knight of the Silver Order known for honor and tactical skill',
      tags: ['knight', 'silver order', 'veteran', 'honorable'],
      metadata: {}
    },
    person_data: {
      race: 'Human',
      gender: 'male' as any,
      age: 45,
      life_status: 'alive' as any,
      height: '6\'2"',
      weight: 'Muscular build',
      eye_color: 'Steel grey',
      hair_color: 'Black with silver streaks',
      distinguishing_marks: ['Scar across left cheek', 'Silver Order tattoo on right shoulder'],
      birthplace: 'Ironhold Village',
      current_location: 'Ironhold Keep',
      occupation: 'Knight Commander',
      social_class: 'Noble',
      birth_date: '15th of Ironfall, 1398 AC',
      death_date: null,
      important_dates: [
        {
          date: '1416 AC',
          event: 'Joined the Silver Order',
          description: 'Became a squire at age 18',
          location: 'Silver Citadel'
        },
        {
          date: '1420 AC', 
          event: 'Knighted',
          description: 'Earned knighthood after the Battle of Crow\'s Ridge',
          location: 'Silver Citadel'
        },
        {
          date: '1435 AC',
          event: 'Promoted to Knight Commander',
          description: 'Given command of Ironhold Keep\'s garrison',
          location: 'Ironhold Keep'
        }
      ],
      relationships: [
        {
          person_name: 'Lady Elena Ironwood',
          relationship_type: 'Wife',
          description: 'Married for 15 years, she manages the keep\'s affairs',
          status: 'active'
        },
        {
          person_name: 'Thomas Ironwood',
          relationship_type: 'Son',
          description: 'Age 14, training to become a knight',
          status: 'active'
        },
        {
          person_name: 'Grand Master Aldwin',
          relationship_type: 'Mentor',
          description: 'Former commander who trained Marcus',
          status: 'active'
        }
      ],
      skills: ['Swordsmanship', 'Tactics', 'Leadership', 'Horseback Riding', 'Military Engineering'],
      abilities: ['Battle Fury', 'Inspiring Presence', 'Defensive Stance'],
      personality_traits: ['Honorable', 'Stern', 'Compassionate', 'Tactical', 'Dry humor'],
      goals: ['Protect the borderlands', 'Train the next generation', 'Maintain peace'],
      fears: ['Failing his duty', 'Loss of family', 'Corruption in the Order'],
      secrets: ['Doubts about recent Order policies', 'Hidden magical sensitivity'],
      notable_possessions: ['Ironwood - enchanted sword', 'Silver Order armor', 'Warhorse Thunderbolt'],
      wealth: 'modest',
      organizations: ['Silver Order', 'Ironhold Keep'],
      titles: ['Knight Commander', 'Defender of the Borderlands']
    },
    spotify_url: 'https://open.spotify.com/track/7qiZfU4dY21yK3FjjafFpT',
    created_at: '2024-01-14',
    updated_at: '2024-01-16',
  } as any,
  '3': {
    id: 3,
    title: 'The Galactic Federation',
    article_type: ArticleType.ORGANIZATION,
    project_id: 2,
    content: {
      main_content: 'A political alliance spanning multiple star systems, the Galactic Federation was formed in 2387 to maintain peace and facilitate trade between member worlds. The Federation operates under a democratic council system.',
      sidebar_content: 'Founded: 2387\nMember Worlds: 47\nHeadquarters: New Geneva Station',
      footer_content: 'Federation Archives, Department of Historical Records',
      summary: 'A political alliance spanning multiple star systems',
      tags: ['organization', 'politics', 'sci-fi'],
      metadata: {}
    },
    spotify_url: 'https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp',
    created_at: '2024-01-10',
    updated_at: '2024-01-12',
  },
}

function ArticleEditPage() {
  const { articleId } = Route.useParams()
  const [article, setArticle] = useState<Article | undefined>(mockArticles[articleId])
  const [isEditing, setIsEditing] = useState(false)

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The article you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleUpdateArticle = (updatedData: any) => {
    const updatedArticle = {
      ...article,
      ...updatedData,
      updated_at: new Date().toISOString().split('T')[0],
    }
    
    setArticle(updatedArticle)
    mockArticles[articleId] = updatedArticle
    setIsEditing(false)
  }

  const getProjectLink = () => {
    // This would normally come from the article data or API
    return `/projects/${article.project_id}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4">
          <Button variant="outline" asChild>
            <Link to={getProjectLink()}>← Back to Project</Link>
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <span>Type: {article.article_type.charAt(0).toUpperCase() + article.article_type.slice(1)}</span>
              <span>Created: {article.created_at}</span>
              {article.updated_at !== article.created_at && (
                <span>Updated: {article.updated_at}</span>
              )}
            </div>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel Edit' : 'Edit Article'}
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Article</CardTitle>
            <CardDescription>
              Make changes to your article content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DynamicArticleForm
              article={article}
              onSubmit={handleUpdateArticle}
              onCancel={() => setIsEditing(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <DynamicArticleView article={article} />
      )}
    </div>
  )
}
