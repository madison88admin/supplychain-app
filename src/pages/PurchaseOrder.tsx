import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { ChevronDown, ChevronRight, Upload, Edit as EditIcon, Save as SaveIcon, Copy as CopyIcon, Plus, Filter as FilterIcon, Download, X } from 'lucide-react';

// Define grouped columns
const groupedColumns = [
  {
    label: 'Finish Trim Order',
    children: ['Target Date', 'Completed Date'],
    key: 'Finish trim Order',
  },
  {
    label: 'Link to line',
    children: ['Target Date', 'Completed Date'],
    key: 'Link to line',
  },
  {
    label: 'Finish Care Label',
    children: ['Target Date', 'Completed Date'],
    key: 'Finish Care Label',
  },
  {
    label: 'Packing & Shipping Instructions',
    children: ['Target Date', 'Completed Date'],
    key: 'Packing & Shipping Instructions',
  },
];

// All other columns
const baseColumns = [
  'Order References', 'Status', 'Total Qty', 'Total Cost', 'Total Value', 'Customer', 'Supplier', 'Purchase Currency', 'Selling Currency',
  'Purchase Payment Term', 'Selling Payment Term', 'Supplier Parent', 'Delivery Contact', 'Division', 'Group', 'Supplier Description',
  'Supplier Location', 'Supplier Country', 'Template', 'Transport Method', 'Deliver to', 'Closed Date', 'Delivery Date', 'PO Issue Date',
  'Supplier Currency', 'Comments', 'Production', 'MLA- Purchasing', 'China -QC', 'MLA-Planning', 'MLA-Shipping', 'PO Key User 6',
  'PO Key User 7', 'PO Key User 8', 'PO Key Working Group 2', 'PO Key Working Group 3', 'PO Key Working Group 4',
  'Purchase Payment Term Description', 'Selling Payment Term Description', 'Note Count', 'Latest Note', 'Default PO Line Template',
  'Default Ex-Factory', 'Created By', 'Created', 'Last Edited', 'Last Edited By', 'PO Issue Date',
];

const allColumns = [
  ...baseColumns,
  ...groupedColumns.map(g => g.key),
];

const initialRow: Record<string, any> = {
  'Order References': 'PO-1001',
  'Status': 'Open',
  'Total Qty': 1000,
  'Total Cost': '$10,000',
  'Total Value': '$12,000',
  'Customer': 'ABC Corp',
  'Supplier': 'XYZ Textiles',
  'Purchase Currency': 'USD',
  'Selling Currency': 'EUR',
  'Purchase Payment Term': 'Net 30',
  'Selling Payment Term': 'Net 60',
  'Supplier Parent': 'XYZ Group',
  'Delivery Contact': 'John Doe',
  'Division': 'Apparel',
  'Group': 'Men’s Wear',
  'Supplier Description': 'Main supplier for knits',
  'Supplier Location': 'Shanghai',
  'Supplier Country': 'China',
  'Template': 'Standard',
  'Transport Method': 'Sea',
  'Deliver to': 'Warehouse 1',
  'Closed Date': '2024-07-10',
  'Delivery Date': '2024-07-20',
  'PO Issue Date': '2024-07-01',
  'Supplier Currency': 'CNY',
  'Comments': 'Urgent order',
  'Production': 'In Progress',
  'MLA- Purchasing': 'Jane Smith',
  'China -QC': 'Passed',
  'MLA-Planning': 'Planned',
  'MLA-Shipping': 'Pending',
  'PO Key User 6': 'User6',
  'PO Key User 7': 'User7',
  'PO Key User 8': 'User8',
  'PO Key Working Group 2': 'Group2',
  'PO Key Working Group 3': 'Group3',
  'PO Key Working Group 4': 'Group4',
  'Purchase Payment Term Description': '30 days after invoice',
  'Selling Payment Term Description': '60 days after invoice',
  'Note Count': 2,
  'Latest Note': 'Check delivery schedule',
  'Default PO Line Template': 'Template A',
  'Default Ex-Factory': '2024-07-15',
  'Created By': 'Admin',
  'Created': '2024-06-30',
  'Last Edited': '2024-07-02',
  'Last Edited By': 'Editor',
  'Finish trim Order': { 'Target Date': '2024-07-08', 'Completed Date': '2024-07-09' },
  'Link to line': { 'Target Date': '2024-07-10', 'Completed Date': '2024-07-11' },
  'Finish Care Label': { 'Target Date': '2024-07-12', 'Completed Date': '2024-07-13' },
  'Packing & Shipping Instructions': { 'Target Date': '2024-07-14', 'Completed Date': '2024-07-15' },
};

const blankRow: Record<string, any> = Object.fromEntries([
  ...baseColumns.map(col => [col, '']),
  ...groupedColumns.map(g => [g.key, { 'Target Date': '', 'Completed Date': '' }]),
]);

// In the PO Details subtable, use these columns from the main table:
const poDetailsColumns = [
  'Order Reference',
  'Supplier',
  'Purchase Currency',
  'Status',
  'Production',
  'MLA- Purchasing',
  'China -QC',
  'MLA-Planning',
  'MLA-Shipping',
  'Closed Date',
  'Selling Currency',
];
const mockPODetails = [
  { line: 1, item: 'A123', description: 'Widget A', qty: 100, unitPrice: '$10', total: '$1000' },
  { line: 2, item: 'B456', description: 'Widget B', qty: 50, unitPrice: '$20', total: '$1000' },
];

// Add mock data for other subtables
const deliveryDetailsColumns = ['Customer', 'Deliver To', 'Transport Method'];
const mockDeliveryDetails = [
  { date: '2024-07-20', location: 'Warehouse 1', status: 'Pending' },
  { date: '2024-07-22', location: 'Warehouse 2', status: 'Delivered' },
];

// In the Critical Path tab, use these columns:
const criticalPathColumns = ['Template', 'PO Issue Date'];
const mockCriticalPath = [
  { milestone: 'Order Placed', target: '2024-07-01', completed: '2024-07-01', status: 'Done' },
  { milestone: 'Production Start', target: '2024-07-05', completed: '', status: 'Pending' },
];

