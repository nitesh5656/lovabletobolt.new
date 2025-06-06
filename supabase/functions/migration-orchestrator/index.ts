
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MigrationRequest {
  name: string
  description?: string
  sourceConfig: any
  targetConfig: any
  migrationType: 'full' | 'incremental' | 'schema_only' | 'data_only'
  options?: {
    batchSize?: number
    enableValidation?: boolean
    dryRun?: boolean
  }
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
      const body: MigrationRequest = await req.json()
      
      // Create migration record
      const { data: migration, error } = await supabaseClient
        .from('migrations')
        .insert({
          name: body.name,
          description: body.description,
          source_db_type: body.sourceConfig.type,
          target_db_type: body.targetConfig.type,
          source_config: body.sourceConfig,
          target_config: body.targetConfig,
          migration_type: body.migrationType,
          status: body.options?.dryRun ? 'pending' : 'running',
          created_by: user.id
        })
        .select()
        .single()

      if (error) throw error

      // Log migration start
      await supabaseClient
        .from('migration_logs')
        .insert({
          migration_id: migration.id,
          level: 'info',
          message: `Migration ${body.options?.dryRun ? 'dry run' : 'execution'} started`,
          details: { options: body.options }
        })

      if (body.options?.dryRun) {
        // Perform dry run analysis
        const complexityScore = await calculateComplexityScore(body.sourceConfig, body.targetConfig)
        const estimatedTime = await estimateMigrationTime(body.sourceConfig, complexityScore)
        
        await supabaseClient
          .from('migration_logs')
          .insert({
            migration_id: migration.id,
            level: 'info',
            message: 'Dry run analysis completed',
            details: { 
              complexityScore, 
              estimatedTime,
              recommendations: generateRecommendations(complexityScore)
            }
          })

        return new Response(
          JSON.stringify({
            migrationId: migration.id,
            dryRun: true,
            complexityScore,
            estimatedTime,
            recommendations: generateRecommendations(complexityScore)
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Start actual migration (simplified - would connect to actual DBs)
      startMigrationProcess(migration.id, body, supabaseClient)

      return new Response(
        JSON.stringify({ migrationId: migration.id, status: 'started' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const migrationId = url.searchParams.get('id')

      if (migrationId) {
        const { data: migration } = await supabaseClient
          .from('migrations')
          .select('*')
          .eq('id', migrationId)
          .single()

        return new Response(
          JSON.stringify(migration),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: migrations } = await supabaseClient
        .from('migrations')
        .select('*')
        .order('created_at', { ascending: false })

      return new Response(
        JSON.stringify(migrations),
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

async function calculateComplexityScore(sourceConfig: any, targetConfig: any): Promise<number> {
  // Simplified complexity calculation
  let score = 0
  
  // Different DB types increase complexity
  if (sourceConfig.type !== targetConfig.type) score += 30
  
  // Large table count increases complexity
  const estimatedTables = sourceConfig.estimatedTables || 10
  if (estimatedTables > 50) score += 40
  else if (estimatedTables > 20) score += 20
  
  // Complex data types increase complexity
  if (sourceConfig.hasJsonFields) score += 15
  if (sourceConfig.hasBlobs) score += 25
  
  return Math.min(score, 100)
}

async function estimateMigrationTime(sourceConfig: any, complexityScore: number): Promise<string> {
  const baseTimeMinutes = 30
  const complexityMultiplier = complexityScore / 100
  const estimatedMinutes = baseTimeMinutes + (baseTimeMinutes * complexityMultiplier)
  
  if (estimatedMinutes < 60) {
    return `${Math.round(estimatedMinutes)} minutes`
  } else {
    const hours = Math.round(estimatedMinutes / 60 * 10) / 10
    return `${hours} hours`
  }
}

function generateRecommendations(complexityScore: number): string[] {
  const recommendations = []
  
  if (complexityScore > 70) {
    recommendations.push("Consider breaking this migration into smaller batches")
    recommendations.push("Schedule during low-traffic hours")
    recommendations.push("Ensure adequate backup strategy is in place")
  }
  
  if (complexityScore > 50) {
    recommendations.push("Enable detailed logging for troubleshooting")
    recommendations.push("Consider running validation checks post-migration")
  } else {
    recommendations.push("This migration has low complexity and should complete smoothly")
  }
  
  return recommendations
}

async function startMigrationProcess(migrationId: string, request: MigrationRequest, supabaseClient: any) {
  // This would be replaced with actual database connection and migration logic
  // For now, simulate progress updates
  
  const steps = [
    "Connecting to source database",
    "Analyzing source schema", 
    "Connecting to target database",
    "Creating target schema",
    "Starting data transfer",
    "Validating data integrity",
    "Migration completed"
  ]
  
  for (let i = 0; i < steps.length; i++) {
    setTimeout(async () => {
      const progress = Math.round(((i + 1) / steps.length) * 100)
      
      await supabaseClient
        .from('migrations')
        .update({ 
          progress_percentage: progress,
          status: i === steps.length - 1 ? 'completed' : 'running'
        })
        .eq('id', migrationId)
      
      await supabaseClient
        .from('migration_logs')
        .insert({
          migration_id: migrationId,
          level: 'info',
          message: steps[i],
          details: { progress }
        })
    }, i * 2000) // 2 second intervals
  }
}
