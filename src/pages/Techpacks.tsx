import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, Eye, Edit, FileText, Calendar, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import AddTechpackModal from '../components/modals/AddTechpackModal';

const Techpacks: React.FC = () => {
  const { techpacks, updateTechpack, deleteTechpack } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Revision Required': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'In Review': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Draft': return <FileText className="h-4 w-4 text-gray-600" />;
      case 'Revision Required': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
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

  const filteredTechpacks = techpacks.filter(techpack => {
    const matchesSearch = techpack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         techpack.styleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         techpack.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || techpack.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || techpack.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDeleteTechpack = (id: string) => {
    if (window.confirm('Are you sure you want to delete this techpack?')) {
      deleteTechpack(id);
    }
  };

  const handleStatusChange = (id: string, newStatus: 'Draft' | 'In Review' | 'Approved' | 'Revision Required') => {
    updateTechpack(id, { status: newStatus });
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Techpacks</h1>
            <p className="text-gray-600">Manage technical packages and specifications</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Techpack</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Techpacks</p>
              <p className="text-2xl font-bold text-gray-900">{techpacks.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{techpacks.filter(tp => tp.status === 'Approved').length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Review</p>
              <p className="text-2xl font-bold text-blue-600">{techpacks.filter(tp => tp.status === 'In Review').length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Need Revision</p>
              <p className="text-2xl font-bold text-yellow-600">{techpacks.filter(tp => tp.status === 'Revision Required').length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
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
              <option value="In Review">In Review</option>
              <option value="Draft">Draft</option>
              <option value="Revision Required">Revision Required</option>
            </select>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Dresses">Dresses</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Jackets">Jackets</option>
              <option value="Shorts">Shorts</option>
              <option value="Coats">Coats</option>
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search techpacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Techpacks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTechpacks.map((techpack) => (
          <div key={techpack.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{techpack.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{techpack.styleNumber} • v{techpack.version}</p>
                <p className="text-sm text-gray-600 mb-3">{techpack.customer}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(techpack.priority)}`}>
                  {techpack.priority}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(techpack.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(techpack.status)}`}>
                  {techpack.status}
                </span>
              </div>
              <span className="text-sm text-gray-500">{techpack.category}</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Completion</span>
                <span className="text-sm text-gray-600">{techpack.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${techpack.completionRate === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${techpack.completionRate}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(techpack.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{techpack.createdBy}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <span>💬 {techpack.comments} comments</span>
                <span>📎 {techpack.attachments} files</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Updated: {new Date(techpack.lastUpdated).toLocaleDateString()}
              </span>
              <div className="flex space-x-2">
                <button className="p-2 text-blue-600 hover:text-blue-800 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleStatusChange(techpack.id, 'In Review')}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteTechpack(techpack.id)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  title="Delete"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTechpacks.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No techpacks found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Techpack
          </button>
        </div>
      )}

      <AddTechpackModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </div>
  );
};

export default Techpacks;