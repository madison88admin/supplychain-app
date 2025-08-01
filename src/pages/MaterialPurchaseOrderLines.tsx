import React, { useRef, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { ChevronDown, ChevronRight, Upload, Edit as EditIcon, Save as SaveIcon, Copy as CopyIcon, Plus, Filter as FilterIcon, Download, X, Trash2, Search, Eye } from 'lucide-react';
import { parse, format, isValid } from 'date-fns';
import MaterialPurchaseOrderLinesEditModal from '../components/modals/MaterialPurchaseOrderLinesEditModal';

// Robust date formatting utility function that handles multiple date formats including Excel serial numbers
const formatDateToMMDDYYYY = (dateValue: any): string => {
  if (!dateValue) return '';
  
  // If it's already a string in MM/DD/YYYY format
  if (typeof dateValue === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateValue)) {
    return dateValue;
  }
  
  // If it's a Date object or Excel serial number
  let date: Date;
  if (typeof dateValue === 'number') {
    // Excel serial number (days since 1900-01-01)
    date = new Date((dateValue - 25569) * 86400 * 1000);
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else {
    // Try to parse as string using date-fns for robust parsing
    const knownFormats = [
      'yyyy-MM-dd',           // ISO format: 2024-01-15
      'MM/dd/yyyy',           // US format: 01/15/2024
      'dd/MM/yyyy',           // European format: 15/01/2024
      'yyyy/MM/dd',           // Alternative ISO: 2024/01/15
      'MM-dd-yyyy',           // US with dashes: 01-15-2024
      'dd-MM-yyyy',           // European with dashes: 15-01-2024
      'MMM d, yyyy',          // Month name: Jan 15, 2024
      'd MMM yyyy',           // Day first: 15 Jan 2024
      'MMMM d, yyyy',         // Full month: January 15, 2024
      'd MMMM yyyy',          // Full month day first: 15 January 2024
      'yyyy-MM-dd\'T\'HH:mm:ss', // ISO with time: 2024-01-15T10:30:00
      'yyyy-MM-dd\'T\'HH:mm:ss.SSS', // ISO with milliseconds: 2024-01-15T10:30:00.000
    ];

    for (const fmt of knownFormats) {
      try {
        const parsed = parse(dateValue, fmt, new Date());
        if (isValid(parsed)) {
          return format(parsed, 'MM/dd/yyyy');
        }
      } catch (error) {
        // Continue to next format if parsing fails
        continue;
      }
    }
    
    // Fallback to JavaScript Date constructor for other formats
    date = new Date(dateValue);
  }
  
  // Check if valid date
  if (isNaN(date.getTime())) return '';
  
  // Format as MM/DD/YYYY
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
};

// Helper function to check if a column is a date column
const isDateColumn = (columnName: string): boolean => {
  const dateKeywords = ['Date', 'Created', 'Last Edited', 'Closed', 'Delivery', 'Issue', 'Factory'];
  return dateKeywords.some(keyword => columnName.includes(keyword));
};

// Helper function to find matching column names with flexible matching
const findMatchingColumn = (importedHeaders: string[], targetColumn: string): string | null => {
  // Exact match
  if (importedHeaders.includes(targetColumn)) {
    return targetColumn;
  }
  
  // Case-insensitive match
  const lowerTarget = targetColumn.toLowerCase();
  const match = importedHeaders.find(header => header.toLowerCase() === lowerTarget);
  if (match) {
    return match;
  }
  
  // Partial match (contains the target column name)
  const partialMatch = importedHeaders.find(header => 
    header.toLowerCase().includes(lowerTarget) || 
    lowerTarget.includes(header.toLowerCase())
  );
  if (partialMatch) {
    return partialMatch;
  }
  
  return null;
};

// All columns in the order provided
const allColumns = [
  'Material Purchase Order', 'Material', 'Material Purchase Order Line', 'Material Sample Log Comment', 
  'Material Sample Log Status', 'Material Sample Log Type', 'Material Sample Log Name', 'Customer', 
  'Collection', 'Division', 'Group', 'Transport Method', 'Deliver To', 'Status', 'Delivery Date', 
  'Comments', 'Quantity', 'Selling Quantity', 'Closed Date', 'Line Purchase Price', 'Line Selling Price', 
  'Note Count', 'Latest Note', 'Order Quantity Increment', 'Order Lead Time', 'Supplier Ref.', 'Template', 
  'MPO Line Key Date', 'Material Purchase Order Status', 'Supplier Purchase Currency', 'Customer Selling Currency', 
  'Supplier', 'Purchase Currency', 'Selling Currency', 'Minimum Order Quantity', 'Minimum Colour Quantity', 
  'Material Description', 'Material Type', 'Material Sub Type', 'Material Status', 'Material Buyer Style Name', 
  'Material Buyer Style Number', 'Material Department', 'Season', 'Material Supplier Profile', 
  'Material Supplier Profile Purchase Currency', 'Material Supplier Profile Selling Currency', 'Costing Status', 
  'Supplier Payment Term', 'Supplier Payment Term Description', 'Material Purchase Order Purchase Payment Term', 
  'Material Purchase Order Purchase Payment Term Description', 'Product Supplier Purchase Payment Term', 
  'Product Supplier Purchase Payment Term Description', 'Material Purchase Order Selling Payment Term', 
  'Material Purchase Order Selling Payment Term Description', 'Product Supplier Selling Payment Term', 
  'Product Supplier Selling Payment Term Description', 'Purchase Price', 'Selling Price', 'Purchasing', 
  'MPO Key User 2', 'MPO Key User 3', 'MPO Key User 4', 'MPO Key User 5', 'MPO Key User 6', 'MPO Key User 7', 
  'MPO Key User 8', 'Customer Parent', 'RECIPIENT PRODUCT SUPPLIER-FACTORY', 'FG PO Number', 'Received', 
  'Balance', 'Over Received', 'Recipient Product Supplier', 'Size', 'Delivery Contact', 'Composition', 
  'MPO Key Working Group 1', 'MPO Key Working Group 2', 'MPO Key Working Group 3', 'MPO Key Working Group 4', 
  'Created By', 'Created', 'Last Edited', 'Last Edited By', 'Color', 'AWB', 'Invoice Number', 
  'Payment Confirmation #', 'Invoice Status', 'FG Ex-Factory', 'Trim Receipt Date', 'Customer Code'
];

// Function to generate dummy material purchase order line entries
const generateDummyEntries = (): Record<string, any>[] => {
  const customers = ['ABC Corp', 'Beta Industries', 'Gamma Solutions', 'Delta Manufacturing', 'Epsilon Trading'];
  const suppliers = ['XYZ Textiles', 'Premium Fabrics', 'Global Materials', 'Quality Suppliers', 'Elite Manufacturing'];
  const statuses = ['Open', 'Confirmed', 'In Production', 'Shipped', 'Delivered'];
  const divisions = ['Apparel', 'Electronics', 'Home Goods', 'Automotive', 'Healthcare'];
  const groups = ['Men\'s Wear', 'Women\'s Wear', 'Children\'s', 'Accessories', 'Footwear'];
  const transportMethods = ['Sea', 'Air', 'Land', 'Express'];
  const materialTypes = ['Fabric', 'Trims', 'Hardware', 'Packaging', 'Labels'];
  const materialSubTypes = ['Cotton', 'Polyester', 'Zippers', 'Buttons', 'Tags'];
  const materialStatuses = ['Active', 'Inactive', 'Discontinued', 'New', 'Pending'];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'All Season'];
  const currencies = ['USD', 'EUR', 'CNY', 'INR', 'THB'];
  const paymentTerms = ['Net 30', 'Net 60', 'Net 90', 'Cash on Delivery', 'Advance Payment'];
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const compositions = ['100% Cotton', 'Polyester/Cotton', '100% Polyester', 'Wool Blend', 'Silk'];

  const dummyEntries: Record<string, any>[] = [];

  for (let i = 1; i <= 10; i++) {
    const customer = customers[i % customers.length];
    const supplier = suppliers[i % suppliers.length];
    const status = statuses[i % statuses.length];
    const division = divisions[i % divisions.length];
    const group = groups[i % groups.length];
    const transport = transportMethods[i % transportMethods.length];
    const materialType = materialTypes[i % materialTypes.length];
    const materialSubType = materialSubTypes[i % materialSubTypes.length];
    const materialStatus = materialStatuses[i % materialStatuses.length];
    const season = seasons[i % seasons.length];
    const currency = currencies[i % currencies.length];
    const paymentTerm = paymentTerms[i % paymentTerms.length];
    const color = colors[i % colors.length];
    const size = sizes[i % sizes.length];
    const composition = compositions[i % compositions.length];

    const baseDate = new Date(2024, 6, 1); // July 1, 2024
    const deliveryDate = new Date(baseDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000)); // Add i weeks
    const closedDate = new Date(deliveryDate.getTime() - (5 * 24 * 60 * 60 * 1000)); // 5 days before delivery
    const createdDate = new Date(baseDate.getTime() - (14 * 24 * 60 * 60 * 1000)); // 2 weeks before
    const lastEditedDate = new Date(baseDate.getTime() - (7 * 24 * 60 * 60 * 1000)); // 1 week before

    const quantity = 100 + (i * 50);
    const sellingQuantity = quantity * 1.1; // 10% more for selling
    const linePurchasePrice = (10 + i) * quantity;
    const lineSellingPrice = linePurchasePrice * 1.2; // 20% markup
    const purchasePrice = 10 + i;
    const sellingPrice = purchasePrice * 1.2;

    const entry: Record<string, any> = {
      'Material Purchase Order': `MPO-2024-${String(i).padStart(3, '0')}`,
      'Material': `MAT-${String(i).padStart(3, '0')}`,
      'Material Purchase Order Line': `MPOL-${String(i).padStart(3, '0')}`,
      'Material Sample Log Comment': `Sample comment for material ${i}`,
      'Material Sample Log Status': status,
      'Material Sample Log Type': 'Production Sample',
      'Material Sample Log Name': `Sample-${String(i).padStart(3, '0')}`,
      'Customer': customer,
      'Collection': `Collection ${i}`,
      'Division': division,
      'Group': group,
      'Transport Method': transport,
      'Deliver To': `Warehouse ${i}`,
      'Status': status,
      'Delivery Date': deliveryDate.toISOString().split('T')[0],
      'Comments': `${status} material line for ${customer}`,
      'Quantity': quantity,
      'Selling Quantity': sellingQuantity,
      'Closed Date': closedDate.toISOString().split('T')[0],
      'Line Purchase Price': `$${linePurchasePrice.toLocaleString()}`,
      'Line Selling Price': `$${lineSellingPrice.toLocaleString()}`,
      'Note Count': i,
      'Latest Note': `Note ${i}: ${status} status update`,
      'Order Quantity Increment': 50,
      'Order Lead Time': 30,
      'Supplier Ref.': `SUP-REF-${String(i).padStart(3, '0')}`,
      'Template': `Template ${String.fromCharCode(65 + i)}`,
      'MPO Line Key Date': deliveryDate.toISOString().split('T')[0],
      'Material Purchase Order Status': status,
      'Supplier Purchase Currency': currency,
      'Customer Selling Currency': 'EUR',
      'Supplier': supplier,
      'Purchase Currency': currency,
      'Selling Currency': 'EUR',
      'Minimum Order Quantity': 100,
      'Minimum Colour Quantity': 50,
      'Material Description': `${materialType} - ${materialSubType} for ${customer}`,
      'Material Type': materialType,
      'Material Sub Type': materialSubType,
      'Material Status': materialStatus,
      'Material Buyer Style Name': `Style-${String(i).padStart(3, '0')}`,
      'Material Buyer Style Number': `STY-${String(i).padStart(3, '0')}`,
      'Material Department': division,
      'Season': season,
      'Material Supplier Profile': `${supplier} Profile`,
      'Material Supplier Profile Purchase Currency': currency,
      'Material Supplier Profile Selling Currency': 'EUR',
      'Costing Status': 'Completed',
      'Supplier Payment Term': paymentTerm,
      'Supplier Payment Term Description': `${paymentTerm} days after invoice`,
      'Material Purchase Order Purchase Payment Term': paymentTerm,
      'Material Purchase Order Purchase Payment Term Description': `${paymentTerm} days after invoice`,
      'Product Supplier Purchase Payment Term': paymentTerm,
      'Product Supplier Purchase Payment Term Description': `${paymentTerm} days after invoice`,
      'Material Purchase Order Selling Payment Term': 'Net 60',
      'Material Purchase Order Selling Payment Term Description': '60 days after invoice',
      'Product Supplier Selling Payment Term': 'Net 60',
      'Product Supplier Selling Payment Term Description': '60 days after invoice',
      'Purchase Price': `$${purchasePrice}`,
      'Selling Price': `$${sellingPrice}`,
      'Purchasing': 'In Progress',
      'MPO Key User 2': `User${i}`,
      'MPO Key User 3': `User${i + 1}`,
      'MPO Key User 4': `User${i + 2}`,
      'MPO Key User 5': `User${i + 3}`,
      'MPO Key User 6': `User${i + 4}`,
      'MPO Key User 7': `User${i + 5}`,
      'MPO Key User 8': `User${i + 6}`,
      'Customer Parent': `${customer} Group`,
      'RECIPIENT PRODUCT SUPPLIER-FACTORY': `Factory ${i}`,
      'FG PO Number': `FG-PO-${String(i).padStart(3, '0')}`,
      'Received': quantity * 0.8, // 80% received
      'Balance': quantity * 0.2, // 20% balance
      'Over Received': 0,
      'Recipient Product Supplier': `Recipient ${i}`,
      'Size': size,
      'Delivery Contact': `Contact ${i}`,
      'Composition': composition,
      'MPO Key Working Group 1': `Group${i}`,
      'MPO Key Working Group 2': `Group${i + 1}`,
      'MPO Key Working Group 3': `Group${i + 2}`,
      'MPO Key Working Group 4': `Group${i + 3}`,
      'Created By': 'Admin',
      'Created': createdDate.toISOString().split('T')[0],
      'Last Edited': lastEditedDate.toISOString().split('T')[0],
      'Last Edited By': 'Editor',
      'Color': color,
      'AWB': `AWB-${String(i).padStart(6, '0')}`,
      'Invoice Number': `INV-${String(i).padStart(6, '0')}`,
      'Payment Confirmation #': `PAY-${String(i).padStart(6, '0')}`,
      'Invoice Status': 'Paid',
      'FG Ex-Factory': deliveryDate.toISOString().split('T')[0],
      'Trim Receipt Date': new Date(deliveryDate.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      'Customer Code': `CUST-${String(i).padStart(3, '0')}`
    };

    dummyEntries.push(entry);
  }

  return dummyEntries;
};

