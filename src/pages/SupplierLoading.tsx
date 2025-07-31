import React, { useState } from 'react';
import { Plus, Search, Filter, Truck, Calendar, Package, MapPin, Eye, Edit, Ship, Plane } from 'lucide-react';

const SupplierLoading: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSupplier, setFilterSupplier] = useState('all');

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Customs Clearance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Booked': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Preparing': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Shipment ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Supplier</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">PO Number</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Shipping</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Progress</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                      {shipment.status}
                    </span>
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
                      <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-purple-600 hover:text-purple-800 transition-colors">
                        <MapPin className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
    </div>
  );
};

export default SupplierLoading;