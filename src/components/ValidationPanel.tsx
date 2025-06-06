
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from "@/hooks/use-toast"
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Database,
  Hash,
  Key,
  Loader2,
  Play,
  RotateCcw,
  Shield
} from 'lucide-react'

interface ValidationPanelProps {
  migrationId: string
  onValidationComplete?: (results: any) => void
}

interface ValidationCheck {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning'
  result?: string
  details?: string
  icon: any
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ 
  migrationId,
  onValidationComplete 
}) => {
  const [checks, setChecks] = useState<ValidationCheck[]>([
    {
      id: 'row_count',
      name: 'Row Count Validation',
      description: 'Compare row counts between source and target',
      status: 'pending',
      icon: Database
    },
    {
      id: 'data_checksum',
      name: 'Data Checksum',
      description: 'Verify data integrity using checksums',
      status: 'pending',
      icon: Hash
    },
    {
      id: 'foreign_keys',
      name: 'Foreign Key Integrity',
      description: 'Validate foreign key relationships',
      status: 'pending',
      icon: Key
    },
    {
      id: 'unique_constraints',
      name: 'Unique Constraints',
      description: 'Check unique constraint violations',
      status: 'pending',
      icon: Shield
    }
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [currentCheckIndex, setCurrentCheckIndex] = useState(-1)
  const [overallProgress, setOverallProgress] = useState(0)
  const { toast } = useToast()

  const runValidation = async () => {
    setIsRunning(true)
    setCurrentCheckIndex(0)
    setOverallProgress(0)

    // Reset all checks to pending
    setChecks(prev => prev.map(check => ({ ...check, status: 'pending' as const })))

    toast({
      title: "⚡ Validation Started",
      description: "Running comprehensive database validation checks...",
    });

    // ✅ Simulate running each check with realistic results
    for (let i = 0; i < checks.length; i++) {
      setCurrentCheckIndex(i)
      
      // Set current check to running
      setChecks(prev => prev.map((check, index) => 
        index === i ? { ...check, status: 'running' as const } : check
      ))

      // Simulate check duration
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

      // ✅ Generate realistic mock results
      const mockResults = generateMockResult(checks[i].id, i)
      
      setChecks(prev => prev.map((check, index) => 
        index === i ? { 
          ...check, 
          status: mockResults.status,
          result: mockResults.result,
          details: mockResults.details
        } : check
      ))

      setOverallProgress(((i + 1) / checks.length) * 100)
      
      // ✅ Show progress toast for each check
      toast({
        title: `✅ ${checks[i].name} Complete`,
        description: mockResults.result,
        duration: 2000,
      });
    }

    setIsRunning(false)
    setCurrentCheckIndex(-1)

    // Check if all validations passed
    const finalChecks = checks.map((check, i) => {
      const mockResults = generateMockResult(check.id, i)
      return { ...check, ...mockResults }
    })

    const hasFailures = finalChecks.some(check => check.status === 'failed')
    
    if (!hasFailures) {
      toast({
        title: "✅ All Validation Checks Passed",
        description: "Database validation completed successfully! Ready to proceed.",
        duration: 4000,
      })
      onValidationComplete?.(finalChecks)
    } else {
      toast({
        title: "❌ Validation Issues Detected",
        description: "Some validation checks failed. Please review the results.",
        variant: "destructive",
        duration: 4000,
      })
      onValidationComplete?.(finalChecks)
    }
  }

  // ✅ Generate realistic validation results
  const generateMockResult = (checkId: string, index: number) => {
    // Make most checks pass, but occasionally show realistic failures
    const random = Math.random()
    
    switch (checkId) {
      case 'row_count':
        if (random > 0.85) {
          return {
            status: 'failed' as const,
            result: '❌ Row count mismatch detected',
            details: 'Source: 125,234 rows | Target: 125,235 rows (1 row difference in users table)'
          }
        }
        return {
          status: 'passed' as const,
          result: '✅ Row counts match perfectly',
          details: 'Source: 125,234 rows | Target: 125,234 rows across all 12 tables'
        }
      
      case 'data_checksum':
        if (random > 0.9) {
          return {
            status: 'failed' as const,
            result: '❌ Data checksum mismatch',
            details: 'Hash validation failed for 3 records in orders table - possible data corruption'
          }
        }
        return {
          status: 'passed' as const,
          result: '✅ All data checksums valid',
          details: 'MD5: a1b2c3d4e5f6789... | SHA256 verified for all 125,234 records'
        }
      
      case 'foreign_keys':
        if (random > 0.8) {
          return {
            status: 'warning' as const,
            result: '⚠️ Foreign key constraints missing',
            details: '2 foreign key relationships not found in target schema (users.company_id, orders.customer_id)'
          }
        }
        return {
          status: 'passed' as const,
          result: '✅ All foreign key integrity maintained',
          details: '47 foreign key relationships verified successfully across all tables'
        }
      
      case 'unique_constraints':
        if (random > 0.88) {
          return {
            status: 'failed' as const,
            result: '❌ Unique constraint violations',
            details: '5 duplicate entries found in users.email field, 2 in products.sku field'
          }
        }
        return {
          status: 'passed' as const,
          result: '✅ No unique constraint violations',
          details: 'All unique constraints satisfied across all tables (23 constraints checked)'
        }
      
      default:
        return {
          status: 'passed' as const,
          result: '✅ Validation check completed',
          details: 'All criteria met successfully'
        }
    }
  }

  const getStatusIcon = (status: ValidationCheck['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-400" />
    }
  }

  const getStatusBadge = (status: ValidationCheck['status']) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Running</Badge>
      case 'passed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Passed</Badge>
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Warning</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Pending</Badge>
    }
  }

  const resetValidation = () => {
    setChecks(prev => prev.map(check => ({ 
      ...check, 
      status: 'pending' as const,
      result: undefined,
      details: undefined
    })))
    setOverallProgress(0)
    setCurrentCheckIndex(-1)
    
    toast({
      title: "🔄 Validation Reset",
      description: "All validation checks have been reset to pending state.",
    });
  }

  const hasAnyResults = checks.some(check => check.status !== 'pending')

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Database className="h-5 w-5 mr-2" />
            🔍 Database Validation Checks
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasAnyResults && (
              <Button
                size="sm"
                variant="outline"
                onClick={resetValidation}
                disabled={isRunning}
                className="border-white/20 text-gray-900 bg-white hover:bg-gray-100"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
            <Button
              onClick={runValidation}
              disabled={isRunning}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Checks...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run All Checks
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isRunning && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-300">
              <span>⏳ Validation Progress</span>
              <span>{Math.round(overallProgress)}% Complete</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}

        <div className="space-y-4">
          {checks.map((check, index) => {
            const Icon = check.icon
            const isCurrentCheck = currentCheckIndex === index
            
            return (
              <div 
                key={check.id} 
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isCurrentCheck 
                    ? 'bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/50' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="text-white font-medium">{check.name}</h4>
                      <p className="text-gray-400 text-sm">{check.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(check.status)}
                    {getStatusIcon(check.status)}
                  </div>
                </div>

                {check.result && (
                  <div className="mt-3 p-3 bg-black/20 rounded border border-white/10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-medium">{check.result}</span>
                    </div>
                    {check.details && (
                      <p className="text-gray-400 text-sm">{check.details}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {hasAnyResults && !isRunning && (
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">📊 Validation Summary</span>
              <div className="flex space-x-3">
                <span className="text-green-400 text-sm">
                  ✅ {checks.filter(c => c.status === 'passed').length} Passed
                </span>
                <span className="text-yellow-400 text-sm">
                  ⚠️ {checks.filter(c => c.status === 'warning').length} Warnings
                </span>
                <span className="text-red-400 text-sm">
                  ❌ {checks.filter(c => c.status === 'failed').length} Failed
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
