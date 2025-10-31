import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { requestId } = await req.json();

    console.log('Notifying donors for request:', requestId);

    // Get the blood request details
    const { data: request, error: requestError } = await supabaseClient
      .from('blood_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError) {
      throw new Error(`Failed to fetch request: ${requestError.message}`);
    }

    console.log('Blood request:', request);

    // Find ALL available donors (notify everyone about urgent requests)
    const { data: donors, error: donorsError } = await supabaseClient
      .from('donors')
      .select('*')
      .eq('is_available', true);

    if (donorsError) {
      throw new Error(`Failed to fetch donors: ${donorsError.message}`);
    }

    console.log(`Found ${donors?.length || 0} matching donors`);

    // In a real application, you would send SMS/email notifications here
    // For now, we'll just log the notification
    if (donors && donors.length > 0) {
      for (const donor of donors) {
        const isMatchingBloodType = donor.blood_type === request.blood_type;
        const isNearby = donor.location.toLowerCase().includes(request.location.toLowerCase());
        const priority = isMatchingBloodType && isNearby ? 'HIGH' : isMatchingBloodType ? 'MEDIUM' : 'LOW';
        
        console.log(`[${priority} PRIORITY] Notifying donor ${donor.full_name} (${donor.blood_type}) at ${donor.contact_number}`);
        console.log(`Request: ${request.blood_type} blood needed at ${request.hospital_name}, ${request.location}`);
        // TODO: Integrate with SMS/Email service
        // Example: await sendSMS(donor.contact_number, `[${priority}] Blood Request: ${request.blood_type} needed at ${request.hospital_name}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Notified ${donors?.length || 0} matching donors`,
        donorsNotified: donors?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in notify-donors function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
