import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  SettlementType, 
  GovernmentType, 
  SettlementData, 
  SettlementArticle 
} from '../types/article';

interface SettlementFormProps {
  article?: SettlementArticle;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultSettlementData: SettlementData = {
  settlement_type: SettlementType.VILLAGE,
  population: null,
  government_type: null,
  ruler_name: null,
  founded_date: null,
  notable_features: [],
  trade_goods: [],
  defenses: null,
  climate: null,
  terrain: null,
  wealth_level: null,
  coordinates: null,
  region: null,
  nearby_settlements: [],
  primary_industry: null,
  secondary_industries: [],
  predominant_race: null,
  languages_spoken: [],
  religions: [],
  festivals: []
};

export function SettlementForm({ 
  article, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: SettlementFormProps) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    spotify_url: article?.spotify_url || '',
    content: {
      main_content: article?.content?.main_content || '',
      sidebar_content: article?.content?.sidebar_content || '',
      footer_content: article?.content?.footer_content || '',
      summary: article?.content?.summary || '',
      tags: article?.content?.tags || [],
      metadata: article?.content?.metadata || {}
    },
    settlement_data: article?.settlement_data || { ...defaultSettlementData }
  });

  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newTradeGood, setNewTradeGood] = useState('');
  const [newSettlement, setNewSettlement] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newReligion, setNewReligion] = useState('');
  const [newFestival, setNewFestival] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      project_id: article?.project_id || 1,
      article_type: 'location'
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

  const addToList = (field: keyof SettlementData, value: string, setValue: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        settlement_data: {
          ...prev.settlement_data,
          [field]: [...(prev.settlement_data[field] as string[]), value.trim()]
        }
      }));
      setValue('');
    }
  };

  const removeFromList = (field: keyof SettlementData, valueToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      settlement_data: {
        ...prev.settlement_data,
        [field]: (prev.settlement_data[field] as string[]).filter(item => item !== valueToRemove)
      }
    }));
  };

  const updateSettlementData = (field: keyof SettlementData, value: any) => {
    setFormData(prev => ({
      ...prev,
      settlement_data: {
        ...prev.settlement_data,
        [field]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Settlement Name *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter settlement name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settlement_type">Settlement Type</Label>
              <Select
                value={formData.settlement_data.settlement_type}
                onValueChange={(value) => updateSettlementData('settlement_type', value as SettlementType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select settlement type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SettlementType).map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="population">Population</Label>
              <Input
                id="population"
                type="number"
                value={formData.settlement_data.population || ''}
                onChange={(e) => updateSettlementData('population', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Enter population"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.settlement_data.region || ''}
                onChange={(e) => updateSettlementData('region', e.target.value || null)}
                placeholder="Enter region"
              />
            </div>
          </div>

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
              placeholder="Brief summary of the settlement"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spotify_url">Spotify URL (Mood Music)</Label>
            <Input
              id="spotify_url"
              value={formData.spotify_url}
              onChange={(e) => setFormData(prev => ({ ...prev, spotify_url: e.target.value }))}
              placeholder="https://open.spotify.com/track/... or spotify:track:..."
            />
            <p className="text-sm text-muted-foreground">
              Add a Spotify track URL to set the mood/tone for this settlement. 
              Supports both web URLs and Spotify URIs.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Government & Leadership */}
      <Card>
        <CardHeader>
          <CardTitle>Government & Leadership</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="government_type">Government Type</Label>
              <Select
                value={formData.settlement_data.government_type || ''}
                onValueChange={(value) => updateSettlementData('government_type', value ? value as GovernmentType : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select government type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No government</SelectItem>
                  {Object.values(GovernmentType).map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ruler_name">Ruler/Leader</Label>
              <Input
                id="ruler_name"
                value={formData.settlement_data.ruler_name || ''}
                onChange={(e) => updateSettlementData('ruler_name', e.target.value || null)}
                placeholder="Enter ruler or leader name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic & Physical */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic & Physical Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="terrain">Terrain</Label>
              <Input
                id="terrain"
                value={formData.settlement_data.terrain || ''}
                onChange={(e) => updateSettlementData('terrain', e.target.value || null)}
                placeholder="e.g., Hills, Plains, Forest"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="climate">Climate</Label>
              <Input
                id="climate"
                value={formData.settlement_data.climate || ''}
                onChange={(e) => updateSettlementData('climate', e.target.value || null)}
                placeholder="e.g., Temperate, Arid, Tropical"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="founded_date">Founded Date</Label>
              <Input
                id="founded_date"
                value={formData.settlement_data.founded_date || ''}
                onChange={(e) => updateSettlementData('founded_date', e.target.value || null)}
                placeholder="e.g., 1425 AC, Spring of the Third Age"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wealth_level">Wealth Level</Label>
              <Select
                value={formData.settlement_data.wealth_level || ''}
                onValueChange={(value) => updateSettlementData('wealth_level', value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wealth level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unknown</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="modest">Modest</SelectItem>
                  <SelectItem value="wealthy">Wealthy</SelectItem>
                  <SelectItem value="rich">Rich</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defenses">Defenses</Label>
            <Textarea
              id="defenses"
              value={formData.settlement_data.defenses || ''}
              onChange={(e) => updateSettlementData('defenses', e.target.value || null)}
              rows={3}
              placeholder="Describe the settlement's defenses"
            />
          </div>
        </CardContent>
      </Card>

      {/* Economic */}
      <Card>
        <CardHeader>
          <CardTitle>Economic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary_industry">Primary Industry</Label>
            <Input
              id="primary_industry"
              value={formData.settlement_data.primary_industry || ''}
              onChange={(e) => updateSettlementData('primary_industry', e.target.value || null)}
              placeholder="e.g., Agriculture, Mining, Trade"
            />
          </div>

          <div className="space-y-2">
            <Label>Secondary Industries</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('secondary_industries', newIndustry, setNewIndustry))}
                placeholder="Add secondary industry"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('secondary_industries', newIndustry, setNewIndustry)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.settlement_data.secondary_industries.map(industry => (
                <span
                  key={industry}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {industry}
                  <button
                    type="button"
                    onClick={() => removeFromList('secondary_industries', industry)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Trade Goods</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTradeGood}
                onChange={(e) => setNewTradeGood(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('trade_goods', newTradeGood, setNewTradeGood))}
                placeholder="Add trade good"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('trade_goods', newTradeGood, setNewTradeGood)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.settlement_data.trade_goods.map(good => (
                <span
                  key={good}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {good}
                  <button
                    type="button"
                    onClick={() => removeFromList('trade_goods', good)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cultural */}
      <Card>
        <CardHeader>
          <CardTitle>Cultural Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="predominant_race">Predominant Race</Label>
            <Input
              id="predominant_race"
              value={formData.settlement_data.predominant_race || ''}
              onChange={(e) => updateSettlementData('predominant_race', e.target.value || null)}
              placeholder="e.g., Human, Elf, Dwarf"
            />
          </div>

          <div className="space-y-2">
            <Label>Languages Spoken</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('languages_spoken', newLanguage, setNewLanguage))}
                placeholder="Add language"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('languages_spoken', newLanguage, setNewLanguage)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.settlement_data.languages_spoken.map(language => (
                <span
                  key={language}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {language}
                  <button
                    type="button"
                    onClick={() => removeFromList('languages_spoken', language)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Religions</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newReligion}
                onChange={(e) => setNewReligion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('religions', newReligion, setNewReligion))}
                placeholder="Add religion"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('religions', newReligion, setNewReligion)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.settlement_data.religions.map(religion => (
                <span
                  key={religion}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                >
                  {religion}
                  <button
                    type="button"
                    onClick={() => removeFromList('religions', religion)}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Festivals</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newFestival}
                onChange={(e) => setNewFestival(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('festivals', newFestival, setNewFestival))}
                placeholder="Add festival"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('festivals', newFestival, setNewFestival)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.settlement_data.festivals.map(festival => (
                <span
                  key={festival}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
                >
                  {festival}
                  <button
                    type="button"
                    onClick={() => removeFromList('festivals', festival)}
                    className="ml-2 text-pink-600 hover:text-pink-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notable Features */}
      <Card>
        <CardHeader>
          <CardTitle>Notable Features & Nearby Settlements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Notable Features</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('notable_features', newFeature, setNewFeature))}
                placeholder="Add notable feature"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('notable_features', newFeature, setNewFeature)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.settlement_data.notable_features.map(feature => (
                <span
                  key={feature}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFromList('notable_features', feature)}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nearby Settlements</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSettlement}
                onChange={(e) => setNewSettlement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('nearby_settlements', newSettlement, setNewSettlement))}
                placeholder="Add nearby settlement"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('nearby_settlements', newSettlement, setNewSettlement)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.settlement_data.nearby_settlements.map(settlement => (
                <span
                  key={settlement}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
                >
                  {settlement}
                  <button
                    type="button"
                    onClick={() => removeFromList('nearby_settlements', settlement)}
                    className="ml-2 text-teal-600 hover:text-teal-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              placeholder="Detailed description of the settlement..."
            />
          </div>

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
              placeholder="Additional information for sidebar"
            />
          </div>

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
        </CardContent>
      </Card>

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
          {isLoading ? 'Saving...' : (article ? 'Update Settlement' : 'Create Settlement')}
        </Button>
      </div>
    </form>
  );
}