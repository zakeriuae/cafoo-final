'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'
import { getImageUrl, type ImageSize } from '@/lib/image-utils'
import { cn } from '@/lib/utils'

interface SmartImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined
  size?: ImageSize
  /** If true, clicking opens the original full-size image in a lightbox */
  lightbox?: boolean
  fallback?: string
}

/**
 * SmartImage — drop-in replacement for next/image that automatically
 * uses the correct Supabase-transformed URL for each context.
 *
 * Usage:
 *   <SmartImage src={url} size="card" fill />           // card thumbnail
 *   <SmartImage src={url} size="preview" fill lightbox />  // gallery preview with click-to-expand
 *   <SmartImage src={url} size="thumb" width={80} height={80} />  // avatar
 */
export function SmartImage({
  src,
  size = 'preview',
  lightbox = false,
  fallback = '/images/placeholder.jpg',
  className,
  alt = '',
  ...props
}: SmartImageProps) {
  const [open, setOpen] = useState(false)
  const [imgError, setImgError] = useState(false)

  const displaySrc = imgError
    ? fallback
    : getImageUrl(src, size)

  const originalSrc = getImageUrl(src, 'original')

  return (
    <>
      <Image
        src={displaySrc}
        alt={alt}
        className={cn(className, lightbox && 'cursor-zoom-in')}
        unoptimized
        onError={() => setImgError(true)}
        onClick={lightbox ? () => setOpen(true) : undefined}
        {...props}
      />

      {/* Lightbox overlay */}
      {lightbox && open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors text-3xl font-light leading-none"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ×
          </button>

          {/* Download link */}
          <a
            href={originalSrc}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="absolute top-4 left-4 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            ↓ Download Original
          </a>

          {/* The full-res image */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalSrc}
              alt={alt}
              className="w-full h-full object-contain rounded-xl shadow-2xl"
              style={{ maxHeight: '90vh' }}
            />
          </div>
        </div>
      )}
    </>
  )
}
