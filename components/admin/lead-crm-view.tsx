'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Clock, 
  MapPin, 
  Home, 
  User, 
  FileText, 
  Send,
  ArrowLeft,
  Heart,
  Plus,
  Check,
  UserPlus,
  X,
  Share2
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { addLeadMessage, toggleLeadAgent } from '@/app/(admin)/admin/(dashboard)/leads/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { format } from 'date-fns'

interface LeadCRMViewProps {
  lead: any
  messages: any[]
  agents: any[]
}

const statusColors: Record<string, string> = {
  new: 'bg-green-100 text-green-800',
  contacted: 'bg-blue-100 text-blue-800',
  qualified: 'bg-purple-100 text-purple-800',
  negotiating: 'bg-yellow-100 text-yellow-800',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-gray-100 text-gray-800',
}

const statusOrder = ['new', 'contacted', 'qualified', 'negotiating', 'won']

export function LeadCRMView({ lead, messages = [], agents = [] }: LeadCRMViewProps) {
  const router = useRouter()
  const [newNote, setNewNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim() || isSubmitting) return

    setIsSubmitting(true)
    const res = await addLeadMessage(lead.id, newNote, 'note')
    setIsSubmitting(false)

    if (res.success) {
      setNewNote('')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to add note')
    }
  }

  const handleToggleAgent = async (agentId: string) => {
    const res = await toggleLeadAgent(lead.id, agentId)
    if (res.success) {
      toast.success('Agents updated')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to update agents')
    }
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const currentStatusIndex = statusOrder.indexOf(lead.status)
  const progression = Math.round(((currentStatusIndex + 1) / statusOrder.length) * 100)

  // Safe date formatting
  const formatDateSafe = (dateStr: string, formatStr: string) => {
    try {
      if (!dateStr) return 'N/A'
      return format(new Date(dateStr), formatStr)
    } catch (err) {
      return 'N/A'
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/leads">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">CRM Workspace</h1>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-slate-200">
             ID: {lead.id?.toString().substring(0, 8) || 'N/A'}
           </Badge>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <Card className="overflow-hidden border-none shadow-xl bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <Avatar className="w-24 h-24 border-4 border-white/10 shadow-2xl">
              <AvatarImage src={lead.user?.avatar_url} />
              <AvatarFallback className="bg-primary text-3xl font-bold text-white">
                {getInitials(lead.name || 'Anonymous')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-bold">{lead.name || 'Anonymous Lead'}</h2>
                <Badge className={cn("border-none px-3 py-1 text-xs uppercase font-bold tracking-wider", statusColors[lead.status])}>
                  {lead.status}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-6 text-slate-300 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  {lead.phone || 'No phone'}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  {lead.email || 'No email'}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Added {formatDateSafe(lead.created_at, 'MMM dd, yyyy')}
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="pt-4 max-w-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pipeline Progression</span>
                  <span className="text-xs font-bold text-primary">{progression}% Complete</span>
                </div>
                <div className="flex items-center gap-2">
                  {statusOrder.map((step, i) => {
                    const isCompleted = i <= currentStatusIndex
                    const isCurrent = i === currentStatusIndex
                    return (
                      <div key={step} className="flex-1 group relative">
                        <div className={cn(
                          "h-2 rounded-full transition-all duration-500",
                          isCompleted ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "bg-white/10",
                          isCurrent && "animate-pulse"
                        )} />
                        <span className={cn(
                          "absolute -bottom-6 left-0 text-[10px] font-bold uppercase whitespace-nowrap transition-colors",
                          isCompleted ? "text-slate-200" : "text-slate-500"
                        )}>
                          {step}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center min-w-[200px]">
              <div className="text-primary mb-2">
                <Clock className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status Update</p>
              <h3 className="text-lg font-bold">
                {formatDateSafe(lead.status_updated_at || lead.created_at, 'MMM dd, yyyy')}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sidebars */}
        <div className="space-y-6">
          {/* Agent Assignment */}
          <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-6">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Responsible Agents
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-slate-200/50 hover:bg-primary hover:text-white transition-all">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 max-h-80 overflow-y-auto rounded-xl p-2 shadow-2xl border-slate-100">
                    <DropdownMenuLabel className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1.5">Assign Consultant</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {agents.map((agent) => {
                      const isAssigned = (lead.agent_ids || []).includes(agent.id) || lead.agent_id === agent.id
                      return (
                        <DropdownMenuItem 
                          key={agent.id} 
                          onClick={() => handleToggleAgent(agent.id)}
                          className="flex items-center justify-between p-2 rounded-lg cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={agent.avatar_url} />
                              <AvatarFallback>{getInitials(agent.name)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-bold">{agent.name}</span>
                          </div>
                          {isAssigned && <Check className="w-3.5 h-3.5 text-primary" />}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {(lead.agent_ids?.length > 0 || lead.agent) ? (
                <div className="flex flex-col gap-2">
                  {agents.filter(a => (lead.agent_ids || []).includes(a.id) || lead.agent_id === a.id).map(agent => (
                    <div key={agent.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/50 border border-slate-100 group">
                      <Avatar className="w-8 h-8 border border-white shadow-sm">
                        <AvatarImage src={agent.avatar_url} />
                        <AvatarFallback className="bg-slate-200 text-slate-600 text-[10px] font-bold">
                          {getInitials(agent.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 truncate">{agent.name}</p>
                        <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">Consultant</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"
                        onClick={() => handleToggleAgent(agent.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400">
                  <p className="text-[10px] font-medium italic">No agents assigned</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Linked Asset */}
          <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Home className="w-4 h-4 text-primary" />
                Linked Asset
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {lead.property ? (
                <Link href={`/properties/${lead.property.id}`} className="group block">
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 bg-slate-100 shadow-inner">
                    {lead.property.cover_image_url && (
                      <img 
                        src={lead.property.cover_image_url} 
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                      />
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-none font-bold text-[9px] uppercase">
                        {lead.property.listing_type}
                      </Badge>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{lead.property.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-primary font-bold text-sm">AED {lead.property.price?.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {lead.property.area?.name || 'Dubai'}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                   <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
                     <Share2 className="w-5 h-5 text-slate-300" />
                   </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Origin Source</p>
                  <p className="text-xs font-bold text-slate-600">{lead.notes || 'Direct/Unknown'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Telegram Hub */}
        <div className="lg:col-span-2 flex flex-col h-[700px]">
          <Card className="flex-1 border-slate-100 shadow-sm rounded-3xl overflow-hidden flex flex-col bg-[#F0F2F5] relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
               {messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                   <div className="w-16 h-16 rounded-full bg-slate-200/50 flex items-center justify-center shadow-inner">
                     <MessageSquare className="w-8 h-8 opacity-30" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">No history recorded yet</p>
                 </div>
               ) : (
                 messages.map((msg, i) => {
                   const isAction = msg.type === 'action' || msg.type === 'system'
                   
                   if (isAction) {
                     return (
                       <div key={msg.id} className="flex justify-center my-6">
                         <div className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] rounded-full px-6 py-1.5 flex items-center gap-3 transition-all hover:scale-105">
                           <div className="p-1.5 rounded-full bg-slate-50 shadow-inner">
                             {msg.metadata?.source === 'like' ? <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> :
                              msg.metadata?.source === 'call' ? <Phone className="w-3.5 h-3.5 text-blue-500" /> :
                              msg.metadata?.source === 'whatsapp' ? <MessageSquare className="w-3.5 h-3.5 text-green-500" /> :
                              <Clock className="w-3.5 h-3.5 text-slate-400" />}
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-wide leading-none">
                               {msg.content}
                             </span>
                             <span className="text-[8px] text-slate-400 font-medium uppercase mt-0.5">
                               {formatDateSafe(msg.created_at, 'HH:mm')} • System Log
                             </span>
                           </div>
                         </div>
                       </div>
                     )
                   }

                   return (
                     <div key={msg.id} className={cn("flex gap-3 items-end", "justify-end")}>
                       <div className={cn(
                         "max-w-[85%] rounded-2xl px-4 py-3 shadow-[0_2px_5px_rgba(0,0,0,0.05)] relative group transition-all hover:shadow-md",
                         "bg-[#E1FEC6] text-slate-800 rounded-tr-none border border-green-200/50"
                       )}>
                         <div className="flex items-center justify-between gap-6 mb-1.5">
                           <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">
                             {msg.sender?.full_name || 'System Consultant'}
                           </span>
                           <div className="flex items-center gap-1">
                             <span className="text-[9px] text-green-600/60 font-bold">
                               {formatDateSafe(msg.created_at, 'HH:mm')}
                             </span>
                             <Check className="w-3 h-3 text-green-500 opacity-40" />
                           </div>
                         </div>
                         <p className="text-[13px] leading-relaxed whitespace-pre-line font-medium">{msg.content}</p>
                         
                         {/* Bubble tail */}
                         <div className="absolute top-0 -right-2 w-3 h-3 bg-[#E1FEC6] border-t border-green-200/50 [clip-path:polygon(0%_0%,100%_0%,0%_100%)]" />
                       </div>
                       <Avatar className="w-7 h-7 border-2 border-white shadow-md mb-0.5 shrink-0">
                         <AvatarImage src={msg.sender?.avatar_url} />
                         <AvatarFallback className="bg-green-200 text-green-800 text-[9px] font-black">
                           {msg.sender?.full_name?.[0] || 'A'}
                         </AvatarFallback>
                       </Avatar>
                     </div>
                   )
                 })
               )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 relative z-10">
               <form onSubmit={handleAddNote} className="flex items-end gap-3 max-w-4xl mx-auto">
                 <div className="flex-1 relative">
                   <textarea 
                     value={newNote}
                     onChange={(e) => setNewNote(e.target.value)}
                     placeholder="Write an internal note or update..."
                     className="w-full bg-slate-50 border-none rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[50px] max-h-[150px]"
                     rows={1}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault()
                         handleAddNote(e)
                       }
                     }}
                   />
                   <div className="absolute right-3 bottom-3 text-slate-300">
                      <FileText className="w-5 h-5" />
                   </div>
                 </div>
                 <Button 
                    type="submit" 
                    disabled={!newNote.trim() || isSubmitting}
                    size="icon" 
                    className="h-12 w-12 rounded-full shadow-lg hover:scale-105 transition-all flex-shrink-0"
                  >
                   <Send className="w-5 h-5" />
                 </Button>
               </form>
               <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                 Enter to send. Notes are only visible to agents and admins.
               </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
