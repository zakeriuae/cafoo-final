'use client'

import { DataTable, Column } from '@/components/admin/data-table'
import { deleteAgent } from './actions'
import type { Agent } from '@/lib/database.types'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

interface AgentsTableProps {
  agents: any[]
}

const columns: Column<Agent>[] = [
  {
    key: 'avatar_url',
    label: 'Photo',
    render: (item) => item.avatar_url ? (
      <Image 
        src={item.avatar_url} 
        alt={item.name}
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
        unoptimized
      />
    ) : (
      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm">
        {item.name?.charAt(0)}
      </div>
    ),
  },
  {
    key: 'name',
    label: 'Name',
    render: (item) => (
      <div>
        <p className="font-medium">{item.name}</p>
        {item.title && <p className="text-sm text-muted-foreground">{item.title}</p>}
      </div>
    ),
  },
  {
    key: 'email',
    label: 'Contact',
    render: (item) => (
      <div className="text-sm">
        {item.email && <p>{item.email}</p>}
        {item.phone && <p className="text-muted-foreground">{item.phone}</p>}
      </div>
    ),
  },
  {
    key: 'experience_years',
    label: 'Experience',
    render: (item) => `${item.experience_years} years`,
  },
  {
    key: 'total_listings',
    label: 'Listings',
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

export function AgentsTable({ agents }: AgentsTableProps) {
  return (
    <DataTable
      title="Agents"
      description="Manage team agents"
      data={agents}
      columns={columns}
      createHref="/admin/agents/new"
      editHref={(id) => `/admin/agents/${id}/edit`}
      deleteAction={deleteAgent}
      searchPlaceholder="Search agents..."
    />
  )
}
