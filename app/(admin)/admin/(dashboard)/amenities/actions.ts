'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteAmenity(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('amenities')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/amenities')
  return { success: true }
}

export async function createAmenity(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const name_fa = formData.get('name_fa') as string || null
  const icon = formData.get('icon') as string || null
  const category = formData.get('category') as string || null
  const sort_order = formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const { error } = await supabase.from('amenities').insert({
    name,
    name_fa,
    slug,
    icon,
    category,
    sort_order
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/amenities')
  return { success: true }
}

export async function updateAmenity(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const name_fa = formData.get('name_fa') as string || null
  const icon = formData.get('icon') as string || null
  const category = formData.get('category') as string || null
  const sort_order = formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0

  const { error } = await supabase
    .from('amenities')
    .update({
      name,
      name_fa,
      icon,
      category,
      sort_order
    })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/amenities')
  return { success: true }
}
export async function seedAmenities() {
  const supabase = await createClient()

  const defaultAmenities = [
    // Fitness & Wellness
    { name: 'Gym / Health Club', name_fa: 'سالن ورزشی', icon: 'Dumbbell', category: 'Fitness' },
    { name: 'Swimming Pool', name_fa: 'استخر', icon: 'Waves', category: 'Fitness' },
    { name: 'Infinity Pool', name_fa: 'استخر اینفینیتی', icon: 'Waves', category: 'Fitness' },
    { name: 'Private Pool', name_fa: 'استخر اختصاصی', icon: 'Waves', category: 'Fitness' },
    { name: 'Sauna', name_fa: 'سونا', icon: 'Activity', category: 'Wellness' },
    { name: 'Steam Room', name_fa: 'اتاق بخار', icon: 'Wind', category: 'Wellness' },
    { name: 'Spa & Wellness', name_fa: 'اسپا و سلامت', icon: 'Flower2', category: 'Wellness' },
    { name: 'Yoga & Meditation', name_fa: 'یوگا و مدیتیشن', icon: 'Sun', category: 'Wellness' },
    { name: 'Jogging Track', name_fa: 'مسیر پیاده‌روی', icon: 'Footprints', category: 'Fitness' },
    { name: 'Tennis Court', name_fa: 'زمین تنیس', icon: 'Target', category: 'Sports' },
    { name: 'Basketball Court', name_fa: 'زمین بسکتبال', icon: 'Dribbble', category: 'Sports' },
    { name: 'Paddle Tennis', name_fa: 'پدل تنیس', icon: 'Activity', category: 'Sports' },

    // Family & Kids
    { name: "Children's Play Area", name_fa: 'فضای بازی کودکان', icon: 'Baby', category: 'Family' },
    { name: 'Kids Club', name_fa: 'کلوپ کودکان', icon: 'Gamepad2', category: 'Family' },
    { name: 'Nursery / Daycare', name_fa: 'مهدکودک', icon: 'GraduationCap', category: 'Family' },
    { name: 'Kids Pool', name_fa: 'استخر کودکان', icon: 'Waves', category: 'Family' },

    // Leisure & Entertainment
    { name: 'BBQ Area', name_fa: 'فضای باربیکیو', icon: 'Flame', category: 'Leisure' },
    { name: 'Landscaped Gardens', name_fa: 'باغ و فضای سبز', icon: 'Leaf', category: 'Leisure' },
    { name: 'Community Park', name_fa: 'پارک محله', icon: 'TreePine', category: 'Leisure' },
    { name: 'Cinema Room', name_fa: 'سالن سینما', icon: 'Film', category: 'Leisure' },
    { name: 'Library', name_fa: 'کتابخانه', icon: 'Book', category: 'Leisure' },
    { name: 'Games Room', name_fa: 'اتاق بازی', icon: 'Puzzle', category: 'Leisure' },
    { name: 'Sky Lounge', name_fa: 'اسکای لانژ', icon: 'Sunset', category: 'Leisure' },

    // Services & Security
    { name: '24/7 Security', name_fa: 'نگهبانی ۲۴ ساعته', icon: 'ShieldCheck', category: 'Security' },
    { name: 'CCTV Surveillance', name_fa: 'دوربین مداربسته', icon: 'Video', category: 'Security' },
    { name: 'Concierge Service', name_fa: 'خدمات کانسرژ', icon: 'ConciergeBell', category: 'Services' },
    { name: 'Valet Parking', name_fa: 'پارکینگ ولت', icon: 'Car', category: 'Services' },
    { name: 'Housekeeping', name_fa: 'خدمات نظافت', icon: 'Wand2', category: 'Services' },
    { name: 'Laundry Service', name_fa: 'خشکشویی', icon: 'WashingMachine', category: 'Services' },

    // Unit Features
    { name: 'Balcony / Terrace', name_fa: 'بالکن / تراس', icon: 'Layout', category: 'Unit' },
    { name: 'Central A/C', name_fa: 'تهویه مطبوع مرکزی', icon: 'Wind', category: 'Unit' },
    { name: 'Smart Home System', name_fa: 'سیستم هوشمند', icon: 'Cpu', category: 'Unit' },
    { name: 'Built-in Wardrobes', name_fa: 'کمد دیواری', icon: 'Archive', category: 'Unit' },
    { name: 'Maid\'s Room', name_fa: 'اتاق خدمتکار', icon: 'Layout', category: 'Unit' },

    // Transport & Others
    { name: 'Covered Parking', name_fa: 'پارکینگ سرپوشیده', icon: 'Car', category: 'Transport' },
    { name: 'EV Charging', name_fa: 'شارژ خودرو برقی', icon: 'Zap', category: 'Transport' },
    { name: 'Pet Friendly', name_fa: 'مجاز برای حیوانات', icon: 'Dog', category: 'Lifestyle' },
    { name: 'Retail Outlets', name_fa: 'مراکز خرید', icon: 'ShoppingBag', category: 'Lifestyle' },
    { name: 'Business Center', name_fa: 'بیزنس سنتر', icon: 'Briefcase', category: 'Business' },
  ]

  for (const amenity of defaultAmenities) {
    const slug = amenity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    
    // Check if already exists
    const { data: existing } = await supabase.from('amenities').select('id').eq('slug', slug).single()
    if (!existing) {
      await supabase.from('amenities').insert({
        ...amenity,
        slug,
        sort_order: 0
      })
    }
  }

  revalidatePath('/admin/amenities')
  return { success: true }
}
