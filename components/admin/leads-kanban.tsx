'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult
} from '@hello-pangea/dnd'
import { updateLead } from '@/app/(admin)/admin/(dashboard)/leads/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface LeadsKanbanProps {
  leads: any[]
}

const columns = [
  { id: 'new', title: 'New Leads', color: 'bg-green-500' },
  { id: 'contacted', title: 'Contacted', color: 'bg-blue-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-purple-500' },
  { id: 'negotiating', title: 'Negotiating', color: 'bg-yellow-500' },
  { id: 'won', title: 'Won', color: 'bg-emerald-500' },
]

export function LeadsKanban({ leads }: LeadsKanbanProps) {
  const router = useRouter()
  const [localLeads, setLocalLeads] = useState(leads)

  // Update local leads when props change
  useEffect(() => {
    setLocalLeads(leads)
  }, [leads])

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const { draggableId, destination } = result
    const newStatus = destination.droppableId as any

    // 1. Optimistic Update
    const updatedLeads = localLeads.map(l => 
      l.id === draggableId ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l
    )
    setLocalLeads(updatedLeads)

    // 2. Update database
    const formData = new FormData()
    formData.set('status', newStatus)
    const res = await updateLead(draggableId, formData)
    
    if (res.success) {
      toast.success(`Lead moved to ${newStatus}`)
      router.refresh()
    } else {
      toast.error('Failed to move lead')
      setLocalLeads(leads) // Revert on failure
    }
  }

  const getLeadsByStatus = (status: string) => {
    return localLeads.filter(l => l.status === status)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar min-h-[calc(100vh-250px)]">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-72 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${column.color}`} />
                <h3 className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">{column.title}</h3>
                <Badge variant="secondary" className="bg-white text-slate-400 border border-slate-100 font-bold text-[9px] h-5 px-1.5">
                  {getLeadsByStatus(column.id).length}
                </Badge>
              </div>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "flex-1 rounded-2xl p-2 space-y-2 transition-colors duration-200",
                    snapshot.isDraggingOver ? "bg-slate-200/50" : "bg-slate-200/30"
                  )}
                >
                  {getLeadsByStatus(column.id).map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "group block",
                            snapshot.isDragging ? "z-50" : ""
                          )}
                        >
                          <Card className={cn(
                            "border border-slate-100 shadow-sm hover:shadow transition-all duration-200 bg-white rounded-xl overflow-hidden",
                            snapshot.isDragging ? "shadow-xl ring-2 ring-primary/20 scale-[1.02]" : ""
                          )}>
                            <CardContent className="p-3 space-y-2">
                              <div className="flex justify-between items-start gap-2">
                                <p className="font-bold text-xs text-slate-900 group-hover:text-primary transition-colors truncate">
                                  {lead.name || 'Anonymous'}
                                </p>
                                <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                                  <Link href={`/admin/leads/${lead.id}`}>
                                    <MoreVertical className="w-3 h-3" />
                                  </Link>
                                </Button>
                              </div>

                              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100/50">
                                <UserCheck className="w-3 h-3 text-primary/60" />
                                <span className="truncate">{lead.agent?.name || 'Unassigned'}</span>
                              </div>

                              <div className="flex flex-col gap-0.5 pt-1 border-t border-slate-50">
                                <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                  <span>Created:</span>
                                  <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-[9px] text-primary/50 font-bold uppercase tracking-tighter">
                                  <span>Updated:</span>
                                  <span>{new Date(lead.updated_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
