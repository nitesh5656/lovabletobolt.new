
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Save, 
  RotateCcw, 
  HardDrive,
  Clock,
  AlertTriangle,
  CheckCircle,
  Database,
  Shield,
  FileArchive,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

interface BackupRollbackManagerProps {
  onBackupStart?: () => void;
  onRollbackStart?: () => void;
}

export const BackupRollbackManager: React.FC<BackupRollbackManagerProps> = ({ 
  onBackupStart, 
  onRollbackStart 
}) => {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const backupHistory = [
    {
      id: 'backup-001',
      name: 'Pre-Migration Backup',
      timestamp: '2024-06-04 10:30:00',
      size: '2.4 GB',
      type: 'automatic',
      status: 'completed',
      database: 'PostgreSQL Production',
      migrationId: 'mig-001',
      integrity: 'verified'
    },
    {
      id: 'backup-002',
      name: 'Manual Checkpoint',
      timestamp: '2024-06-03 16:45:00',
      size: '2.1 GB',
      type: 'manual',
      status: 'completed',
      database: 'MySQL Staging',
      migrationId: null,
      integrity: 'verified'
    },
    {
      id: 'backup-003',
      name: 'Pre-Migration Backup',
      timestamp: '2024-06-02 09:15:00',
      size: '1.8 GB',
      type: 'automatic',
      status: 'expired',
      database: 'MongoDB Analytics',
      migrationId: 'mig-002',
      integrity: 'not_verified'
    }
  ];

  const rollbackPoints = [
    {
      id: 'rp-001',
      name: 'Before Schema Changes',
      timestamp: '2024-06-04 10:25:00',
      migrationStep: 'Schema Validation',
      dataState: '2.4M records intact',
      canRollback: true,
      riskLevel: 'low'
    },
    {
      id: 'rp-002',
      name: 'After Field Mapping',
      timestamp: '2024-06-04 11:15:00',
      migrationStep: 'Field Transformation',
      dataState: '1.2M records migrated',
      canRollback: true,
      riskLevel: 'medium'
    },
    {
      id: 'rp-003',
      name: 'Final Validation Point',
      timestamp: '2024-06-04 12:45:00',
      migrationStep: 'Data Validation',
      dataState: '2.4M records completed',
      canRollback: false,
      riskLevel: 'high'
    }
  ];

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);
    
    // Simulate backup creation
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setBackupProgress(i);
    }
    
    setIsCreatingBackup(false);
    onBackupStart?.();
  };

  const handleRollback = async (rollbackPointId: string) => {
    setIsRestoring(true);
    
    // Simulate rollback process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsRestoring(false);
    onRollbackStart?.();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'expired': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'failed': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-orange-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
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
                <Save className="h-6 w-6 mr-3" />
                Backup & Rollback Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Protect your data with automated backups and point-in-time recovery
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-backup"
                checked={autoBackupEnabled}
                onCheckedChange={setAutoBackupEnabled}
              />
              <Label htmlFor="auto-backup" className="text-white">Auto-backup</Label>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup Management */}
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <HardDrive className="h-5 w-5 mr-2" />
                Create New Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Backup Type</Label>
                <Select defaultValue="full">
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Database Backup</SelectItem>
                    <SelectItem value="differential">Differential Backup</SelectItem>
                    <SelectItem value="schema">Schema Only</SelectItem>
                    <SelectItem value="data">Data Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Backup Name</Label>
                <Input 
                  placeholder="Manual backup - Pre migration"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Storage Location</Label>
                <Select defaultValue="local">
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="s3">Amazon S3</SelectItem>
                    <SelectItem value="azure">Azure Blob Storage</SelectItem>
                    <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isCreatingBackup && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Creating backup...</span>
                    <span className="text-white">{backupProgress}%</span>
                  </div>
                  <Progress value={backupProgress} className="h-2" />
                </div>
              )}

              <Button 
                onClick={handleCreateBackup}
                disabled={isCreatingBackup}
                className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
              >
                {isCreatingBackup ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Creating Backup...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Backup
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileArchive className="h-5 w-5 mr-2" />
                Backup History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {backupHistory.map((backup) => (
                <div key={backup.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-white font-medium">{backup.name}</div>
                      <div className="text-sm text-gray-400">{backup.database}</div>
                    </div>
                    <Badge className={getStatusColor(backup.status)}>
                      {backup.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{backup.timestamp}</span>
                    <span>{backup.size}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-gray-500/20 text-gray-300">
                        {backup.type}
                      </Badge>
                      {backup.integrity === 'verified' && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Rollback Management */}
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <RotateCcw className="h-5 w-5 mr-2" />
                Rollback Points
              </CardTitle>
              <CardDescription className="text-gray-400">
                Available recovery points for the current migration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rollbackPoints.map((point) => (
                <div key={point.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-white font-medium">{point.name}</div>
                      <div className="text-sm text-gray-400">{point.migrationStep}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`border ${getRiskColor(point.riskLevel)} bg-opacity-20`}>
                        {point.riskLevel} risk
                      </Badge>
                      {point.canRollback ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-3">
                    <div>{point.timestamp}</div>
                    <div>{point.dataState}</div>
                  </div>

                  <Button 
                    size="sm"
                    onClick={() => handleRollback(point.id)}
                    disabled={!point.canRollback || isRestoring}
                    className={`w-full ${
                      point.canRollback 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30'
                        : 'bg-gray-500/10 text-gray-500 border border-gray-500/20 cursor-not-allowed'
                    }`}
                  >
                    {isRestoring ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Rolling Back...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        {point.canRollback ? 'Rollback to This Point' : 'Rollback Not Available'}
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Alert className="bg-orange-500/10 border-orange-500/30">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-300">
              <strong>Warning:</strong> Rollback operations cannot be undone. Ensure you have recent backups before proceeding with any rollback.
            </AlertDescription>
          </Alert>

          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Recovery Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Backup
                </Button>
                <Button 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Clone Database
                </Button>
              </div>
              
              <Button 
                variant="outline"
                className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                <Clock className="h-4 w-4 mr-2" />
                Point-in-Time Recovery
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
