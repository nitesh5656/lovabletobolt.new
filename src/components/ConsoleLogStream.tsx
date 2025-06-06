
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

interface ConsoleLogStreamProps {
  isActive: boolean;
  migrationId?: string;
}

export const ConsoleLogStream: React.FC<ConsoleLogStreamProps> = ({ 
  isActive, 
  migrationId 
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Enhanced mock log messages for realistic simulation
  const mockLogMessages = [
    { level: 'info' as const, message: '🚀 Initializing DBMT migration service...', details: 'Version: 2.1.0 | Build: 20241205' },
    { level: 'info' as const, message: '🔌 Establishing source database connection...', details: 'PostgreSQL 14.2 @ localhost:5432' },
    { level: 'success' as const, message: '✅ Source connection established', details: 'Connection pool: 20 active | Latency: 12ms' },
    { level: 'info' as const, message: '🔌 Connecting to target database...', details: 'MongoDB 5.0 @ localhost:27017' },
    { level: 'success' as const, message: '✅ Target connection verified', details: 'Database: migration_target | Auth: OK' },
    { level: 'info' as const, message: '🔍 Scanning source database schema...', details: 'Analyzing 12 tables, 47 relationships' },
    { level: 'info' as const, message: '🗺️ Loading field mapping configuration...', details: 'Found 47 custom mappings | 23 auto-detected' },
    { level: 'success' as const, message: '✅ Schema analysis complete', details: 'Complexity: 6.8/10 | Est. time: 4m 32s' },
    { level: 'info' as const, message: '📦 Starting migration batch 1/4...', details: 'Table: users | Rows: 5,234' },
    { level: 'info' as const, message: '⚡ Migrating users table...', details: 'Progress: 1,000/5,234 rows (19%) | Speed: 8.2k/sec' },
    { level: 'info' as const, message: '⚡ Migration progress update...', details: 'Progress: 2,500/5,234 rows (48%) | ETA: 2m 15s' },
    { level: 'warning' as const, message: '⚠️ Data type conversion detected', details: 'VARCHAR(255) → ObjectId for users.company_id' },
    { level: 'info' as const, message: '⚡ Continuing migration...', details: 'Progress: 4,000/5,234 rows (76%) | No errors' },
    { level: 'success' as const, message: '✅ Users table migration complete', details: '5,234 rows migrated | Validation: PASSED' },
    { level: 'info' as const, message: '📦 Starting migration batch 2/4...', details: 'Table: orders | Rows: 12,847' },
    { level: 'info' as const, message: '⚡ Migrating orders table...', details: 'Progress: 3,200/12,847 rows (25%) | Speed: 9.1k/sec' },
    { level: 'info' as const, message: '⚡ Bulk insert optimization active...', details: 'Batch size: 15,000 | Buffer: 85% capacity' },
    { level: 'info' as const, message: '⚡ Migration accelerating...', details: 'Progress: 8,500/12,847 rows (66%) | Speed: 11.3k/sec' },
    { level: 'success' as const, message: '✅ Orders table migration complete', details: '12,847 rows migrated | Integrity: VERIFIED' },
    { level: 'info' as const, message: '🔍 Running post-migration validation...', details: 'Checking row counts, checksums, constraints' },
    { level: 'success' as const, message: '✅ Row count validation passed', details: 'Source: 18,081 | Target: 18,081 | Match: 100%' },
    { level: 'success' as const, message: '✅ Data integrity verification complete', details: 'Checksum: MD5 matched | No corruption detected' },
    { level: 'success' as const, message: '🎉 Migration completed successfully!', details: 'Total: 18,081 records | Time: 4m 32s | Success rate: 100%' }
  ];

  // ✅ Auto-generate logs when active
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      if (logs.length < mockLogMessages.length) {
        const nextLog = mockLogMessages[logs.length];
        const newLog: LogEntry = {
          id: `log_${Date.now()}_${Math.random()}`,
          timestamp: new Date().toLocaleTimeString(),
          ...nextLog
        };
        
        setLogs(prev => [...prev, newLog]);
      } else {
        // ✅ Loop back to beginning for continuous simulation
        setLogs([]);
      }
    }, 2000 + Math.random() * 1000); // 2-3 second intervals

    return () => clearInterval(interval);
  }, [isActive, isPaused, logs.length, mockLogMessages.length]);

  // ✅ Auto-scroll functionality
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getLogColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // ✅ Export functionality with toast feedback
  const exportLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}${log.details ? ` | ${log.details}` : ''}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-logs-${migrationId || Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Terminal className="h-5 w-5 mr-2" />
            📶 Live Migration Console
            {isActive && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Streaming
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPaused(!isPaused)}
              className="border-white/20 text-gray-900 bg-white hover:bg-gray-100"
            >
              {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearLogs}
              className="border-white/20 text-gray-900 bg-white hover:bg-gray-100"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={exportLogs}
              disabled={logs.length === 0}
              className="border-white/20 text-gray-900 bg-white hover:bg-gray-100"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div 
          ref={logContainerRef}
          className="flex-1 bg-black/40 rounded-lg p-4 font-mono text-sm overflow-y-auto space-y-2 border border-white/10"
          style={{ maxHeight: '400px', minHeight: '300px' }}
        >
          {logs.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>📺 Console output will appear here when migration starts</p>
              <p className="text-xs mt-2 opacity-75">Real-time logs with automatic scrolling</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 animate-fade-in p-2 hover:bg-white/5 rounded transition-colors">
                <span className="text-gray-500 text-xs mt-1 min-w-[80px] font-mono">
                  {log.timestamp}
                </span>
                <div className="mt-0.5 flex-shrink-0">
                  {getLogIcon(log.level)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`${getLogColor(log.level)} break-words font-medium`}>
                    {log.message}
                  </div>
                  {log.details && (
                    <div className="text-gray-400 text-xs mt-1 break-words opacity-80">
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3 text-sm text-gray-400 border-t border-white/10 pt-3">
          <span>📊 {logs.length} log entries | {isPaused ? '⏸️ Paused' : '▶️ Streaming'}</span>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-blue-500"
            />
            <span>🔄 Auto-scroll</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};
