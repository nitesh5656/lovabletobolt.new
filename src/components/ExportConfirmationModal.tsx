
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Database, Settings } from 'lucide-react';

interface ExportConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  migrationData: any;
}

export const ExportConfirmationModal: React.FC<ExportConfirmationModalProps> = ({
  isOpen,
  onClose,
  reportType,
  migrationData
}) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    
    toast({
      title: "📤 Starting Export",
      description: `Preparing ${reportType} report in ${exportFormat.toUpperCase()} format...`,
    });
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "✅ Export Complete",
      description: `${reportType} report has been downloaded successfully!`,
    });
    
    setIsExporting(false);
    onClose();
  };

  const exportOptions = [
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'json', label: 'JSON Data', icon: Database },
    { value: 'csv', label: 'CSV Spreadsheet', icon: Settings },
    { value: 'xlsx', label: 'Excel Workbook', icon: FileText }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export {reportType} Report
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose the format for your {reportType.toLowerCase()} report export
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <label className="text-white font-medium">Export Format</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {exportOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-white/20 text-gray-900 bg-white hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExport}
              disabled={isExporting}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isExporting ? (
                <>
                  <Download className="h-4 w-4 mr-2 animate-pulse" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
