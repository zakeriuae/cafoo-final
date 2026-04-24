"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Heart, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SavePropertyButtonProps {
  propertyId: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showText?: boolean
}

export function SavePropertyButton({
  propertyId,
  variant = "outline",
  size = "default",
  className,
  showText = true,
}: SavePropertyButtonProps) {
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    checkIfSaved()
  }, [propertyId])

  const checkIfSaved = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setIsLoading(false)
      return
    }

    const { data } = await supabase
      .from("saved_properties")
      .select("id")
      .eq("user_id", user.id)
      .eq("property_id", propertyId)
      .single()

    setIsSaved(!!data)
    setIsLoading(false)
  }

  const handleToggle = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Redirect to login
      router.push(`/auth/login?next=${window.location.pathname}`)
      return
    }

    setIsToggling(true)

    if (isSaved) {
      // Remove from saved
      await supabase
        .from("saved_properties")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", propertyId)
      setIsSaved(false)
    } else {
      // Add to saved
      await supabase.from("saved_properties").insert({
        user_id: user.id,
        property_id: propertyId,
      })
      setIsSaved(true)
    }

    setIsToggling(false)
  }

  if (isLoading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        {showText && <span className="ml-2">Loading...</span>}
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        className,
        isSaved && "text-red-500 hover:text-red-600"
      )}
      onClick={handleToggle}
      disabled={isToggling}
    >
      {isToggling ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
      )}
      {showText && (
        <span className="ml-2">{isSaved ? "Saved" : "Save"}</span>
      )}
    </Button>
  )
}
