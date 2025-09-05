import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCurrentUser } from '@/lib/user-context'
import type { ProjectCreate, ProjectUpdate } from '@/types/project'

interface ProjectFormProps {
  onSubmit: (data: ProjectCreate | ProjectUpdate) => void
  onCancel: () => void
  initialData?: { name: string; description: string }
  mode?: 'create' | 'edit'
}

export function ProjectForm({ onSubmit, onCancel, initialData, mode = 'create' }: ProjectFormProps) {
  const { currentUser } = useCurrentUser()
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !currentUser) return

    setIsSubmitting(true)
    try {
      const submitData = mode === 'create' 
        ? { name: name.trim(), description: description.trim() || null, user_id: currentUser.id }
        : { name: name.trim(), description: description.trim() || null }
      await onSubmit(submitData)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading user information...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter project name..."
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project..."
          rows={3}
        />
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Project owner: <strong>{currentUser.full_name || currentUser.username}</strong>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={!name.trim() || isSubmitting}>
          {isSubmitting ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create Project' : 'Update Project')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}