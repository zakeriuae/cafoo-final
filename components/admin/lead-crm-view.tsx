'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  MoreVertical,
  ArrowLeft,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LeadCRMViewProps {
  lead: any
  actions?: any[]
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

export function LeadCRMView({ lead, actions = [] }: LeadCRMViewProps) {
  const [activeTab, setActiveTab] = useState('activity')

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const currentStatusIndex = statusOrder.indexOf(lead.status)
  const progression = Math.round(((currentStatusIndex + 1) / statusOrder.length) * 100)

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
          <h1 className="text-2xl font-bold">Lead Detail</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <Avatar className="w-24 h-24 border-4 border-white/10 shadow-2xl">
              <AvatarFallback className="bg-primary text-3xl font-bold">
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
                  Added {new Date(lead.created_at).toLocaleDateString()}
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
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last Update</p>
              <h3 className="text-lg font-bold">
                {new Date(lead.updated_at).toLocaleDateString()}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Context & Relations */}
        <div className="space-y-6">
          <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Home className="w-4 h-4 text-primary" />
                Linked Asset
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {lead.property ? (
                <div className="group">
                  <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4 bg-slate-100">
                    {lead.property.cover_image_url && (
                      <img 
                        src={lead.property.cover_image_url} 
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                      />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900">{lead.property.title}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {lead.property.area?.name || 'Dubai'}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-primary font-bold text-lg">AED {lead.property.price?.toLocaleString()}</p>
                    <Link href={`/properties/${lead.property.id}`} className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                      View Public
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400">No property linked</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm rounded-2xl">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Assigned Agent
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {lead.agent ? (
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{getInitials(lead.agent.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{lead.agent.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Consultant</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">Unassigned</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interaction Hub */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="w-full bg-slate-100 p-1 rounded-2xl h-12 mb-6">
              <TabsTrigger value="activity" className="flex-1 rounded-xl h-full font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Recent Interactions
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex-1 rounded-xl h-full font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Private Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4 outline-none">
              <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                    {actions.length > 0 ? (
                      actions.map((action, i) => (
                        <div key={i} className="p-4 hover:bg-slate-50/50 transition-colors">
                          <div className="flex gap-4 items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                              {action.source === 'call' ? <Phone className="w-4 h-4" /> :
                               action.source === 'whatsapp' ? <MessageSquare className="w-4 h-4" /> :
                               action.source === 'like' ? <Heart className="w-4 h-4 text-red-500 fill-current" /> :
                               <Clock className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
                                  {action.source.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                  {new Date(action.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700 font-medium">{action.notes || 'User interacted with the platform'}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-slate-400 italic">
                        No recent actions found for this user.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 outline-none">
               <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden p-6">
                 <textarea 
                    placeholder="Add a private note..."
                    className="w-full min-h-[100px] border rounded-xl p-4 text-sm resize-none bg-slate-50 focus:bg-white transition-colors"
                  />
                  <div className="flex justify-end mt-4">
                    <Button size="sm" className="bg-primary text-white rounded-xl px-6 font-bold">
                      Save Note
                    </Button>
                  </div>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
