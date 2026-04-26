import { createClient } from '@/lib/supabase/server'
import { DataTable, Column } from '@/components/admin/data-table'
import { deleteArea } from './actions'
import type { Area } from '@/lib/database.types'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

async function getAreas() {
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
    .from('areas')
    .select('*, assigned_agent:agents(name)')
    .order('sort_order', { ascending: true })

  if (!isAdmin && currentAgentId) {
    query = query.eq('assigned_agent_id', currentAgentId)
  }

  const { data } = await query
  return data || []
}

const columns: Column<Area>[] = [
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
    key: 'total_properties',
    label: 'Properties',
  },
  {
    key: 'total_towers',
    label: 'Towers',
  },
  {
    key: 'featured',
    label: 'Featured',
    render: (item) => item.featured ? (
      <Badge variant="default">Featured</Badge>
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

export default async function AreasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    isAdmin = profile?.role === 'admin'
  }

  const areas = await getAreas()

  return (
    <DataTable
      title="Areas"
      description="Manage area listings"
      data={areas}
      columns={columns}
      createHref="/admin/areas/new"
      editHref={(id) => `/admin/areas/${id}/edit`}
      deleteAction={isAdmin ? deleteArea : undefined}
      searchPlaceholder="Search areas..."
    />
  )
}
