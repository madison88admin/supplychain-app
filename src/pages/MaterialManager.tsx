import React, { useState } from 'react';
import { Plus, Search, Filter, Package, Calendar, DollarSign, TrendingUp, Eye, Edit, Truck } from 'lucide-react';

const MaterialManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const materialOrders = [
    {
      id: 1,
      mpoNumber: 'MPO-2024-001',
      materialItem: 'Cotton Jersey 180GSM',
      color: 'Navy Blue',
      quantity: 5000,
      unit: 'yards',
      unitPrice: 3.50,
      totalValue: 17500,
      supplier: 'Fabric Pro Ltd',
      status: 'Confirmed',
      orderDate: '2024-01-10',
      shipDate: '2024-01-20',
      receiveDate: '2024-01-25',
      awb: 'AWB-123456',
      invoiceNumber: 'INV-2024-001',
      invoiceStatus: 'Paid',
      relatedPO: 'PO-2024-001',
      leadTime: 15,
      materialType: 'Fabric'
    },
    {
      id: 2,
      mpoNumber: 'MPO-2024-002',
      materialItem: 'Polyester Lining',
      color: 'White',
      quantity: 2500,
      unit: 'yards',
      unitPrice: 2.25,
      totalValue: 5625,
      supplier: 'Textile Solutions',
      status: 'In Transit',
      orderDate: '2024-01-12',
      shipDate: '2024-01-22',
      receiveDate: '2024-01-28',
      awb: 'AWB-789012',
      invoiceNumber: 'INV-2024-002',
      invoiceStatus: 'Pending',
      relatedPO: 'PO-2024-002',
      leadTime: 16,
      materialType: 'Lining'
    },
    {
      id: 3,
      mpoNumber: 'MPO-2024-003',
      materialItem: 'Metal Buttons 15mm',
      color: 'Silver',
      quantity: 10000,
      unit: 'pieces',
      unitPrice: 0.15,
      totalValue: 1500,
      supplier: 'Hardware Plus',
      status: 'Received',
      orderDate: '2024-01-08',
      shipDate: '2024-01-18',
      receiveDate: '2024-01-23',
      awb: 'AWB-345678',
      invoiceNumber: 'INV-2024-003',
      invoiceStatus: 'Paid',
      relatedPO: 'PO-2024-001',
      leadTime: 15,
      materialType: 'Trims'
    },
    {
      id: 4,
      mpoNumber: 'MPO-2024-004',
      materialItem: 'YKK Zippers 18"',
      color: 'Black',
      quantity: 8000,
      unit: 'pieces',
      unitPrice: 0.85,
      totalValue: 6800,
      supplier: 'Zipper World',
      status: 'Processing',
      orderDate: '2024-01-14',
      shipDate: '2024-01-24',
      receiveDate: '2024-01-30',
      awb: null,
      invoiceNumber: null,
      invoiceStatus: 'Not Issued',
      relatedPO: 'PO-2024-003',
      leadTime: 16,
      materialType: 'Trims'
    },
    {
      id: 5,
      mpoNumber: 'MPO-2024-005',
      materialItem: 'Polyfill Padding',
      color: 'Natural',
      quantity: 1200,
      unit: 'yards',
      unitPrice: 4.75,
      totalValue: 5700,
      supplier: 'Padding Specialists',
      status: 'Ordered',
      orderDate: '2024-01-15',
      shipDate: '2024-01-25',
      receiveDate: '2024-02-01',
      awb: null,
      invoiceNumber: null,
      invoiceStatus: 'Not Issued',
      relatedPO: 'PO-2024-005',
      leadTime: 17,
      materialType: 'Padding'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Received': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Ordered': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Not Issued': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOrders = materialOrders.filter(order => {
    const matchesSearch = order.materialItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.mpoNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesType = filterType === 'all' || order.materialType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalValue = filteredOrders.reduce((sum, order) => sum + order.totalValue, 0);
  const averageLeadTime = filteredOrders.length > 0 ? 
    filteredOrders.reduce((sum, order) => sum + order.leadTime, 0) / filteredOrders.length : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Material Manager</h1>
            <p className="text-gray-600">Manage material purchase orders and inventory</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create MPO</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total MPOs</p>
              <p className="text-2xl font-bold text-gray-900">{materialOrders.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${(totalValue / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-blue-600">{materialOrders.filter(o => o.status === 'In Transit').length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Lead Time</p>
              <p className="text-2xl font-bold text-gray-900">{averageLeadTime.toFixed(0)} days</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Ordered">Ordered</option>
              <option value="Processing">Processing</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Transit">In Transit</option>
              <option value="Received">Received</option>
            </select>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Fabric">Fabric</option>
              <option value="Lining">Lining</option>
              <option value="Trims">Trims</option>
              <option value="Padding">Padding</option>
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Material Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">MPO Number</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Material</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Supplier</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Total Value</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Dates</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Invoice</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{order.mpoNumber}</div>
                      <div className="text-sm text-gray-500">{order.relatedPO}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{order.materialItem}</div>
                      <div className="text-sm text-gray-500">{order.color} • {order.materialType}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{order.supplier}</td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm text-gray-900">{order.quantity.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{order.unit}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-medium text-gray-900">${order.totalValue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">${order.unitPrice}/{order.unit}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Order: {new Date(order.orderDate).toLocaleDateString()}</div>
                      <div>Ship: {new Date(order.shipDate).toLocaleDateString()}</div>
                      <div>Receive: {new Date(order.receiveDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">
                        {order.invoiceNumber || 'Not Issued'}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getInvoiceStatusColor(order.invoiceStatus)}`}>
                        {order.invoiceStatus}
                      </span>
                      {order.awb && (
                        <div className="text-xs text-gray-500">
                          AWB: {order.awb}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      {order.status === 'In Transit' && (
                        <button className="p-1 text-purple-600 hover:text-purple-800 transition-colors">
                          <Truck className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No material orders found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create New Material Order
          </button>
        </div>
      )}
    </div>
  );
};

export default MaterialManager;