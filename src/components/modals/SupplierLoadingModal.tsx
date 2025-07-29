import React from 'react';
import { X, Calendar, MapPin, Building, Package, DollarSign, Truck, AlertCircle, CheckCircle, Clock, FileText, Ship, Plane, Navigation } from 'lucide-react';

interface SupplierLoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: any;
}

const SupplierLoadingModal: React.FC<SupplierLoadingModalProps> = ({ isOpen, onClose, shipment }) => {
  if (!isOpen || !shipment) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Delivered':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: CheckCircle,
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          description: 'Shipment has been delivered to customer'
        };
      case 'In Transit':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Truck,
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          description: 'Shipment is currently in transit'
        };
      case 'Customs Clearance':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
          bgColor: 'bg-amber-100',
          iconColor: 'text-amber-600',
          description: 'Shipment is in customs clearance'
        };
      case 'Booked':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Ship,
          bgColor: 'bg-purple-100',
          iconColor: 'text-purple-600',
          description: 'Shipment has been booked'
        };
      case 'Preparing':
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: Package,
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          description: 'Shipment is being prepared'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: AlertCircle,
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          description: 'Unknown status'
        };
    }
  };

  const getShippingMethodConfig = (method: string) => {
    switch (method) {
      case 'Sea Freight':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Ship,
          iconColor: 'text-blue-600'
        };
      case 'Air Freight':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Plane,
          iconColor: 'text-purple-600'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: Truck,
          iconColor: 'text-gray-600'
        };
    }
  };

  const statusConfig = getStatusConfig(shipment.status);
  const shippingMethodConfig = getShippingMethodConfig(shipment.shippingMethod);
  
  const StatusIcon = statusConfig.icon;
  const ShippingMethodIcon = shippingMethodConfig.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
              <StatusIcon className={`h-6 w-6 ${statusConfig.iconColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{shipment.shipmentId}</h2>
              <p className="text-sm text-gray-600">{shipment.customer} → {shipment.supplier}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Shipment Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Shipment ID:</span>
                    <span className="text-sm font-medium text-gray-900">{shipment.shipmentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Booking Number:</span>
                    <span className="text-sm font-medium text-gray-900">{shipment.shipmentBooking}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">PO Number:</span>
                    <span className="text-sm font-medium text-gray-900">{shipment.poNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <span className="text-sm font-medium text-gray-900">{shipment.quantity.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Customer & Supplier */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer & Supplier</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Customer</div>
                      <div className="text-sm font-medium text-gray-900">{shipment.customer}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Supplier</div>
                      <div className="text-sm font-medium text-gray-900">{shipment.supplier}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Delivery To</div>
                      <div className="text-sm font-medium text-gray-900">{shipment.deliveryTo}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Dates */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Vessel ETD</div>
                      <div className="text-sm font-medium text-gray-900">{new Date(shipment.vesselETD).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Estimated Arrival</div>
                      <div className="text-sm font-medium text-gray-900">{new Date(shipment.estimatedArrival).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Customer Delivery Date</div>
                      <div className="text-sm font-medium text-gray-900">{new Date(shipment.customerDeliveryDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Status Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1 rounded-full ${statusConfig.bgColor}`}>
                        <StatusIcon className={`h-4 w-4 ${statusConfig.iconColor}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Shipment Status</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                        {shipment.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{statusConfig.description}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1 rounded-full ${shippingMethodConfig.iconColor.replace('text-', 'bg-').replace('-600', '-100')}`}>
                        <ShippingMethodIcon className={`h-4 w-4 ${shippingMethodConfig.iconColor}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Shipping Method</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${shippingMethodConfig.color}`}>
                      {shipment.shippingMethod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipment Progress</span>
                    <span className="font-medium text-gray-900">{shipment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${shipment.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${shipment.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                <div className="space-y-3">
                  {shipment.supplierInvoice && (
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Supplier Invoice</div>
                        <div className="text-sm font-medium text-gray-900">{shipment.supplierInvoice}</div>
                      </div>
                    </div>
                  )}
                  {shipment.invoiceAmount && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Invoice Amount</div>
                        <div className="text-sm font-medium text-gray-900">${shipment.invoiceAmount.toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tracking Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h3>
                <div className="space-y-3">
                  {shipment.trackingNumber && (
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Tracking Number</div>
                        <div className="text-sm font-medium text-gray-900">{shipment.trackingNumber}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Shipment Booked</div>
                      <div className="text-xs text-gray-500">{shipment.shipmentBooking}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${shipment.status === 'Preparing' || shipment.status === 'Booked' || shipment.status === 'In Transit' || shipment.status === 'Customs Clearance' || shipment.status === 'Delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Preparing</div>
                      <div className="text-xs text-gray-500">Shipment preparation</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${shipment.status === 'Booked' || shipment.status === 'In Transit' || shipment.status === 'Customs Clearance' || shipment.status === 'Delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Booked</div>
                      <div className="text-xs text-gray-500">{new Date(shipment.vesselETD).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${shipment.status === 'In Transit' || shipment.status === 'Customs Clearance' || shipment.status === 'Delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">In Transit</div>
                      <div className="text-xs text-gray-500">On the way</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${shipment.status === 'Customs Clearance' || shipment.status === 'Delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Customs Clearance</div>
                      <div className="text-xs text-gray-500">Clearing customs</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${shipment.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Delivered</div>
                      <div className="text-xs text-gray-500">{new Date(shipment.customerDeliveryDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Edit Shipment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierLoadingModal; 