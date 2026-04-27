'use client'

import { DataTable, Column } from '@/components/admin/data-table'
import { deleteDeveloper } from './actions'
import type { Developer } from '@/lib/database.types'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

interface DevelopersTableProps {
  developers: any[]
}

const columns: Column<Developer>[] = [
  {
    key: 'logo_url',
    label: 'Logo',
    render: (item) => item.logo_url ? (
      <Image 
        src={item.logo_url} 
        alt={item.name}
        width={48}
        height={48}
        className="w-12 h-12 object-contain rounded"
        unoptimized
      />
    ) : (
      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
        No logo
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
    key: 'slug',
    label: 'Slug',
  },
  {
    key: 'total_projects',
    label: 'Projects',
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

export function DevelopersTable({ developers }: DevelopersTableProps) {
  return (
    <DataTable
      title="Developers"
      description="Manage property developers"
      data={developers}
      columns={columns}
      createHref="/admin/developers/new"
      editHref={(id) => `/admin/developers/${id}/edit`}
      deleteAction={deleteDeveloper}
      searchPlaceholder="Search developers..."
    />
  )
}
