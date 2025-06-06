
import React, { useState, useContext, createContext } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ValidationPanel } from './ValidationPanel';
import { DryRunPanel } from './DryRunPanel';
import { FieldMappingEngine } from './FieldMappingEngine';
import { CustomTransformationBuilder } from './CustomTransformationBuilder';
import { DatabaseConnectionConfig } from './DatabaseConnectionConfig';
import { 
  Database, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Play,
  Settings,
  Shield,
  Wand2,
  Target,
  Loader2,
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react';

// Global state context for wizard
interface WizardState {
  sourceConfig: any;
  targetConfig: any;
  fieldMappings: any[];
  transformationRules: any[];
  validationPassed: boolean;
  dryRunPassed: boolean;
  securitySettings: any;
  migrationProgress: number;
  migrationStatus: 'idle' | 'running' | 'completed' | 'error';
}

interface WizardContextType {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
}

const WizardContext = createContext<WizardContextType | null>(null);

interface MigrationWizardProps {
  onMigrationStart: () => void;
}

export const MigrationWizard: React.FC<MigrationWizardProps> = ({ onMigrationStart }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Global wizard state with persistence
  const [wizardState, setWizardState] = useState<WizardState>({
    sourceConfig: { 
      type: 'postgresql', 
      host: 'localhost', 
      port: '5432',
      database: 'source_db',
      username: '',
      password: '',
      ssl: true
    },
    targetConfig: { 
      type: 'mongodb', 
      host: 'localhost', 
      port: '27017',
      database: 'target_db',
      username: '',
      password: '',
      ssl: false
    },
    fieldMappings: [],
    transformationRules: [],
    validationPassed: false,
    dryRunPassed: false,
    securitySettings: { ssl: true, encrypt: true, audit: true, backup: true },
    migrationProgress: 0,
    migrationStatus: 'idle'
  });

  const updateWizardState = (updates: Partial<WizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }));
  };

  // Steps configuration
  const steps = [
    { id: 1, title: 'Database Configuration', description: 'Configure source and target databases', icon: Database },
    { id: 2, title: 'Field Mapping', description: 'Map and transform database fields', icon: ArrowRight },
    { id: 3, title: 'Validation Checks', description: 'Validate connections and schema', icon: Shield },
    { id: 4, title: 'Dry Run Analysis', description: 'Analyze migration complexity', icon: Target },
    { id: 5, title: 'Customization Options', description: 'Configure transformation rules', icon: Wand2 },
    { id: 6, title: 'Security Settings', description: 'Configure security and permissions', icon: Settings },
    { id: 7, title: 'Final Review', description: 'Review all settings', icon: CheckCircle },
    { id: 8, title: 'Migration Execution', description: 'Execute migration with progress', icon: Play }
  ];

  const handleNext = () => {
    // Enforce validation flow
    if (currentStep === 3 && !wizardState.validationPassed) {
      toast({
        title: "⚠️ Validation Required",
        description: "Please complete validation checks before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 4 && !wizardState.dryRunPassed) {
      toast({
        title: "⚠️ Dry Run Required", 
        description: "Please complete dry run analysis before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "✅ Step Complete",
        description: `Moving to: ${steps[currentStep].title}`,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartMigration = async () => {
    setIsProcessing(true);
    updateWizardState({ migrationStatus: 'running', migrationProgress: 0 });
    
    if (!wizardState.validationPassed || !wizardState.dryRunPassed) {
      toast({
        title: "❌ Migration Blocked",
        description: "Complete validation and dry run first.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    
    toast({
      title: "✅ Migration Started",
      description: "Database migration has begun. Monitoring progress...",
    });
    
    // Simulate migration progress
    const progressInterval = setInterval(() => {
      setWizardState(prev => {
        const newProgress = Math.min(prev.migrationProgress + Math.random() * 10, 100);
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          toast({
            title: "🎉 Migration Complete!",
            description: "All data has been successfully migrated.",
          });
          return { ...prev, migrationProgress: 100, migrationStatus: 'completed' };
        }
        return { ...prev, migrationProgress: newProgress };
      });
    }, 1000);
    
    setIsProcessing(false);
    onMigrationStart();
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return wizardState.sourceConfig.host && wizardState.targetConfig.host;
      case 3: return wizardState.validationPassed;
      case 4: return wizardState.dryRunPassed;
      default: return true;
    }
  };

  const databases = [
    { id: 'postgresql', name: 'PostgreSQL', category: 'SQL', icon: '🐘', color: 'bg-blue-500' },
    { id: 'mysql', name: 'MySQL', category: 'SQL', icon: '🐬', color: 'bg-orange-500' },
    { id: 'mongodb', name: 'MongoDB', category: 'NoSQL', icon: '🍃', color: 'bg-green-500' },
    { id: 'redis', name: 'Redis', category: 'NoSQL', icon: '🔴', color: 'bg-red-500' },
    { id: 'oracle', name: 'Oracle', category: 'SQL', icon: '🔶', color: 'bg-purple-500' },
    { id: 'cassandra', name: 'Cassandra', category: 'NoSQL', icon: '⚡', color: 'bg-yellow-500' },
    { id: 'elasticsearch', name: 'Elasticsearch', category: 'NoSQL', icon: '🔍', color: 'bg-teal-500' },
    { id: 'neo4j', name: 'Neo4j', category: 'Graph', icon: '🔗', color: 'bg-indigo-500' }
  ];

  const renderDatabaseSelection = () => (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-2xl">Select Source & Target Databases</CardTitle>
        <CardDescription className="text-gray-400">
          Choose your source and destination databases with auto-detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Source Database */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-white" />
            <h3 className="text-white font-medium text-lg">Source Database</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {databases.map((db) => (
              <button
                key={`source-${db.id}`}
                onClick={() => updateWizardState({
                  sourceConfig: { ...wizardState.sourceConfig, type: db.id }
                })}
                className={`p-4 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                  wizardState.sourceConfig.type === db.id
                    ? 'border-blue-400 bg-blue-500/20 ring-2 ring-blue-400/50'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg ${db.color} flex items-center justify-center text-2xl mx-auto mb-2`}>
                  {db.icon}
                </div>
                <div className="text-white font-medium">{db.name}</div>
                <div className="text-gray-400 text-sm">{db.category}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="h-8 w-8 text-gray-400" />
        </div>

        {/* Target Database */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-white" />
            <h3 className="text-white font-medium text-lg">Target Database</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {databases.map((db) => (
              <button
                key={`target-${db.id}`}
                onClick={() => updateWizardState({
                  targetConfig: { ...wizardState.targetConfig, type: db.id }
                })}
                className={`p-4 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                  wizardState.targetConfig.type === db.id
                    ? 'border-green-400 bg-green-500/20 ring-2 ring-green-400/50'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg ${db.color} flex items-center justify-center text-2xl mx-auto mb-2`}>
                  {db.icon}
                </div>
                <div className="text-white font-medium">{db.name}</div>
                <div className="text-gray-400 text-sm">{db.category}</div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderDatabaseSelection();

      case 2:
        return (
          <WizardContext.Provider value={{ state: wizardState, updateState: updateWizardState }}>
            <FieldMappingEngine
              sourceSchema={[]}
              targetSchema={[]}
              onMappingComplete={(mappings) => {
                updateWizardState({ fieldMappings: mappings });
                toast({
                  title: "✅ Field Mapping Complete",
                  description: `Mapped ${mappings.length} fields successfully.`,
                });
              }}
            />
          </WizardContext.Provider>
        );

      case 3:
        return (
          <ValidationPanel
            migrationId="wizard_validation"
            onValidationComplete={(results) => {
              const passed = results.every((r: any) => r.status === 'passed');
              updateWizardState({ validationPassed: passed });
              toast({
                title: passed ? "✅ Validation Passed" : "❌ Validation Failed",
                description: passed 
                  ? "All validation checks completed successfully!" 
                  : "Some validation checks failed. Please review.",
                variant: passed ? "default" : "destructive"
              });
            }}
          />
        );

      case 4:
        return (
          <DryRunPanel
            migrationConfig={wizardState}
            onProceedToActualMigration={() => {
              updateWizardState({ dryRunPassed: true });
              toast({
                title: "✅ Dry Run Complete", 
                description: "Analysis complete. Ready to proceed with migration.",
              });
            }}
          />
        );

      case 5:
        return (
          <WizardContext.Provider value={{ state: wizardState, updateState: updateWizardState }}>
            <CustomTransformationBuilder
              onRulesChange={(rules) => {
                updateWizardState({ transformationRules: rules });
                toast({
                  title: "✅ Transformation Rules Updated",
                  description: `Configured ${rules.length} transformation rules.`,
                });
              }}
            />
          </WizardContext.Provider>
        );

      case 6:
        return (
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure security options for your migration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Enable SSL Connection</span>
                  <input 
                    type="checkbox" 
                    checked={wizardState.securitySettings.ssl}
                    onChange={(e) => updateWizardState({
                      securitySettings: { ...wizardState.securitySettings, ssl: e.target.checked }
                    })}
                    className="rounded" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Encrypt Data in Transit</span>
                  <input 
                    type="checkbox" 
                    checked={wizardState.securitySettings.encrypt}
                    onChange={(e) => updateWizardState({
                      securitySettings: { ...wizardState.securitySettings, encrypt: e.target.checked }
                    })}
                    className="rounded" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Enable Audit Logging</span>
                  <input 
                    type="checkbox" 
                    checked={wizardState.securitySettings.audit}
                    onChange={(e) => updateWizardState({
                      securitySettings: { ...wizardState.securitySettings, audit: e.target.checked }
                    })}
                    className="rounded" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Backup Before Migration</span>
                  <input 
                    type="checkbox" 
                    checked={wizardState.securitySettings.backup}
                    onChange={(e) => updateWizardState({
                      securitySettings: { ...wizardState.securitySettings, backup: e.target.checked }
                    })}
                    className="rounded" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Final Review</CardTitle>
              <CardDescription className="text-gray-400">
                Review all migration settings before starting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Migration Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Source:</span>
                      <span className="text-white">{wizardState.sourceConfig.type} ({wizardState.sourceConfig.host}:{wizardState.sourceConfig.port})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Target:</span>
                      <span className="text-white">{wizardState.targetConfig.type} ({wizardState.targetConfig.host}:{wizardState.targetConfig.port})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Field Mappings:</span>
                      <span className="text-white">{wizardState.fieldMappings.length} configured</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Transform Rules:</span>
                      <span className="text-white">{wizardState.transformationRules.length} defined</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Status Checks</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {wizardState.validationPassed ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      )}
                      <span className={wizardState.validationPassed ? "text-green-400" : "text-red-400"}>
                        Validation {wizardState.validationPassed ? "Complete" : "Required"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {wizardState.dryRunPassed ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      )}
                      <span className={wizardState.dryRunPassed ? "text-green-400" : "text-red-400"}>
                        Dry Run {wizardState.dryRunPassed ? "Complete" : "Required"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">Security Configured</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 8:
        return (
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Migration Execution</CardTitle>
              <CardDescription className="text-gray-400">
                Monitor real-time migration progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                {wizardState.migrationStatus === 'idle' && (
                  <>
                    <Play className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Ready to Migrate</h3>
                    <p className="text-gray-300 mb-6">
                      All checks passed. Click the button below to start the migration process.
                    </p>
                    
                    <Button
                      onClick={handleStartMigration}
                      disabled={isProcessing || !wizardState.validationPassed || !wizardState.dryRunPassed}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Starting Migration...
                        </>
                      ) : !wizardState.validationPassed || !wizardState.dryRunPassed ? (
                        <>
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Complete Validation & Dry Run First
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Start Migration Now
                        </>
                      )}
                    </Button>
                  </>
                )}

                {(wizardState.migrationStatus === 'running' || wizardState.migrationStatus === 'completed') && (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center justify-center space-x-3">
                        {wizardState.migrationStatus === 'running' ? (
                          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
                        ) : (
                          <CheckCircle className="h-8 w-8 text-green-400" />
                        )}
                        <h3 className="text-xl font-semibold text-white">
                          {wizardState.migrationStatus === 'running' ? 'Migration in Progress' : 'Migration Complete!'}
                        </h3>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">Overall Progress</span>
                          <span className="text-white font-bold">{Math.round(wizardState.migrationProgress)}%</span>
                        </div>
                        <Progress value={wizardState.migrationProgress} className="h-4 bg-gray-700">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 rounded-full"
                            style={{ width: `${wizardState.migrationProgress}%` }}
                          />
                        </Progress>
                      </div>

                      {/* Migration Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center bg-white/5 p-4 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                          <p className="text-gray-400">Records Migrated</p>
                          <p className="text-white font-medium">{Math.round(wizardState.migrationProgress * 1250)}/125,000</p>
                        </div>
                        <div className="text-center bg-white/5 p-4 rounded-lg">
                          <Clock className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                          <p className="text-gray-400">Time Remaining</p>
                          <p className="text-white font-medium">
                            {wizardState.migrationStatus === 'completed' 
                              ? '00:00:00' 
                              : `${Math.round((100 - wizardState.migrationProgress) * 0.1)}:${Math.round(Math.random() * 60).toString().padStart(2, '0')}`
                            }
                          </p>
                        </div>
                        <div className="text-center bg-white/5 p-4 rounded-lg">
                          <Database className="h-5 w-5 text-green-400 mx-auto mb-1" />
                          <p className="text-gray-400">Tables Completed</p>
                          <p className="text-white font-medium">{Math.round(wizardState.migrationProgress / 12.5)}/8</p>
                        </div>
                      </div>

                      {/* Live Migration Log */}
                      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 max-h-40 overflow-y-auto">
                        <h4 className="text-white font-medium mb-2">Migration Log</h4>
                        <div className="space-y-1 text-sm font-mono">
                          {wizardState.migrationProgress > 10 && <div className="text-green-400">✅ Connected to source: {wizardState.sourceConfig.type}</div>}
                          {wizardState.migrationProgress > 20 && <div className="text-green-400">✅ Connected to target: {wizardState.targetConfig.type}</div>}
                          {wizardState.migrationProgress > 30 && <div className="text-blue-400">📊 Migrating: users_table...</div>}
                          {wizardState.migrationProgress > 50 && <div className="text-green-400">✅ Completed: users_table (15,420 rows)</div>}
                          {wizardState.migrationProgress > 60 && <div className="text-blue-400">📊 Migrating: orders_table...</div>}
                          {wizardState.migrationProgress > 80 && <div className="text-green-400">✅ Completed: orders_table (42,350 rows)</div>}
                          {wizardState.migrationProgress > 90 && <div className="text-blue-400">📊 Validating data integrity...</div>}
                          {wizardState.migrationProgress >= 100 && <div className="text-green-400">🎉 Migration completed successfully!</div>}
                        </div>
                      </div>

                      {wizardState.migrationStatus === 'completed' && (
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-green-400 font-medium">✅ Migration completed successfully!</p>
                          <p className="text-gray-300 text-sm mt-1">All 125,000 records migrated and validated across 8 tables.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {(!wizardState.validationPassed || !wizardState.dryRunPassed) && wizardState.migrationStatus === 'idle' && (
                  <p className="text-yellow-400 text-sm mt-4">
                    ⚠️ Migration requires both validation and dry run to be completed successfully.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl">Migration Configuration Wizard</CardTitle>
              <CardDescription className="text-gray-400">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
              </CardDescription>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </Badge>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLocked = step.id > currentStep && !canProceedToNext() && step.id > 2;
          
          return (
            <div
              key={step.id}
              className={`p-3 rounded-lg border text-center transition-all ${
                isActive
                  ? 'bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/30'
                  : isCompleted
                  ? 'bg-green-500/20 border-green-500/30'
                  : isLocked
                  ? 'bg-gray-500/10 border-gray-500/30 opacity-50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-2 ${
                isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-400'
              }`} />
              <div className={`text-xs font-medium ${
                isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-400'
              }`}>
                {step.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          variant="outline"
          className="border-white/20 text-gray-900 bg-white hover:bg-gray-100 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length && (
          <Button
            onClick={handleNext}
            disabled={!canProceedToNext()}
            className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
