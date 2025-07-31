import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, File, BarChart3, TrendingUp, Package, Users, DollarSign, Search } from 'lucide-react';

interface ReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateReport: (reportType: string, exportFormat: string, filters: any) => void;
}

const ReportingModal: React.FC<ReportingModalProps> = ({ isOpen, onClose, onGenerateReport }) => {
  const [selectedReport, setSelectedReport] = useState('product-overview');
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [reportSearch, setReportSearch] = useState('');
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    status: 'all',
    customer: 'all',
    includeCharts: true,
    includeTables: true,
    includeSummary: false
  });

  const reportTypes = [
    { id: 'accounting_master_spreadsheet', name: 'Accounting Master Spreadsheet', icon: FileText },
    { id: 'commercial_invoice', name: 'Commercial Invoice', icon: FileText },
    { id: 'image_test_report', name: 'Image test Report', icon: FileText },
    { id: 'material_material_consolidation_by_po', name: 'Material Material Consolidation by PO', icon: FileText },
    { id: 'packing_list', name: 'Packing List', icon: FileText },
    { id: 'po_line_data_dump', name: 'PO Line Data Dump', icon: FileText },
    { id: 'product_buyer_friendly_product_info', name: 'Product Buyer Friendly Product Info', icon: FileText },
    { id: 'product_delivery_schedule', name: 'Product Delivery Schedule', icon: FileText },
    { id: 'product_import_file_format', name: 'Product Import File Format', icon: FileText },
    { id: 'product_latest_tech_pack', name: 'Product Latest Tech Pack', icon: FileText },
    { id: 'product_latest_tech_pack_bill_of_materials', name: 'Product Latest Tech Pack Bill Of Materials', icon: FileText },
    { id: 'product_latest_tech_pack_fiber_composition_and_car', name: 'Product Latest Tech Pack Fiber Composition and Car', icon: FileText },
    { id: 'product_latest_tech_pack_fit_log', name: 'Product Latest Tech Pack Fit Log', icon: FileText },
    { id: 'product_latest_tech_pack_make_up_method', name: 'Product Latest Tech Pack Make Up Method', icon: FileText },
    { id: 'product_latest_tech_pack_size_chart', name: 'Product Latest Tech Pack Size Chart', icon: FileText },
    { id: 'product_look_book_x2', name: 'Product Look Book x2', icon: FileText },
    { id: 'product_product_activity_history', name: 'Product Product Activity History', icon: FileText },
    { id: 'product_product_info', name: 'Product Product Info', icon: FileText },
    { id: 'product_product_status', name: 'Product Product Status', icon: FileText },
    { id: 'product_range_costing', name: 'Product Range Costing', icon: FileText },
    { id: 'product_range_costing_ldp', name: 'Product Range Costing - LDP', icon: FileText },
    { id: 'product_sample_ticket', name: 'Product Sample Ticket', icon: FileText },
    { id: 'product_shis_export', name: "Product Shi's Export", icon: FileText },
    { id: 'product_story_board', name: 'Product Story Board', icon: FileText },
    { id: 'product_thumbnails', name: 'Product Thumbnails', icon: FileText },
    { id: 'purchaseorder_order_status', name: 'PurchaseOrder Order Status', icon: FileText },
    { id: 'purchaseorder_order_summary_by_supplier', name: 'PurchaseOrder Order Summary By Supplier', icon: FileText },
    { id: 'purchaseorder_po_activity_history', name: 'PurchaseOrder PO Activity History', icon: FileText },
    { id: 'purchaseorder_po_print', name: 'PurchaseOrder PO Print', icon: FileText },
    { id: 'purchaseorder_schedule_by_supplier', name: 'PurchaseOrder Schedule by Supplier', icon: FileText },
    { id: 'purchaseorderline_delivery_schedule_bk_new', name: 'PurchaseOrderLine Delivery Schedule_BK NEW', icon: FileText },
    { id: 'purchaseorderline_delivery_scheduleno_comp', name: 'PurchaseOrderLine Delivery ScheduleNoComp', icon: FileText },
    { id: 'purchaseorderline_monthly_order_placement_tracker', name: 'PurchaseOrderLine Monthly Order Placement Tracker', icon: FileText },
    { id: 'purchaseorderline_order_book', name: 'PurchaseOrderLine Order Book', icon: FileText },
    { id: 'purchaseorderline_pivot88_export', name: 'PurchaseOrderLine Pivot88 Export', icon: FileText },
    { id: 'purchaseorderline_po_summary', name: 'PurchaseOrderLine PO Summary', icon: FileText },
    { id: 'purchaseorderline_po_summary_internal', name: 'PurchaseOrderLine PO Summary (Internal)', icon: FileText },
    { id: 'sample_check_form', name: 'Sample Check Form', icon: FileText },
    { id: 'seasonal_summary_of_forecast_vs_actual', name: 'Seasonal Summary of Forecast vs Actual', icon: FileText },
  ];

  // Filter report types based on search
  const filteredReportTypes = reportTypes.filter(report =>
    report.name.toLowerCase().includes(reportSearch.toLowerCase()) ||
    report.id.toLowerCase().includes(reportSearch.toLowerCase())
  );

  const exportFormats = [
    { id: 'excel', name: 'Excel (.xlsx)', icon: FileSpreadsheet, description: 'Best for data analysis and calculations' },
    { id: 'pdf', name: 'PDF (.pdf)', icon: FileText, description: 'Best for sharing and printing' },
    { id: 'word', name: 'Word (.docx)', icon: File, description: 'Best for editing and collaboration' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateReport(selectedReport, selectedFormat, filters);
    onClose();
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Generate Report</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Report Type *</label>
            
            {/* Search for Report Types */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for report types..."
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {reportSearch && (
                <div className="mt-2 text-sm text-gray-500">
                  Found {filteredReportTypes.length} of {reportTypes.length} report types
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredReportTypes.map((report) => (
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
                  <div className="flex items-start space-x-3">
                    <report.icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{report.name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {filteredReportTypes.length === 0 && reportSearch && (
              <div className="text-center py-8">
                No report types found matching "{reportSearch}"
              </div>
            )}
          </div>

          {/* Filters Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Report Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="lastyear">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="development">Development</option>
                  <option value="sampling">Sampling</option>
                  <option value="production">Production</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Customer</label>
                <select
                  value={filters.customer}
                  onChange={(e) => handleFilterChange('customer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Customers</option>
                  <option value="h&m">H&M</option>
                  <option value="zara">Zara</option>
                  <option value="uniqlo">Uniqlo</option>
                  <option value="nike">Nike</option>
                </select>
              </div>
            </div>
          </div>

          {/* Export Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Export Format *</label>
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

          {/* Report Options */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Report Options</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.includeCharts}
                  onChange={(e) => handleFilterChange('includeCharts', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include charts and graphs</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.includeTables}
                  onChange={(e) => handleFilterChange('includeTables', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include data tables</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.includeSummary}
                  onChange={(e) => handleFilterChange('includeSummary', e.target.checked)}
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
              <span>Generate Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportingModal;
 