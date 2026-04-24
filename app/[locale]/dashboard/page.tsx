import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, MessageSquare, Share2, TrendingUp, ArrowRight } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get counts
  const [savedCount, inquiriesCount, referralsCount] = await Promise.all([
    supabase
      .from("saved_properties")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user?.id),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user?.id),
    supabase
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_user_id", user?.id),
  ])

  // Get user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  // Get recent saved properties
  const { data: recentSaved } = await supabase
    .from("saved_properties")
    .select(`
      id,
      created_at,
      property:properties(
        id,
        title,
        slug,
        price,
        cover_image_url
      )
    `)
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(3)

  const stats = [
    {
      title: "Saved Properties",
      value: savedCount.count || 0,
      icon: Heart,
      href: "/dashboard/saved",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "My Inquiries",
      value: inquiriesCount.count || 0,
      icon: MessageSquare,
      href: "/dashboard/inquiries",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Referrals",
      value: referralsCount.count || 0,
      icon: Share2,
      href: "/dashboard/referrals",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {profile?.full_name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your property search.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
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
              <div className="text-3xl font-bold">{stat.value}</div>
              <Link
                href={stat.href}
                className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-2"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Saved */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recently Saved</CardTitle>
              <CardDescription>Properties you&apos;ve saved recently</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/saved">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentSaved && recentSaved.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {recentSaved.map((item) => (
                <Link
                  key={item.id}
                  href={`/properties/${(item.property as any)?.slug}`}
                  className="group block"
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2">
                    {(item.property as any)?.cover_image_url ? (
                      <img
                        src={(item.property as any).cover_image_url}
                        alt={(item.property as any).title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-sm truncate group-hover:text-primary">
                    {(item.property as any)?.title || "Property"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    AED {((item.property as any)?.price || 0).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">
                You haven&apos;t saved any properties yet
              </p>
              <Button asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referral Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="p-3 rounded-full bg-primary/20">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Earn rewards with referrals</h3>
            <p className="text-sm text-muted-foreground">
              Share your referral code and earn rewards when your friends make a purchase.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/referrals">Get your code</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