const MaterialPurchaseOrderLines: React.FC = () => {
  // Sticky column configuration with precise positioning
  const stickyColumns = [
    { key: 'checkbox-header', left: 0, zIndex: 50, width: 48 },
    { key: 'Material Purchase Order', left: 48, zIndex: 40, width: 180 },
    { key: 'Material', left: 228, zIndex: 40, width: 120 },
    { key: 'Material Purchase Order Line', left: 348, zIndex: 40, width: 200 }
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
    } else if (key === 'Material Purchase Order') {
      return {
        ...baseStyle,
        borderRight: '1px solid #e5e7eb',
        borderLeft: '1px solid #e5e7eb'
      };
    } else if (key === 'Material') {
      return {
        ...baseStyle,
        borderRight: '1px solid #e5e7eb',
        borderLeft: '1px solid #e5e7eb'
      };
    } else if (key === 'Material Purchase Order Line') {
      return {
        ...baseStyle,
        borderRight: '2px solid #e5e7eb',
        borderLeft: '1px solid #e5e7eb'
      };
    }

    return baseStyle;
  };

  const [rows, setRows] = useState(generateDummyEntries());
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [search, setSearch] = useState('');
  const [filteredRows, setFilteredRows] = useState<typeof rows | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Cell selection states
  const [selectedCell, setSelectedCell] = useState<{rowIndex: number, colKey: string} | null>(null);
  const [columnSearch, setColumnSearch] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState<any>(null);
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [expanded, setExpanded] = useState<{ row: number, col: string } | null>(null);
  const [editingSection, setEditingSection] = useState<{ row: number, col: string, section: string } | null>(null);
  const [activeTab, setActiveTab] = useState('Purchase Order Details');
  
  // Form state for editing
  const [mpoForm, setMpoForm] = useState<any>(null);
  const [mpoEditIdx, setMpoEditIdx] = useState<number | null>(null);

  const mainDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainDivRef.current) {
      mainDivRef.current.focus();
    }
  }, []);

  // Filtered columns for selector
  const filteredColumnList = allColumns.filter(col =>
    col.toLowerCase().includes(columnSearch.toLowerCase())
  );

  const handleEdit = () => {
    if (selectedIndex >= 0 && selectedIndex < displayRows.length) {
      setEditModalData({ ...JSON.parse(JSON.stringify(displayRows[selectedIndex])) });
      setIsNewEntry(false);
      setIsEditModalOpen(true);
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
    const newRow = Object.fromEntries(allColumns.map(col => [col, '']));
    setEditModalData(newRow);
    setIsNewEntry(true);
    setIsEditModalOpen(true);
  };

  const handleFilter = () => {
    if (!search.trim()) {
      setFilteredRows(null);
      setSelectedIndex(0);
      return;
    }
    const lower = search.toLowerCase();
    const filtered = rows.filter(row =>
      allColumns.some(col => String(row[col] ?? '').toLowerCase().includes(lower))
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
        let val = row[col];
        if (typeof val === 'object' && val !== null) {
          val = (val as any).props?.children?.toString() || '';
        }
        obj[col] = String(val ?? '');
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MaterialPurchaseOrderLines');
    XLSX.writeFile(wb, 'material_purchase_order_lines.xlsx');
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
        const newRow: Record<string, any> = {};
        allColumns.forEach((col) => {
          const matchingHeader = findMatchingColumn(Object.keys(row), col);
          if (matchingHeader && row[matchingHeader] !== undefined) {
            let value = row[matchingHeader];
            
            // Format dates if it's a date column
            if (isDateColumn(col)) {
              value = formatDateToMMDDYYYY(value);
            }
            
            newRow[col] = value;
          } else {
            newRow[col] = '';
          }
        });
        return newRow;
      });
      
      setRows((prev) => [...prev, ...mappedRows]);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleRowSelect = (rowIndex: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
    } else {
      newSelectedRows.add(rowIndex);
    }
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.size === displayRows.length);
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
    XLSX.utils.book_append_sheet(wb, ws, 'MaterialPurchaseOrderLines');
    XLSX.writeFile(wb, `material_purchase_order_lines_${selectedRows.size > 0 ? 'selected' : 'all'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Cell selection handlers - now highlights entire row
  const handleCellClick = (rowIndex: number, colKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex(rowIndex);
    // Clear any previous cell selection
    setSelectedCell(null);
  };

  const handleCellKeyDown = (rowIndex: number, colKey: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedIndex(rowIndex);
      // Clear any previous cell selection
      setSelectedCell(null);
    }
  };

  const handleSaveEdit = (data: any) => {
    if (isNewEntry) {
      const newRows = [data, ...(filteredRows ?? rows)];
      if (filteredRows) {
        const mainRows = [data, ...rows];
        setRows(mainRows);
        setFilteredRows(newRows);
      } else {
        setRows(newRows);
      }
      setSelectedIndex(0);
    } else {
      const newRows = [...(filteredRows ?? rows)];
      newRows[selectedIndex] = { ...data };
      if (filteredRows) {
        const mainRows = [...rows];
        const idxInMain = rows.indexOf(filteredRows[selectedIndex]);
        if (idxInMain !== -1) mainRows[idxInMain] = { ...data };
        setRows(mainRows);
        setFilteredRows(newRows);
      } else {
        setRows(newRows);
      }
    }
  };

  const handleDelete = (data: any) => {
    const newRows = (filteredRows ?? rows).filter(row => 
      row['Material Purchase Order'] !== data['Material Purchase Order'] ||
      row['Material'] !== data['Material'] ||
      row['Material Purchase Order Line'] !== data['Material Purchase Order Line']
    );
    
    if (filteredRows) {
      const mainRows = rows.filter(row => 
        row['Material Purchase Order'] !== data['Material Purchase Order'] ||
        row['Material'] !== data['Material'] ||
        row['Material Purchase Order Line'] !== data['Material Purchase Order Line']
      );
      setRows(mainRows);
      setFilteredRows(newRows);
    } else {
      setRows(newRows);
    }
    
    setSelectedIndex(Math.min(selectedIndex, newRows.length - 1));
  };

  // Keyboard event handler for Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < displayRows.length) {
      handleEdit();
    }
  };

  const displayRows = filteredRows ?? rows;

  return (
    <div className="p-6" onKeyDown={handleKeyDown} tabIndex={0} ref={mainDivRef}>
      {/* Enhanced Header with Modern Button Design */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Material Purchase Order Lines</h1>
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
                placeholder="Search material orders..."
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



        {/* Interaction Guide */}
        <div className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-xs text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-medium">Quick Tips:</span>
            <span>• Click row to select for editing</span>
            <span>• Press Enter to edit selected row</span>
            <span>• Use column filter to customize view</span>
            <span>• Click "Details" to expand row information</span>
          </div>
        </div>

        {/* Column Selector Modal */}
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
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(86vh - 220px)' }}>
          <table className="min-w-full bg-white border border-gray-200 rounded-md text-xs" style={{ 
            boxSizing: 'border-box',
            borderCollapse: 'separate',
            borderSpacing: 0,
            tableLayout: 'auto'
          }}>
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-40">
              <tr>
                {/* Checkbox column header */}
                <th 
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
                </th>
                {visibleColumns.map((col, i) => (
                  <th 
                    key={col} 
                    className={`px-2 py-1 border-b text-left whitespace-nowrap align-middle min-w-32${i < visibleColumns.length - 1 ? ' border-r-2 border-gray-200' : ''}`}
                    style={{
                      ...getStickyStyle(col, true),
                      borderTop: '1px solid #e5e7eb',
                      borderBottom: '1px solid #e5e7eb'
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row, idx) => (
                <React.Fragment key={idx}>
                  <tr
                    className={`
                      transition-all duration-300 cursor-pointer group
                      ${selectedIndex === idx ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-500 shadow-lg animate-pulse' : 'hover:bg-gray-50'}
                      ${selectedRows.has(idx) && selectedIndex !== idx ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500 shadow-md' : ''}
                      ${selectedRows.has(idx) && selectedIndex === idx ? 'bg-gradient-to-r from-blue-100 to-green-100 border-2 border-blue-500 shadow-lg animate-pulse' : ''}
                    `}
                    title="Click to select for editing"
                    onClick={() => {
                      setSelectedIndex(idx);
                      if (mainDivRef.current) mainDivRef.current.focus();
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
                      <div className="flex items-center justify-center">
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
                    
                    {visibleColumns.map((col, colIdx) => {
                      const showArrow = (
                        col === 'Material Purchase Order' ||
                        col === 'Material' ||
                        col === 'Material Purchase Order Line'
                      );
                      const isExpanded = expanded && expanded.row === idx && expanded.col === col;
                      return (
                        <td 
                          key={col} 
                          className={`px-2 py-1 border-b align-top whitespace-nowrap${colIdx < visibleColumns.length - 1 ? ' border-r-2 border-gray-200' : ''}`}
                          style={{
                            ...getStickyStyle(col, false),
                            borderTop: '1px solid #e5e7eb',
                            borderBottom: '1px solid #e5e7eb'
                          }}
                        >
                          {showArrow ? (
                            <button
                              type="button"
                              className="flex items-center justify-between w-full group focus:outline-none hover:bg-gray-100 rounded px-1 py-1"
                              onClick={e => {
                                e.stopPropagation();
                                setExpanded(isExpanded ? null : { row: idx, col });
                              }}
                              title={`Click to ${isExpanded ? 'collapse' : 'expand'} details`}
                            >
                              <span className="flex-1 text-left">{row[col] || ''}</span>
                              <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          ) : (
                            <span className="block w-full">{row[col] || ''}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  
                  {expanded && expanded.row === idx && (
                    <tr key={`expanded-${idx}-${expanded.col}`} className="expanded-row"> 
                      <td colSpan={visibleColumns.length + 1} className="bg-blue-50 border-b border-blue-200 p-4">
                        {expanded.col === 'Material Purchase Order' && (
                          <div className="bg-blue-50 px-6 py-4">
                            <div className="flex justify-between items-center mb-4">
                              <div className="font-semibold text-blue-700">Material Purchase Order Details</div>
                            </div>
                            
                            {/* Horizontal Tabs */}
                            <div className="mb-4 flex gap-2 border-b border-blue-200">
                              {['Purchase Order Details', 'Critical Path', 'Special Instructions', 'Delivery Details', 'Activities'].map(tab => (
                                <button
                                  key={tab}
                                  className={`px-4 py-2 -mb-px rounded-t font-medium transition-colors border-b-2 ${activeTab === tab ? 'bg-white border-blue-500 text-blue-700' : 'bg-blue-50 border-transparent text-gray-600 hover:text-blue-600'}`}
                                  onClick={() => setActiveTab(tab)}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>
                            
                                                         {/* Tab Content */}
                             <div className="max-w-4xl w-full">
                               {activeTab === 'Purchase Order Details' && (
                                 <>
                                   <table className="text-sm border border-blue-200 rounded mb-2 w-full">
                                     <tbody>
                                                                               <tr><td className="px-2 py-1 font-semibold">Order Reference</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Material Purchase Order'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Material Purchase Order': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Material Purchase Order']}</td></tr>
                                        <tr><td className="px-2 py-1 font-semibold">Status</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Status'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Status': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="Open">Open</option><option value="Confirmed">Confirmed</option><option value="In Production">In Production</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option></select> : row['Status']}</td></tr>
                                        <tr><td className="px-2 py-1 font-semibold">Supplier Currency</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Supplier Purchase Currency'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Supplier Purchase Currency': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="USD">USD</option><option value="EUR">EUR</option><option value="CNY">CNY</option><option value="INR">INR</option></select> : row['Supplier Purchase Currency']}</td></tr>
                                        <tr><td className="px-2 py-1 font-semibold">Recipient Product Supplier</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Recipient Product Supplier'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Recipient Product Supplier': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Recipient Product Supplier']}</td></tr>
                                        <tr><td className="px-2 py-1 font-semibold">Purchase Currency</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Purchase Currency'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Purchase Currency': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="USD">USD</option><option value="EUR">EUR</option><option value="CNY">CNY</option><option value="INR">INR</option></select> : row['Purchase Currency']}</td></tr>
                                        <tr><td className="px-2 py-1 font-semibold">Purchase Payment Term</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Material Purchase Order Purchase Payment Term'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Material Purchase Order Purchase Payment Term': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="Net 30">Net 30</option><option value="Net 60">Net 60</option><option value="Net 90">Net 90</option><option value="Cash on Delivery">Cash on Delivery</option></select> : row['Material Purchase Order Purchase Payment Term']}</td></tr>
                                     </tbody>
                                   </table>
                                   <div className="flex gap-2 mt-2">
                                     {mpoEditIdx === idx ? (
                                       <>
                                         <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => {
                                           const newRows = [...(filteredRows ?? rows)];
                                           newRows[idx] = { ...row, ...mpoForm };
                                           if (filteredRows) {
                                             const mainRows = [...rows];
                                             const idxInMain = rows.indexOf(filteredRows[idx]);
                                             mainRows[idxInMain] = { ...row, ...mpoForm };
                                             setRows(mainRows);
                                             setFilteredRows(newRows);
                                           } else {
                                             setRows(newRows);
                                           }
                                           setMpoEditIdx(null);
                                           setMpoForm(null);
                                         }}>Save</button>
                                         <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(null); setMpoForm(null); }}>Cancel</button>
                                       </>
                                     ) : (
                                       <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(idx); setMpoForm({ ...row }); }}>Edit</button>
                                     )}
                                   </div>
                                 </>
                               )}
                              
                                                             {activeTab === 'Critical Path' && (
                                 <>
                                   <table className="text-sm border border-blue-200 rounded mb-2 w-full">
                                     <tbody>
                                       <tr><td className="px-2 py-1 font-semibold">MPO Line Key Date</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="date" value={mpoForm?.['MPO Line Key Date'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'MPO Line Key Date': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['MPO Line Key Date']}</td></tr>
                                       <tr><td className="px-2 py-1 font-semibold">Template</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Template'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Template': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Template']}</td></tr>
                                       <tr><td className="px-2 py-1 font-semibold">Purchasing</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Purchasing'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Purchasing': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="In Progress">In Progress</option><option value="Completed">Completed</option><option value="Pending">Pending</option></select> : row['Purchasing']}</td></tr>
                                     </tbody>
                                   </table>
                                   <div className="flex gap-2 mt-2">
                                     {mpoEditIdx === idx ? (
                                       <>
                                         <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => {
                                           const newRows = [...(filteredRows ?? rows)];
                                           newRows[idx] = { ...row, ...mpoForm };
                                           if (filteredRows) {
                                             const mainRows = [...rows];
                                             const idxInMain = rows.indexOf(filteredRows[idx]);
                                             mainRows[idxInMain] = { ...row, ...mpoForm };
                                             setRows(mainRows);
                                             setFilteredRows(newRows);
                                           } else {
                                             setRows(newRows);
                                           }
                                           setMpoEditIdx(null);
                                           setMpoForm(null);
                                         }}>Save</button>
                                         <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(null); setMpoForm(null); }}>Cancel</button>
                                       </>
                                     ) : (
                                       <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(idx); setMpoForm({ ...row }); }}>Edit</button>
                                     )}
                                   </div>
                                 </>
                               )}
                              
                                                             {activeTab === 'Special Instructions' && (
                                 <>
                                   <table className="text-sm border border-blue-200 rounded mb-2 w-full">
                                     <tbody>
                                       <tr><td className="px-2 py-1 font-semibold">Comments</td><td className="px-2 py-1">{mpoEditIdx === idx ? <textarea value={mpoForm?.['Comments'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Comments': e.target.value}))} className="border px-1 py-0.5 rounded w-full h-20 resize-none" /> : row['Comments']}</td></tr>
                                     </tbody>
                                   </table>
                                   <div className="flex gap-2 mt-2">
                                     {mpoEditIdx === idx ? (
                                       <>
                                         <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => {
                                           const newRows = [...(filteredRows ?? rows)];
                                           newRows[idx] = { ...row, ...mpoForm };
                                           if (filteredRows) {
                                             const mainRows = [...rows];
                                             const idxInMain = rows.indexOf(filteredRows[idx]);
                                             mainRows[idxInMain] = { ...row, ...mpoForm };
                                             setRows(mainRows);
                                             setFilteredRows(newRows);
                                           } else {
                                             setRows(newRows);
                                           }
                                           setMpoEditIdx(null);
                                           setMpoForm(null);
                                         }}>Save</button>
                                         <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(null); setMpoForm(null); }}>Cancel</button>
                                       </>
                                     ) : (
                                       <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(idx); setMpoForm({ ...row }); }}>Edit</button>
                                     )}
                                   </div>
                                 </>
                               )}
                              
                                                             {activeTab === 'Delivery Details' && (
                                 <>
                                   <table className="text-sm border border-blue-200 rounded mb-2 w-full">
                                     <tbody>
                                       <tr><td className="px-2 py-1 font-semibold">Deliver To</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Deliver To'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Deliver To': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Deliver To']}</td></tr>
                                       <tr><td className="px-2 py-1 font-semibold">Customer</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Customer'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Customer': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Customer']}</td></tr>
                                       <tr><td className="px-2 py-1 font-semibold">Delivery Date</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="date" value={mpoForm?.['Delivery Date'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Delivery Date': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Delivery Date']}</td></tr>
                                     </tbody>
                                   </table>
                                   <div className="flex gap-2 mt-2">
                                     {mpoEditIdx === idx ? (
                                       <>
                                         <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => {
                                           const newRows = [...(filteredRows ?? rows)];
                                           newRows[idx] = { ...row, ...mpoForm };
                                           if (filteredRows) {
                                             const mainRows = [...rows];
                                             const idxInMain = rows.indexOf(filteredRows[idx]);
                                             mainRows[idxInMain] = { ...row, ...mpoForm };
                                             setRows(mainRows);
                                             setFilteredRows(newRows);
                                           } else {
                                             setRows(newRows);
                                           }
                                           setMpoEditIdx(null);
                                           setMpoForm(null);
                                         }}>Save</button>
                                         <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(null); setMpoForm(null); }}>Cancel</button>
                                       </>
                                     ) : (
                                       <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(idx); setMpoForm({ ...row }); }}>Edit</button>
                                     )}
                                   </div>
                                 </>
                               )}
                              
                                                             {activeTab === 'Activities' && (
                                 <>
                                   <div className="text-sm border border-blue-200 rounded mb-2 w-full p-4">
                                     <div className="text-gray-500">No activities available</div>
                                   </div>
                                   <div className="flex gap-2 mt-2">
                                     {mpoEditIdx === idx ? (
                                       <>
                                         <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => {
                                           const newRows = [...(filteredRows ?? rows)];
                                           newRows[idx] = { ...row, ...mpoForm };
                                           if (filteredRows) {
                                             const mainRows = [...rows];
                                             const idxInMain = rows.indexOf(filteredRows[idx]);
                                             mainRows[idxInMain] = { ...row, ...mpoForm };
                                             setRows(mainRows);
                                             setFilteredRows(newRows);
                                           } else {
                                             setRows(newRows);
                                           }
                                           setMpoEditIdx(null);
                                           setMpoForm(null);
                                         }}>Save</button>
                                         <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(null); setMpoForm(null); }}>Cancel</button>
                                       </>
                                     ) : (
                                       <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(idx); setMpoForm({ ...row }); }}>Edit</button>
                                     )}
                                   </div>
                                 </>
                               )}
                            </div>
                          </div>
                        )}
                        {expanded.col === 'Material' && (
                          <div className="bg-green-50 px-6 py-4">
                            <div className="flex justify-between items-center mb-4">
                              <div className="font-semibold text-green-700">Material Details</div>
                            </div>
                            
                            {/* Horizontal Tabs */}
                            <div className="mb-4 flex gap-2 border-b border-green-200">
                              {['Material Detail', 'Swatch', 'Critical Path', 'Audit', 'Supplier Profile', 'Colors'].map(tab => (
                                <button
                                  key={tab}
                                  className={`px-4 py-2 -mb-px rounded-t font-medium transition-colors border-b-2 ${activeTab === tab ? 'bg-white border-green-500 text-green-700' : 'bg-green-50 border-transparent text-gray-600 hover:text-green-600'}`}
                                  onClick={() => setActiveTab(tab)}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>
                            
                            {/* Tab Content */}
                            <div className="max-w-4xl w-full">
                              {activeTab === 'Material Detail' && (
                                <>
                                  <table className="text-sm border border-green-200 rounded mb-2 w-full">
                                    <tbody>
                                      <tr><td className="px-2 py-1 font-semibold">Material</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Material'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Material': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Material']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Material Type</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Material Type'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Material Type': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="Fabric">Fabric</option><option value="Trims">Trims</option><option value="Hardware">Hardware</option><option value="Packaging">Packaging</option><option value="Labels">Labels</option></select> : row['Material Type']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Material Sub Type</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Material Sub Type'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Material Sub Type': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="Cotton">Cotton</option><option value="Polyester">Polyester</option><option value="Zippers">Zippers</option><option value="Buttons">Buttons</option><option value="Tags">Tags</option></select> : row['Material Sub Type']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Material Description</td><td className="px-2 py-1">{mpoEditIdx === idx ? <textarea value={mpoForm?.['Material Description'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Material Description': e.target.value}))} className="border px-1 py-0.5 rounded w-full h-20 resize-none" /> : row['Material Description']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Material Status</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Material Status'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Material Status': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Discontinued">Discontinued</option><option value="New">New</option><option value="Pending">Pending</option></select> : row['Material Status']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Material Buyer Style Name</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Material Buyer Style Name'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Material Buyer Style Name': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Material Buyer Style Name']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Material Buyer Style Number</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Material Buyer Style Number'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Material Buyer Style Number': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Material Buyer Style Number']}</td></tr>
                                    </tbody>
                                  </table>
                                  <div className="flex gap-2 mt-2">
                                    {mpoEditIdx === idx ? (
                                      <>
                                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => {
                                          const newRows = [...(filteredRows ?? rows)];
                                          newRows[idx] = { ...row, ...mpoForm };
                                          if (filteredRows) {
                                            const mainRows = [...rows];
                                            const idxInMain = rows.indexOf(filteredRows[idx]);
                                            mainRows[idxInMain] = { ...row, ...mpoForm };
                                            setRows(mainRows);
                                            setFilteredRows(newRows);
                                          } else {
                                            setRows(newRows);
                                          }
                                          setMpoEditIdx(null);
                                          setMpoForm(null);
                                        }}>Save</button>
                                        <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(null); setMpoForm(null); }}>Cancel</button>
                                      </>
                                    ) : (
                                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(idx); setMpoForm({ ...row }); }}>Edit</button>
                                    )}
                                  </div>
                                </>
                              )}
                              
                              {activeTab === 'Swatch' && (
                                <>
                                  <table className="text-sm border border-green-200 rounded mb-2 w-full">
                                    <tbody>
                                      <tr><td className="px-2 py-1 font-semibold">Color</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Color'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Color': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Color']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Size</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Size'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Size': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="XS">XS</option><option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option><option value="One Size">One Size</option></select> : row['Size']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Composition</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Composition'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Composition': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Composition']}</td></tr>
                                    </tbody>
                                  </table>
                                  <div className="flex gap-2 mt-2">
                                    {mpoEditIdx === idx ? (
                                      <>
                                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => {
                                          const newRows = [...(filteredRows ?? rows)];
                                          newRows[idx] = { ...row, ...mpoForm };
                                          if (filteredRows) {
                                            const mainRows = [...rows];
                                            const idxInMain = rows.indexOf(filteredRows[idx]);
                                            mainRows[idxInMain] = { ...row, ...mpoForm };
                                            setRows(mainRows);
                                            setFilteredRows(newRows);
                                          } else {
                                            setRows(newRows);
                                          }
                                          setMpoEditIdx(null);
                                          setMpoForm(null);
                                        }}>Save</button>
                                        <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(null); setMpoForm(null); }}>Cancel</button>
                                      </>
                                    ) : (
                                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(idx); setMpoForm({ ...row }); }}>Edit</button>
                                    )}
                                  </div>
                                </>
                              )}
                              
                              {activeTab === 'Critical Path' && (
                                <>
                                  <table className="text-sm border border-green-200 rounded mb-2 w-full">
                                    <tbody>
                                      <tr><td className="px-2 py-1 font-semibold">Order Lead Time</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="number" value={mpoForm?.['Order Lead Time'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Order Lead Time': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Order Lead Time']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Minimum Order Quantity</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="number" value={mpoForm?.['Minimum Order Quantity'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Minimum Order Quantity': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Minimum Order Quantity']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Minimum Colour Quantity</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="number" value={mpoForm?.['Minimum Colour Quantity'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Minimum Colour Quantity': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Minimum Colour Quantity']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Order Quantity Increment</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="number" value={mpoForm?.['Order Quantity Increment'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Order Quantity Increment': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Order Quantity Increment']}</td></tr>
                                    </tbody>
                                  </table>
                                  <div className="flex gap-2 mt-2">
                                    {mpoEditIdx === idx ? (
                                      <>
                                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => {
                                          const newRows = [...(filteredRows ?? rows)];
                                          newRows[idx] = { ...row, ...mpoForm };
                                          if (filteredRows) {
                                            const mainRows = [...rows];
                                            const idxInMain = rows.indexOf(filteredRows[idx]);
                                            mainRows[idxInMain] = { ...row, ...mpoForm };
                                            setRows(mainRows);
                                            setFilteredRows(newRows);
                                          } else {
                                            setRows(newRows);
                                          }
                                          setMpoEditIdx(null);
                                          setMpoForm(null);
                                        }}>Save</button>
                                        <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(null); setMpoForm(null); }}>Cancel</button>
                                      </>
                                    ) : (
                                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(idx); setMpoForm({ ...row }); }}>Edit</button>
                                    )}
                                  </div>
                                </>
                              )}
                              
                              {activeTab === 'Audit' && (
                                <>
                                  <table className="text-sm border border-green-200 rounded mb-2 w-full">
                                    <tbody>
                                      <tr><td className="px-2 py-1 font-semibold">Created By</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Created By'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Created By': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Created By']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Created</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="date" value={mpoForm?.['Created'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Created': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Created']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Last Edited By</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Last Edited By'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Last Edited By': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Last Edited By']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Last Edited</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="date" value={mpoForm?.['Last Edited'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Last Edited': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Last Edited']}</td></tr>
                                    </tbody>
                                  </table>
                                  <div className="flex gap-2 mt-2">
                                    {mpoEditIdx === idx ? (
                                      <>
                                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => {
                                          const newRows = [...(filteredRows ?? rows)];
                                          newRows[idx] = { ...row, ...mpoForm };
                                          if (filteredRows) {
                                            const mainRows = [...rows];
                                            const idxInMain = rows.indexOf(filteredRows[idx]);
                                            mainRows[idxInMain] = { ...row, ...mpoForm };
                                            setRows(mainRows);
                                            setFilteredRows(newRows);
                                          } else {
                                            setRows(newRows);
                                          }
                                          setMpoEditIdx(null);
                                          setMpoForm(null);
                                        }}>Save</button>
                                        <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(null); setMpoForm(null); }}>Cancel</button>
                                      </>
                                    ) : (
                                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(idx); setMpoForm({ ...row }); }}>Edit</button>
                                    )}
                                  </div>
                                </>
                              )}
                              
                              {activeTab === 'Supplier Profile' && (
                                <>
                                  <table className="text-sm border border-green-200 rounded mb-2 w-full">
                                    <tbody>
                                      <tr><td className="px-2 py-1 font-semibold">Material Supplier Profile</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Material Supplier Profile'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Material Supplier Profile': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Material Supplier Profile']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Material Supplier Profile Purchase Currency</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Material Supplier Profile Purchase Currency'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Material Supplier Profile Purchase Currency': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="USD">USD</option><option value="EUR">EUR</option><option value="CNY">CNY</option><option value="INR">INR</option></select> : row['Material Supplier Profile Purchase Currency']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Material Supplier Profile Selling Currency</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Material Supplier Profile Selling Currency'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Material Supplier Profile Selling Currency': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="USD">USD</option><option value="EUR">EUR</option><option value="CNY">CNY</option><option value="INR">INR</option></select> : row['Material Supplier Profile Selling Currency']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Supplier Payment Term</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Supplier Payment Term'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Supplier Payment Term': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="Net 30">Net 30</option><option value="Net 60">Net 60</option><option value="Net 90">Net 90</option><option value="Cash on Delivery">Cash on Delivery</option></select> : row['Supplier Payment Term']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Supplier Payment Term Description</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Supplier Payment Term Description'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Supplier Payment Term Description': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Supplier Payment Term Description']}</td></tr>
                                    </tbody>
                                  </table>
                                  <div className="flex gap-2 mt-2">
                                    {mpoEditIdx === idx ? (
                                      <>
                                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => {
                                          const newRows = [...(filteredRows ?? rows)];
                                          newRows[idx] = { ...row, ...mpoForm };
                                          if (filteredRows) {
                                            const mainRows = [...rows];
                                            const idxInMain = rows.indexOf(filteredRows[idx]);
                                            mainRows[idxInMain] = { ...row, ...mpoForm };
                                            setRows(mainRows);
                                            setFilteredRows(newRows);
                                          } else {
                                            setRows(newRows);
                                          }
                                          setMpoEditIdx(null);
                                          setMpoForm(null);
                                        }}>Save</button>
                                        <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(null); setMpoForm(null); }}>Cancel</button>
                                      </>
                                    ) : (
                                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(idx); setMpoForm({ ...row }); }}>Edit</button>
                                    )}
                                  </div>
                                </>
                              )}
                              
                              {activeTab === 'Colors' && (
                                <>
                                  <table className="text-sm border border-green-200 rounded mb-2 w-full">
                                    <tbody>
                                      <tr><td className="px-2 py-1 font-semibold">Color</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Color'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Color': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Color']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Season</td><td className="px-2 py-1">{mpoEditIdx === idx ? <select value={mpoForm?.['Season'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Season': e.target.value}))} className="border px-1 py-0.5 rounded w-full"><option value="Spring">Spring</option><option value="Summer">Summer</option><option value="Fall">Fall</option><option value="Winter">Winter</option><option value="All Season">All Season</option></select> : row['Season']}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold">Collection</td><td className="px-2 py-1">{mpoEditIdx === idx ? <input type="text" value={mpoForm?.['Collection'] || ''} onChange={e => setMpoForm((f: any) => ({...f, 'Collection': e.target.value}))} className="border px-1 py-0.5 rounded w-full" /> : row['Collection']}</td></tr>
                                    </tbody>
                                  </table>
                                  <div className="flex gap-2 mt-2">
                                    {mpoEditIdx === idx ? (
                                      <>
                                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => {
                                          const newRows = [...(filteredRows ?? rows)];
                                          newRows[idx] = { ...row, ...mpoForm };
                                          if (filteredRows) {
                                            const mainRows = [...rows];
                                            const idxInMain = rows.indexOf(filteredRows[idx]);
                                            mainRows[idxInMain] = { ...row, ...mpoForm };
                                            setRows(mainRows);
                                            setFilteredRows(newRows);
                                          } else {
                                            setRows(newRows);
                                          }
                                          setMpoEditIdx(null);
                                          setMpoForm(null);
                                        }}>Save</button>
                                        <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(null); setMpoForm(null); }}>Cancel</button>
                                      </>
                                    ) : (
                                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => { setMpoEditIdx(idx); setMpoForm({ ...row }); }}>Edit</button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        {expanded.col === 'Material Purchase Order Line' && (
                          <div className="p-4">
                            <div className="flex justify-start mb-4">
                              <button 
                                onClick={() => {
                                  const isEditing = editingSection && editingSection.row === idx && editingSection.col === expanded.col;
                                  if (isEditing) {
                                    setEditingSection(null);
                                  } else {
                                    setEditingSection({ row: idx, col: expanded.col, section: 'purchase-order-line' });
                                  }
                                }}
                                className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                                title={editingSection && editingSection.row === idx && editingSection.col === expanded.col ? "Save Changes" : "Edit Purchase Order Line Details"}
                              >
                                {editingSection && editingSection.row === idx && editingSection.col === expanded.col ? "Save" : "Edit"}
                              </button>
                            </div>
                            <div className="font-bold text-purple-900 text-lg mb-4">Purchase Order Line Details</div>
                            <div className="mb-2">
                              <span className="font-semibold">Line:</span> 
                              {editingSection && editingSection.row === idx && editingSection.col === expanded.col ? (
                                <input 
                                  type="text" 
                                  defaultValue={row['Material Purchase Order Line']} 
                                  className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-full"
                                />
                              ) : (
                                <span className="ml-2">{row['Material Purchase Order Line']}</span>
                              )}
                            </div>
                            <div className="mb-2">
                              <span className="font-semibold">Quantity:</span> 
                              {editingSection && editingSection.row === idx && editingSection.col === expanded.col ? (
                                <input 
                                  type="number" 
                                  defaultValue={row['Quantity']} 
                                  className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-full"
                                />
                              ) : (
                                <span className="ml-2">{row['Quantity']}</span>
                              )}
                            </div>
                            <div className="mb-2">
                              <span className="font-semibold">Line Purchase Price:</span> 
                              {editingSection && editingSection.row === idx && editingSection.col === expanded.col ? (
                                <input 
                                  type="text" 
                                  defaultValue={row['Line Purchase Price']} 
                                  className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-full"
                                />
                              ) : (
                                <span className="ml-2">{row['Line Purchase Price']}</span>
                              )}
                            </div>
                            <div className="mb-2">
                              <span className="font-semibold">Line Selling Price:</span> 
                              {editingSection && editingSection.row === idx && editingSection.col === expanded.col ? (
                                <input 
                                  type="text" 
                                  defaultValue={row['Line Selling Price']} 
                                  className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-full"
                                />
                              ) : (
                                <span className="ml-2">{row['Line Selling Price']}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {displayRows.length === 0 && (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="text-center py-4 text-gray-400">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      {/* Edit Modal */}
      <MaterialPurchaseOrderLinesEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
        data={editModalData}
        isNew={isNewEntry}
        allColumns={allColumns}
      />
    </div>
  );
};

export default MaterialPurchaseOrderLines; 