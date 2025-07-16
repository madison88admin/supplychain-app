import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Package, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import AddProductModal from '../components/modals/AddProductModal';

const ProductManager: React.FC = () => {
  const { products, updateProduct, deleteProduct } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeason, setFilterSeason] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Development': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Sampling': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Production': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.styleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeason = filterSeason === 'all' || product.season.includes(filterSeason);
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesSeason && matchesStatus;
  });

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleToggleApproval = (id: string, currentStatus: boolean) => {
    updateProduct(id, { approved: !currentStatus });
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Manager</h1>
            <p className="text-gray-600">Manage your product catalog and development pipeline</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Development</p>
              <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.status === 'Development').length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Margin</p>
              <p className="text-2xl font-bold text-gray-900">
                {(products.reduce((sum, p) => sum + p.margin, 0) / products.length).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(products.reduce((sum, p) => sum + (p.price * p.quantity), 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
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
              value={filterSeason} 
              onChange={(e) => setFilterSeason(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Seasons</option>
              <option value="Spring">Spring 2024</option>
              <option value="Summer">Summer 2024</option>
              <option value="Fall">Fall 2024</option>
            </select>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Development">Development</option>
              <option value="Sampling">Sampling</option>
              <option value="Production">Production</option>
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Product</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Season</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Price</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Margin</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={product.image} 
                        alt={product.styleName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{product.styleName}</div>
                        <div className="text-sm text-gray-500">{product.styleNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{product.customer}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{product.season}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{product.quantity.toLocaleString()}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">${product.price}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <span className={`text-sm font-medium ${product.margin > 40 ? 'text-green-600' : product.margin > 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {product.margin.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleToggleApproval(product.id, product.approved)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title={product.approved ? 'Unapprove' : 'Approve'}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {products.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center mt-6">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first product</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Product
          </button>
        </div>
      )}

      <AddProductModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </div>
  );
};

export default ProductManager;