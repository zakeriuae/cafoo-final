'use client'

import { useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Upload, X, Star, Loader2, GripVertical, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  bucket: string           // e.g. 'media'
  folder: string           // e.g. 'properties/my-property-slug'
  initialImages?: string[] // existing URLs from DB
  coverImageName?: string  // hidden input name for cover (default: 'cover_image_url')
  galleryName?: string     // hidden input name for gallery (default: 'gallery')
  label?: string
  maxFiles?: number        // Limit number of images (e.g. 1 for avatar)
}

export function ImageUploader({
  bucket,
  folder,
  initialImages = [],
  coverImageName = 'cover_image_url',
  galleryName = 'gallery',
  label = 'Images',
  maxFiles = 0, // 0 means unlimited
}: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = useCallback(async (files: File[]) => {
    const supabase = createClient()
    setUploading(true)
    const newUrls: string[] = []

    // If maxFiles is 1, we replace the existing image instead of adding to it
    const isSingle = maxFiles === 1
    const currentCount = isSingle ? 0 : images.length
    const allowedNew = maxFiles > 0 ? maxFiles - currentCount : files.length
    const filesToUpload = files.slice(0, allowedNew)

    if (filesToUpload.length < files.length && maxFiles > 0) {
      toast.warning(`Only ${allowedNew} more image(s) allowed`)
    }

    for (const file of filesToUpload) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`)
        continue
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`)
        continue
      }

      // Create unique file path
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const filePath = `${folder}/${fileName}`

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: false })

      if (error) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`)
        continue
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      newUrls.push(publicUrl)
    }

    setImages((prev) => isSingle ? newUrls : [...prev, ...newUrls])
    if (newUrls.length > 0) toast.success(`${newUrls.length} image(s) uploaded`)
    setUploading(false)
  }, [bucket, folder, images.length, maxFiles])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) uploadFiles(files)
    e.target.value = '' // reset so same file can be re-selected
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) uploadFiles(files)
  }

  const removeImage = async (url: string, index: number) => {
    // Extract path from URL and delete from storage
    const supabase = createClient()
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split(`/object/public/${bucket}/`)
    if (pathParts.length > 1) {
      await supabase.storage.from(bucket).remove([pathParts[1]])
    }
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const setCoverImage = (index: number) => {
    if (index === 0) return
    setImages((prev) => {
      const next = [...prev]
      const [item] = next.splice(index, 1)
      next.unshift(item)
      return next
    })
    toast.success('Cover image updated')
  }

  // Drag-to-reorder
  const handleDragStart = (index: number) => setDragIndex(index)
  const handleDragEnter = (index: number) => setDragOverIndex(index)
  const handleDragEnd = () => {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      setImages((prev) => {
        const next = [...prev]
        const [item] = next.splice(dragIndex, 1)
        next.splice(dragOverIndex, 0, item)
        return next
      })
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const coverImage = images[0] || ''
  const galleryJson = JSON.stringify(images)
  const isMaxReached = maxFiles > 0 && images.length >= maxFiles

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {/* Hidden inputs for form submission */}
      <input type="hidden" name={coverImageName} value={coverImage} />
      <input type="hidden" name={galleryName} value={galleryJson} />

      {/* Drop Zone */}
      {!isMaxReached && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
            dragOver
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={maxFiles !== 1}
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <p className="font-medium text-sm">
                {uploading ? 'Uploading...' : 'Click or drag images here'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WEBP up to 10MB each
                {maxFiles === 1 ? ' — single image only' : maxFiles > 0 ? ` — up to ${maxFiles} images` : ' — unlimited images'}
              </p>
            </div>
            {!uploading && (
              <Button type="button" size="sm" variant="outline" className="mt-1">
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          {maxFiles !== 1 && (
            <p className="text-sm text-muted-foreground">
              {images.length} image{images.length !== 1 ? 's' : ''} {maxFiles > 0 && `(max ${maxFiles})`} · First image is cover · Drag to reorder
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((url, index) => (
              <div
                key={url}
                draggable={maxFiles !== 1}
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'relative group aspect-square rounded-lg overflow-hidden border-2 transition-all',
                  index === 0 && maxFiles !== 1 ? 'border-primary' : 'border-transparent',
                  dragOverIndex === index && dragIndex !== index
                    ? 'border-blue-400 scale-105'
                    : ''
                )}
              >
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* Cover Badge */}
                {index === 0 && maxFiles !== 1 && (
                  <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Cover
                  </div>
                )}
                {/* Drag Handle */}
                {maxFiles !== 1 && (
                  <div className="absolute top-1 right-7 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-5 h-5 bg-black/60 rounded flex items-center justify-center cursor-grab">
                      <GripVertical className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(url, index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                {/* Set as Cover */}
                {index !== 0 && maxFiles !== 1 && (
                  <button
                    type="button"
                    onClick={() => setCoverImage(index)}
                    className="absolute bottom-1 left-1 right-1 bg-black/70 hover:bg-black/90 text-white text-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1"
                  >
                    <Star className="w-3 h-3" />
                    Set as Cover
                  </button>
                )}
              </div>
            ))}
            {/* Upload More Tile */}
            {!isMaxReached && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-xs">Add more</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
