'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Download, Maximize2, Minimize2 } from 'lucide-react'
import { getImageUrl } from '@/lib/image-utils'
import { cn } from '@/lib/utils'

interface GalleryLightboxProps {
  images: string[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  alt?: string
}

export function GalleryLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  alt = 'Gallery image'
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen, initialIndex])

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, nextImage, prevImage, onClose])

  if (!isOpen) return null

  const currentOriginal = getImageUrl(images[currentIndex], 'original')

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center select-none backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 h-20 px-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-xs font-black tracking-[0.2em] uppercase">
            {currentIndex + 1} <span className="mx-2">/</span> {images.length}
          </span>
          <a
            href={currentOriginal}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="hidden md:flex items-center gap-2 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-3 h-3" />
            Download Original
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-3 text-white/60 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button 
            onClick={onClose}
            className="p-3 text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 md:left-8 z-30 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all backdrop-blur-md"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 md:right-8 z-30 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all backdrop-blur-md"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* The Image */}
        <div className={cn(
          "relative transition-all duration-500 ease-out flex items-center justify-center",
          isFullscreen ? "w-full h-full" : "max-w-[90vw] max-h-[80vh] w-full h-full"
        )}
        onClick={onClose}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={currentIndex}
            src={currentOriginal}
            alt={`${alt} ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-sm shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-0 inset-x-0 h-28 px-6 pb-6 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar z-20 bg-gradient-to-t from-black/60 to-transparent">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 border-2",
                currentIndex === idx ? "border-primary scale-110 shadow-lg shadow-primary/20" : "border-transparent opacity-40 hover:opacity-100"
              )}
            >
              <img 
                src={getImageUrl(img, 'thumb')} 
                alt="" 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
