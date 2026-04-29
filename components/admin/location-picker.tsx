'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import 'leaflet/dist/leaflet.css'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const useMapEvents = dynamic(() => import('react-leaflet').then(mod => mod.useMapEvents), { ssr: false })

// Helper component to handle click events
function LocationMarker({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) {
  // @ts-ignore
  const map = useMapEvents({
    click(e: any) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })

  return position ? (
    // @ts-ignore
    <Marker position={position} />
  ) : null
}

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
  const [L, setL] = useState<any>(null)

  // Load Leaflet and fix default icon issue
  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet)
      // @ts-ignore
      delete leaflet.Icon.Default.prototype._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
    })
  }, [])

  if (!L) return <div>Loading Map...</div>

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <div className="h-[300px] w-full rounded-lg overflow-hidden border">
        {/* @ts-ignore */}
        <MapContainer 
          center={position} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
        >
          {/* @ts-ignore */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
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
            onChange={(e) => setPosition([parseFloat(e.target.value), position[1]])}
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
            onChange={(e) => setPosition([position[0], parseFloat(e.target.value)])}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Click on the map to set the exact location.</p>
    </div>
  )
}
