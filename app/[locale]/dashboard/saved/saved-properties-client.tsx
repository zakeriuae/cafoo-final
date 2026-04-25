"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Bed, Bath, Maximize, MapPin, Trash2, ExternalLink } from "lucide-react"
import { AedSymbol } from "@/components/ui/aed-symbol"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SavedProperty {
  id: string
  created_at: string
  property: {
    id: string
    title: string
    title_fa: string | null
    slug: string
    price: number
    bedrooms: number | null
    bathrooms: number | null
    area_sqft: number | null
    cover_image_url: string | null
    property_type: string
    listing_type: string
    area: { name: string; slug: string } | null
  } | null
}

interface SavedPropertiesClientProps {
  savedProperties: SavedProperty[]
}

export function SavedPropertiesClient({ savedProperties: initialProperties }: SavedPropertiesClientProps) {
  const router = useRouter()
  const [properties, setProperties] = useState(initialProperties)
  const [removing, setRemoving] = useState<string | null>(null)

  const handleRemove = async (savedId: string) => {
    setRemoving(savedId)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("saved_properties")
      .delete()
      .eq("id", savedId)

    if (!error) {
      setProperties(properties.filter((p) => p.id !== savedId))
    }
    
    setRemoving(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Saved Properties</h1>
        <p className="text-muted-foreground">
          Properties you&apos;ve saved for later viewing
        </p>
      </div>

      {properties.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((item) => {
            const property = item.property
            if (!property) return null

            return (
              <Card key={item.id} className="overflow-hidden group">
                <div className="relative aspect-video">
                  {property.cover_image_url ? (
                    <img
                      src={property.cover_image_url}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-2">
                    <Badge variant="secondary" className="bg-white/90">
                      {property.listing_type === "sale" ? "For Sale" : "For Rent"}
                    </Badge>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={removing === item.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove from saved?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this property from your saved list?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemove(item.id)}>
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold truncate">{property.title}</h3>
                    {property.area && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.area.name}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    {property.bedrooms && (
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {property.bedrooms}
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {property.bathrooms}
                      </span>
                    )}
                    {property.area_sqft && (
                      <span className="flex items-center gap-1">
                        <Maximize className="h-4 w-4" />
                        {property.area_sqft.toLocaleString()} sqft
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="font-bold text-primary flex items-center gap-1">
                      <AedSymbol size={16} /> {property.price.toLocaleString()}
                      {property.listing_type === "rent" && (
                        <span className="text-xs font-normal text-muted-foreground">/year</span>
                      )}
                    </p>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/properties/${property.slug}`}>
                        View
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <CardTitle className="mb-2">No saved properties</CardTitle>
            <CardDescription className="text-center mb-4">
              Start browsing and save properties you like to see them here.
            </CardDescription>
            <Button asChild>
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
