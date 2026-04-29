import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteAmenity } from './actions'
import { DeleteButton } from '@/components/admin/delete-button'
import * as Icons from 'lucide-react'

export default async function AmenitiesPage() {
  const supabase = await createClient()
  const { data: amenities } = await supabase
    .from('amenities')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Amenities</h1>
          <p className="text-muted-foreground">
            Manage global amenities for towers and properties
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/amenities/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Amenity
          </Link>
        </Button>
      </div>

      <div className="bg-background border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Icon</TableHead>
              <TableHead>Name (EN)</TableHead>
              <TableHead>Name (FA)</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sort</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amenities?.map((amenity) => {
              // @ts-ignore
              const IconComponent = Icons[amenity.icon] || Icons.Check
              
              return (
                <TableRow key={amenity.id}>
                  <TableCell>
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{amenity.name}</TableCell>
                  <TableCell dir="rtl">{amenity.name_fa || '-'}</TableCell>
                  <TableCell>{amenity.category || '-'}</TableCell>
                  <TableCell>{amenity.sort_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/amenities/${amenity.id}/edit`}>
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </Button>
                      <DeleteButton
                        id={amenity.id}
                        action={deleteAmenity}
                        title="Delete Amenity"
                        description="Are you sure you want to delete this amenity? This action cannot be undone."
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {(!amenities || amenities.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No amenities found. Create your first one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
