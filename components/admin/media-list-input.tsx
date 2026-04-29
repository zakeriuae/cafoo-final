'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'
import { FileUploader } from './file-uploader'

interface MediaItem {
  title: string
  url: string
}

interface MediaListInputProps {
  name: string
  label: string
  initialValue?: MediaItem[]
  bucket: string
  folder: string
}

export function MediaListInput({
  name,
  label,
  initialValue = [],
  bucket,
  folder
}: MediaListInputProps) {
  const [items, setItems] = useState<MediaItem[]>(initialValue)

  const addItem = () => {
    setItems([...items, { title: '', url: '' }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof MediaItem, value: string) => {
    const next = [...items]
    next[index] = { ...next[index], [field]: value }
    setItems(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add Media
        </Button>
      </div>

      <input type="hidden" name={name} value={JSON.stringify(items.filter(i => i.url))} />

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No additional media items added.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20 relative group">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g. Project Video, PDF Guide"
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <FileUploader
                  bucket={bucket}
                  folder={folder}
                  initialUrl={item.url}
                  name={`media-item-url-${index}`}
                  placeholder="Upload File"
                  onUpload={(url) => updateItem(index, 'url', url)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-background border rounded-full text-red-500 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
