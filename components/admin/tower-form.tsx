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
import { createTower, updateTower } from '@/app/(admin)/admin/(dashboard)/towers/actions'
import type { Tower, Area, Developer, Agent } from '@/lib/database.types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ImageUploader } from '@/components/admin/image-uploader'
import { JsonArrayInput } from '@/components/admin/json-array-input'
import { StringArrayInput } from '@/components/admin/string-array-input'
import { AmenitySelector } from '@/components/admin/amenity-selector'

import { LocationPicker } from '@/components/admin/location-picker'
import { FileUploader } from '@/components/admin/file-uploader'
import { MediaListInput } from '@/components/admin/media-list-input'

interface TowerFormProps {
  tower?: Tower
  areas: Area[]
  developers: Developer[]
  agents: Agent[]
  isAdmin: boolean
  currentAgentId?: string | null
  initialAmenityIds?: string[]
}

export function TowerForm({ tower, areas, developers, agents, isAdmin, currentAgentId, initialAmenityIds = [] }: TowerFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [featured, setFeatured] = useState(tower?.featured || false)
  const [isOffPlan, setIsOffPlan] = useState(tower?.is_off_plan || false)
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>(initialAmenityIds)
  const isEditing = !!tower

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('featured', featured.toString())
    formData.set('is_off_plan', isOffPlan.toString())
    formData.set('amenity_ids', JSON.stringify(selectedAmenityIds))
    
    const result = isEditing
      ? await updateTower(tower.id, formData)
      : await createTower(formData)

    setIsLoading(false)

    if (result.success) {
      toast.success(isEditing ? 'Tower updated' : 'Tower created')
      router.push('/admin/towers')
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/towers">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Tower' : 'Add Tower'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update tower information' : 'Create a new tower/building'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      defaultValue={tower?.name}
                      required
                      onChange={(e) => {
                        if (!isEditing) {
                          const slugInput = document.getElementById('slug') as HTMLInputElement
                          if (slugInput) slugInput.value = generateSlug(e.target.value)
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_fa">Name (Persian)</Label>
                    <Input id="name_fa" name="name_fa" defaultValue={tower?.name_fa || ''} dir="rtl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" name="slug" defaultValue={tower?.slug} required />
                </div>

                <ImageUploader
                  bucket="media"
                  folder={`towers/${tower?.slug || 'new'}`}
                  initialImages={[
                    ...(tower?.cover_image_url ? [tower.cover_image_url] : []),
                    ...((tower?.gallery || []).filter((g) => g !== tower?.cover_image_url))
                  ]}
                  label="Photos (first image = cover)"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="short_description">Short Description (EN)</Label>
                    <Textarea id="short_description" name="short_description" defaultValue={tower?.short_description || ''} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="short_description_fa">Short Description (FA)</Label>
                    <Textarea id="short_description_fa" name="short_description_fa" defaultValue={tower?.short_description_fa || ''} rows={3} dir="rtl" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_description">Full Description (EN)</Label>
                    <Textarea id="full_description" name="full_description" defaultValue={tower?.full_description || ''} rows={5} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full_description_fa">Full Description (FA)</Label>
                    <Textarea id="full_description_fa" name="full_description_fa" defaultValue={tower?.full_description_fa || ''} rows={5} dir="rtl" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="highlights">Project Highlights (EN)</Label>
                    <Input id="highlights" name="highlights" defaultValue={(tower as any)?.highlights || ''} placeholder="LUXURY LIVING..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="highlights_fa">Project Highlights (FA)</Label>
                    <Input id="highlights_fa" name="highlights_fa" defaultValue={(tower as any)?.highlights_fa || ''} dir="rtl" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="architectural_details">Architectural Details (EN)</Label>
                    <Textarea id="architectural_details" name="architectural_details" defaultValue={(tower as any)?.architectural_details || ''} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="architectural_details_fa">Architectural Details (FA)</Label>
                    <Textarea id="architectural_details_fa" name="architectural_details_fa" defaultValue={(tower as any)?.architectural_details_fa || ''} rows={3} dir="rtl" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="investment_potential">Investment Potential (EN)</Label>
                    <Textarea id="investment_potential" name="investment_potential" defaultValue={(tower as any)?.investment_potential || ''} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="investment_potential_fa">Investment Potential (FA)</Label>
                    <Textarea id="investment_potential_fa" name="investment_potential_fa" defaultValue={(tower as any)?.investment_potential_fa || ''} rows={3} dir="rtl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="starting_price">Starting Price</Label>
                    <Input id="starting_price" name="starting_price" type="number" defaultValue={tower?.starting_price || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select name="currency" defaultValue={tower?.currency || 'AED'}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">AED</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total_units">Total Units</Label>
                    <Input id="total_units" name="total_units" type="number" defaultValue={tower?.total_units || ''} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="floors_count">Floors</Label>
                    <Input id="floors_count" name="floors_count" type="number" defaultValue={tower?.floors_count || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery_date">Delivery Date</Label>
                    <Input id="delivery_date" name="delivery_date" defaultValue={tower?.delivery_date || ''} placeholder="Q4 2025" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment_plan">Payment Plan (EN)</Label>
                    <Textarea id="payment_plan" name="payment_plan" defaultValue={tower?.payment_plan || ''} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment_plan_fa">Payment Plan (FA)</Label>
                    <Textarea id="payment_plan_fa" name="payment_plan_fa" defaultValue={tower?.payment_plan_fa || ''} rows={2} dir="rtl" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <JsonArrayInput
                    name="payment_plan_details"
                    label="Payment Plan Details (EN)"
                    initialValue={tower?.payment_plan_details || []}
                    fields={[
                      { name: 'phase', label: 'Phase (e.g. On Booking)' },
                      { name: 'percent', label: 'Percent (e.g. 20)', type: 'number' }
                    ]}
                  />
                  <JsonArrayInput
                    name="payment_plan_details_fa"
                    label="Payment Plan Details (FA)"
                    initialValue={tower?.payment_plan_details_fa || []}
                    fields={[
                      { name: 'phase', label: 'Phase (e.g. زمان رزرو)' },
                      { name: 'percent', label: 'Percent (e.g. 20)', type: 'number' }
                    ]}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="is_off_plan" checked={isOffPlan} onCheckedChange={(c) => setIsOffPlan(c === true)} />
                  <Label htmlFor="is_off_plan">Off Plan Project</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address (EN)</Label>
                    <Input id="address" name="address" defaultValue={tower?.address || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address_fa">Address (FA)</Label>
                    <Input id="address_fa" name="address_fa" defaultValue={tower?.address_fa || ''} dir="rtl" />
                  </div>
                </div>
                <LocationPicker 
                  initialLat={tower?.latitude || 25.2048} 
                  initialLng={tower?.longitude || 55.2708} 
                />

                <div className="grid grid-cols-2 gap-4">
                  <JsonArrayInput
                    name="connectivity"
                    label="Connectivity (EN)"
                    initialValue={tower?.connectivity || []}
                    fields={[
                      { name: 'location', label: 'Location (e.g. Dubai Mall)' },
                      { name: 'time', label: 'Time (e.g. 10 mins)' }
                    ]}
                  />
                  <JsonArrayInput
                    name="connectivity_fa"
                    label="Connectivity (FA)"
                    initialValue={tower?.connectivity_fa || []}
                    fields={[
                      { name: 'location', label: 'Location (e.g. دبی مال)' },
                      { name: 'time', label: 'Time (e.g. ۱۰ دقیقه)' }
                    ]}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media & Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Main Documents</Label>
                    <FileUploader
                      bucket="media"
                      folder={`towers/${tower?.slug || 'new'}/documents`}
                      initialUrl={tower?.brochure_url || ''}
                      name="brochure_url"
                      label="Brochure (PDF)"
                      accept=".pdf"
                      placeholder="Upload Brochure"
                    />
                    <FileUploader
                      bucket="media"
                      folder={`towers/${tower?.slug || 'new'}/documents`}
                      initialUrl={tower?.floor_plan_url || ''}
                      name="floor_plan_url"
                      label="Floor Plan (PDF/Image)"
                      accept=".pdf,image/*"
                      placeholder="Upload Floor Plan"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label>Video & Tours</Label>
                    <div className="space-y-2">
                      <Label htmlFor="video_url">Video URL (YouTube/Vimeo)</Label>
                      <Input id="video_url" name="video_url" defaultValue={tower?.video_url || ''} placeholder="https://..." />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <MediaListInput
                    name="additional_media"
                    label="Additional Media & Links"
                    bucket="media"
                    folder={`towers/${tower?.slug || 'new'}/additional`}
                    initialValue={(tower as any)?.additional_media || []}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features & FAQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Amenities</Label>
                  <AmenitySelector
                    selectedIds={selectedAmenityIds}
                    onChange={setSelectedAmenityIds}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <JsonArrayInput
                    name="faq"
                    label="FAQ (EN)"
                    initialValue={tower?.faq || []}
                    fields={[
                      { name: 'question', label: 'Question' },
                      { name: 'answer', label: 'Answer' }
                    ]}
                  />
                  <JsonArrayInput
                    name="faq_fa"
                    label="FAQ (FA)"
                    initialValue={tower?.faq_fa || []}
                    fields={[
                      { name: 'question', label: 'Question (FA)' },
                      { name: 'answer', label: 'Answer (FA)' }
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={tower?.status || 'draft'}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" checked={featured} onCheckedChange={(c) => setFeatured(c === true)} />
                  <Label htmlFor="featured">Featured Tower</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input id="sort_order" name="sort_order" type="number" defaultValue={tower?.sort_order || 0} min={0} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="area_id">Area</Label>
                  <Select name="area_id" defaultValue={tower?.area_id || 'none'}>
                    <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Area</SelectItem>
                      {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="developer_id">Developer</Label>
                  <Select name="developer_id" defaultValue={tower?.developer_id || 'none'}>
                    <SelectTrigger><SelectValue placeholder="Select developer" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Developer</SelectItem>
                      {developers.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isAdmin ? (
                  <div className="space-y-2">
                    <Label htmlFor="assigned_agent_id">Assigned Agent</Label>
                    <Select name="assigned_agent_id" defaultValue={tower?.assigned_agent_id || 'none'}>
                      <SelectTrigger><SelectValue placeholder="Select agent" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Agent</SelectItem>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <input type="hidden" name="assigned_agent_id" value={tower?.assigned_agent_id || currentAgentId || ''} />
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading && <Spinner className="mr-2" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/towers">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
