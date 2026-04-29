'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

interface JsonArrayInputProps {
  name: string
  label: string
  initialValue?: any[]
  fields: { name: string; label: string; type?: string }[]
}

export function JsonArrayInput({ name, label, initialValue = [], fields }: JsonArrayInputProps) {
  const [items, setItems] = useState<any[]>(initialValue || [])

  const handleAdd = () => {
    const newItem: any = {}
    fields.forEach(f => newItem[f.name] = '')
    setItems([...items, newItem])
  }

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: string, value: string) => {
    const newItems = [...items]
    newItems[index][field] = value
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
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 items-start bg-white p-4 rounded-md border shadow-sm">
              <div className="flex-1 space-y-4">
                {fields.map((f) => (
                  <div key={f.name} className="space-y-2">
                    <Label className="text-xs">{f.label}</Label>
                    <Input
                      type={f.type || 'text'}
                      value={item[f.name] || ''}
                      onChange={(e) => handleChange(index, f.name, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <Button type="button" variant="destructive" size="icon" className="shrink-0" onClick={() => handleRemove(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
