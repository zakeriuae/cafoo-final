'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { createArea, updateArea } from '@/app/(admin)/admin/(dashboard)/areas/actions'
import type { Area, Agent } from '@/lib/database.types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ImageUploader } from '@/components/admin/image-uploader'

interface AreaFormProps {
  area?: Area
  agents: Agent[]
  isAdmin: boolean
  currentAgentId?: string | null
}

export function AreaForm({ area, agents, isAdmin, currentAgentId }: AreaFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [featured, setFeatured] = useState(area?.featured || false)
  const isEditing = !!area

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('featured', featured.toString())
    
    const result = isEditing
      ? await updateArea(area.id, formData)
      : await createArea(formData)

    setIsLoading(false)

    if (result.success) {
      toast.success(isEditing ? 'Area updated' : 'Area created')
      router.push('/admin/areas')
    } else {
      toast.error(result.error || 'Something went wrong')
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/areas">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Area' : 'Add Area'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update area information' : 'Create a new area'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (English) *</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={area?.name}
                      required
                      onChange={(e) => {
                        if (!isEditing) {
                          const slugInput = document.getElementById('slug') as HTMLInputElement
                          if (slugInput) {
                            slugInput.value = generateSlug(e.target.value)
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_fa">Name (Persian)</Label>
                    <Input
                      id="name_fa"
                      name="name_fa"
                      defaultValue={area?.name_fa || ''}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={area?.slug}
                    required
                  />
                </div>

                <ImageUploader
                  bucket="media"
                  folder={`areas/${area?.slug || 'new'}`}
                  initialImages={[
                    ...(area?.cover_image_url ? [area.cover_image_url] : []),
                    ...((area?.gallery || []).filter((g) => g !== area?.cover_image_url))
                  ]}
                  label="Photos (first image = cover)"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="short_description">Short Description (English)</Label>
                    <Textarea
                      id="short_description"
                      name="short_description"
                      defaultValue={area?.short_description || ''}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="short_description_fa">Short Description (Persian)</Label>
                    <Textarea
                      id="short_description_fa"
                      name="short_description_fa"
                      defaultValue={area?.short_description_fa || ''}
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_description">Full Description (English)</Label>
                    <Textarea
                      id="full_description"
                      name="full_description"
                      defaultValue={area?.full_description || ''}
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full_description_fa">Full Description (Persian)</Label>
                    <Textarea
                      id="full_description_fa"
                      name="full_description_fa"
                      defaultValue={area?.full_description_fa || ''}
                      rows={5}
                      dir="rtl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      defaultValue={area?.latitude || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      defaultValue={area?.longitude || ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="average_price">Average Price (AED)</Label>
                    <Input
                      id="average_price"
                      name="average_price"
                      type="number"
                      defaultValue={area?.average_price || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_growth_percent">Price Growth (%)</Label>
                    <Input
                      id="price_growth_percent"
                      name="price_growth_percent"
                      type="number"
                      step="0.1"
                      defaultValue={area?.price_growth_percent || ''}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seo_title">SEO Title (English)</Label>
                    <Input
                      id="seo_title"
                      name="seo_title"
                      defaultValue={area?.seo_title || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo_title_fa">SEO Title (Persian)</Label>
                    <Input
                      id="seo_title_fa"
                      name="seo_title_fa"
                      defaultValue={area?.seo_title_fa || ''}
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seo_description">SEO Description (English)</Label>
                    <Textarea
                      id="seo_description"
                      name="seo_description"
                      defaultValue={area?.seo_description || ''}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo_description_fa">SEO Description (Persian)</Label>
                    <Textarea
                      id="seo_description_fa"
                      name="seo_description_fa"
                      defaultValue={area?.seo_description_fa || ''}
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={area?.status || 'draft'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={featured}
                    onCheckedChange={(checked) => setFeatured(checked === true)}
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured Area
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    defaultValue={area?.sort_order || 0}
                    min={0}
                  />
                </div>
              </CardContent>
            </Card>

            {isAdmin ? (
              <Card>
                <CardHeader>
                  <CardTitle>Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="assigned_agent_id">Assigned Agent</Label>
                    <Select 
                      name="assigned_agent_id" 
                      defaultValue={area?.assigned_agent_id || 'none'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Agent</SelectItem>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <input type="hidden" name="assigned_agent_id" value={area?.assigned_agent_id || currentAgentId || ''} />
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading && <Spinner className="mr-2" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/areas">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
