import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '..', '.env.local')

const envContent = fs.readFileSync(envPath, 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
  if (match) {
    let val = match[2] || ''
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
    env[match[1]] = val
  }
})

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function fixAdminProfile() {
  const adminEmail = 'zakeriuae@gmail.com'
  
  console.log(`Checking auth.users for ${adminEmail}...`)
  
  // 1. Get user from auth.users (Supabase doesn't let us easily query auth.users from JS client, 
  // but we can try to fetch them via admin API)
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Error listing users:', listError)
    return
  }
  
  const user = users.find(u => u.email === adminEmail)
  
  if (!user) {
    console.log(`User ${adminEmail} not found in auth.users! You need to sign up first.`)
    return
  }
  
  console.log(`Found user in auth.users! ID: ${user.id}`)
  
  // 2. Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  if (profileError && profileError.code !== 'PGRST116') {
    console.error('Error fetching profile:', profileError)
  }
  
  if (!profile) {
    console.log('Profile is missing! The database trigger might have failed.')
    console.log('Creating profile manually...')
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'Admin',
        role: 'admin'
      })
      
    if (insertError) {
      console.error('Error creating profile:', insertError)
    } else {
      console.log('✅ Profile created successfully with Admin role!')
    }
  } else {
    console.log('Profile exists. Updating role to admin...')
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id)
      
    if (updateError) {
      console.error('Error updating profile:', updateError)
    } else {
      console.log('✅ Profile role updated to Admin successfully!')
    }
  }
  
  // Let's also check all profiles just in case
  const { data: allProfiles } = await supabase.from('profiles').select('id, email, role')
  console.log('\nAll Profiles in DB:', allProfiles)
}

fixAdminProfile()
