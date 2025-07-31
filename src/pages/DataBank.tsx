import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, FileText, Clipboard, Layers, Truck, Upload, Download, Trash2, Database, Loader2, Eye, Filter, RefreshCw } from 'lucide-react';

// Database tables that will be created by test10.py
const databaseTables = [
  { label: 'BillOfMaterialItemCategories', key: 'BillOfMaterialItemCategories', icon: Layers },
  { label: 'BillOfMaterialItemCategoryMaterialTypes', key: 'BillOfMaterialItemCategoryMaterialTypes', icon: Layers },
  { label: 'BillOfMaterialItems', key: 'BillOfMaterialItems', icon: Layers },
  { label: 'Customers', key: 'Customers', icon: ShoppingCart },
  { label: 'MaterialOptions', key: 'MaterialOptions', icon: Package },
  { label: 'Materials', key: 'Materials', icon: Package },
  { label: 'MaterialSupplierProfiles', key: 'MaterialSupplierProfiles', icon: Truck },
  { label: 'MaterialSuppliers', key: 'MaterialSuppliers', icon: Truck },
  { label: 'MaterialTypes', key: 'MaterialTypes', icon: Package },
  { label: 'ProductBillOfMaterials', key: 'ProductBillOfMaterials', icon: FileText },
  { label: 'ProductOptions', key: 'ProductOptions', icon: Package },
  { label: 'Products', key: 'Products', icon: Package },
  { label: 'ProductStatuses', key: 'ProductStatuses', icon: FileText },
  { label: 'ProductSupplierProfiles', key: 'ProductSupplierProfiles', icon: Truck },
  { label: 'ProductSuppliers', key: 'ProductSuppliers', icon: Truck },
  { label: 'ProductTypes', key: 'ProductTypes', icon: Package },
  { label: 'PurchaseOrder', key: 'PurchaseOrder', icon: ShoppingCart },
  { label: 'PurchaseOrderLines', key: 'PurchaseOrderLines', icon: ShoppingCart },
];

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
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectionStatus, setCollectionStatus] = useState<string>('');
  const [showDataView, setShowDataView] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const handleAction = (action: string, label: string) => {
    alert(`${action} for ${label} coming soon!`);
  };

  const handleCollectData = async () => {
    setIsCollecting(true);
    setCollectionStatus('Starting data collection...');
    
    try {
      // Call the Python script to collect data
      const response = await fetch('http://localhost:3001/api/collect-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'collect_data'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setCollectionStatus(`✅ Data collection completed! Database created: ${result.database_file}`);
        // Refresh available tables after collection
        fetchAvailableTables();
      } else {
        throw new Error('Failed to collect data');
      }
    } catch (error) {
      console.error('Error collecting data:', error);
      setCollectionStatus('❌ Error collecting data. Please try again.');
    } finally {
      setIsCollecting(false);
    }
  };

  const fetchAvailableTables = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/tables');
      if (response.ok) {
        const tables = await response.json();
        setAvailableTables(tables);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchTableData = async (tableName: string) => {
    setIsLoadingData(true);
    try {
      const response = await fetch(`http://localhost:3001/api/data/${tableName}?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setTableData(data.records || []);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      setTableData([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    setCurrentPage(1);
    fetchTableData(tableName);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  };

  const handleRefresh = () => {
    fetchAvailableTables();
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  };

  // Load available tables on component mount
  useEffect(() => {
    fetchAvailableTables();
  }, []);

  // Fetch data when page changes
  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [currentPage, selectedTable]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Bank</h1>
        
        {/* Collect Data Button */}
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleCollectData}
            disabled={isCollecting}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              isCollecting
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isCollecting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Collecting Data...
              </>
            ) : (
              <>
                <Database className="h-5 w-5" />
                Collect Data
              </>
            )}
          </button>
          
          {collectionStatus && (
            <div className={`text-sm px-3 py-2 rounded-md ${
              collectionStatus.includes('✅') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : collectionStatus.includes('❌')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {collectionStatus}
            </div>
          )}
        </div>
      </div>
      
      {/* Data View Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowDataView(!showDataView)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Eye className="h-4 w-4" />
          {showDataView ? 'Hide Data View' : 'Show Collected Data'}
        </button>
      </div>

      {showDataView && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Collected Data</h2>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {/* Table Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Table to View:
            </label>
            <select
              value={selectedTable}
              onChange={(e) => handleTableSelect(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a table...</option>
              {availableTables.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>

          {/* Search and Filters */}
          {selectedTable && (
            <div className="mb-4 flex gap-4 items-end">
              <div className="flex-1 max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Records:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search in all fields..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          {selectedTable && (
            <div className="overflow-x-auto">
              {isLoadingData ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading data...</span>
                </div>
              ) : tableData.length > 0 ? (
                <div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(tableData[0]).map((column) => (
                          <th
                            key={column}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tableData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value: any, colIndex) => (
                            <td
                              key={colIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                              {typeof value === 'object' ? JSON.stringify(value) : String(value || '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, tableData.length)} of {tableData.length} results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
                        Page {currentPage}
                      </span>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={tableData.length < itemsPerPage}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No data available for the selected table.
                </div>
              )}
            </div>
          )}
        </div>
      )}

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