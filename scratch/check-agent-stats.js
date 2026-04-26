const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkAgentStats() {
  // 1. Find the agent
  const { data: agents, error: agentError } = await supabase
    .from('agents')
    .select('id, name')
    .or('name.ilike.%Sara%,name.ilike.%Ramezani%');

  if (agentError || !agents || agents.length === 0) {
    console.log("Agent not found.");
    return;
  }

  const agentId = agents[0].id;
  console.log(`Checking stats for agent: ${agents[0].name} (ID: ${agentId})`);

  // 2. Count properties
  const { count: propertyCount, error: propError } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('assigned_agent_id', agentId);

  // 3. Count towers
  const { count: towerCount, error: towerError } = await supabase
    .from('towers')
    .select('*', { count: 'exact', head: true })
    .eq('assigned_agent_id', agentId);

  console.log(`Property count: ${propertyCount}`);
  console.log(`Tower count: ${towerCount}`);
}

checkAgentStats();
