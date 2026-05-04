"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createAgent, updateAgent } from "@/app/(admin)/admin/(dashboard)/agents/actions"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ImageUploader } from "@/components/admin/image-uploader"
import type { Agent } from "@/lib/database.types"

interface AgentFormProps {
  agent?: Agent | null
}

export function AgentForm({ agent }: AgentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!agent

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      if (isEdit && agent) {
        const result = await updateAgent(agent.id, formData)
        if (result.error) {
          setError(result.error)
          return
        }
      } else {
        const result = await createAgent(formData)
        if (result.error) {
          setError(result.error)
          return
        }
      }
      router.push("/admin/agents")
      router.refresh()
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/agents">
          <Button type="button" variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Agent" : "Add New Agent"}
        </h1>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name (English) *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={agent?.name || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_fa">Name (Farsi)</Label>
                <Input
                  id="name_fa"
                  name="name_fa"
                  defaultValue={agent?.name_fa || ""}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title (English)</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={agent?.title || ""}
                  placeholder="e.g., Senior Property Consultant"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_fa">Title (Farsi)</Label>
                <Input
                  id="title_fa"
                  name="title_fa"
                  defaultValue={agent?.title_fa || ""}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={agent?.slug || ""}
                placeholder="agent-name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                name="experience_years"
                type="number"
                min="0"
                defaultValue={agent?.experience_years || 0}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={agent?.email || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={agent?.phone || ""}
                placeholder="+971 50 XXX XXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                defaultValue={agent?.whatsapp || ""}
                placeholder="+971 50 XXX XXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Languages (comma separated)</Label>
              <Input
                id="languages"
                name="languages"
                defaultValue={agent?.languages?.join(", ") || ""}
                placeholder="English, Arabic, Farsi"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (English)</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={agent?.bio || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio_fa">Bio (Farsi)</Label>
              <Textarea
                id="bio_fa"
                name="bio_fa"
                rows={4}
                defaultValue={agent?.bio_fa || ""}
                dir="rtl"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images & Social</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-6">
              <ImageUploader
                bucket="media"
                folder={`agents/${agent?.slug || 'new'}/avatar`}
                initialImages={agent?.avatar_url ? [agent.avatar_url] : []}
                maxFiles={1}
                label="Agent Avatar"
                coverImageName="avatar_url"
              />

              <ImageUploader
                bucket="media"
                folder={`agents/${agent?.slug || 'new'}/cover`}
                initialImages={agent?.cover_image_url ? [agent.cover_image_url] : []}
                maxFiles={1}
                label="Cover Image"
                coverImageName="cover_image_url"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="social_instagram">Instagram</Label>
                <Input
                  id="social_instagram"
                  name="social_instagram"
                  defaultValue={agent?.social_instagram || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_linkedin">LinkedIn</Label>
                <Input
                  id="social_linkedin"
                  name="social_linkedin"
                  defaultValue={agent?.social_linkedin || ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Status & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={agent?.status || "published"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="featured"
                  name="featured"
                  defaultChecked={agent?.featured || false}
                />
                <Label htmlFor="featured">Featured Agent</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  defaultValue={agent?.sort_order || 0}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/admin/agents">
          <Button type="button" variant="outline">Cancel</Button>
        </Link>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update Agent" : "Create Agent"}
        </Button>
      </div>
    </form>
  )
}
