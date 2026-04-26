import { createClient } from '@/lib/supabase/server'
import { DataTable, Column } from '@/components/admin/data-table'
import { deleteTower } from './actions'
import type { Tower } from '@/lib/database.types'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

async function getTowers() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'
  
  let currentAgentId = null
  if (!isAdmin && user) {
    const { data: agent } = await supabase.from('agents').select('id').eq('user_id', user.id).single()
    currentAgentId = agent?.id
  }

  let query = supabase
    .from('towers')
    .select('*, area:areas(name), developer:developers(name)')
    .order('sort_order', { ascending: true })

  if (!isAdmin && currentAgentId) {
    query = query.eq('assigned_agent_id', currentAgentId)
  }

  const { data } = await query
  return data || []
}

function formatPrice(price: number | null, currency: string = 'AED') {
  if (!price) return '-'
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

const columns: Column<Tower>[] = [
  {
    key: 'cover_image_url',
    label: 'Image',
    render: (item) => item.cover_image_url ? (
      <Image 
        src={item.cover_image_url} 
        alt={item.name}
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
    key: 'name',
    label: 'Name',
    render: (item) => (
      <div>
        <p className="font-medium">{item.name}</p>
        {item.name_fa && <p className="text-sm text-muted-foreground">{item.name_fa}</p>}
      </div>
    ),
  },
  {
    key: 'area.name',
    label: 'Area',
    render: (item) => (item as any).area?.name || '-',
  },
  {
    key: 'developer.name',
    label: 'Developer',
    render: (item) => (item as any).developer?.name || '-',
  },
  {
    key: 'starting_price',
    label: 'Starting Price',
    render: (item) => formatPrice(item.starting_price, item.currency),
  },
  {
    key: 'is_off_plan',
    label: 'Off Plan',
    render: (item) => item.is_off_plan ? (
      <Badge variant="outline">Off Plan</Badge>
    ) : null,
  },
  {
    key: 'status',
    label: 'Status',
    render: (item) => (
      <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
        {item.status}
      </Badge>
    ),
  },
]

export default async function TowersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    isAdmin = profile?.role === 'admin'
  }

  const towers = await getTowers()

  return (
    <DataTable
      title="Towers"
      description="Manage tower/building listings"
      data={towers}
      columns={columns}
      createHref="/admin/towers/new"
      editHref={(id) => `/admin/towers/${id}/edit`}
      deleteAction={isAdmin ? deleteTower : undefined}
      searchPlaceholder="Search towers..."
    />
  )
}
