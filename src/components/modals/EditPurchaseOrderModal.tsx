import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export type PurchaseOrder = {
  id: number;
  poNumber: string;
  customer: string;
  styleNumber: string;
  styleName: string;
  colorway: string;
  quantity: number;
  sizes: string;
  unitPrice: number;
  totalValue: number;
  status: string;
  exFactoryDate: string;
  destination: string;
  version: string;
  supplier: string;
  createdDate?: string;
  lastUpdated?: string;
  bulkApprovalStatus: string;
  progress: number;
};

interface EditPurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PurchaseOrder | null;
  onSave: (order: PurchaseOrder) => void;
}

const EditPurchaseOrderModal: React.FC<EditPurchaseOrderModalProps> = ({ isOpen, onClose, order, onSave }) => {
  const [formData, setFormData] = useState<Record<string, any> | null>(order);

  useEffect(() => {
    setFormData(order as Record<string, any>);
  }, [order]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => prev ? {
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) onSave(formData as PurchaseOrder);
  };

  const MAIN_FIELDS: { key: string; label: string; type?: string; required?: boolean }[] = [
    { key: 'poNumber', label: 'Order Reference', required: true },
    { key: 'status', label: 'Status' },
    { key: 'quantity', label: 'Total Qty', type: 'number' },
    { key: 'totalValue', label: 'Total Value', type: 'number' },
    { key: 'customer', label: 'Customer', required: true },
    { key: 'supplier', label: 'Supplier' },
    { key: 'Delivery Date', label: 'Delivery Date' },
    { key: 'PO Issue Date', label: 'PO Issue Date' },
    { key: 'Purchase Currency', label: 'Purchase Currency' },
    { key: 'Comments', label: 'Comments' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Purchase Order</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Render main fields first */}
            {MAIN_FIELDS.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}{field.required ? ' *' : ''}</label>
                <input
                  type={field.type || 'text'}
                  name={field.key}
                  value={formData[field.key] ?? ''}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
            {/* Render extra fields dynamically */}
            {Object.entries(formData).map(([key, value]) => {
              if (MAIN_FIELDS.some(f => f.key === key)) return null;
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                  <input
                    type={typeof value === 'number' ? 'number' : 'text'}
                    name={key}
                    value={value ?? ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPurchaseOrderModal; 