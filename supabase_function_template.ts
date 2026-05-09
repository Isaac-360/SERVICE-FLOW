// Supabase Edge Function: notify
// This function is triggered by a database webhook on the 'notifications' table

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const HUBTEL_CLIENT_ID = Deno.env.get('HUBTEL_CLIENT_ID')
const HUBTEL_CLIENT_SECRET = Deno.env.get('HUBTEL_CLIENT_SECRET')
const HUBTEL_SENDER_ID = Deno.env.get('HUBTEL_SENDER_ID') || 'ServiceFlow'

serve(async (req) => {
  try {
    const { record } = await req.json()

    // 1. Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Fetch User's phone number from profiles
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('contact')
      .eq('id', record.user_id)
      .single()

    if (!profile?.contact) {
      console.error('No contact number found for user:', record.user_id)
      return new Response(JSON.stringify({ error: 'No contact number' }), { status: 400 })
    }

    // 3. Dispatch SMS via Hubtel (Example)
    // You can swap this with Twilio or any other provider
    console.log(`--- DISPATCHING SMS TO ${profile.contact} ---`)
    
    /* 
    const hubtelUrl = `https://smsc.hubtel.com/v1/messages/send?clientid=${HUBTEL_CLIENT_ID}&clientsecret=${HUBTEL_CLIENT_SECRET}&from=${HUBTEL_SENDER_ID}&to=${profile.contact}&content=${encodeURIComponent(record.message)}`
    
    const response = await fetch(hubtelUrl)
    const result = await response.json()
    */

    // 4. Update notification status in DB
    await supabaseAdmin
      .from('notifications')
      .update({ status: 'sent' })
      .eq('id', record.id)

    return new Response(JSON.stringify({ success: true }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
