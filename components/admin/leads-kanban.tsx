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
  Info,
  Trash2,
  UserPlus,
  Eye,
  Check
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult
} from '@hello-pangea/dnd'
import { updateLead, deleteLead, toggleLeadAgent } from '@/app/(admin)/admin/(dashboard)/leads/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { differenceInDays, formatDistanceToNow } from 'date-fns'
import { faIR } from 'date-fns/locale'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'

interface LeadsKanbanProps {
  leads: any[]
  agents: { id: string, name: string }[]
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

export function LeadsKanban({ leads, agents = [] }: LeadsKanbanProps) {
  const router = useRouter()
  const [localLeads, setLocalLeads] = useState(leads)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    
    setIsUpdating(true)
    const res = await deleteLead(id)
    setIsUpdating(false)
    
    if (res.success) {
      toast.success('Lead deleted')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to delete')
    }
  }

  const handleToggleAgent = async (leadId: string, agentId: string) => {
    setIsUpdating(true)
    const res = await toggleLeadAgent(leadId, agentId)
    setIsUpdating(false)
    if (!res.success) {
      toast.error(res.error || 'Failed to update agents')
    }
  }

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

  if (!isClient) return <div className="h-[500px] w-full bg-slate-50/50 rounded-2xl animate-pulse" />

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
                    
                    return (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                         {(provided, snapshot) => (
                           <div
                             ref={provided.innerRef}
                             {...provided.draggableProps}
                             {...provided.dragHandleProps}
                             className={cn("group block mb-2", snapshot.isDragging ? "z-50" : "")}
                           >
                            <Card 
                              className={cn(
                                "group border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden cursor-default",
                                lead.scheduled_at && "bg-emerald-50/80 border-emerald-200"
                              )}
                            >
                              <CardContent className="p-3 py-1.5 space-y-1.5">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 mb-1">
                                       {getSourceIcon(lead.source)}
                                       <Link href={`/admin/leads/${lead.id}`} className="hover:text-primary transition-colors inline-block">
                                         <h4 className={cn(
                                           "font-bold text-[13px] leading-tight truncate",
                                           staleness === 'critical' ? "text-red-900" :
                                           staleness === 'warning' ? "text-orange-900" :
                                           "text-slate-800"
                                         )}>
                                           {lead.name || 'Anonymous'}
                                         </h4>
                                       </Link>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1">
                                      {lead.agent_ids?.length > 0 ? (
                                        agents.filter(a => lead.agent_ids.includes(a.id)).map(agent => (
                                          <div key={agent.id} className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[8px] font-bold text-slate-500 uppercase tracking-tight">
                                            {agent.name}
                                          </div>
                                        ))
                                      ) : lead.agent ? (
                                        <div className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[8px] font-bold text-slate-500 uppercase tracking-tight">
                                          {lead.agent.name}
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-1 text-[8px] font-bold text-slate-300 uppercase tracking-widest px-1">
                                          <UserCheck className="w-2.5 h-2.5" />
                                          <span>Unassigned</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <MoreVertical className="w-3.5 h-3.5" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                      <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem asChild className="text-xs font-semibold cursor-pointer">
                                        <Link href={`/admin/leads/${lead.id}`} className="flex items-center">
                                          <Eye className="w-3.5 h-3.5 mr-2" />
                                          View Details
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="cursor-pointer text-xs font-semibold">
                                          <UserPlus className="w-3.5 h-3.5 mr-2" />
                                          Add Agent
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                          <DropdownMenuSubContent className="max-h-64 overflow-y-auto w-48">
                                            {agents.map((agent) => (
                                              <DropdownMenuCheckboxItem 
                                                key={agent.id}
                                                className="cursor-pointer text-xs font-medium"
                                                checked={(lead.agent_ids || []).includes(agent.id)}
                                                onCheckedChange={() => handleToggleAgent(lead.id, agent.id)}
                                              >
                                                {agent.name}
                                              </DropdownMenuCheckboxItem>
                                            ))}
                                          </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                      </DropdownMenuSub>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                        onClick={() => handleDeleteLead(lead.id)}
                                        disabled={isUpdating}
                                      >
                                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                                        <span className="text-xs font-medium">Delete Lead</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }).replace('about ', '')}
                                  </div>
                                  {lead.scheduled_at && (
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500 text-white shadow-sm shrink-0 scale-90 origin-right">
                                      <Calendar className="w-2.5 h-2.5" />
                                      <span className="text-[9px] font-black">{format(new Date(lead.scheduled_at), 'MMM dd, p')}</span>
                                    </div>
                                  )}
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
