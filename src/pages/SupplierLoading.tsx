import React, { useState, useCallback } from 'react';
import { Plus, Search, Filter, Truck, Calendar, Package, MapPin, Eye, Edit, Ship, Plane, MoreHorizontal } from 'lucide-react';
import { useContextMenu } from '../hooks/useContextMenu';
import { buildContextMenu } from '../utils/contextMenuBuilder';
import ContextMenu from '../components/ContextMenu';
import SupplierLoadingModal from '../components/modals/SupplierLoadingModal';

const SupplierLoading: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  // Context menu state
  const { isOpen, context, menuItems, openMenu, closeMenu } = useContextMenu();

  const shipments = [
    {
      id: 1,
      shipmentId: 'SH-2024-001',
      customer: 'H&M',
      supplier: 'Textile Solutions Ltd',
      poNumber: 'PO-2024-001',
      quantity: 10000,
      status: 'In Transit',
      shipmentBooking: 'BK-12345',
      vesselETD: '2024-01-20',
      customerDeliveryDate: '2024-02-15',
      deliveryTo: 'Hamburg, Germany',
      supplierInvoice: 'SI-2024-001',
      invoiceAmount: 159900,
      shippingMethod: 'Sea Freight',
      trackingNumber: 'TRK-789012',
      progress: 65,
      estimatedArrival: '2024-02-12'
    },
    {
      id: 2,
      shipmentId: 'SH-2024-002',
      customer: 'Zara',
      supplier: 'Fashion Factory Inc',
      poNumber: 'PO-2024-002',
      quantity: 5000,
      status: 'Booked',
      shipmentBooking: 'BK-67890',
      vesselETD: '2024-01-25',
      customerDeliveryDate: '2024-02-20',
      deliveryTo: 'Barcelona, Spain',
      supplierInvoice: 'SI-2024-002',
      invoiceAmount: 149950,
      shippingMethod: 'Air Freight',
      trackingNumber: 'TRK-345678',
      progress: 30,
      estimatedArrival: '2024-02-18'
    },
    {
      id: 3,
      shipmentId: 'SH-2024-003',
      customer: 'Uniqlo',
      supplier: 'Denim Works Co',
      poNumber: 'PO-2024-003',
      quantity: 8000,
      status: 'Preparing',
      shipmentBooking: 'BK-11223',
      vesselETD: '2024-02-01',
      customerDeliveryDate: '2024-03-01',
      deliveryTo: 'Tokyo, Japan',
      supplierInvoice: null,
      invoiceAmount: null,
      shippingMethod: 'Sea Freight',
      trackingNumber: null,
      progress: 15,
      estimatedArrival: '2024-02-28'
    },
    {
      id: 4,
      shipmentId: 'SH-2024-004',
      customer: 'Nike',
      supplier: 'SportsTech Manufacturing',
      poNumber: 'PO-2024-004',
      quantity: 15000,
      status: 'Delivered',
      shipmentBooking: 'BK-99887',
      vesselETD: '2024-01-15',
      customerDeliveryDate: '2024-01-28',
      deliveryTo: 'Portland, USA',
      supplierInvoice: 'SI-2024-004',
      invoiceAmount: 374850,
      shippingMethod: 'Air Freight',
      trackingNumber: 'TRK-998877',
      progress: 100,
      estimatedArrival: '2024-01-25'
    },
    {
      id: 5,
      shipmentId: 'SH-2024-005',
      customer: 'Patagonia',
      supplier: 'OutdoorGear Manufacturing',
      poNumber: 'PO-2024-005',
      quantity: 3000,
      status: 'Customs Clearance',
      shipmentBooking: 'BK-55443',
      vesselETD: '2024-01-22',
      customerDeliveryDate: '2024-02-28',
      deliveryTo: 'California, USA',
      supplierInvoice: 'SI-2024-005',
      invoiceAmount: 269970,
      shippingMethod: 'Sea Freight',
      trackingNumber: 'TRK-554433',
      progress: 85,
      estimatedArrival: '2024-02-25'
    },
  ];

  // Table context for context menu actions
  const tableContext = {
    data: shipments,
    selectedRows,
    columns: [
      { key: 'shipmentId', label: 'Shipment ID', sortable: true },
      { key: 'customer', label: 'Customer', sortable: true },
      { key: 'supplier', label: 'Supplier', sortable: true },
      { key: 'poNumber', label: 'PO Number', sortable: true },
      { key: 'quantity', label: 'Quantity', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'shippingMethod', label: 'Shipping', sortable: true },
      { key: 'progress', label: 'Progress', sortable: true }
    ],
    onEditRow: useCallback((row: any) => {
      console.log('Edit shipment:', row);
      // Implement your edit logic here
    }, []),
    onDeleteRow: useCallback((row: any) => {
      console.log('Delete shipment:', row);
      if (confirm(`Are you sure you want to delete shipment "${row.shipmentId}"?`)) {
        // Implement your delete logic here
        console.log('Shipment deleted:', row);
      }
    }, []),
    onDuplicateRow: useCallback((row: any) => {
      console.log('Duplicate shipment:', row);
      // Implement your duplicate logic here
    }, []),
    onViewDetails: useCallback((row: any) => {
      setSelectedShipment(row);
      setIsDetailsModalOpen(true);
    }, []),
    onAddNote: useCallback((row: any) => {
      console.log('Add note to shipment:', row);
      // Implement your add note logic here
    }, []),
    onExport: useCallback((format: string, rows?: any[]) => {
      console.log('Export shipments as', format, ':', rows || selectedRows);
      // Implement your export logic here
    }, [selectedRows]),
    onAssignUser: useCallback((rows: any[]) => {
      console.log('Assign users to shipments:', rows);
      // Implement your assign user logic here
    }, []),
    onChangeStatus: useCallback((rows: any[], status: string) => {
      console.log('Change status to', status, 'for shipments:', rows);
      // Implement your change status logic here
    }, []),
    onBulkUpdate: useCallback((rows: any[], field: string, value: any) => {
      console.log('Bulk update', field, 'to', value, 'for shipments:', rows);
      // Implement your bulk update logic here
    }, []),
    onSort: useCallback((column: string, direction: 'asc' | 'desc') => {
      console.log('Sort shipments by', column, direction);
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
      console.log('Refresh shipments table');
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
      return row.status === 'Delivered' || row.status === 'Completed';
    }, []),
    canEdit: useCallback((row: any) => {
      return row.status !== 'Delivered' && row.status !== 'Completed';
    }, []),
    canDelete: useCallback((row: any) => {
      return row.status === 'Preparing' || row.status === 'Booked';
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
      case 'Delivered':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: '✓',
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600'
        };
      case 'In Transit':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: '🚚',
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
      case 'Customs Clearance':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: '⏳',
          bgColor: 'bg-amber-100',
          iconColor: 'text-amber-600'
        };
      case 'Booked':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: '📦',
          bgColor: 'bg-purple-100',
          iconColor: 'text-purple-600'
        };
      case 'Preparing':
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

  const getShippingIcon = (method: string) => {
    switch (method) {
      case 'Sea Freight': return <Ship className="h-4 w-4" />;
      case 'Air Freight': return <Plane className="h-4 w-4" />;
      default: return <Truck className="h-4 w-4" />;
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    const matchesSupplier = filterSupplier === 'all' || shipment.supplier === filterSupplier;
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const totalShipments = filteredShipments.length;
  const inTransitCount = filteredShipments.filter(s => s.status === 'In Transit').length;
  const deliveredCount = filteredShipments.filter(s => s.status === 'Delivered').length;
  const totalValue = filteredShipments.reduce((sum, s) => sum + (s.invoiceAmount || 0), 0);

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedShipment(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier Loading</h1>
            <p className="text-gray-600">Track supplier shipments and logistics</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>New Shipment</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{totalShipments}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-blue-600">{inTransitCount}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Ship className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{deliveredCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${(totalValue / 1000000).toFixed(1)}M</p>
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
              <option value="Preparing">Preparing</option>
              <option value="Booked">Booked</option>
              <option value="In Transit">In Transit</option>
              <option value="Customs Clearance">Customs Clearance</option>
              <option value="Delivered">Delivered</option>
            </select>
            <select 
              value={filterSupplier} 
              onChange={(e) => setFilterSupplier(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Suppliers</option>
              <option value="Textile Solutions Ltd">Textile Solutions Ltd</option>
              <option value="Fashion Factory Inc">Fashion Factory Inc</option>
              <option value="Denim Works Co">Denim Works Co</option>
              <option value="SportsTech Manufacturing">SportsTech Manufacturing</option>
              <option value="OutdoorGear Manufacturing">OutdoorGear Manufacturing</option>
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search shipments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" onContextMenu={handleTableContextMenu}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'shipmentId')}>Shipment ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'customer')}>Customer</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'supplier')}>Supplier</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'poNumber')}>PO Number</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'quantity')}>Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'status')}>Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'shippingMethod')}>Shipping</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900" onContextMenu={(e) => handleColumnContextMenu(e, 'progress')}>Progress</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShipments.map((shipment) => {
                const statusConfig = getStatusConfig(shipment.status);
                
                return (
                  <tr key={shipment.id} className="hover:bg-gray-50" onContextMenu={(e) => handleRowContextMenu(e, shipment)}>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{shipment.shipmentId}</div>
                        <div className="text-sm text-gray-500">{shipment.shipmentBooking}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{shipment.customer}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{shipment.supplier}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{shipment.poNumber}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{shipment.quantity.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded-full ${statusConfig.bgColor}`}>
                          <span className={`text-xs ${statusConfig.iconColor}`}>{statusConfig.icon}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                          {shipment.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {getShippingIcon(shipment.shippingMethod)}
                          <span className="text-sm text-gray-900">{shipment.shippingMethod}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          ETD: {new Date(shipment.vesselETD).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          ETA: {new Date(shipment.estimatedArrival).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="w-20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">{shipment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${shipment.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${shipment.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="View details"
                          onClick={() => {
                            setSelectedShipment(shipment);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                          title="Edit shipment"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                          title="Track location"
                        >
                          <MapPin className="h-4 w-4" />
                        </button>
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

      {filteredShipments.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create New Shipment
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
      <SupplierLoadingModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModal}
        shipment={selectedShipment}
      />
    </div>
  );
};

export default SupplierLoading;