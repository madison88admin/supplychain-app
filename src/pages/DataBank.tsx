import React from 'react';
import { ShoppingCart, Package, FileText, Clipboard, Layers, Truck, Upload, Download, Trash2 } from 'lucide-react';

const sections = [
  { label: 'Purchase Order', key: 'purchase-order', icon: ShoppingCart },
  { label: 'Purchase Order Lines', key: 'purchase-orders', icon: ShoppingCart },
  { label: 'Product Manager', key: 'product-manager', icon: Package },
  { label: 'Techpacks', key: 'techpacks', icon: FileText },
  { label: 'Sample Requests', key: 'sample-requests', icon: Clipboard },
  { label: 'Material Manager', key: 'material-manager', icon: Layers },
  { label: 'Supplier Loading', key: 'supplier-loading', icon: Truck },
];

const DataBank: React.FC = () => {
  const handleAction = (action: string, label: string) => {
    alert(`${action} for ${label} coming soon!`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Bank</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sections.map(({ label, key, icon: Icon }) => (
          <div
            key={key}
            className="relative flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 group min-h-[180px]"
          >
            <Icon className="h-10 w-10 mb-3 text-blue-600" />
            <span className="text-base font-semibold text-gray-900 mb-2 text-center">{label}</span>
            {/* Action buttons, shown on hover */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl">
              <div className="flex gap-3">
                <button
                  className="flex flex-col items-center px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100 focus:outline-none transition-colors"
                  title="Import"
                  onClick={() => handleAction('Import', label)}
                >
                  <Upload className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Import</span>
                </button>
                <button
                  className="flex flex-col items-center px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg shadow-sm hover:bg-green-100 focus:outline-none transition-colors"
                  title="Export"
                  onClick={() => handleAction('Export', label)}
                >
                  <Download className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Export</span>
                </button>
                <button
                  className="flex flex-col items-center px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm hover:bg-red-100 focus:outline-none transition-colors"
                  title="Delete"
                  onClick={() => handleAction('Delete', label)}
                >
                  <Trash2 className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataBank; 