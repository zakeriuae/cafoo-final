import { createClient } from "@/lib/supabase/server"
import { ReferralsClient } from "./referrals-client"

export default async function ReferralsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get or create referral code
  let { data: referralCode } = await supabase
    .from("referral_codes")
    .select("*")
    .eq("user_id", user?.id)
    .eq("is_active", true)
    .single()

  // If no referral code exists, we'll create one in the client

  // Get referrals made by this user
  const { data: referrals } = await supabase
    .from("referrals")
    .select(`
      id,
      referral_code,
      status,
      reward_amount,
      reward_paid_at,
      created_at,
      referred_lead:leads(name, email)
    `)
    .eq("referrer_user_id", user?.id)
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalReferrals = referrals?.length || 0
  const convertedReferrals = referrals?.filter((r) => r.status === "converted").length || 0
  const totalRewards = referrals
    ?.filter((r) => r.status === "rewarded")
    .reduce((sum, r) => sum + (r.reward_amount || 0), 0) || 0

  return (
    <ReferralsClient
      userId={user?.id || ""}
      initialCode={referralCode}
      referrals={referrals || []}
      stats={{
        totalReferrals,
        convertedReferrals,
        totalRewards,
      }}
    />
  )
}
