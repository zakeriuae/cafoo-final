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
  Share2,
  MoreVertical,
  Search,
  Paperclip,
  Instagram,
  Linkedin,
  Eye,
  MessageCircle,
  Hash
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { addLeadMessage, toggleLeadAgent, scheduleLeadEvent } from '@/app/(admin)/admin/(dashboard)/leads/actions'
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
import { useI18n } from '@/lib/i18n'
import { CheckCircle2 } from 'lucide-react'

interface LeadCRMViewProps {
  lead: any
  messages: any[]
  agents: any[]
  userActions?: any[]
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

export function LeadCRMView({ lead, messages = [], agents = [], userActions = [] }: LeadCRMViewProps) {
  const { locale } = useI18n()
  const router = useRouter()
  const [newNote, setNewNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [eventDate, setEventDate] = useState('')
  const [eventNotes, setEventNotes] = useState('')
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false)

  const isRtl = locale === 'fa'

  const t = isRtl ? {
    schedule: 'زمان‌بندی بازدید',
    date: 'تاریخ و ساعت',
    notes: 'توضیحات (اختیاری)',
    confirm: 'ثبت و تایید نهایی',
    success: 'بازدید با موفقیت ثبت شد',
    internal: 'یادداشت داخلی - فقط برای ادمین‌ها',
    placeholder: 'پیام خود را بنویسید...',
    journey: 'مسیر کاربر',
    responsible: 'مسئولین پیگیری',
    asset: 'ملک مرتبط',
    origin: 'منبع ورودی'
  } : {
    schedule: 'Schedule Viewing',
    date: 'Date & Time',
    notes: 'Notes (optional)',
    confirm: 'Confirm Schedule',
    success: 'Event scheduled successfully',
    internal: 'Internal note - Admins only',
    placeholder: 'Write a message...',
    journey: 'User Journey',
    responsible: 'Responsible Agents',
    asset: 'Linked Asset',
    origin: 'Origin Source'
  }

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

  const handleScheduleEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventDate || isSubmitting) return

    setIsSubmitting(true)
    const res = await scheduleLeadEvent(lead.id, eventDate, eventNotes)
    setIsSubmitting(false)

    if (res.success) {
      setEventDate('')
      setEventNotes('')
      setShowEventModal(false)
      setShowSuccessOverlay(true)
      setTimeout(() => {
        setShowSuccessOverlay(false)
        router.refresh()
      }, 2000)
    } else {
      toast.error(res.error || 'Failed to schedule event')
    }
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const currentStatusIndex = statusOrder.indexOf(lead.status)
  const progression = Math.round(((currentStatusIndex + 1) / statusOrder.length) * 100)