const auditColumns = ['Created By', 'Created', 'Last Edited'];
const mockAudit = [
  { type: 'Quality', date: '2024-07-10', result: 'Pass' },
  { type: 'Compliance', date: '2024-07-12', result: 'Pending' },
];

// In the Totals tab, use these columns:
const totalsColumns = ['Total Qty', 'Total Cost', 'Total Value'];
const mockTotals = [
  { label: 'Total Qty', value: 150 },
  { label: 'Total Value', value: '$2,000' },
];

const commentsColumns = ['Comments'];
const mockComments = [
  { user: 'Admin', date: '2024-07-01', comment: 'Order created.' },
  { user: 'Editor', date: '2024-07-02', comment: 'Checked delivery schedule.' },
];

// Add mock PO Lines data with comprehensive structure from PurchaseOrders.tsx
const mockPOLines = [
  {
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
    'Line Purchase Price': '$10',
    'Line Selling Price': '$15',
    'Supplier': 'Best Supplier',
    'Purchase Currency': 'USD',
    'Selling Currency': 'EUR',
    'Production': 'In Progress',
    'MLA-Purchasing': 'Jane Smith',
    'China-QC': 'Passed',
    'MLA-Planning': 'Planned',
    'MLA-Shipping': 'Pending',
    'Template': 'Standard',
    'Ex-Factory': '2024-07-15',
    'Purchase Order Status': 'Confirmed',
    'Supplier Purchase Currency': 'USD',
    'Customer Selling Currency': 'EUR',
    'Minimum Order Quantity': 100,
    'Purchase Description': 'Cotton T-shirt',
    'Product Type': 'Apparel',
    'Product Sub Type': 'T-shirt',
    'Product Status': 'Active',
    'Product Buyer Style Name': 'Classic Tee',
    'Product Buyer Style Number': 'CT-2024',
    'Standard Minute Value': 12,
    'Costing': '$8',
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
    'PO Key User 6': 'User6',
    'PO Key User 7': 'User7',
    'PO Key User 8': 'User8',
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
  },
  {
    'Order': 'PO-2024-002',
    'Product': 'Widget Y',
    'PO Line': '2',
    'Fit Comment': 'Needs adjustment',
    'Fit Log Status': 'Pending',
    'Fit Log Type': 'Revision',
    'Fit Log Name': 'Summer Fit',
    'Customer': 'Beta Corp',
    'Collection': 'Summer 2024',
    'Division': 'Womenswear',
    'Group': 'B',
    'Transport Method': 'Sea',
    'Deliver To': 'Warehouse 3',
    'Status': 'Confirmed',
    'Delivery Date': '2024-09-15',
    'Comments': 'Standard order',
    'Quantity': 300,
    'Selling Quantity': 300,
    'Line Purchase Price': '$12',
    'Line Selling Price': '$18',
    'Supplier': 'Premium Supplier',
    'Purchase Currency': 'USD',
    'Selling Currency': 'EUR',
    'Production': 'Planned',
    'MLA-Purchasing': 'John Doe',
    'China-QC': 'Pending',
    'MLA-Planning': 'In Progress',
    'MLA-Shipping': 'Not Started',
    'Template': 'Premium',
    'Ex-Factory': '2024-08-20',
    'Purchase Order Status': 'Confirmed',
    'Supplier Purchase Currency': 'USD',
    'Customer Selling Currency': 'EUR',
    'Minimum Order Quantity': 100,
    'Purchase Description': 'Silk Blouse',
    'Product Type': 'Apparel',
    'Product Sub Type': 'Blouse',
    'Product Status': 'Active',
    'Product Buyer Style Name': 'Elegant Blouse',
    'Product Buyer Style Number': 'EB-2024',
    'Standard Minute Value': 15,
    'Costing': '$10',
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
    'Purchase Price': '$12',
    'Selling Price': '$18',
    'Season': 'Summer',
    'Department': 'Production',
    'Customer Parent': 'Beta Group',
    'RECIPIENT PRODUCT SUPPLIER-NUMBER': 'RPS-002',
    'FG PO Number': 'FG-2024-002',
    'Received': 0,
    'Balance': 300,
    'Over Received': 0,
    'Size': 'M',
    'Main Material': 'Silk',
    'Main Material Description': '100% Silk',
    'Delivery Contact': 'Jane Smith',
    'PO Key User 6': 'User6',
    'PO Key User 7': 'User7',
    'PO Key User 8': 'User8',
    'PO Key Working Group 1': 'WG1',
    'PO Key Working Group 2': 'WG2',
    'PO Key Working Group 3': 'WG3',
    'PO Key Working Group 4': 'WG4',
    'Created By': 'Admin',
    'Last Edited': '2024-06-30',
    'Last Edited By': 'Editor',
    'Color': 'Red',
    'Vessel Schedule': 'VS-2024',
    'Buyer PO Number': 'BPO-2024-002',
    'Shipment ID': 'SHIP-002',
    'Factory Invoiced': 'No',
    'Supplier Invoice': 'INV-002',
    'QuickBooks Invoice': 'QB-002',
    'Shipment Noted': 'No',
    'Buy Information': 'Standard',
    'Handling Charges': '$40',
    'Original Forecasts Quantity': 300,
    'Start Date': '2024-07-01',
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
    'Buyer Season': 'Summer',
    'Lookbook': '',
    'Finished Good Testing Status': '',
  },
  {
    'Order': 'PO-2024-003',
    'Product': 'Widget Z',
    'PO Line': '3',
    'Fit Comment': 'Perfect fit',
    'Fit Log Status': 'Approved',
    'Fit Log Type': 'Final',
    'Fit Log Name': 'Fall Fit',
    'Customer': 'Gamma Corp',
    'Collection': 'Fall 2024',
    'Division': 'Accessories',
    'Group': 'C',
    'Transport Method': 'Air',
    'Deliver To': 'Warehouse 1',
    'Status': 'Open',
    'Delivery Date': '2024-10-01',
    'Comments': 'High priority',
    'Quantity': 200,
    'Selling Quantity': 200,
    'Line Purchase Price': '$8',
    'Line Selling Price': '$12',
    'Supplier': 'Fast Supplier',
    'Purchase Currency': 'USD',
    'Selling Currency': 'EUR',
    'Production': 'Completed',
    'MLA-Purchasing': 'Mike Johnson',
    'China-QC': 'Passed',
    'MLA-Planning': 'Completed',
    'MLA-Shipping': 'In Progress',
    'Template': 'Express',
    'Ex-Factory': '2024-09-10',
    'Purchase Order Status': 'Confirmed',
    'Supplier Purchase Currency': 'USD',
    'Customer Selling Currency': 'EUR',
    'Minimum Order Quantity': 50,
    'Purchase Description': 'Leather Bag',
    'Product Type': 'Accessories',
    'Product Sub Type': 'Bag',
    'Product Status': 'Active',
    'Product Buyer Style Name': 'Classic Bag',
    'Product Buyer Style Number': 'CB-2024',
    'Standard Minute Value': 8,
    'Costing': '$6',
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
    'Purchase Price': '$8',
    'Selling Price': '$12',
    'Season': 'Fall',
    'Department': 'Production',
    'Customer Parent': 'Gamma Group',
    'RECIPIENT PRODUCT SUPPLIER-NUMBER': 'RPS-003',
    'FG PO Number': 'FG-2024-003',
    'Received': 0,
    'Balance': 200,
    'Over Received': 0,
    'Size': 'Standard',
    'Main Material': 'Leather',
    'Main Material Description': 'Genuine Leather',
    'Delivery Contact': 'Sarah Wilson',
    'PO Key User 6': 'User6',
    'PO Key User 7': 'User7',
    'PO Key User 8': 'User8',
    'PO Key Working Group 1': 'WG1',
    'PO Key Working Group 2': 'WG2',
    'PO Key Working Group 3': 'WG3',
    'PO Key Working Group 4': 'WG4',
    'Created By': 'Admin',
    'Last Edited': '2024-06-30',
    'Last Edited By': 'Editor',
    'Color': 'Brown',
    'Vessel Schedule': 'VS-2024',
    'Buyer PO Number': 'BPO-2024-003',
    'Shipment ID': 'SHIP-003',
    'Factory Invoiced': 'No',
    'Supplier Invoice': 'INV-003',
    'QuickBooks Invoice': 'QB-003',
    'Shipment Noted': 'No',
    'Buy Information': 'Standard',
    'Handling Charges': '$30',
    'Original Forecasts Quantity': 200,
    'Start Date': '2024-08-01',
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
    'Buyer Season': 'Fall',
    'Lookbook': '',
    'Finished Good Testing Status': '',
  }
];

