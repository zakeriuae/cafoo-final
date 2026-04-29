'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { createAmenity, updateAmenity } from '@/app/(admin)/admin/(dashboard)/amenities/actions'
import type { Amenity } from '@/lib/database.types'
import { ArrowLeft, Waves, Dumbbell, ShieldCheck, Car, Wind, Layout, Baby, Check, Sparkles, Coffee, TreePine, Tv, Wifi, Utensils, Bath, Bike, Camera } from 'lucide-react'
import Link from 'next/link'

interface AmenityFormProps {
  amenity?: Amenity
}

const ICON_OPTIONS = [
  { name: 'Waves', icon: Waves },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Car', icon: Car },
  { name: 'Wind', icon: Wind },
  { name: 'Layout', icon: Layout },
  { name: 'Baby', icon: Baby },
  { name: 'Check', icon: Check },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Coffee', icon: Coffee },
  { name: 'TreePine', icon: TreePine },
  { name: 'Tv', icon: Tv },
  { name: 'Wifi', icon: Wifi },
  { name: 'Utensils', icon: Utensils },
  { name: 'Bath', icon: Bath },
  { name: 'Bike', icon: Bike },
  { name: 'Camera', icon: Camera },
]

export function AmenityForm({ amenity }: AmenityFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState(amenity?.icon || 'Check')
  const isEditing = !!amenity

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('icon', selectedIcon)
    
    const result = isEditing
      ? await updateAmenity(amenity.id, formData)
      : await createAmenity(formData)

    setIsLoading(false)

    if (result.success) {
      toast.success(isEditing ? 'Amenity updated' : 'Amenity created')
      router.push('/admin/amenities')
    } else {
      toast.error(result.error || 'Something went wrong')
    }
  }

  const SelectedIconComponent = ICON_OPTIONS.find(i => i.name === selectedIcon)?.icon || Check

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/amenities">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Amenity' : 'Add Amenity'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update amenity information' : 'Create a new amenity'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Amenity Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (English) *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={amenity?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_fa">Name (Persian)</Label>
                <Input id="name_fa" name="name_fa" defaultValue={amenity?.name_fa || ''} dir="rtl" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={amenity?.category || ''} placeholder="e.g. Leisure, Fitness" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input id="sort_order" name="sort_order" type="number" defaultValue={amenity?.sort_order || 0} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border">
                  <SelectedIconComponent className="w-6 h-6" />
                </div>
                <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((item) => (
                      <SelectItem key={item.name} value={item.name}>
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading && <Spinner className="mr-2" />}
            {isEditing ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/amenities">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
