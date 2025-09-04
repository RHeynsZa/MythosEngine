import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Gender, 
  LifeStatus, 
  PersonData, 
  PersonArticle,
  ImportantDate,
  Relationship
} from '../types/article';

interface PersonFormProps {
  article?: PersonArticle;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultPersonData: PersonData = {
  race: null,
  gender: null,
  age: null,
  life_status: LifeStatus.UNKNOWN,
  height: null,
  weight: null,
  eye_color: null,
  hair_color: null,
  distinguishing_marks: [],
  birthplace: null,
  current_location: null,
  occupation: null,
  social_class: null,
  birth_date: null,
  death_date: null,
  important_dates: [],
  relationships: [],
  skills: [],
  abilities: [],
  personality_traits: [],
  goals: [],
  fears: [],
  secrets: [],
  notable_possessions: [],
  wealth: null,
  organizations: [],
  titles: []
};

export function PersonForm({ 
  article, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: PersonFormProps) {
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
    person_data: article?.person_data || { ...defaultPersonData }
  });

  const [newTag, setNewTag] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newAbility, setNewAbility] = useState('');
  const [newTrait, setNewTrait] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newFear, setNewFear] = useState('');
  const [newSecret, setNewSecret] = useState('');
  const [newPossession, setNewPossession] = useState('');
  const [newOrganization, setNewOrganization] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newMark, setNewMark] = useState('');

  // Important dates form
  const [newDate, setNewDate] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');

  // Relationships form
  const [newRelationshipName, setNewRelationshipName] = useState('');
  const [newRelationshipType, setNewRelationshipType] = useState('');
  const [newRelationshipDescription, setNewRelationshipDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      project_id: article?.project_id || 1,
      article_type: 'character'
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

  const addToList = (field: keyof PersonData, value: string, setValue: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        person_data: {
          ...prev.person_data,
          [field]: [...(prev.person_data[field] as string[]), value.trim()]
        }
      }));
      setValue('');
    }
  };

  const removeFromList = (field: keyof PersonData, valueToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      person_data: {
        ...prev.person_data,
        [field]: (prev.person_data[field] as string[]).filter(item => item !== valueToRemove)
      }
    }));
  };

  const updatePersonData = (field: keyof PersonData, value: any) => {
    setFormData(prev => ({
      ...prev,
      person_data: {
        ...prev.person_data,
        [field]: value
      }
    }));
  };

  const addImportantDate = () => {
    if (newDate.trim() && newEvent.trim()) {
      const importantDate: ImportantDate = {
        date: newDate.trim(),
        event: newEvent.trim(),
        description: newEventDescription.trim() || null,
        location: newEventLocation.trim() || null
      };
      
      setFormData(prev => ({
        ...prev,
        person_data: {
          ...prev.person_data,
          important_dates: [...prev.person_data.important_dates, importantDate]
        }
      }));
      
      setNewDate('');
      setNewEvent('');
      setNewEventDescription('');
      setNewEventLocation('');
    }
  };

  const removeImportantDate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      person_data: {
        ...prev.person_data,
        important_dates: prev.person_data.important_dates.filter((_, i) => i !== index)
      }
    }));
  };

  const addRelationship = () => {
    if (newRelationshipName.trim() && newRelationshipType.trim()) {
      const relationship: Relationship = {
        person_name: newRelationshipName.trim(),
        relationship_type: newRelationshipType.trim(),
        description: newRelationshipDescription.trim() || null,
        status: 'active'
      };
      
      setFormData(prev => ({
        ...prev,
        person_data: {
          ...prev.person_data,
          relationships: [...prev.person_data.relationships, relationship]
        }
      }));
      
      setNewRelationshipName('');
      setNewRelationshipType('');
      setNewRelationshipDescription('');
    }
  };

  const removeRelationship = (index: number) => {
    setFormData(prev => ({
      ...prev,
      person_data: {
        ...prev.person_data,
        relationships: prev.person_data.relationships.filter((_, i) => i !== index)
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
              <Label htmlFor="title">Name *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter character name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="race">Race</Label>
              <Input
                id="race"
                value={formData.person_data.race || ''}
                onChange={(e) => updatePersonData('race', e.target.value || null)}
                placeholder="e.g., Human, Elf, Dwarf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.person_data.gender || ''}
                onValueChange={(value) => updatePersonData('gender', value ? value as Gender : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Not specified</SelectItem>
                  {Object.values(Gender).map(gender => (
                    <SelectItem key={gender} value={gender}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.person_data.age || ''}
                onChange={(e) => updatePersonData('age', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Enter age"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="life_status">Life Status</Label>
              <Select
                value={formData.person_data.life_status}
                onValueChange={(value) => updatePersonData('life_status', value as LifeStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select life status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(LifeStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.person_data.occupation || ''}
                onChange={(e) => updatePersonData('occupation', e.target.value || null)}
                placeholder="e.g., Knight, Merchant, Scholar"
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
              placeholder="Brief summary of the character"
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
              Add a Spotify track URL to set the mood/tone for this character. 
              Supports both web URLs and Spotify URIs.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Physical Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Physical Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={formData.person_data.height || ''}
                onChange={(e) => updatePersonData('height', e.target.value || null)}
                                  placeholder="e.g., 6'2&quot;, 1.88m, Tall"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight/Build</Label>
              <Input
                id="weight"
                value={formData.person_data.weight || ''}
                onChange={(e) => updatePersonData('weight', e.target.value || null)}
                placeholder="e.g., 180 lbs, Muscular, Slender"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eye_color">Eye Color</Label>
              <Input
                id="eye_color"
                value={formData.person_data.eye_color || ''}
                onChange={(e) => updatePersonData('eye_color', e.target.value || null)}
                placeholder="e.g., Blue, Brown, Green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hair_color">Hair Color</Label>
              <Input
                id="hair_color"
                value={formData.person_data.hair_color || ''}
                onChange={(e) => updatePersonData('hair_color', e.target.value || null)}
                placeholder="e.g., Black, Blonde, Red"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Distinguishing Marks</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newMark}
                onChange={(e) => setNewMark(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('distinguishing_marks', newMark, setNewMark))}
                placeholder="Add distinguishing mark"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('distinguishing_marks', newMark, setNewMark)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.person_data.distinguishing_marks.map(mark => (
                <span
                  key={mark}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                >
                  {mark}
                  <button
                    type="button"
                    onClick={() => removeFromList('distinguishing_marks', mark)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background */}
      <Card>
        <CardHeader>
          <CardTitle>Background</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthplace">Birthplace</Label>
              <Input
                id="birthplace"
                value={formData.person_data.birthplace || ''}
                onChange={(e) => updatePersonData('birthplace', e.target.value || null)}
                placeholder="Where they were born"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_location">Current Location</Label>
              <Input
                id="current_location"
                value={formData.person_data.current_location || ''}
                onChange={(e) => updatePersonData('current_location', e.target.value || null)}
                placeholder="Where they currently reside"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_class">Social Class</Label>
              <Input
                id="social_class"
                value={formData.person_data.social_class || ''}
                onChange={(e) => updatePersonData('social_class', e.target.value || null)}
                placeholder="e.g., Noble, Commoner, Peasant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wealth">Wealth Level</Label>
              <Select
                value={formData.person_data.wealth || ''}
                onValueChange={(value) => updatePersonData('wealth', value || null)}
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

            <div className="space-y-2">
              <Label htmlFor="birth_date">Birth Date</Label>
              <Input
                id="birth_date"
                value={formData.person_data.birth_date || ''}
                onChange={(e) => updatePersonData('birth_date', e.target.value || null)}
                placeholder="e.g., 15th of Midsummer, 1425 AC"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="death_date">Death Date</Label>
              <Input
                id="death_date"
                value={formData.person_data.death_date || ''}
                onChange={(e) => updatePersonData('death_date', e.target.value || null)}
                placeholder="If deceased"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abilities & Traits */}
      <Card>
        <CardHeader>
          <CardTitle>Abilities & Traits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('skills', newSkill, setNewSkill))}
                placeholder="Add skill"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('skills', newSkill, setNewSkill)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.person_data.skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeFromList('skills', skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Abilities</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAbility}
                onChange={(e) => setNewAbility(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('abilities', newAbility, setNewAbility))}
                placeholder="Add ability"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('abilities', newAbility, setNewAbility)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.person_data.abilities.map(ability => (
                <span
                  key={ability}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {ability}
                  <button
                    type="button"
                    onClick={() => removeFromList('abilities', ability)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Personality Traits</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTrait}
                onChange={(e) => setNewTrait(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('personality_traits', newTrait, setNewTrait))}
                placeholder="Add personality trait"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('personality_traits', newTrait, setNewTrait)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.person_data.personality_traits.map(trait => (
                <span
                  key={trait}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {trait}
                  <button
                    type="button"
                    onClick={() => removeFromList('personality_traits', trait)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Story Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Story Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Goals</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('goals', newGoal, setNewGoal))}
                placeholder="Add goal"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('goals', newGoal, setNewGoal)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.person_data.goals.map(goal => (
                <span
                  key={goal}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                >
                  {goal}
                  <button
                    type="button"
                    onClick={() => removeFromList('goals', goal)}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fears</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newFear}
                onChange={(e) => setNewFear(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('fears', newFear, setNewFear))}
                placeholder="Add fear"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('fears', newFear, setNewFear)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.person_data.fears.map(fear => (
                <span
                  key={fear}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                >
                  {fear}
                  <button
                    type="button"
                    onClick={() => removeFromList('fears', fear)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Secrets</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSecret}
                onChange={(e) => setNewSecret(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('secrets', newSecret, setNewSecret))}
                placeholder="Add secret"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('secrets', newSecret, setNewSecret)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.person_data.secrets.map(secret => (
                <span
                  key={secret}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                >
                  {secret}
                  <button
                    type="button"
                    onClick={() => removeFromList('secrets', secret)}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Important Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new_date">Date</Label>
              <Input
                id="new_date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                placeholder="e.g., 1425 AC, Summer of the Third Age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_event">Event</Label>
              <Input
                id="new_event"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                placeholder="e.g., Knighted, Graduated from Academy"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_event_location">Location</Label>
              <Input
                id="new_event_location"
                value={newEventLocation}
                onChange={(e) => setNewEventLocation(e.target.value)}
                placeholder="Where the event occurred"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_event_description">Description</Label>
              <Input
                id="new_event_description"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                placeholder="Additional details"
              />
            </div>
          </div>
          <Button type="button" onClick={addImportantDate} variant="outline">
            Add Important Date
          </Button>

          <div className="space-y-2">
            {formData.person_data.important_dates.map((date, index) => (
              <div key={index} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{date.event}</div>
                    <div className="text-sm text-gray-600">{date.date}</div>
                    {date.location && <div className="text-sm text-gray-600">Location: {date.location}</div>}
                    {date.description && <div className="text-sm text-gray-600">{date.description}</div>}
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeImportantDate(index)}
                    variant="outline"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Relationships */}
      <Card>
        <CardHeader>
          <CardTitle>Relationships</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new_relationship_name">Person Name</Label>
              <Input
                id="new_relationship_name"
                value={newRelationshipName}
                onChange={(e) => setNewRelationshipName(e.target.value)}
                placeholder="Name of the related person"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_relationship_type">Relationship Type</Label>
              <Input
                id="new_relationship_type"
                value={newRelationshipType}
                onChange={(e) => setNewRelationshipType(e.target.value)}
                placeholder="e.g., Father, Friend, Enemy, Mentor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_relationship_description">Description</Label>
              <Input
                id="new_relationship_description"
                value={newRelationshipDescription}
                onChange={(e) => setNewRelationshipDescription(e.target.value)}
                placeholder="Additional details"
              />
            </div>
          </div>
          <Button type="button" onClick={addRelationship} variant="outline">
            Add Relationship
          </Button>

          <div className="space-y-2">
            {formData.person_data.relationships.map((relationship, index) => (
              <div key={index} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{relationship.person_name}</div>
                    <div className="text-sm text-gray-600">{relationship.relationship_type}</div>
                    {relationship.description && <div className="text-sm text-gray-600">{relationship.description}</div>}
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeRelationship(index)}
                    variant="outline"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Possessions & Affiliations */}
      <Card>
        <CardHeader>
          <CardTitle>Possessions & Affiliations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Notable Possessions</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newPossession}
                onChange={(e) => setNewPossession(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('notable_possessions', newPossession, setNewPossession))}
                placeholder="Add notable possession"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('notable_possessions', newPossession, setNewPossession)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.person_data.notable_possessions.map(possession => (
                <span
                  key={possession}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                >
                  {possession}
                  <button
                    type="button"
                    onClick={() => removeFromList('notable_possessions', possession)}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Organizations</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newOrganization}
                onChange={(e) => setNewOrganization(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('organizations', newOrganization, setNewOrganization))}
                placeholder="Add organization"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('organizations', newOrganization, setNewOrganization)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.person_data.organizations.map(organization => (
                <span
                  key={organization}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
                >
                  {organization}
                  <button
                    type="button"
                    onClick={() => removeFromList('organizations', organization)}
                    className="ml-2 text-teal-600 hover:text-teal-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Titles</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('titles', newTitle, setNewTitle))}
                placeholder="Add title"
                className="flex-1"
              />
              <Button type="button" onClick={() => addToList('titles', newTitle, setNewTitle)} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.person_data.titles.map(title => (
                <span
                  key={title}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
                >
                  {title}
                  <button
                    type="button"
                    onClick={() => removeFromList('titles', title)}
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
              placeholder="Detailed description of the character..."
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
          {isLoading ? 'Saving...' : (article ? 'Update Character' : 'Create Character')}
        </Button>
      </div>
    </form>
  );
}