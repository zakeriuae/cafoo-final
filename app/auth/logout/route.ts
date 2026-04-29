import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // Check if session exists
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()
  }

  const { origin } = request.nextUrl
  return NextResponse.redirect(`${origin}/`, {
    status: 302,
  })
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  const { origin } = request.nextUrl
  return NextResponse.redirect(`${origin}/`, {
    status: 302,
  })
}
