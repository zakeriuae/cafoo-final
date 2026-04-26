import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Maximize, Heart, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { AedSymbol } from "@/components/ui/aed-symbol"

interface PropertyCardProps {
  property: any; // We will use any for now, or define a strict interface
  locale: string;
  content: any; // i18n content
  propertyUrl: string;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  className?: string;
  viewMode?: "grid" | "list";
  hideLabels?: boolean;
}

export function PropertyCard({ 
  property, 
  locale, 
  content, 
  propertyUrl, 
  isFavorite = false,
  onToggleFavorite,
  className,
  viewMode = "grid",
  hideLabels = false
}: PropertyCardProps) {
  // Extract common fields depending on dummy data vs db data
  const title = property.title_fa && locale === 'fa' ? property.title_fa : (property.title[locale] || property.title);
  const areaName = property.area 
    ? (locale === 'fa' && property.area.name_fa ? property.area.name_fa : property.area.name)
    : (property.location ? property.location[locale] : property.location);
  
  const price = property.price?.toLocaleString?.() || property.price;
  const pricePerSqft = property.pricePerSqft || (property.price && property.size ? Math.round(property.price / property.size).toLocaleString() : null);
  const imageUrl = property.cover_image_url || property.image || "/images/placeholder.jpg";
  const listingType = property.listing_type || property.type;
  
  const getDeveloperLogo = (name: string, logoFromDb?: string) => {
    if (!name) return logoFromDb || null;
    
    const mapping: Record<string, string> = {
      'emaar': '/images/developers/emaar.png',
      'damac': '/images/developers/damac.png',
      'sobha': '/images/developers/sobhan.png',
      'sobhan': '/images/developers/sobhan.png',
      'nakheel': '/images/developers/nakheel.png',
      'binghatti': '/images/developers/binghati.png',
      'arada': '/images/developers/arada.png',
      'tiger': '/images/developers/tiger.png',
      'aldar': '/images/developers/aldar.png',
      'wasl': '/images/developers/wasl.png',
      'danube': '/images/developers/danube.png',
      'dubai properties': '/images/developers/dubai.png',
      'meraas': '/images/developers/meraas.png',
      'alef': '/images/developers/alef.png',
      'imtiaz': '/images/developers/imtiaz.png',
      'nshama': '/images/developers/nshama.png',
      'beyond': '/images/developers/beyond.png',
      'rak': '/images/developers/rak.png',
    };

    const searchName = name.toLowerCase();
    const foundKey = Object.keys(mapping).find(key => searchName.includes(key));
    
    if (foundKey) return mapping[foundKey];
    if (logoFromDb && logoFromDb.startsWith('http')) return logoFromDb;
    return logoFromDb || null;
  };

  const devName = property.developer?.name || property.developerName || property.project;
  const devLogo = property.developer?.logo_url || property.developerLogo;

  return (
    <Link 
      href={propertyUrl}
      className={cn("group block transition-all duration-700", className)}
    >
      <div className={cn(
        "relative bg-white rounded-[2rem] overflow-hidden border border-border/40 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-black/5",
        viewMode === "list" && "flex flex-col md:flex-row h-full"
      )}>
        {/* Image */}
        <div className={cn(
          "relative overflow-hidden",
          viewMode === "list" ? "h-64 md:h-auto md:w-[40%] flex-shrink-0" : "h-72"
        )}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
          
          {/* Top Badges */}
          <div className="absolute top-4 start-4 flex gap-2">
            <Badge className={cn(
              "backdrop-blur-md text-white border-0 px-4 py-1.5 rounded-full text-xs font-semibold",
              listingType === 'rent' ? "bg-primary/90" : "bg-primary/90"
            )}>
              {listingType === 'rent' ? content.properties?.tabs?.rent || 'Rent' : content.properties?.tabs?.sale || 'Sale'}
            </Badge>
            {property.featured && (
              <Badge className="bg-secondary/90 backdrop-blur-md text-white border-0 px-4 py-1.5 rounded-full text-xs font-semibold">
                {content.properties?.featured || 'Featured'}
              </Badge>
            )}
          </div>

          <div className="absolute top-4 end-4">
            <button 
              onClick={onToggleFavorite}
              className="h-10 w-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all group/btn border border-white/30"
            >
              <Heart className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-white group-hover/btn:text-red-500"
              )} />
            </button>
          </div>

          {/* Price Overlay */}
          <div className="absolute bottom-5 inset-x-5 z-10">
            <p className="text-3xl font-bold text-white tracking-tight flex items-center gap-1.5" dir="ltr">
              <AedSymbol size={28} className="flex-shrink-0" /> {price}
            </p>
            {pricePerSqft && (
              <p className="text-white/80 text-sm font-medium mt-1 flex items-center gap-1" dir="ltr">
                <AedSymbol size={14} /> {pricePerSqft}/Sq.Ft
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={cn(
          "p-6 flex flex-col",
          viewMode === "list" && "flex-1 justify-center"
        )}>
          {/* Title */}
          <h3 className={cn(
            "font-bold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors",
            hideLabels ? "text-lg" : "text-xl"
          )}>
            {title}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 text-muted-foreground/60" />
            <span className="text-sm font-medium">
              {areaName}
            </span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-6 pb-4 border-b border-border/40 mb-4 mt-2">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-primary/70" />
              <span className="text-sm font-semibold text-foreground/80">
                {property.bedrooms} {!hideLabels && (content.properties?.beds || 'Beds')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-primary/70" />
              <span className="text-sm font-semibold text-foreground/80">
                {property.bathrooms} {!hideLabels && (content.properties?.baths || 'Baths')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize className="h-4 w-4 text-primary/70" />
              <span className="text-sm font-semibold text-foreground/80" dir="ltr">
                {property.size} {content.properties?.sqft || 'Sq.Ft'}
              </span>
            </div>
          </div>

          {/* Bottom Info & Link */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="relative h-6 w-32">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-20 w-32 grayscale-0 opacity-100 transition-all duration-500">
                {getDeveloperLogo(devName, devLogo) ? (
                  <Image
                    src={getDeveloperLogo(devName, devLogo)!}
                    alt={devName}
                    fill
                    className="object-contain object-left"
                  />
                ) : (
                  <div className="flex items-center h-full">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      {locale === 'fa' ? 'توسط سازنده' : 'by Developer'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all">
              {content.properties?.viewDetails || 'View Details'}
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
