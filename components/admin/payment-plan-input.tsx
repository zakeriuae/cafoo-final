'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface PaymentPlanItem {
  phase: string
  percent: string
  phase_fa?: string
}

interface PaymentPlanInputProps {
  name: string
  label?: string
  initialValue?: PaymentPlanItem[]
}

export function PaymentPlanInput({ name, label = "Payment Plan", initialValue = [] }: PaymentPlanInputProps) {
  const [items, setItems] = useState<PaymentPlanItem[]>(
    initialValue.length > 0 ? initialValue : [{ phase: '', percent: '', phase_fa: '' }]
  )

  const addItem = () => {
    setItems([...items, { phase: '', percent: '', phase_fa: '' }])
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    if (newItems.length === 0) {
      setItems([{ phase: '', percent: '', phase_fa: '' }])
    } else {
      setItems(newItems)
    }
  }

  const updateItem = (index: number, field: keyof PaymentPlanItem, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <Card key={index} className="p-4 relative group bg-muted/30 border-dashed">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Milestone (EN)</Label>
                <Input
                  value={item.phase}
                  onChange={(e) => updateItem(index, 'phase', e.target.value)}
                  placeholder="e.g. On Booking"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Milestone (FA)</Label>
                <Input
                  value={item.phase_fa || ''}
                  onChange={(e) => updateItem(index, 'phase_fa', e.target.value)}
                  placeholder="مثلاً هنگام رزرو"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Percentage (%)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={item.percent}
                    onChange={(e) => updateItem(index, 'percent', e.target.value)}
                    placeholder="20"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <input
        type="hidden"
        name={name}
        value={JSON.stringify(items.filter(i => i.phase || i.percent))}
      />

      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
        Total Percentage: {items.reduce((acc, curr) => acc + (parseFloat(curr.percent) || 0), 0)}%
      </p>
    </div>
  )
}
