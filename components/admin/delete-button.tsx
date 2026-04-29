'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

interface DeleteButtonProps {
  id: string
  action: (id: string) => Promise<{ success: boolean; error?: string }>
  title?: string
  description?: string
  variant?: 'ghost' | 'outline' | 'destructive'
  size?: 'icon' | 'default' | 'sm' | 'lg'
}

export function DeleteButton({
  id,
  action,
  title = 'Are you sure?',
  description = 'This action cannot be undone. This will permanently delete this item.',
  variant = 'ghost',
  size = 'icon'
}: DeleteButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await action(id)
      if (result.success) {
        toast.success('Deleted successfully')
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to delete')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} className={variant === 'ghost' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? <Spinner className="mr-2" /> : null}
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
