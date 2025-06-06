
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface MigrationRequest {
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

export interface DryRunResult {
  migrationId: string
  dryRun: true
  complexityScore: number
  estimatedTime: string
  recommendations: string[]
}

export const useMigrationOrchestrator = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startMigration = async (request: MigrationRequest): Promise<DryRunResult | { migrationId: string; status: string }> => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('migration-orchestrator', {
        body: request
      })

      if (error) throw error
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getMigrationStatus = async (migrationId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('migration-orchestrator', {
        body: { migrationId },
        method: 'GET'
      })

      if (error) throw error
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    }
  }

  const validateMigration = async (migrationId: string, validationType: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('validation-service', {
        body: { migrationId, validationType }
      })

      if (error) throw error
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    }
  }

  return {
    startMigration,
    getMigrationStatus,
    validateMigration,
    isLoading,
    error
  }
}
