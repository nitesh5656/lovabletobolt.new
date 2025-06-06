
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface ComplexityIndicatorProps {
  score: number
  showDetails?: boolean
  className?: string
}

export const ComplexityIndicator: React.FC<ComplexityIndicatorProps> = ({ 
  score, 
  showDetails = false,
  className = ''
}) => {
  const getComplexityData = (score: number) => {
    if (score < 30) {
      return {
        level: 'Low',
        color: 'bg-green-500',
        textColor: 'text-green-400',
        icon: CheckCircle,
        description: 'Migration should proceed smoothly with minimal risk.'
      }
    }
    if (score < 70) {
      return {
        level: 'Medium',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-400',
        icon: AlertTriangle,
        description: 'Some complexity detected. Review recommendations carefully.'
      }
    }
    return {
      level: 'High',
      color: 'bg-red-500',
      textColor: 'text-red-400',
      icon: AlertTriangle,
      description: 'High complexity migration. Consider breaking into smaller batches.'
    }
  }

  const complexity = getComplexityData(score)
  const Icon = complexity.icon

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className={`h-4 w-4 ${complexity.textColor}`} />
          <span className="text-white font-medium">Complexity Score</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold">{score}%</span>
          <Badge className={`${complexity.color} text-white`}>
            {complexity.level} Risk
          </Badge>
        </div>
      </div>
      
      <Progress 
        value={score} 
        className="h-2"
      />
      
      {showDetails && (
        <p className="text-sm text-gray-300">
          {complexity.description}
        </p>
      )}
    </div>
  )
}
