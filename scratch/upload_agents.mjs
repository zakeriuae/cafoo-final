import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function uploadAndSync() {
  console.log('🚀 Starting agent image upload and sync...')

  // 1. Ensure bucket exists
  const bucketName = 'agents'
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) throw listError

  if (!buckets.find(b => b.name === bucketName)) {
    console.log(`Creating bucket: ${bucketName}...`)
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true
    })
    if (createError) throw createError
  }

  // 2. Upload images
  const agentsDir = 'public/images/agents'
  const files = ['agent-1.jpg', 'agent-2.jpg', 'agent-3.jpg', 'agent-4.jpg']
  const uploadedUrls = {}

  for (const file of files) {
    const filePath = path.join(agentsDir, file)
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`)
      continue
    }

    const fileBuffer = fs.readFileSync(filePath)
    console.log(`Uploading ${file}...`)
    
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(file, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      })

    if (uploadError) {
      console.error(`Error uploading ${file}:`, uploadError)
      continue
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(file)

    uploadedUrls[file] = publicUrlData.publicUrl
    console.log(`Uploaded ${file} -> ${uploadedUrls[file]}`)
  }

  // 3. Update database
  console.log('Syncing database...')
  const agentMappings = [
    { slug: 'ahmad-al-rashid', file: 'agent-1.jpg' },
    { slug: 'fatima-hassan', file: 'agent-2.jpg' },
    { slug: 'raj-patel', file: 'agent-3.jpg' },
    { slug: 'elena-volkov', file: 'agent-4.jpg' },
    { slug: 'ali-karimi', file: 'agent-1.jpg' } // reuse
  ]

  for (const mapping of agentMappings) {
    const url = uploadedUrls[mapping.file]
    if (!url) continue

    const { error: updateError } = await supabase
      .from('agents')
      .update({ avatar_url: url })
      .eq('slug', mapping.slug)

    if (updateError) {
      console.error(`Error updating agent ${mapping.slug}:`, updateError)
    } else {
      console.log(`Updated agent ${mapping.slug} with ${url}`)
    }
  }

  console.log('✅ Sync complete!')
}

uploadAndSync().catch(console.error)
