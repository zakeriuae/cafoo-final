
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://navwagghjtiokeatqjdu.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Fetching agents...');
  const { data: agents } = await supabase.from('agents').select('id, name');
  console.log(`Found ${agents.length} agents.`);

  console.log('Fetching properties...');
  const { data: properties } = await supabase.from('properties').select('id');
  
  console.log('Fetching towers...');
  const { data: towers } = await supabase.from('towers').select('id');

  // Update properties
  console.log('Assigning properties...');
  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    const agent = agents[i % agents.length];
    // We try agent_id based on seed.sql
    const { error: updateError } = await supabase
      .from('properties')
      .update({ agent_id: agent.id })
      .eq('id', prop.id);
    
    if (updateError) {
      console.log(`Error updating property ${prop.id}:`, updateError.message);
    }
  }

  // Update towers
  console.log('Assigning towers...');
  for (let i = 0; i < towers.length; i++) {
    const tower = towers[i];
    const agent = agents[i % agents.length];
    const { error: updateError } = await supabase
      .from('towers')
      .update({ assigned_agent_id: agent.id })
      .eq('id', tower.id);
    
    if (updateError) {
       // If assigned_agent_id fails, try agent_id
       console.log(`Error updating tower ${tower.id}, trying agent_id...`);
       const { error: updateError2 } = await supabase
         .from('towers')
         .update({ agent_id: agent.id })
         .eq('id', tower.id);
       if (updateError2) console.log(`Tower ${tower.id} failed both:`, updateError2.message);
    }
  }

  console.log('Seeding completed successfully!');
}

seed();
