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
  CheckCircle2,
  Circle,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import type { Lead } from '@/lib/database.types'

interface LeadCRMViewProps {
  lead: any // Using any for now to include relations
}

const statusColors: Record<string, string> = {
  new: 'bg-green-100 text-green-800',
  contacted: 'bg-blue-100 text-blue-800',
  qualified: 'bg-purple-100 text-purple-800',
  negotiating: 'bg-yellow-100 text-yellow-800',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-gray-100 text-gray-800',
}

const steps = ['New', 'Contacted', 'Qualified', 'Negotiating', 'Won/Lost']

export function LeadCRMView({ lead }: LeadCRMViewProps) {
  const [activeTab, setActiveTab] = useState('activity')

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
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
          <h1 className="text-2xl font-bold">Lead CRM</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MoreVertical className="w-4 h-4" />
          </Button>
          <Button className="bg-primary text-white">
            Convert to Customer
          </Button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <Avatar className="w-24 h-24 border-4 border-white/10 shadow-2xl">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-3xl font-bold">
                {getInitials(lead.name || 'Anonymous')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-bold">{lead.name || 'Anonymous Lead'}</h2>
                <Badge className={statusColors[lead.status] + " border-none px-3 py-1 text-xs uppercase font-bold tracking-wider"}>
                  {lead.status}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-6 text-slate-300 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  {lead.phone || 'N/A'}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  {lead.email || 'N/A'}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Added {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="pt-4 max-w-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lead Progression</span>
                  <span className="text-xs font-bold text-primary">60% Complete</span>
                </div>
                <div className="flex items-center gap-2">
                  {steps.map((step, i) => {
                    const isCompleted = i < 3 // Mock logic
                    const isCurrent = i === 3
                    return (
                      <div key={step} className="flex-1 group relative">
                        <div className={`h-2 rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' : 
                          isCurrent ? 'bg-primary/40 animate-pulse' : 'bg-white/10'
                        }`} />
                        <span className="absolute -bottom-6 left-0 text-[10px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase whitespace-nowrap">
                          {step}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center min-w-[200px]">
              <div className="text-primary animate-bounce mb-2">
                <Phone className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <h3 className="text-lg font-bold">Waiting for Call</h3>
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
                Property Interest
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {lead.property ? (
                <div className="group cursor-pointer">
                  <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4">
                    <img 
                      src={lead.property.cover_image_url || "/images/placeholder.jpg"} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white/90 text-slate-900 border-none backdrop-blur-sm">
                        {lead.property.listing_type}
                      </Badge>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {lead.property.title}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {lead.property.area?.name || 'Dubai'}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-primary font-bold text-lg">AED {lead.property.price?.toLocaleString()}</p>
                    <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5">
                      View Asset
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Home className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-sm text-slate-400">No specific property assigned</p>
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
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={lead.agent.avatar_url} />
                    <AvatarFallback>{getInitials(lead.agent.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-slate-900">{lead.agent.name}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Senior Consultant</p>
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="w-full border-dashed">
                  Assign Agent
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interaction Hub */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="w-full bg-slate-100 p-1 rounded-2xl h-14 mb-6">
              <TabsTrigger value="activity" className="flex-1 rounded-xl h-full font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Activity & Notes
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1 rounded-xl h-full font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Chat History
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex-1 rounded-xl h-full font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Documents
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex-1 rounded-xl h-full font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Bookings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4 outline-none">
              <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 border-b border-slate-50">
                    <textarea 
                      placeholder="Add a private note for the team..."
                      className="w-full min-h-[100px] border-none focus:ring-0 text-sm resize-none bg-transparent"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                          <Clock className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button size="sm" className="bg-primary text-white rounded-xl px-6 font-bold">
                        Save Note
                      </Button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-slate-50">
                    {[
                      { type: 'note', text: 'Spoke with the client. Interested in high floor units.', user: 'Admin', time: '2 hours ago' },
                      { type: 'status', text: 'Lead status changed to Qualified', user: 'System', time: '1 day ago' },
                      { type: 'source', text: 'Inquiry received from WhatsApp', user: 'System', time: '2 days ago' }
                    ].map((activity, i) => (
                      <div key={i} className="p-6 hover:bg-slate-50/50 transition-colors">
                        <div className="flex gap-4 items-start">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'note' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'status' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {activity.type === 'note' ? <FileText className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-sm">{activity.user}</span>
                              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{activity.time}</span>
                            </div>
                            <p className="text-sm text-slate-600">{activity.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="outline-none">
              <Card className="border-slate-100 shadow-sm rounded-2xl h-[500px] flex flex-col overflow-hidden">
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg shadow-primary/20">
                      <p className="text-sm">Hello! I saw your inquiry about the Marina unit. Would you like to schedule a viewing?</p>
                      <span className="text-[10px] text-white/60 mt-2 block text-right font-bold uppercase tracking-widest">10:45 AM</span>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-900 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                      <p className="text-sm">Yes, I am free this Saturday afternoon. Around 4 PM works for me.</p>
                      <span className="text-[10px] text-slate-400 mt-2 block font-bold uppercase tracking-widest">11:02 AM</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <div className="bg-white rounded-2xl p-2 flex items-center gap-2 border border-slate-200">
                    <input 
                      className="flex-1 border-none focus:ring-0 text-sm px-4 bg-transparent"
                      placeholder="Type a message to the client..."
                    />
                    <Button size="icon" className="bg-primary text-white rounded-xl shadow-lg shadow-primary/30">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="docs" className="outline-none">
               <Card className="border-slate-100 shadow-sm rounded-2xl p-6">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   {[
                     { name: 'Passport Copy.pdf', size: '2.4 MB' },
                     { name: 'Reservation Form.pdf', size: '1.1 MB' },
                     { name: 'Proof of Funds.png', size: '4.8 MB' }
                   ].map((doc, i) => (
                     <div key={i} className="group cursor-pointer p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/20 transition-all text-center">
                       <FileText className="w-10 h-10 text-primary/40 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                       <p className="text-xs font-bold text-slate-900 truncate mb-1">{doc.name}</p>
                       <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{doc.size}</p>
                     </div>
                   ))}
                   <div className="border-2 border-dashed border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <Send className="w-6 h-6 text-slate-300 mb-2 rotate-45" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Doc</p>
                   </div>
                 </div>
               </Card>
            </TabsContent>

            <TabsContent value="bookings" className="outline-none">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { date: 'May 12, 2026', time: '16:00', type: 'Property Viewing', status: 'Confirmed' },
                   { date: 'May 15, 2026', time: '11:00', type: 'Virtual Tour', status: 'Pending' }
                 ].map((booking, i) => (
                   <Card key={i} className="border-slate-100 shadow-sm rounded-2xl overflow-hidden group">
                     <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold uppercase leading-none">May</span>
                            <span className="text-lg font-black">{booking.date.split(' ')[1].replace(',', '')}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">{booking.type}</h4>
                            <p className="text-xs text-slate-500">{booking.time}</p>
                          </div>
                        </div>
                        <Badge className={booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {booking.status}
                        </Badge>
                     </div>
                   </Card>
                 ))}
                 <Button variant="outline" className="h-full min-h-[80px] border-dashed rounded-2xl flex flex-col gap-1">
                    <Calendar className="w-5 h-5 text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schedule New</span>
                 </Button>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
