'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

interface StringArrayInputProps {
  name: string
  label: string
  initialValue?: string[]
}

export function StringArrayInput({ name, label, initialValue = [] }: StringArrayInputProps) {
  const [items, setItems] = useState<string[]>(initialValue || [])

  const handleAdd = () => {
    setItems([...items, ''])
  }

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    setItems(newItems)
  }

  return (
    <div className="space-y-4 border p-4 rounded-lg bg-slate-50/50">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      <input type="hidden" name={name} value={JSON.stringify(items)} />

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No items added yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={item}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="e.g. Swimming Pool"
              />
              <Button type="button" variant="destructive" size="icon" onClick={() => handleRemove(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
