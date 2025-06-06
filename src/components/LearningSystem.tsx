
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from "@/hooks/use-toast"
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Target,
  Clock,
  Database,
  Zap,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Sparkles,
  RefreshCw
} from 'lucide-react'

interface LearningInsight {
  id: string
  type: 'optimization' | 'pattern' | 'recommendation' | 'warning'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  source: string
  timestamp: string
}

interface PerformanceMetric {
  name: string
  value: string
  trend: 'up' | 'down' | 'stable'
  change: string
}

export const LearningSystem: React.FC = () => {
  const [insights, setInsights] = useState<LearningInsight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [learnedPatterns, setLearnedPatterns] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = () => {
    // Mock performance metrics
    setPerformanceMetrics([
      { name: 'Avg Migration Speed', value: '12.5k rows/sec', trend: 'up', change: '+15%' },
      { name: 'Success Rate', value: '97.8%', trend: 'up', change: '+2.1%' },
      { name: 'Avg Complexity Score', value: '6.2/10', trend: 'down', change: '-0.8' },
      { name: 'Field Mapping Accuracy', value: '94.5%', trend: 'up', change: '+5.2%' }
    ])

    // Mock learned patterns
    setLearnedPatterns([
      {
        id: 'batch_size_optimization',
        pattern: 'Optimal Batch Size Pattern',
        description: '10,000 rows shows best performance for PostgreSQL → MongoDB migrations',
        usage: 'Applied in 23 migrations',
        accuracy: 89
      },
      {
        id: 'field_mapping_reuse',
        pattern: 'Field Mapping Reuse',
        description: 'user_id → _id mapping pattern detected across multiple tables',
        usage: 'Reused 47 times',
        accuracy: 94
      },
      {
        id: 'error_prediction',
        pattern: 'Error Prediction Model',
        description: 'Can predict migration failures with 92% accuracy based on schema complexity',
        usage: 'Prevented 12 failures',
        accuracy: 92
      }
    ])

    // Load initial insights
    generateInsights()
  }

  const generateInsights = () => {
    const mockInsights: LearningInsight[] = [
      {
        id: '1',
        type: 'optimization',
        title: 'Batch Size Optimization Detected',
        description: 'Analysis shows 15,000 rows per batch would improve performance by 23% for your current migration pattern',
        impact: 'high',
        confidence: 87,
        source: 'Performance Analysis Engine',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: '2',
        type: 'pattern',
        title: 'Reusable Field Mapping Identified',
        description: 'Similar field mappings detected across 5 tables. Auto-mapping can save 15 minutes of configuration time',
        impact: 'medium',
        confidence: 93,
        source: 'Pattern Recognition System',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Parallel Processing Benefit',
        description: 'Your current dataset size (>100k rows) would benefit from parallel processing. Enable for 40% speed improvement',
        impact: 'high',
        confidence: 78,
        source: 'Performance Optimizer',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: '4',
        type: 'warning',
        title: 'Potential Data Loss Risk',
        description: 'JSON field transformation detected. Recommend validation checks to prevent data structure loss',
        impact: 'medium',
        confidence: 91,
        source: 'Risk Assessment Module',
        timestamp: new Date().toLocaleTimeString()
      }
    ]

    setInsights(mockInsights)
  }

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate new insights
    const newInsight: LearningInsight = {
      id: Date.now().toString(),
      type: 'optimization',
      title: 'New Pattern Discovered',
      description: `Connection pool size of 20 optimal for ${Math.floor(Math.random() * 50 + 10)}k+ row migrations`,
      impact: 'medium',
      confidence: Math.floor(Math.random() * 20 + 80),
      source: 'Real-time Analysis',
      timestamp: new Date().toLocaleTimeString()
    }

    setInsights(prev => [newInsight, ...prev.slice(0, 4)])
    setIsAnalyzing(false)

    toast({
      title: "Analysis Complete",
      description: "New optimization insights have been generated based on recent migrations.",
      duration: 4000,
    })
  }

  const getInsightIcon = (type: LearningInsight['type']) => {
    switch (type) {
      case 'optimization': return <Zap className="h-4 w-4 text-yellow-400" />
      case 'pattern': return <Target className="h-4 w-4 text-blue-400" />
      case 'recommendation': return <Lightbulb className="h-4 w-4 text-green-400" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-400" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />
      case 'down': return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Learning Dashboard
          </CardTitle>
          <Button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            size="sm"
            className="bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Run Analysis
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl border border-white/10">
            <TabsTrigger value="insights" className="data-[state=active]:bg-white/20 text-white">
              <Lightbulb className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-white/20 text-white">
              <Target className="h-4 w-4 mr-2" />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-white/20 text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="text-white font-medium">{insight.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact} impact
                    </Badge>
                    <span className="text-xs text-gray-400">{insight.confidence}% confidence</span>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{insight.source}</span>
                  <span>{insight.timestamp}</span>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            {learnedPatterns.map((pattern) => (
              <div key={pattern.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{pattern.pattern}</h4>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {pattern.accuracy}% accuracy
                  </Badge>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">{pattern.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{pattern.usage}</span>
                  <Progress value={pattern.accuracy} className="w-24 h-2" />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">{metric.name}</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-xs ${
                        metric.trend === 'up' ? 'text-green-400' : 
                        metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white">{metric.value}</div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-5 w-5 text-purple-400" />
                <span className="text-white font-medium">AI Learning Status</span>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                System has processed 127 migrations and identified 23 optimization patterns. 
                Learning accuracy improved by 12% in the last month.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm">Active Learning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">127 Migrations Analyzed</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
