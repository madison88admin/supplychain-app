import React from 'react';
import { X, Calendar, MapPin, Building, Package, DollarSign, Truck, AlertCircle, CheckCircle, Clock, FileText, Ship, Plane } from 'lucide-react';

interface MaterialDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const MaterialDetailsModal: React.FC<MaterialDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle,
          bgColor: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          description: 'Order confirmed and ready for processing'
        };
      case 'In Transit':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Truck,
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          description: 'Material is currently in transit'
        };
      case 'Received':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Package,
          bgColor: 'bg-purple-100',
          iconColor: 'text-purple-600',
          description: 'Material has been received'
        };
      case 'Processing':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
          bgColor: 'bg-amber-100',
          iconColor: 'text-amber-600',
          description: 'Order is being processed'
        };
      case 'Ordered':
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: FileText,
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          description: 'Order has been placed'
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

  const getInvoiceStatusConfig = (status: string) => {
    switch (status) {
      case 'Paid':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'Pending':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
          iconColor: 'text-amber-600'
        };
      case 'Not Issued':
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: FileText,
          iconColor: 'text-gray-600'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: AlertCircle,
          iconColor: 'text-gray-600'
        };
    }
  };

  const getMaterialTypeConfig = (type: string) => {
    switch (type) {
      case 'Fabric':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Package,
          iconColor: 'text-blue-600'
        };
      case 'Lining':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: Package,
          iconColor: 'text-green-600'
        };
      case 'Trims':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Package,
          iconColor: 'text-purple-600'
        };
      case 'Padding':
        return {
          color: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: Package,
          iconColor: 'text-orange-600'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: Package,
          iconColor: 'text-gray-600'
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const invoiceStatusConfig = getInvoiceStatusConfig(order.invoiceStatus);
  const materialTypeConfig = getMaterialTypeConfig(order.materialType);
  
  const StatusIcon = statusConfig.icon;
  const InvoiceStatusIcon = invoiceStatusConfig.icon;
  const MaterialTypeIcon = materialTypeConfig.icon;

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
              <h2 className="text-xl font-bold text-gray-900">{order.mpoNumber}</h2>
              <p className="text-sm text-gray-600">{order.materialItem}</p>
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
              {/* Material Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Material Item:</span>
                    <span className="text-sm font-medium text-gray-900">{order.materialItem}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Color:</span>
                    <span className="text-sm font-medium text-gray-900">{order.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Material Type:</span>
                    <div className="flex items-center space-x-2">
                      <MaterialTypeIcon className={`h-4 w-4 ${materialTypeConfig.iconColor}`} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${materialTypeConfig.color}`}>
                        {order.materialType}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Related PO:</span>
                    <span className="text-sm font-medium text-gray-900">{order.relatedPO}</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <span className="text-sm font-medium text-gray-900">{order.quantity.toLocaleString()} {order.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Unit Price:</span>
                    <span className="text-sm font-medium text-gray-900">${order.unitPrice}/{order.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Value:</span>
                    <span className="text-sm font-medium text-gray-900">${order.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lead Time:</span>
                    <span className="text-sm font-medium text-gray-900">{order.leadTime} days</span>
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
                      <div className="text-sm text-gray-600">Order Date</div>
                      <div className="text-sm font-medium text-gray-900">{new Date(order.orderDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Ship Date</div>
                      <div className="text-sm font-medium text-gray-900">{new Date(order.shipDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Receive Date</div>
                      <div className="text-sm font-medium text-gray-900">{new Date(order.receiveDate).toLocaleDateString()}</div>
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
                      <span className="text-sm font-medium text-gray-900">Order Status</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{statusConfig.description}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1 rounded-full ${invoiceStatusConfig.iconColor.replace('text-', 'bg-').replace('-600', '-100')}`}>
                        <InvoiceStatusIcon className={`h-4 w-4 ${invoiceStatusConfig.iconColor}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Invoice Status</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${invoiceStatusConfig.color}`}>
                      {order.invoiceStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supplier Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Supplier</div>
                      <div className="text-sm font-medium text-gray-900">{order.supplier}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping & Tracking */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Tracking</h3>
                <div className="space-y-3">
                  {order.awb && (
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">AWB Number</div>
                        <div className="text-sm font-medium text-gray-900">{order.awb}</div>
                      </div>
                    </div>
                  )}
                  {order.invoiceNumber && (
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Invoice Number</div>
                        <div className="text-sm font-medium text-gray-900">{order.invoiceNumber}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Order Placed</div>
                      <div className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${order.status === 'Confirmed' || order.status === 'Processing' || order.status === 'In Transit' || order.status === 'Received' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Order Confirmed</div>
                      <div className="text-xs text-gray-500">Processing...</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${order.status === 'In Transit' || order.status === 'Received' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Shipped</div>
                      <div className="text-xs text-gray-500">{new Date(order.shipDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${order.status === 'Received' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Received</div>
                      <div className="text-xs text-gray-500">{new Date(order.receiveDate).toLocaleDateString()}</div>
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
            Edit Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetailsModal; 