'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon, Clock, Video, Users, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"

interface MeetingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MeetingData) => Promise<void>
  title: string
}

export interface MeetingData {
  date: Date
  time: string
  type: 'online' | 'in_person'
  message: string
}

export function MeetingModal({ isOpen, onClose, onSubmit, title }: MeetingModalProps) {
  const { locale } = useI18n()
  const isRtl = locale === 'fa'
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("10:00")
  const [type, setType] = useState<'online' | 'in_person'>('in_person')
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!date) {
      toast.error(isRtl ? "لطفاً تاریخ را انتخاب کنید" : "Please select a date")
      return
    }
    
    setIsLoading(true)
    try {
      await onSubmit({
        date,
        time,
        type,
        message
      })
      onClose()
      toast.success(isRtl ? "درخواست شما ثبت شد" : "Inquiry submitted successfully")
    } catch (error) {
      toast.error(isRtl ? "خطایی رخ داد" : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const times = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-none rounded-[2rem] overflow-hidden bg-white shadow-2xl">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
            {isRtl ? 'درخواست بازدید و مشاوره' : 'Request Viewing & Meeting'}
          </DialogTitle>
          <DialogDescription className="font-bold text-slate-500 mt-2">
            {title}
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6">
          {/* Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                {isRtl ? 'تاریخ' : 'Date'}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 rounded-xl justify-start text-left font-bold border-slate-100 bg-slate-50/50 hover:bg-white transition-all",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {date ? format(date, "PPP") : (isRtl ? "انتخاب تاریخ" : "Pick a date")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-none" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                {isRtl ? 'ساعت' : 'Time'}
              </label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {times.map((t) => (
                    <SelectItem key={t} value={t} className="font-bold">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Meeting Type */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              {isRtl ? 'نوع جلسه' : 'Meeting Type'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={type === 'in_person' ? 'default' : 'outline'}
                className={cn(
                  "h-14 rounded-2xl gap-2 font-bold transition-all active:scale-95",
                  type === 'in_person' ? "shadow-lg shadow-primary/20" : "border-slate-100 bg-slate-50/50"
                )}
                onClick={() => setType('in_person')}
              >
                <Users className="h-4 w-4" />
                {isRtl ? 'حضوری' : 'In-person'}
              </Button>
              <Button
                variant={type === 'online' ? 'default' : 'outline'}
                className={cn(
                  "h-14 rounded-2xl gap-2 font-bold transition-all active:scale-95",
                  type === 'online' ? "shadow-lg shadow-primary/20" : "border-slate-100 bg-slate-50/50"
                )}
                onClick={() => setType('online')}
              >
                <Video className="h-4 w-4" />
                {isRtl ? 'آنلاین' : 'Online'}
              </Button>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              {isRtl ? 'توضیحات (اختیاری)' : 'Message (Optional)'}
            </label>
            <Textarea
              placeholder={isRtl ? "سوال یا پیامی دارید؟" : "Any questions or specific requests?"}
              className="rounded-2xl border-slate-100 bg-slate-50/50 font-bold focus:bg-white transition-all min-h-[100px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="p-8 pt-0">
          <Button 
            className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/30 transition-all active:scale-95"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (isRtl ? 'ثبت درخواست' : 'Submit Request')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
