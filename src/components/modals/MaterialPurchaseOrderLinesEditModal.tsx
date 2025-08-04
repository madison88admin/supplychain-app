import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, AlertTriangle, Package, FileText, Users, Settings } from 'lucide-react';

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f7fafc;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }
`;

interface MaterialPurchaseOrderLinesEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (data: any) => void;
  data: any;
  isNew?: boolean;
}

const MaterialPurchaseOrderLinesEditModal: React.FC<MaterialPurchaseOrderLinesEditModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  data, 
  isNew = false 
}) => {
  const [formData, setFormData] = useState<any>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('main');

  useEffect(() => {
    if (isOpen) {
      setFormData(data || {});
      setErrors({});
      setShowDeleteConfirm(false);
      setActiveTab('main');
    }
  }, [isOpen, data]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic validation
    if (!formData['Material Purchase Order']) {
      newErrors['Material Purchase Order'] = 'Material Purchase Order is required';
    }
    if (!formData['Material']) {
      newErrors['Material'] = 'Material is required';
    }
    if (!formData['Material Purchase Order Line']) {
      newErrors['Material Purchase Order Line'] = 'Material Purchase Order Line is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(formData);
    }
  };

  const tabs = [
    { id: 'main', label: 'Main', icon: FileText },
    { id: 'mpo-details', label: 'Material Purchase Order Details', icon: Package },
    { id: 'material-details', label: 'Material Details', icon: Settings },
    { id: 'pol-details', label: 'Purchase Order Line Details', icon: Users }
  ];

  const renderField = (field: string, label: string, type: string = 'text', required: boolean = false) => (
    <div key={field} className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={formData[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  const renderTextArea = (field: string, label: string, required: boolean = false) => (
    <div key={field} className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={formData[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        rows={3}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      <style>{scrollbarStyles}</style>
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 99999999 }}>
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isNew ? 'Add New Material Purchase Order Line' : 'Edit Material Purchase Order Line'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div 
          className="flex-1 overflow-y-auto p-6 custom-scrollbar" 
          style={{ 
            maxHeight: 'calc(90vh - 200px)', 
            overflowY: 'auto'
          }}
        >
          {activeTab === 'main' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                {renderField('Material Purchase Order', 'Material Purchase Order', 'text', true)}
                {renderField('Material', 'Material', 'text', true)}
                {renderField('Material Purchase Order Line', 'Material Purchase Order Line', 'text', true)}
                {renderField('Customer', 'Customer')}
                {renderField('Status', 'Status')}
                {renderField('Delivery Date', 'Delivery Date', 'date')}
                {renderField('Comments', 'Comments')}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
                {renderField('Quantity', 'Quantity', 'number')}
                {renderField('Selling Quantity', 'Selling Quantity', 'number')}
                {renderField('Order Quantity Increment', 'Order Quantity Increment', 'number')}
                {renderField('Order Lead Time', 'Order Lead Time', 'number')}
                {renderField('Supplier Ref.', 'Supplier Reference')}
                {renderField('Template', 'Template')}
                {renderField('MPO Line Key Date', 'MPO Line Key Date', 'date')}
              </div>
            </div>
          )}

          {activeTab === 'mpo-details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase Order Information</h3>
                {renderField('Line Purchase Price', 'Line Purchase Price', 'number')}
                {renderField('Line Selling Price', 'Line Selling Price', 'number')}
                {renderField('Purchase Price', 'Purchase Price', 'number')}
                {renderField('Selling Price', 'Selling Price', 'number')}
                {renderField('Purchase Currency', 'Purchase Currency')}
                {renderField('Selling Currency', 'Selling Currency')}
                {renderField('Purchasing', 'Purchasing')}
                {renderField('Material Purchase Order Status', 'Material Purchase Order Status')}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Terms</h3>
                {renderField('Supplier Payment Term', 'Supplier Payment Term')}
                {renderField('Supplier Payment Term Description', 'Supplier Payment Term Description')}
                {renderField('Material Purchase Order Purchase Payment Term', 'MPO Purchase Payment Term')}
                {renderField('Material Purchase Order Selling Payment Term', 'MPO Selling Payment Term')}
                {renderField('Product Supplier Purchase Payment Term', 'Product Supplier Purchase Payment Term')}
                {renderField('Product Supplier Selling Payment Term', 'Product Supplier Selling Payment Term')}
                {renderTextArea('Material Purchase Order Purchase Payment Term Description', 'MPO Purchase Payment Term Description')}
                {renderTextArea('Material Purchase Order Selling Payment Term Description', 'MPO Selling Payment Term Description')}
              </div>
            </div>
          )}

          {activeTab === 'material-details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Material Information</h3>
                {renderField('Material Type', 'Material Type')}
                {renderField('Material Sub Type', 'Material Sub Type')}
                {renderField('Material Status', 'Material Status')}
                {renderField('Material Description', 'Material Description')}
                {renderField('Material Buyer Style Name', 'Material Buyer Style Name')}
                {renderField('Material Buyer Style Number', 'Material Buyer Style Number')}
                {renderField('Material Department', 'Material Department')}
                {renderField('Season', 'Season')}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Material Specifications</h3>
                {renderField('Size', 'Size')}
                {renderField('Color', 'Color')}
                {renderField('Composition', 'Composition')}
                {renderField('Minimum Order Quantity', 'Minimum Order Quantity', 'number')}
                {renderField('Minimum Colour Quantity', 'Minimum Colour Quantity', 'number')}
                {renderField('Costing Status', 'Costing Status')}
                {renderTextArea('Material Sample Log Comment', 'Material Sample Log Comment')}
                {renderField('Material Sample Log Status', 'Material Sample Log Status')}
                {renderField('Material Sample Log Type', 'Material Sample Log Type')}
                {renderField('Material Sample Log Name', 'Material Sample Log Name')}
              </div>
            </div>
          )}

          {activeTab === 'pol-details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Supplier Information</h3>
                {renderField('Supplier', 'Supplier')}
                {renderField('Material Supplier Profile', 'Material Supplier Profile')}
                {renderField('Material Supplier Profile Purchase Currency', 'Supplier Profile Purchase Currency')}
                {renderField('Material Supplier Profile Selling Currency', 'Supplier Profile Selling Currency')}
                {renderField('Recipient Product Supplier', 'Recipient Product Supplier')}
                {renderField('RECIPIENT PRODUCT SUPPLIER-FACTORY', 'Recipient Product Supplier Factory')}
                {renderField('Supplier Purchase Currency', 'Supplier Purchase Currency')}
                {renderField('Customer Selling Currency', 'Customer Selling Currency')}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping & Tracking</h3>
                {renderField('Transport Method', 'Transport Method')}
                {renderField('Deliver To', 'Deliver To')}
                {renderField('Collection', 'Collection')}
                {renderField('Division', 'Division')}
                {renderField('Group', 'Group')}
                {renderField('FG Ex-Factory', 'FG Ex-Factory', 'date')}
                {renderField('Trim Receipt Date', 'Trim Receipt Date', 'date')}
                {renderField('Delivery Contact', 'Delivery Contact')}
                {renderField('FG PO Number', 'FG PO Number')}
                {renderField('AWB', 'AWB')}
                {renderField('Invoice Number', 'Invoice Number')}
                {renderField('Invoice Status', 'Invoice Status')}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            {!isNew && onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              {isNew ? 'Create' : 'Save Changes'}
            </button>
          </div>
        </div>

                 {/* Delete Confirmation Modal */}
         {showDeleteConfirm && (
                       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 100000000 }}>
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this Material Purchase Order Line? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default MaterialPurchaseOrderLinesEditModal; 