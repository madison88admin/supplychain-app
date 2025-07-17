import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, File } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (reportType: string, exportFormat: string) => void;
}

const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose, onExport }) => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [selectedFormat, setSelectedFormat] = useState('excel');

  const reportTypes = [
    { id: 'overview', name: 'Overview Dashboard', icon: FileText },
    { id: 'sales', name: 'Sales Analysis', icon: FileText },
    { id: 'production', name: 'Production Report', icon: FileText },
    { id: 'supplier', name: 'Supplier Performance', icon: FileText },
    { id: 'financial', name: 'Financial Summary', icon: FileText },
    { id: 'inventory', name: 'Inventory Report', icon: FileText },
  ];

  const exportFormats = [
    { id: 'excel', name: 'Excel (.xlsx)', icon: FileSpreadsheet, description: 'Best for data analysis and calculations' },
    { id: 'pdf', name: 'PDF (.pdf)', icon: FileText, description: 'Best for sharing and printing' },
    { id: 'word', name: 'Word (.docx)', icon: File, description: 'Best for editing and collaboration' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(selectedReport, selectedFormat);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Export Report</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Report Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setSelectedReport(report.id)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedReport === report.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <report.icon className="h-5 w-5" />
                    <span className="font-medium">{report.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Export Format *
            </label>
            <div className="space-y-3">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => setSelectedFormat(format.id)}
                  className={`w-full p-4 border rounded-lg text-left transition-colors ${
                    selectedFormat === format.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <format.icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{format.name}</div>
                      <div className="text-sm text-gray-500">{format.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Export Options</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include charts and graphs</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include data tables</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include executive summary</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportReportModal; 