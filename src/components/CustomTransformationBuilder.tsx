
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  Scissors, 
  Merge, 
  Type, 
  Code, 
  Trash2,
  Settings,
  Wand2,
  CheckCircle
} from 'lucide-react'

interface TransformationRule {
  id: string
  type: 'split' | 'merge' | 'cast' | 'json' | 'truncate' | 'format'
  sourceField: string
  targetField: string
  parameters: any
  description: string
}

interface CustomTransformationBuilderProps {
  onRulesChange?: (rules: TransformationRule[]) => void
}

export const CustomTransformationBuilder: React.FC<CustomTransformationBuilderProps> = ({ 
  onRulesChange 
}) => {
  const [rules, setRules] = useState<TransformationRule[]>([])
  const [newRuleType, setNewRuleType] = useState<string>('')
  const [isAddingRule, setIsAddingRule] = useState(false)
  const { toast } = useToast()

  // ✅ Mock field options for demonstrations
  const mockFields = [
    'users.full_name', 'users.email', 'users.created_at',
    'orders.order_date', 'orders.customer_id', 'orders.total_amount',
    'products.name', 'products.description', 'products.metadata'
  ]

  const ruleTypes = [
    {
      type: 'split',
      label: 'Split Field',
      icon: Scissors,
      description: 'Split a single field into multiple fields',
      example: 'Split full_name into first_name, last_name'
    },
    {
      type: 'merge',
      label: 'Merge Fields', 
      icon: Merge,
      description: 'Combine multiple fields into one',
      example: 'Merge first_name + last_name into full_name'
    },
    {
      type: 'cast',
      label: 'Type Conversion',
      icon: Type,
      description: 'Convert field data type',
      example: 'Convert VARCHAR to INTEGER'
    },
    {
      type: 'json',
      label: 'JSON Transform',
      icon: Code,
      description: 'Extract or transform JSON data',
      example: 'Extract metadata.category from JSON'
    }
  ]

  const addRule = (type: string) => {
    const ruleType = ruleTypes.find(rt => rt.type === type)
    if (!ruleType) return

    // ✅ Generate realistic rule based on type
    const newRule: TransformationRule = {
      id: `rule_${Date.now()}`,
      type: type as any,
      sourceField: mockFields[Math.floor(Math.random() * mockFields.length)],
      targetField: `target_${type}_field`,
      parameters: generateRuleParameters(type),
      description: generateRuleDescription(type)
    }

    const updatedRules = [...rules, newRule]
    setRules(updatedRules)
    onRulesChange?.(updatedRules)
    setIsAddingRule(false)

    toast({
      title: "✅ Transformation Rule Added",
      description: `${ruleType.label} rule created successfully`,
    })
  }

  // ✅ Generate realistic parameters for each rule type
  const generateRuleParameters = (type: string) => {
    switch (type) {
      case 'split':
        return { delimiter: ' ', outputFields: ['first_name', 'last_name'] }
      case 'merge':
        return { separator: ' ', inputFields: ['first_name', 'last_name'] }
      case 'cast':
        return { fromType: 'VARCHAR', toType: 'INTEGER', nullable: true }
      case 'json':
        return { jsonPath: '$.category', defaultValue: 'unknown' }
      default:
        return {}
    }
  }

  const generateRuleDescription = (type: string) => {
    switch (type) {
      case 'split':
        return 'Split full_name field using space delimiter into first_name and last_name'
      case 'merge':
        return 'Merge first_name and last_name fields with space separator'
      case 'cast':
        return 'Convert string field to integer with null handling'
      case 'json':
        return 'Extract category value from JSON metadata field'
      default:
        return 'Custom transformation rule'
    }
  }

  const removeRule = (ruleId: string) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId)
    setRules(updatedRules)
    onRulesChange?.(updatedRules)

    toast({
      title: "🗑️ Rule Removed",
      description: "Transformation rule deleted successfully",
    })
  }

  const getRuleIcon = (type: string) => {
    const ruleType = ruleTypes.find(rt => rt.type === type)
    return ruleType?.icon || Settings
  }

  const getRuleColor = (type: string) => {
    switch (type) {
      case 'split': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'merge': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'cast': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'json': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Wand2 className="h-5 w-5 mr-2" />
            🧩 Custom Transformation Rules
          </CardTitle>
          <Dialog open={isAddingRule} onOpenChange={setIsAddingRule}>
            <DialogTrigger asChild>
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/20 text-white">
              <DialogHeader>
                <DialogTitle>Create Transformation Rule</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Choose a transformation type to create a new rule
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4">
                {ruleTypes.map((ruleType) => {
                  const Icon = ruleType.icon
                  return (
                    <div
                      key={ruleType.type}
                      onClick={() => addRule(ruleType.type)}
                      className="p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className="h-5 w-5 text-blue-400" />
                        <h4 className="text-white font-medium">{ruleType.label}</h4>
                      </div>
                      <p className="text-gray-400 text-sm mb-1">{ruleType.description}</p>
                      <p className="text-gray-500 text-xs italic">{ruleType.example}</p>
                    </div>
                  )
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {rules.length === 0 ? (
          <div className="text-center py-8">
            <Wand2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">🎨 No Transformation Rules</h3>
            <p className="text-gray-400 mb-4">
              Add custom transformation rules to modify how your data is migrated
            </p>
            <Button onClick={() => setIsAddingRule(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Rule
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => {
              const Icon = getRuleIcon(rule.type)
              return (
                <div key={rule.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-blue-400" />
                      <Badge className={getRuleColor(rule.type)}>
                        {rule.type.toUpperCase()}
                      </Badge>
                      <span className="text-white font-medium">{rule.sourceField}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-white font-medium">{rule.targetField}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeRule(rule.id)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{rule.description}</p>
                  <div className="text-xs text-gray-400">
                    Parameters: {JSON.stringify(rule.parameters)}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {rules.length > 0 && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">
                ✅ {rules.length} Transformation Rules Configured
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              🎯 Rules will be applied during migration to transform your data according to the specified logic.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
