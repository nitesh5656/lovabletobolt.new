
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Database,
  Clock
} from 'lucide-react';

interface MigrationConsoleProps {
  isActive: boolean;
  onMigrationComplete?: () => void;
}

export const MigrationConsole: React.FC<MigrationConsoleProps> = ({ 
  isActive, 
  onMigrationComplete 
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTable, setCurrentTable] = useState('');
  const [tablesProcessed, setTablesProcessed] = useState(0);
  const [totalTables] = useState(12);
  const [rowsProcessed, setRowsProcessed] = useState(0);
  const [totalRows] = useState(125000);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const { toast } = useToast();

  const tableList = [
    'users', 'orders', 'products', 'customers', 'payments', 'inventory',
    'categories', 'reviews', 'addresses', 'shipping', 'discounts', 'analytics'
  ];

  useEffect(() => {
    if (!isActive || isPaused) return;

    if (!startTime) {
      setStartTime(new Date());
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 2, 100);
        
        // Update current table based on progress
        const currentTableIndex = Math.floor((newProgress / 100) * totalTables);
        if (currentTableIndex < tableList.length) {
          setCurrentTable(tableList[currentTableIndex]);
          setTablesProcessed(currentTableIndex);
        }
        
        // Update rows processed
        setRowsProcessed(Math.floor((newProgress / 100) * totalRows));
        
        // Complete migration when reaching 100%
        if (newProgress >= 100 && onMigrationComplete) {
          onMigrationComplete();
          toast({
            title: "🎉 Migration Complete!",
            description: `Successfully migrated ${totalRows.toLocaleString()} rows across ${totalTables} tables.`,
            duration: 6000,
          });
        }
        
        return newProgress;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isActive, isPaused, startTime, onMigrationComplete, totalRows, totalTables, tableList, toast]);

  // Update elapsed time
  useEffect(() => {
    if (!startTime || !isActive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;
      setElapsedTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isActive]);

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "▶️ Migration Resumed" : "⏸️ Migration Paused",
      description: isPaused ? "Migration process has been resumed." : "Migration process has been paused.",
    });
  };

  const handleStop = () => {
    setProgress(0);
    setIsPaused(false);
    setCurrentTable('');
    setTablesProcessed(0);
    setRowsProcessed(0);
    setStartTime(null);
    setElapsedTime('00:00:00');
    toast({
      title: "🛑 Migration Stopped",
      description: "Migration process has been stopped and reset.",
      variant: "destructive",
    });
  };

  const handleRestart = () => {
    setProgress(0);
    setIsPaused(false);
    setCurrentTable('');
    setTablesProcessed(0);
    setRowsProcessed(0);
    setStartTime(new Date());
    toast({
      title: "🔄 Migration Restarted",
      description: "Migration process has been restarted from the beginning.",
    });
  };

  const getStatusBadge = () => {
    if (!isActive) {
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Idle</Badge>;
    }
    if (isPaused) {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Paused</Badge>;
    }
    if (progress >= 100) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Complete</Badge>;
    }
    return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
      Running
    </Badge>;
  };

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Migration Console
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getStatusBadge()}
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePause}
                disabled={!isActive || progress >= 100}
                className="border-white/20 text-gray-800 hover:bg-white/10"
              >
                {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleStop}
                disabled={!isActive}
                className="border-white/20 text-gray-800 hover:bg-white/10"
              >
                <Square className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRestart}
                className="border-white/20 text-gray-800 hover:bg-white/10"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Overall Progress</span>
            <span className="text-white font-bold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Current Status */}
        {isActive && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-white font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Current Status
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Table:</span>
                  <span className="text-white">{currentTable || 'Initializing...'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tables Processed:</span>
                  <span className="text-white">{tablesProcessed}/{totalTables}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rows Processed:</span>
                  <span className="text-white">{rowsProcessed.toLocaleString()}/{totalRows.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Timing
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Elapsed Time:</span>
                  <span className="text-white">{elapsedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Est. Remaining:</span>
                  <span className="text-white">
                    {progress > 0 ? `${Math.round((100 - progress) * 2)} minutes` : '--'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Speed:</span>
                  <span className="text-white">{Math.round(rowsProcessed / 60)} rows/sec</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary when not active */}
        {!isActive && (
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Migration Console Ready</h3>
            <p className="text-gray-400">Start a migration from the wizard to see live progress here.</p>
          </div>
        )}

        {/* Completion Status */}
        {progress >= 100 && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">Migration Completed Successfully!</span>
            </div>
            <p className="text-gray-300 text-sm">
              All {totalRows.toLocaleString()} rows have been successfully migrated across {totalTables} tables in {elapsedTime}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
