'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Upload, X, Loader2, FileText, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
  bucket: string
  folder: string
  initialUrl?: string
  label?: string
  accept?: string
  name: string // input name for form
  placeholder?: string
  onUpload?: (url: string) => void
}

export function FileUploader({
  bucket,
  folder,
  initialUrl = '',
  label,
  accept = '*',
  name,
  placeholder = 'Upload file',
  onUpload
}: FileUploaderProps) {
  const [url, setUrl] = useState(initialUrl)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    const supabase = createClient()
    setUploading(true)

    try {
      // Validate size (e.g. 20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 20MB)`)
        return
      }

      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const filePath = `${folder}/${fileName}`

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: false })

      if (error) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      setUrl(publicUrl)
      if (onUpload) onUpload(publicUrl)
      toast.success('File uploaded successfully')
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ''
  }

  const removeFile = async () => {
    if (!url) return
    const supabase = createClient()
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split(`/object/public/${bucket}/`)
      if (pathParts.length > 1) {
        await supabase.storage.from(bucket).remove([pathParts[1]])
      }
    } catch (e) {}
    setUrl('')
    toast.success('File removed')
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <input type="hidden" name={name} value={url} />
      
      {!url ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors",
            uploading && "opacity-50 pointer-events-none"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">{uploading ? 'Uploading...' : placeholder}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {url.split('/').pop()}
            </p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download
            </a>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={removeFile}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
