
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExportConfirmationModal } from './ExportConfirmationModal';
import { 
  FileDown, 
  FileText, 
  BarChart, 
  Database,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const ExportReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);

  const reportTypes = [
    {
      id: 'migration',
      name: 'Migration Report',
      description: 'Complete migration analysis with performance metrics',
      icon: Database,
      status: 'Available',
      lastGenerated: '2 hours ago',
      size: '2.4 MB'
    },
    {
      id: 'performance',
      name: 'Performance Analysis',
      description: 'Detailed performance metrics and optimization suggestions',
      icon: TrendingUp,
      status: 'Available',
      lastGenerated: '1 day ago',
      size: '1.8 MB'
    },
    {
      id: 'validation',
      name: 'Validation Report',
      description: 'Data integrity and validation results',
      icon: CheckCircle,
      status: 'Available',
      lastGenerated: '3 hours ago',
      size: '856 KB'
    },
    {
      id: 'audit',
      name: 'Audit Trail',
      description: 'Security audit and compliance report',
      icon: AlertTriangle,
      status: 'Generating',
      lastGenerated: 'In progress',
      size: 'TBD'
    }
  ];

  const handleExportClick = (reportType: string) => {
    setSelectedReport(reportType);
    setModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Available</Badge>;
      case 'Generating':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Generating</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center">
            <FileDown className="h-6 w-6 mr-3" />
            Export Reports & Analytics
          </CardTitle>
          <CardDescription className="text-gray-400">
            Generate and download comprehensive migration reports
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Icon className="h-5 w-5 mr-2" />
                    {report.name}
                  </CardTitle>
                  {getStatusBadge(report.status)}
                </div>
                <CardDescription className="text-gray-400">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Last Generated:</span>
                    <div className="text-white">{report.lastGenerated}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">File Size:</span>
                    <div className="text-white">{report.size}</div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleExportClick(report.name)}
                  disabled={report.status === 'Generating'}
                  className="w-full bg-white text-gray-900 font-semibold hover:bg-gray-100"
                >
                  {report.status === 'Generating' ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4 mr-2" />
                      Export Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Export Actions */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Quick Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline"
              onClick={() => handleExportClick('Schema Comparison')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <BarChart className="h-4 w-4 mr-2" />
              Schema Comparison
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleExportClick('Data Summary')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <FileText className="h-4 w-4 mr-2" />
              Data Summary
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleExportClick('Error Log')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Error Log
            </Button>
          </div>
        </CardContent>
      </Card>

      <ExportConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        reportType={selectedReport}
        migrationData={{}}
      />
    </div>
  );
};
