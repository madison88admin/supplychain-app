import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

import { ChevronDown, ChevronRight, Upload, Edit as EditIcon, Save as SaveIcon, Copy as CopyIcon, Plus, Filter as FilterIcon, Download, X, Search } from 'lucide-react';


// Grouped columns with subfields
const groupedColumns = [
  { label: 'Trim Order', key: 'Trim Order', children: ['Target Date', 'Completed Date'] },
  { label: 'Ex-factory', key: 'Ex-factory', children: ['Target Date', 'Completed Date'] },
  { label: 'Trims Received', key: 'Trims Received', children: ['Target Date', 'Completed Date'] },
  { label: 'MPO Issue Date', key: 'MPO Issue Date', children: ['Target Date', 'Completed Date'] },
  { label: 'Main Material Order', key: 'Main Material Order', children: ['Target Date', 'Completed Date'] },
  { label: 'Main Material Received', key: 'Main Material Received', children: ['Target Date', 'Completed Date'] },
];

// All other columns
const baseColumns = [
  'Order References', 'Template', 'Transport Method', 'Deliver to', 'Status', 'Total Qty', 'Total Cost', 'Total Value', 'Customer',
  'Supplier', 'Purchase Currency', 'Selling Currency', 'Purchase Payment Term', 'Selling Payment Term', 'Supplier Parent',
  'Delivery Contact', 'Division', 'Group', 'Supplier Location', 'Closed Date', 'MPO Key Date', 'Supplier Currency',
  'Supplier Description', 'Delivery Date', 'Recipient Product Supplier', 'Comments', 'Purchasing', 'MPO Key Use 2',
  'MPO Key Use 3', 'MPO Key Use 4', 'MPO Key Use 5', 'MPO Key Use 6', 'MPO Key Use 7', 'MPO Key Use 8', 'Note Count',
  'Latest Note', 'Purchase Payment Term Description', 'Selling Payment Term Description',
  'Default Material Purchase ORder Line Template', 'Default MPO Line Key Date', 'MPO Key Working Group 1',
  'MPO Key Working Group 2', 'MPO Key Working Group 3', 'MPO Key Working Group 4', 'Created By', 'Created', 'Last Edited',
];

const allColumns = [
  ...baseColumns,
  ...groupedColumns.map(g => g.key),
];

const initialRow: Record<string, any> = Object.fromEntries([
  ...baseColumns.map(col => [col, '']),
  ...groupedColumns.map(g => [g.key, { 'Target Date': '', 'Completed Date': '' }]),
]);

