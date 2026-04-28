/**
 * Supabase Image Transform Utility
 *
 * Uses Supabase's built-in image transformation API to serve images
 * at the right size for each context — no extra files needed.
 *
 * Transform URL format:
 *   /storage/v1/render/image/public/{bucket}/{path}?width=400&quality=75
 *
 * Sizes:
 *   - card:    400×280  quality 80  (project/property cards)
 *   - preview: 1200×800 quality 85  (detail page gallery)
 *   - thumb:   80×80    quality 70  (avatars, logos)
 *   - original: (no transform — for full-size download / lightbox)
 */

export type ImageSize = 'card' | 'preview' | 'thumb' | 'original'

interface TransformOptions {
  width: number
  height?: number
  quality: number
  resize?: 'cover' | 'contain' | 'fill'
}

const SIZE_MAP: Record<Exclude<ImageSize, 'original'>, TransformOptions> = {
  card: { width: 600, height: 400, quality: 80, resize: 'cover' },
  preview: { width: 1400, quality: 85, resize: 'cover' },
  thumb: { width: 160, height: 160, quality: 75, resize: 'cover' },
}

/**
 * Convert a Supabase public storage URL into a transformed URL.
 * Non-Supabase URLs are returned unchanged.
 *
 * @example
 * getImageUrl(url, 'card')    // 600px wide thumbnail for cards
 * getImageUrl(url, 'preview') // 1400px wide for gallery
 * getImageUrl(url, 'original') // untouched original
 */
export function getImageUrl(url: string | null | undefined, size: ImageSize = 'original'): string {
  if (!url) return '/images/placeholder.jpg'

  // Only transform Supabase storage URLs
  if (!url.includes('supabase.co/storage')) return url

  // If original requested, return as-is (but remove any old cache-bust params)
  if (size === 'original') return url.split('?')[0]

  // Convert /object/public/ → /render/image/public/
  const renderUrl = url
    .split('?')[0]
    .replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')

  const opts = SIZE_MAP[size]
  const params = new URLSearchParams()
  params.set('width', String(opts.width))
  if (opts.height) params.set('height', String(opts.height))
  params.set('quality', String(opts.quality))
  if (opts.resize) params.set('resize', opts.resize)

  return `${renderUrl}?${params.toString()}`
}

/**
 * For use in <Image> components: returns the src for each context
 * and adds unoptimized=true hint since Supabase handles optimization.
 */
export function getImageProps(
  url: string | null | undefined,
  size: ImageSize = 'original'
) {
  return {
    src: getImageUrl(url, size),
    unoptimized: true, // Supabase CDN handles optimization
  }
}
