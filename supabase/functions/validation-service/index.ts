
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    if (req.method === 'POST') {
      const { migrationId, validationType } = await req.json()

      // Simulate validation checks
      const validationResult = await performValidation(migrationId, validationType, supabaseClient)

      await supabaseClient
        .from('validation_reports')
        .insert({
          migration_id: migrationId,
          validation_type: validationType,
          source_result: validationResult.source,
          target_result: validationResult.target,
          is_valid: validationResult.isValid,
          discrepancies: validationResult.discrepancies
        })

      return new Response(
        JSON.stringify(validationResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const migrationId = url.searchParams.get('migrationId')

      const { data: reports } = await supabaseClient
        .from('validation_reports')
        .select('*')
        .eq('migration_id', migrationId)
        .order('validated_at', { ascending: false })

      return new Response(
        JSON.stringify(reports),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function performValidation(migrationId: string, validationType: string, supabaseClient: any) {
  // Simulate different validation types
  switch (validationType) {
    case 'row_count':
      return {
        source: { totalRows: 15000 },
        target: { totalRows: 15000 },
        isValid: true,
        discrepancies: null
      }
    
    case 'checksum':
      return {
        source: { checksum: 'abc123def456' },
        target: { checksum: 'abc123def456' },
        isValid: true,
        discrepancies: null
      }
    
    case 'data_integrity':
      return {
        source: { nullValues: 50, duplicates: 0 },
        target: { nullValues: 50, duplicates: 0 },
        isValid: true,
        discrepancies: null
      }
    
    default:
      return {
        source: {},
        target: {},
        isValid: false,
        discrepancies: { error: 'Unknown validation type' }
      }
  }
}
