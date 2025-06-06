import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Play, 
  History, 
  Settings, 
  BarChart, 
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Server
} from 'lucide-react';

interface WelcomeSectionProps {
  onStartMigration: () => void;
  onNavigateToHistory: () => void;
  onNavigateToAnalytics: () => void;
  onNavigateToSecurity: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ 
  onStartMigration, 
  onNavigateToHistory,
  onNavigateToAnalytics,
  onNavigateToSecurity
}) => {
  const recentMigrations = [
    { id: 1, name: "PostgreSQL → MongoDB", status: "completed", time: "2 hours ago", complexity: "Medium" },
    { id: 2, name: "MySQL → PostgreSQL", status: "running", time: "In progress", complexity: "High" },
    { id: 3, name: "Oracle → Cassandra", status: "scheduled", time: "Tomorrow 2PM", complexity: "Critical" },
  ];

  const systemStats = {
    totalMigrations: 247,
    successRate: 98.5,
    avgDuration: "4.2h",
    activeConnections: 12
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 animate-pulse-glow">
          <Database className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">DBMT</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Professional Database Migration Tool supporting SQL ↔ SQL, NoSQL ↔ NoSQL, and cross-platform migrations with enterprise-grade features.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/20 border-white/10 backdrop-blur-xl hover:bg-black/30 transition-all duration-300 cursor-pointer group" onClick={onStartMigration}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Play className="h-8 w-8 text-green-400 group-hover:scale-110 transition-transform" />
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Quick</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-white mb-2">Start New Migration</CardTitle>
            <CardDescription className="text-gray-400">
              Launch the migration wizard and configure your data transfer
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-xl hover:bg-black/30 transition-all duration-300 cursor-pointer group" onClick={onNavigateToHistory}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <History className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Recent</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-white mb-2">Migration History</CardTitle>
            <CardDescription className="text-gray-400">
              View past migrations, reports, and performance metrics
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-xl hover:bg-black/30 transition-all duration-300 cursor-pointer group" onClick={onNavigateToAnalytics}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <BarChart className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform" />
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Live</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-white mb-2">Analytics Dashboard</CardTitle>
            <CardDescription className="text-gray-400">
              Real-time insights and performance monitoring
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-xl hover:bg-black/30 transition-all duration-300 cursor-pointer group" onClick={onNavigateToSecurity}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Shield className="h-8 w-8 text-orange-400 group-hover:scale-110 transition-transform" />
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Secure</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-white mb-2">Security Center</CardTitle>
            <CardDescription className="text-gray-400">
              Manage encryption, compliance, and access controls
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Migrations</p>
                <p className="text-2xl font-bold text-white">{systemStats.totalMigrations}</p>
              </div>
              <Database className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">{systemStats.successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Duration</p>
                <p className="text-2xl font-bold text-purple-400">{systemStats.avgDuration}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Connections</p>
                <p className="text-2xl font-bold text-orange-400">{systemStats.activeConnections}</p>
              </div>
              <Server className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Migrations */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <History className="h-5 w-5 mr-2" />
            Recent Migrations
          </CardTitle>
          <CardDescription className="text-gray-400">
            Your latest database migration activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMigrations.map((migration) => (
              <div key={migration.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{migration.name}</p>
                    <p className="text-gray-400 text-sm">{migration.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge 
                    className={`${
                      migration.complexity === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      migration.complexity === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {migration.complexity}
                  </Badge>
                  {migration.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-400" />}
                  {migration.status === 'running' && <Clock className="h-5 w-5 text-blue-400 animate-pulse" />}
                  {migration.status === 'scheduled' && <AlertCircle className="h-5 w-5 text-orange-400" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
