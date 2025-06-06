import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomTransformationBuilder } from './CustomTransformationBuilder';
import { 
  ArrowRight, 
  ArrowUpDown,
  Code,
  Zap,
  Copy,
  Trash2,
  Plus,
  RefreshCw,
  Eye,
  Database,
  Type,
  Hash,
  Wand2
} from 'lucide-react';

interface FieldMapping {
  id: string;
  sourceField: string;
  sourceType: string;
  targetField: string;
  targetType: string;
  transformationType: 'direct' | 'custom' | 'function' | 'conditional';
  transformationRule?: string;
  isRequired: boolean;
  defaultValue?: string;
}

interface FieldMappingEngineProps {
  sourceSchema: any[];
  targetSchema: any[];
  onMappingComplete: (mappings: FieldMapping[]) => void;
}

export const FieldMappingEngine: React.FC<FieldMappingEngineProps> = ({
  sourceSchema,
  targetSchema,
  onMappingComplete
}) => {
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [selectedSourceField, setSelectedSourceField] = useState<string>('');
  const [selectedTargetField, setSelectedTargetField] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [transformationRules, setTransformationRules] = useState([]);

  // Mock schema data if not provided
  const mockSourceSchema = sourceSchema.length > 0 ? sourceSchema : [
    { name: 'id', type: 'INTEGER', nullable: false },
    { name: 'username', type: 'VARCHAR(50)', nullable: false },
    { name: 'email', type: 'VARCHAR(255)', nullable: false },
    { name: 'created_at', type: 'DATETIME', nullable: false },
    { name: 'status', type: 'ENUM', nullable: true },
    { name: 'profile_data', type: 'JSON', nullable: true },
    { name: 'last_login', type: 'TIMESTAMP', nullable: true }
  ];

  const mockTargetSchema = targetSchema.length > 0 ? targetSchema : [
    { name: 'user_id', type: 'UUID', nullable: false },
    { name: 'user_name', type: 'TEXT', nullable: false },
    { name: 'email_address', type: 'TEXT', nullable: false },
    { name: 'created_timestamp', type: 'TIMESTAMP', nullable: false },
    { name: 'is_active', type: 'BOOLEAN', nullable: true },
    { name: 'metadata', type: 'JSONB', nullable: true },
    { name: 'last_seen', type: 'TIMESTAMP', nullable: true }
  ];

  const addMapping = () => {
    if (!selectedSourceField || !selectedTargetField) return;

    const sourceField = mockSourceSchema.find(f => f.name === selectedSourceField);
    const targetField = mockTargetSchema.find(f => f.name === selectedTargetField);

    if (!sourceField || !targetField) return;

    const newMapping: FieldMapping = {
      id: `mapping_${mappings.length + 1}`,
      sourceField: sourceField.name,
      sourceType: sourceField.type,
      targetField: targetField.name,
      targetType: targetField.type,
      transformationType: 'direct',
      isRequired: !targetField.nullable,
    };

    setMappings([...mappings, newMapping]);
    setSelectedSourceField('');
    setSelectedTargetField('');
  };

  const updateMapping = (id: string, updates: Partial<FieldMapping>) => {
    setMappings(mappings.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMapping = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
  };

  const autoMapFields = () => {
    const autoMappings: FieldMapping[] = [];
    
    // Simple auto-mapping logic based on field name similarity
    mockSourceSchema.forEach((sourceField, index) => {
      const possibleTargets = mockTargetSchema.filter(targetField => 
        targetField.name.toLowerCase().includes(sourceField.name.toLowerCase()) ||
        sourceField.name.toLowerCase().includes(targetField.name.toLowerCase())
      );

      if (possibleTargets.length > 0) {
        const targetField = possibleTargets[0];
        autoMappings.push({
          id: `auto_mapping_${index}`,
          sourceField: sourceField.name,
          sourceType: sourceField.type,
          targetField: targetField.name,
          targetType: targetField.type,
          transformationType: 'direct',
          isRequired: !targetField.nullable,
        });
      }
    });

    setMappings(autoMappings);
  };

  const getTransformationPreview = (mapping: FieldMapping) => {
    switch (mapping.transformationType) {
      case 'custom':
        return mapping.transformationRule || 'Custom transformation';
      case 'function':
        return `FUNCTION(${mapping.sourceField})`;
      case 'conditional':
        return `CASE WHEN ... THEN ... END`;
      default:
        return `${mapping.sourceField} → ${mapping.targetField}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl flex items-center">
                <ArrowUpDown className="h-6 w-6 mr-3" />
                Field Mapping & Transformation Engine
              </CardTitle>
              <CardDescription className="text-gray-400">
                Map source fields to target schema with custom transformation rules
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={autoMapFields}
                size="sm"
                className="bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30"
              >
                <Zap className="h-4 w-4 mr-2" />
                Auto-Map
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="mapping" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-black/20 backdrop-blur-xl border border-white/10">
          <TabsTrigger value="mapping" className="data-[state=active]:bg-white/20 text-white">
            <Database className="h-4 w-4 mr-2" />
            Field Mapping
          </TabsTrigger>
          <TabsTrigger value="transformations" className="data-[state=active]:bg-white/20 text-white">
            <Wand2 className="h-4 w-4 mr-2" />
            Custom Transformations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mapping" className="space-y-6">
          {/* Field Selection */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Create New Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label className="text-white">Source Field</Label>
                  <Select value={selectedSourceField} onValueChange={setSelectedSourceField}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select source field" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSourceSchema.map((field) => (
                        <SelectItem key={field.name} value={field.name}>
                          <div className="flex items-center space-x-2">
                            <Type className="h-4 w-4" />
                            <span>{field.name}</span>
                            <Badge variant="outline" className="text-xs">{field.type}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Target Field</Label>
                  <Select value={selectedTargetField} onValueChange={setSelectedTargetField}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select target field" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTargetSchema.map((field) => (
                        <SelectItem key={field.name} value={field.name}>
                          <div className="flex items-center space-x-2">
                            <Database className="h-4 w-4" />
                            <span>{field.name}</span>
                            <Badge variant="outline" className="text-xs">{field.type}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={addMapping}
                  disabled={!selectedSourceField || !selectedTargetField}
                  className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mapping
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Mappings */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Field Mappings ({mappings.length})</CardTitle>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={showAdvanced}
                    onCheckedChange={setShowAdvanced}
                  />
                  <Label className="text-white text-sm">Advanced Mode</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mappings.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <ArrowUpDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No field mappings created yet.</p>
                  <p className="text-sm">Add mappings above or use Auto-Map to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mappings.map((mapping) => (
                    <div key={mapping.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      {/* ... keep existing code (mapping display logic) */}
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                        {/* Source Field */}
                        <div className="space-y-1">
                          <div className="text-white font-medium">{mapping.sourceField}</div>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                            {mapping.sourceType}
                          </Badge>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center">
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>

                        {/* Target Field */}
                        <div className="space-y-1">
                          <div className="text-white font-medium">{mapping.targetField}</div>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                            {mapping.targetType}
                          </Badge>
                        </div>

                        {/* Transformation Type */}
                        <div className="space-y-2">
                          <Select 
                            value={mapping.transformationType} 
                            onValueChange={(value: any) => updateMapping(mapping.id, { transformationType: value })}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="direct">Direct Copy</SelectItem>
                              <SelectItem value="function">Apply Function</SelectItem>
                              <SelectItem value="conditional">Conditional Logic</SelectItem>
                              <SelectItem value="custom">Custom SQL</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {showAdvanced && mapping.transformationType !== 'direct' && (
                            <Textarea
                              placeholder="Enter transformation rule..."
                              value={mapping.transformationRule || ''}
                              onChange={(e) => updateMapping(mapping.id, { transformationRule: e.target.value })}
                              className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-xs"
                              rows={2}
                            />
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeMapping(mapping.id)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Transformation Preview */}
                      {showAdvanced && (
                        <div className="mt-3 p-2 bg-black/20 rounded text-xs font-mono text-gray-300">
                          {getTransformationPreview(mapping)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transformations">
          <CustomTransformationBuilder onRulesChange={setTransformationRules} />
        </TabsContent>
      </Tabs>

      {/* Summary & Actions */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-white font-medium">Mapping Summary</div>
              <div className="text-gray-400 text-sm">
                {mappings.length} field mappings + {transformationRules.length} transformation rules configured
              </div>
            </div>
            <Button 
              onClick={() => onMappingComplete(mappings)}
              disabled={mappings.length === 0}
              className="bg-white text-gray-900 font-semibold hover:bg-gray-100"
            >
              Continue to Validation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
