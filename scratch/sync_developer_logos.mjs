import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function uploadDeveloperLogos() {
  console.log('🚀 Starting developer logo upload and sync...')

  const bucketName = 'developers'
  
  // 1. Ensure bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets.find(b => b.name === bucketName)) {
    console.log(`Creating bucket: ${bucketName}...`)
    await supabase.storage.createBucket(bucketName, { public: true })
  }

  const developersDir = 'public/images/developers'
  const files = fs.readdirSync(developersDir)
  const uploadedUrls = {}

  for (const file of files) {
    const filePath = path.join(developersDir, file)
    const fileBuffer = fs.readFileSync(filePath)
    
    console.log(`Uploading ${file}...`)
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(file, fileBuffer, {
        contentType: file.endsWith('.png') ? 'image/png' : 'image/jpeg',
        upsert: true
      })

    if (uploadError) {
      console.error(`Error uploading ${file}:`, uploadError)
      continue
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(file)

    uploadedUrls[file.split('.')[0]] = publicUrlData.publicUrl
  }

  // 2. Sync database
  console.log('Syncing database...')
  const mappings = [
    { key: 'aldar', name: 'Aldar Properties' },
    { key: 'alef', name: 'Alef Group' },
    { key: 'arada', name: 'ARADA' },
    { key: 'beyond', name: 'Beyond' },
    { key: 'binghati', name: 'Binghatti' },
    { key: 'damac', name: 'DAMAC Properties' },
    { key: 'dubai', name: 'Dubai Properties' },
    { key: 'emaar', name: 'Emaar Properties' },
    { key: 'emaar', name: 'EMAAR PROPERTIES' },
    { key: 'imtiaz', name: 'Imtiaz Developments' },
    { key: 'meraas', name: 'Meraas' },
    { key: 'nakheel', name: 'Nakheel' },
    { key: 'nakheel', name: 'NAKHEEL' },
    { key: 'nshama', name: 'Nshama' },
    { key: 'rak', name: 'RAK Properties' },
    { key: 'sobhan', name: 'Sobha Realty' },
    { key: 'sobhan', name: 'SOBHA REALTY' },
    { key: 'tiger', name: 'Tiger Group' },
    { key: 'wasl', name: 'Wasl' },
    { key: 'wasl', name: 'Wasl Properties' }
  ]

  for (const mapping of mappings) {
    const url = uploadedUrls[mapping.key]
    if (!url) continue

    const { error: updateError } = await supabase
      .from('developers')
      .update({ logo_url: url })
      .ilike('name', mapping.name)

    if (updateError) {
      console.error(`Error updating ${mapping.name}:`, updateError)
    } else {
      console.log(`Updated ${mapping.name} with ${url}`)
    }
  }

  console.log('✅ Developer logo sync complete!')
}

uploadDeveloperLogos().catch(console.error)
