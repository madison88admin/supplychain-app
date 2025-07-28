import React, { useState, useCallback } from 'react';
import { Plus, Search, Filter, Eye, Edit, ShoppingCart, Calendar, DollarSign, TrendingUp, Package, Truck } from 'lucide-react';
import { useContextMenu } from '../hooks/useContextMenu';
import { buildContextMenu } from '../utils/contextMenuBuilder';
import ContextMenu from '../components/ContextMenu';

const ProductManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Context menu state
  const { isOpen, context, menuItems, openMenu, closeMenu } = useContextMenu();

  const purchaseOrders = [
    {
      id: 1,
      poNumber: 'PO-2024-001',
      customer: 'H&M',
      styleNumber: 'SC001',
      styleName: 'Cotton T-Shirt Premium',
      colorway: 'Navy Blue',
      quantity: 10000,
      sizes: 'XS-XXL',
      unitPrice: 15.99,
      totalValue: 159900,
      status: 'Confirmed',
      exFactoryDate: '2024-02-15',
      destination: 'Hamburg, Germany',
      version: 'FC1',
      supplier: 'Textile Solutions Ltd',
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-14',
      bulkApprovalStatus: 'Approved',
      progress: 85
    },
    {
      id: 2,
      poNumber: 'PO-2024-002',
      customer: 'Zara',
      styleNumber: 'SC002',
      styleName: 'Summer Dress Collection',
      colorway: 'Floral Print',
      quantity: 5000,
      sizes: 'XS-L',
      unitPrice: 29.99,
      totalValue: 149950,
      status: 'In Production',
      exFactoryDate: '2024-02-20',
      destination: 'Barcelona, Spain',
      version: 'FC2',
      supplier: 'Fashion Factory Inc',
      createdDate: '2024-01-12',
      lastUpdated: '2024-01-13',
      bulkApprovalStatus: 'Pending',
      progress: 60
    },
    {
      id: 3,
      poNumber: 'PO-2024-003',
      customer: 'Uniqlo',
      styleNumber: 'SC003',
      styleName: 'Denim Jacket Classic',
      colorway: 'Indigo',
      quantity: 8000,
      sizes: 'S-XL',
      unitPrice: 49.99,
      totalValue: 399920,
      status: 'Draft',
      exFactoryDate: '2024-03-01',
      destination: 'Tokyo, Japan',
      version: 'FC1',
      supplier: 'Denim Works Co',
      createdDate: '2024-01-14',
      lastUpdated: '2024-01-14',
      bulkApprovalStatus: 'Not Required',
      progress: 25
    },
    {
      id: 4,
      poNumber: 'PO-2024-004',
      customer: 'Nike',
      styleNumber: 'SC004',
      styleName: 'Athletic Shorts Pro',
      colorway: 'Black/White',
      quantity: 15000,
      sizes: 'XS-XXL',
      unitPrice: 24.99,
      totalValue: 374850,
      status: 'Shipped',
      exFactoryDate: '2024-01-25',
      destination: 'Portland, USA',
      version: 'FC3',
      supplier: 'SportsTech Manufacturing',
      createdDate: '2024-01-08',
      lastUpdated: '2024-01-11',
      bulkApprovalStatus: 'Approved',
      progress: 100
    },
    {
      id: 5,
      poNumber: 'PO-2024-005',
      customer: 'Patagonia',
      styleNumber: 'SC005',
      styleName: 'Winter Coat Premium',
      colorway: 'Forest Green',
      quantity: 3000,
      sizes: 'S-XL',
      unitPrice: 89.99,
      totalValue: 269970,
      status: 'Approved',
      exFactoryDate: '2024-02-28',
      destination: 'California, USA',
      version: 'FC1',
      supplier: 'OutdoorGear Manufacturing',
      createdDate: '2024-01-11',
      lastUpdated: '2024-01-12',
      bulkApprovalStatus: 'Approved',
      progress: 40
    },
  ];

  // Table context for context menu actions
  const tableContext = {
    data: purchaseOrders,
    selectedRows,
    columns: [
      { key: 'poNumber', label: 'PO Number', sortable: true },
      { key: 'styleName', label: 'Product', sortable: true },
      { key: 'customer', label: 'Customer', sortable: true },
      { key: 'quantity', label: 'Quantity', sortable: true },
      { key: 'totalValue', label: 'Total Value', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'exFactoryDate', label: 'Ex-Factory', sortable: true },
      { key: 'progress', label: 'Progress', sortable: true }
    ],
    onEditRow: useCallback((row: any) => {
      console.log('Edit purchase order:', row);
      // Implement your edit logic here
    }, []),
    onDeleteRow: useCallback((row: any) => {
      console.log('Delete purchase order:', row);
      if (confirm(`Are you sure you want to delete PO "${row.poNumber}"?`)) {
        // Implement your delete logic here
        console.log('Purchase order deleted:', row);
      }
    }, []),
    onDuplicateRow: useCallback((row: any) => {
      console.log('Duplicate purchase order:', row);
      // Implement your duplicate logic here
    }, []),
    onViewDetails: useCallback((row: any) => {
      console.log('View purchase order details:', row);
      // Implement your view details logic here
    }, []),
    onAddNote: useCallback((row: any) => {
      console.log('Add note to purchase order:', row);
      // Implement your add note logic here
    }, []),
    onExport: useCallback((format: string, rows?: any[]) => {
      console.log('Export purchase orders as', format, ':', rows || selectedRows);
      // Implement your export logic here
    }, [selectedRows]),
    onAssignUser: useCallback((rows: any[]) => {
      console.log('Assign users to purchase orders:', rows);
      // Implement your assign user logic here
    }, []),
    onChangeStatus: useCallback((rows: any[], status: string) => {
      console.log('Change status to', status, 'for purchase orders:', rows);
      // Implement your change status logic here
    }, []),
    onBulkUpdate: useCallback((rows: any[], field: string, value: any) => {
      console.log('Bulk update', field, 'to', value, 'for purchase orders:', rows);
      // Implement your bulk update logic here
    }, []),
    onSort: useCallback((column: string, direction: 'asc' | 'desc') => {
      console.log('Sort purchase orders by', column, direction);
      // Implement your sort logic here
    }, []),
    onHideColumn: useCallback((column: string) => {
      console.log('Hide column:', column);
      // Implement your hide column logic here
    }, []),
    onShowColumn: useCallback((column: string) => {
      console.log('Show column:', column);
      // Implement your show column logic here
    }, []),
    onFilterByColumn: useCallback((column: string, value: any) => {
      console.log('Filter by', column, '=', value);
      // Implement your filter logic here
    }, []),
    onGroupByColumn: useCallback((column: string) => {
      console.log('Group by:', column);
      // Implement your group logic here
    }, []),
    onResizeColumn: useCallback((column: string, width: number) => {
      console.log('Resize column', column, 'to', width);
      // Implement your resize logic here
    }, []),
    onRefresh: useCallback(() => {
      console.log('Refresh purchase orders table');
      // Implement your refresh logic here
    }, []),
    onTogglePagination: useCallback(() => {
      console.log('Toggle pagination');
      // Implement your pagination toggle logic here
    }, []),
    onCustomizeColumns: useCallback(() => {
      console.log('Customize columns');
      // Implement your customize columns logic here
    }, []),
    onSaveView: useCallback(() => {
      console.log('Save current view');
      // Implement your save view logic here
    }, []),
    isRowLocked: useCallback((row: any) => {
      return row.status === 'Shipped' || row.status === 'Completed';
    }, []),
    canEdit: useCallback((row: any) => {
      return row.status !== 'Shipped' && row.status !== 'Completed';
    }, []),
    canDelete: useCallback((row: any) => {
      return row.status === 'Draft' || row.status === 'Approved';
    }, [])
  };

  // Right-click handlers
  const handleRowContextMenu = useCallback((event: React.MouseEvent, row: any) => {
    event.preventDefault();
    const context = {
      target: 'row' as const,
      data: row,
      position: { x: event.clientX, y: event.clientY }
    };
    const items = buildContextMenu(context, tableContext);
    openMenu(event, context, items);
  }, [openMenu, tableContext]);

  const handleColumnContextMenu = useCallback((event: React.MouseEvent, columnKey: string) => {
    event.preventDefault();
    const context = {
      target: 'column' as const,
      columnKey,
      position: { x: event.clientX, y: event.clientY }
    };
    const items = buildContextMenu(context, tableContext);
    openMenu(event, context, items);
  }, [openMenu, tableContext]);

  const handleTableContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const context = {
      target: 'table' as const,
      position: { x: event.clientX, y: event.clientY }
    };
    const items = buildContextMenu(context, tableContext);
    openMenu(event, context, items);
  }, [openMenu, tableContext]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Production': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBulkApprovalColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Not Required': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesCustomer = filterCustomer === 'all' || order.customer === filterCustomer;
    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const totalValue = filteredOrders.reduce((sum, order) => sum + order.totalValue, 0);
  const averageOrderValue = filteredOrders.length > 0 ? totalValue / filteredOrders.length : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Orders</h1>
            <p className="text-gray-600">Manage purchase orders and track production progress</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create PO</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{purchaseOrders.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${(totalValue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Production</p>
              <p className="text-2xl font-bold text-blue-600">{purchaseOrders.filter(po => po.status === 'In Production').length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">${(averageOrderValue / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
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
              <option value="Draft">Draft</option>
              <option value="Approved">Approved</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Production">In Production</option>
              <option value="Shipped">Shipped</option>
            </select>
            <select 
              value={filterCustomer} 
              onChange={(e) => setFilterCustomer(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Customers</option>
              <option value="H&M">H&M</option>
              <option value="Zara">Zara</option>
              <option value="Uniqlo">Uniqlo</option>
              <option value="Nike">Nike</option>
              <option value="Patagonia">Patagonia</option>
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" onContextMenu={handleTableContextMenu}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'poNumber')}>PO Number</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'styleName')}>Product</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'customer')}>Customer</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'quantity')}>Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'totalValue')}>Total Value</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'status')}>Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'exFactoryDate')}>Ex-Factory</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'progress')}>Progress</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50" onContextMenu={(e) => handleRowContextMenu(e, order)}>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{order.poNumber}</div>
                      <div className="text-sm text-gray-500">{order.version}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{order.styleName}</div>
                      <div className="text-sm text-gray-500">{order.styleNumber} • {order.colorway}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{order.customer}</td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm text-gray-900">{order.quantity.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{order.sizes}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-medium text-gray-900">${order.totalValue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">${order.unitPrice}/unit</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBulkApprovalColor(order.bulkApprovalStatus)}`}>
                          {order.bulkApprovalStatus}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{new Date(order.exFactoryDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">{order.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${order.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
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
                      {order.status === 'Shipped' && (
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
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase orders found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create New Purchase Order
          </button>
        </div>
      )}

      {/* Context Menu */}
      {isOpen && context && (
        <ContextMenu
          items={menuItems}
          x={context.position.x}
          y={context.position.y}
          onClose={closeMenu}
        />
      )}
    </div>
  );
};

export default ProductManager;