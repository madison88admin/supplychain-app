import React, { useState, useCallback } from 'react';
import { Plus, Search, Filter, Package, Calendar, DollarSign, TrendingUp, Eye, Edit, Truck, MoreHorizontal } from 'lucide-react';
import { useContextMenu } from '../hooks/useContextMenu';
import { buildContextMenu } from '../utils/contextMenuBuilder';
import ContextMenu from '../components/ContextMenu';
import MaterialDetailsModal from '../components/modals/MaterialDetailsModal';

const MaterialManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Context menu state
  const { isOpen, context, menuItems, openMenu, closeMenu } = useContextMenu();

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

  // Table context for context menu actions
  const tableContext = {
    data: materialOrders,
    selectedRows,
    columns: [
      { key: 'mpoNumber', label: 'MPO Number', sortable: true },
      { key: 'materialItem', label: 'Material', sortable: true },
      { key: 'supplier', label: 'Supplier', sortable: true },
      { key: 'quantity', label: 'Quantity', sortable: true },
      { key: 'totalValue', label: 'Total Value', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'orderDate', label: 'Order Date', sortable: true },
      { key: 'invoiceStatus', label: 'Invoice Status', sortable: true }
    ],
    onEditRow: useCallback((row: any) => {
      console.log('Edit material order:', row);
      // Implement your edit logic here
    }, []),
    onDeleteRow: useCallback((row: any) => {
      console.log('Delete material order:', row);
      if (confirm(`Are you sure you want to delete MPO "${row.mpoNumber}"?`)) {
        // Implement your delete logic here
        console.log('Material order deleted:', row);
      }
    }, []),
    onDuplicateRow: useCallback((row: any) => {
      console.log('Duplicate material order:', row);
      // Implement your duplicate logic here
    }, []),
    onViewDetails: useCallback((row: any) => {
      setSelectedOrder(row);
      setIsDetailsModalOpen(true);
    }, []),
    onAddNote: useCallback((row: any) => {
      console.log('Add note to material order:', row);
      // Implement your add note logic here
    }, []),
    onExport: useCallback((format: string, rows?: any[]) => {
      console.log('Export material orders as', format, ':', rows || selectedRows);
      // Implement your export logic here
    }, [selectedRows]),
    onAssignUser: useCallback((rows: any[]) => {
      console.log('Assign users to material orders:', rows);
      // Implement your assign user logic here
    }, []),
    onChangeStatus: useCallback((rows: any[], status: string) => {
      console.log('Change status to', status, 'for material orders:', rows);
      // Implement your change status logic here
    }, []),
    onBulkUpdate: useCallback((rows: any[], field: string, value: any) => {
      console.log('Bulk update', field, 'to', value, 'for material orders:', rows);
      // Implement your bulk update logic here
    }, []),
    onSort: useCallback((column: string, direction: 'asc' | 'desc') => {
      console.log('Sort material orders by', column, direction);
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
      console.log('Refresh material orders table');
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
      return row.status === 'Received' || row.status === 'Completed';
    }, []),
    canEdit: useCallback((row: any) => {
      return row.status !== 'Received' && row.status !== 'Completed';
    }, []),
    canDelete: useCallback((row: any) => {
      return row.status === 'Ordered' || row.status === 'Processing';
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: '✓',
          bgColor: 'bg-emerald-100',
          iconColor: 'text-emerald-600'
        };
      case 'In Transit':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: '🚚',
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
      case 'Received':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: '📦',
          bgColor: 'bg-purple-100',
          iconColor: 'text-purple-600'
        };
      case 'Processing':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: '⏳',
          bgColor: 'bg-amber-100',
          iconColor: 'text-amber-600'
        };
      case 'Ordered':
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: '📋',
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: '❓',
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600'
        };
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

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedOrder(null);
  };

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" onContextMenu={handleTableContextMenu}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'mpoNumber')}>MPO Number</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'materialItem')}>Material</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'supplier')}>Supplier</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'quantity')}>Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'totalValue')}>Total Value</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'status')}>Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'orderDate')}>Dates</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'invoiceStatus')}>Invoice</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50" onContextMenu={(e) => handleRowContextMenu(e, order)}>
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
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded-full ${statusConfig.bgColor}`}>
                          <span className={`text-xs ${statusConfig.iconColor}`}>{statusConfig.icon}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                          {order.status}
                        </span>
                      </div>
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
                        <button 
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="View details"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                          title="Edit order"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {order.status === 'In Transit' && (
                          <button 
                            className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                            title="Track shipment"
                          >
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="More options"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

      {/* Context Menu */}
      {isOpen && context && (
        <ContextMenu
          items={menuItems}
          x={context.position.x}
          y={context.position.y}
          onClose={closeMenu}
        />
      )}

      {/* Details Modal */}
      <MaterialDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default MaterialManager;