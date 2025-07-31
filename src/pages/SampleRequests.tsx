import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, CheckCircle, Clock, AlertCircle, Package, Calendar, User } from 'lucide-react';

const SampleRequests: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const sampleRequests = [
    {
      id: 1,
      requestNumber: 'SR-2024-001',
      styleName: 'Cotton T-Shirt Premium',
      styleNumber: 'SC001',
      customer: 'H&M',
      requestedBy: 'Sarah Johnson',
      priority: 'High',
      status: 'Approved',
      requestDate: '2024-01-10',
      dueDate: '2024-01-20',
      sampleType: 'Fit Sample',
      quantity: 5,
      comments: 'Need to check sleeve length',
      supplier: 'Textile Solutions Ltd',
      estimatedCost: 150.00,
      actualCost: 142.50,
      completionRate: 100
    },
    {
      id: 2,
      requestNumber: 'SR-2024-002',
      styleName: 'Summer Dress Collection',
      styleNumber: 'SC002',
      customer: 'Zara',
      requestedBy: 'Mike Chen',
      priority: 'Medium',
      status: 'In Production',
      requestDate: '2024-01-12',
      dueDate: '2024-01-25',
      sampleType: 'Production Sample',
      quantity: 3,
      comments: 'Fabric color matching required',
      supplier: 'Fashion Factory Inc',
      estimatedCost: 200.00,
      actualCost: null,
      completionRate: 75
    },
    {
      id: 3,
      requestNumber: 'SR-2024-003',
      styleName: 'Denim Jacket Classic',
      styleNumber: 'SC003',
      customer: 'Uniqlo',
      requestedBy: 'Alex Rodriguez',
      priority: 'Low',
      status: 'Pending Review',
      requestDate: '2024-01-14',
      dueDate: '2024-01-30',
      sampleType: 'Development Sample',
      quantity: 2,
      comments: 'First development sample',
      supplier: 'Denim Works Co',
      estimatedCost: 180.00,
      actualCost: null,
      completionRate: 25
    },
    {
      id: 4,
      requestNumber: 'SR-2024-004',
      styleName: 'Athletic Shorts Pro',
      styleNumber: 'SC004',
      customer: 'Nike',
      requestedBy: 'Lisa Wong',
      priority: 'High',
      status: 'Revision Required',
      requestDate: '2024-01-08',
      dueDate: '2024-01-22',
      sampleType: 'Fit Sample',
      quantity: 4,
      comments: 'Waistband needs adjustment',
      supplier: 'SportsTech Manufacturing',
      estimatedCost: 120.00,
      actualCost: 115.00,
      completionRate: 60
    },
    {
      id: 5,
      requestNumber: 'SR-2024-005',
      styleName: 'Winter Coat Premium',
      styleNumber: 'SC005',
      customer: 'Patagonia',
      requestedBy: 'David Kim',
      priority: 'Medium',
      status: 'In Production',
      requestDate: '2024-01-11',
      dueDate: '2024-01-28',
      sampleType: 'Production Sample',
      quantity: 2,
      comments: 'Test new insulation material',
      supplier: 'OutdoorGear Manufacturing',
      estimatedCost: 350.00,
      actualCost: null,
      completionRate: 40
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Production': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Revision Required': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'In Production': return <Package className="h-4 w-4 text-blue-600" />;
      case 'Pending Review': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Revision Required': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredRequests = sampleRequests.filter(request => {
    const matchesSearch = request.styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sample Requests</h1>
            <p className="text-gray-600">Manage sample requests and track production progress</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>New Sample Request</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{sampleRequests.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Production</p>
              <p className="text-2xl font-bold text-blue-600">{sampleRequests.filter(r => r.status === 'In Production').length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{sampleRequests.filter(r => r.status === 'Approved').length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(sampleRequests.reduce((sum, r) => sum + r.estimatedCost, 0) / sampleRequests.length).toFixed(0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
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
              <option value="Approved">Approved</option>
              <option value="In Production">In Production</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Revision Required">Revision Required</option>
            </select>
            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Sample Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.styleName}</h3>
                <p className="text-sm text-gray-500 mb-1">{request.requestNumber}</p>
                <p className="text-sm text-gray-600 mb-3">{request.customer} • {request.sampleType}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                  {request.priority}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(request.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
              <span className="text-sm text-gray-500">Qty: {request.quantity}</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{request.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${request.completionRate === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${request.completionRate}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Supplier:</span> {request.supplier}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Comments:</span> {request.comments}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  <span className="font-medium">Est. Cost:</span> ${request.estimatedCost.toFixed(2)}
                </span>
                {request.actualCost && (
                  <span className="text-gray-600">
                    <span className="font-medium">Actual:</span> ${request.actualCost.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(request.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{request.requestedBy}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Requested: {new Date(request.requestDate).toLocaleDateString()}
              </span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sample requests found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create New Sample Request
          </button>
        </div>
      )}
    </div>
  );
};

export default SampleRequests;