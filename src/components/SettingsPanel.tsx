
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LearningSystem } from './LearningSystem';
import { AutoUpdateModule } from './AutoUpdateModule';
import { ExportReports } from './ExportReports';
import { SecuritySettings } from './SecuritySettings';
import { BackupRollbackManager } from './BackupRollbackManager';
import { 
  Settings, 
  Brain, 
  RefreshCw, 
  FileDown, 
  Shield, 
  Save,
  Database,
  Bell,
  Palette
} from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white text-2xl flex items-center">
            <Settings className="h-6 w-6 mr-3" />
            System Settings & Management
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure system preferences, security, and advanced features
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="learning" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-black/20 backdrop-blur-xl border border-white/10">
          <TabsTrigger value="learning" className="data-[state=active]:bg-white/20 text-white">
            <Brain className="h-4 w-4 mr-2" />
            Learning
          </TabsTrigger>
          <TabsTrigger value="updates" className="data-[state=active]:bg-white/20 text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Updates
          </TabsTrigger>
          <TabsTrigger value="exports" className="data-[state=active]:bg-white/20 text-white">
            <FileDown className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white/20 text-white">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="backup" className="data-[state=active]:bg-white/20 text-white">
            <Save className="h-4 w-4 mr-2" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-white/20 text-white">
            <Database className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learning">
          <LearningSystem />
        </TabsContent>

        <TabsContent value="updates">
          <AutoUpdateModule />
        </TabsContent>

        <TabsContent value="exports">
          <ExportReports />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="backup">
          <BackupRollbackManager />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">System Configuration</CardTitle>
              <CardDescription className="text-gray-400">
                Core system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Database Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Connection Pool Size:</span>
                        <span className="text-white">50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Query Timeout:</span>
                        <span className="text-white">30s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Batch Size:</span>
                        <span className="text-white">10,000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email Alerts:</span>
                        <span className="text-green-400">Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Slack Integration:</span>
                        <span className="text-orange-400">Configured</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">SMS Notifications:</span>
                        <span className="text-gray-400">Disabled</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Interface Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Theme:</span>
                        <span className="text-white">Dark Mode</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Language:</span>
                        <span className="text-white">English</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Timezone:</span>
                        <span className="text-white">UTC-5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date Format:</span>
                        <span className="text-white">YYYY-MM-DD</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Refresh Rate:</span>
                        <span className="text-white">5s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Auto-save:</span>
                        <span className="text-green-400">Enabled</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
