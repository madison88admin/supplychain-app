import React, { useState } from 'react';
import { BarChart3, Download, Filter, Calendar, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import ExportReportModal from '../components/modals/ExportReportModal';

const PivotReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');
  const [showExportModal, setShowExportModal] = useState(false);

  const reportTypes = [
    { id: 'overview', name: 'Overview Dashboard', icon: BarChart3 },
    { id: 'sales', name: 'Sales Analysis', icon: TrendingUp },
    { id: 'production', name: 'Production Report', icon: Package },
    { id: 'supplier', name: 'Supplier Performance', icon: Users },
    { id: 'financial', name: 'Financial Summary', icon: DollarSign },
    { id: 'inventory', name: 'Inventory Report', icon: Package },
  ];

  const kpiData = [
    { title: 'Total Revenue', value: '$2.4M', change: '+18%', trend: 'up' },
    { title: 'Orders Processed', value: '1,247', change: '+12%', trend: 'up' },
    { title: 'Average Lead Time', value: '45 days', change: '-8%', trend: 'down' },
    { title: 'Supplier Rating', value: '4.7/5', change: '+0.3', trend: 'up' },
  ];

  const topProducts = [
    { name: 'Cotton T-Shirt Premium', orders: 15, revenue: '$159,900', margin: '46.9%' },
    { name: 'Denim Jacket Classic', orders: 8, revenue: '$399,920', margin: '35.0%' },
    { name: 'Athletic Shorts Pro', orders: 12, revenue: '$374,850', margin: '42.9%' },
    { name: 'Winter Coat Premium', orders: 3, revenue: '$269,970', margin: '38.5%' },
    { name: 'Summer Dress Collection', orders: 5, revenue: '$149,950', margin: '37.5%' },
  ];

  const topSuppliers = [
    { name: 'Textile Solutions Ltd', orders: 12, onTime: '95%', rating: 4.8 },
    { name: 'Fashion Factory Inc', orders: 8, onTime: '92%', rating: 4.7 },
    { name: 'SportsTech Manufacturing', orders: 15, onTime: '88%', rating: 4.6 },
    { name: 'Denim Works Co', orders: 6, onTime: '90%', rating: 4.5 },
    { name: 'OutdoorGear Manufacturing', orders: 4, onTime: '93%', rating: 4.7 },
  ];

  const monthlyData = [
    { month: 'Jan', orders: 45, revenue: 450000 },
    { month: 'Feb', orders: 52, revenue: 520000 },
    { month: 'Mar', orders: 48, revenue: 480000 },
    { month: 'Apr', orders: 61, revenue: 610000 },
    { month: 'May', orders: 55, revenue: 550000 },
    { month: 'Jun', orders: 67, revenue: 670000 },
  ];

  const handleExport = (reportType: string, exportFormat: string) => {
    console.log(`Exporting ${reportType} report as ${exportFormat}`);
    
    // Simulate export process
    alert(`Exporting ${reportType} report as ${exportFormat}...\n\nThis would trigger the actual export functionality.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pivot Reports</h1>
            <p className="text-gray-600">Comprehensive analytics and business intelligence</p>
          </div>
          <div className="flex space-x-3">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="lastyear">Last Year</option>
            </select>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              onClick={() => setShowExportModal(true)}
            >
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Types</h2>
            <nav className="space-y-2">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedReport === report.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <report.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{report.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Report Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                  <div className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${(data.revenue / 700000) * 100}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Orders</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                      style={{ height: `${(data.orders / 70) * 100}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Product</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Orders</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Revenue</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topProducts.map((product, index) => (
                      <tr key={index}>
                        <td className="py-3 text-sm text-gray-900">{product.name}</td>
                        <td className="py-3 text-sm text-gray-600">{product.orders}</td>
                        <td className="py-3 text-sm text-gray-600">{product.revenue}</td>
                        <td className="py-3 text-sm text-gray-600">{product.margin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Suppliers */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Suppliers</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Supplier</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Orders</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">On Time</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topSuppliers.map((supplier, index) => (
                      <tr key={index}>
                        <td className="py-3 text-sm text-gray-900">{supplier.name}</td>
                        <td className="py-3 text-sm text-gray-600">{supplier.orders}</td>
                        <td className="py-3 text-sm text-gray-600">{supplier.onTime}</td>
                        <td className="py-3 text-sm text-gray-600">{supplier.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Report Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">94%</div>
                <p className="text-sm text-gray-600">On-time Delivery Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">$2.4M</div>
                <p className="text-sm text-gray-600">Total Revenue (YTD)</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">42.1%</div>
                <p className="text-sm text-gray-600">Average Margin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default PivotReports;