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
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized: Missing authentication token');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the JWT token and get the authenticated user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized: Invalid authentication token');
    }

    const { requestId } = await req.json();

    if (!requestId) {
      throw new Error('Bad Request: requestId is required');
    }

    console.log('Notifying donors for request:', requestId, 'by user:', user.id);

    // Get the blood request details and verify ownership
    const { data: request, error: requestError } = await supabaseClient
      .from('blood_requests')
      .select('*')
      .eq('id', requestId)
      .eq('user_id', user.id)
      .single();

    if (requestError || !request) {
      throw new Error('Blood request not found or access denied');
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

    console.log(`Found ${donors?.length || 0} available donors`);

    // Create instant notifications for all matching donors
    const notificationsCreated: string[] = [];
    
    if (donors && donors.length > 0) {
      for (const donor of donors) {
        const isMatchingBloodType = donor.blood_type === request.blood_type;
        const isNearby = donor.location.toLowerCase().includes(request.location.toLowerCase()) || 
                        request.location.toLowerCase().includes(donor.location.toLowerCase());
        
        // Determine priority based on blood type match and location proximity
        let priority = 'LOW';
        if (isMatchingBloodType && isNearby) {
          priority = 'HIGH';
        } else if (isMatchingBloodType) {
          priority = 'MEDIUM';
        }
        
        // Create notification message
        const message = `🩸 ${priority} PRIORITY: ${request.blood_type} blood needed at ${request.hospital_name}, ${request.location}. ${request.units_required} units required. Urgency: ${request.urgency.toUpperCase()}. Contact: ${request.contact_number}`;
        
        // Insert notification into database for instant delivery
        const { error: notifyError } = await supabaseClient
          .from('donor_notifications')
          .insert({
            donor_id: donor.id,
            blood_request_id: requestId,
            message: message,
            priority: priority
          });
        
        if (notifyError) {
          console.error(`Failed to notify donor ${donor.full_name}:`, notifyError);
        } else {
          notificationsCreated.push(donor.full_name);
          console.log(`✅ [${priority}] Notified ${donor.full_name} (${donor.blood_type}) - ${donor.contact_number}`);
        }
      }
    }

    console.log(`Successfully created ${notificationsCreated.length} notifications`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Instantly notified ${notificationsCreated.length} donors`,
        donorsNotified: notificationsCreated.length,
        notifiedDonors: notificationsCreated
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
