import React, { useState } from 'react';
import { X, FileText, BarChart3, TrendingUp, Package, Users, DollarSign, Calendar } from 'lucide-react';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (reportType: string, dateRange: string) => void;
  selectedDateRange: string;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  selectedDateRange
}) => {
  const [selectedReport, setSelectedReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [localDateRange, setLocalDateRange] = useState(selectedDateRange);

  const reportTypes = [
    { 
      id: 'overview', 
      name: 'Overview Dashboard', 
      description: 'Comprehensive overview of all key metrics and performance indicators',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    { 
      id: 'sales', 
      name: 'Sales Analysis', 
      description: 'Detailed sales performance, trends, and revenue analysis',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    { 
      id: 'production', 
      name: 'Production Report', 
      description: 'Manufacturing efficiency, capacity utilization, and production metrics',
      icon: Package,
      color: 'bg-purple-500'
    },
    { 
      id: 'supplier', 
      name: 'Supplier Performance', 
      description: 'Supplier evaluation, delivery performance, and quality metrics',
      icon: Users,
      color: 'bg-orange-500'
    },
    { 
      id: 'financial', 
      name: 'Financial Summary', 
      description: 'Financial statements, profitability analysis, and cost breakdown',
      icon: DollarSign,
      color: 'bg-emerald-500'
    },
    { 
      id: 'inventory', 
      name: 'Inventory Report', 
      description: 'Stock levels, turnover rates, and inventory optimization insights',
      icon: Package,
      color: 'bg-indigo-500'
    },
    { 
      id: 'custom', 
      name: 'Custom Report', 
      description: 'Create a custom report with your specific requirements',
      icon: FileText,
      color: 'bg-gray-500'
    }
  ];

  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleGenerate = async () => {
    if (!selectedReport) {
      alert('Please select a report type');
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerate(selectedReport, localDateRange);
      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Generate Report</h2>
            <p className="text-gray-600 mt-1">Select a report type to generate</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Date Range Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select 
              value={localDateRange} 
              onChange={(e) => setLocalDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Report Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedReport === report.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${report.color} text-white`}>
                    <report.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{report.name}</h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                  {selectedReport === report.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={!selectedReport || isGenerating}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal; 