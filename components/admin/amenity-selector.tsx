'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Amenity } from '@/lib/database.types'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import * as Icons from 'lucide-react'

interface AmenitySelectorProps {
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function AmenitySelector({ selectedIds, onChange }: AmenitySelectorProps) {
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAmenities() {
      const supabase = createClient()
      const { data } = await supabase
        .from('amenities')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (data) setAmenities(data)
      setIsLoading(false)
    }
    fetchAmenities()
  }, [])

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading amenities...</div>

  const groupedAmenities = amenities.reduce((acc, amenity) => {
    const category = amenity.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(amenity)
    return acc
  }, {} as Record<string, Amenity[]>)

  return (
    <div className="space-y-6 border rounded-lg p-4 bg-muted/10 max-h-[600px] overflow-y-auto">
      {Object.entries(groupedAmenities).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b pb-1">
            {category}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {items.map((amenity) => {
              // @ts-ignore
              const IconComponent = Icons[amenity.icon] || Icons.Check
              
              return (
                <div key={amenity.id} className="flex items-center space-x-3 bg-background p-2 rounded-md border shadow-sm hover:border-primary/30 transition-colors">
                  <Checkbox
                    id={`amenity-${amenity.id}`}
                    checked={selectedIds.includes(amenity.id)}
                    onCheckedChange={() => handleToggle(amenity.id)}
                  />
                  <Label
                    htmlFor={`amenity-${amenity.id}`}
                    className="flex items-center gap-2 cursor-pointer flex-1 text-xs font-medium"
                  >
                    <IconComponent className="w-4 h-4 text-primary" />
                    <span>{amenity.name}</span>
                  </Label>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      {amenities.length === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No amenities defined yet.
        </div>
      )}
    </div>
  )
}