  // Combine and sort messages + userActions for the timeline
  const fullTimeline = [
    ...(messages || []).map(m => ({ ...m, timelineType: 'message' })),
    ...(userActions || []).map(a => ({ ...a, timelineType: 'action', type: 'action' }))
  ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  const formatDateSafe = (dateStr: string, formatStr: string) => {
    try {
      if (!dateStr) return 'N/A'
      return format(new Date(dateStr), formatStr)
    } catch (err) {
      return 'N/A'
    }
  }

  const getActionIcon = (source: string) => {
    const s = source?.toLowerCase() || ''
    if (s.includes('instagram')) return <Instagram className="w-3.5 h-3.5" />
    if (s.includes('linkedin')) return <Linkedin className="w-3.5 h-3.5" />
    if (s.includes('whatsapp')) return <MessageCircle className="w-3.5 h-3.5" />
    if (s.includes('call')) return <Phone className="w-3.5 h-3.5" />
    if (s.includes('like')) return <Heart className="w-3.5 h-3.5 fill-current" />
    if (s.includes('register') || s.includes('viewing')) return <Eye className="w-3.5 h-3.5" />
    return <Hash className="w-3.5 h-3.5" />
  }

  const getActionColor = (source: string) => {
    const s = source?.toLowerCase() || ''
    if (s.includes('instagram')) return "bg-pink-50 text-pink-500"
    if (s.includes('linkedin')) return "bg-blue-50 text-blue-700"
    if (s.includes('whatsapp')) return "bg-green-50 text-green-500"
    if (s.includes('call')) return "bg-blue-50 text-blue-500"
    if (s.includes('like')) return "bg-red-50 text-red-500"
    if (s.includes('register') || s.includes('viewing')) return "bg-orange-50 text-orange-500"
    return "bg-slate-50 text-slate-500"
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
            <CardContent className="p-4">
              {lead.agent_ids?.length > 0 ? (
                <div className="space-y-3">
                  {agents.filter(a => lead.agent_ids.includes(a.id)).map((agent) => (
                    <div key={agent.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                      <Avatar className="w-9 h-9 border border-white">
                        <AvatarImage src={agent.avatar_url} />
                        <AvatarFallback className="bg-slate-200 text-slate-600 text-[9px] font-bold">
                          {getInitials(agent.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-800 truncate">{agent.name}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Consultant</p>
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
                <div className="text-center py-2 text-slate-400">
                  <p className="text-[9px] font-medium italic">No agents assigned</p>
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
            <CardContent className="p-4">
              {lead.property ? (
                <Link href={`/properties/${lead.property.id}`} className="group block">
                  <div className="relative h-20 w-full rounded-xl overflow-hidden mb-2 bg-slate-100 shadow-inner">
                    {lead.property.cover_image_url && (
                      <img 
                        src={lead.property.cover_image_url} 
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                      />
                    )}
                    <div className="absolute top-1 right-1">
                      <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-none font-black text-[8px] uppercase px-1.5 py-0">
                        {lead.property.listing_type}
                      </Badge>
                    </div>
                  </div>
                  <h4 className="font-black text-slate-800 text-[11px] line-clamp-1">{lead.property.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-primary font-black text-[11px]">AED {lead.property.price?.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {lead.property.area?.name || 'Dubai'}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="text-center py-4 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Origin Source</p>
                  <p className="text-[10px] font-black text-slate-600 truncate px-2">{lead.notes || 'Direct'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Telegram Hub */}
        <div className="lg:col-span-2 flex flex-col h-[750px] shadow-2xl rounded-[2rem] overflow-hidden border border-slate-200">
          <Card className="flex-1 border-none flex flex-col bg-[#E6EBEE] relative">
            
            {/* Telegram Header */}
            <div className="h-16 bg-white border-b border-slate-200/60 px-6 flex items-center justify-between z-30 shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-slate-100">
                  <AvatarImage src={lead.user?.avatar_url} />
                  <AvatarFallback className="bg-primary text-white text-sm font-black">
                    {getInitials(lead.name || 'Anonymous')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h3 className="text-sm font-black text-slate-800 leading-none">{lead.name || 'Anonymous Lead'}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Pipeline</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary rounded-full">
                  <Search className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages Area with Wallpaper */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
               {/* Wallpaper Pattern */}
               <div className="absolute inset-0 opacity-[0.15] pointer-events-none grayscale" 
                    style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p-5.png")' }} />
               
                 <div className="relative z-20 space-y-4">
                   {fullTimeline.length > 0 ? (
                     fullTimeline.map((item: any) => {
                       const isAction = item.timelineType === 'action' || item.type === 'system'
                       
                       if (isAction) {
                         const source = item.metadata?.source || item.source || ''
                         const isEvent = source.includes('register') || source.includes('viewing') || item.metadata?.type === 'event'
                         
                         if (isEvent) {
                           return (
                             <div key={item.id} className="flex justify-center my-6">
                               <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden max-w-sm w-full transition-all hover:scale-[1.02]">
                                 <div className="bg-emerald-500 p-3 flex items-center gap-3 text-white">
                                   <Calendar className="w-5 h-5" />
                                   <span className="text-xs font-semibold uppercase tracking-widest">{isRtl ? 'درخواست بازدید' : 'Viewing Request'}</span>
                                 </div>
                                 <div className="p-4 space-y-3">
                                   <div className="flex items-start gap-3">
                                     <Clock className="w-4 h-4 text-emerald-500 mt-0.5" />
                                     <div>
                                       <p className="text-sm font-semibold text-slate-800">
                                         {formatDateSafe(item.metadata?.scheduled_at || item.created_at, 'PPPP')}
                                       </p>
                                       <p className="text-xs font-medium text-slate-500">
                                         {formatDateSafe(item.metadata?.scheduled_at || item.created_at, 'p')}
                                       </p>
                                     </div>
                                   </div>
                                   <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                     <p className="text-[10px] text-slate-500 italic leading-relaxed">
                                       {item.notes || item.metadata?.event_notes || (isRtl ? 'درخواست ثبت شده توسط کاربر' : 'User requested a viewing')}
                                     </p>
                                   </div>
                                 </div>
                               </div>
                             </div>
                           )
                         }

                         return (
                           <div key={item.id} className="flex justify-center my-6">
                             <div className="bg-slate-500/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-1.5 flex items-center gap-3 transition-all hover:bg-slate-500/20">
                               <div className={cn("p-1.5 rounded-full shadow-inner", getActionColor(source))}>
                                 {getActionIcon(source)}
                               </div>
                               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                 {source}
                               </span>
                               <span className="text-[9px] text-slate-400 font-bold">{formatDateSafe(item.created_at, 'HH:mm')}</span>
                             </div>
                           </div>
                         )
                       }

                       const isMe = item.sender_id === lead.assigned_agent_id
                       return (
                         <div key={item.id} className={cn("flex w-full mb-4 px-4", isMe ? "justify-end" : "justify-start")}>
                           <div className={cn(
                             "max-w-[75%] rounded-[1.25rem] p-3 shadow-sm relative",
                             isMe ? "bg-primary text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none"
                           )}>
                             <p className="text-[13px] leading-relaxed mb-1 whitespace-pre-wrap">{item.content}</p>
                             <div className={cn("text-[9px] flex items-center gap-1", isMe ? "text-white/70 justify-end" : "text-slate-400")}>
                               {formatDateSafe(item.created_at, 'HH:mm')}
                               {isMe && <Check className="w-2.5 h-2.5" />}
                             </div>
                           </div>
                         </div>
                       )
                                 {formatDateSafe(msg.created_at, 'HH:mm')}
                               </span>
                               <Check className="w-3 h-3 text-primary opacity-60" />
                             </div>
                           </div>
                           <p className="text-sm leading-relaxed whitespace-pre-line font-medium">{msg.content}</p>
                           
                           {/* Bubble tail */}
                           <div className="absolute top-0 -right-2 w-3 h-3 bg-white border-t border-slate-200/50 [clip-path:polygon(0%_0%,100%_0%,0%_100%)]" />
                         </div>
                         <Avatar className="w-7 h-7 border-2 border-white shadow-md mb-0.5 shrink-0">
                           <AvatarImage src={msg.sender?.avatar_url} />
                           <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-black">
                             {msg.sender?.full_name?.[0] || 'A'}
                           </AvatarFallback>
                         </Avatar>
                       </div>
                     )
                   })}
                 </div>
               )}
            </div>

            {/* Telegram Input Area - Stuck to bottom */}
            <div className="mt-auto bg-white border-t border-slate-100 p-4 z-30">
               {showEventModal && (
                 <div className={cn(
                   "absolute bottom-full left-4 right-4 mb-4 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 z-40 animate-in slide-in-from-bottom-4 duration-500",
                   isRtl && "text-right"
                 )}>
                   <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-800">{t.schedule}</h4>
                     </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setShowEventModal(false)}>
                       <X className="w-4 h-4 text-slate-400" />
                     </Button>
                   </div>
                   
                   <div className="space-y-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">{t.date}</label>
                       <input 
                         type="datetime-local" 
                         step="3600"
                         className="w-full bg-slate-50 border-slate-100 rounded-2xl text-sm p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                         value={eventDate}
                         onChange={(e) => setEventDate(e.target.value)}
                       />
                     </div>
                     
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">{t.notes}</label>
                       <textarea 
                         placeholder={t.notes}
                         className="w-full bg-slate-50 border-slate-100 rounded-2xl text-sm p-4 resize-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                         rows={3}
                         value={eventNotes}
                         onChange={(e) => setEventNotes(e.target.value)}
                       />
                     </div>

                     <Button 
                       className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-white font-semibold h-14 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                       onClick={handleScheduleEvent}
                       disabled={!eventDate || isSubmitting}
                     >
                       {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t.confirm}
                     </Button>
                   </div>
                 </div>
               )}

               <div className="max-w-4xl mx-auto flex items-end gap-3">
                 <div className="flex-1 bg-slate-50 rounded-[1.5rem] flex items-end p-2 px-4 transition-all focus-within:bg-white focus-within:shadow-md border border-transparent focus-within:border-slate-100">
                   <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary shrink-0 rounded-full">
                     <Paperclip className="w-5 h-5" />
                   </Button>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className={cn("h-9 w-9 shrink-0 rounded-full transition-colors", showEventModal ? "text-primary bg-primary/10" : "text-slate-400 hover:text-primary")}
                     onClick={() => setShowEventModal(!showEventModal)}
                   >
                     <Calendar className="w-5 h-5" />
                   </Button>
                   <form onSubmit={handleAddNote} className="flex-1">
                     <textarea 
                       value={newNote}
                       onChange={(e) => setNewNote(e.target.value)}
                       placeholder={t.placeholder}
                       className="w-full bg-transparent border-none focus:ring-0 text-sm py-2.5 px-2 resize-none min-h-[40px] max-h-[150px]"
                       rows={1}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault()
                           handleAddNote(e)
                         }
                       }}
                     />
                   </form>
                 </div>
                 
                 <Button 
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isSubmitting}
                    className="h-11 w-11 rounded-full shadow-lg bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shrink-0 p-0 flex items-center justify-center mb-1"
                  >
                   <Send className="w-5 h-5 text-white" />
                 </Button>
               </div>
               <p className="text-[9px] text-center text-slate-400 mt-4 font-medium opacity-60">
                 {t.internal}
               </p>
            </div>
          </Card>
        </div>

        {/* Success Overlay */}
        {showSuccessOverlay && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] p-12 shadow-2xl flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white shadow-2xl shadow-green-200">
                 <CheckCircle2 className="w-12 h-12" />
               </div>
               <h2 className="text-2xl font-semibold text-slate-900">{t.success}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