const MaterialPurchaseOrder: React.FC = () => {
  const [rows, setRows] = useState([initialRow]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<Record<string, any> | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [filteredRows, setFilteredRows] = useState<typeof rows | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [activeSubTab, setActiveSubTab] = useState('MPO Details');

  const [columnSearch, setColumnSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-row selection states
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubTableEditModal, setShowSubTableEditModal] = useState(false);
  const [editingRow, setEditingRow] = useState<Record<string, any> | null>(null);
  const [editingSubTableData, setEditingSubTableData] = useState<Record<string, any> | null>(null);

  // Filtered columns for selector
  const filteredColumnList = allColumns.filter(col =>
    col.toLowerCase().includes(columnSearch.toLowerCase())
  );


  // Sample order reference data for demonstration
  const getOrderReferencesData = (orderRef: string) => {
    if (!orderRef) return [];
    
    // Special case for MPO-012345
    if (orderRef === 'MPO-012345') {
      return [
        {
          id: 1,
          reference: 'MPO-012345',
          orderType: 'Material Purchase Order',
          status: 'Active',
          supplier: 'Premium Textiles Co.',
          orderDate: '2024-01-10',
          deliveryDate: '2024-02-10',
          totalValue: '$25,750',
          currency: 'USD',
          items: [
            { material: 'Premium Cotton Fabric', quantity: '2000m', unitPrice: '$8.50', total: '$17,000' },
            { material: 'Elastic Band', quantity: '1000m', unitPrice: '$2.25', total: '$2,250' },
            { material: 'Metal Buttons', quantity: '500pcs', unitPrice: '$0.75', total: '$375' },
            { material: 'Polyester Thread', quantity: '800m', unitPrice: '$1.80', total: '$1,440' },
            { material: 'Care Labels', quantity: '1000pcs', unitPrice: '$0.35', total: '$350' },
            { material: 'Size Labels', quantity: '1000pcs', unitPrice: '$0.40', total: '$400' }
          ]
        },
        {
          id: 2,
          reference: 'MPO-012345-SUB',
          orderType: 'Sub Contract',
          status: 'In Progress',
          supplier: 'Quality Dyeing Services',
          orderDate: '2024-01-12',
          deliveryDate: '2024-02-08',
          totalValue: '$12,300',
          currency: 'USD',
          items: [
            { material: 'Fabric Dyeing Service', quantity: '2000m', unitPrice: '$4.50', total: '$9,000' },
            { material: 'Color Matching Service', quantity: '1 lot', unitPrice: '$500', total: '$500' },
            { material: 'Quality Testing', quantity: '1 lot', unitPrice: '$800', total: '$800' },
            { material: 'Packaging Service', quantity: '2000m', unitPrice: '$1.00', total: '$2,000' }
          ]
        },
        {
          id: 3,
          reference: 'MPO-012345-TRIM',
          orderType: 'Trim Order',
          status: 'Completed',
          supplier: 'Accessories Plus Ltd',
          orderDate: '2024-01-08',
          deliveryDate: '2024-01-25',
          totalValue: '$8,900',
          currency: 'USD',
          items: [
            { material: 'Zipper Pulls', quantity: '300pcs', unitPrice: '$1.20', total: '$360' },
            { material: 'Drawstring Cord', quantity: '600m', unitPrice: '$0.85', total: '$510' },
            { material: 'Hook & Loop Tape', quantity: '400m', unitPrice: '$2.10', total: '$840' },
            { material: 'Ribbon Trim', quantity: '500m', unitPrice: '$1.45', total: '$725' },
            { material: 'Decorative Patches', quantity: '200pcs', unitPrice: '$2.50', total: '$500' }
          ]
        }
      ];
    }
    
    // Default data for other order references
    return [
      {
        id: 1,
        reference: orderRef,
        orderType: 'Purchase Order',
        status: 'Active',
        supplier: 'Textile Solutions Ltd',
        orderDate: '2024-01-15',
        deliveryDate: '2024-02-15',
        totalValue: '$15,000',
        currency: 'USD',
        items: [
          { material: 'Cotton Fabric', quantity: '1000m', unitPrice: '$5.50', total: '$5,500' },
          { material: 'Polyester Thread', quantity: '500m', unitPrice: '$2.00', total: '$1,000' },
          { material: 'Zippers', quantity: '200pcs', unitPrice: '$1.25', total: '$250' }
        ]
      },
      {
        id: 2,
        reference: `${orderRef}-SUB`,
        orderType: 'Sub Contract',
        status: 'Pending',
        supplier: 'Fashion Factory Inc',
        orderDate: '2024-01-20',
        deliveryDate: '2024-02-20',
        totalValue: '$8,500',
        currency: 'USD',
        items: [
          { material: 'Dyeing Service', quantity: '500m', unitPrice: '$3.00', total: '$1,500' },
          { material: 'Printing Service', quantity: '300m', unitPrice: '$2.50', total: '$750' }
        ]
      }
    ];
  };

  const toggleRowExpansion = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const isRowExpanded = (index: number) => expandedRows.has(index);


  // Multi-row selection handlers
  const handleRowSelect = (rowIndex: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
    } else {
      newSelectedRows.add(rowIndex);
    }
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.size === displayRows.length);
    
    // Also update selectedIndex to show blue highlighting for the clicked row
    setSelectedIndex(rowIndex);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      const allIndices = new Set(displayRows.map((_, index) => index));
      setSelectedRows(allIndices);
      setSelectAll(true);
    }
  };

  const handleExportSelected = () => {
    const rowsToExport = selectedRows.size > 0 
      ? displayRows.filter((_, index) => selectedRows.has(index))
      : displayRows;
    
    const ws = XLSX.utils.json_to_sheet(rowsToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MaterialPurchaseOrders');
    XLSX.writeFile(wb, `material_purchase_orders_${selectedRows.size > 0 ? 'selected' : 'all'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };


  const handleEdit = () => {
    if (selectedIndex >= 0 && selectedIndex < displayRows.length) {
      setEditingRow({ ...JSON.parse(JSON.stringify(displayRows[selectedIndex])) });
      setShowEditModal(true);
    }
  };

  const handleChange = (col: string, value: string, subCol?: string) => {
    if (!editRow) return;
    if (subCol) {
      setEditRow({ ...editRow, [col]: { ...editRow[col], [subCol]: value } });
    } else {
      setEditRow({ ...editRow, [col]: value });
    }
  };

  const handleSave = () => {
    if (editingRow !== null && selectedIndex >= 0 && selectedIndex < displayRows.length) {
      const newRows = [...(filteredRows ?? rows)];
      newRows[selectedIndex] = { ...editingRow };
      if (filteredRows) {
        const mainRows = [...rows];
        const idxInMain = rows.indexOf(filteredRows[selectedIndex]);
        if (idxInMain !== -1) mainRows[idxInMain] = { ...editingRow };
        setRows(mainRows);
        setFilteredRows(newRows);
      } else {
        setRows(newRows);
      }
      setShowEditModal(false);
      setEditingRow(null);
    }
  };

  const handleSubTableEdit = () => {
    setEditingSubTableData({
      orderReference: 'MPO-012345',
      template: 'Standard MPO',
      transportMethod: 'Sea Freight',
      deliverTo: 'Main Warehouse',
      status: 'Open',
      totalQty: '10,000 pcs',
      totalCost: '$45,750',
      totalValue: '$52,500',
      customer: 'Fashion Brand Inc',
      supplier: 'Premium Textiles Co.',
      purchaseCurrency: 'USD',
      sellingCurrency: 'EUR',
      purchasePaymentTerm: 'Net 30',
      sellingPaymentTerm: 'Net 60',
      mpoKeyDate: '2024-01-10',
      deliveryDate: '2024-02-10',
      closedDate: '2024-07-15',
      comments: 'Priority order for Spring collection. All materials have been confirmed and suppliers are ready for production.'
    });
    setShowSubTableEditModal(true);
  };

  const handleSubTableSave = () => {
    if (editingSubTableData) {
      // Here you would typically save the subtable data to your backend
      console.log('Saving subtable data:', editingSubTableData);
      setShowSubTableEditModal(false);
      setEditingSubTableData(null);
    }
  };

  const handleCopy = () => {
    const baseRows = filteredRows ?? rows;
    const newRows = [...baseRows];
    newRows.splice(selectedIndex + 1, 0, JSON.parse(JSON.stringify(baseRows[selectedIndex])));
    if (filteredRows) {
      const mainRows = [...rows];
      const idxInMain = rows.indexOf(baseRows[selectedIndex]);
      mainRows.splice(idxInMain + 1, 0, JSON.parse(JSON.stringify(baseRows[selectedIndex])));
      setRows(mainRows);
      setFilteredRows(newRows);
    } else {
      setRows(newRows);
    }
  };

  const handleAdd = () => {
    const newRows = [ { ...initialRow }, ...(filteredRows ?? rows) ];
    if (filteredRows) {
      const mainRows = [ { ...initialRow }, ...rows ];
      setRows(mainRows);
      setFilteredRows(newRows);
    } else {
      setRows(newRows);
    }
    setSelectedIndex(0);
    setEditIndex(0);
    setEditRow({ ...initialRow });
  };

  const handleFilter = () => {
    if (!search.trim()) {
      setFilteredRows(null);
      setSelectedIndex(0);
      return;
    }
    const lower = search.toLowerCase();
    const filtered = rows.filter(row =>
      allColumns.some(col => {
        const val = row[col];
        if (typeof val === 'object' && val !== null && 'Target Date' in val) {
          return (
            (val['Target Date'] ?? '').toLowerCase().includes(lower) ||
            (val['Completed Date'] ?? '').toLowerCase().includes(lower)
          );
        }
        return String(val ?? '').toLowerCase().includes(lower);
      })
    );
    setFilteredRows(filtered);
    setSelectedIndex(0);
  };

  const handleClear = () => {
    setSearch('');
    setFilteredRows(null);
    setSelectedIndex(0);
  };

  const handleColumnToggle = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const handleExport = () => {
    const data = displayRows.map(row => {
      const obj: Record<string, string> = {};
      visibleColumns.forEach(col => {
        const group = groupedColumns.find(g => g.key === col);
        if (group) {
          obj[`${col} - Target Date`] = row[col]?.['Target Date'] || '';
          obj[`${col} - Completed Date`] = row[col]?.['Completed Date'] || '';
        } else {
          let val = row[col];
          if (typeof val === 'object' && val !== null) {
            val = (val as any).props?.children?.toString() || '';
          }
          obj[col] = String(val ?? '');
        }
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MaterialPurchaseOrders');
    XLSX.writeFile(wb, 'material_purchase_orders.xlsx');
  };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      // Map uploaded data to table columns
      const mappedRows = json.map((row) => {
        const newRow: Record<string, any> = { ...initialRow };
        // Map base columns
        baseColumns.forEach((col) => {
          if (row[col] !== undefined) newRow[col] = row[col];
        });
        // Map grouped columns
        groupedColumns.forEach((group) => {
          newRow[group.key] = {
            'Target Date': row[`${group.label} - Target Date`] || '',
            'Completed Date': row[`${group.label} - Completed Date`] || '',
          };
        });
        return newRow;
      });
      setRows((prev) => [...prev, ...mappedRows]);
    };
    reader.readAsArrayBuffer(file);
  };

  const displayRows = filteredRows ?? rows;

  // For rendering, expand grouped columns into subcolumns
  const renderColumns = () => {
    const cols: { label: string; key: string; isGroup?: boolean; children?: string[] }[] = [];
    visibleColumns.forEach(col => {
      const group = groupedColumns.find(g => g.key === col);
      if (group) {
        cols.push({ label: group.label, key: group.key, isGroup: true, children: group.children });
      } else {
        cols.push({ label: col, key: col });
      }
    });
    return cols;
  };

  const renderHeaderRows = () => {
    const cols = renderColumns();
    // First row: group headers
    const firstRow = [
      // Add checkbox column header
      <th 
        key="checkbox-header" 
        rowSpan={2} 
        className="px-3 py-1 border-b text-center whitespace-nowrap"
      >
        <div className="flex items-center justify-center w-full">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
          />
        </div>
      </th>,
      ...cols.map((col, i) =>
        col.isGroup ? (
          <th key={col.key} colSpan={2} className={`px-2 py-1 border-b text-center whitespace-nowrap${i < cols.length - 1 ? ' border-r-2 border-gray-200' : ''}`}>{col.label}</th>
        ) : (
          <th key={col.key} rowSpan={2} className={`px-2 py-1 border-b text-left whitespace-nowrap align-middle${i < cols.length - 1 ? ' border-r-2 border-gray-200' : ''}`}>{col.label}</th>
        )
      )
    ];
    // Second row: subheaders
    const secondRow = cols.flatMap((col, idx) =>
      col.isGroup
        ? [
            <th key={col.key + '-target'} className={`px-2 py-1 border-b text-center whitespace-nowrap border-r-2 border-gray-200`}>Target Date</th>,
            <th key={col.key + '-completed'} className={`${idx < cols.length - 1 ? 'border-r-2 border-gray-200' : ''} px-2 py-1 border-b text-center whitespace-nowrap`}>Completed Date</th>,
          ]
        : []
    );
    return [firstRow, secondRow];
  };

  const renderOrderReferencesSubTable = (orderRef: string) => {
    return (

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-l-4 border-blue-500">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-gray-900">Material Purchase Order Details</h3>
              <span className="text-sm text-gray-500">• {orderRef || 'MPO-012345'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Open
              </span>
                             <button 
                 onClick={handleSubTableEdit}
                 className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
               >
                 <EditIcon className="w-3 h-3 mr-1" />
                 Edit
               </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Order Information Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <div className="w-1 h-4 bg-blue-500 rounded mr-2"></div>
                Order Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Template:</span>
                  <span className="font-medium">Standard MPO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transport Method:</span>
                  <span className="font-medium">Sea Freight</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deliver To:</span>
                  <span className="font-medium">Main Warehouse</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Quantity:</span>
                  <span className="font-medium">10,000 pcs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium text-red-600">$45,750</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-medium text-green-600">$52,500</span>
                </div>
              </div>
            </div>

            {/* Customer & Supplier Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <div className="w-1 h-4 bg-green-500 rounded mr-2"></div>
                Customer & Supplier
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer</div>
                  <div className="font-medium text-gray-900">Fashion Brand Inc</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Supplier</div>
                  <div className="font-medium text-gray-900">Premium Textiles Co.</div>
                  <div className="text-xs text-gray-600">Premium Textiles Co. Ltd</div>
                  <div className="text-xs text-gray-600">Textile Group International</div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">Shanghai, China</span>
                </div>
              </div>
            </div>

            {/* Financial Details Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <div className="w-1 h-4 bg-purple-500 rounded mr-2"></div>
                Financial Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchase Currency:</span>
                  <span className="font-medium">USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selling Currency:</span>
                  <span className="font-medium">EUR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchase Payment:</span>
                  <span className="font-medium">Net 30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selling Payment:</span>
                  <span className="font-medium">Net 60</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profit Margin:</span>
                  <span className="font-medium text-green-600">14.7%</span>
                </div>
              </div>
            </div>

            {/* Dates & Timeline Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <div className="w-1 h-4 bg-orange-500 rounded mr-2"></div>
                Dates & Timeline
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">MPO Key Date:</span>
                  <span className="font-medium">2024-01-10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Date:</span>
                  <span className="font-medium">2024-02-10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Closed Date:</span>
                  <span className="font-medium">2024-07-15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lead Time:</span>
                  <span className="font-medium">31 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Remaining:</span>
                  <span className="font-medium text-orange-600">15 days</span>
                </div>
              </div>
            </div>

            {/* Team & Contacts Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <div className="w-1 h-4 bg-indigo-500 rounded mr-2"></div>
                Team & Contacts
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchasing:</span>
                  <span className="font-medium">John Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Contact:</span>
                  <span className="font-medium">Warehouse Manager</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="font-medium">Production Team</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created By:</span>
                  <span className="font-medium">John Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Edited:</span>
                  <span className="font-medium">2024-01-15</span>
                </div>
              </div>
            </div>

            {/* Additional Details Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <div className="w-1 h-4 bg-teal-500 rounded mr-2"></div>
                Additional Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Division:</span>
                  <span className="font-medium">Casual Wear</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Group:</span>
                  <span className="font-medium">A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Note Count:</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Template:</span>
                  <span className="font-medium">Standard Template</span>
                </div>
                <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                  <div className="font-medium text-gray-700 mb-1">Latest Note:</div>
                  <div className="text-gray-600">Materials confirmed for production</div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-1 h-4 bg-yellow-500 rounded mr-2"></div>
              Comments & Notes
            </h4>
            <div className="text-sm text-gray-700">
              Priority order for Spring collection. All materials have been confirmed and suppliers are ready for production.
            </div>
          </div>

          {/* Working Groups */}
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xs text-blue-600 font-medium mb-1">Production</div>
              <div className="text-sm text-blue-800">Active</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-xs text-green-600 font-medium mb-1">Quality Control</div>
              <div className="text-sm text-green-800">Pending</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-xs text-orange-600 font-medium mb-1">Logistics</div>
              <div className="text-sm text-orange-800">Planning</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-xs text-purple-600 font-medium mb-1">Finance</div>
              <div className="text-sm text-purple-800">Approved</div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Enhanced Header with Modern Button Design */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Material Purchase Orders</h1>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Primary Actions */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleImportClick}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <button 
              onClick={handleEdit}
              disabled={selectedIndex < 0 || selectedIndex >= displayRows.length}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <EditIcon className="w-4 h-4 mr-2" />
              Edit
            </button>
            
            <button 
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                style={{ minWidth: 250 }}
              />
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowColumnSelector(v => !v)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FilterIcon className="w-4 h-4 mr-2" />
              Filter Columns
            </button>
            
            <button 
              onClick={handleExportSelected}
              disabled={displayRows.length === 0}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {selectedRows.size > 0 ? `Export Selected (${selectedRows.size})` : 'Export All'}
            </button>
          </div>
        </div>

        {/* Interaction Guide */}
        <div className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-xs text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-medium">Quick Tips:</span>
            <span>• Click row to select for editing</span>
            <span>• Click chevron to view details</span>
            <span>• Press Enter to edit selected row</span>
          </div>
        </div>

        {/* Selection Summary */}
        {selectedRows.size > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">
                  {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedRows(new Set());
                  setSelectAll(false);
                }}
                className="text-sm text-green-600 hover:text-green-800 underline"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Column Selector Modal */}
      {showColumnSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999999] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Select Columns to Display</h3>
              <button onClick={() => setShowColumnSelector(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Search columns..."
                value={columnSearch}
                onChange={e => setColumnSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mb-4">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors"
                onClick={() => {
                  setVisibleColumns(prev => {
                    const newCols = [...prev, ...filteredColumnList.filter(col => !prev.includes(col))];
                    return allColumns.filter(c => newCols.includes(c));
                  });
                }}
              >
                Select All
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors"
                onClick={() => {
                  setVisibleColumns(prev => prev.filter(col => !filteredColumnList.includes(col)));
                }}
              >
                Deselect All
              </button>
            </div>
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {filteredColumnList.length === 0 ? (
                <div className="text-sm text-gray-400 px-2 py-4">No columns found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredColumnList.map(col => (
                    <label key={col} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col)}
                        onChange={() => handleColumnToggle(col)}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700">{col}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">{visibleColumns.length} of {allColumns.length} columns selected</span>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" 
                onClick={() => setShowColumnSelector(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs">
          <thead>
            <tr>
              {renderHeaderRows()[0]}
            </tr>
            {renderHeaderRows()[1].length > 0 && (
              <tr>
                {renderHeaderRows()[1]}
              </tr>
            )}
          </thead>
          <tbody>
            {displayRows.map((row, idx) => (
              <React.Fragment key={idx}>
                <tr

                  className={`
                    transition-all duration-300 cursor-pointer
                    ${selectedIndex === idx ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-500 shadow-lg animate-pulse' : 'hover:bg-gray-50'}
                    ${selectedRows.has(idx) && selectedIndex !== idx ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500 shadow-md' : ''}
                                         ${selectedRows.has(idx) && selectedIndex === idx ? 'bg-gradient-to-r from-blue-100 to-green-100 border-2 border-blue-500 shadow-lg animate-pulse' : ''}
                  `}
                  onClick={(e) => {
                    // Don't trigger row selection if clicking on checkbox
                    if ((e.target as HTMLElement).closest('input[type="checkbox"]')) {
                      return;
                    }
                    setSelectedIndex(idx);
                  }}
                >
                  {/* Checkbox column */}
                  <td className="px-3 py-3 border-b text-center align-middle whitespace-nowrap">
                    <div className="flex items-center justify-center w-full">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(idx)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleRowSelect(idx);
                        }}
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      />
                    </div>
                  </td>
                  
                  {renderColumns().flatMap((col, colIdx, arr) => {
                    if (col.isGroup) {
                      return col.children!.map((subCol, subIdx) => (
                        <td
                          key={col.key + '-' + subCol}
                          className={

                            `px-2 py-1 border-b text-center align-middle whitespace-nowrap` +
                            ((subIdx === 0 || subCol === 'Target Date') ? ' border-r-2 border-gray-200' : '') +
                            (colIdx === arr.length - 1 && subCol === 'Completed Date' ? '' : '')
                          }
                                                 >
                           {row[col.key]?.[subCol] || ''}

                        </td>
                      ));
                    } else {
                      return [

                        <td key={col.key} className={`px-2 py-1 border-b text-center align-middle whitespace-nowrap${colIdx < arr.length - 1 ? ' border-r-2 border-gray-200' : ''}`}>
                          {col.key === 'Order References' ? (
                            <div className="flex items-center justify-center space-x-1">

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRowExpansion(idx);
                                }}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                {isRowExpanded(idx) ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </button>
                              {editIndex === idx ? (
                                <input
                                  className="border px-1 py-0.5 rounded w-32 text-xs"
                                  value={editRow ? editRow[col.key] : ''}
                                  onChange={e => handleChange(col.key, e.target.value)}
                                />
                              ) : (
                                <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                  {row[col.key] || 'MPO-012345'}
                                </span>
                              )}
                            </div>

                                                     ) : (
                             row[col.key] || ''
                           )}

                        </td>
                      ];
                    }
                  })}
                </tr>
                {isRowExpanded(idx) && (
                  <tr>
                    <td colSpan={visibleColumns.reduce((acc, col) => {
                      const group = groupedColumns.find(g => g.key === col);
                      return acc + (group ? 2 : 1);

                    }, 0) + 1} className="p-0">

                      {renderOrderReferencesSubTable(row['Order References'])}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {displayRows.length === 0 && (
              <tr><td colSpan={visibleColumns.reduce((acc, col) => {
                const group = groupedColumns.find(g => g.key === col);
                return acc + (group ? 2 : 1);
              }, 0) + 1} className="text-center py-4 text-gray-400">No results found.</td></tr>
            )}
          </tbody>
                 </table>
       </div>

       {/* Edit Row Modal */}
       {showEditModal && editingRow && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999999] p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-gray-900">Edit Material Purchase Order</h3>
               <button 
                 onClick={() => setShowEditModal(false)} 
                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
               >
                 <X className="h-5 w-5 text-gray-500" />
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Basic Information */}
                 <div className="space-y-4">
                   <h4 className="font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Order References</label>
                       <input
                         type="text"
                         value={editingRow['Order References'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Order References': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                       <input
                         type="text"
                         value={editingRow['Template'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Template': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Transport Method</label>
                       <select
                         value={editingRow['Transport Method'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Transport Method': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       >
                         <option value="">Select Transport Method</option>
                         <option value="Sea Freight">Sea Freight</option>
                         <option value="Air Freight">Air Freight</option>
                         <option value="Land Transport">Land Transport</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Deliver To</label>
                       <input
                         type="text"
                         value={editingRow['Deliver to'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Deliver to': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Financial Information */}
                 <div className="space-y-4">
                   <h4 className="font-semibold text-gray-900 border-b pb-2">Financial Information</h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Total Quantity</label>
                       <input
                         type="text"
                         value={editingRow['Total Qty'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Total Qty': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
                       <input
                         type="text"
                         value={editingRow['Total Cost'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Total Cost': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Total Value</label>
                       <input
                         type="text"
                         value={editingRow['Total Value'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Total Value': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                       <select
                         value={editingRow['Status'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Status': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       >
                         <option value="">Select Status</option>
                         <option value="Open">Open</option>
                         <option value="In Progress">In Progress</option>
                         <option value="Completed">Completed</option>
                         <option value="Cancelled">Cancelled</option>
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Customer & Supplier */}
                 <div className="space-y-4">
                   <h4 className="font-semibold text-gray-900 border-b pb-2">Customer & Supplier</h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                       <input
                         type="text"
                         value={editingRow['Customer'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Customer': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                       <input
                         type="text"
                         value={editingRow['Supplier'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Supplier': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Currency</label>
                       <select
                         value={editingRow['Purchase Currency'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Purchase Currency': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       >
                         <option value="">Select Currency</option>
                         <option value="USD">USD</option>
                         <option value="EUR">EUR</option>
                         <option value="GBP">GBP</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Selling Currency</label>
                       <select
                         value={editingRow['Selling Currency'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Selling Currency': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       >
                         <option value="">Select Currency</option>
                         <option value="USD">USD</option>
                         <option value="EUR">EUR</option>
                         <option value="GBP">GBP</option>
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Additional Information */}
                 <div className="space-y-4">
                   <h4 className="font-semibold text-gray-900 border-b pb-2">Additional Information</h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                       <textarea
                         value={editingRow['Comments'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Comments': e.target.value})}
                         rows={3}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                       <input
                         type="text"
                         value={editingRow['Division'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Division': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                       <input
                         type="text"
                         value={editingRow['Group'] || ''}
                         onChange={(e) => setEditingRow({...editingRow, 'Group': e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
               <button
                 onClick={() => setShowEditModal(false)}
                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
               >
                 Cancel
               </button>
               <button
                 onClick={handleSave}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
               >
                 Save Changes
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Edit SubTable Modal */}
       {showSubTableEditModal && editingSubTableData && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999999] p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-gray-900">Edit Material Purchase Order Details</h3>
               <button 
                 onClick={() => setShowSubTableEditModal(false)} 
                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
               >
                 <X className="h-5 w-5 text-gray-500" />
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Order Information */}
                 <div className="space-y-4">
                   <h4 className="font-semibold text-gray-900 border-b pb-2">Order Information</h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Order Reference</label>
                       <input
                         type="text"
                         value={editingSubTableData.orderReference || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, orderReference: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                       <input
                         type="text"
                         value={editingSubTableData.template || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, template: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Transport Method</label>
                       <select
                         value={editingSubTableData.transportMethod || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, transportMethod: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       >
                         <option value="">Select Transport Method</option>
                         <option value="Sea Freight">Sea Freight</option>
                         <option value="Air Freight">Air Freight</option>
                         <option value="Land Transport">Land Transport</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Deliver To</label>
                       <input
                         type="text"
                         value={editingSubTableData.deliverTo || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, deliverTo: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                       <select
                         value={editingSubTableData.status || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, status: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       >
                         <option value="">Select Status</option>
                         <option value="Open">Open</option>
                         <option value="In Progress">In Progress</option>
                         <option value="Completed">Completed</option>
                         <option value="Cancelled">Cancelled</option>
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Financial Details */}
                 <div className="space-y-4">
                   <h4 className="font-semibold text-gray-900 border-b pb-2">Financial Details</h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Total Quantity</label>
                       <input
                         type="text"
                         value={editingSubTableData.totalQty || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, totalQty: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
                       <input
                         type="text"
                         value={editingSubTableData.totalCost || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, totalCost: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Total Value</label>
                       <input
                         type="text"
                         value={editingSubTableData.totalValue || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, totalValue: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Currency</label>
                       <select
                         value={editingSubTableData.purchaseCurrency || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, purchaseCurrency: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       >
                         <option value="">Select Currency</option>
                         <option value="USD">USD</option>
                         <option value="EUR">EUR</option>
                         <option value="GBP">GBP</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Selling Currency</label>
                       <select
                         value={editingSubTableData.sellingCurrency || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, sellingCurrency: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       >
                         <option value="">Select Currency</option>
                         <option value="USD">USD</option>
                         <option value="EUR">EUR</option>
                         <option value="GBP">GBP</option>
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Customer & Supplier */}
                 <div className="space-y-4">
                   <h4 className="font-semibold text-gray-900 border-b pb-2">Customer & Supplier</h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                       <input
                         type="text"
                         value={editingSubTableData.customer || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, customer: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                       <input
                         type="text"
                         value={editingSubTableData.supplier || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, supplier: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Payment Term</label>
                       <input
                         type="text"
                         value={editingSubTableData.purchasePaymentTerm || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, purchasePaymentTerm: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Selling Payment Term</label>
                       <input
                         type="text"
                         value={editingSubTableData.sellingPaymentTerm || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, sellingPaymentTerm: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Dates */}
                 <div className="space-y-4">
                   <h4 className="font-semibold text-gray-900 border-b pb-2">Important Dates</h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">MPO Key Date</label>
                       <input
                         type="date"
                         value={editingSubTableData.mpoKeyDate || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, mpoKeyDate: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                       <input
                         type="date"
                         value={editingSubTableData.deliveryDate || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, deliveryDate: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Closed Date</label>
                       <input
                         type="date"
                         value={editingSubTableData.closedDate || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, closedDate: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                       <textarea
                         value={editingSubTableData.comments || ''}
                         onChange={(e) => setEditingSubTableData({...editingSubTableData, comments: e.target.value})}
                         rows={3}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
               <button
                 onClick={() => setShowSubTableEditModal(false)}
                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
               >
                 Cancel
               </button>
               <button
                 onClick={handleSubTableSave}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
               >
                 Save Changes
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default MaterialPurchaseOrder; 