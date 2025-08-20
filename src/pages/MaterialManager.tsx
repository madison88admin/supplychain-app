import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReportBar from '../components/ReportBar';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import TabContent from '../components/TabContent';
import { useSidebar } from '../contexts/SidebarContext';
import { productManagement, supplierManagement, Product, Supplier } from '../lib/supplyChainData';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

// You may want to define MATERIAL_LEFT_TABS and MATERIAL_RIGHT_TABS for materials
const MATERIAL_LEFT_TABS = ['Material Supplier Profiles', 'Lines', 'Where Used'];
const MATERIAL_RIGHT_TABS = ['Materials', 'Material Colors', 'Material Sizes', 'Images', 'Option Images', 'Details'];

const MaterialManager: React.FC = () => {
  const [leftActiveTab, setLeftActiveTab] = useState('Material Supplier Profiles');
  const [rightActiveTab, setRightActiveTab] = useState('Materials');
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(['Spring/Summer 2024']);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [selectedProductFilter, setSelectedProductFilter] = useState('Default');
  const [isProductFilterDropdownOpen, setIsProductFilterDropdownOpen] = useState(false);
  const [showSlideUpContainer, setShowSlideUpContainer] = useState(false);
  const [activeContent, setActiveContent] = useState('activities');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [filterSidebarCollapsed, setFilterSidebarCollapsed] = useState(false);

  // Database state
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: '',
    supplier_id: '',
    unit_of_measure: '',
    standard_cost: 0,
    selling_price: 0
  });

  const { sidebarCollapsed } = useSidebar();

  // Load data from database
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, suppliersData] = await Promise.all([
        productManagement.getAllProducts(),
        supplierManagement.getAllSuppliers()
      ]);
      setProducts(productsData);
      setSuppliers(suppliersData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      setError(null);
      if (rightActiveTab === 'Materials') {
        const newProduct = await productManagement.createProduct({
          product_code: formData.code,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          supplier_id: formData.supplier_id || undefined,
          unit_of_measure: formData.unit_of_measure,
          standard_cost: formData.standard_cost,
          selling_price: formData.selling_price
        });
        setProducts([newProduct, ...products]);
      } else if (leftActiveTab === 'Material Supplier Profiles') {
        const newSupplier = await supplierManagement.createSupplier({
          supplier_code: formData.code,
          name: formData.name,
          contact_person: formData.description,
          email: formData.category,
          phone: formData.unit_of_measure
        });
        setSuppliers([newSupplier, ...suppliers]);
      }
      
      setShowAddModal(false);
      setFormData({
        name: '',
        code: '',
        description: '',
        category: '',
        supplier_id: '',
        unit_of_measure: '',
        standard_cost: 0,
        selling_price: 0
      });
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    }
  };

  const handleEditItem = async () => {
    if (!editingItem) return;
    
    try {
      setError(null);
      if (rightActiveTab === 'Materials' && 'product_code' in editingItem) {
        const updatedProduct = await productManagement.updateProduct(editingItem.id, {
          product_code: formData.code,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          supplier_id: formData.supplier_id || undefined,
          unit_of_measure: formData.unit_of_measure,
          standard_cost: formData.standard_cost,
          selling_price: formData.selling_price
        });
        setProducts(products.map(item => 
          item.id === editingItem.id ? updatedProduct : item
        ));
      } else if (leftActiveTab === 'Material Supplier Profiles' && 'supplier_code' in editingItem) {
        const updatedSupplier = await supplierManagement.updateSupplier(editingItem.id, {
          supplier_code: formData.code,
          name: formData.name,
          contact_person: formData.description,
          email: formData.category,
          phone: formData.unit_of_measure
        });
        setSuppliers(suppliers.map(item => 
          item.id === editingItem.id ? updatedSupplier : item
        ));
      }
      
      setEditingItem(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        category: '',
        supplier_id: '',
        unit_of_measure: '',
        standard_cost: 0,
        selling_price: 0
      });
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setError(null);
        if (rightActiveTab === 'Materials') {
          await productManagement.deleteProduct(id);
          setProducts(products.filter(item => item.id !== id));
        } else if (leftActiveTab === 'Material Supplier Profiles') {
          await supplierManagement.deleteSupplier(id);
          setSuppliers(suppliers.filter(item => item.id !== id));
        }
      } catch (err) {
        console.error('Error deleting item:', err);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  const openEditModal = (item: Product | Supplier) => {
    setEditingItem(item);
    if ('product_code' in item) {
      setFormData({
        name: item.name,
        code: item.product_code,
        description: item.description || '',
        category: item.category || '',
        supplier_id: item.supplier_id || '',
        unit_of_measure: item.unit_of_measure || '',
        standard_cost: item.standard_cost || 0,
        selling_price: item.selling_price || 0
      });
    } else {
      setFormData({
        name: item.name,
        code: item.supplier_code,
        description: item.contact_person || '',
        category: item.email || '',
        supplier_id: '',
        unit_of_measure: item.phone || '',
        standard_cost: 0,
        selling_price: 0
      });
    }
  };

  const handleLeftTabChange = useCallback((tab: string) => {
    setLeftActiveTab(tab);
  }, []);

  const handleRightTabChange = useCallback((tab: string) => {
    setRightActiveTab(tab);
  }, []);

  const handleRowClick = useCallback((row: any) => {
    setSelectedRowIndex(row.id);
  }, []);

  const leftTabs = useMemo(() => MATERIAL_LEFT_TABS, []);
  const rightTabs = useMemo(() => MATERIAL_RIGHT_TABS, []);

  // Filter data based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.supplier_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading materials...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex">
        <ProductFilterSidebar 
          collapsed={filterSidebarCollapsed}
          setCollapsed={setFilterSidebarCollapsed}
        />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${filterSidebarCollapsed ? 'ml-0' : 'ml-0'}`}>
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Material Manager</h1>
              <p className="text-gray-600">Manage materials and suppliers with real-time database operations</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Search and Add Button */}
            <div className="mb-6 flex justify-between items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search materials or suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {rightActiveTab === 'Materials' ? 'Material' : 'Supplier'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
              {/* Left Column - Suppliers */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b" style={{ borderColor: '#3D75A3' }}>
                  <div className="flex">
                    {leftTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleLeftTabChange(tab)}
                        className={`px-4 py-3 font-medium text-xs ${
                          leftActiveTab === tab
                            ? 'bg-gray-100 text-gray-900 border-t-2 border-l-2 shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                        style={leftActiveTab === tab ? { borderColor: '#3D75A3' } : {}}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Suppliers Table */}
                {leftActiveTab === 'Material Supplier Profiles' && (
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredSuppliers.map((supplier) => (
                            <tr key={supplier.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm text-gray-900">{supplier.supplier_code}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{supplier.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">{supplier.contact_person}</td>
                              <td className="px-4 py-2 text-sm">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openEditModal(supplier)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(supplier.id)}
                                    className="text-red-600 hover:text-red-900"
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
                )}

                {/* Suppliers Table */}
                {leftActiveTab === 'Material Supplier Profiles' && (
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredSuppliers.map((supplier) => (
                            <tr key={supplier.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm text-gray-900">{supplier.supplier_code}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{supplier.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">{supplier.contact_person}</td>
                              <td className="px-4 py-2 text-sm">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openEditModal(supplier)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(supplier.id)}
                                    className="text-red-600 hover:text-red-900"
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
                )}

                {/* Lines Table */}
                {leftActiveTab === 'Lines' && (
                  <div className="p-4">
                    <div className="overflow-x-auto" style={{ maxHeight: '500px' }}>
                      <table className="w-full min-w-max">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Material Purchase Order</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Material</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">MPO Line</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Quantity</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Sample Log Comment</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Sample Log Status</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Sample Log Type</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Sample Log Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Customer</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Collection</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Division</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Group</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Transport Method</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Deliver To</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Status</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Delivery Date</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Comments</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Selling Quantity</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Closed Date</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Line Purchase Price</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Line Selling Price</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Note Count</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Latest Note</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Order Quantity Increment</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Order Lead Time</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Supplier Ref.</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Template</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">MPO Line Key Date</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">MPO Status</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Supplier Purchase Currency</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Customer Selling Currency</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Supplier</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Purchase Currency</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Selling Currency</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Min Order Qty</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Min Colour Qty</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Material Description</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Material Type</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Material Sub Type</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Material Status</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Buyer Style Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Buyer Style Number</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Department</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Season</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Supplier Profile</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Profile Purchase Currency</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Profile Selling Currency</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Costing Status</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Payment Term</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Payment Term Desc</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Purchase Price</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Selling Price</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Purchasing</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Key User 2</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Key User 3</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Key User 4</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Key User 5</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Customer Parent</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Recipient Supplier</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">FG PO Number</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Received</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Balance</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Over Received</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Size</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Delivery Contact</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Composition</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Created By</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Created</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Last Edited</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Last Edited By</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Color</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">AWB</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Invoice Number</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Payment Confirmation</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Invoice Status</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">FG Ex-Factory</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Trim Receipt Date</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {/* Lines data will be populated from database */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></div>

              {/* Right Column - Materials */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b" style={{ borderColor: '#3D75A3' }}>
                  <div className="flex">
                    {rightTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleRightTabChange(tab)}
                        className={`px-4 py-3 font-medium text-xs ${
                          rightActiveTab === tab
                            ? 'bg-gray-100 text-gray-900 border-t-2 border-l-2 shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                        style={rightActiveTab === tab ? { borderColor: '#3D75A3' } : {}}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Materials Table */}
                {rightActiveTab === 'Materials' && (
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm text-gray-900">{product.product_code}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">{product.category}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">${product.standard_cost}</td>
                              <td className="px-4 py-2 text-sm">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openEditModal(product)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(product.id)}
                                    className="text-red-600 hover:text-red-900"
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
                )}
              </div>
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || editingItem) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">
                    {editingItem ? 'Edit' : 'Add'} {rightActiveTab === 'Materials' ? 'Material' : 'Supplier'}
                  </h2>
                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    if (editingItem) {
                      handleEditItem();
                    } else {
                      handleAddItem();
                    }
                  }}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {rightActiveTab === 'Materials' ? 'Product Code' : 'Supplier Code'} *
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {rightActiveTab === 'Materials' ? 'Description' : 'Contact Person'}
                      </label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    {rightActiveTab === 'Materials' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Standard Cost
                          </label>
                          <input
                            type="number"
                            value={formData.standard_cost}
                            onChange={(e) => setFormData({...formData, standard_cost: parseFloat(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        {editingItem ? 'Update' : 'Add'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddModal(false);
                          setEditingItem(null);
                          setFormData({
                            name: '',
                            code: '',
                            description: '',
                            category: '',
                            supplier_id: '',
                            unit_of_measure: '',
                            standard_cost: 0,
                            selling_price: 0
                          });
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ReportBar Component */}
            <ReportBar
              showSlideUpContainer={showSlideUpContainer}
              setShowSlideUpContainer={setShowSlideUpContainer}
              activeContent={activeContent}
              setActiveContent={setActiveContent}
              sidebarCollapsed={sidebarCollapsed}
              pageData={{
                'Created': '2024-01-15',
                'Last Edited': '2024-01-20',
                'PO Issue Date': '2024-01-25',
                'Order References': selectedRowIndex !== null ? `Material-${selectedRowIndex + 1}` : 'Material-001',
                'Status': selectedRowIndex !== null ? (selectedRowIndex % 2 === 0 ? 'Active' : 'Pending') : 'Active',
                'Production': 'In Progress',
                'Purchase Order Status': 'Issued',
                'Template': 'Standard Material Template',
                'Default PO Line Template': 'Material Line Template',
                'Customer': 'ABC Corp',
                'Supplier': 'XYZ Textiles',
                'Purchase Currency': 'USD',
                'Selling Currency': 'EUR',
                'Total Qty': '1000',
                'Total Cost': '$10,000',
                'Total Value': '$12,000'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialManager;