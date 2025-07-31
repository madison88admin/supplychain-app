import React, { useState } from 'react';
import { FileText, Download, Eye, Search, Filter, Calendar, User, FolderOpen } from 'lucide-react';

const Documents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const documents = [
    {
      id: 1,
      name: 'User Story Guidelines',
      category: 'Guidelines',
      type: 'PDF',
      size: '2.3 MB',
      lastModified: '2024-01-10',
      author: 'Madison 88 Team',
      description: 'Comprehensive guide for creating user stories and requirements',
      downloads: 245,
      url: '#'
    },
    {
      id: 2,
      name: 'Factory CBD Standards',
      category: 'Standards',
      type: 'PDF',
      size: '1.8 MB',
      lastModified: '2024-01-12',
      author: 'Quality Assurance',
      description: 'Factory CBD compliance and quality standards documentation',
      downloads: 189,
      url: '#'
    },
    {
      id: 3,
      name: 'Madison 88 SOP',
      category: 'Procedures',
      type: 'DOCX',
      size: '3.2 MB',
      lastModified: '2024-01-08',
      author: 'Operations Team',
      description: 'Standard Operating Procedures for all departments',
      downloads: 567,
      url: '#'
    },
    {
      id: 4,
      name: 'M88 Export Open Costing',
      category: 'Costing',
      type: 'XLSX',
      size: '1.5 MB',
      lastModified: '2024-01-14',
      author: 'Costing Department',
      description: 'Open costing template and guidelines for export products',
      downloads: 123,
      url: '#'
    },
    {
      id: 5,
      name: 'Supplier Loading Guide',
      category: 'Logistics',
      type: 'PDF',
      size: '2.7 MB',
      lastModified: '2024-01-09',
      author: 'Logistics Team',
      description: 'Complete guide for supplier loading and shipping procedures',
      downloads: 298,
      url: '#'
    },
    {
      id: 6,
      name: 'Quality Control Checklist',
      category: 'Quality',
      type: 'PDF',
      size: '1.2 MB',
      lastModified: '2024-01-11',
      author: 'QC Team',
      description: 'Comprehensive quality control checklist for all products',
      downloads: 156,
      url: '#'
    },
    {
      id: 7,
      name: 'Packaging Requirements',
      category: 'Packaging',
      type: 'PDF',
      size: '2.1 MB',
      lastModified: '2024-01-13',
      author: 'Packaging Team',
      description: 'Standard packaging requirements and guidelines',
      downloads: 234,
      url: '#'
    },
    {
      id: 8,
      name: 'Compliance Manual',
      category: 'Compliance',
      type: 'PDF',
      size: '4.5 MB',
      lastModified: '2024-01-07',
      author: 'Legal Department',
      description: 'Comprehensive compliance manual for all operations',
      downloads: 345,
      url: '#'
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'DOCX':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'XLSX':
        return <FileText className="h-8 w-8 text-green-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Guidelines': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Standards': return 'bg-green-100 text-green-800 border-green-200';
      case 'Procedures': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Costing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Logistics': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Quality': return 'bg-red-100 text-red-800 border-red-200';
      case 'Packaging': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Compliance': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(documents.map(doc => doc.category))];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Madison 88's Documents</h1>
            <p className="text-gray-600">Access essential documents, SOPs, and reference materials</p>
          </div>
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">{filteredDocuments.length} documents</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-gray-900">{documents.reduce((sum, doc) => sum + doc.downloads, 0)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-2xl font-bold text-gray-900">Today</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
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
              <span className="text-sm font-medium text-gray-700">Filter by category:</span>
            </div>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getFileIcon(doc.type)}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{doc.name}</h3>
                  <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(doc.category)}`}>
                {doc.category}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doc.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{doc.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(doc.lastModified).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Download className="h-4 w-4" />
                <span>{doc.downloads} downloads</span>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-blue-600 hover:text-blue-800 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-green-600 hover:text-green-800 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
};

export default Documents;