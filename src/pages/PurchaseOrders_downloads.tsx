import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { ChevronDown, ChevronRight, Upload, Edit as EditIcon, Save as SaveIcon, Copy as CopyIcon, Plus, Filter as FilterIcon, Download, X } from 'lucide-react';

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
  'Order', 'Product', 'PO Line', 'Fit Comment', 'Fit Log Status', 'Fit Log Type', 'Fit Log Name', 'Customer', 'Collection', 'Division', 'Group',
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
  ...baseColumns,
  ...groupedColumns.map(g => g.key),
];

const initialRow: Record<string, any> = {
  'Order': 'PO-2024-001',
  'Product': 'Widget X',
  'PO Line': '1',
  'Fit Comment': 'Fits well',
  'Fit Log Status': 'Approved',
  'Fit Log Type': 'Initial',
  'Fit Log Name': 'Spring Fit',
  'Customer': 'Acme Corp',
  'Collection': 'Spring 2024',
  'Division': 'Menswear',
  'Group': 'A',
  'Transport Method': 'Air',
  'Deliver To': 'Warehouse 5',
  'Status': 'Open',
  'Delivery Date': '2024-08-01',
  'Comments': 'Urgent',
  'Quantity': 500,
  'Selling Quantity': 500,
  'Closed Date': '',
  'Line Purchase Price': '$10',
  'Line Selling Price': '$15',
  'Note Count': 1,
  'Latest Note': 'Check delivery',
  'Order Quantity Increment': 50,
  'Order Lead Time': '30 days',
  'Supplier Ref.': 'SUP-123',
  'Template': 'Standard',
  'Ex-Factory': '2024-07-15',
  'Purchase Order Status': 'Confirmed',
  'Supplier Purchase Currency': 'USD',
  'Customer Selling Currency': 'EUR',
  'Supplier': 'Best Supplier',
  'Purchase Currency': 'USD',
  'Selling Currency': 'EUR',
  'Minimum Order Quantity': 100,
  'Purchase Description': 'Cotton T-shirt',
  'Product Type': 'Apparel',
  'Product Sub Type': 'T-shirt',
  'Product Status': 'Active',
  'Product Buyer Style Name': 'Classic Tee',
  'Product Buyer Style Number': 'CT-2024',
  'Standard Minute Value': 12,
  'Costing': '$8',
  'Costong Purchase Currency': 'USD',
  'Costing Selling Currency': 'EUR',
  'Costing Status': 'Final',
  'Supplier Payment Term': 'Net 30',
  'Supplier Payment Term Description': '30 days',
  'Order Purchase Payment Term': 'Net 30',
  'Order Purchase Payment Term Description': '30 days',
  'Product Supplier Purchase Payment Term': 'Net 30',
  'Product Supplier Purhcase Payment Term Description': '30 days',
  'Order Selling Payment Term': 'Net 60',
  'Order Selling Payment Term Description': '60 days',
  'Product Supplier Selling Payment Term': 'Net 60',
  'Product Supplier Selling Payment Term Description': '60 days',
  'Purchase Price': '$10',
  'Selling Price': '$15',
  'Production': 'In Progress',
  'MLA-Purchasing': 'Jane Smith',
  'China-QC': 'Passed',
  'MLA-Planning': 'Planned',
  'MLA-Shipping': 'Pending',
  'PO Key User 6': 'User6',
  'PO Key User 7': 'User7',
  'PO Key User 8': 'User8',
  'Season': 'Spring',
  'Department': 'Production',
  'Customer Parent': 'Acme Group',
  'RECIPIENT PRODUCT SUPPLIER-NUMBER': 'RPS-001',
  'FG PO Number': 'FG-2024-001',
  'Received': 0,
  'Balance': 500,
  'Over Received': 0,
  'Size': 'L',
  'Main Material': 'Cotton',
  'Main Material Description': '100% Cotton',
  'Delivery Contact': 'John Doe',
  'PO Key Working Group 1': 'WG1',
  'PO Key Working Group 2': 'WG2',
  'PO Key Working Group 3': 'WG3',
  'PO Key Working Group 4': 'WG4',
  'Created By': 'Admin',
  'Last Edited': '2024-06-30',
  'Last Edited By': 'Editor',
  'Color': 'Blue',
  'Vessel Schedule': 'VS-2024',
  'Buyer PO Number': 'BPO-2024-001',
  'Shipment ID': 'SHIP-001',
  'Factory Invoiced': 'No',
  'Supplier Invoice': 'INV-001',
  'QuickBooks Invoice': 'QB-001',
  'Shipment Noted': 'No',
  'Buy Information': 'Standard',
  'Handling Charges': '$50',
  'Original Forecasts Quantity': 500,
  'Start Date': '2024-06-01',
  'Cancelled Date': '',
  'Factory Date Paid': '',
  'Date Invoice Raised': '',
  'Submitted Inspection Date': '',
  'Remarks': '',
  'Inspection Results': '',
  'Report Type': '',
  'Inspector': '',
  'Approval Status': '',
  'Shipment Status': '',
  'QC Comment': '',
  'Delay Shipment Code': '',
  'Discount Percentage': '',
  'SELL INC COMM': '',
  'Buyer Surcharge': '',
  'Buyer Surchage Percentage': '',
  'MOQ': '',
  'Discount Cost': '',
  'Factory Surcharge': '',
  'Factory Surchage Percentage': '',
  'Buyer Season': 'Spring',
  'Lookbook': '',
  'Finished Good Testing Status': '',
  // Grouped columns
  ...groupedColumns.reduce((acc, g) => {
    acc[g.key] = { 'Target Date': '2024-07-01', 'Completed Date': '2024-07-10' };
    return acc;
  }, {} as Record<string, any>),
};

const blankRow: Record<string, any> = Object.fromEntries([
  ...baseColumns.map(col => [col, '']),
  ...groupedColumns.map(g => [g.key, { 'Target Date': '', 'Completed Date': '' }]),
]);

const statusOptions = [
  { label: 'Confirmed', value: 'Confirmed', color: 'bg-green-400' },
  { label: 'Forecast', value: 'Forecast', color: 'bg-black' },
  { label: 'Provisional', value: 'Provisional', color: 'bg-orange-400' },
];

