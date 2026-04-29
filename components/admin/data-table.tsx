'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, MoreHorizontal, Pencil, Trash2, Search, Eye } from 'lucide-react'
import { toast } from 'sonner'

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T extends { id: string }> {
  title: string
  description?: string
  data: T[]
  columns: Column<T>[]
  createHref: string
  editHref: (id: string) => string
  viewHref?: (id: string) => string
  deleteAction?: (id: string) => Promise<{ success: boolean; error?: string }>
  searchPlaceholder?: string
}

export function DataTable<T extends { id: string }>({
  title,
  description,
  data,
  columns,
  createHref,
  editHref,
  viewHref,
  deleteAction,
  searchPlaceholder = 'Search...',
}: DataTableProps<T>) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredData = data.filter((item) => {
    if (!search) return true
    return columns.some((col) => {
      const value = getNestedValue(item, col.key as string)
      return String(value).toLowerCase().includes(search.toLowerCase())
    })
  })

  const handleDelete = async () => {
    if (!deleteId || !deleteAction) return
    
    setIsDeleting(true)
    const result = await deleteAction(deleteId)
    setIsDeleting(false)
    
    if (result.success) {
      toast.success('Item deleted successfully')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete item')
    }
    setDeleteId(null)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <Button asChild>
          <Link href={createHref}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)}>{col.label}</TableHead>
              ))}
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render 
                        ? col.render(item)
                        : String(getNestedValue(item, col.key as string) ?? '-')
                      }
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {viewHref && (
                          <DropdownMenuItem asChild>
                            <Link href={viewHref(item.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href={editHref(item.id)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {deleteAction && (
                          <DropdownMenuItem 
                            onClick={() => setDeleteId(item.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj as unknown)
}
