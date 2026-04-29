'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MoreVertical, 
  UserCheck, 
  Phone, 
  MessageSquare, 
  Heart, 
  Calendar, 
  Share2, 
  Info 
} from 'lucide-react'
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
import { differenceInDays } from 'date-fns'

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

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'call': return <Phone className="w-3 h-3 text-blue-500" />
    case 'whatsapp': return <MessageSquare className="w-3 h-3 text-green-500" />
    case 'like': return <Heart className="w-3 h-3 text-red-500" fill="currentColor" />
    case 'register_viewing': return <Calendar className="w-3 h-3 text-purple-500" />
    case 'share': return <Share2 className="w-3 h-3 text-orange-500" />
    default: return <Info className="w-3 h-3 text-slate-400" />
  }
}

export function LeadsKanban({ leads }: LeadsKanbanProps) {
  const router = useRouter()
  const [localLeads, setLocalLeads] = useState(leads)

  useEffect(() => {
    setLocalLeads(leads)
  }, [leads])

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const { draggableId, destination } = result
    const newStatus = destination.droppableId as any

    const updatedLeads = localLeads.map(l => 
      l.id === draggableId ? { ...l, status: newStatus, status_updated_at: new Date().toISOString() } : l
    )
    setLocalLeads(updatedLeads)

    const formData = new FormData()
    formData.set('status', newStatus)
    const res = await updateLead(draggableId, formData)
    
    if (res.success) {
      toast.success(`Moved to ${newStatus}`)
      router.refresh()
    } else {
      toast.error('Failed to move')
      setLocalLeads(leads)
    }
  }

  const getLeadsByStatus = (status: string) => {
    return localLeads.filter(l => l.status === status)
  }

  const getStaleness = (lead: any) => {
    const lastStatusUpdate = new Date(lead.status_updated_at || lead.created_at)
    const days = differenceInDays(new Date(), lastStatusUpdate)
    if (days >= 30) return 'critical'
    if (days >= 14) return 'warning'
    return 'fresh'
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar min-h-[calc(100vh-250px)]">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-64 flex flex-col">
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${column.color}`} />
                <h3 className="font-bold text-slate-500 uppercase tracking-tighter text-[9px]">{column.title}</h3>
                <Badge variant="secondary" className="bg-white text-slate-400 border border-slate-100 font-bold text-[8px] h-4 px-1">
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
                    "flex-1 rounded-xl p-1.5 space-y-1.5 transition-colors duration-200",
                    snapshot.isDraggingOver ? "bg-slate-200/40" : "bg-slate-200/20"
                  )}
                >
                  {getLeadsByStatus(column.id).map((lead, index) => {
                    const staleness = getStaleness(lead)
                    const daysInStatus = differenceInDays(new Date(), new Date(lead.status_updated_at || lead.created_at))
                    const totalDays = differenceInDays(new Date(), new Date(lead.created_at))
                    
                    return (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn("group block", snapshot.isDragging ? "z-50" : "")}
                          >
                            <Card className={cn(
                              "border transition-all duration-200 bg-white rounded-lg overflow-hidden",
                              snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : "shadow-sm hover:shadow",
                              staleness === 'critical' ? "border-red-200 bg-red-50/20" : 
                              staleness === 'warning' ? "border-orange-200 bg-orange-50/20" : 
                              "border-slate-100"
                            )}>
                              <CardContent className="p-2 space-y-1">
                                <div className="flex justify-between items-center gap-1.5">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {getSourceIcon(lead.source)}
                                    <p className={cn(
                                      "font-bold text-[11px] truncate",
                                      staleness === 'critical' ? "text-red-900" :
                                      staleness === 'warning' ? "text-orange-900" :
                                      "text-slate-800"
                                    )}>
                                      {lead.name || 'Anonymous'}
                                    </p>
                                  </div>
                                  <Link href={`/admin/leads/${lead.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-2.5 h-2.5 text-slate-400" />
                                  </Link>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1 text-[9px] font-medium text-slate-500 truncate max-w-[50%]">
                                    <UserCheck className="w-2.5 h-2.5" />
                                    <span className="truncate">{lead.agent?.name?.split(' ')[0] || '-'}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[9px] font-bold">
                                    <span className={cn(
                                      "px-1 rounded-[4px]",
                                      staleness === 'critical' ? "bg-red-100 text-red-600" :
                                      staleness === 'warning' ? "bg-orange-100 text-orange-600" :
                                      "bg-slate-100 text-slate-500"
                                    )}>
                                      {daysInStatus}d here
                                    </span>
                                    <span className="text-slate-300 font-normal">/</span>
                                    <span className="text-slate-400 font-normal">{totalDays}d total</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
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