const PurchaseOrders: React.FC = () => {
  // Fix: Always ensure rows is an array of objects
  const [rows, setRows] = useState<Record<string, any>[]>([initialRow]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<Record<string, any> | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [filteredRows, setFilteredRows] = useState<typeof rows | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Add state for PO Details edit mode and form
  const [poDetailsEditIdx, setPoDetailsEditIdx] = useState<number | null>(null);
  const [poDetailsForm, setPoDetailsForm] = useState<Record<string, any> | null>(null);

  // Add state for Delivery edit mode and form
  const [deliveryEdit, setDeliveryEdit] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState<Record<string, any> | null>(null);

  // Add state for Critical Path edit mode and form
  const [criticalPathEdit, setCriticalPathEdit] = useState(false);
  const [criticalPathForm, setCriticalPathForm] = useState<Record<string, any> | null>(null);

  // Add state for Audit edit mode and form
  const [auditEdit, setAuditEdit] = useState(false);
  const [auditForm, setAuditForm] = useState<Record<string, any> | null>(null);

  // Add state for Comments edit mode and form
  const [commentsEdit, setCommentsEdit] = useState(false);
  const [commentsValue, setCommentsValue] = useState<string>('');

  // Add state for Totals edit mode and form
  const [totalsEdit, setTotalsEdit] = useState(false);
  const [totalsForm, setTotalsForm] = useState<Record<string, any> | null>(null);

  // Add state for status dropdown
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Add subtable edit state
  const [subEditIdx, setSubEditIdx] = useState<number | null>(null);
  const [subEditTab, setSubEditTab] = useState<string>('');
  const [subEditRow, setSubEditRow] = useState<Record<string, any> | null>(null);

  // Delivery tab state and fields
  const [delivery, setDelivery] = useState({
    'Customer': 'ABC Corp',
    'Deliver To': 'Warehouse 1',
    'Transport Method': 'Sea',
  });
  const [deliveryDraft, setDeliveryDraft] = useState(delivery);

  // Critical Path tab state and fields
  const [criticalPath, setCriticalPath] = useState({
    'Template': 'Standard',
    'PO Issue Date': '2024-07-01',
  });
  const [criticalPathDraft, setCriticalPathDraft] = useState(criticalPath);

  // 1. Add state for expanded Product subtable and its edit state:
  const [expandedProductIndex, setExpandedProductIndex] = useState<number | null>(null);
  const [productEdit, setProductEdit] = useState(false);
  const [productForm, setProductForm] = useState<any>(null);
  // Add state for Product subtable tab
  const [productEditTab, setProductEditTab] = useState('Product Details');
  // Add state for Tech Packs subtable tab
  const [techPacksEditTab, setTechPacksEditTab] = useState('Tech Pack Version');
  // Add state for Tech Pack Version edit mode and form
  const [techPackVersionEdit, setTechPackVersionEdit] = useState(false);
  const [techPackVersionForm, setTechPackVersionForm] = useState<any>(null);
  const [fibreCompositionEdit, setFibreCompositionEdit] = useState(false);
  const [fibreCompositionForm, setFibreCompositionForm] = useState<any>(null);
  // Add state for Product Images Table edit mode and form
  const [productImagesEdit, setProductImagesEdit] = useState(false);
  const [productImagesForm, setProductImagesForm] = useState<any>(null);

  // Add state for Product Critical Path edit mode and form
  const [productCriticalEdit, setProductCriticalEdit] = useState(false);
  const [productCriticalForm, setProductCriticalForm] = useState<any>(null);

  // Add state for Product Comments Table edit mode and form
  const [productCommentsEdit, setProductCommentsEdit] = useState(false);
  const [productCommentsForm, setProductCommentsForm] = useState<any>(null);

  // Bill Of Materials fields
  const bomFields = [
    'BOM Lines',
    'Bill of Material Line Ref.',
    'Bill Of Material category',
    'Comment',
    'Custom Text 1',
    'Custom Text 2',
    'Custom Text 3',
    'Custom Text 4',
    'Material',
    'Material Description',
    'Season',
    'Main Material',
    'Category Sequence',
    'Default Material Color',
    'Composition',
  ];
  // Add state for Product BOM Table edit mode and form
  const [productBOMEdit, setProductBOMEdit] = useState(false);
  const [productBOMForm, setProductBOMForm] = useState<any[]>([]);

  // Add state for Product Activities Table edit mode and form
  const [productActivitiesEdit, setProductActivitiesEdit] = useState(false);
  const [productActivitiesForm, setProductActivitiesForm] = useState<any[]>([]);

  // Add state for Product Colorways Table edit mode and form
  const [productColorwaysEdit, setProductColorwaysEdit] = useState(false);
  const [productColorwaysForm, setProductColorwaysForm] = useState<any[]>([]);



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
            setRows(mappedRows.length ? mappedRows : [initialRow]);
    } else {
            setRows([initialRow]);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleEdit = () => {
    setEditIndex(selectedIndex);
    setEditRow({ ...(rows[selectedIndex] || blankRow) });
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const newRows = [...rows];
      newRows[editIndex] = editRow || blankRow;
      setRows(newRows);
      setEditIndex(null);
      setEditRow(blankRow);
    }
  };

  const handleCopy = () => {
    if (editIndex !== null) {
      const newRows = [...rows];
      newRows.push(newRows[editIndex]);
      setRows(newRows);
    }
  };

  const handleAdd = () => {
    setEditIndex(rows.length);
    setEditRow(blankRow);
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
    const firstRow = cols.map((col, i) => {
      let stickyClass = '';
      if (col.key === 'Order') {
        stickyClass = 'sticky left-0 bg-white z-20';
      } else if (col.key === 'Product') {
        stickyClass = 'sticky left-12 bg-white z-20';
      }
      
      return col.isGroup ? (
        <th key={`${col.key}-group-${i}`} colSpan={2} className={`px-2 py-1 border-b text-center whitespace-nowrap ${stickyClass}${i < cols.length - 1 ? ' border-r-2 border-gray-200' : ''}`}>{col.label}</th>
      ) : (
                                <th key={`${col.key}-single-${i}`} rowSpan={2} className={`px-2 py-1 border-b text-left whitespace-nowrap align-middle ${stickyClass}${i < cols.length - 1 ? ' border-r-2 border-gray-200' : ''}`}>{col.label}</th>
      );
    });
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
  const displayRows = (filteredRows && filteredRows.length ? filteredRows : rows && rows.length ? rows : [initialRow]);

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

  // Fix: handleChange for inline editing
  const handleChange = (key: string, value: string, subKey?: string) => {
    if (editIndex === null || !editRow) return;
    if (subKey) {
      setEditRow((prev) => prev ? { ...prev, [key]: { ...(prev[key] || {}), [subKey]: value } } : prev);
    } else {
      setEditRow((prev) => prev ? { ...prev, [key]: value } : prev);
    }
  };

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
      <div className="flex flex-wrap items-center mb-4 gap-2 relative">
        <h1 className="text-2xl font-bold mr-4">Purchase Orders Lines</h1>
        <button className="bg-blue-700 text-white px-3 py-1 rounded mr-2 flex items-center gap-1" onClick={handleImportClick}>
          <Upload className="w-4 h-4 mr-1" /> Import
        </button>
          <input
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2 flex items-center gap-1" onClick={handleEdit} disabled={editIndex !== null || displayRows.length === 0}>
          <EditIcon className="w-4 h-4 mr-1" /> Edit
        </button>
        <button className="bg-green-500 text-white px-3 py-1 rounded mr-2 flex items-center gap-1" onClick={handleSave} disabled={editIndex === null}>
          <SaveIcon className="w-4 h-4 mr-1" /> Save
        </button>
        <button className="bg-gray-500 text-white px-3 py-1 rounded mr-2 flex items-center gap-1" onClick={handleCopy} disabled={displayRows.length === 0}>
          <CopyIcon className="w-4 h-4 mr-1" /> Copy
        </button>
        <button className="bg-purple-500 text-white px-3 py-1 rounded mr-2 flex items-center gap-1" onClick={handleAdd} disabled={editIndex !== null}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </button>
        <button className="bg-indigo-500 text-white px-3 py-1 rounded mr-2 flex items-center gap-1" onClick={() => setShowColumnSelector(v => !v)}>
          <FilterIcon className="w-4 h-4 mr-1" /> Filter Columns
        </button>
        <button className="bg-green-700 text-white px-3 py-1 rounded mr-2 flex items-center gap-1" onClick={handleExport} disabled={displayRows.length === 0}>
          <Download className="w-4 h-4 mr-1" /> Export to XLSX
        </button>
        {showColumnSelector && (
          <div className="absolute z-10 bg-white border rounded shadow p-3 top-12 left-0 max-h-72 overflow-y-auto w-64">
            <div className="font-bold mb-2">Select Columns</div>
            <input
              type="text"
              className="border px-2 py-1 rounded text-xs mb-2 w-full"
              placeholder="Search columns..."
              value={columnSearch}
              onChange={e => setColumnSearch(e.target.value)}
            />
            <div className="flex gap-2 mb-2">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                onClick={() => {
                  // Add all filtered columns to visibleColumns (preserve order)
                  setVisibleColumns(prev => {
                    const newCols = [...prev, ...filteredColumnList.filter(col => !prev.includes(col))];
                    return allColumns.filter(c => newCols.includes(c));
                  });
                }}
              >Select All</button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                onClick={() => {
                  // Remove all filtered columns from visibleColumns
                  setVisibleColumns(prev => prev.filter(col => !filteredColumnList.includes(col)));
                }}
              >Deselect All</button>
            </div>
            {filteredColumnList.length === 0 ? (
              <div className="text-xs text-gray-400 px-2 py-4">No columns found.</div>
            ) : (
              filteredColumnList.map(col => (
                <label key={col} className="flex items-center mb-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col)}
                    onChange={() => handleColumnToggle(col)}
                    className="mr-2"
                  />
                  <span className="text-xs">{col}</span>
                </label>
              ))
            )}
            <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded w-full" onClick={() => setShowColumnSelector(false)}>Close</button>
          </div>
        )}
            <input
          className="border px-2 py-1 rounded text-xs mr-2"
              type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleFilter(); }}
          style={{ minWidth: 120 }}
        />
        <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 flex items-center gap-1" onClick={handleFilter}>
          <FilterIcon className="w-4 h-4 mr-1" /> Filter
        </button>
        <button className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1" onClick={handleClear} disabled={!search && !filteredRows}>
          <X className="w-4 h-4 mr-1" /> Clear
        </button>
          </div>
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
              <React.Fragment key={`row-${idx}-${row.Order || row.Balance || idx}`}>
                <tr
                  className={
                    (selectedIndex === idx ? 'bg-blue-50 ' : '') +
                    (editIndex === idx ? 'bg-yellow-50' : '')
                  }
                  onClick={() => setSelectedIndex(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  {renderColumns().flatMap((col, colIdx, arr) => {
                    // Only render columns that are in renderColumns (already filtered by visibleColumns)
                    if (col.key === 'Order' && safeVisibleColumns.includes('Order')) {
                      return [
                        <td key={col.key} className={`px-2 py-1 border-b align-top whitespace-nowrap sticky left-0 bg-white z-10${colIdx < arr.length - 1 ? ' border-r-2 border-gray-200' : ''}`}> 
                          <button 
                            className="mr-2 align-middle"
                            onClick={e => {
                              e.stopPropagation();
                              setExpandedIndex(expandedIndex === idx ? null : idx);
                            }}
                            aria-label={expandedIndex === idx ? 'Collapse details' : 'Expand details'}
                          >
                            {expandedIndex === idx ? <ChevronDown className="inline h-4 w-4" /> : <ChevronRight className="inline h-4 w-4" />}
                          </button>
                          {editIndex === idx ? (
                            <input
                              className="border px-1 py-0.5 rounded w-32 text-xs"
                              value={editRow ? editRow[col.key] : ''}
                              onChange={e => handleChange(col.key, e.target.value)}
                            />
                          ) : (
                            row[col.key] || ''
                          )}
                        </td>
                      ];
                    }
                    // Add Product subtable dropdown
                    if (col.key === 'Product' && safeVisibleColumns.includes('Product')) {
                      return [
                        <td key={col.key} className={`px-2 py-1 border-b align-top whitespace-nowrap sticky left-12 bg-white z-10${colIdx < arr.length - 1 ? ' border-r-2 border-gray-200' : ''}`}> 
                          <button
                            className="mr-2 align-middle"
                            onClick={e => {
                              e.stopPropagation();
                              setExpandedProductIndex(expandedProductIndex === idx ? null : idx);
                            }}
                            aria-label={expandedProductIndex === idx ? 'Collapse product details' : 'Expand product details'}
                          >
                            {expandedProductIndex === idx ? <ChevronDown className="inline h-4 w-4" /> : <ChevronRight className="inline h-4 w-4" />}
                          </button>
                          {editIndex === idx ? (
                            <input
                              className="border px-1 py-0.5 rounded w-32 text-xs"
                              value={editRow ? editRow[col.key] : ''}
                              onChange={e => handleChange(col.key, e.target.value)}
                            />
                          ) : (
                            row[col.key] || ''
                          )}
                        </td>
                      ];
                    }
                    if (col.isGroup) {
                      return col.children!.map((subCol, subIdx) => (
                        <td
                          key={`${col.key}-${subCol}-${idx}`}
                          className={
                            `px-2 py-1 border-b align-top whitespace-nowrap` +
                            ((subIdx === 0 || subCol === 'Target Date') ? ' border-r-2 border-gray-200' : '') +
                            (colIdx === arr.length - 1 && subCol === 'Completed Date' ? '' : '')
                          }
                        >
                          {editIndex === idx ? (
                            <input
                              className="border px-1 py-0.5 rounded w-32 text-xs"
                              value={editRow ? editRow[col.key]?.[subCol] || '' : ''}
                              onChange={e => handleChange(col.key, e.target.value, subCol)}
                            />
                          ) : (
                            row[col.key]?.[subCol] || ''
                          )}
                        </td>
                      ));
                    } else {
                      return [
                        <td key={col.key} className={`px-2 py-1 border-b align-top whitespace-nowrap${colIdx < arr.length - 1 ? ' border-r-2 border-gray-200' : ''}`}>
                          {editIndex === idx ? (
                            <input
                              className="border px-1 py-0.5 rounded w-32 text-xs"
                              value={editRow ? editRow[col.key] : ''}
                              onChange={e => handleChange(col.key, e.target.value)}
                            />
                          ) : (
                            row[col.key] || ''
                          )}
                        </td>
                      ];
                    }
                  })}
                </tr>
                {expandedIndex === idx && safeVisibleColumns.includes('Order') && (
                  <tr>
                    <td colSpan={renderColumns().reduce((acc, col) => acc + (col.isGroup ? 2 : 1), 0)} className="bg-blue-50 px-6 py-4 sticky left-0 z-10">
                      <div>
                        <div className="font-semibold text-blue-700 mb-2">Purchase Order Details</div>
                        {/* Horizontal Tabs */}
                        <div className="mb-4 flex gap-2 border-b border-blue-200">
                          {['PO Details', 'Delivery', 'Critical Path', 'Audit', 'Totals', 'Comments'].map(tab => (
                            <button
                              key={tab}
                              className={`px-4 py-2 -mb-px rounded-t font-medium transition-colors border-b-2 ${activeSubTab === tab ? 'bg-white border-blue-500 text-blue-700' : 'bg-blue-50 border-transparent text-gray-600 hover:text-blue-600'}`}
                              onClick={() => setActiveSubTab(tab)}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                        {/* Subtable Content (mock data) */}
                        <div className="max-w-4xl w-full">
                          {activeSubTab === 'PO Details' && (
                            <>
                              <table className="text-sm border border-blue-200 rounded mb-2 w-full">
                                <tbody>
                                  <tr><td className="px-2 py-1 font-semibold">Order reference</td><td className="px-2 py-1">{poDetailsEditIdx === idx ? poDetailsForm?.['Order reference'] : row['Order']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">Supplier</td><td className="px-2 py-1">{poDetailsEditIdx === idx ? <input className="border px-1 py-0.5 rounded w-full" value={poDetailsForm?.['Supplier'] || ''} onChange={e => setPoDetailsForm(f => ({...f, 'Supplier': e.target.value}))} /> : row['Supplier']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">Purchase Currency</td><td className="px-2 py-1">{poDetailsEditIdx === idx ? <input className="border px-1 py-0.5 rounded w-full" value={poDetailsForm?.['Purchase Currency'] || ''} onChange={e => setPoDetailsForm(f => ({...f, 'Purchase Currency': e.target.value}))} /> : row['Purchase Currency']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">Status</td><td className="px-2 py-1">{poDetailsEditIdx === idx ? (
  <div className="relative">
    <button
      type="button"
      className="w-full border px-2 py-1 rounded flex items-center gap-2 bg-white"
      onClick={() => setShowStatusDropdown(v => !v)}
    >
      <span className={`${statusOptions.find(opt => opt.value === (poDetailsForm?.['Status'] ?? ''))?.color || 'bg-gray-200'} w-4 h-4 inline-block rounded-sm border`}></span>
      <span>{poDetailsForm?.['Status'] || 'Select status'}</span>
      <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
    </button>
    {showStatusDropdown && (
      <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
        {statusOptions.map(opt => (
          <div
            key={opt.value}
            className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-blue-100 ${poDetailsForm?.['Status'] === opt.value ? 'bg-blue-50' : ''}`}
            onClick={() => {
              setPoDetailsForm(f => ({...f, 'Status': opt.value}));
              setShowStatusDropdown(false);
            }}
          >
            <span className={`${opt.color} w-4 h-4 inline-block rounded-sm border`}></span>
            <span>{opt.label}</span>
          </div>
        ))}
      </div>
    )}
  </div>
) : (
  <span className="inline-flex items-center gap-2">
    <span className={`${statusOptions.find(opt => opt.value === row['Status'])?.color || 'bg-gray-200'} w-4 h-4 inline-block rounded-sm border`}></span>
    <span>{row['Status']}</span>
  </span>
)}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">Production</td><td className="px-2 py-1">{poDetailsEditIdx === idx ? <input className="border px-1 py-0.5 rounded w-full" value={poDetailsForm?.['Production'] || ''} onChange={e => setPoDetailsForm(f => ({...f, 'Production': e.target.value}))} /> : row['Production']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">MLA-Purchasing</td><td className="px-2 py-1">{poDetailsEditIdx === idx ? <input className="border px-1 py-0.5 rounded w-full" value={poDetailsForm?.['MLA-Purchasing'] || ''} onChange={e => setPoDetailsForm(f => ({...f, 'MLA-Purchasing': e.target.value}))} /> : row['MLA-Purchasing']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">China-QC</td><td className="px-2 py-1">{poDetailsEditIdx === idx ? <input className="border px-1 py-0.5 rounded w-full" value={poDetailsForm?.['China-QC'] || ''} onChange={e => setPoDetailsForm(f => ({...f, 'China-QC': e.target.value}))} /> : row['China-QC']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">MLA-Planning</td><td className="px-2 py-1">{poDetailsEditIdx === idx ? <input className="border px-1 py-0.5 rounded w-full" value={poDetailsForm?.['MLA-Planning'] || ''} onChange={e => setPoDetailsForm(f => ({...f, 'MLA-Planning': e.target.value}))} /> : row['MLA-Planning']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">MLA-Shipping</td><td className="px-2 py-1">{poDetailsEditIdx === idx ? <input className="border px-1 py-0.5 rounded w-full" value={poDetailsForm?.['MLA-Shipping'] || ''} onChange={e => setPoDetailsForm(f => ({...f, 'MLA-Shipping': e.target.value}))} /> : row['MLA-Shipping']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">Closed Date</td><td className="px-2 py-1">{poDetailsEditIdx === idx ? <input className="border px-1 py-0.5 rounded w-full" value={poDetailsForm?.['Closed Date'] || ''} onChange={e => setPoDetailsForm(f => ({...f, 'Closed Date': e.target.value}))} /> : row['Closed Date']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">Selling Currency</td><td className="px-2 py-1">{poDetailsEditIdx === idx ? <input className="border px-1 py-0.5 rounded w-full" value={poDetailsForm?.['Selling Currency'] || ''} onChange={e => setPoDetailsForm(f => ({...f, 'Selling Currency': e.target.value}))} /> : row['Selling Currency']}</td></tr>
                                </tbody>
                              </table>
                              <div className="flex gap-2 mt-2">
                                {poDetailsEditIdx === idx ? (
                                  <>
                                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                      // Save subtable edits
                                      const newRows = [...rows];
                                      newRows[idx] = { ...row, ...poDetailsForm };
                                      setRows(newRows);
                                      setPoDetailsEditIdx(null);
                                      setPoDetailsForm(null);
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setPoDetailsEditIdx(null); setPoDetailsForm(null); }}>Cancel</button>
                                    <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => { setPoDetailsEditIdx(null); setPoDetailsForm(null); }}>Delete</button>
                                  </>
                                ) : (
                                  <>
                                    <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => { setPoDetailsEditIdx(idx); setPoDetailsForm({ ...row }); }}>Edit</button>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                          {activeSubTab === 'Delivery' && (
                            <>
                              <table className="text-sm border border-blue-200 rounded mb-2 w-full">
                                <tbody>
                                  <tr><td className="px-2 py-1 font-semibold">Customer</td><td className="px-2 py-1">{deliveryEdit ? <input className="border px-1 py-0.5 rounded w-full" value={deliveryForm?.['Customer'] || ''} onChange={e => setDeliveryForm(f => ({...f, 'Customer': e.target.value}))} /> : row['Customer']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">Deliver To</td><td className="px-2 py-1">{deliveryEdit ? <input className="border px-1 py-0.5 rounded w-full" value={deliveryForm?.['Deliver To'] || ''} onChange={e => setDeliveryForm(f => ({...f, 'Deliver To': e.target.value}))} /> : row['Deliver To']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">Transport Method</td><td className="px-2 py-1">{deliveryEdit ? <input className="border px-1 py-0.5 rounded w-full" value={deliveryForm?.['Transport Method'] || ''} onChange={e => setDeliveryForm(f => ({...f, 'Transport Method': e.target.value}))} /> : row['Transport Method']}</td></tr>
                                </tbody>
                              </table>
                              <div className="flex gap-2 mt-2">
                                {deliveryEdit ? (
                                  <>
                                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                      const newRows = [...rows];
                                      newRows[idx] = { ...row, ...deliveryForm };
                                      setRows(newRows);
                                      setDeliveryEdit(false);
                                      setDeliveryForm(null);
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setDeliveryEdit(false); setDeliveryForm(null); }}>Cancel</button>
                                  </>
                                ) : (
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => { setDeliveryEdit(true); setDeliveryForm({ ...row }); }}>Edit</button>
                                )}
                              </div>
                            </>
                          )}
                          {activeSubTab === 'Critical Path' && (
                            <>
                              <table className="text-sm border border-blue-200 rounded mb-2 w-full">
                                <tbody>
                                  <tr><td className="px-2 py-1 font-semibold">Template</td><td className="px-2 py-1">{criticalPathEdit ? <input className="border px-1 py-0.5 rounded w-full" value={criticalPathForm?.['Template'] || ''} onChange={e => setCriticalPathForm(f => ({...f, 'Template': e.target.value}))} /> : row['Template']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">PO Issue Date</td><td className="px-2 py-1">{criticalPathEdit ? <input className="border px-1 py-0.5 rounded w-full" value={criticalPathForm?.['PO Issue Date'] || ''} onChange={e => setCriticalPathForm(f => ({...f, 'PO Issue Date': e.target.value}))} /> : row['PO Issue Date']}</td></tr>
                                </tbody>
                              </table>
                              <div className="flex gap-2 mt-2">
                                {criticalPathEdit ? (
                                  <>
                                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                      const newRows = [...rows];
                                      newRows[idx] = { ...row, ...criticalPathForm };
                                      setRows(newRows);
                                      setCriticalPathEdit(false);
                                      setCriticalPathForm(null);
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setCriticalPathEdit(false); setCriticalPathForm(null); }}>Cancel</button>
                                  </>
                                ) : (
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => { setCriticalPathEdit(true); setCriticalPathForm({ ...row }); }}>Edit</button>
                                )}
                              </div>
                            </>
                          )}
                          {activeSubTab === 'Audit' && (
                            <>
                              <table className="text-sm border border-blue-200 rounded mb-2 w-full">
                                <tbody>
                                  <tr><td className="px-2 py-1 font-semibold">Created By</td><td className="px-2 py-1">{auditEdit ? <input className="border px-1 py-0.5 rounded w-full" value={auditForm?.['Created By'] || ''} onChange={e => setAuditForm(f => ({...f, 'Created By': e.target.value}))} /> : row['Created By']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">Last Edited</td><td className="px-2 py-1">{auditEdit ? <input className="border px-1 py-0.5 rounded w-full" value={auditForm?.['Last Edited'] || ''} onChange={e => setAuditForm(f => ({...f, 'Last Edited': e.target.value}))} /> : row['Last Edited']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">Created</td><td className="px-2 py-1">{auditEdit ? <input className="border px-1 py-0.5 rounded w-full" value={auditForm?.['Created'] || ''} onChange={e => setAuditForm(f => ({...f, 'Created': e.target.value}))} /> : row['Created']}</td></tr>
                                </tbody>
                              </table>
                              <div className="flex gap-2 mt-2">
                                {auditEdit ? (
                                  <>
                                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                      const newRows = [...rows];
                                      newRows[idx] = { ...row, ...auditForm };
                                      setRows(newRows);
                                      setAuditEdit(false);
                                      setAuditForm(null);
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setAuditEdit(false); setAuditForm(null); }}>Cancel</button>
                                  </>
                                ) : (
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => { setAuditEdit(true); setAuditForm({ ...row }); }}>Edit</button>
                                )}
                              </div>
                            </>
                          )}
                          {activeSubTab === 'Totals' && (
                            <>
                              <table className="text-sm border border-blue-200 rounded mb-2 w-full">
                                <tbody>
                                  <tr><td className="px-2 py-1 font-semibold">Total Cost</td><td className="px-2 py-1">{totalsEdit ? <input className="border px-1 py-0.5 rounded w-full" value={totalsForm?.['Total Cost'] || ''} onChange={e => setTotalsForm(f => ({...f, 'Total Cost': e.target.value}))} /> : row['Total Cost']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">Total Qty</td><td className="px-2 py-1">{totalsEdit ? <input className="border px-1 py-0.5 rounded w-full" value={totalsForm?.['Total Qty'] || ''} onChange={e => setTotalsForm(f => ({...f, 'Total Qty': e.target.value}))} /> : row['Total Qty']}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold">Total Value</td><td className="px-2 py-1">{totalsEdit ? <input className="border px-1 py-0.5 rounded w-full" value={totalsForm?.['Total Value'] || ''} onChange={e => setTotalsForm(f => ({...f, 'Total Value': e.target.value}))} /> : row['Total Value']}</td></tr>
                                </tbody>
                              </table>
                              <div className="flex gap-2 mt-2">
                                {totalsEdit ? (
                                  <>
                                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                      const newRows = [...rows];
                                      newRows[idx] = { ...row, ...totalsForm };
                                      setRows(newRows);
                                      setTotalsEdit(false);
                                      setTotalsForm(null);
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setTotalsEdit(false); setTotalsForm(null); }}>Cancel</button>
                                  </>
                                ) : (
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => { setTotalsEdit(true); setTotalsForm({ ...row }); }}>Edit</button>
                                )}
                              </div>
                            </>
                          )}
                          {activeSubTab === 'Comments' && (
                            <>
                              <div className="mb-2">
                                <div className="px-2 py-1 bg-white rounded border border-blue-100 min-h-[80px]">
                                  {commentsEdit ? (
                                    <textarea
                                      className="border px-1 py-0.5 rounded w-full min-h-[80px]"
                                      value={commentsValue || ''}
                                      onChange={e => setCommentsValue(e.target.value)}
                                    />
                                  ) : (
                                    row['Latest Note'] || <span className='text-gray-400'>No comment</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {commentsEdit ? (
                                  <>
                                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                      const newRows = [...rows];
                                      newRows[idx] = { ...row, 'Latest Note': commentsValue };
                                      setRows(newRows);
                                      setCommentsEdit(false);
                                      setCommentsValue('');
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setCommentsEdit(false); setCommentsValue(''); }}>Cancel</button>
                                  </>
                                ) : (
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => { setCommentsEdit(true); setCommentsValue(row['Latest Note'] || ''); }}>Edit</button>
                                )}
                              </div>
                            </>
                          )}
                                                </div>
                      </div>
                      

                    </td>
                  </tr>
                )}
                {expandedProductIndex === idx && safeVisibleColumns.includes('Product') && (
                  <tr>
                    <td colSpan={renderColumns().reduce((acc, col) => acc + (col.isGroup ? 2 : 1), 0)} className="bg-blue-50 px-6 py-4 sticky left-0 z-10">
                      <div>
                        <div className="font-semibold text-blue-700 mb-2">Product Details</div>
                        {/* Product subtable tabs */}
                        <div className="mb-4 flex gap-2 border-b border-blue-200">
                          {(['Product Details', 'Critical Path', 'Images', 'Comments', 'Bill Of Materials', 'Activities', 'Colorways'] as string[]).map((tab: string) => (
                            <button
                              key={tab}
                              className={`px-4 py-2 -mb-px rounded-t font-medium transition-colors border-b-2 ${productEditTab === tab ? 'bg-white border-blue-500 text-blue-700' : 'bg-blue-50 border-transparent text-gray-600 hover:text-blue-600'}`}
                              onClick={() => setProductEditTab(tab)}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                        {/* Product Details Tab */}
                        {(!productEditTab || productEditTab === 'Product Details') && (
                          <div className="inline-block">
                            <table className="text-sm border border-blue-200 rounded mb-2 table-fixed">
                              <tbody>
                                <tr><td className="px-2 py-1 font-semibold w-32">M88 Ref</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['M88 Ref'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'M88 Ref': e.target.value}))} /> : row['M88 Ref'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Buyer Style Number</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['Product Buyer Style Number'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'Product Buyer Style Number': e.target.value}))} /> : row['Product Buyer Style Number'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Buyer Style Name</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['Product Buyer Style Name'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'Product Buyer Style Name': e.target.value}))} /> : row['Product Buyer Style Name'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Customer</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['Customer'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'Customer': e.target.value}))} /> : row['Customer'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Department</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['Department'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'Department': e.target.value}))} /> : row['Department'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Status</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['Product Status'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'Product Status': e.target.value}))} /> : row['Product Status'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Description</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['Purchase Description'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'Purchase Description': e.target.value}))} /> : row['Purchase Description'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Product Type</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['Product Type'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'Product Type': e.target.value}))} /> : row['Product Type'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Season</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['Season'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'Season': e.target.value}))} /> : row['Season'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Product Development</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['Product Development'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'Product Development': e.target.value}))} /> : row['Product Development'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Tech Design</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['Tech Design'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'Tech Design': e.target.value}))} /> : row['Tech Design'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">China - QC</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['China-QC'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'China-QC': e.target.value}))} /> : row['China-QC'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Lookbook</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['Lookbook'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'Lookbook': e.target.value}))} /> : row['Lookbook'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Supplier</td><td className="px-2 py-1">{productEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productForm?.['Supplier'] || ''} onChange={e => setProductForm((f: any) => ({...f, 'Supplier': e.target.value}))} /> : row['Supplier'] || ''}</td></tr>
                              </tbody>
                            </table>
                            <div className="flex gap-2 mt-2">
                              {productEdit ? (
                                <>
                                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                    const newRows = [...rows];
                                    newRows[idx] = { ...row, ...productForm };
                                    setRows(newRows);
                                    setProductEdit(false);
                                    setProductForm(null);
                                  }}>Save</button>
                                  <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setProductEdit(false); setProductForm(null); }}>Cancel</button>
                                </>
                              ) : (
                                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => { setProductEdit(true); setProductForm({
                                  'M88 Ref': row['M88 Ref'] || '',
                                  'Product Buyer Style Number': row['Product Buyer Style Number'] || '',
                                  'Product Buyer Style Name': row['Product Buyer Style Name'] || '',
                                  'Customer': row['Customer'] || '',
                                  'Department': row['Department'] || '',
                                  'Product Status': row['Product Status'] || '',
                                  'Purchase Description': row['Purchase Description'] || '',
                                  'Product Type': row['Product Type'] || '',
                                  'Season': row['Season'] || '',
                                  'Product Development': row['Product Development'] || '',
                                  'Tech Design': row['Tech Design'] || '',
                                  'China-QC': row['China-QC'] || '',
                                  'Lookbook': row['Lookbook'] || '',
                                  'Supplier': row['Supplier'] || ''
                                }); }}>Edit</button>
                              )}
                            </div>
                            


                          </div>
                        )}
                        {/* Critical Path Tab */}
                        {productEditTab === 'Critical Path' && (
                          <div className="inline-block">
                            <table className="text-sm border border-blue-200 rounded mb-2 table-fixed">
                              <tbody>
                                <tr><td className="px-2 py-1 font-semibold w-32">Template</td><td className="px-2 py-1">{productCriticalEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productCriticalForm?.['Template'] || ''} onChange={e => setProductCriticalForm((f: any) => ({...f, 'Template': e.target.value}))} /> : row['Template'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Receive Tech Pach</td><td className="px-2 py-1">{productCriticalEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productCriticalForm?.['Receive Tech Pach'] || ''} onChange={e => setProductCriticalForm((f: any) => ({...f, 'Receive Tech Pach': e.target.value}))} /> : row['Receive Tech Pach'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Last Edited</td><td className="px-2 py-1">{productCriticalEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productCriticalForm?.['Last Edited'] || ''} onChange={e => setProductCriticalForm((f: any) => ({...f, 'Last Edited': e.target.value}))} /> : row['Last Edited'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Created By</td><td className="px-2 py-1">{productCriticalEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productCriticalForm?.['Created By'] || ''} onChange={e => setProductCriticalForm((f: any) => ({...f, 'Created By': e.target.value}))} /> : row['Created By'] || ''}</td></tr>
                              </tbody>
                            </table>
                            <div className="flex gap-2 mt-2">
                              {productCriticalEdit ? (
                                <>
                                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                    const newRows = [...rows];
                                    newRows[idx] = { ...row, ...productCriticalForm };
                                    setRows(newRows);
                                    setProductCriticalEdit(false);
                                    setProductCriticalForm(null);
                                  }}>Save</button>
                                  <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setProductCriticalEdit(false); setProductCriticalForm(null); }}>Cancel</button>
                                </>
                              ) : (
                                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => { setProductCriticalEdit(true); setProductCriticalForm({
                                  'Template': row['Template'] || '',
                                  'Receive Tech Pach': row['Receive Tech Pach'] || '',
                                  'Last Edited': row['Last Edited'] || '',
                                  'Created By': row['Created By'] || ''
                                }); }}>Edit</button>
                              )}
                            </div>
                          </div>
                        )}
                        {/* Images Tab */}
                        {productEditTab === 'Images' && (
                          <div className="inline-block">
                            <table className="text-sm border border-blue-200 rounded mb-2 table-fixed">
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 font-semibold w-40">Main Photo</th>
                                  <th className="px-2 py-1 font-semibold w-40">Photo 2</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-2 py-1">
                                    {productImagesEdit ? (
                                      <input
                                        className="border px-1 py-0.5 rounded text-sm w-full"
                                        value={productImagesForm?.['Product Main Photo'] || ''}
                                        onChange={e => setProductImagesForm((f: any) => ({...f, 'Product Main Photo': e.target.value}))}
                                        placeholder="Image URL..."
                                      />
                                    ) : (
                                      row['Product Main Photo'] ? (
                                        <a href={row['Product Main Photo']} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{row['Product Main Photo']}</a>
                                      ) : <span className="text-gray-400">No image</span>
                                    )}
                                  </td>
                                  <td className="px-2 py-1">
                                    {productImagesEdit ? (
                                      <input
                                        className="border px-1 py-0.5 rounded text-sm w-full"
                                        value={productImagesForm?.['Product Photo 2'] || ''}
                                        onChange={e => setProductImagesForm((f: any) => ({...f, 'Product Photo 2': e.target.value}))}
                                        placeholder="Image URL..."
                                      />
                                    ) : (
                                      row['Product Photo 2'] ? (
                                        <a href={row['Product Photo 2']} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{row['Product Photo 2']}</a>
                                      ) : <span className="text-gray-400">No image</span>
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <div className="flex gap-2 mt-2">
                              {productImagesEdit ? (
                                <>
                                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                    const newRows = [...rows];
                                    newRows[idx] = { ...row, ...productImagesForm };
                                    setRows(newRows);
                                    setProductImagesEdit(false);
                                    setProductImagesForm(null);
                                  }}>Save</button>
                                  <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setProductImagesEdit(false); setProductImagesForm(null); }}>Cancel</button>
                                </>
                              ) : (
                                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {
                                  setProductImagesEdit(true);
                                  setProductImagesForm({
                                    'Product Main Photo': row['Product Main Photo'] || '',
                                    'Product Photo 2': row['Product Photo 2'] || ''
                                  });
                                }}>Edit</button>
                              )}
                            </div>
                          </div>
                        )}
                        {/* Comments Tab */}
                        {productEditTab === 'Comments' && (
                          <div className="inline-block">
                            <table className="text-sm border border-blue-200 rounded mb-2 table-fixed">
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 font-semibold w-40">Comments</th>
                                  <th className="px-2 py-1 font-semibold w-40">Buyer Comments</th>
                                  <th className="px-2 py-1 font-semibold w-40">Factory Comments</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-2 py-1">
                                    {productCommentsEdit ? (
                                      <textarea
                                        className="border px-1 py-0.5 rounded text-sm w-full min-h-[40px]"
                                        value={productCommentsForm?.['Product Comments'] || ''}
                                        onChange={e => setProductCommentsForm((f: any) => ({...f, 'Product Comments': e.target.value}))}
                                        placeholder="Comments..."
                                      />
                                    ) : (
                                      row['Product Comments'] ? (
                                        <span>{row['Product Comments']}</span>
                                      ) : <span className="text-gray-400">No comments</span>
                                    )}
                                  </td>
                                  <td className="px-2 py-1">
                                    {productCommentsEdit ? (
                                      <textarea
                                        className="border px-1 py-0.5 rounded text-sm w-full min-h-[40px]"
                                        value={productCommentsForm?.['Product Buyer Comments'] || ''}
                                        onChange={e => setProductCommentsForm((f: any) => ({...f, 'Product Buyer Comments': e.target.value}))}
                                        placeholder="Buyer Comments..."
                                      />
                                    ) : (
                                      row['Product Buyer Comments'] ? (
                                        <span>{row['Product Buyer Comments']}</span>
                                      ) : <span className="text-gray-400">No comments</span>
                                    )}
                                  </td>
                                  <td className="px-2 py-1">
                                    {productCommentsEdit ? (
                                      <textarea
                                        className="border px-1 py-0.5 rounded text-sm w-full min-h-[40px]"
                                        value={productCommentsForm?.['Product Factory Comments'] || ''}
                                        onChange={e => setProductCommentsForm((f: any) => ({...f, 'Product Factory Comments': e.target.value}))}
                                        placeholder="Factory Comments..."
                                      />
                                    ) : (
                                      row['Product Factory Comments'] ? (
                                        <span>{row['Product Factory Comments']}</span>
                                      ) : <span className="text-gray-400">No comments</span>
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <div className="flex gap-2 mt-2">
                              {productCommentsEdit ? (
                                <>
                                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                    const newRows = [...rows];
                                    newRows[idx] = { ...row, ...productCommentsForm };
                                    setRows(newRows);
                                    setProductCommentsEdit(false);
                                    setProductCommentsForm(null);
                                  }}>Save</button>
                                  <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setProductCommentsEdit(false); setProductCommentsForm(null); }}>Cancel</button>
                                </>
                              ) : (
                                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {
                                  setProductCommentsEdit(true);
                                  setProductCommentsForm({
                                    'Product Comments': row['Product Comments'] || '',
                                    'Product Buyer Comments': row['Product Buyer Comments'] || '',
                                    'Product Factory Comments': row['Product Factory Comments'] || ''
                                  });
                                }}>Edit</button>
                              )}
                            </div>
                          </div>
                        )}
                        {/* Bill Of Materials Tab */}
                        {productEditTab === 'Bill Of Materials' && (
                          <div className="inline-block max-w-5xl min-w-fit overflow-x-auto sticky left-0 z-10">
                            <table className="text-sm border border-blue-200 rounded my-2 min-w-fit" style={{ marginBottom: '12px' }}>
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 font-semibold">BOM Lines</th>
                                  <th className="px-2 py-1 font-semibold">Bill of Material Line Ref.</th>
                                  <th className="px-2 py-1 font-semibold">Bill Of Material category</th>
                                  <th className="px-2 py-1 font-semibold">Comment</th>
                                  <th className="px-2 py-1 font-semibold">Custom Text 1</th>
                                  <th className="px-2 py-1 font-semibold">Custom Text 2</th>
                                  <th className="px-2 py-1 font-semibold">Custom Text 3</th>
                                  <th className="px-2 py-1 font-semibold">Custom Text 4</th>
                                  <th className="px-2 py-1 font-semibold">Material</th>
                                  <th className="px-2 py-1 font-semibold">Material Description</th>
                                  <th className="px-2 py-1 font-semibold">Season</th>
                                  <th className="px-2 py-1 font-semibold">Main Material</th>
                                  <th className="px-2 py-1 font-semibold">Category Sequence</th>
                                  <th className="px-2 py-1 font-semibold">Default Material Color</th>
                                  <th className="px-2 py-1 font-semibold">Composition</th>
                                  <th className="px-2 py-1 font-semibold">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {((productBOMEdit ? productBOMForm : (row['Product BOM'] || [])) as any[]).map((bom: any, bomIdx: number) => (
                                  <tr key={bomIdx}>
                                    {bomFields.map(field => (
                                      <td className="px-2 py-1" key={field}>
                                        {productBOMEdit ? (
                                          <input
                                            className="border px-1 py-0.5 rounded text-sm w-full"
                                            value={productBOMForm[bomIdx]?.[field] || ''}
                                            onChange={e => {
                                              const updated = [...productBOMForm];
                                              updated[bomIdx] = { ...updated[bomIdx], [field]: e.target.value };
                                              setProductBOMForm(updated);
                                            }}
                                          />
                                        ) : (
                                          bom[field] || ''
                                        )}
                                      </td>
                                    ))}
                                    <td className="px-2 py-1">
                                      {productBOMEdit && (
                                        <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={() => {
                                          const updated = productBOMForm.filter((_: any, i: number) => i !== bomIdx);
                                          setProductBOMForm(updated);
                                        }}>Delete</button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                                {productBOMEdit && (
                                  <tr>
                                    <td colSpan={bomFields.length + 1} className="px-2 py-1">
                                      <button className="bg-green-500 text-white px-3 py-1 rounded mt-2" onClick={() => {
                                        setProductBOMForm(prev => [...prev, Object.fromEntries(bomFields.map(f => [f, '']))]);
                                      }}>Add BOM Line</button>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                            <div className="flex gap-2 mt-2">
                              {productBOMEdit ? (
                                <>
                                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                    const newRows = [...rows];
                                    newRows[idx] = { ...row, 'Product BOM': productBOMForm };
                                    setRows(newRows);
                                    setProductBOMEdit(false);
                                    setProductBOMForm([]);
                                  }}>Save</button>
                                  <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setProductBOMEdit(false); setProductBOMForm([]); }}>Cancel</button>
                                </>
                              ) : (
                                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {
                                  setProductBOMEdit(true);
                                  setProductBOMForm(row['Product BOM'] ? [...row['Product BOM']] : []);
                                }}>Edit</button>
                              )}
                            </div>
                          </div>
                        )}
                        {/* Activities Tab */}
                        {productEditTab === 'Activities' && (
                          <div className="inline-block max-w-3xl min-w-fit overflow-x-auto sticky left-0 z-10">
                            <table className="text-sm border border-blue-200 rounded my-2 min-w-fit" style={{ marginBottom: '12px' }}>
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 font-semibold">EntityName</th>
                                  <th className="px-2 py-1 font-semibold">Overdue</th>
                                  <th className="px-2 py-1 font-semibold">Activity</th>
                                  <th className="px-2 py-1 font-semibold">Target Date</th>
                                  <th className="px-2 py-1 font-semibold">Expected Date</th>
                                  <th className="px-2 py-1 font-semibold">Color</th>
                                  <th className="px-2 py-1 font-semibold">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(productActivitiesEdit ? productActivitiesForm : (row['Product Activities'] || []))?.map((activity: any, actIdx: number) => (
                                  <tr key={actIdx}>
                                    <td className="px-2 py-1">
                                      {productActivitiesEdit ? (
                                        <input
                                          className="border px-1 py-0.5 rounded text-sm w-full"
                                          value={productActivitiesForm[actIdx]?.['EntityName'] || ''}
                                          onChange={e => {
                                            const updated = [...productActivitiesForm];
                                            updated[actIdx] = { ...updated[actIdx], EntityName: e.target.value };
                                            setProductActivitiesForm(updated);
                                          }}
                                        />
                                      ) : (
                                        activity['EntityName'] || ''
                                      )}
                                    </td>
                                    <td className="px-2 py-1">
                                      {productActivitiesEdit ? (
                                        <input
                                          type="checkbox"
                                          checked={!!productActivitiesForm[actIdx]?.['Overdue']}
                                          onChange={e => {
                                            const updated = [...productActivitiesForm];
                                            updated[actIdx] = { ...updated[actIdx], Overdue: e.target.checked };
                                            setProductActivitiesForm(updated);
                                          }}
                                        />
                                      ) : (
                                        activity['Overdue'] ? 'Yes' : 'No'
                                      )}
                                    </td>
                                    <td className="px-2 py-1">
                                      {productActivitiesEdit ? (
                                        <input
                                          className="border px-1 py-0.5 rounded text-sm w-full"
                                          value={productActivitiesForm[actIdx]?.['Activity'] || ''}
                                          onChange={e => {
                                            const updated = [...productActivitiesForm];
                                            updated[actIdx] = { ...updated[actIdx], Activity: e.target.value };
                                            setProductActivitiesForm(updated);
                                          }}
                                        />
                                      ) : (
                                        activity['Activity'] || ''
                                      )}
                                    </td>
                                    <td className="px-2 py-1">
                                      {productActivitiesEdit ? (
                                        <input
                                          type="date"
                                          className="border px-1 py-0.5 rounded text-sm w-full"
                                          value={productActivitiesForm[actIdx]?.['Target Date'] || ''}
                                          onChange={e => {
                                            const updated = [...productActivitiesForm];
                                            updated[actIdx] = { ...updated[actIdx], 'Target Date': e.target.value };
                                            setProductActivitiesForm(updated);
                                          }}
                                        />
                                      ) : (
                                        activity['Target Date'] || ''
                                      )}
                                    </td>
                                    <td className="px-2 py-1">
                                      {productActivitiesEdit ? (
                                        <input
                                          type="date"
                                          className="border px-1 py-0.5 rounded text-sm w-full"
                                          value={productActivitiesForm[actIdx]?.['Expected Date'] || ''}
                                          onChange={e => {
                                            const updated = [...productActivitiesForm];
                                            updated[actIdx] = { ...updated[actIdx], 'Expected Date': e.target.value };
                                            setProductActivitiesForm(updated);
                                          }}
                                        />
                                      ) : (
                                        activity['Expected Date'] || ''
                                      )}
                                    </td>
                                    <td className="px-2 py-1">
                                      {productActivitiesEdit ? (
                                        <input
                                          type="color"
                                          className="w-8 h-6 border rounded"
                                          value={productActivitiesForm[actIdx]?.['Color'] || '#000000'}
                                          onChange={e => {
                                            const updated = [...productActivitiesForm];
                                            updated[actIdx] = { ...updated[actIdx], Color: e.target.value };
                                            setProductActivitiesForm(updated);
                                          }}
                                        />
                                      ) : (
                                        <span style={{ background: activity['Color'] || '#000', display: 'inline-block', width: 20, height: 20, borderRadius: 4, border: '1px solid #ccc' }} title={activity['Color'] || ''}></span>
                                      )}
                                    </td>
                                    <td className="px-2 py-1">
                                      {productActivitiesEdit && (
                                        <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={() => {
                                          const updated = productActivitiesForm.filter((_: any, i: number) => i !== actIdx);
                                          setProductActivitiesForm(updated);
                                        }}>Delete</button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                                {productActivitiesEdit && (
                                  <tr>
                                    <td colSpan={7} className="px-2 py-1">
                                      <button className="bg-green-500 text-white px-3 py-1 rounded mt-2" onClick={() => {
                                        setProductActivitiesForm(prev => [...prev, { EntityName: '', Overdue: false, Activity: '', 'Target Date': '', 'Expected Date': '', Color: '#000000' }]);
                                      }}>Add Activity</button>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                            <div className="flex gap-2 mt-2">
                              {productActivitiesEdit ? (
                                <>
                                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                    const newRows = [...rows];
                                    newRows[idx] = { ...row, 'Product Activities': productActivitiesForm };
                                    setRows(newRows);
                                    setProductActivitiesEdit(false);
                                    setProductActivitiesForm([]);
                                  }}>Save</button>
                                  <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setProductActivitiesEdit(false); setProductActivitiesForm([]); }}>Cancel</button>
                                </>
                              ) : (
                                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {
                                  setProductActivitiesEdit(true);
                                  setProductActivitiesForm(row['Product Activities'] ? [...row['Product Activities']] : []);
                                }}>Edit</button>
                              )}
                            </div>
                          </div>
                        )}
                        {/* Colorways Tab */}
                        {productEditTab === 'Colorways' && (
                          <div className="inline-block max-w-5xl min-w-fit overflow-x-auto sticky left-0 z-10">
                            <table className="text-sm border border-blue-200 rounded my-2 min-w-fit" style={{ marginBottom: '12px' }}>
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 font-semibold">Active</th>
                                  <th className="px-2 py-1 font-semibold">Status</th>
                                  <th className="px-2 py-1 font-semibold">Product Sub Type</th>
                                  <th className="px-2 py-1 font-semibold">Collection</th>
                                  <th className="px-2 py-1 font-semibold">Template</th>
                                  <th className="px-2 py-1 font-semibold">Product Color Key Date</th>
                                  <th className="px-2 py-1 font-semibold">Closed Date</th>
                                  <th className="px-2 py-1 font-semibold">Color</th>
                                  <th className="px-2 py-1 font-semibold">Color Description</th>
                                  <th className="px-2 py-1 font-semibold">Color Family</th>
                                  <th className="px-2 py-1 font-semibold">Color Standard</th>
                                  <th className="px-2 py-1 font-semibold">Color External Ref.</th>
                                  <th className="px-2 py-1 font-semibold">Color External Ref. 2.</th>
                                  <th className="px-2 py-1 font-semibold">Approved to SMS</th>
                                  <th className="px-2 py-1 font-semibold">Approved to Bulk</th>
                                  <th className="px-2 py-1 font-semibold">In Development</th>
                                  <th className="px-2 py-1 font-semibold">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(productColorwaysEdit ? productColorwaysForm : (row['Product Colorways'] || []))?.map((cw: any, cwIdx: number) => (
                                  <tr key={cwIdx}>
                                    <td className="px-2 py-1 text-center">
                                      {productColorwaysEdit ? (
                                        <input
                                          type="checkbox"
                                          checked={!!productColorwaysForm[cwIdx]?.['Active']}
                                          onChange={e => {
                                            const updated = [...productColorwaysForm];
                                            updated[cwIdx] = { ...updated[cwIdx], Active: e.target.checked };
                                            setProductColorwaysForm(updated);
                                          }}
                                        />
                                      ) : (
                                        cw['Active'] ? 'Yes' : 'No'
                                      )}
                                    </td>
                                    <td className="px-2 py-1">{productColorwaysEdit ? (
                                      <input className="border px-1 py-0.5 rounded text-sm w-full" value={productColorwaysForm[cwIdx]?.['Status'] || ''} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], Status: e.target.value }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Status'] || '')}</td>
                                    <td className="px-2 py-1">{productColorwaysEdit ? (
                                      <input className="border px-1 py-0.5 rounded text-sm w-full" value={productColorwaysForm[cwIdx]?.['Product Sub Type'] || ''} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], 'Product Sub Type': e.target.value }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Product Sub Type'] || '')}</td>
                                    <td className="px-2 py-1">{productColorwaysEdit ? (
                                      <input className="border px-1 py-0.5 rounded text-sm w-full" value={productColorwaysForm[cwIdx]?.['Collection'] || ''} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], Collection: e.target.value }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Collection'] || '')}</td>
                                    <td className="px-2 py-1">{productColorwaysEdit ? (
                                      <input className="border px-1 py-0.5 rounded text-sm w-full" value={productColorwaysForm[cwIdx]?.['Template'] || ''} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], Template: e.target.value }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Template'] || '')}</td>
                                    <td className="px-2 py-1">{productColorwaysEdit ? (
                                      <input type="date" className="border px-1 py-0.5 rounded text-sm w-full" value={productColorwaysForm[cwIdx]?.['Product Color Key Date'] || ''} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], 'Product Color Key Date': e.target.value }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Product Color Key Date'] || '')}</td>
                                    <td className="px-2 py-1">{productColorwaysEdit ? (
                                      <input type="date" className="border px-1 py-0.5 rounded text-sm w-full" value={productColorwaysForm[cwIdx]?.['Closed Date'] || ''} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], 'Closed Date': e.target.value }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Closed Date'] || '')}</td>
                                    <td className="px-2 py-1 text-center">{productColorwaysEdit ? (
                                      <input type="color" className="w-8 h-6 border rounded" value={productColorwaysForm[cwIdx]?.['Color'] || '#000000'} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], Color: e.target.value }; setProductColorwaysForm(updated); }} />
                                    ) : (<span style={{ background: cw['Color'] || '#000', display: 'inline-block', width: 20, height: 20, borderRadius: 4, border: '1px solid #ccc' }} title={cw['Color'] || ''}></span>)}</td>
                                    <td className="px-2 py-1">{productColorwaysEdit ? (
                                      <input className="border px-1 py-0.5 rounded text-sm w-full" value={productColorwaysForm[cwIdx]?.['Color Description'] || ''} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], 'Color Description': e.target.value }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Color Description'] || '')}</td>
                                    <td className="px-2 py-1">{productColorwaysEdit ? (
                                      <input className="border px-1 py-0.5 rounded text-sm w-full" value={productColorwaysForm[cwIdx]?.['Color Family'] || ''} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], 'Color Family': e.target.value }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Color Family'] || '')}</td>
                                    <td className="px-2 py-1">{productColorwaysEdit ? (
                                      <input className="border px-1 py-0.5 rounded text-sm w-full" value={productColorwaysForm[cwIdx]?.['Color Standard'] || ''} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], 'Color Standard': e.target.value }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Color Standard'] || '')}</td>
                                    <td className="px-2 py-1">{productColorwaysEdit ? (
                                      <input className="border px-1 py-0.5 rounded text-sm w-full" value={productColorwaysForm[cwIdx]?.['Color External Ref.'] || ''} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], 'Color External Ref.': e.target.value }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Color External Ref.'] || '')}</td>
                                    <td className="px-2 py-1">{productColorwaysEdit ? (
                                      <input className="border px-1 py-0.5 rounded text-sm w-full" value={productColorwaysForm[cwIdx]?.['Color External Ref. 2.'] || ''} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], 'Color External Ref. 2.': e.target.value }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Color External Ref. 2.'] || '')}</td>
                                    <td className="px-2 py-1 text-center">{productColorwaysEdit ? (
                                      <input type="checkbox" checked={!!productColorwaysForm[cwIdx]?.['Approved to SMS']} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], 'Approved to SMS': e.target.checked }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Approved to SMS'] ? 'Yes' : 'No')}</td>
                                    <td className="px-2 py-1 text-center">{productColorwaysEdit ? (
                                      <input type="checkbox" checked={!!productColorwaysForm[cwIdx]?.['Approved to Bulk']} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], 'Approved to Bulk': e.target.checked }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['Approved to Bulk'] ? 'Yes' : 'No')}</td>
                                    <td className="px-2 py-1 text-center">{productColorwaysEdit ? (
                                      <input type="checkbox" checked={!!productColorwaysForm[cwIdx]?.['In Development']} onChange={e => { const updated = [...productColorwaysForm]; updated[cwIdx] = { ...updated[cwIdx], 'In Development': e.target.checked }; setProductColorwaysForm(updated); }} />
                                    ) : (cw['In Development'] ? 'Yes' : 'No')}</td>
                                    <td className="px-2 py-1">
                                      {productColorwaysEdit && (
                                        <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={() => {
                                          const updated = productColorwaysForm.filter((_: any, i: number) => i !== cwIdx);
                                          setProductColorwaysForm(updated);
                                        }}>Delete</button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                                {productColorwaysEdit && (
                                  <tr>
                                    <td colSpan={17} className="px-2 py-1">
                                      <button className="bg-green-500 text-white px-3 py-1 rounded mt-2" onClick={() => {
                                        setProductColorwaysForm(prev => [...prev, { Active: false, Status: '', 'Product Sub Type': '', Collection: '', Template: '', 'Product Color Key Date': '', 'Closed Date': '', Color: '#000000', 'Color Description': '', 'Color Family': '', 'Color Standard': '', 'Color External Ref.': '', 'Color External Ref. 2.': '', 'Approved to SMS': false, 'Approved to Bulk': false, 'In Development': false }]);
                                      }}>Add Colorway</button>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                            <div className="flex gap-2 mt-2">
                              {productColorwaysEdit ? (
                                <>
                                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                    const newRows = [...rows];
                                    newRows[idx] = { ...row, 'Product Colorways': productColorwaysForm };
                                    setRows(newRows);
                                    setProductColorwaysEdit(false);
                                    setProductColorwaysForm([]);
                                  }}>Save</button>
                                  <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setProductColorwaysEdit(false); setProductColorwaysForm([]); }}>Cancel</button>
                                </>
                              ) : (
                                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {
                                  setProductColorwaysEdit(true);
                                  setProductColorwaysForm(row['Product Colorways'] ? [...row['Product Colorways']] : []);
                                }}>Edit</button>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Tech Packs Section */}
                        <div className="mt-8">
                          <div className="font-semibold text-blue-700 mb-2">Tech Packs</div>
                                                  {/* Tech Packs subtable tabs */}
                        <div className="mb-4 flex gap-2 border-b border-blue-200">
                          {(['Tech Pack Version', 'Bill Of Materials', 'Size Specifications', 'Fit Log', 'Fibre Composition', 'Care Instructions', 'Labels'] as string[]).map((tab: string) => (
                            <button
                              key={tab}
                              className={`px-4 py-2 -mb-px rounded-t font-medium transition-colors border-b-2 ${techPacksEditTab === tab ? 'bg-white border-blue-500 text-blue-700' : 'bg-blue-50 border-transparent text-gray-600 hover:text-blue-600'}`}
                              onClick={() => setTechPacksEditTab(tab)}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                        

                          
                          {/* Tech Pack Version Tab */}
                          {(!techPacksEditTab || techPacksEditTab === 'Tech Pack Version') && (
                            <div className="inline-block">
                              <p className="text-gray-600 mb-4">Tech Pack Version details will be displayed here.</p>
                            </div>
                          )}
                          
                          {/* Bill Of Materials Tab */}
                          {techPacksEditTab === 'Bill Of Materials' && (
                            <div className="inline-block w-full">
                              {/* Bill of Materials Details Panel */}
                              <div className="flex gap-4 mb-4">
                                <div className="border border-blue-200 rounded p-3 bg-blue-50 w-80">
                                  <h4 className="font-semibold text-gray-700 mb-2 text-sm">Bill Of Materials Details</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <span className="font-medium text-sm w-28">Name:</span>
                                      <input type="text" className="border rounded px-2 py-1 text-sm ml-2 flex-1" value="000125 M8836207 v1" />
                                    </div>
                                    <div className="flex items-center">
                                      <span className="font-medium text-sm w-28">Source Bill of Material:</span>
                                      <input type="checkbox" className="ml-2" />
                                    </div>
                                    <div className="flex items-center">
                                      <span className="font-medium text-sm w-28">Status:</span>
                                      <input type="text" className="border rounded px-2 py-1 text-sm ml-2 flex-1" placeholder="" />
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="border border-gray-300 rounded p-3 bg-white w-80">
                                  <h4 className="font-semibold text-gray-700 mb-2 text-sm">Product Details</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <span className="font-medium text-sm w-28">Product Name:</span>
                                      <span className="text-sm text-blue-600">M8836207</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="font-medium text-sm w-28">Product Description:</span>
                                      <span className="text-sm">MACHINE KNIT BEANIE</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="font-medium text-sm w-28">Product Buyer Style Number:</span>
                                      <span className="text-sm">U53180654</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="font-medium text-sm w-28">Season:</span>
                                      <span className="text-sm">FH:2018</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Bill of Materials Line Items Table */}
                              <div className="mb-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                                  Edit
                                </button>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="text-xs border border-gray-300 rounded max-w-4xl">
                                  <thead>
                                    <tr className="bg-gray-50">

                                      <th className="px-1 py-0.5 text-left font-semibold border w-20">
                                        Material
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        Material Description
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20">
                                        Material Status
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20">
                                        Material Category
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        Comment
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        Custom Text 1
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        Custom Text 2
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        Custom Text 3
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        Custom Text 4
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        Season
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        Note Count
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20">
                                        Latest Note
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20">
                                        Main Material
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20">
                                        Category Sequence
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        Default Material Color
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20">
                                        Composition
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        Buyer Style Name
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20">
                                        Supplier Ref.
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        Buyer Style Number
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Merbau/Aurora
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Nightshadow/lolite
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Orion/Olive Amber
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Nocturne/Deep Cove
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Red Beach/Flare
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Shorepine/Titanite
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Tui/Stellar
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        BLACK
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20">
                                        Blackbird
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        Default
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        - Size
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        - Rating
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        One Size
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        - Size
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        - Rating
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Nightshadow/lolite
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Orion/Olive Amber
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Nocturne/Deep Cove
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Red Beach/Flare
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Shorepine/Titanite
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">
                                        ARC- Tui/Stellar
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        BLACK
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20">
                                        Blackbird
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        Default
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        - Size
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        - Rating
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        One Size
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        - Size
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">
                                        - Rating
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                                                        <tr>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Regular Spu..." /></td>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="(UJ-001 Solid) 1..." /></td>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Approved" /></td>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="1" /></td>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Yarn" /></td>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Yarn" /></td>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="FH:2017" /></td>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="0" /></td>
                                    </tr>
                                    <tr>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="333MTOT12" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="WOMENS LOG..." /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Approved" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="7" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Logo Brand" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Logo Brand" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="FH:2018" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="0" /></td>
                                    </tr>
                                    <tr>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="UPCT1512" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Prana UPC Stick..." /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Approved" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="2" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Packaging" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Packaging" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="FH:2018" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="0" /></td>
                                    </tr>
                                    <tr>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="CALB12" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="PRANA CARE L..." /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Approved" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="3" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Packaging" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Packaging" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="FH:2018" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="0" /></td>
                                    </tr>
                                    <tr>
                                      <td className="px-1 py-0.5 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="333PRNT27..." /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Prana Hangtags..." /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Approved" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="4" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Packaging" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Packaging" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="FH:2019" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="0" /></td>
                                    </tr>
                                    <tr>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="CALB13 ID L..." /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="PRANA PO ID L..." /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Approved" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="5" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Packaging" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Packaging" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="FH:2019" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="0" /></td>
                                    </tr>
                                    <tr>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="333BLTH1NAT" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Prana J-Hook" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Approved" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="6" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Packaging" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="Packaging" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="" /></td>
                                      <td className="px-2 py-1 border"><input type="text" className="w-full border-none bg-transparent" defaultValue="0" /></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                            </div>
                          )}
                          
                          {/* Size Specifications Tab */}
                          {techPacksEditTab === 'Size Specifications' && (
                            <div className="inline-block">
                              <table className="text-sm border border-blue-200 rounded mb-2 table-fixed">
                                <tbody>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Size</td><td className="px-2 py-1">{row['Size Spec'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Chest</td><td className="px-2 py-1">{row['Size Chest'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Waist</td><td className="px-2 py-1">{row['Size Waist'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Hip</td><td className="px-2 py-1">{row['Size Hip'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Length</td><td className="px-2 py-1">{row['Size Length'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Sleeve</td><td className="px-2 py-1">{row['Size Sleeve'] || ''}</td></tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                          
                          {/* Fit Log Tab */}
                          {techPacksEditTab === 'Fit Log' && (
                            <div className="inline-block">
                              <table className="text-sm border border-blue-200 rounded mb-2 table-fixed">
                                <tbody>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Date</td><td className="px-2 py-1">{row['Fit Log Date'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Type</td><td className="px-2 py-1">{row['Fit Log Type'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Status</td><td className="px-2 py-1">{row['Fit Log Status'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Comments</td><td className="px-2 py-1">{row['Fit Log Comments'] || ''}</td></tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                          
                          {/* Fibre Composition Tab */}
                          {techPacksEditTab === 'Fibre Composition' && (
                            <div className="inline-block">
                              {/* Version Control Table */}
                              <div className="mb-3">
                                <h4 className="font-semibold text-gray-700 mb-1 text-sm">Version Control</h4>
                                <table className="text-xs border border-blue-200 rounded mb-1 table-fixed">
                                  <thead>
                                    <tr className="bg-blue-50">
                                      <th className="px-1 py-0.5 text-left font-semibold w-20">Version Number</th>
                                      <th className="px-1 py-0.5 text-left font-semibold w-24">Comment</th>
                                      <th className="px-1 py-0.5 text-center font-semibold w-16">Current Version</th>
                                      <th className="px-1 py-0.5 text-left font-semibold w-20">Created By</th>
                                      <th className="px-1 py-0.5 text-left font-semibold w-32">Created</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="px-1 py-0.5 border">{techPackVersionEdit ? (
                                        <input className="border px-1 py-0.5 rounded text-xs w-full" value={techPackVersionForm?.['Version Number'] || ''} onChange={e => setTechPackVersionForm({...techPackVersionForm, 'Version Number': e.target.value})} />
                                      ) : (row['Version Number'] || '')}</td>
                                      <td className="px-1 py-0.5 border">{techPackVersionEdit ? (
                                        <input className="border px-1 py-0.5 rounded text-xs w-full" value={techPackVersionForm?.['Comment'] || ''} onChange={e => setTechPackVersionForm({...techPackVersionForm, 'Comment': e.target.value})} />
                                      ) : (row['Comment'] || '')}</td>
                                      <td className="px-1 py-0.5 border text-center">{techPackVersionEdit ? (
                                        <input type="checkbox" checked={!!techPackVersionForm?.['Current Version']} onChange={e => setTechPackVersionForm({...techPackVersionForm, 'Current Version': e.target.checked})} />
                                      ) : (row['Current Version'] ? (
                                        <div className="w-3 h-3 bg-gray-300 border rounded flex items-center justify-center">
                                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                      ) : (
                                        <div className="w-3 h-3 bg-gray-300 border rounded"></div>
                                      ))}</td>
                                      <td className="px-1 py-0.5 border">{techPackVersionEdit ? (
                                        <input className="border px-1 py-0.5 rounded text-xs w-full" value={techPackVersionForm?.['Created By'] || ''} onChange={e => setTechPackVersionForm({...techPackVersionForm, 'Created By': e.target.value})} />
                                      ) : (row['Created By'] || '')}</td>
                                      <td className="px-1 py-0.5 border">{techPackVersionEdit ? (
                                        <input type="datetime-local" className="border px-1 py-0.5 rounded text-xs w-full" value={techPackVersionForm?.['Created'] || ''} onChange={e => setTechPackVersionForm({...techPackVersionForm, 'Created': e.target.value})} />
                                      ) : (row['Created'] || '')}</td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="flex gap-1 mt-1">
                                  {techPackVersionEdit ? (
                                    <>
                                      <button className="bg-green-600 text-white px-2 py-0.5 rounded text-xs" onClick={() => {
                                        const newRows = [...rows];
                                        newRows[idx] = { ...row, ...techPackVersionForm };
                                        setRows(newRows);
                                        setTechPackVersionEdit(false);
                                        setTechPackVersionForm(null);
                                      }}>Save</button>
                                      <button className="bg-gray-500 text-white px-2 py-0.5 rounded text-xs" onClick={() => { setTechPackVersionEdit(false); setTechPackVersionForm(null); }}>Cancel</button>
                                    </>
                                  ) : (
                                    <button className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs" onClick={() => {
                                      setTechPackVersionEdit(true);
                                      setTechPackVersionForm({
                                        'Version Number': row['Version Number'] || '',
                                        'Comment': row['Comment'] || '',
                                        'Current Version': row['Current Version'] || false,
                                        'Created By': row['Created By'] || '',
                                        'Created': row['Created'] || ''
                                      });
                                    }}>Edit</button>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                {/* Fibre Content Section */}
                                {row['Fibre Content'] !== undefined && (
                                <div className="border border-blue-200 rounded p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-sm">Fibre Content</h4>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => {
                                      // Remove fibre content section completely
                                      const newRows = [...rows];
                                      delete newRows[idx]['Fibre Content'];
                                      setRows(newRows);
                                    }}>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  <table className="text-xs w-full">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left py-1">Fibre</th>
                                        <th className="text-left py-1">%</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <tr key={index}>
                                          <td className="py-1">
                                            <select 
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row['Fibre Content']?.[index]?.type || ''}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx]['Fibre Content']) newRows[idx]['Fibre Content'] = [];
                                                if (!newRows[idx]['Fibre Content'][index]) newRows[idx]['Fibre Content'][index] = {};
                                                newRows[idx]['Fibre Content'][index].type = e.target.value;
                                                setRows(newRows);
                                              }}
                                            >
                                              <option value="">Select</option>
                                              <option value="(Faux fur) Polyester">(Faux fur) Polyester</option>
                                              <option value="Acetate">Acetate</option>
                                              <option value="Acrylic">Acrylic</option>
                                              <option value="Alpaca">Alpaca</option>
                                              <option value="Angora">Angora</option>
                                              <option value="Cashmere">Cashmere</option>
                                              <option value="Contains Non-Textile Parts of Animal Origin">Contains Non-Textile Parts of Animal Origin</option>
                                              <option value="Cotton">Cotton</option>
                                              <option value="Elastane">Elastane</option>
                                              <option value="Elasterell-P">Elasterell-P</option>
                                              <option value="Elastodiene">Elastodiene</option>
                                              <option value="Exclusive of Decoration">Exclusive of Decoration</option>
                                              <option value="Exclusive of Elastic">Exclusive of Elastic</option>
                                              <option value="Exclusive of Ornamentation">Exclusive of Ornamentation</option>
                                              <option value="Exclusive of Trim">Exclusive of Trim</option>
                                              <option value="Exclusive of Trimming">Exclusive of Trimming</option>
                                              <option value="Faux Fur">Faux Fur</option>
                                              <option value="Faux Suede Patch">Faux Suede Patch</option>
                                              <option value="Finished Piece Washed (for Testing only)">Finished Piece Washed (for Testing only)</option>
                                              <option value="Imitation Suede">Imitation Suede</option>
                                              <option value="Lambswool">Lambswool</option>
                                              <option value="Leather">Leather</option>
                                              <option value="Lurex">Lurex</option>
                                              <option value="Lycra">Lycra</option>
                                              <option value="Lyocell">Lyocell</option>
                                              <option value="Merino Wool">Merino Wool</option>
                                              <option value="Metallic">Metallic</option>
                                              <option value="Metallic fibre">Metallic fibre</option>
                                              <option value="Metallised Fibre">Metallised Fibre</option>
                                              <option value="Modacrylic">Modacrylic</option>
                                              <option value="Nylon">Nylon</option>
                                              <option value="Olefin">Olefin</option>
                                              <option value="Organic cotton">Organic cotton</option>
                                              <option value="Other Fiber">Other Fiber</option>
                                              <option value="Other Fibers">Other Fibers</option>
                                              <option value="Paper">Paper</option>
                                              <option value="Pig suede">Pig suede</option>
                                              <option value="Polyamide">Polyamide</option>
                                              <option value="Polyester">Polyester</option>
                                              <option value="Polyester (Recycled)">Polyester (Recycled)</option>
                                              <option value="Polyester Recycled">Polyester Recycled</option>
                                              <option value="Polypropylene">Polypropylene</option>
                                              <option value="Polyurethane">Polyurethane</option>
                                              <option value="Polyurethane Foam">Polyurethane Foam</option>
                                              <option value="Rayon">Rayon</option>
                                              <option value="Recycled">Recycled</option>
                                              <option value="Recycled Nylon">Recycled Nylon</option>
                                              <option value="Recycled Other Fibers">Recycled Other Fibers</option>
                                              <option value="Recycled Polyester">Recycled Polyester</option>
                                              <option value="Recycled Wool">Recycled Wool</option>
                                              <option value="Recycled Wool/ Reprocessed Wool">Recycled Wool/ Reprocessed Wool</option>
                                              <option value="Recycled/Reclaimed Wool">Recycled/Reclaimed Wool</option>
                                              <option value="Rubber">Rubber</option>
                                              <option value="Rubber/Elastodiene">Rubber/Elastodiene</option>
                                              <option value="Silk">Silk</option>
                                              <option value="Spandex">Spandex</option>
                                              <option value="Straw">Straw</option>
                                              <option value="True Hemp">True Hemp</option>
                                              <option value="Viscose">Viscose</option>
                                              <option value="Wool">Wool</option>
                                              <option value="Wool - Merino">Wool - Merino</option>
                                              <option value="Wool (Merino)">Wool (Merino)</option>
                                              <option value="Wool Merino">Wool Merino</option>
                                              <option value="Yak">Yak</option>
                                              <option value="Yarn & Finished Piece Washed (for Testing only)">Yarn & Finished Piece Washed (for Testing only)</option>
                                              <option value="Yarn Washed (for Testing only)">Yarn Washed (for Testing only)</option>
                                              <option value="Excluding Trims">Excluding Trims</option>
                                              <option value="Exclusive of Decoration and Elastic">Exclusive of Decoration and Elastic</option>
                                              <option value="Recycled Acrylic">Recycled Acrylic</option>
                                            </select>
                                          </td>
                                          <td className="py-1">
                                            <input 
                                              type="number" 
                                              step="0.1"
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row['Fibre Content']?.[index]?.percentage || '0.0'}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx]['Fibre Content']) newRows[idx]['Fibre Content'] = [];
                                                if (!newRows[idx]['Fibre Content'][index]) newRows[idx]['Fibre Content'][index] = {};
                                                newRows[idx]['Fibre Content'][index].percentage = parseFloat(e.target.value) || 0;
                                                setRows(newRows);
                                              }}
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="border-t font-semibold">
                                        <td className="py-1">Total</td>
                                        <td className="py-1">
                                          {(row['Fibre Content']?.reduce((sum: number, item: any) => sum + (parseFloat(item?.percentage) || 0), 0) || 0).toFixed(1)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                )}

                                {/* Shell Section */}
                                {row['Shell'] !== undefined && (
                                <div className="border border-blue-200 rounded p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-sm">Shell</h4>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => {
                                      const newRows = [...rows];
                                      delete newRows[idx]['Shell'];
                                      setRows(newRows);
                                    }}>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  <table className="text-xs w-full">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left py-1">Fibre</th>
                                        <th className="text-left py-1">%</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <tr key={index}>
                                          <td className="py-1">
                                            <select 
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row['Shell']?.[index]?.type || ''}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx]['Shell']) newRows[idx]['Shell'] = [];
                                                if (!newRows[idx]['Shell'][index]) newRows[idx]['Shell'][index] = {};
                                                newRows[idx]['Shell'][index].type = e.target.value;
                                                setRows(newRows);
                                              }}
                                            >
                                              <option value="">Select</option>
                                              <option value="(Faux fur) Polyester">(Faux fur) Polyester</option>
                                              <option value="Acetate">Acetate</option>
                                              <option value="Acrylic">Acrylic</option>
                                              <option value="Alpaca">Alpaca</option>
                                              <option value="Angora">Angora</option>
                                              <option value="Cashmere">Cashmere</option>
                                              <option value="Contains Non-Textile Parts of Animal Origin">Contains Non-Textile Parts of Animal Origin</option>
                                              <option value="Cotton">Cotton</option>
                                              <option value="Elastane">Elastane</option>
                                              <option value="Elasterell-P">Elasterell-P</option>
                                              <option value="Elastodiene">Elastodiene</option>
                                              <option value="Exclusive of Decoration">Exclusive of Decoration</option>
                                              <option value="Exclusive of Elastic">Exclusive of Elastic</option>
                                              <option value="Exclusive of Ornamentation">Exclusive of Ornamentation</option>
                                              <option value="Exclusive of Trim">Exclusive of Trim</option>
                                              <option value="Exclusive of Trimming">Exclusive of Trimming</option>
                                              <option value="Faux Fur">Faux Fur</option>
                                              <option value="Faux Suede Patch">Faux Suede Patch</option>
                                              <option value="Finished Piece Washed (for Testing only)">Finished Piece Washed (for Testing only)</option>
                                              <option value="Imitation Suede">Imitation Suede</option>
                                              <option value="Lambswool">Lambswool</option>
                                              <option value="Leather">Leather</option>
                                              <option value="Lurex">Lurex</option>
                                              <option value="Lycra">Lycra</option>
                                              <option value="Lyocell">Lyocell</option>
                                              <option value="Merino Wool">Merino Wool</option>
                                              <option value="Metallic">Metallic</option>
                                              <option value="Metallic fibre">Metallic fibre</option>
                                              <option value="Metallised Fibre">Metallised Fibre</option>
                                              <option value="Modacrylic">Modacrylic</option>
                                              <option value="Nylon">Nylon</option>
                                              <option value="Olefin">Olefin</option>
                                              <option value="Organic cotton">Organic cotton</option>
                                              <option value="Other Fiber">Other Fiber</option>
                                              <option value="Other Fibers">Other Fibers</option>
                                              <option value="Paper">Paper</option>
                                              <option value="Pig suede">Pig suede</option>
                                              <option value="Polyamide">Polyamide</option>
                                              <option value="Polyester">Polyester</option>
                                              <option value="Polyester (Recycled)">Polyester (Recycled)</option>
                                              <option value="Polyester Recycled">Polyester Recycled</option>
                                              <option value="Polypropylene">Polypropylene</option>
                                              <option value="Polyurethane">Polyurethane</option>
                                              <option value="Polyurethane Foam">Polyurethane Foam</option>
                                              <option value="Rayon">Rayon</option>
                                              <option value="Recycled">Recycled</option>
                                              <option value="Recycled Nylon">Recycled Nylon</option>
                                              <option value="Recycled Other Fibers">Recycled Other Fibers</option>
                                              <option value="Recycled Polyester">Recycled Polyester</option>
                                              <option value="Recycled Wool">Recycled Wool</option>
                                              <option value="Recycled Wool/ Reprocessed Wool">Recycled Wool/ Reprocessed Wool</option>
                                              <option value="Recycled/Reclaimed Wool">Recycled/Reclaimed Wool</option>
                                              <option value="Rubber">Rubber</option>
                                              <option value="Rubber/Elastodiene">Rubber/Elastodiene</option>
                                              <option value="Silk">Silk</option>
                                              <option value="Spandex">Spandex</option>
                                              <option value="Straw">Straw</option>
                                              <option value="True Hemp">True Hemp</option>
                                              <option value="Viscose">Viscose</option>
                                              <option value="Wool">Wool</option>
                                              <option value="Wool - Merino">Wool - Merino</option>
                                              <option value="Wool (Merino)">Wool (Merino)</option>
                                              <option value="Wool Merino">Wool Merino</option>
                                              <option value="Yak">Yak</option>
                                              <option value="Yarn & Finished Piece Washed (for Testing only)">Yarn & Finished Piece Washed (for Testing only)</option>
                                              <option value="Yarn Washed (for Testing only)">Yarn Washed (for Testing only)</option>
                                              <option value="Excluding Trims">Excluding Trims</option>
                                              <option value="Exclusive of Decoration and Elastic">Exclusive of Decoration and Elastic</option>
                                              <option value="Recycled Acrylic">Recycled Acrylic</option>
                                            </select>
                                          </td>
                                          <td className="py-1">
                                            <input 
                                              type="number" 
                                              step="0.1"
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row['Shell']?.[index]?.percentage || '0.0'}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx]['Shell']) newRows[idx]['Shell'] = [];
                                                if (!newRows[idx]['Shell'][index]) newRows[idx]['Shell'][index] = {};
                                                newRows[idx]['Shell'][index].percentage = parseFloat(e.target.value) || 0;
                                                setRows(newRows);
                                              }}
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="border-t font-semibold">
                                        <td className="py-1">Total</td>
                                        <td className="py-1">
                                          {(row['Shell']?.reduce((sum: number, item: any) => sum + (parseFloat(item?.percentage) || 0), 0) || 0).toFixed(1)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                )}

                                {/* Body Section */}
                                {row['Body'] !== undefined && (
                                <div className="border border-blue-200 rounded p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-sm">Body</h4>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => {
                                      const newRows = [...rows];
                                      delete newRows[idx]['Body'];
                                      setRows(newRows);
                                    }}>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  <table className="text-xs w-full">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left py-1">Fibre</th>
                                        <th className="text-left py-1">%</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <tr key={index}>
                                          <td className="py-1">
                                            <select 
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row['Body']?.[index]?.type || ''}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx]['Body']) newRows[idx]['Body'] = [];
                                                if (!newRows[idx]['Body'][index]) newRows[idx]['Body'][index] = {};
                                                newRows[idx]['Body'][index].type = e.target.value;
                                                setRows(newRows);
                                              }}
                                            >
                                              <option value="">Select</option>
                                              <option value="(Faux fur) Polyester">(Faux fur) Polyester</option>
                                              <option value="Acetate">Acetate</option>
                                              <option value="Acrylic">Acrylic</option>
                                              <option value="Alpaca">Alpaca</option>
                                              <option value="Angora">Angora</option>
                                              <option value="Cashmere">Cashmere</option>
                                              <option value="Contains Non-Textile Parts of Animal Origin">Contains Non-Textile Parts of Animal Origin</option>
                                              <option value="Cotton">Cotton</option>
                                              <option value="Elastane">Elastane</option>
                                              <option value="Elasterell-P">Elasterell-P</option>
                                              <option value="Elastodiene">Elastodiene</option>
                                              <option value="Exclusive of Decoration">Exclusive of Decoration</option>
                                              <option value="Exclusive of Elastic">Exclusive of Elastic</option>
                                              <option value="Exclusive of Ornamentation">Exclusive of Ornamentation</option>
                                              <option value="Exclusive of Trim">Exclusive of Trim</option>
                                              <option value="Exclusive of Trimming">Exclusive of Trimming</option>
                                              <option value="Faux Fur">Faux Fur</option>
                                              <option value="Faux Suede Patch">Faux Suede Patch</option>
                                              <option value="Finished Piece Washed (for Testing only)">Finished Piece Washed (for Testing only)</option>
                                              <option value="Imitation Suede">Imitation Suede</option>
                                              <option value="Lambswool">Lambswool</option>
                                              <option value="Leather">Leather</option>
                                              <option value="Lurex">Lurex</option>
                                              <option value="Lycra">Lycra</option>
                                              <option value="Lyocell">Lyocell</option>
                                              <option value="Merino Wool">Merino Wool</option>
                                              <option value="Metallic">Metallic</option>
                                              <option value="Metallic fibre">Metallic fibre</option>
                                              <option value="Metallised Fibre">Metallised Fibre</option>
                                              <option value="Modacrylic">Modacrylic</option>
                                              <option value="Nylon">Nylon</option>
                                              <option value="Olefin">Olefin</option>
                                              <option value="Organic cotton">Organic cotton</option>
                                              <option value="Other Fiber">Other Fiber</option>
                                              <option value="Other Fibers">Other Fibers</option>
                                              <option value="Paper">Paper</option>
                                              <option value="Pig suede">Pig suede</option>
                                              <option value="Polyamide">Polyamide</option>
                                              <option value="Polyester">Polyester</option>
                                              <option value="Polyester (Recycled)">Polyester (Recycled)</option>
                                              <option value="Polyester Recycled">Polyester Recycled</option>
                                              <option value="Polypropylene">Polypropylene</option>
                                              <option value="Polyurethane">Polyurethane</option>
                                              <option value="Polyurethane Foam">Polyurethane Foam</option>
                                              <option value="Rayon">Rayon</option>
                                              <option value="Recycled">Recycled</option>
                                              <option value="Recycled Nylon">Recycled Nylon</option>
                                              <option value="Recycled Other Fibers">Recycled Other Fibers</option>
                                              <option value="Recycled Polyester">Recycled Polyester</option>
                                              <option value="Recycled Wool">Recycled Wool</option>
                                              <option value="Recycled Wool/ Reprocessed Wool">Recycled Wool/ Reprocessed Wool</option>
                                              <option value="Recycled/Reclaimed Wool">Recycled/Reclaimed Wool</option>
                                              <option value="Rubber">Rubber</option>
                                              <option value="Rubber/Elastodiene">Rubber/Elastodiene</option>
                                              <option value="Silk">Silk</option>
                                              <option value="Spandex">Spandex</option>
                                              <option value="Straw">Straw</option>
                                              <option value="True Hemp">True Hemp</option>
                                              <option value="Viscose">Viscose</option>
                                              <option value="Wool">Wool</option>
                                              <option value="Wool - Merino">Wool - Merino</option>
                                              <option value="Wool (Merino)">Wool (Merino)</option>
                                              <option value="Wool Merino">Wool Merino</option>
                                              <option value="Yak">Yak</option>
                                              <option value="Yarn & Finished Piece Washed (for Testing only)">Yarn & Finished Piece Washed (for Testing only)</option>
                                              <option value="Yarn Washed (for Testing only)">Yarn Washed (for Testing only)</option>
                                              <option value="Excluding Trims">Excluding Trims</option>
                                              <option value="Exclusive of Decoration and Elastic">Exclusive of Decoration and Elastic</option>
                                              <option value="Recycled Acrylic">Recycled Acrylic</option>
                                            </select>
                                          </td>
                                          <td className="py-1">
                                            <input 
                                              type="number" 
                                              step="0.1"
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row['Body']?.[index]?.percentage || '0.0'}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx]['Body']) newRows[idx]['Body'] = [];
                                                if (!newRows[idx]['Body'][index]) newRows[idx]['Body'][index] = {};
                                                newRows[idx]['Body'][index].percentage = parseFloat(e.target.value) || 0;
                                                setRows(newRows);
                                              }}
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="border-t font-semibold">
                                        <td className="py-1">Total</td>
                                        <td className="py-1">
                                          {(row['Body']?.reduce((sum: number, item: any) => sum + (parseFloat(item?.percentage) || 0), 0) || 0).toFixed(1)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                )}

                                {/* Upper Section */}
                                {row['Upper'] !== undefined && (
                                <div className="border border-blue-200 rounded p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-sm">Upper</h4>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => {
                                      const newRows = [...rows];
                                      delete newRows[idx]['Upper'];
                                      setRows(newRows);
                                    }}>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  <table className="text-xs w-full">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left py-1">Fibre</th>
                                        <th className="text-left py-1">%</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <tr key={index}>
                                          <td className="py-1">
                                            <select 
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row['Upper']?.[index]?.type || ''}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx]['Upper']) newRows[idx]['Upper'] = [];
                                                if (!newRows[idx]['Upper'][index]) newRows[idx]['Upper'][index] = {};
                                                newRows[idx]['Upper'][index].type = e.target.value;
                                                setRows(newRows);
                                              }}
                                            >
                                              <option value="">Select</option>
                                              <option value="(Faux fur) Polyester">(Faux fur) Polyester</option>
                                              <option value="Acetate">Acetate</option>
                                              <option value="Acrylic">Acrylic</option>
                                              <option value="Alpaca">Alpaca</option>
                                              <option value="Angora">Angora</option>
                                              <option value="Cashmere">Cashmere</option>
                                              <option value="Contains Non-Textile Parts of Animal Origin">Contains Non-Textile Parts of Animal Origin</option>
                                              <option value="Cotton">Cotton</option>
                                              <option value="Elastane">Elastane</option>
                                              <option value="Elasterell-P">Elasterell-P</option>
                                              <option value="Elastodiene">Elastodiene</option>
                                              <option value="Exclusive of Decoration">Exclusive of Decoration</option>
                                              <option value="Exclusive of Elastic">Exclusive of Elastic</option>
                                              <option value="Exclusive of Ornamentation">Exclusive of Ornamentation</option>
                                              <option value="Exclusive of Trim">Exclusive of Trim</option>
                                              <option value="Exclusive of Trimming">Exclusive of Trimming</option>
                                              <option value="Faux Fur">Faux Fur</option>
                                              <option value="Faux Suede Patch">Faux Suede Patch</option>
                                              <option value="Finished Piece Washed (for Testing only)">Finished Piece Washed (for Testing only)</option>
                                              <option value="Imitation Suede">Imitation Suede</option>
                                              <option value="Lambswool">Lambswool</option>
                                              <option value="Leather">Leather</option>
                                              <option value="Lurex">Lurex</option>
                                              <option value="Lycra">Lycra</option>
                                              <option value="Lyocell">Lyocell</option>
                                              <option value="Merino Wool">Merino Wool</option>
                                              <option value="Metallic">Metallic</option>
                                              <option value="Metallic fibre">Metallic fibre</option>
                                              <option value="Metallised Fibre">Metallised Fibre</option>
                                              <option value="Modacrylic">Modacrylic</option>
                                              <option value="Nylon">Nylon</option>
                                              <option value="Olefin">Olefin</option>
                                              <option value="Organic cotton">Organic cotton</option>
                                              <option value="Other Fiber">Other Fiber</option>
                                              <option value="Other Fibers">Other Fibers</option>
                                              <option value="Paper">Paper</option>
                                              <option value="Pig suede">Pig suede</option>
                                              <option value="Polyamide">Polyamide</option>
                                              <option value="Polyester">Polyester</option>
                                              <option value="Polyester (Recycled)">Polyester (Recycled)</option>
                                              <option value="Polyester Recycled">Polyester Recycled</option>
                                              <option value="Polypropylene">Polypropylene</option>
                                              <option value="Polyurethane">Polyurethane</option>
                                              <option value="Polyurethane Foam">Polyurethane Foam</option>
                                              <option value="Rayon">Rayon</option>
                                              <option value="Recycled">Recycled</option>
                                              <option value="Recycled Nylon">Recycled Nylon</option>
                                              <option value="Recycled Other Fibers">Recycled Other Fibers</option>
                                              <option value="Recycled Polyester">Recycled Polyester</option>
                                              <option value="Recycled Wool">Recycled Wool</option>
                                              <option value="Recycled Wool/ Reprocessed Wool">Recycled Wool/ Reprocessed Wool</option>
                                              <option value="Recycled/Reclaimed Wool">Recycled/Reclaimed Wool</option>
                                              <option value="Rubber">Rubber</option>
                                              <option value="Rubber/Elastodiene">Rubber/Elastodiene</option>
                                              <option value="Silk">Silk</option>
                                              <option value="Spandex">Spandex</option>
                                              <option value="Straw">Straw</option>
                                              <option value="True Hemp">True Hemp</option>
                                              <option value="Viscose">Viscose</option>
                                              <option value="Wool">Wool</option>
                                              <option value="Wool - Merino">Wool - Merino</option>
                                              <option value="Wool (Merino)">Wool (Merino)</option>
                                              <option value="Wool Merino">Wool Merino</option>
                                              <option value="Yak">Yak</option>
                                              <option value="Yarn & Finished Piece Washed (for Testing only)">Yarn & Finished Piece Washed (for Testing only)</option>
                                              <option value="Yarn Washed (for Testing only)">Yarn Washed (for Testing only)</option>
                                              <option value="Excluding Trims">Excluding Trims</option>
                                              <option value="Exclusive of Decoration and Elastic">Exclusive of Decoration and Elastic</option>
                                              <option value="Recycled Acrylic">Recycled Acrylic</option>
                                            </select>
                                          </td>
                                          <td className="py-1">
                                            <input 
                                              type="number" 
                                              step="0.1"
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row['Upper']?.[index]?.percentage || '0.0'}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx]['Upper']) newRows[idx]['Upper'] = [];
                                                if (!newRows[idx]['Upper'][index]) newRows[idx]['Upper'][index] = {};
                                                newRows[idx]['Upper'][index].percentage = parseFloat(e.target.value) || 0;
                                                setRows(newRows);
                                              }}
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="border-t font-semibold">
                                        <td className="py-1">Total</td>
                                        <td className="py-1">
                                          {(row['Upper']?.reduce((sum: number, item: any) => sum + (parseFloat(item?.percentage) || 0), 0) || 0).toFixed(1)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                )}

                                {/* Faux Fur Shell Section */}
                                {row['Faux Fur Shell'] !== undefined && (
                                <div className="border border-blue-200 rounded p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-sm">Faux Fur Shell</h4>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => {
                                      const newRows = [...rows];
                                      delete newRows[idx]['Faux Fur Shell'];
                                      setRows(newRows);
                                    }}>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  <table className="text-xs w-full">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left py-1">Fibre</th>
                                        <th className="text-left py-1">%</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <tr key={index}>
                                          <td className="py-1">
                                            <select 
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row['Faux Fur Shell']?.[index]?.type || ''}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx]['Faux Fur Shell']) newRows[idx]['Faux Fur Shell'] = [];
                                                if (!newRows[idx]['Faux Fur Shell'][index]) newRows[idx]['Faux Fur Shell'][index] = {};
                                                newRows[idx]['Faux Fur Shell'][index].type = e.target.value;
                                                setRows(newRows);
                                              }}
                                            >
                                              <option value="">Select</option>
                                              <option value="(Faux fur) Polyester">(Faux fur) Polyester</option>
                                              <option value="Acetate">Acetate</option>
                                              <option value="Acrylic">Acrylic</option>
                                              <option value="Alpaca">Alpaca</option>
                                              <option value="Angora">Angora</option>
                                              <option value="Cashmere">Cashmere</option>
                                              <option value="Contains Non-Textile Parts of Animal Origin">Contains Non-Textile Parts of Animal Origin</option>
                                              <option value="Cotton">Cotton</option>
                                              <option value="Elastane">Elastane</option>
                                              <option value="Elasterell-P">Elasterell-P</option>
                                              <option value="Elastodiene">Elastodiene</option>
                                              <option value="Exclusive of Decoration">Exclusive of Decoration</option>
                                              <option value="Exclusive of Elastic">Exclusive of Elastic</option>
                                              <option value="Exclusive of Ornamentation">Exclusive of Ornamentation</option>
                                              <option value="Exclusive of Trim">Exclusive of Trim</option>
                                              <option value="Exclusive of Trimming">Exclusive of Trimming</option>
                                              <option value="Faux Fur">Faux Fur</option>
                                              <option value="Faux Suede Patch">Faux Suede Patch</option>
                                              <option value="Finished Piece Washed (for Testing only)">Finished Piece Washed (for Testing only)</option>
                                              <option value="Imitation Suede">Imitation Suede</option>
                                              <option value="Lambswool">Lambswool</option>
                                              <option value="Leather">Leather</option>
                                              <option value="Lurex">Lurex</option>
                                              <option value="Lycra">Lycra</option>
                                              <option value="Lyocell">Lyocell</option>
                                              <option value="Merino Wool">Merino Wool</option>
                                              <option value="Metallic">Metallic</option>
                                              <option value="Metallic fibre">Metallic fibre</option>
                                              <option value="Metallised Fibre">Metallised Fibre</option>
                                              <option value="Modacrylic">Modacrylic</option>
                                              <option value="Nylon">Nylon</option>
                                              <option value="Olefin">Olefin</option>
                                              <option value="Organic cotton">Organic cotton</option>
                                              <option value="Other Fiber">Other Fiber</option>
                                              <option value="Other Fibers">Other Fibers</option>
                                              <option value="Paper">Paper</option>
                                              <option value="Pig suede">Pig suede</option>
                                              <option value="Polyamide">Polyamide</option>
                                              <option value="Polyester">Polyester</option>
                                              <option value="Polyester (Recycled)">Polyester (Recycled)</option>
                                              <option value="Polyester Recycled">Polyester Recycled</option>
                                              <option value="Polypropylene">Polypropylene</option>
                                              <option value="Polyurethane">Polyurethane</option>
                                              <option value="Polyurethane Foam">Polyurethane Foam</option>
                                              <option value="Rayon">Rayon</option>
                                              <option value="Recycled">Recycled</option>
                                              <option value="Recycled Nylon">Recycled Nylon</option>
                                              <option value="Recycled Other Fibers">Recycled Other Fibers</option>
                                              <option value="Recycled Polyester">Recycled Polyester</option>
                                              <option value="Recycled Wool">Recycled Wool</option>
                                              <option value="Recycled Wool/ Reprocessed Wool">Recycled Wool/ Reprocessed Wool</option>
                                              <option value="Recycled/Reclaimed Wool">Recycled/Reclaimed Wool</option>
                                              <option value="Rubber">Rubber</option>
                                              <option value="Rubber/Elastodiene">Rubber/Elastodiene</option>
                                              <option value="Silk">Silk</option>
                                              <option value="Spandex">Spandex</option>
                                              <option value="Straw">Straw</option>
                                              <option value="True Hemp">True Hemp</option>
                                              <option value="Viscose">Viscose</option>
                                              <option value="Wool">Wool</option>
                                              <option value="Wool - Merino">Wool - Merino</option>
                                              <option value="Wool (Merino)">Wool (Merino)</option>
                                              <option value="Wool Merino">Wool Merino</option>
                                              <option value="Yak">Yak</option>
                                              <option value="Yarn & Finished Piece Washed (for Testing only)">Yarn & Finished Piece Washed (for Testing only)</option>
                                              <option value="Yarn Washed (for Testing only)">Yarn Washed (for Testing only)</option>
                                              <option value="Excluding Trims">Excluding Trims</option>
                                              <option value="Exclusive of Decoration and Elastic">Exclusive of Decoration and Elastic</option>
                                              <option value="Recycled Acrylic">Recycled Acrylic</option>
                                            </select>
                                          </td>
                                          <td className="py-1">
                                            <input 
                                              type="number" 
                                              step="0.1"
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row['Faux Fur Shell']?.[index]?.percentage || '0.0'}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx]['Faux Fur Shell']) newRows[idx]['Faux Fur Shell'] = [];
                                                if (!newRows[idx]['Faux Fur Shell'][index]) newRows[idx]['Faux Fur Shell'][index] = {};
                                                newRows[idx]['Faux Fur Shell'][index].percentage = parseFloat(e.target.value) || 0;
                                                setRows(newRows);
                                              }}
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="border-t font-semibold">
                                        <td className="py-1">Total</td>
                                        <td className="py-1">
                                          {(row['Faux Fur Shell']?.reduce((sum: number, item: any) => sum + (parseFloat(item?.percentage) || 0), 0) || 0).toFixed(1)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                )}

                                {/* Lining Section */}
                                {row['Lining'] !== undefined && (
                                <div className="border border-blue-200 rounded p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-sm">Lining</h4>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => {
                                      const newRows = [...rows];
                                      delete newRows[idx]['Lining'];
                                      setRows(newRows);
                                    }}>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  <table className="text-xs w-full">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left py-1">Fibre</th>
                                        <th className="text-left py-1">%</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <tr key={index}>
                                          <td className="py-1">
                                            <select 
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row['Lining']?.[index]?.type || ''}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx]['Lining']) newRows[idx]['Lining'] = [];
                                                if (!newRows[idx]['Lining'][index]) newRows[idx]['Lining'][index] = {};
                                                newRows[idx]['Lining'][index].type = e.target.value;
                                                setRows(newRows);
                                              }}
                                            >
                                              <option value="">Select</option>
                                              <option value="(Faux fur) Polyester">(Faux fur) Polyester</option>
                                              <option value="Acetate">Acetate</option>
                                              <option value="Acrylic">Acrylic</option>
                                              <option value="Alpaca">Alpaca</option>
                                              <option value="Angora">Angora</option>
                                              <option value="Cashmere">Cashmere</option>
                                              <option value="Contains Non-Textile Parts of Animal Origin">Contains Non-Textile Parts of Animal Origin</option>
                                              <option value="Cotton">Cotton</option>
                                              <option value="Elastane">Elastane</option>
                                              <option value="Elasterell-P">Elasterell-P</option>
                                              <option value="Elastodiene">Elastodiene</option>
                                              <option value="Exclusive of Decoration">Exclusive of Decoration</option>
                                              <option value="Exclusive of Elastic">Exclusive of Elastic</option>
                                              <option value="Exclusive of Ornamentation">Exclusive of Ornamentation</option>
                                              <option value="Exclusive of Trim">Exclusive of Trim</option>
                                              <option value="Exclusive of Trimming">Exclusive of Trimming</option>
                                              <option value="Faux Fur">Faux Fur</option>
                                              <option value="Faux Suede Patch">Faux Suede Patch</option>
                                              <option value="Finished Piece Washed (for Testing only)">Finished Piece Washed (for Testing only)</option>
                                              <option value="Imitation Suede">Imitation Suede</option>
                                              <option value="Lambswool">Lambswool</option>
                                              <option value="Leather">Leather</option>
                                              <option value="Lurex">Lurex</option>
                                              <option value="Lycra">Lycra</option>
                                              <option value="Lyocell">Lyocell</option>
                                              <option value="Merino Wool">Merino Wool</option>
                                              <option value="Metallic">Metallic</option>
                                              <option value="Metallic fibre">Metallic fibre</option>
                                              <option value="Metallised Fibre">Metallised Fibre</option>
                                              <option value="Modacrylic">Modacrylic</option>
                                              <option value="Nylon">Nylon</option>
                                              <option value="Olefin">Olefin</option>
                                              <option value="Organic cotton">Organic cotton</option>
                                              <option value="Other Fiber">Other Fiber</option>
                                              <option value="Other Fibers">Other Fibers</option>
                                              <option value="Paper">Paper</option>
                                              <option value="Pig suede">Pig suede</option>
                                              <option value="Polyamide">Polyamide</option>
                                              <option value="Polyester">Polyester</option>
                                              <option value="Polyester (Recycled)">Polyester (Recycled)</option>
                                              <option value="Polyester Recycled">Polyester Recycled</option>
                                              <option value="Polypropylene">Polypropylene</option>
                                              <option value="Polyurethane">Polyurethane</option>
                                              <option value="Polyurethane Foam">Polyurethane Foam</option>
                                              <option value="Rayon">Rayon</option>
                                              <option value="Recycled">Recycled</option>
                                              <option value="Recycled Nylon">Recycled Nylon</option>
                                              <option value="Recycled Other Fibers">Recycled Other Fibers</option>
                                              <option value="Recycled Polyester">Recycled Polyester</option>
                                              <option value="Recycled Wool">Recycled Wool</option>
                                              <option value="Recycled Wool/ Reprocessed Wool">Recycled Wool/ Reprocessed Wool</option>
                                              <option value="Recycled/Reclaimed Wool">Recycled/Reclaimed Wool</option>
                                              <option value="Rubber">Rubber</option>
                                              <option value="Rubber/Elastodiene">Rubber/Elastodiene</option>
                                              <option value="Silk">Silk</option>
                                              <option value="Spandex">Spandex</option>
                                              <option value="Straw">Straw</option>
                                              <option value="True Hemp">True Hemp</option>
                                              <option value="Viscose">Viscose</option>
                                              <option value="Wool">Wool</option>
                                              <option value="Wool - Merino">Wool - Merino</option>
                                              <option value="Wool (Merino)">Wool (Merino)</option>
                                              <option value="Wool Merino">Wool Merino</option>
                                              <option value="Yak">Yak</option>
                                              <option value="Yarn & Finished Piece Washed (for Testing only)">Yarn & Finished Piece Washed (for Testing only)</option>
                                              <option value="Yarn Washed (for Testing only)">Yarn Washed (for Testing only)</option>
                                              <option value="Excluding Trims">Excluding Trims</option>
                                              <option value="Exclusive of Decoration and Elastic">Exclusive of Decoration and Elastic</option>
                                              <option value="Recycled Acrylic">Recycled Acrylic</option>
                                            </select>
                                          </td>
                                          <td className="py-1">
                                            <input 
                                              type="number" 
                                              step="0.1"
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row['Lining']?.[index]?.percentage || '0.0'}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx]['Lining']) newRows[idx]['Lining'] = [];
                                                if (!newRows[idx]['Lining'][index]) newRows[idx]['Lining'][index] = {};
                                                newRows[idx]['Lining'][index].percentage = parseFloat(e.target.value) || 0;
                                                setRows(newRows);
                                              }}
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="border-t font-semibold">
                                        <td className="py-1">Total</td>
                                        <td className="py-1">
                                          {(row['Lining']?.reduce((sum: number, item: any) => sum + (parseFloat(item?.percentage) || 0), 0) || 0).toFixed(1)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                )}
                              </div>
                              
                              {/* Add New Fibre Composition Button */}
                              <div className="mb-3">
                                <button 
                                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-2"
                                  onClick={() => {
                                    const newRows = [...rows];
                                    const existingSections = Object.keys(newRows[idx]).filter(key => key.startsWith('Fibre Section'));
                                    const newSectionName = `Fibre Section ${existingSections.length + 1}`;
                                    newRows[idx] = { ...newRows[idx], [newSectionName]: [] };
                                    setRows(newRows);
                                  }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  Add New Fibre Composition
                                </button>
                              </div>
                              
                              {/* Dynamic Fibre Sections */}
                              <div className="grid grid-cols-3 gap-4">
                                {Object.keys(row).filter(key => key.startsWith('Fibre Section')).map((sectionName, sectionIndex) => (
                                  <div key={sectionName} className="border border-blue-200 rounded p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <input 
                                      type="text" 
                                      className="font-semibold text-sm border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
                                      value={sectionName}
                                      onChange={(e) => {
                                        const newRows = [...rows];
                                        const newSectionName = e.target.value;
                                        // Copy data from old section name to new section name
                                        newRows[idx][newSectionName] = newRows[idx][sectionName];
                                        // Remove old section name
                                        delete newRows[idx][sectionName];
                                        setRows(newRows);
                                      }}
                                    />
                                    <button className="text-red-500 hover:text-red-700" onClick={() => {
                                      const newRows = [...rows];
                                      delete newRows[idx][sectionName];
                                      setRows(newRows);
                                    }}>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  <table className="text-xs w-full">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left py-1">Fibre</th>
                                        <th className="text-left py-1">%</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <tr key={index}>
                                          <td className="py-1">
                                            <select 
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row[sectionName]?.[index]?.type || ''}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx][sectionName]) newRows[idx][sectionName] = [];
                                                if (!newRows[idx][sectionName][index]) newRows[idx][sectionName][index] = {};
                                                newRows[idx][sectionName][index].type = e.target.value;
                                                setRows(newRows);
                                              }}
                                            >
                                              <option value="">Select</option>
                                              <option value="(Faux fur) Polyester">(Faux fur) Polyester</option>
                                              <option value="Acetate">Acetate</option>
                                              <option value="Acrylic">Acrylic</option>
                                              <option value="Alpaca">Alpaca</option>
                                              <option value="Angora">Angora</option>
                                              <option value="Cashmere">Cashmere</option>
                                              <option value="Contains Non-Textile Parts of Animal Origin">Contains Non-Textile Parts of Animal Origin</option>
                                              <option value="Cotton">Cotton</option>
                                              <option value="Elastane">Elastane</option>
                                              <option value="Elasterell-P">Elasterell-P</option>
                                              <option value="Elastodiene">Elastodiene</option>
                                              <option value="Exclusive of Decoration">Exclusive of Decoration</option>
                                              <option value="Exclusive of Elastic">Exclusive of Elastic</option>
                                              <option value="Exclusive of Ornamentation">Exclusive of Ornamentation</option>
                                              <option value="Exclusive of Trim">Exclusive of Trim</option>
                                              <option value="Exclusive of Trimming">Exclusive of Trimming</option>
                                              <option value="Faux Fur">Faux Fur</option>
                                              <option value="Faux Suede Patch">Faux Suede Patch</option>
                                              <option value="Finished Piece Washed (for Testing only)">Finished Piece Washed (for Testing only)</option>
                                              <option value="Imitation Suede">Imitation Suede</option>
                                              <option value="Lambswool">Lambswool</option>
                                              <option value="Leather">Leather</option>
                                              <option value="Lurex">Lurex</option>
                                              <option value="Lycra">Lycra</option>
                                              <option value="Lyocell">Lyocell</option>
                                              <option value="Merino Wool">Merino Wool</option>
                                              <option value="Metallic">Metallic</option>
                                              <option value="Metallic fibre">Metallic fibre</option>
                                              <option value="Metallised Fibre">Metallised Fibre</option>
                                              <option value="Modacrylic">Modacrylic</option>
                                              <option value="Nylon">Nylon</option>
                                              <option value="Olefin">Olefin</option>
                                              <option value="Organic cotton">Organic cotton</option>
                                              <option value="Other Fiber">Other Fiber</option>
                                              <option value="Other Fibers">Other Fibers</option>
                                              <option value="Paper">Paper</option>
                                              <option value="Pig suede">Pig suede</option>
                                              <option value="Polyamide">Polyamide</option>
                                              <option value="Polyester">Polyester</option>
                                              <option value="Polyester (Recycled)">Polyester (Recycled)</option>
                                              <option value="Polyester Recycled">Polyester Recycled</option>
                                              <option value="Polypropylene">Polypropylene</option>
                                              <option value="Polyurethane">Polyurethane</option>
                                              <option value="Polyurethane Foam">Polyurethane Foam</option>
                                              <option value="Rayon">Rayon</option>
                                              <option value="Recycled">Recycled</option>
                                              <option value="Recycled Nylon">Recycled Nylon</option>
                                              <option value="Recycled Other Fibers">Recycled Other Fibers</option>
                                              <option value="Recycled Polyester">Recycled Polyester</option>
                                              <option value="Recycled Wool">Recycled Wool</option>
                                              <option value="Recycled Wool/ Reprocessed Wool">Recycled Wool/ Reprocessed Wool</option>
                                              <option value="Recycled/Reclaimed Wool">Recycled/Reclaimed Wool</option>
                                              <option value="Rubber">Rubber</option>
                                              <option value="Rubber/Elastodiene">Rubber/Elastodiene</option>
                                              <option value="Silk">Silk</option>
                                              <option value="Spandex">Spandex</option>
                                              <option value="Straw">Straw</option>
                                              <option value="True Hemp">True Hemp</option>
                                              <option value="Viscose">Viscose</option>
                                              <option value="Wool">Wool</option>
                                              <option value="Wool - Merino">Wool - Merino</option>
                                              <option value="Wool (Merino)">Wool (Merino)</option>
                                              <option value="Wool Merino">Wool Merino</option>
                                              <option value="Yak">Yak</option>
                                              <option value="Yarn & Finished Piece Washed (for Testing only)">Yarn & Finished Piece Washed (for Testing only)</option>
                                              <option value="Yarn Washed (for Testing only)">Yarn Washed (for Testing only)</option>
                                              <option value="Excluding Trims">Excluding Trims</option>
                                              <option value="Exclusive of Decoration and Elastic">Exclusive of Decoration and Elastic</option>
                                              <option value="Recycled Acrylic">Recycled Acrylic</option>
                                            </select>
                                          </td>
                                          <td className="py-1">
                                            <input 
                                              type="number" 
                                              step="0.1"
                                              className="w-full border rounded px-1 py-0.5 text-xs"
                                              value={row[sectionName]?.[index]?.percentage || '0.0'}
                                              onChange={(e) => {
                                                const newRows = [...rows];
                                                if (!newRows[idx][sectionName]) newRows[idx][sectionName] = [];
                                                if (!newRows[idx][sectionName][index]) newRows[idx][sectionName][index] = {};
                                                newRows[idx][sectionName][index].percentage = parseFloat(e.target.value) || 0;
                                                setRows(newRows);
                                              }}
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="border-t font-semibold">
                                        <td className="py-1">Total</td>
                                        <td className="py-1">
                                          {(row[sectionName]?.reduce((sum: number, item: any) => sum + (parseFloat(item?.percentage) || 0), 0) || 0).toFixed(1)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Care Instructions Tab */}
                          {techPacksEditTab === 'Care Instructions' && (
                            <div className="inline-block">
                              <table className="text-sm border border-blue-200 rounded mb-2 table-fixed">
                                <tbody>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Instruction</td><td className="px-2 py-1">{row['Care Instruction'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Symbol</td><td className="px-2 py-1">{row['Care Symbol'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Description</td><td className="px-2 py-1">{row['Care Description'] || ''}</td></tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                          
                          {/* Labels Tab */}
                          {techPacksEditTab === 'Labels' && (
                            <div className="inline-block">
                              <table className="text-sm border border-blue-200 rounded mb-2 table-fixed">
                                <tbody>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Label Type</td><td className="px-2 py-1">{row['Label Type'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Content</td><td className="px-2 py-1">{row['Label Content'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Position</td><td className="px-2 py-1">{row['Label Position'] || ''}</td></tr>
                                  <tr><td className="px-2 py-1 font-semibold w-32">Size</td><td className="px-2 py-1">{row['Label Size'] || ''}</td></tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {displayRows.length === 0 && (
              <tr>
                <td colSpan={renderColumns().reduce((acc, col) => acc + (col.isGroup ? 2 : 1), 0)} className="text-center py-4 text-gray-400">No results found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrders;