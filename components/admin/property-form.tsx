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
import { createProperty, updateProperty } from '@/app/(admin)/admin/properties/actions'
import type { Property, Area, Tower, Developer, Agent } from '@/lib/database.types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PropertyFormProps {
  property?: Property
  areas: Area[]
  towers: Tower[]
  developers: Developer[]
  agents: Agent[]
  isAdmin: boolean
  currentAgentId?: string | null
}

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'studio', label: 'Studio' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'office', label: 'Office' },
  { value: 'retail', label: 'Retail' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'land', label: 'Land' },
  { value: 'hotel_apartment', label: 'Hotel Apartment' },
]

const furnishingOptions = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi_furnished', label: 'Semi Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
]

export function PropertyForm({ property, areas, towers, developers, agents, isAdmin, currentAgentId }: PropertyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [featured, setFeatured] = useState(property?.featured || false)
  const [verified, setVerified] = useState(property?.verified || false)
  const [isOffPlan, setIsOffPlan] = useState(property?.is_off_plan || false)
  const [isVacant, setIsVacant] = useState(property?.is_vacant ?? true)
  const [balcony, setBalcony] = useState(property?.balcony || false)
  const isEditing = !!property

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('featured', featured.toString())
    formData.set('verified', verified.toString())
    formData.set('is_off_plan', isOffPlan.toString())
    formData.set('is_vacant', isVacant.toString())
    formData.set('balcony', balcony.toString())
    
    const result = isEditing
      ? await updateProperty(property.id, formData)
      : await createProperty(formData)

    setIsLoading(false)

    if (result.success) {
      toast.success(isEditing ? 'Property updated' : 'Property created')
      router.push('/admin/properties')
    } else {
      toast.error(result.error || 'Something went wrong')
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/properties">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Property' : 'Add Property'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update property information' : 'Create a new property listing'}
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
                    <Label htmlFor="title">Title (English) *</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={property?.title}
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
                    <Label htmlFor="title_fa">Title (Persian)</Label>
                    <Input
                      id="title_fa"
                      name="title_fa"
                      defaultValue={property?.title_fa || ''}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      name="slug"
                      defaultValue={property?.slug}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ad_code">Ad Code</Label>
                    <Input
                      id="ad_code"
                      name="ad_code"
                      defaultValue={property?.ad_code || ''}
                      placeholder="CAF-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="listing_type">Listing Type *</Label>
                    <Select name="listing_type" defaultValue={property?.listing_type || 'sale'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="off_plan">Off Plan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property_type">Property Type *</Label>
                    <Select name="property_type" defaultValue={property?.property_type || 'apartment'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select name="status" defaultValue={property?.status || 'available'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="off_market">Off Market</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover_image_url">Cover Image URL</Label>
                  <Input
                    id="cover_image_url"
                    name="cover_image_url"
                    defaultValue={property?.cover_image_url || ''}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      defaultValue={property?.price || ''}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select name="currency" defaultValue={property?.currency || 'AED'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">AED</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_per_sqft">Price/sqft</Label>
                    <Input
                      id="price_per_sqft"
                      name="price_per_sqft"
                      type="number"
                      defaultValue={property?.price_per_sqft || ''}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service_charge">Service Charge</Label>
                  <Input
                    id="service_charge"
                    name="service_charge"
                    type="number"
                    defaultValue={property?.service_charge || ''}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      defaultValue={property?.bedrooms || ''}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      defaultValue={property?.bathrooms || ''}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      name="size"
                      type="number"
                      defaultValue={property?.size || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size_unit">Unit</Label>
                    <Select name="size_unit" defaultValue={property?.size_unit || 'sqft'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqft">sqft</SelectItem>
                        <SelectItem value="sqm">sqm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="floor">Floor</Label>
                    <Input
                      id="floor"
                      name="floor"
                      type="number"
                      defaultValue={property?.floor || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total_floors">Total Floors</Label>
                    <Input
                      id="total_floors"
                      name="total_floors"
                      type="number"
                      defaultValue={property?.total_floors || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parking_spaces">Parking</Label>
                    <Input
                      id="parking_spaces"
                      name="parking_spaces"
                      type="number"
                      defaultValue={property?.parking_spaces || 0}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="furnishing">Furnishing</Label>
                    <Select name="furnishing" defaultValue={property?.furnishing || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {furnishingOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="balcony"
                      checked={balcony}
                      onCheckedChange={(checked) => setBalcony(checked === true)}
                    />
                    <Label htmlFor="balcony">Balcony</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_vacant"
                      checked={isVacant}
                      onCheckedChange={(checked) => setIsVacant(checked === true)}
                    />
                    <Label htmlFor="is_vacant">Vacant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_off_plan"
                      checked={isOffPlan}
                      onCheckedChange={(checked) => setIsOffPlan(checked === true)}
                    />
                    <Label htmlFor="is_off_plan">Off Plan</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="view_type">View Type (English)</Label>
                    <Input
                      id="view_type"
                      name="view_type"
                      defaultValue={property?.view_type || ''}
                      placeholder="Sea View, City View..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="view_type_fa">View Type (Persian)</Label>
                    <Input
                      id="view_type_fa"
                      name="view_type_fa"
                      defaultValue={property?.view_type_fa || ''}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handover_date">Handover Date</Label>
                  <Input
                    id="handover_date"
                    name="handover_date"
                    defaultValue={property?.handover_date || ''}
                    placeholder="Q4 2025"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="short_description">Short Description (EN)</Label>
                    <Textarea
                      id="short_description"
                      name="short_description"
                      defaultValue={property?.short_description || ''}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="short_description_fa">Short Description (FA)</Label>
                    <Textarea
                      id="short_description_fa"
                      name="short_description_fa"
                      defaultValue={property?.short_description_fa || ''}
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_description">Full Description (EN)</Label>
                    <Textarea
                      id="full_description"
                      name="full_description"
                      defaultValue={property?.full_description || ''}
                      rows={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full_description_fa">Full Description (FA)</Label>
                    <Textarea
                      id="full_description_fa"
                      name="full_description_fa"
                      defaultValue={property?.full_description_fa || ''}
                      rows={6}
                      dir="rtl"
                    />
                  </div>
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
                    <Label htmlFor="address">Address (English)</Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue={property?.address || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address_fa">Address (Persian)</Label>
                    <Input
                      id="address_fa"
                      name="address_fa"
                      defaultValue={property?.address_fa || ''}
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      defaultValue={property?.latitude || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      defaultValue={property?.longitude || ''}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    name="video_url"
                    defaultValue={property?.video_url || ''}
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor_plan_url">Floor Plan URL</Label>
                  <Input
                    id="floor_plan_url"
                    name="floor_plan_url"
                    defaultValue={property?.floor_plan_url || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="virtual_tour_url">Virtual Tour URL</Label>
                  <Input
                    id="virtual_tour_url"
                    name="virtual_tour_url"
                    defaultValue={property?.virtual_tour_url || ''}
                  />
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
                      defaultValue={property?.seo_title || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo_title_fa">SEO Title (Persian)</Label>
                    <Input
                      id="seo_title_fa"
                      name="seo_title_fa"
                      defaultValue={property?.seo_title_fa || ''}
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seo_description">SEO Description (EN)</Label>
                    <Textarea
                      id="seo_description"
                      name="seo_description"
                      defaultValue={property?.seo_description || ''}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo_description_fa">SEO Description (FA)</Label>
                    <Textarea
                      id="seo_description_fa"
                      name="seo_description_fa"
                      defaultValue={property?.seo_description_fa || ''}
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
                  <Label htmlFor="content_status">Status</Label>
                  <Select name="content_status" defaultValue={property?.content_status || 'draft'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={featured}
                    onCheckedChange={(checked) => setFeatured(checked === true)}
                  />
                  <Label htmlFor="featured">Featured Property</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={verified}
                    onCheckedChange={(checked) => setVerified(checked === true)}
                  />
                  <Label htmlFor="verified">Verified</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    defaultValue={property?.sort_order || 0}
                    min={0}
                  />
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
                  <Select name="area_id" defaultValue={property?.area_id || 'none'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Area</SelectItem>
                      {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tower_id">Tower</Label>
                  <Select name="tower_id" defaultValue={property?.tower_id || 'none'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tower" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Tower</SelectItem>
                      {towers.map((tower) => (
                        <SelectItem key={tower.id} value={tower.id}>
                          {tower.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="developer_id">Developer</Label>
                  <Select name="developer_id" defaultValue={property?.developer_id || 'none'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select developer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Developer</SelectItem>
                      {developers.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id}>
                          {dev.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isAdmin ? (
                  <div className="space-y-2">
                    <Label htmlFor="agent_id">Agent</Label>
                    <Select name="agent_id" defaultValue={property?.agent_id || 'none'}>
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
                ) : (
                  <input type="hidden" name="agent_id" value={property?.agent_id || currentAgentId || ''} />
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading && <Spinner className="mr-2" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/properties">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
