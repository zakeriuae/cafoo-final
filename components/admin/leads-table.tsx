'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { updateLead, deleteLead, convertActionToLead } from '@/app/(admin)/admin/(dashboard)/leads/actions'
import type { Lead, Agent } from '@/lib/database.types'
import { Search, Phone, Mail, MessageSquare, Trash2, Edit2, Eye, UserPlus, UserCheck, Heart, Clock, Instagram, Linkedin, MessageCircle } from 'lucide-react'

interface LeadsTableProps {
  title?: string
  leads: (Lead & {
    property?: { id: string; title: string } | null
    tower?: { id: string; name: string } | null
    area?: { id: string; name: string } | null
    agent?: { id: string; name: string } | null
  })[]
  agents: { id: string; name: string }[]
  isActionLog?: boolean
}

const statusColors: Record<string, string> = {
  new: 'bg-green-100 text-green-800',
  contacted: 'bg-blue-100 text-blue-800',
  qualified: 'bg-purple-100 text-purple-800',
  negotiating: 'bg-yellow-100 text-yellow-800',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-gray-100 text-gray-800',
}

const sourceLabels: Record<string, string> = {
  call: 'Phone Call',
  whatsapp: 'WhatsApp',
  email: 'Email',
  register_viewing: 'Viewing Request',
  contact_form: 'Contact Form',
  referral: 'Referral',
  like: 'Property Like',
  social: 'Social Media',
  share: 'Shared',
}

export function LeadsTable({ leads, agents, title, isActionLog = false }: LeadsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [editingLead, setEditingLead] = useState<typeof leads[0] | null>(null)
  const [convertingActionId, setConvertingActionId] = useState<string | null>(null)
  const [selectedAgentId, setSelectedAgentId] = useState<string>('')
  const [isUpdating, setIsUpdating] = useState(false)

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      (lead.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (lead.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (lead.phone?.includes(search) ?? false)
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async (id: string, status: string) => {
    const formData = new FormData()
    formData.set('status', status)
    const result = await updateLead(id, formData)
    if (result.success) {
      toast.success('Status updated')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to update')
    }
  }

  const handleConvertAction = async () => {
    if (!convertingActionId) return
    
    setIsUpdating(true)
    const result = await convertActionToLead(convertingActionId, selectedAgentId || undefined)
    setIsUpdating(false)
    
    if (result.success) {
      toast.success('Action converted to lead')
      setConvertingActionId(null)
      setSelectedAgentId('')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to convert')
    }
  }

  const handleUpdateLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingLead) return

    setIsUpdating(true)
    const formData = new FormData(e.currentTarget)
    const result = await updateLead(editingLead.id, formData)
    setIsUpdating(false)

    if (result.success) {
      toast.success('Lead updated')
      setEditingLead(null)
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to update')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    
    const result = await deleteLead(id)
    if (result.success) {
      toast.success('Lead deleted')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete')
    }
  }

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">Manage and track your leads</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg px-3 py-1">
              {filteredLeads.length} leads
            </Badge>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-white">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="negotiating">Negotiating</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>{isActionLog ? 'Action' : 'Source'}</TableHead>
              <TableHead>{isActionLog ? 'Asset/Source' : 'Property/Tower'}</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {isActionLog ? 'No actions recorded yet' : 'No leads found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{lead.name || 'Anonymous'}</p>
                      {lead.email && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isActionLog && (
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                          {lead.source === 'call' ? <Phone className="w-4 h-4" /> :
                           lead.source === 'whatsapp' ? <MessageCircle className="w-4 h-4 text-green-500" /> :
                           lead.source.includes('instagram') ? <Instagram className="w-4 h-4 text-pink-500" /> :
                           lead.source.includes('linkedin') ? <Linkedin className="w-4 h-4 text-blue-700" /> :
                           lead.source === 'like' ? <Heart className="w-4 h-4 text-red-500 fill-current" /> :
                           lead.source.includes('viewing') ? <Eye className="w-4 h-4 text-orange-500" /> :
                           <Clock className="w-4 h-4" />}
                        </div>
                      )}
                      <div>
                        <Badge variant="outline">
                          {sourceLabels[lead.source] || lead.source}
                        </Badge>
                        {lead.referral_code && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Ref: {lead.referral_code}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.property ? (
                      <p className="text-sm">{lead.property.title}</p>
                    ) : lead.tower ? (
                      <p className="text-sm">{lead.tower.name}</p>
                    ) : lead.area ? (
                      <p className="text-sm">{lead.area.name}</p>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.agent ? (
                      <p className="text-sm">{lead.agent.name}</p>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isActionLog ? (
                      <Badge variant="secondary">Log Only</Badge>
                    ) : (
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleUpdateStatus(lead.id, value)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <Badge className={statusColors[lead.status]}>
                            {lead.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="negotiating">Negotiating</SelectItem>
                          <SelectItem value="won">Won</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleTimeString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {isActionLog && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary"
                          onClick={() => {
                            setConvertingActionId(lead.id)
                            setSelectedAgentId(lead.agent_id || '')
                          }}
                          title="Convert to CRM Lead"
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link href={`/admin/leads/${lead.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingLead(lead)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          {editingLead && (
            <form onSubmit={handleUpdateLead} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingLead.name || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingLead.email || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={editingLead.phone || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={editingLead.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="negotiating">Negotiating</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent_id">Assigned Agent</Label>
                <Select name="agent_id" defaultValue={editingLead.agent_id || 'none'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={editingLead.notes || ''}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingLead(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      {/* Convert to Lead Dialog */}
      <Dialog open={!!convertingActionId} onOpenChange={(open) => !open && setConvertingActionId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert Action to CRM Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Assign to Agent</Label>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This will create a new entry in the CRM pipeline (Leads) based on this interaction.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConvertingActionId(null)}>
                Cancel
              </Button>
              <Button onClick={handleConvertAction} disabled={isUpdating}>
                {isUpdating ? 'Converting...' : 'Convert to Lead'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
