import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { WelcomeSection } from '@/components/WelcomeSection';
import { MigrationWizard } from '@/components/MigrationWizard';
import { MigrationConsole } from '@/components/MigrationConsole';
import { MigrationHistory } from '@/components/MigrationHistory';
import { SettingsPanel } from '@/components/SettingsPanel';
import { DryRunPanel } from '@/components/DryRunPanel';
import { ValidationPanel } from '@/components/ValidationPanel';
import { LearningSystem } from '@/components/LearningSystem';
import { AutoUpdateModule } from '@/components/AutoUpdateModule';
import { ConsoleLogStream } from '@/components/ConsoleLogStream';
import { ExportConfirmationModal } from '@/components/ExportConfirmationModal';
import { SecuritySettings } from '@/components/SecuritySettings';
import { 
  Database, 
  Play, 
  History, 
  Settings, 
  BarChart, 
  Shield,
  Brain,
  Download
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [migrationInProgress, setMigrationInProgress] = useState(false);
  const [currentMigrationId, setCurrentMigrationId] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState('Migration');

  const handleExportClick = (type: string) => {
    setExportType(type);
    setExportModalOpen(true);
  };

  // Navigation handlers for home page tiles
  const handleNavigateToHistory = () => {
    setActiveTab('history');
  };

  const handleNavigateToAnalytics = () => {
    setActiveTab('console');
  };

  const handleNavigateToSecurity = () => {
    setActiveTab('settings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DBMT</h1>
                <p className="text-sm text-gray-300">Database Migration Tool</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                System Healthy
              </Badge>
              <Button 
                onClick={() => handleExportClick('System')}
                variant="outline" 
                size="sm" 
                className="bg-white text-gray-900 font-semibold border-white hover:bg-gray-100"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white text-gray-900 font-semibold border-white hover:bg-gray-100"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-6 bg-black/20 backdrop-blur-xl border border-white/10">
            <TabsTrigger value="welcome" className="data-[state=active]:bg-white/20 text-white hover:bg-white/10">
              <Database className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="wizard" className="data-[state=active]:bg-white/20 text-white hover:bg-white/10">
              <Play className="h-4 w-4 mr-2" />
              New Migration
            </TabsTrigger>
            <TabsTrigger value="console" className="data-[state=active]:bg-white/20 text-white hover:bg-white/10">
              <BarChart className="h-4 w-4 mr-2" />
              Live Console
            </TabsTrigger>
            <TabsTrigger value="learning" className="data-[state=active]:bg-white/20 text-white hover:bg-white/10">
              <Brain className="h-4 w-4 mr-2" />
              AI Learning
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white/20 text-white hover:bg-white/10">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white/20 text-white hover:bg-white/10">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="welcome" className="space-y-6">
            <WelcomeSection 
              onStartMigration={() => setActiveTab('wizard')}
              onNavigateToHistory={handleNavigateToHistory}
              onNavigateToAnalytics={handleNavigateToAnalytics}
              onNavigateToSecurity={handleNavigateToSecurity}
            />
          </TabsContent>

          <TabsContent value="wizard" className="space-y-6">
            <MigrationWizard onMigrationStart={() => {
              setMigrationInProgress(true);
              setCurrentMigrationId('migration_' + Date.now());
              setActiveTab('console');
            }} />
          </TabsContent>

          <TabsContent value="console" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConsoleLogStream 
                isActive={migrationInProgress} 
                migrationId={currentMigrationId || undefined}
              />
              
              {currentMigrationId && (
                <ValidationPanel 
                  migrationId={currentMigrationId}
                  onValidationComplete={() => {
                    console.log('✅ Validation complete');
                  }}
                />
              )}
            </div>
            
            {!migrationInProgress && currentMigrationId && (
              <DryRunPanel 
                migrationConfig={{
                  name: 'PostgreSQL to MongoDB Migration',
                  description: 'Sample migration for testing purposes',
                  sourceConfig: {
                    type: 'postgresql',
                    host: 'localhost',
                    port: 5432,
                    database: 'source_db'
                  },
                  targetConfig: {
                    type: 'mongodb',
                    host: 'localhost',
                    port: 27017,
                    database: 'target_db'
                  },
                  migrationType: 'full',
                  options: { 
                    dryRun: true,
                    batchSize: 10000,
                    enableValidation: true
                  }
                }}
                onProceedToActualMigration={() => {
                  setMigrationInProgress(true);
                  console.log('✅ Dry run complete - proceeding to migration');
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <LearningSystem />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <MigrationHistory />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SettingsPanel />
              <AutoUpdateModule />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Export Modal */}
      <ExportConfirmationModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        reportType={exportType}
        migrationData={{}}
      />
    </div>
  );
};

export default Index;