// Define the columns to show in the PO Lines table (limited to match the original size)
const poLinesColumns = [
  'Order', 'Product', 'PO Line', 'Fit Comment', 'Fit Log Status', 'Fit Log Type', 'Fit Log Name', 
  'Customer', 'Collection', 'Division', 'Group', 'Transport Method', 'Deliver To', 'Status', 
  'Delivery Date', 'Comments', 'Quantity'
];

const PurchaseOrder: React.FC = () => {
  const [rows, setRows] = useState([initialRow]);
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
  const [poDetailsEditMode, setPoDetailsEditMode] = useState(false);
  const [poDetailsForm, setPoDetailsForm] = useState<Record<string, any> | null>(null);

  // Add edit state and form for each tab
  const [deliveryEditMode, setDeliveryEditMode] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState<Record<string, any> | null>(null);
  const [criticalPathEditMode, setCriticalPathEditMode] = useState(false);
  const [criticalPathForm, setCriticalPathForm] = useState<Record<string, any> | null>(null);
  const [auditEditMode, setAuditEditMode] = useState(false);
  const [auditForm, setAuditForm] = useState<Record<string, any> | null>(null);
  const [totalsEditMode, setTotalsEditMode] = useState(false);
  const [totalsForm, setTotalsForm] = useState<Record<string, any> | null>(null);
  const [commentsEditMode, setCommentsEditMode] = useState(false);
  const [commentsForm, setCommentsForm] = useState<Record<string, any> | null>(null);

  // Add edit state for PO Lines
  const [poLinesEditMode, setPoLinesEditMode] = useState(false);
  const [poLinesForm, setPoLinesForm] = useState<Record<string, any>[] | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Record<string, any> | null>(null);
  const [activeProductTab, setActiveProductTab] = useState('Product Details');

  const handleEdit = () => {
    setEditIndex(selectedIndex);
    setEditRow({ ...JSON.parse(JSON.stringify((filteredRows ?? rows)[selectedIndex])) });
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
    if (editRow !== null && editIndex !== null) {
      const newRows = [...(filteredRows ?? rows)];
      newRows[editIndex] = { ...editRow };
      if (filteredRows) {
        const mainRows = [...rows];
        const idxInMain = rows.indexOf(filteredRows[editIndex]);
        if (idxInMain !== -1) mainRows[idxInMain] = { ...editRow };
        setRows(mainRows);
        setFilteredRows(newRows);
      } else {
        setRows(newRows);
      }
      setEditIndex(null);
      setEditRow(null);
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
    const newRows = [ { ...blankRow }, ...(filteredRows ?? rows) ];
    if (filteredRows) {
      const mainRows = [ { ...blankRow }, ...rows ];
      setRows(mainRows);
      setFilteredRows(newRows);
    } else {
      setRows(newRows);
    }
    setSelectedIndex(0);
    setEditIndex(0);
    setEditRow({ ...blankRow });
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
    XLSX.utils.book_append_sheet(wb, ws, 'PurchaseOrders');
    XLSX.writeFile(wb, 'purchase_orders.xlsx');
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
        const newRow: Record<string, any> = { ...blankRow };
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
    
    // Always add Order References first if it's in visibleColumns
    if (visibleColumns.includes('Order References')) {
      cols.push({ label: 'Order References', key: 'Order References' });
    }
    
    // Add all other columns except Order References (since we already added it)
    visibleColumns.forEach(col => {
      if (col !== 'Order References') {
        const group = groupedColumns.find(g => g.key === col);
        if (group) {
          cols.push({ label: group.label, key: group.key, isGroup: true, children: group.children });
        } else {
          cols.push({ label: col, key: col });
        }
      }
    });
    return cols;
  };

  const renderHeaderRows = () => {
    const cols = renderColumns();
    // First row: group headers
    const firstRow = cols.map((col, i) =>
      col.isGroup ? (
        <th key={col.key} colSpan={2} className={`px-2 py-1 border-b text-center whitespace-nowrap${i < cols.length - 1 ? ' border-r-2 border-gray-200' : ''}`}>{col.label}</th>
      ) : col.key === 'Order References' ? (
        <th key={col.key} rowSpan={2} className="sticky left-0 z-20 bg-white px-2 py-1 border-b text-left whitespace-nowrap align-middle border-r-2 border-gray-200">{col.label}</th>
      ) : (
        <th key={col.key} rowSpan={2} className={`px-2 py-1 border-b text-left whitespace-nowrap align-middle${i < cols.length - 1 ? ' border-r-2 border-gray-200' : ''}`}>{col.label}</th>
      )
    );
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

  const subTabs = ['PO Details', 'Delivery', 'Critical Path', 'Audit', 'Totals', 'Comments'];
  const [activeSubTab, setActiveSubTab] = useState('PO Details');

  // Helper functions for subtable editing
  const handleSubTableEdit = (tableType: string) => {
    switch (tableType) {
      case 'poDetails':
        setPoDetailsForm({
          'Order Reference': displayRows[expandedIndex!]?.['Order References'] || '',
          'Supplier': displayRows[expandedIndex!]?.['Supplier'] || '',
          'Purchase Currency': displayRows[expandedIndex!]?.['Purchase Currency'] || '',
          'Status': displayRows[expandedIndex!]?.['Status'] || '',
          'Production': displayRows[expandedIndex!]?.['Production'] || '',
          'MLA- Purchasing': displayRows[expandedIndex!]?.['MLA- Purchasing'] || '',
          'China -QC': displayRows[expandedIndex!]?.['China -QC'] || '',
          'MLA-Planning': displayRows[expandedIndex!]?.['MLA-Planning'] || '',
          'MLA-Shipping': displayRows[expandedIndex!]?.['MLA-Shipping'] || '',
          'Closed Date': displayRows[expandedIndex!]?.['Closed Date'] || '',
          'Selling Currency': displayRows[expandedIndex!]?.['Selling Currency'] || '',
        });
        setPoDetailsEditMode(true);
        break;
      case 'delivery':
        setDeliveryForm({
          'Customer': displayRows[expandedIndex!]?.['Customer'] || '',
          'Deliver To': displayRows[expandedIndex!]?.['Deliver to'] || '',
          'Transport Method': displayRows[expandedIndex!]?.['Transport Method'] || '',
        });
        setDeliveryEditMode(true);
        break;
      case 'criticalPath':
        setCriticalPathForm({
          'Template': displayRows[expandedIndex!]?.['Template'] || '',
          'PO Issue Date': displayRows[expandedIndex!]?.['PO Issue Date'] || '',
        });
        setCriticalPathEditMode(true);
        break;
      case 'audit':
        setAuditForm({
          'Created By': displayRows[expandedIndex!]?.['Created By'] || '',
          'Created': displayRows[expandedIndex!]?.['Created'] || '',
          'Last Edited': displayRows[expandedIndex!]?.['Last Edited'] || '',
        });
        setAuditEditMode(true);
        break;
      case 'totals':
        setTotalsForm({
          'Total Qty': displayRows[expandedIndex!]?.['Total Qty'] || '',
          'Total Cost': displayRows[expandedIndex!]?.['Total Cost'] || '',
          'Total Value': displayRows[expandedIndex!]?.['Total Value'] || '',
        });
        setTotalsEditMode(true);
        break;
      case 'comments':
        setCommentsForm({
          'Comments': displayRows[expandedIndex!]?.['Comments'] || '',
        });
        setCommentsEditMode(true);
        break;
      case 'poLines':
        setPoLinesForm([...mockPOLines]);
        setPoLinesEditMode(true);
        break;
    }
  };

  const handleSubTableSave = (tableType: string) => {
    if (expandedIndex === null) return;

    const newRows = [...(filteredRows ?? rows)];
    const currentRow = { ...newRows[expandedIndex] };

    switch (tableType) {
      case 'poDetails':
        if (poDetailsForm) {
          // Update the main row with form data
          Object.keys(poDetailsForm).forEach(key => {
            if (key === 'Order Reference') {
              currentRow['Order References'] = poDetailsForm[key];
            } else {
              currentRow[key] = poDetailsForm[key];
            }
          });
        }
        setPoDetailsEditMode(false);
        setPoDetailsForm(null);
        break;
      case 'delivery':
        if (deliveryForm) {
          Object.keys(deliveryForm).forEach(key => {
            if (key === 'Deliver To') {
              currentRow['Deliver to'] = deliveryForm[key];
            } else {
              currentRow[key] = deliveryForm[key];
            }
          });
        }
        setDeliveryEditMode(false);
        setDeliveryForm(null);
        break;
      case 'criticalPath':
        if (criticalPathForm) {
          Object.keys(criticalPathForm).forEach(key => {
            currentRow[key] = criticalPathForm[key];
          });
        }
        setCriticalPathEditMode(false);
        setCriticalPathForm(null);
        break;
      case 'audit':
        if (auditForm) {
          Object.keys(auditForm).forEach(key => {
            currentRow[key] = auditForm[key];
          });
        }
        setAuditEditMode(false);
        setAuditForm(null);
        break;
      case 'totals':
        if (totalsForm) {
          Object.keys(totalsForm).forEach(key => {
            currentRow[key] = totalsForm[key];
          });
        }
        setTotalsEditMode(false);
        setTotalsForm(null);
        break;
      case 'comments':
        if (commentsForm) {
          Object.keys(commentsForm).forEach(key => {
            currentRow[key] = commentsForm[key];
          });
        }
        setCommentsEditMode(false);
        setCommentsForm(null);
        break;
      case 'poLines':
        // For PO Lines, we would typically update a separate data structure
        // For now, we'll just close the edit mode
        setPoLinesEditMode(false);
        setPoLinesForm(null);
        break;
    }

    // Update the rows
    newRows[expandedIndex] = currentRow;
    if (filteredRows) {
      const mainRows = [...rows];
      const idxInMain = rows.indexOf(filteredRows[expandedIndex]);
      if (idxInMain !== -1) mainRows[idxInMain] = currentRow;
      setRows(mainRows);
      setFilteredRows(newRows);
    } else {
      setRows(newRows);
    }
  };

  const handleSubTableCancel = (tableType: string) => {
    switch (tableType) {
      case 'poDetails':
        setPoDetailsEditMode(false);
        setPoDetailsForm(null);
        break;
      case 'delivery':
        setDeliveryEditMode(false);
        setDeliveryForm(null);
        break;
      case 'criticalPath':
        setCriticalPathEditMode(false);
        setCriticalPathForm(null);
        break;
      case 'audit':
        setAuditEditMode(false);
        setAuditForm(null);
        break;
      case 'totals':
        setTotalsEditMode(false);
        setTotalsForm(null);
        break;
      case 'comments':
        setCommentsEditMode(false);
        setCommentsForm(null);
        break;
      case 'poLines':
        setPoLinesEditMode(false);
        setPoLinesForm(null);
        break;
    }
  };

  const handlePoLinesChange = (lineIndex: number, field: string, value: string) => {
    if (!poLinesForm) return;
    const newPoLines = [...poLinesForm];
    newPoLines[lineIndex] = { ...newPoLines[lineIndex], [field]: value };
    setPoLinesForm(newPoLines);
  };

  const handleProductClick = (productData: Record<string, any>) => {
    // If the same product is already selected, close it
    if (selectedProductDetails && selectedProductDetails['PO Line'] === productData['PO Line']) {
      setSelectedProductDetails(null);
    } else {
      // Otherwise, select the new product
      setSelectedProductDetails(productData);
      setActiveProductTab('Product Details');
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center mb-4 gap-2 relative">
        <h1 className="text-2xl font-bold mr-4">Purchase Orders</h1>
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
          <div className="absolute z-50 bg-white border rounded shadow p-3 top-12 left-0 mt-4 max-h-72 overflow-y-auto w-64">
            <div className="flex gap-2 mb-2">
              <button className="bg-green-500 text-white px-2 py-1 rounded text-xs" onClick={() => setVisibleColumns(allColumns)}>Select All</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={() => setVisibleColumns([])}>Deselect All</button>
            </div>
            <div className="font-bold mb-2">Select Columns</div>
            {allColumns.map(col => (
              <label key={col} className="flex items-center mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(col)}
                  onChange={() => handleColumnToggle(col)}
                  className="mr-2"
                />
                <span className="text-xs">{col}</span>
              </label>
            ))}
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
        <table className="min-w-full bg-white border border-gray-200 rounded-md text-xs">
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
                  className={
                    (selectedIndex === idx ? 'bg-blue-50 ' : '') +
                    (editIndex === idx ? 'bg-yellow-50' : '')
                  }
                  onClick={() => {
                    setSelectedIndex(idx);
                    const newExpandedIndex = expandedIndex === idx ? null : idx;
                    setExpandedIndex(newExpandedIndex);
                    // Close product details when subtable is closed
                    if (newExpandedIndex === null) {
                      setSelectedProductDetails(null);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {renderColumns().flatMap((col, colIdx, arr) => {
                    if (col.key === 'Order References') {
                      return [
                        <td key={col.key} className="sticky left-0 z-0 bg-white px-2 py-1 border-b align-top whitespace-nowrap border-r-2 border-gray-200"> 
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
                          key={col.key + '-' + subCol}
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
                {expandedIndex === idx && (
                  <tr>
                    <td colSpan={visibleColumns.length} className="bg-transparent p-0 border-none">
                      <div className="sticky left-0 z-30 bg-white w-full shadow-lg p-3 mt-1 overflow-x-auto" style={{ maxWidth: '100vw' }}>
                        <div className="flex flex-row gap-4" style={{ minWidth: '1200px' }}>
                          {/* Left: Tab bar and tab content */}
                          <div className="flex-1 min-w-0 overflow-x-auto">
                            <div className="mb-2 flex gap-1 border-b border-blue-200">
                              {subTabs.map(tab => (
                                <button
                                  key={tab}
                                  className={`px-2 py-1 -mb-px rounded-t text-xs font-medium transition-colors border-b-2 ${activeSubTab === tab ? 'bg-white border-blue-500 text-blue-700' : 'bg-blue-50 border-transparent text-gray-600 hover:text-blue-600'}`}
                                  onClick={() => setActiveSubTab(tab)}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>
                            {/* Tab content */}
                            {activeSubTab === 'PO Details' && (
                              <>
                                <div className="font-semibold text-blue-700 mb-1 text-xs">Purchase Order Details</div>
                                <div className="overflow-x-auto" style={{ maxWidth: '800px' }}>
                                  <table className="text-xs border border-blue-200 rounded-md mb-1" style={{ minWidth: '600px' }}>
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {poDetailsColumns.map(col => (
                                        <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      {poDetailsColumns.map(col => (
                                        <td key={col} className="px-1 py-0.5">
                                          {poDetailsEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={poDetailsForm?.[col] ?? ''}
                                              onChange={e => setPoDetailsForm(f => ({ ...(f || {}), [col]: e.target.value }))}
                                            />
                                          ) : (
                                            col === 'Order Reference'
                                              ? displayRows[expandedIndex]?.['Order References'] || ''
                                              : displayRows[expandedIndex]?.[col] || ''
                                          )}
                                        </td>
                                      ))}
                                    </tr>
                                  </tbody>
                                </table>
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {!poDetailsEditMode ? (
                                    <button
                                      className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                      onClick={() => handleSubTableEdit('poDetails')}
                                    >
                                      <EditIcon className="w-2 h-2" /> Edit
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        className="bg-green-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                        onClick={() => handleSubTableSave('poDetails')}
                                      >
                                        <SaveIcon className="w-2 h-2" /> Save
                                      </button>
                                      <button
                                        className="bg-red-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                        onClick={() => handleSubTableCancel('poDetails')}
                                      >
                                        <X className="w-2 h-2" /> Cancel
                                      </button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                            {activeSubTab === 'Delivery' && (
                              <>
                                <div className="font-semibold text-blue-700 mb-1 text-xs">Delivery</div>
                                <div className="overflow-x-auto" style={{ maxWidth: '500px' }}>
                                  <table className="text-xs border border-blue-200 rounded-md mb-1" style={{ minWidth: '400px' }}>
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {deliveryDetailsColumns.map(col => (
                                        <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="px-1 py-0.5">
                                        {deliveryEditMode ? (
                                          <input
                                            className="border px-0.5 py-0 rounded w-full text-xs"
                                            value={deliveryForm?.['Customer'] ?? ''}
                                            onChange={e => setDeliveryForm(f => ({ ...(f || {}), 'Customer': e.target.value }))}
                                          />
                                        ) : (
                                          displayRows[expandedIndex]?.['Customer'] || ''
                                        )}
                                      </td>
                                      <td className="px-1 py-0.5">
                                        {deliveryEditMode ? (
                                          <input
                                            className="border px-0.5 py-0 rounded w-full text-xs"
                                            value={deliveryForm?.['Deliver To'] ?? ''}
                                            onChange={e => setDeliveryForm(f => ({ ...(f || {}), 'Deliver To': e.target.value }))}
                                          />
                                        ) : (
                                          displayRows[expandedIndex]?.['Deliver to'] || ''
                                        )}
                                      </td>
                                      <td className="px-1 py-0.5">
                                        {deliveryEditMode ? (
                                          <input
                                            className="border px-0.5 py-0 rounded w-full text-xs"
                                            value={deliveryForm?.['Transport Method'] ?? ''}
                                            onChange={e => setDeliveryForm(f => ({ ...(f || {}), 'Transport Method': e.target.value }))}
                                          />
                                        ) : (
                                          displayRows[expandedIndex]?.['Transport Method'] || ''
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {!deliveryEditMode ? (
                                    <button
                                      className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                      onClick={() => handleSubTableEdit('delivery')}
                                    >
                                      <EditIcon className="w-2 h-2" /> Edit
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        className="bg-green-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                        onClick={() => handleSubTableSave('delivery')}
                                      >
                                        <SaveIcon className="w-2 h-2" /> Save
                                      </button>
                                      <button
                                        className="bg-red-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                        onClick={() => handleSubTableCancel('delivery')}
                                      >
                                        <X className="w-2 h-2" /> Cancel
                                      </button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                            {activeSubTab === 'Critical Path' && (
                              <>
                                <div className="font-semibold text-blue-700 mb-1 text-xs">Critical Path</div>
                                <div className="overflow-x-auto" style={{ maxWidth: '500px' }}>
                                  <table className="text-xs border border-blue-200 rounded-md mb-1" style={{ minWidth: '300px' }}>
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {criticalPathColumns.map(col => (
                                        <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="px-1 py-0.5">
                                        {criticalPathEditMode ? (
                                          <input
                                            className="border px-0.5 py-0 rounded w-full text-xs"
                                            value={criticalPathForm?.['Template'] ?? ''}
                                            onChange={e => setCriticalPathForm(f => ({ ...(f || {}), 'Template': e.target.value }))}
                                          />
                                        ) : (
                                          displayRows[expandedIndex]?.['Template'] || ''
                                        )}
                                      </td>
                                      <td className="px-1 py-0.5">
                                        {criticalPathEditMode ? (
                                          <input
                                            className="border px-0.5 py-0 rounded w-full text-xs"
                                            value={criticalPathForm?.['PO Issue Date'] ?? ''}
                                            onChange={e => setCriticalPathForm(f => ({ ...(f || {}), 'PO Issue Date': e.target.value }))}
                                          />
                                        ) : (
                                          displayRows[expandedIndex]?.['PO Issue Date'] || ''
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {!criticalPathEditMode ? (
                                    <button
                                      className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                      onClick={() => handleSubTableEdit('criticalPath')}
                                    >
                                      <EditIcon className="w-2 h-2" /> Edit
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        className="bg-green-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                        onClick={() => handleSubTableSave('criticalPath')}
                                      >
                                        <SaveIcon className="w-2 h-2" /> Save
                                      </button>
                                      <button
                                        className="bg-red-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                        onClick={() => handleSubTableCancel('criticalPath')}
                                      >
                                        <X className="w-2 h-2" /> Cancel
                                      </button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                            {activeSubTab === 'Audit' && (
                              <>
                                <div className="font-semibold text-blue-700 mb-1 text-xs">Audit</div>
                                <table className="text-xs border border-blue-200 rounded-md mb-1 w-full">
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {auditColumns.map(col => (
                                        <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="px-1 py-0.5">
                                        {auditEditMode ? (
                                          <input
                                            className="border px-0.5 py-0 rounded w-full text-xs"
                                            value={auditForm?.['Created By'] ?? ''}
                                            onChange={e => setAuditForm(f => ({ ...(f || {}), 'Created By': e.target.value }))}
                                          />
                                        ) : (
                                          displayRows[expandedIndex]?.['Created By'] || ''
                                        )}
                                      </td>
                                      <td className="px-1 py-0.5">
                                        {auditEditMode ? (
                                          <input
                                            className="border px-0.5 py-0 rounded w-full text-xs"
                                            value={auditForm?.['Created'] ?? ''}
                                            onChange={e => setAuditForm(f => ({ ...(f || {}), 'Created': e.target.value }))}
                                          />
                                        ) : (
                                          displayRows[expandedIndex]?.['Created'] || ''
                                        )}
                                      </td>
                                      <td className="px-1 py-0.5">
                                        {auditEditMode ? (
                                          <input
                                            className="border px-0.5 py-0 rounded w-full text-xs"
                                            value={auditForm?.['Last Edited'] ?? ''}
                                            onChange={e => setAuditForm(f => ({ ...(f || {}), 'Last Edited': e.target.value }))}
                                          />
                                        ) : (
                                          displayRows[expandedIndex]?.['Last Edited'] || ''
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="flex gap-1 mt-1">
                                  {!auditEditMode ? (
                                    <button
                                      className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                      onClick={() => handleSubTableEdit('audit')}
                                    >
                                      <EditIcon className="w-2 h-2" /> Edit
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        className="bg-green-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                        onClick={() => handleSubTableSave('audit')}
                                      >
                                        <SaveIcon className="w-2 h-2" /> Save
                                      </button>
                                      <button
                                        className="bg-red-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                        onClick={() => handleSubTableCancel('audit')}
                                      >
                                        <X className="w-2 h-2" /> Cancel
                                      </button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                            {activeSubTab === 'Totals' && (
                              <>
                                <div className="font-semibold text-blue-700 mb-1 text-xs">Totals</div>
                                <table className="text-xs border border-blue-200 rounded-md mb-1 w-full">
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {totalsColumns.map(col => (
                                        <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="px-1 py-0.5">
                                        {totalsEditMode ? (
                                          <input
                                            className="border px-0.5 py-0 rounded w-full text-xs"
                                            value={totalsForm?.['Total Qty'] ?? ''}
                                            onChange={e => setTotalsForm(f => ({ ...(f || {}), 'Total Qty': e.target.value }))}
                                          />
                                        ) : (
                                          displayRows[expandedIndex]?.['Total Qty'] || ''
                                        )}
                                      </td>
                                      <td className="px-1 py-0.5">
                                        {totalsEditMode ? (
                                          <input
                                            className="border px-0.5 py-0 rounded w-full text-xs"
                                            value={totalsForm?.['Total Cost'] ?? ''}
                                            onChange={e => setTotalsForm(f => ({ ...(f || {}), 'Total Cost': e.target.value }))}
                                          />
                                        ) : (
                                          displayRows[expandedIndex]?.['Total Cost'] || ''
                                        )}
                                      </td>
                                      <td className="px-1 py-0.5">
                                        {totalsEditMode ? (
                                          <input
                                            className="border px-0.5 py-0 rounded w-full text-xs"
                                            value={totalsForm?.['Total Value'] ?? ''}
                                            onChange={e => setTotalsForm(f => ({ ...(f || {}), 'Total Value': e.target.value }))}
                                          />
                                        ) : (
                                          displayRows[expandedIndex]?.['Total Value'] || ''
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="flex gap-1 mt-1">
                                  {!totalsEditMode ? (
                                    <button
                                      className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                      onClick={() => handleSubTableEdit('totals')}
                                    >
                                      <EditIcon className="w-2 h-2" /> Edit
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        className="bg-green-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                        onClick={() => handleSubTableSave('totals')}
                                      >
                                        <SaveIcon className="w-2 h-2" /> Save
                                      </button>
                                      <button
                                        className="bg-red-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                        onClick={() => handleSubTableCancel('totals')}
                                      >
                                        <X className="w-2 h-2" /> Cancel
                                      </button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                            {activeSubTab === 'Comments' && (
                              <>
                                <div className="font-semibold text-blue-700 mb-1 text-xs">Comments</div>
                                <table className="text-xs border border-blue-200 rounded-md mb-1 w-full">
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {commentsColumns.map(col => (
                                        <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="px-1 py-0.5">
                                        {commentsEditMode ? (
                                          <textarea
                                            className="border px-0.5 py-0 rounded w-full text-xs resize-none"
                                            rows={2}
                                            value={commentsForm?.['Comments'] ?? ''}
                                            onChange={e => setCommentsForm(f => ({ ...(f || {}), 'Comments': e.target.value }))}
                                          />
                                        ) : (
                                          displayRows[expandedIndex]?.['Comments'] || ''
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="flex gap-1 mt-1">
                                  {!commentsEditMode ? (
                                    <button
                                      className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                      onClick={() => handleSubTableEdit('comments')}
                                    >
                                      <EditIcon className="w-2 h-2" /> Edit
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        className="bg-green-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                        onClick={() => handleSubTableSave('comments')}
                                      >
                                        <SaveIcon className="w-2 h-2" /> Save
                                      </button>
                                      <button
                                        className="bg-red-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                        onClick={() => handleSubTableCancel('comments')}
                                      >
                                        <X className="w-2 h-2" /> Cancel
                                      </button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                          {/* Right: PO Lines table */}
                          <div className="flex-1 min-w-0 overflow-x-auto">
                            <div className="font-semibold text-blue-700 mb-1 text-xs">PO Lines</div>
                            <div className="overflow-x-auto" style={{ maxWidth: '600px' }}>
                              <table className="text-xs border border-blue-200 rounded-md mb-1" style={{ minWidth: '800px' }}>
                                <thead className="bg-blue-100">
                                  <tr>
                                    {poLinesColumns.map(col => (
                                      <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs whitespace-nowrap">{col}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {(poLinesEditMode ? poLinesForm : mockPOLines)?.map((line, index) => (
                                    <tr key={line['PO Line']}>
                                      {poLinesColumns.map(col => (
                                        <td key={col} className="px-1 py-0.5 whitespace-nowrap">
                                          {poLinesEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={(line as any)[col] || ''}
                                              onChange={e => handlePoLinesChange(index, col, e.target.value)}
                                            />
                                          ) : col === 'Product' ? (
                                            <button
                                              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-xs"
                                              onClick={() => handleProductClick(line)}
                                            >
                                              {(line as any)[col] || ''}
                                            </button>
                                          ) : (
                                            (line as any)[col] || ''
                                          )}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex gap-1 mt-1">
                              {!poLinesEditMode ? (
                                <button
                                  className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                  onClick={() => handleSubTableEdit('poLines')}
                                >
                                  <EditIcon className="w-2 h-2" /> Edit
                                </button>
                              ) : (
                                <>
                                  <button
                                    className="bg-green-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                    onClick={() => handleSubTableSave('poLines')}
                                  >
                                    <SaveIcon className="w-2 h-2" /> Save
                                  </button>
                                  <button
                                    className="bg-red-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1"
                                    onClick={() => handleSubTableCancel('poLines')}
                                  >
                                    <X className="w-2 h-2" /> Cancel
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {/* Product Details Table */}
            {selectedProductDetails && (
              <tr>
                <td colSpan={visibleColumns.length} className="bg-transparent p-0 border-none">
                  <div className="bg-white w-full shadow-lg p-3 mt-2">
                    <div className="font-semibold text-blue-700 mb-2 text-sm">Product Details</div>
                    <div className="mb-2 flex gap-1 border-b border-blue-200">
                      {['Product Details', 'Critical Path', 'Images', 'Comments', 'Bill Of Materials', 'Activities', 'Colorways'].map(tab => (
                        <button
                          key={tab}
                          className={`px-2 py-1 -mb-px rounded-t text-xs font-medium transition-colors border-b-2 ${activeProductTab === tab ? 'bg-white border-blue-500 text-blue-700' : 'bg-blue-50 border-transparent text-gray-600 hover:text-blue-600'}`}
                          onClick={() => setActiveProductTab(tab)}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    {/* Tab content */}
                    {activeProductTab === 'Product Details' && (
                      <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
                        <table className="text-xs border border-blue-200 rounded-md w-full">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Field</th>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">M88 Ref</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['RECIPIENT PRODUCT SUPPLIER-NUMBER'] || ''}</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Buyer Style Number</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Product Buyer Style Number'] || ''}</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Buyer Style Name</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Product Buyer Style Name'] || ''}</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Customer</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Customer'] || ''}</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Department</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Department'] || ''}</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Status</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Product Status'] || ''}</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Description</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Purchase Description'] || ''}</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Product Type</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Product Type'] || ''}</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Season</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Season'] || ''}</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Product Development</td>
                              <td className="px-2 py-1 border-t border-blue-100">-</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Tech Design</td>
                              <td className="px-2 py-1 border-t border-blue-100">-</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">China - QC</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['China-QC'] || ''}</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Lookbook</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Lookbook'] || '-'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                    {activeProductTab === 'Critical Path' && (
                      <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
                        <table className="text-xs border border-blue-200 rounded-md w-full">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Milestone</th>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Target Date</th>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Completed Date</th>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Order Placement</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Order Placement']?.['Target Date'] || ''}</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Order Placement']?.['Completed Date'] || ''}</td>
                              <td className="px-2 py-1 border-t border-blue-100">-</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Production Start</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Production'] || ''}</td>
                              <td className="px-2 py-1 border-t border-blue-100">-</td>
                              <td className="px-2 py-1 border-t border-blue-100">-</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">Ex-Factory</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Ex-Factory'] || ''}</td>
                              <td className="px-2 py-1 border-t border-blue-100">-</td>
                              <td className="px-2 py-1 border-t border-blue-100">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                    {activeProductTab === 'Images' && (
                      <div className="p-4 text-center text-gray-500">
                        <p>No images available for this product.</p>
                      </div>
                    )}
                    {activeProductTab === 'Comments' && (
                      <div className="p-4">
                        <textarea
                          className="w-full border border-blue-200 rounded-md p-2 text-xs"
                          rows={4}
                          placeholder="Add comments about this product..."
                          defaultValue={selectedProductDetails['Comments'] || ''}
                        />
                      </div>
                    )}
                    {activeProductTab === 'Bill Of Materials' && (
                      <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
                        <table className="text-xs border border-blue-200 rounded-md w-full">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Material</th>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Description</th>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">{selectedProductDetails['Main Material'] || ''}</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Main Material Description'] || ''}</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Quantity'] || ''}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                    {activeProductTab === 'Activities' && (
                      <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
                        <table className="text-xs border border-blue-200 rounded-md w-full">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Activity</th>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Status</th>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">MLA-Purchasing</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['MLA-Purchasing'] || ''}</td>
                              <td className="px-2 py-1 border-t border-blue-100">-</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">MLA-Planning</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['MLA-Planning'] || ''}</td>
                              <td className="px-2 py-1 border-t border-blue-100">-</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">MLA-Shipping</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['MLA-Shipping'] || ''}</td>
                              <td className="px-2 py-1 border-t border-blue-100">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                    {activeProductTab === 'Colorways' && (
                      <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
                        <table className="text-xs border border-blue-200 rounded-md w-full">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Color</th>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Size</th>
                              <th className="px-2 py-1 text-left font-semibold text-xs">Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-2 py-1 border-t border-blue-100 font-medium">{selectedProductDetails['Color'] || ''}</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Size'] || ''}</td>
                              <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Quantity'] || ''}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="flex justify-end mt-2">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        onClick={() => setSelectedProductDetails(null)}
                      >
                        Close Details
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
            {displayRows.length === 0 && (
              <tr><td colSpan={visibleColumns.reduce((acc, col) => {
                const group = groupedColumns.find(g => g.key === col);
                return acc + (group ? 2 : 1);
              }, 0)} className="text-center py-4 text-gray-400">No results found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrder; 