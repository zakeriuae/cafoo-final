'use client'

import { DataTable, Column } from '@/components/admin/data-table'
import { updateUserRole, deleteUser } from './actions'
import type { Profile } from '@/lib/database.types'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UsersTableProps {
  users: any[]
}

export function UsersTable({ users }: UsersTableProps) {
  const handleRoleChange = async (userId: string, newRole: string) => {
    const result = await updateUserRole(userId, newRole as any)
    if (result.success) {
      toast.success("Role updated successfully")
    } else {
      toast.error(result.error || "Failed to update role")
    }
  }

  const columns: Column<Profile>[] = [
    {
      key: 'avatar_url',
      label: 'User',
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={item.avatar_url || undefined} />
            <AvatarFallback>{item.full_name?.charAt(0) || item.email?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.full_name || 'No Name'}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (item) => (
        <Select 
          defaultValue={item.role} 
          onValueChange={(val) => handleRoleChange(item.id, val)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      )
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (item) => new Date(item.created_at).toLocaleDateString()
    }
  ]

  return (
    <DataTable
      title="Users"
      description="Manage user roles and permissions"
      data={users}
      columns={columns}
      createHref="#" // No creation from here for now
      editHref={() => "#"}
      deleteAction={deleteUser}
      searchPlaceholder="Search users..."
    />
  )
}
