
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Lock, 
  Key, 
  Eye,
  EyeOff,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Settings,
  UserCheck,
  Database,
  Activity
} from 'lucide-react';

interface SecuritySettingsProps {
  onSettingsUpdate?: (settings: any) => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onSettingsUpdate }) => {
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);
  const [dataMasking, setDataMasking] = useState(false);
  const [rlsEnabled, setRlsEnabled] = useState(true);

  const userRoles = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access including security configuration',
      permissions: ['read', 'write', 'delete', 'configure', 'audit'],
      users: 2,
      color: 'red'
    },
    {
      id: 'operator',
      name: 'Migration Operator',
      description: 'Can execute and monitor migrations',
      permissions: ['read', 'write', 'execute'],
      users: 5,
      color: 'blue'
    },
    {
      id: 'viewer',
      name: 'Read-Only Viewer',
      description: 'View-only access to migration status and reports',
      permissions: ['read'],
      users: 12,
      color: 'green'
    }
  ];

  const auditEvents = [
    {
      timestamp: '2024-06-04 14:23:15',
      user: 'admin@company.com',
      action: 'Migration Started',
      resource: 'PostgreSQL → MongoDB',
      status: 'success',
      ip: '192.168.1.100'
    },
    {
      timestamp: '2024-06-04 14:20:42',
      user: 'operator@company.com',
      action: 'Schema Mapping Modified',
      resource: 'Field Mapping Engine',
      status: 'success',
      ip: '192.168.1.105'
    },
    {
      timestamp: '2024-06-04 14:18:33',
      user: 'viewer@company.com',
      action: 'Report Downloaded',
      resource: 'Migration Report #1245',
      status: 'success',
      ip: '192.168.1.110'
    },
    {
      timestamp: '2024-06-04 14:15:21',
      user: 'unknown@external.com',
      action: 'Login Attempt Failed',
      resource: 'Authentication System',
      status: 'failed',
      ip: '203.0.113.45'
    }
  ];

  const maskingRules = [
    {
      id: 'email',
      field: 'email',
      pattern: 'Email addresses',
      method: 'Partial masking (preserve domain)',
      status: 'active'
    },
    {
      id: 'ssn',
      field: 'ssn',
      pattern: 'Social Security Numbers',
      method: 'Full masking',
      status: 'active'
    },
    {
      id: 'phone',
      field: 'phone_number',
      pattern: 'Phone numbers',
      method: 'Last 4 digits visible',
      status: 'inactive'
    }
  ];

  const getRoleColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'blue': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'green': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center">
            <Shield className="h-6 w-6 mr-3" />
            Security & Access Control
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage security policies, access controls, and compliance settings
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-xl border border-white/10">
          <TabsTrigger value="general" className="data-[state=active]:bg-white/20 text-white">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="rbac" className="data-[state=active]:bg-white/20 text-white">
            <Users className="h-4 w-4 mr-2" />
            Access Control
          </TabsTrigger>
          <TabsTrigger value="masking" className="data-[state=active]:bg-white/20 text-white">
            <EyeOff className="h-4 w-4 mr-2" />
            Data Masking
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-white/20 text-white">
            <Activity className="h-4 w-4 mr-2" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        {/* General Security Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Encryption Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Data in Transit Encryption</Label>
                    <p className="text-sm text-gray-400">Encrypt all data during migration</p>
                  </div>
                  <Switch checked={encryptionEnabled} onCheckedChange={setEncryptionEnabled} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Data at Rest Encryption</Label>
                    <p className="text-sm text-gray-400">Encrypt stored credentials and logs</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Encryption Algorithm</Label>
                  <Select defaultValue="aes256">
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aes256">AES-256-GCM</SelectItem>
                      <SelectItem value="aes128">AES-128-GCM</SelectItem>
                      <SelectItem value="chacha20">ChaCha20-Poly1305</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Multi-Factor Authentication</Label>
                    <p className="text-sm text-gray-400">Require MFA for sensitive operations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Session Timeout</Label>
                    <p className="text-sm text-gray-400">Auto-logout after inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Session Duration (hours)</Label>
                  <Input 
                    type="number" 
                    defaultValue="8" 
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Row Level Security (RLS)
              </CardTitle>
              <CardDescription className="text-gray-400">
                Control data access at the row level based on user context
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Enable RLS</Label>
                  <p className="text-sm text-gray-400">Restrict data access based on user roles and policies</p>
                </div>
                <Switch checked={rlsEnabled} onCheckedChange={setRlsEnabled} />
              </div>

              {rlsEnabled && (
                <div className="space-y-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-white">RLS Policy Template</Label>
                    <Textarea
                      placeholder="CREATE POLICY user_data_policy ON migrations FOR ALL TO migration_users USING (user_id = current_user_id());"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      rows={3}
                    />
                  </div>
                  <div className="text-sm text-blue-300">
                    RLS policies will be automatically applied to restrict access to migration data based on user permissions.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role-Based Access Control */}
        <TabsContent value="rbac" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">User Roles & Permissions</CardTitle>
              <CardDescription className="text-gray-400">
                Manage access levels and permissions for different user types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userRoles.map((role) => (
                <div key={role.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-5 w-5 text-blue-400" />
                      <div>
                        <div className="text-white font-medium">{role.name}</div>
                        <div className="text-sm text-gray-400">{role.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(role.color)}>
                        {role.users} users
                      </Badge>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <Badge key={permission} variant="secondary" className="bg-gray-500/20 text-gray-300">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}

              <Button className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30">
                <Users className="h-4 w-4 mr-2" />
                Add New Role
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Masking */}
        <TabsContent value="masking" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <EyeOff className="h-5 w-5 mr-2" />
                    Data Masking Rules
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure automatic data masking for sensitive information
                  </CardDescription>
                </div>
                <Switch checked={dataMasking} onCheckedChange={setDataMasking} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataMasking && (
                <>
                  {maskingRules.map((rule) => (
                    <div key={rule.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{rule.pattern}</div>
                          <div className="text-sm text-gray-400">Field: {rule.field}</div>
                          <div className="text-sm text-gray-400">Method: {rule.method}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={rule.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                            {rule.status}
                          </Badge>
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button className="w-full bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30">
                    <Eye className="h-4 w-4 mr-2" />
                    Add Masking Rule
                  </Button>
                </>
              )}

              {!dataMasking && (
                <div className="text-center py-8 text-gray-400">
                  <EyeOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Data masking is currently disabled.</p>
                  <p className="text-sm">Enable it to configure masking rules for sensitive data.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log */}
        <TabsContent value="audit" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Audit Trail
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Monitor and track all system activities
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={auditLogging} onCheckedChange={setAuditLogging} />
                  <Label className="text-white">Enable Logging</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {auditLogging && (
                <div className="space-y-3">
                  {auditEvents.map((event, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{event.action}</span>
                            <Badge className={`${getStatusColor(event.status) === 'text-green-400' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {event.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400">
                            {event.user} • {event.resource}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">{event.timestamp}</div>
                          <div className="text-xs text-gray-500">{event.ip}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!auditLogging && (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Audit logging is currently disabled.</p>
                  <p className="text-sm">Enable it to track system activities and compliance.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
