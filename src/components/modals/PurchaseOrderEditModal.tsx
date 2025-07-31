import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, AlertTriangle } from 'lucide-react';

interface PurchaseOrderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (data: any) => void;
  data: any;
  isNew?: boolean;
}

const PurchaseOrderEditModal: React.FC<PurchaseOrderEditModalProps> = ({ 
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

  useEffect(() => {
    if (isOpen) {
      setFormData(data || {});
      setErrors({});
      setShowDeleteConfirm(false);
    }
  }, [isOpen, data]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData['Order']?.trim()) {
      newErrors['Order'] = 'Order reference is required';
    }
    if (!formData['Customer']?.trim()) {
      newErrors['Customer'] = 'Customer is required';
    }
    if (!formData['Supplier']?.trim()) {
      newErrors['Supplier'] = 'Supplier is required';
    }
    if (!formData['Quantity'] || formData['Quantity'] <= 0) {
      newErrors['Quantity'] = 'Quantity must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(formData);
      onClose();
    }
  };

  const formFields = [
    { key: 'Order', label: 'Order Reference', type: 'text', required: true },
    { key: 'Product', label: 'Product', type: 'text', required: false },
    { key: 'Customer', label: 'Customer', type: 'text', required: true },
    { key: 'Supplier', label: 'Supplier', type: 'text', required: true },
    { key: 'Quantity', label: 'Quantity', type: 'number', required: true },
    { key: 'Purchase Price', label: 'Purchase Price', type: 'number', required: false },
    { key: 'Selling Price', label: 'Selling Price', type: 'number', required: false },
    { key: 'Purchase Currency', label: 'Purchase Currency', type: 'text', required: false },
    { key: 'Selling Currency', label: 'Selling Currency', type: 'text', required: false },
    { key: 'Status', label: 'Status', type: 'select', required: false, options: ['Open', 'Confirmed', 'In Production', 'Shipped', 'Delivered'] },
    { key: 'Delivery Date', label: 'Delivery Date', type: 'date', required: false },
    { key: 'Transport Method', label: 'Transport Method', type: 'select', required: false, options: ['Air', 'Sea', 'Land'] },
    { key: 'Deliver To', label: 'Deliver To', type: 'text', required: false },
    { key: 'Comments', label: 'Comments', type: 'textarea', required: false },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999999] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Save className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isNew ? 'Add New Purchase Order' : 'Edit Purchase Order'}
              </h2>
              <p className="text-sm text-gray-600">
                {isNew ? 'Create a new purchase order entry' : `Editing: ${data?.Order || 'Purchase Order'}`}
              </p>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              {formFields.slice(0, 7).map(field => (
                <div key={field.key} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[field.key] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((option: string) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[field.key] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[field.key] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                  {errors[field.key] && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{errors[field.key]}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
              
              {formFields.slice(7).map(field => (
                <div key={field.key} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[field.key] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((option: string) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[field.key] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[field.key] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                  {errors[field.key] && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{errors[field.key]}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            {!isNew && onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isNew ? 'Create' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

              {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999999] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the purchase order "{formData['Order']}"? 
                This will permanently remove all associated data.
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderEditModal; 