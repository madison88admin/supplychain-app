import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useUser } from '../../contexts/UserContext';

interface AddTechpackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStyleNumber?: string;
  initialCustomer?: string;
}

const AddTechpackModal: React.FC<AddTechpackModalProps> = ({ isOpen, onClose, initialStyleNumber, initialCustomer }) => {
  const { addTechpack } = useData();
  const { user } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    styleNumber: initialStyleNumber || '',
    version: '1.0',
    status: 'Draft' as const,
    category: '',
    dueDate: '',
    customer: initialCustomer || '',
    completionRate: 0,
    comments: 0,
    attachments: 0,
    priority: 'Medium' as const
  });

  React.useEffect(() => {
    setFormData(f => ({
      ...f,
      styleNumber: initialStyleNumber || '',
      customer: initialCustomer || ''
    }));
  }, [initialStyleNumber, initialCustomer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTechpack({
      ...formData,
      createdBy: user?.name || 'Unknown User'
    });
    
    onClose();
    setFormData({
      name: '',
      styleNumber: '',
      version: '1.0',
      status: 'Draft',
      category: '',
      dueDate: '',
      customer: '',
      completionRate: 0,
      comments: 0,
      attachments: 0,
      priority: 'Medium'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Techpack</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Techpack Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Summer Dress Collection TP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style Number *
              </label>
              <input
                type="text"
                name="styleNumber"
                value={formData.styleNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., SC001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Version
              </label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer *
              </label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., H&M"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="Dresses">Dresses</option>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Jackets">Jackets</option>
                <option value="Shorts">Shorts</option>
                <option value="Coats">Coats</option>
                <option value="Pants">Pants</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Revision Required">Revision Required</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Completion Rate (%)
              </label>
              <input
                type="number"
                name="completionRate"
                value={formData.completionRate}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
              <span>Add Techpack</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTechpackModal;