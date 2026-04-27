import { createClient } from "@/lib/supabase/server"
import { AgentForm } from "@/components/admin/agent-form"
import { notFound } from "next/navigation"

export default async function EditAgentPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .single()

  if (!agent) {
    notFound()
  }

  return <AgentForm agent={agent} />
}
