'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MoreVertical, 
  Phone, 
  Mail, 
  Calendar,
  MessageSquare,
  Plus
} from 'lucide-react'
import Link from 'next/link'

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
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const getLeadsByStatus = (status: string) => {
    return leads.filter(l => l.status === status)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar min-h-[calc(100vh-200px)]">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${column.color}`} />
              <h3 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">{column.title}</h3>
              <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold">
                {getLeadsByStatus(column.id).length}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex-1 bg-slate-50/50 rounded-2xl p-3 border border-slate-100 space-y-3">
            {getLeadsByStatus(column.id).map((lead) => (
              <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="block group">
                <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 group-hover:translate-y-[-2px] overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                            {getInitials(lead.name || 'Anonymous')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">
                            {lead.name || 'Anonymous'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {lead.source}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </div>

                    {lead.property && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-500 truncate">
                          {lead.property.title}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold">
                          <Phone className="w-2 h-2" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold">
                          <Mail className="w-2 h-2" />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            
            {getLeadsByStatus(column.id).length === 0 && (
              <div className="h-20 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Drop here</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
