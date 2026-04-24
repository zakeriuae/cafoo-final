import { createClient } from '@/lib/supabase/server'
import { DataTable, Column } from '@/components/admin/data-table'
import { deleteProperty } from './actions'
import type { Property } from '@/lib/database.types'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

async function getProperties() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('properties')
    .select('*, area:areas(name), tower:towers(name), agent:agents(name)')
    .order('created_at', { ascending: false })
  return data || []
}

function formatPrice(price: number, currency: string = 'AED') {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

const columns: Column<Property>[] = [
  {
    key: 'cover_image_url',
    label: 'Image',
    render: (item) => item.cover_image_url ? (
      <Image 
        src={item.cover_image_url} 
        alt={item.title}
        width={80}
        height={60}
        className="w-20 h-15 object-cover rounded"
        unoptimized
      />
    ) : (
      <div className="w-20 h-15 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
        No image
      </div>
    ),
  },
  {
    key: 'title',
    label: 'Title',
    render: (item) => (
      <div className="max-w-xs">
        <p className="font-medium truncate">{item.title}</p>
        <p className="text-sm text-muted-foreground">
          {item.ad_code || '-'}
        </p>
      </div>
    ),
  },
  {
    key: 'listing_type',
    label: 'Type',
    render: (item) => (
      <div className="space-y-1">
        <Badge variant="outline">{item.listing_type}</Badge>
        <p className="text-xs text-muted-foreground">{item.property_type}</p>
      </div>
    ),
  },
  {
    key: 'price',
    label: 'Price',
    render: (item) => formatPrice(item.price, item.currency),
  },
  {
    key: 'bedrooms',
    label: 'Beds/Baths',
    render: (item) => `${item.bedrooms || 0} / ${item.bathrooms || 0}`,
  },
  {
    key: 'area.name',
    label: 'Area',
    render: (item) => (item as any).area?.name || '-',
  },
  {
    key: 'status',
    label: 'Status',
    render: (item) => (
      <Badge 
        variant={
          item.status === 'available' ? 'default' : 
          item.status === 'sold' || item.status === 'rented' ? 'secondary' :
          'outline'
        }
      >
        {item.status}
      </Badge>
    ),
  },
  {
    key: 'content_status',
    label: 'Published',
    render: (item) => (
      <Badge variant={item.content_status === 'published' ? 'default' : 'secondary'}>
        {item.content_status}
      </Badge>
    ),
  },
]

export default async function PropertiesPage() {
  const properties = await getProperties()

  return (
    <DataTable
      title="Properties"
      description="Manage property listings"
      data={properties}
      columns={columns}
      createHref="/admin/properties/new"
      editHref={(id) => `/admin/properties/${id}/edit`}
      deleteAction={deleteProperty}
      searchPlaceholder="Search properties..."
    />
  )
}
