
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield,
  Key,
  Server,
  Globe,
  Settings
} from 'lucide-react';

interface DatabaseConnectionConfigProps {
  databaseType: string;
  databaseName: string;
  onConnectionConfigured: (config: any) => void;
  onBack: () => void;
}

export const DatabaseConnectionConfig: React.FC<DatabaseConnectionConfigProps> = ({
  databaseType,
  databaseName,
  onConnectionConfigured,
  onBack
}) => {
  const [config, setConfig] = useState({
    host: 'localhost',
    port: '',
    database: '',
    username: '',
    password: '',
    ssl: true,
    authMethod: 'password',
    connectionPool: 10,
    timeout: 30,
    additionalParams: ''
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');
  const { toast } = useToast();

  // Get default port and connection options based on database type
  const getDatabaseDefaults = (dbType: string) => {
    const defaults: Record<string, any> = {
      postgresql: { port: '5432', ssl: true },
      mysql: { port: '3306', ssl: false },
      mongodb: { port: '27017', ssl: false },
      redis: { port: '6379', ssl: false },
      oracle: { port: '1521', ssl: true },
      cassandra: { port: '9042', ssl: false },
      elasticsearch: { port: '9200', ssl: false },
      neo4j: { port: '7687', ssl: true }
    };
    return defaults[dbType] || { port: '', ssl: false };
  };

  React.useEffect(() => {
    const defaults = getDatabaseDefaults(databaseType);
    setConfig(prev => ({ ...prev, ...defaults }));
  }, [databaseType]);

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('idle');
    
    toast({
      title: "🔍 Testing Connection",
      description: "Attempting to connect to the database...",
    });
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock validation logic
    if (config.host && config.port && config.username && config.password) {
      setConnectionStatus('success');
      setConnectionMessage('🔐 Connection successful! Database is reachable and credentials are valid.');
      toast({
        title: "✅ Connection Successful",
        description: "Database connection established successfully!",
      });
    } else {
      setConnectionStatus('error');
      setConnectionMessage('❌ Connection failed. Please check your credentials and try again.');
      toast({
        title: "❌ Connection Failed",
        description: "Unable to connect. Please verify your settings.",
        variant: "destructive",
      });
    }
    
    setIsTestingConnection(false);
  };

  const handleConfigure = () => {
    if (connectionStatus === 'success') {
      toast({
        title: "✅ Configuration Saved",
        description: "Database connection configured successfully!",
      });
      onConnectionConfigured({
        databaseType,
        databaseName,
        ...config
      });
    }
  };

  const getConnectionFields = () => {
    const isNoSQL = ['mongodb', 'redis', 'cassandra', 'elasticsearch'].includes(databaseType);
    const isGraph = databaseType === 'neo4j';
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Connection Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white flex items-center">
              <Server className="h-4 w-4 mr-2" />
              Host/Server
            </Label>
            <Input 
              value={config.host}
              onChange={(e) => setConfig({...config, host: e.target.value})}
              placeholder="localhost or IP address"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Port
            </Label>
            <Input 
              value={config.port}
              onChange={(e) => setConfig({...config, port: e.target.value})}
              placeholder="Default port"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center">
              <Database className="h-4 w-4 mr-2" />
              {isNoSQL ? 'Database/Collection' : 'Database Name'}
            </Label>
            <Input 
              value={config.database}
              onChange={(e) => setConfig({...config, database: e.target.value})}
              placeholder={isNoSQL ? "database_name" : "your_database"}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Authentication */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white flex items-center">
              <Key className="h-4 w-4 mr-2" />
              Username
            </Label>
            <Input 
              value={config.username}
              onChange={(e) => setConfig({...config, username: e.target.value})}
              placeholder="Database username"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Password
            </Label>
            <Input 
              type="password"
              value={config.password}
              onChange={(e) => setConfig({...config, password: e.target.value})}
              placeholder="Database password"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="ssl"
                checked={config.ssl}
                onCheckedChange={(checked) => setConfig({...config, ssl: checked})}
              />
              <Label htmlFor="ssl" className="text-white">Enable SSL/TLS</Label>
            </div>
          </div>

          {!isNoSQL && (
            <div className="space-y-2">
              <Label className="text-white">Authentication Method</Label>
              <Select 
                value={config.authMethod} 
                onValueChange={(value) => setConfig({...config, authMethod: value})}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="password">Username/Password</SelectItem>
                  <SelectItem value="kerberos">Kerberos</SelectItem>
                  <SelectItem value="certificate">SSL Certificate</SelectItem>
                  <SelectItem value="iam">IAM Role</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl flex items-center">
                <Database className="h-6 w-6 mr-3" />
                Configure {databaseName} Connection
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter connection details for your {databaseName} database
              </CardDescription>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {databaseType.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Connection Form */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Connection Parameters</CardTitle>
          <CardDescription className="text-gray-400">
            Configure the database connection settings and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {getConnectionFields()}

          {/* Advanced Settings */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-white font-medium mb-4 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Advanced Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Connection Pool Size</Label>
                <Input 
                  type="number"
                  value={config.connectionPool}
                  onChange={(e) => setConfig({...config, connectionPool: parseInt(e.target.value)})}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Timeout (seconds)</Label>
                <Input 
                  type="number"
                  value={config.timeout}
                  onChange={(e) => setConfig({...config, timeout: parseInt(e.target.value)})}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
          </div>

          {/* Connection Test */}
          <div className="space-y-4">
            <Button 
              onClick={testConnection}
              disabled={isTestingConnection || !config.host || !config.port || !config.username || !config.password}
              className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
            >
              {isTestingConnection ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>

            {connectionStatus !== 'idle' && (
              <Alert className={`${
                connectionStatus === 'success' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center">
                  {connectionStatus === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <AlertDescription className={
                  connectionStatus === 'success' ? 'text-green-300' : 'text-red-300'
                }>
                  {connectionMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-white/20 text-gray-900 bg-white hover:bg-gray-100"
        >
          Back to Database Selection
        </Button>
        
        <Button 
          onClick={handleConfigure}
          disabled={connectionStatus !== 'success'}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold disabled:opacity-50"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Continue to Migration Setup
        </Button>
      </div>
    </div>
  );
};
