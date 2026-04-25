"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Share2,
  Copy,
  Check,
  Gift,
  Users,
  DollarSign,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AedSymbol } from "@/components/ui/aed-symbol"

interface ReferralCode {
  id: string
  code: string
  uses_count: number
  max_uses: number | null
  is_active: boolean
  created_at: string
  expires_at: string | null
}

interface Referral {
  id: string
  referral_code: string
  status: string
  reward_amount: number | null
  reward_paid_at: string | null
  created_at: string
  referred_lead: { name: string; email: string } | null
}

interface ReferralsClientProps {
  userId: string
  initialCode: ReferralCode | null
  referrals: Referral[]
  stats: {
    totalReferrals: number
    convertedReferrals: number
    totalRewards: number
  }
}

function generateCode(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function ReferralsClient({
  userId,
  initialCode,
  referrals,
  stats,
}: ReferralsClientProps) {
  const router = useRouter()
  const [code, setCode] = useState<ReferralCode | null>(initialCode)
  const [isCreating, setIsCreating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleCreateCode = async () => {
    setIsCreating(true)
    const supabase = createClient()
    
    const newCode = generateCode()
    
    const { data, error } = await supabase
      .from("referral_codes")
      .insert({
        user_id: userId,
        code: newCode,
        is_active: true,
      })
      .select()
      .single()

    if (!error && data) {
      setCode(data)
    }
    
    setIsCreating(false)
    router.refresh()
  }

  const handleCopyCode = () => {
    if (code) {
      const referralUrl = `${window.location.origin}?ref=${code.code}`
      navigator.clipboard.writeText(referralUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const handleCopyCodeOnly = () => {
    if (code) {
      navigator.clipboard.writeText(code.code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case "qualified":
        return <Badge variant="outline" className="border-blue-500 text-blue-500"><Users className="w-3 h-3 mr-1" />Qualified</Badge>
      case "converted":
        return <Badge variant="outline" className="border-green-500 text-green-500"><CheckCircle className="w-3 h-3 mr-1" />Converted</Badge>
      case "rewarded":
        return <Badge className="bg-green-500"><Gift className="w-3 h-3 mr-1" />Rewarded</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const statCards = [
    {
      title: "Total Referrals",
      value: stats.totalReferrals,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Converted",
      value: stats.convertedReferrals,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Rewards",
      value: <span className="flex items-center gap-1"><AedSymbol size={20} className="text-amber-500" /> {stats.totalRewards.toLocaleString()}</span>,
      icon: DollarSign,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Referral Program</h1>
        <p className="text-muted-foreground">
          Share your referral code and earn rewards when your friends make a purchase.
        </p>
      </div>

      {/* Your Referral Code */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Your Referral Code
          </CardTitle>
          <CardDescription>
            Share this code with friends and family to earn rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          {code ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={code.code}
                    readOnly
                    className="text-2xl font-mono font-bold text-center tracking-wider h-14 bg-background"
                  />
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleCopyCodeOnly}
                  className="h-14"
                >
                  {isCopied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleCopyCode} className="flex-1">
                  {isCopied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Referral Link
                    </>
                  )}
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a
                    href={`https://wa.me/?text=Check%20out%20Cafoo%20Real%20Estate!%20Use%20my%20referral%20code%3A%20${code.code}%20${encodeURIComponent(window.location.origin)}%3Fref%3D${code.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Share on WhatsApp
                  </a>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Code used {code.uses_count} times
                {code.max_uses && ` / ${code.max_uses} max`}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                You don&apos;t have a referral code yet. Create one to start earning!
              </p>
              <Button onClick={handleCreateCode} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 h-4 w-4" />
                    Create My Referral Code
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-medium">Share your code</h4>
                <p className="text-sm text-muted-foreground">
                  Share your unique referral code with friends and family
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary">2</span>
              </div>
              <div>
                <h4 className="font-medium">They make an inquiry</h4>
                <p className="text-sm text-muted-foreground">
                  When they inquire about a property using your code
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-medium">Earn rewards</h4>
                <p className="text-sm text-muted-foreground">
                  Get rewarded when they complete a property purchase
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>Track the status of your referrals</CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Referred</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Reward</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell className="text-muted-foreground">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {referral.referred_lead ? (
                          <div>
                            <p className="font-medium">{referral.referred_lead.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {referral.referred_lead.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(referral.status)}</TableCell>
                      <TableCell className="text-right">
                        {referral.reward_amount ? (
                          <span className="font-medium text-green-600 flex items-center justify-end gap-1">
                            <AedSymbol size={14} className="text-green-600" /> {referral.reward_amount.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                No referrals yet. Share your code to start earning!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
