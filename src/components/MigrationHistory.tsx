
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  History, 
  Search, 
  Filter,
  Download,
  PlayCircle,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  BarChart,
  Database,
  Calendar
} from 'lucide-react';

export const MigrationHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const migrations = [
    {
      id: 'MIG-001',
      name: 'PostgreSQL → MongoDB User Data',
      source: 'PostgreSQL 13.2',
      target: 'MongoDB 5.0',
      status: 'completed',
      startTime: '2024-01-15 14:30:00',
      endTime: '2024-01-15 18:45:00',
      duration: '4h 15m',
      recordsTransferred: 2340000,
      successRate: 99.8,
      complexity: 'High'
    },
    {
      id: 'MIG-002', 
      name: 'MySQL → PostgreSQL Analytics',
      source: 'MySQL 8.0',
      target: 'PostgreSQL 14.1',
      status: 'failed',
      startTime: '2024-01-14 09:15:00',
      endTime: '2024-01-14 11:23:00',
      duration: '2h 8m',
      recordsTransferred: 890000,
      successRate: 76.3,
      complexity: 'Medium'
    },
    {
      id: 'MIG-003',
      name: 'Oracle → Cassandra Product Catalog',
      source: 'Oracle 19c',
      target: 'Cassandra 4.0',
      status: 'running',
      startTime: '2024-01-16 10:00:00',
      endTime: null,
      duration: 'In Progress',
      recordsTransferred: 1200000,
      successRate: 98.5,
      complexity: 'Critical'
    },
    {
      id: 'MIG-004',
      name: 'Redis → MongoDB Session Store',
      source: 'Redis 6.2',
      target: 'MongoDB 5.0',
      status: 'completed',
      startTime: '2024-01-13 16:20:00',
      endTime: '2024-01-13 17:05:00',
      duration: '45m',
      recordsTransferred: 45000,
      successRate: 100,
      complexity: 'Low'
    },
    {
      id: 'MIG-005',
      name: 'Elasticsearch → PostgreSQL Logs',
      source: 'Elasticsearch 7.17',
      target: 'PostgreSQL 14.1',
      status: 'scheduled',
      startTime: '2024-01-17 22:00:00',
      endTime: null,
      duration: 'Scheduled',
      recordsTransferred: 0,
      successRate: 0,
      complexity: 'Medium'
    }
  ];

  const filteredMigrations = migrations.filter(migration => {
    const matchesSearch = migration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         migration.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || migration.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'running': return <PlayCircle className="h-4 w-4 text-blue-400 animate-pulse" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-orange-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
      running: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      scheduled: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getComplexityBadge = (complexity: string) => {
    const variants = {
      Low: 'bg-green-500/20 text-green-400 border-green-500/30',
      Medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      Critical: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return variants[complexity as keyof typeof variants] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl flex items-center">
                <History className="h-6 w-6 mr-3 text-blue-400" />
                Migration History
              </CardTitle>
              <CardDescription className="text-gray-400">
                View and manage your database migration history
              </CardDescription>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search migrations by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Migration List */}
      <div className="space-y-4">
        {filteredMigrations.map((migration) => (
          <Card key={migration.id} className="bg-black/20 border-white/10 backdrop-blur-xl hover:bg-black/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Migration Info */}
                <div className="lg:col-span-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Database className="h-5 w-5 text-blue-400" />
                    <h3 className="text-white font-semibold">{migration.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{migration.id}</p>
                  <p className="text-gray-400 text-sm">{migration.source} → {migration.target}</p>
                </div>

                {/* Status */}
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(migration.status)}
                    <Badge className={getStatusBadge(migration.status)}>
                      {migration.status.charAt(0).toUpperCase() + migration.status.slice(1)}
                    </Badge>
                  </div>
                  <Badge className={getComplexityBadge(migration.complexity)}>
                    {migration.complexity}
                  </Badge>
                </div>

                {/* Metrics */}
                <div className="lg:col-span-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{migration.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Records:</span>
                      <span className="text-white">{migration.recordsTransferred.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Success Rate:</span>
                      <span className={`${migration.successRate >= 95 ? 'text-green-400' : migration.successRate >= 80 ? 'text-orange-400' : 'text-red-400'}`}>
                        {migration.successRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="lg:col-span-2">
                  <div className="flex items-center text-gray-400 text-sm mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Started
                  </div>
                  <p className="text-white text-sm">{new Date(migration.startTime).toLocaleDateString()}</p>
                  <p className="text-gray-400 text-xs">{new Date(migration.startTime).toLocaleTimeString()}</p>
                </div>

                {/* Actions */}
                <div className="lg:col-span-1">
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <BarChart className="h-4 w-4" />
                    </Button>
                    {migration.status === 'completed' && (
                      <Button size="sm" variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {migration.status === 'failed' && (
                      <Button size="sm" variant="outline" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMigrations.length === 0 && (
        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardContent className="p-12 text-center">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No migrations found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
