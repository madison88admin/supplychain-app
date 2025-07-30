import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { ChevronDown, ChevronRight, Upload, Edit as EditIcon, Save as SaveIcon, Plus, Filter as FilterIcon, Download, X, Trash2, Search, Eye } from 'lucide-react';
import PurchaseOrderEditModal from '../components/modals/PurchaseOrderEditModal';

// Define grouped columns
const groupedColumns = [
  { label: 'Packing & Label Instruction', children: ['Target Date', 'Completed Date'], key: 'Packing & Label Instruction' },
  { label: 'inline Inspection', children: ['Target Date', 'Completed Date'], key: 'inline Inspection' },
  { label: 'Factory Packing List', children: ['Target Date', 'Completed Date'], key: 'Factory Packing List' },
  { label: 'UCC Label', children: ['Target Date', 'Completed Date'], key: 'UCC Label' },
  { label: 'Final Inspection', children: ['Target Date', 'Completed Date'], key: 'Final Inspection' },
  { label: 'Ex-Factory Date', children: ['Target Date', 'Completed Date'], key: 'Ex-Factory Date' },
  { label: 'Upload Shipping Docs', children: ['Target Date', 'Completed Date'], key: 'Upload Shipping Docs' },
  { label: 'Invoice Customer', children: ['Target Date', 'Completed Date'], key: 'Invoice Customer' },
  { label: 'Customer Delivery Date', children: ['Target Date', 'Completed Date'], key: 'Customer Delivery Date' },
  { label: 'Shipment Booking', children: ['Target Date', 'Completed Date'], key: 'Shipment Booking' },
  { label: 'Warehouse/UCC Label', children: ['Target Date', 'Completed Date'], key: 'Warehouse/UCC Label' },
  { label: 'Projected Delivery Date', children: ['Target Date', 'Completed Date'], key: 'Projected Delivery Date' },
  { label: 'Booking', children: ['Target Date', 'Completed Date'], key: 'Booking' },
  { label: 'Order Placement', children: ['Target Date', 'Completed Date'], key: 'Order Placement' },
];

// All other columns
const baseColumns = [
  'PO Line', 'Fit Comment', 'Fit Log Status', 'Fit Log Type', 'Fit Log Name', 'Customer', 'Collection', 'Division', 'Group',
  'Transport Method', 'Deliver To', 'Status', 'Delivery Date', 'Comments', 'Quantity', 'Selling Quantity', 'Closed Date', 'Line Purchase Price',
  'Line Selling Price', 'Note Count', 'Latest Note', 'Order Quantity Increment', 'Order Lead Time', 'Supplier Ref.', 'Template', 'Ex-Factory',
  'Purchase Order Status', 'Supplier Purchase Currency', 'Customer Selling Currency', 'Supplier', 'Purchase Currency', 'Selling Currency',
  'Minimum Order Quantity', 'Purchase Description', 'Product Type', 'Product Sub Type', 'Product Status', 'Product Buyer Style Name',
  'Product Buyer Style Number', 'Standard Minute Value', 'Costing', 'Costong Purchase Currency', 'Costing Selling Currency', 'Costing Status',
  'Supplier Payment Term', 'Supplier Payment Term Description', 'Order Purchase Payment Term', 'Order Purchase Payment Term Description',
  'Product Supplier Purchase Payment Term', 'Product Supplier Purhcase Payment Term Description', 'Order Selling Payment Term',
  'Order Selling Payment Term Description', 'Product Supplier Selling Payment Term', 'Product Supplier Selling Payment Term Description',
  'Order Selling Payment Term', 'Order Selling Payment Term Description', 'Product Supplier Selling Payment Term',
  'Product Supplier Selling Payment Term Description', 'Purchase Price', 'Selling Price', 'Production', 'MLA-Purchasing', 'China-QC',
  'MLA-Planning', 'MLA-Shipping', 'PO Key User 6', 'PO Key User 7', 'PO Key User 8', 'Season', 'Department', 'Customer Parent',
  'RECIPIENT PRODUCT SUPPLIER-NUMBER', 'FG PO Number', 'Received', 'Balance', 'Over Received', 'Size', 'Main Material',
  'Main Material Description', 'Delivery Contact', 'PO Key Working Group 1', 'PO Key Working Group 2', 'PO Key Working Group 3',
  'PO Key Working Group 4', 'Created By', 'Last Edited', 'Last Edited By', 'Color', 'Vessel Schedule', 'Buyer PO Number', 'Shipment ID',
  'Factory Invoiced', 'Balance', 'Supplier Invoice', 'QuickBooks Invoice', 'Shipment Noted', 'Buy Information', 'Handling Charges',
  'Original Forecasts Quantity', 'Start Date', 'Cancelled Date', 'Factory Date Paid', 'Date Invoice Raised', 'Submitted Inspection Date',
  'Remarks', 'Inspection Results', 'Report Type', 'Inspector', 'Approval Status', 'Shipment Status', 'QC Comment', 'Delay Shipment Code',
  'Discount Percentage', 'SELL INC COMM', 'Buyer Surcharge', 'Buyer Surchage Percentage', 'MOQ', 'Discount Cost', 'Factory Surcharge',
  'Factory Surchage Percentage', 'Buyer Season', 'Lookbook', 'Finished Good Testing Status'
];

