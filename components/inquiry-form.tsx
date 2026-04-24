"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, CheckCircle, Mail, Phone, User, MessageSquare } from "lucide-react"

interface InquiryFormProps {
  propertyId?: string
  towerId?: string
  areaId?: string
  propertyTitle?: string
  agentId?: string
}

export function InquiryForm({
  propertyId,
  towerId,
  areaId,
  propertyTitle,
  agentId,
}: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    leadType: "inquiry",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser()

    // Get referral code from URL if present
    const urlParams = new URLSearchParams(window.location.search)
    const referralCode = urlParams.get("ref")

    const { error: insertError } = await supabase.from("leads").insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      lead_type: formData.leadType,
      message: formData.message,
      property_id: propertyId || null,
      tower_id: towerId || null,
      area_id: areaId || null,
      user_id: user?.id || null,
      referral_code: referralCode || null,
      source: referralCode ? "referral" : "website",
      utm_source: urlParams.get("utm_source") || null,
      utm_medium: urlParams.get("utm_medium") || null,
      utm_campaign: urlParams.get("utm_campaign") || null,
    })

    if (insertError) {
      setError("Failed to submit inquiry. Please try again.")
      setIsSubmitting(false)
      return
    }

    // Track referral if code was used
    if (referralCode) {
      // Find the referrer
      const { data: codeData } = await supabase
        .from("referral_codes")
        .select("user_id")
        .eq("code", referralCode)
        .eq("is_active", true)
        .single()

      if (codeData) {
        // Create referral record
        await supabase.from("referrals").insert({
          referrer_user_id: codeData.user_id,
          referral_code: referralCode,
          status: "pending",
        })

        // Increment uses count
        await supabase.rpc("increment_referral_uses", { code_param: referralCode })
      }
    }

    setIsSuccess(true)
    setIsSubmitting(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      leadType: "inquiry",
      message: "",
    })
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="mb-2 text-center">Thank you!</CardTitle>
          <CardDescription className="text-center mb-4">
            Your inquiry has been submitted. Our team will contact you shortly.
          </CardDescription>
          <Button variant="outline" onClick={() => setIsSuccess(false)}>
            Submit another inquiry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Contact Us
        </CardTitle>
        <CardDescription>
          {propertyTitle
            ? `Inquire about ${propertyTitle}`
            : "Get in touch with our team"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+971 50 XXX XXXX"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadType">Inquiry Type</Label>
            <Select
              value={formData.leadType}
              onValueChange={(value) => setFormData({ ...formData, leadType: value })}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inquiry">General Inquiry</SelectItem>
                <SelectItem value="viewing_request">Schedule a Viewing</SelectItem>
                <SelectItem value="callback">Request a Callback</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us more about what you're looking for..."
              value={formData.message}
              onChange={handleChange}
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Inquiry"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
