import React from 'react';
import { X, Calendar, MapPin, Building, Package, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, FileText, Ship } from 'lucide-react';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle,
          bgColor: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          description: 'Order confirmed and ready for production'
        };
      case 'In Production':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Package,
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          description: 'Currently being manufactured'
        };
      case 'Draft':
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: FileText,
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          description: 'Draft order pending approval'
        };
      case 'Shipped':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Ship,
          bgColor: 'bg-purple-100',
          iconColor: 'text-purple-600',
          description: 'Order shipped to destination'
        };
      case 'Approved':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: CheckCircle,
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          description: 'Order approved and confirmed'
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

  const getBulkApprovalConfig = (status: string) => {
    switch (status) {
      case 'Approved':
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
      case 'Not Required':
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: X,
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

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'High':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: AlertCircle,
          iconColor: 'text-red-600'
        };
      case 'Medium':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
          iconColor: 'text-amber-600'
        };
      case 'Low':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: AlertCircle,
          iconColor: 'text-gray-600'
        };
    }
  };

  const getRiskLevelConfig = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: AlertCircle,
          iconColor: 'text-red-600'
        };
      case 'Medium':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
          iconColor: 'text-amber-600'
        };
      case 'Low':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: AlertCircle,
          iconColor: 'text-gray-600'
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const bulkApprovalConfig = getBulkApprovalConfig(order.bulkApprovalStatus);
  const priorityConfig = getPriorityConfig(order.priority);
  const riskLevelConfig = getRiskLevelConfig(order.riskLevel);
  
  const StatusIcon = statusConfig.icon;
  const BulkApprovalIcon = bulkApprovalConfig.icon;
  const PriorityIcon = priorityConfig.icon;
  const RiskIcon = riskLevelConfig.icon;

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
              <h2 className="text-xl font-bold text-gray-900">{order.poNumber}</h2>
              <p className="text-sm text-gray-600">{order.styleName}</p>
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
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Style Number:</span>
                    <span className="text-sm font-medium text-gray-900">{order.styleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Colorway:</span>
                    <span className="text-sm font-medium text-gray-900">{order.colorway}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Version:</span>
                    <span className="text-sm font-medium text-gray-900">{order.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customer:</span>
                    <span className="text-sm font-medium text-gray-900">{order.customer}</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <span className="text-sm font-medium text-gray-900">{order.quantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sizes:</span>
                    <span className="text-sm font-medium text-gray-900">{order.sizes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Unit Price:</span>
                    <span className="text-sm font-medium text-gray-900">${order.unitPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Value:</span>
                    <span className="text-sm font-medium text-gray-900">${order.totalValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Ex-Factory Date</div>
                      <div className="text-sm font-medium text-gray-900">{new Date(order.exFactoryDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Created Date</div>
                      <div className="text-sm font-medium text-gray-900">{new Date(order.createdDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Last Updated</div>
                      <div className="text-sm font-medium text-gray-900">{new Date(order.lastUpdated).toLocaleDateString()}</div>
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
                      <span className="text-sm font-medium text-gray-900">Main Status</span>
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
                      <div className={`p-1 rounded-full ${bulkApprovalConfig.iconColor.replace('text-', 'bg-').replace('-600', '-100')}`}>
                        <BulkApprovalIcon className={`h-4 w-4 ${bulkApprovalConfig.iconColor}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Bulk Approval</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${bulkApprovalConfig.color}`}>
                      {order.bulkApprovalStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk & Priority */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk & Priority</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <PriorityIcon className={`h-4 w-4 ${priorityConfig.iconColor}`} />
                      <span className="text-sm font-medium text-gray-900">Priority</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityConfig.color}`}>
                      {order.priority}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RiskIcon className={`h-4 w-4 ${riskLevelConfig.iconColor}`} />
                      <span className="text-sm font-medium text-gray-900">Risk Level</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${riskLevelConfig.color}`}>
                      {order.riskLevel}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Quality Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${order.qualityScore >= 90 ? 'bg-green-500' : order.qualityScore >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${order.qualityScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{order.qualityScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Production Progress</span>
                    <span className="font-medium text-gray-900">{order.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${order.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Supplier & Destination */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier & Destination</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Supplier</div>
                      <div className="text-sm font-medium text-gray-900">{order.supplier}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Destination</div>
                      <div className="text-sm font-medium text-gray-900">{order.destination}</div>
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

export default ProductDetailsModal; 