const allColumns = [
  'Order', 'Product', // Add Order and Product as separate columns at the beginning
  ...baseColumns,
  ...groupedColumns.map(g => g.key),
];

const blankRow: Record<string, any> = Object.fromEntries([
  ['Order', ''], // Add Order and Product to blank row
  ['Product', ''],
  ...baseColumns.map(col => [col, '']),
  ...groupedColumns.map(g => [g.key, { 'Target Date': '', 'Completed Date': '' }]),
]);

const statusOptions = [
  { label: 'Confirmed', value: 'Confirmed', color: 'bg-green-400' },
  { label: 'Forecast', value: 'Forecast', color: 'bg-black' },
  { label: 'Provisional', value: 'Provisional', color: 'bg-orange-400' },
];

const PurchaseOrders: React.FC = () => {
  // Sticky column configuration with precise positioning
  const stickyColumns = [
    { key: 'checkbox-header', left: 0, zIndex: 50, width: 48 },
    { key: 'Order', left: 48, zIndex: 40, width: 120 },
    { key: 'Product', left: 168, zIndex: 40, width: 120 }
  ];

  const getStickyStyle = (key: string, isHeader: boolean = false) => {
    const stickyCol = stickyColumns.find(c => c.key === key);
    if (!stickyCol) return {};
    
    const baseStyle = {
      position: 'sticky' as const,
      left: `${stickyCol.left}px`,
      zIndex: stickyCol.zIndex,
      backgroundColor: isHeader ? '#f9fafb' : '#ffffff',
      boxSizing: 'border-box' as const,
      borderCollapse: 'separate' as const,
      borderSpacing: 0,
      width: `${stickyCol.width}px`,
      minWidth: `${stickyCol.width}px`,
      maxWidth: `${stickyCol.width}px`
    };

    // Add specific border styling for each sticky column
    if (key === 'checkbox-header') {
      return {
        ...baseStyle,
        borderRight: '1px solid #e5e7eb',
        borderLeft: '1px solid #e5e7eb'
      };
    } else if (key === 'Order') {
      return {
        ...baseStyle,
        borderRight: '1px solid #e5e7eb',
        borderLeft: '1px solid #e5e7eb'
      };
    } else if (key === 'Product') {
      return {
        ...baseStyle,
        borderRight: '2px solid #e5e7eb',
        borderLeft: '1px solid #e5e7eb'
      };
    }

    return baseStyle;
  };

  // Create multiple dummy rows for testing
  const createDummyRow = (index: number): Record<string, any> => ({
    'Order': `PO-2024-${String(index + 1).padStart(3, '0')}`,
    'Product': `Product ${String.fromCharCode(65 + index)}`, // A, B, C, etc.
    'PO Line': String(index + 1),
    'Fit Comment': `Fits well - Row ${index + 1}`,
    'Fit Log Status': index % 3 === 0 ? 'Approved' : index % 3 === 1 ? 'Pending' : 'Rejected',
    'Fit Log Type': index % 2 === 0 ? 'Initial' : 'Revision',
    'Fit Log Name': `Fit ${index + 1}`,
    'Customer': `Customer ${String.fromCharCode(65 + index)}`,
    'Collection': `Collection ${index + 1}`,
    'Division': index % 2 === 0 ? 'Menswear' : 'Womenswear',
    'Group': String.fromCharCode(65 + (index % 5)), // A, B, C, D, E
    'Transport Method': index % 3 === 0 ? 'Air' : index % 3 === 1 ? 'Sea' : 'Land',
    'Deliver To': `Warehouse ${index + 1}`,
    'Status': index % 4 === 0 ? 'Open' : index % 4 === 1 ? 'Confirmed' : index % 4 === 2 ? 'In Production' : 'Shipped',
    'Delivery Date': `2024-${String(8 + (index % 3)).padStart(2, '0')}-${String(1 + (index % 28)).padStart(2, '0')}`,
    'Comments': `Comment for row ${index + 1}`,
    'Quantity': 100 + (index * 50),
    'Selling Quantity': 100 + (index * 50),
    'Closed Date': index % 3 === 0 ? `2024-${String(7 + (index % 3)).padStart(2, '0')}-${String(15 + (index % 15)).padStart(2, '0')}` : '',
    'Line Purchase Price': `$${10 + index}`,
    'Line Selling Price': `$${15 + index}`,
    'Note Count': 1 + (index % 5),
    'Latest Note': `Note ${index + 1}`,
    'Order Quantity Increment': 50 + (index * 10),
    'Order Lead Time': `${30 + (index * 5)} days`,
    'Supplier Ref.': `SUP-${String(index + 1).padStart(3, '0')}`,
    'Template': index % 2 === 0 ? 'Standard' : 'Custom',
    'Ex-Factory': `2024-${String(7 + (index % 3)).padStart(2, '0')}-${String(15 + (index % 15)).padStart(2, '0')}`,
    'Purchase Order Status': index % 3 === 0 ? 'Confirmed' : index % 3 === 1 ? 'Pending' : 'Draft',
    'Supplier Purchase Currency': index % 2 === 0 ? 'USD' : 'EUR',
    'Customer Selling Currency': index % 2 === 0 ? 'EUR' : 'USD',
    'Supplier': `Supplier ${String.fromCharCode(65 + index)}`,
    'Purchase Currency': index % 2 === 0 ? 'USD' : 'EUR',
    'Selling Currency': index % 2 === 0 ? 'EUR' : 'USD',
    'Minimum Order Quantity': 100 + (index * 25),
    'Purchase Description': `Description for row ${index + 1}`,
    'Product Type': index % 3 === 0 ? 'Apparel' : index % 3 === 1 ? 'Accessories' : 'Footwear',
    'Product Sub Type': index % 3 === 0 ? 'T-shirt' : index % 3 === 1 ? 'Jeans' : 'Shoes',
    'Product Status': index % 2 === 0 ? 'Active' : 'Inactive',
    'Product Buyer Style Name': `Style ${index + 1}`,
    'Product Buyer Style Number': `ST-${String(index + 1).padStart(3, '0')}`,
    'Standard Minute Value': 12 + index,
    'Costing': `$${8 + index}`,
    'Costong Purchase Currency': index % 2 === 0 ? 'USD' : 'EUR',
    'Costing Selling Currency': index % 2 === 0 ? 'EUR' : 'USD',
    'Costing Status': index % 2 === 0 ? 'Final' : 'Draft',
    'Supplier Payment Term': `Net ${30 + (index * 15)}`,
    'Supplier Payment Term Description': `${30 + (index * 15)} days`,
    'Order Purchase Payment Term': `Net ${30 + (index * 15)}`,
    'Order Purchase Payment Term Description': `${30 + (index * 15)} days`,
    'Product Supplier Purchase Payment Term': `Net ${30 + (index * 15)}`,
    'Product Supplier Purhcase Payment Term Description': `${30 + (index * 15)} days`,
    'Order Selling Payment Term': `Net ${60 + (index * 15)}`,
    'Order Selling Payment Term Description': `${60 + (index * 15)} days`,
    'Product Supplier Selling Payment Term': `Net ${60 + (index * 15)}`,
    'Product Supplier Selling Payment Term Description': `${60 + (index * 15)} days`,
    'Purchase Price': `$${10 + index}`,
    'Selling Price': `$${15 + index}`,
    'Production': index % 3 === 0 ? 'In Progress' : index % 3 === 1 ? 'Completed' : 'Not Started',
    'MLA-Purchasing': `Buyer ${index + 1}`,
    'China-QC': index % 2 === 0 ? 'Passed' : 'Pending',
    'MLA-Planning': index % 2 === 0 ? 'Planned' : 'In Progress',
    'MLA-Shipping': index % 2 === 0 ? 'Pending' : 'Scheduled',
    'PO Key User 6': `User${index + 6}`,
    'PO Key User 7': `User${index + 7}`,
    'PO Key User 8': `User${index + 8}`,
    'Season': index % 4 === 0 ? 'Spring' : index % 4 === 1 ? 'Summer' : index % 4 === 2 ? 'Fall' : 'Winter',
    'Department': index % 3 === 0 ? 'Production' : index % 3 === 1 ? 'Design' : 'Sales',
    'Customer Parent': `Parent ${index + 1}`,
    'RECIPIENT PRODUCT SUPPLIER-NUMBER': `RPS-${String(index + 1).padStart(3, '0')}`,
    'FG PO Number': `FG-2024-${String(index + 1).padStart(3, '0')}`,
    'Received': index * 10,
    'Balance': 100 + (index * 50) - (index * 10),
    'Over Received': index % 3 === 0 ? index * 5 : 0,
    'Size': ['XS', 'S', 'M', 'L', 'XL'][index % 5],
    'Main Material': ['Cotton', 'Polyester', 'Wool', 'Silk', 'Linen'][index % 5],
    'Main Material Description': `100% ${['Cotton', 'Polyester', 'Wool', 'Silk', 'Linen'][index % 5]}`,
    'Delivery Contact': `Contact ${index + 1}`,
    'PO Key Working Group 1': `WG${index + 1}`,
    'PO Key Working Group 2': `WG${index + 2}`,
    'PO Key Working Group 3': `WG${index + 3}`,
    'PO Key Working Group 4': `WG${index + 4}`,
    'Created By': `User${index + 1}`,
    'Last Edited': `2024-${String(6 + (index % 3)).padStart(2, '0')}-${String(30 - (index % 15)).padStart(2, '0')}`,
    'Last Edited By': `Editor${index + 1}`,
    'Color': ['Blue', 'Red', 'Green', 'Black', 'White'][index % 5],
    'Vessel Schedule': `VS-2024-${String(index + 1).padStart(3, '0')}`,
    'Buyer PO Number': `BPO-2024-${String(index + 1).padStart(3, '0')}`,
    'Shipment ID': `SHIP-${String(index + 1).padStart(3, '0')}`,
    'Factory Invoiced': index % 2 === 0 ? 'Yes' : 'No',
    'Supplier Invoice': `INV-${String(index + 1).padStart(3, '0')}`,
    'QuickBooks Invoice': `QB-${String(index + 1).padStart(3, '0')}`,
    'Shipment Noted': index % 2 === 0 ? 'Yes' : 'No',
    'Buy Information': index % 2 === 0 ? 'Standard' : 'Express',
    'Handling Charges': `$${50 + (index * 10)}`,
    'Original Forecasts Quantity': 100 + (index * 50),
    'Start Date': `2024-${String(6 + (index % 3)).padStart(2, '0')}-${String(1 + (index % 28)).padStart(2, '0')}`,
    'Cancelled Date': index % 5 === 0 ? `2024-${String(7 + (index % 3)).padStart(2, '0')}-${String(15 + (index % 15)).padStart(2, '0')}` : '',
    'Factory Date Paid': index % 3 === 0 ? `2024-${String(7 + (index % 3)).padStart(2, '0')}-${String(15 + (index % 15)).padStart(2, '0')}` : '',
    'Date Invoice Raised': index % 2 === 0 ? `2024-${String(7 + (index % 3)).padStart(2, '0')}-${String(15 + (index % 15)).padStart(2, '0')}` : '',
    'Submitted Inspection Date': index % 3 === 0 ? `2024-${String(7 + (index % 3)).padStart(2, '0')}-${String(15 + (index % 15)).padStart(2, '0')}` : '',
    'Remarks': `Remark for row ${index + 1}`,
    'Inspection Results': index % 2 === 0 ? 'Passed' : 'Failed',
    'Report Type': index % 2 === 0 ? 'Standard' : 'Detailed',
    'Inspector': `Inspector ${index + 1}`,
    'Approval Status': index % 3 === 0 ? 'Approved' : index % 3 === 1 ? 'Pending' : 'Rejected',
    'Shipment Status': index % 4 === 0 ? 'Scheduled' : index % 4 === 1 ? 'In Transit' : index % 4 === 2 ? 'Delivered' : 'Delayed',
    'QC Comment': `QC comment for row ${index + 1}`,
    'Delay Shipment Code': index % 5 === 0 ? `DELAY-${index + 1}` : '',
    'Discount Percentage': index % 3 === 0 ? `${5 + index}%` : '',
    'SELL INC COMM': index % 2 === 0 ? `${2 + index}%` : '',
    'Buyer Surcharge': index % 3 === 0 ? `$${10 + index}` : '',
    'Buyer Surchage Percentage': index % 3 === 0 ? `${3 + index}%` : '',
    'MOQ': index % 2 === 0 ? `${100 + (index * 25)}` : '',
    'Discount Cost': index % 3 === 0 ? `$${20 + index}` : '',
    'Factory Surcharge': index % 3 === 0 ? `$${15 + index}` : '',
    'Factory Surchage Percentage': index % 3 === 0 ? `${2 + index}%` : '',
    'Buyer Season': ['Spring', 'Summer', 'Fall', 'Winter'][index % 4],
    'Lookbook': index % 2 === 0 ? `Lookbook ${index + 1}` : '',
    'Finished Good Testing Status': index % 2 === 0 ? 'Passed' : 'Pending',
    // Grouped columns
    ...groupedColumns.reduce((acc, g) => {
      acc[g.key] = { 
        'Target Date': `2024-${String(7 + (index % 3)).padStart(2, '0')}-${String(1 + (index % 28)).padStart(2, '0')}`, 
        'Completed Date': `2024-${String(7 + (index % 3)).padStart(2, '0')}-${String(10 + (index % 18)).padStart(2, '0')}` 
      };
      return acc;
    }, {} as Record<string, any>),
  });

  // Create 10 dummy rows for testing
  const dummyRows = Array.from({ length: 10 }, (_, index) => createDummyRow(index));

  // Fix: Always ensure rows is an array of objects - force refresh with new data structure
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  
  // Initialize rows with dummy data
  React.useEffect(() => {
    setRows(dummyRows);
  }, []);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [filteredRows, setFilteredRows] = useState<typeof rows | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);

  // Add state for expanded Product subtable and its edit state:
  const [expandedProductIndex, setExpandedProductIndex] = useState<number | null>(null);

  // Multi-row selection states
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Fix: handleFileChange maps imported data to objects
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          if (jsonData.length > 1) {
            const headers = jsonData[0] as string[];
            const mappedRows = jsonData.slice(1).map(rowArr => {
              const obj: Record<string, any> = {};
              headers.forEach((header, i) => {
                obj[header] = rowArr[i];
              });
              return obj;
            });
            setRows(mappedRows.length ? mappedRows : dummyRows);
    } else {
            setRows(dummyRows);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleEdit = () => {
    if (selectedIndex >= 0 && selectedIndex < displayRows.length) {
      setEditingData(displayRows[selectedIndex]);
      setIsEditModalOpen(true);
    }
  };

  const handleAdd = () => {
    setEditingData(blankRow);
    setIsAddModalOpen(true);
  };

  const handleSaveEdit = (data: any) => {
      const newRows = [...rows];
    if (isAddModalOpen) {
      // Add new row
      newRows.push(data);
      setSelectedIndex(newRows.length - 1);
    } else {
      // Update existing row
      newRows[selectedIndex] = data;
    }
    setRows(newRows);
  };

  const handleDelete = (data: any) => {
    const newRows = rows.filter(row => row !== data);
    setRows(newRows.length ? newRows : dummyRows);
    if (selectedIndex >= newRows.length) {
      setSelectedIndex(Math.max(0, newRows.length - 1));
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'purchase_orders.xlsx');
  };

  const handleFilter = () => {
    const filtered = rows.filter(row => {
      const matchesSearch = Object.values(row).some(value =>
        String(value).toLowerCase().includes(search.toLowerCase())
      );
      return matchesSearch;
    });
    setFilteredRows(filtered);
  };

  const handleClear = () => {
    setSearch('');
    setFilteredRows(null);
  };

  // Real-time filtering effect
  React.useEffect(() => {
    if (search.trim() === '') {
      setFilteredRows(null);
    } else {
      const filtered = rows.filter(row => {
        const matchesSearch = Object.values(row).some(value =>
          String(value).toLowerCase().includes(search.toLowerCase())
        );
        return matchesSearch;
      });
      setFilteredRows(filtered);
    }
  }, [search, rows]);

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
    XLSX.utils.book_append_sheet(wb, ws, 'PurchaseOrders');
    XLSX.writeFile(wb, `purchase_orders_${selectedRows.size > 0 ? 'selected' : 'all'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleColumnToggle = (col: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(col)) {
        // Remove column
        return prev.filter(c => c !== col);
      } else {
        // Add column in the correct order (matching allColumns)
        const newCols = [...prev, col];
        // Sort according to allColumns order
        return allColumns.filter(c => newCols.includes(c));
      }
    });
  };

  // Fix: renderColumns returns flat array
  const renderColumns = () => {
    const cols: { label: string; key: string; isGroup?: boolean; children?: string[] }[] = [];
    safeVisibleColumns.forEach(col => {
      const group = groupedColumns.find(g => g.key === col);
      if (group) {
        cols.push({ label: group.label, key: group.key, isGroup: true, children: group.children });
      } else {
        cols.push({ label: col, key: col });
      }
    });
    return cols;
  };

  // Fix: renderHeaderRows returns correct structure
  const renderHeaderRows = () => {
    const cols = renderColumns();
    // First row: group headers
    const firstRow = [
      // Add checkbox column header
      <th 
        key="checkbox-header" 
        rowSpan={2} 
        className="px-3 py-1 border-b text-center whitespace-nowrap"
        style={{
          ...getStickyStyle('checkbox-header', true),
          borderTop: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb'
        }}
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
      ...cols.map((col, i) => {
        const style = getStickyStyle(col.key);
        return col.isGroup ? (
          <th 
            key={`${col.key}-group-${i}`} 
            colSpan={2} 
            className={`px-2 py-1 border-b text-center whitespace-nowrap min-w-32`}
            style={{
              ...getStickyStyle(col.key, true),
              borderTop: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            {col.label}
          </th>
        ) : (
          <th 
            key={`${col.key}-single-${i}`} 
            rowSpan={2} 
            className={`px-2 py-1 border-b text-left whitespace-nowrap align-middle min-w-32`}
            style={{
              ...getStickyStyle(col.key, true),
              borderTop: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            {col.label}
          </th>
        );
      })
    ];
    // Second row: subheaders
    const secondRow = cols.flatMap((col, idx) =>
      col.isGroup
        ? [
            <th key={`${col.key}-target-${idx}`} className={`px-2 py-1 border-b text-center whitespace-nowrap border-r-2 border-gray-200`}>Target Date</th>,
            <th key={`${col.key}-completed-${idx}`} className={`${idx < cols.length - 1 ? 'border-r-2 border-gray-200' : ''} px-2 py-1 border-b text-center whitespace-nowrap`}>Completed Date</th>,
          ]
        : []
    );
    return [firstRow, secondRow];
  };

  // Fix: displayRows is always an array of objects
  const displayRows = (filteredRows && filteredRows.length ? filteredRows : rows && rows.length ? rows : dummyRows);

  // Fix: visibleColumns is always an array of strings
  const safeVisibleColumns = Array.isArray(visibleColumns) && visibleColumns.length ? visibleColumns : allColumns;

  // Collapse expanded subtables if their controlling column is hidden
  React.useEffect(() => {
    if (!safeVisibleColumns.includes('Order')) {
      setExpandedIndex(null);
    }
    if (!safeVisibleColumns.includes('Product')) {
      setExpandedProductIndex(null);
    }
  }, [safeVisibleColumns]);

  // Add state for sub-table active tab
  const [activeSubTab, setActiveSubTab] = useState('PO Details');

  // Add state for column selector search
  const [columnSearch, setColumnSearch] = useState('');

  // Filtered columns for selector
  const filteredColumnList = allColumns.filter(col =>
    col.toLowerCase().includes(columnSearch.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Enhanced Header with Modern Button Design */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Purchase Order Lines</h1>
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

        {/* Column Selector */}
        {showColumnSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999999] p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Select Columns to Display</h3>
                <button
                  onClick={() => setShowColumnSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="mb-4">
            <input
              type="text"
                  className="border px-4 py-2 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search columns..."
              value={columnSearch}
              onChange={e => setColumnSearch(e.target.value)}
            />
              </div>
              
              <div className="flex gap-2 mb-4">
              <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
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
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                onClick={() => {
                  setVisibleColumns(prev => prev.filter(col => !filteredColumnList.includes(col)));
                }}
                >
                  Deselect All
                </button>
            </div>
              
              <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {filteredColumnList.length === 0 ? (
                  <div className="text-sm text-gray-400 px-2 py-4 text-center">No columns found.</div>
            ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredColumnList.map(col => (
                      <label key={col} className="flex items-center p-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
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
                <span className="text-sm text-gray-600">
                  {visibleColumns.length} of {allColumns.length} columns selected
                </span>
                <button 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors" 
                  onClick={() => setShowColumnSelector(false)}
                >
                  Apply
        </button>
          </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ 
            boxSizing: 'border-box',
            borderCollapse: 'separate',
            borderSpacing: 0,
            tableLayout: 'auto'
          }}>
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              {renderHeaderRows()[0]}
            </tr>
            {renderHeaderRows()[1].length > 0 && (
              <tr>
                {renderHeaderRows()[1]}
              </tr>
            )}
          </thead>
            <tbody className="divide-y divide-gray-200">
            {displayRows.map((row, idx) => (
              <React.Fragment key={`row-${idx}-${row.Order || row.Balance || idx}`}>
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
                    <td 
                      className="px-3 py-3 border-b align-top whitespace-nowrap"
                      style={{
                        ...getStickyStyle('checkbox-header', false),
                        borderTop: '1px solid #e5e7eb',
                        borderBottom: '1px solid #e5e7eb'
                      }}
                    >
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
                    // Handle Order column with sticky positioning and expand/collapse functionality
                    if (col.key === 'Order') {
                      return [
                          <td 
                            key={`${col.key}-${idx}-${colIdx}`} 
                            className={`px-3 py-3 border-b align-top whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-colors`}
                            style={{
                              ...getStickyStyle(col.key, false),
                              width: '120px',
                              minWidth: '120px',
                              maxWidth: '120px',
                              borderTop: '1px solid #e5e7eb',
                              borderBottom: '1px solid #e5e7eb'
                            }}
                            onClick={e => {
                              e.stopPropagation();
                              setExpandedIndex(expandedIndex === idx ? null : idx);
                            }}
                            title={expandedIndex === idx ? 'Click to collapse details' : 'Click to expand details'}
                          > 
                            <div className="flex items-center w-full">
                              <div className="mr-2 align-middle flex-shrink-0">
                                {expandedIndex === idx ? <ChevronDown className="inline h-4 w-4 text-blue-600" /> : <ChevronRight className="inline h-4 w-4 text-gray-500" />}
                              </div>
                              <span className="font-medium text-gray-900 truncate">{row[col.key] || ''}</span>
                            </div>
                          </td>
                      ];
                    }
                    // Handle Product column with sticky positioning and expand/collapse functionality
                    if (col.key === 'Product') {
                      return [
                          <td 
                            key={`${col.key}-${idx}-${colIdx}`} 
                            className={`px-3 py-3 border-b align-top whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-colors`}
                            style={{
                              ...getStickyStyle(col.key, false),
                              width: '120px',
                              minWidth: '120px',
                              maxWidth: '120px',
                              borderTop: '1px solid #e5e7eb',
                              borderBottom: '1px solid #e5e7eb'
                            }}
                            onClick={e => {
                              e.stopPropagation();
                              setExpandedProductIndex(expandedProductIndex === idx ? null : idx);
                            }}
                            title={expandedProductIndex === idx ? 'Click to collapse product details' : 'Click to expand product details'}
                          > 
                            <div className="flex items-center w-full">
                              <div className="mr-2 align-middle flex-shrink-0">
                                {expandedProductIndex === idx ? <ChevronDown className="inline h-4 w-4 text-blue-600" /> : <ChevronRight className="inline h-4 w-4 text-gray-500" />}
                              </div>
                              <span className="font-medium text-gray-900 truncate">{row[col.key] || ''}</span>
                            </div>
                          </td>
                      ];
                    }
                    // Handle grouped columns
                    if (col.isGroup) {
                      return col.children!.map((subCol, subIdx) => (
                        <td
                          key={`${col.key}-${subCol}-${idx}`}
                          className={
                              `px-3 py-3 border-b align-top whitespace-nowrap min-w-20` +
                            ((subIdx === 0 || subCol === 'Target Date') ? ' border-r-2 border-gray-200' : '') +
                            (colIdx === arr.length - 1 && subCol === 'Completed Date' ? '' : '')
                          }
                        >
                            {row[col.key]?.[subCol] || ''}
                        </td>
                      ));
                    } else {
                      // Handle all other regular columns
                      return [
                          <td key={`${col.key}-${idx}-${colIdx}`} className={`px-3 py-3 border-b align-top whitespace-nowrap min-w-24${colIdx < arr.length - 1 ? ' border-r-2 border-gray-200' : ''}`}>
                            {row[col.key] || ''}
                        </td>
                      ];
                    }
                  })}
                </tr>
                  {/* Expanded Details - Keep existing expanded row logic */}
                {expandedIndex === idx && safeVisibleColumns.includes('Order') && (
                  <tr>
                      <td colSpan={renderColumns().reduce((acc, col) => acc + (col.isGroup ? 2 : 1), 0) + 1} className="bg-blue-50 px-6 py-4 sticky left-0 z-10">
                        {/* Keep existing expanded content */}
                    </td>
                  </tr>
                )}
                {expandedProductIndex === idx && safeVisibleColumns.includes('Product') && (
                  <tr>
                      <td colSpan={renderColumns().reduce((acc, col) => acc + (col.isGroup ? 2 : 1), 0) + 1} className="bg-blue-50 px-6 py-4 sticky left-0 z-10">
                        {/* Keep existing expanded content */}
                                  </td>
                                </tr>
                  )}
                </React.Fragment>
              ))}
                              </tbody>
                            </table>
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

      {/* Modals */}
      <PurchaseOrderEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingData(null);
        }}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
        data={editingData}
        isNew={false}
      />

      <PurchaseOrderEditModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingData(null);
        }}
        onSave={handleSaveEdit}
        data={editingData}
        isNew={true}
      />
    </div>
  );
};

export default PurchaseOrders;