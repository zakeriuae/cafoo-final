'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapContent = dynamic(() => import('./map-content'), { 
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400">Loading Map...</div>
})

interface LocationPickerProps {
  initialLat?: number
  initialLng?: number
  label?: string
}

export function LocationPicker({
  initialLat = 25.2048, // Dubai Default
  initialLng = 55.2708,
  label = 'Location'
}: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setPosition([initialLat, initialLng])
  }, [initialLat, initialLng])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <div className="h-[300px] w-full rounded-lg overflow-hidden border bg-slate-50">
        <MapContent position={position} setPosition={setPosition} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input 
            id="latitude" 
            name="latitude" 
            type="number" 
            step="any" 
            value={position[0]} 
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              if (!isNaN(val)) setPosition([val, position[1]])
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input 
            id="longitude" 
            name="longitude" 
            type="number" 
            step="any" 
            value={position[1]} 
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              if (!isNaN(val)) setPosition([position[0], val])
            }}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Click on the map to set the exact location.</p>
    </div>
  )
}
