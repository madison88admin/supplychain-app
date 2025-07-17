import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface AddFibreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (fibreData: { fibreName: string; percentage: string; notes: string }) => void;
}

const AddFibreModal: React.FC<AddFibreModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    fibreName: '',  percentage: '', notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.fibreName.trim()) {
      onAdd(formData);
      onClose();
      setFormData({ fibreName: '', percentage: '', notes: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Fibre Composition</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fibre Name *
            </label>
            <input
              type="text"
              name="fibreName"
              value={formData.fibreName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Cotton, Polyester, Wool"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Percentage
            </label>
            <input
              type="text"
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 80%, 20%"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes about the fibre..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Add Fibre</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFibreModal; 