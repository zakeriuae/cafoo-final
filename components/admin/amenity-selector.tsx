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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border rounded-lg p-4 bg-muted/10">
      {amenities.map((amenity) => {
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
              <IconComponent className="w-3.5 h-3.5 text-primary" />
              <span>{amenity.name}</span>
            </Label>
          </div>
        )
      })}
      {amenities.length === 0 && (
        <div className="col-span-full text-center py-4 text-sm text-muted-foreground">
          No amenities defined yet.
        </div>
      )}
    </div>
  )
}
