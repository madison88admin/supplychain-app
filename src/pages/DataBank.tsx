import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Package, FileText, Clipboard, Layers, Truck, Upload, Download, Trash2, Database, Loader2, Eye, Filter, RefreshCw, X } from 'lucide-react';
import * as XLSX from 'xlsx';

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
  
  // File upload states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAction = (action: string, label: string) => {
    if (action === 'Import') {
      setSelectedSection(label);
      setShowUploadModal(true);
      setUploadStatus('');
    } else {
      alert(`${action} for ${label} coming soon!`);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Check file size (25MB limit for better reliability)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      setUploadStatus(`❌ File too large. Maximum size is 25MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    setIsUploading(true);
    setUploadStatus('Processing file...');

    try {
      const data = await readExcelFile(file);
      
      if (data.length === 0) {
        throw new Error('No data found in file');
      }

      // Map section to corresponding table name
      const tableMapping: { [key: string]: string } = {
        'Purchase Order': 'PurchaseOrder',
        'Purchase Order Lines': 'PurchaseOrderLines',
        'Product Manager': 'Products',
        'Techpacks': 'ProductBillOfMaterials',
        'Sample Requests': 'ProductOptions',
        'Material Manager': 'Materials',
        'Supplier Loading': 'MaterialSuppliers'
      };

      const tableName = tableMapping[selectedSection];
      if (!tableName) {
        throw new Error('No table mapping found for this section');
      }

      setUploadStatus(`Uploading ${data.length} records...`);

      // Upload data in chunks if it's large
      const chunkSize = 100; // Upload 100 records at a time
      const chunks = [];
      
      for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
      }

      let uploadedCount = 0;
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        setUploadStatus(`Uploading chunk ${i + 1}/${chunks.length} (${uploadedCount + chunk.length}/${data.length} records)...`);

        try {
          const response = await fetch(`http://localhost:3001/api/upload-data`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tableName: tableName,
              data: chunk,
              isChunk: i > 0, // Skip table creation for subsequent chunks
              chunkIndex: i
            })
          });

          if (response.ok) {
            const result = await response.json();
            uploadedCount += chunk.length;
          } else {
            const errorText = await response.text();
            console.error(`Chunk ${i + 1} failed:`, errorText);
            throw new Error(`Failed to upload chunk ${i + 1}: ${errorText.substring(0, 200)}...`);
          }
        } catch (error) {
          console.error(`Error uploading chunk ${i + 1}:`, error);
          throw new Error(`Failed to upload chunk ${i + 1}: ${error instanceof Error ? error.message : 'Network error'}`);
        }
      }

      setUploadStatus(`✅ Successfully uploaded ${uploadedCount} records to ${tableName}`);
      // Refresh available tables and data
      fetchAvailableTables();
      if (selectedTable === tableName) {
        fetchTableData(tableName);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus(`❌ Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedSection('');
    setUploadStatus('');
    setIsUploading(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
                    <thead className="bg-gray-50 sticky top-0 z-40">
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

      {/* File Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Data to {selectedSection}</h3>
              <button
                onClick={closeUploadModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Upload an Excel (.xlsx) or CSV file to populate the {selectedSection} table.
                The file should have headers that match the table columns.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FileText className="h-6 w-6 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{selectedFile.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
                    </div>
                    <button
                      onClick={handleUploadClick}
                      disabled={isUploading}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        isUploading 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isUploading ? 'Uploading...' : 'Change File'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className={`flex flex-col items-center mx-auto ${
                      isUploading 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    ) : (
                      <Upload className="h-8 w-8 mb-2" />
                    )}
                    <span className="text-sm font-medium">
                      {isUploading ? 'Uploading...' : 'Click to select file'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Supports .xlsx, .xls, .csv (Max 25MB)
                    </span>
                  </button>
                )}
              </div>
            </div>

            {uploadStatus && (
              <div className={`p-3 rounded-md text-sm ${
                uploadStatus.includes('✅') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : uploadStatus.includes('❌')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {uploadStatus}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              {selectedFile && !isUploading && !uploadStatus.includes('✅') && (
                <button
                  onClick={() => handleFileUpload({ target: { files: [selectedFile] } } as any)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Upload Data
                </button>
              )}
              <button
                onClick={closeUploadModal}
                disabled={isUploading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataBank; 