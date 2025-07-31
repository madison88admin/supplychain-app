import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { ChevronDown, ChevronRight, Upload, Edit as EditIcon, Save as SaveIcon, Copy as CopyIcon, Plus, Filter as FilterIcon, Download, X, Trash2, Search, Eye } from 'lucide-react';
import PurchaseOrderEditModal from '../components/modals/PurchaseOrderEditModal';

// Define grouped columns (from Downloads file)
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

  // Subtable state variables (from Downloads file)
  const [activeSubTab, setActiveSubTab] = useState('PO Details');
  const [activeProductTab, setActiveProductTab] = useState('Product Details');
  
  // Order subtable edit states
  const [poDetailsEditIdx, setPoDetailsEditIdx] = useState<number | null>(null);
  const [poDetailsForm, setPoDetailsForm] = useState<Record<string, any> | null>(null);
  const [deliveryEdit, setDeliveryEdit] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState<Record<string, any> | null>(null);
  const [criticalPathEdit, setCriticalPathEdit] = useState(false);
  const [criticalPathForm, setCriticalPathForm] = useState<Record<string, any> | null>(null);
  const [auditEdit, setAuditEdit] = useState(false);
  const [auditForm, setAuditForm] = useState<Record<string, any> | null>(null);
  const [totalsEdit, setTotalsEdit] = useState(false);
  const [totalsForm, setTotalsForm] = useState<Record<string, any> | null>(null);

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Product subtable edit states
  const [productEditTab, setProductEditTab] = useState('Product Details');
  const [productDetailsEdit, setProductDetailsEdit] = useState(false);
  const [productDetailsForm, setProductDetailsForm] = useState<Record<string, any> | null>(null);
  const [productCriticalEdit, setProductCriticalEdit] = useState(false);
  const [productCriticalForm, setProductCriticalForm] = useState<Record<string, any> | null>(null);
  const [productImagesEdit, setProductImagesEdit] = useState(false);
  const [productImagesForm, setProductImagesForm] = useState<Record<string, any> | null>(null);
  const [productCommentsEdit, setProductCommentsEdit] = useState(false);
  const [productCommentsForm, setProductCommentsForm] = useState<Record<string, any> | null>(null);
  const [productBOMEdit, setProductBOMEdit] = useState(false);
  const [productBOMForm, setProductBOMForm] = useState<any[]>([]);
  const [productActivitiesEdit, setProductActivitiesEdit] = useState(false);
  const [productActivitiesForm, setProductActivitiesForm] = useState<any[]>([]);
    const [productColorwaysEdit, setProductColorwaysEdit] = useState(false);
  const [productColorwaysForm, setProductColorwaysForm] = useState<any[]>([]);

  // Tech Packs subtable states
  const [techPacksEditTab, setTechPacksEditTab] = useState('Tech Pack Version');
  const [techPacksBOMEdit, setTechPacksBOMEdit] = useState(false);
  const [techPacksBOMForm, setTechPacksBOMForm] = useState<any[]>([]);
  
  // Add state for Specification tab
  const [specificationTab, setSpecificationTab] = useState('Size Chart');
  
  // Add state for Tech Pack Version edit mode and form
  const [techPackVersionEdit, setTechPackVersionEdit] = useState(false);
  const [techPackVersionForm, setTechPackVersionForm] = useState<any>(null);
  
  // Add state for Fibre Composition sections
  const [fibreSections, setFibreSections] = useState<number[]>([1, 2, 3]);
  const [fibreSectionNames, setFibreSectionNames] = useState<{[key: number]: string}>({
    1: 'Fibre Section 1',
    2: 'Fibre Section 2', 
    3: 'Fibre Section 3'
  });
  
  // Add state for Version Control edit mode
  const [versionControlEdit, setVersionControlEdit] = useState(false);
  const [versionControlData, setVersionControlData] = useState({
    versionNumber: '',
    comment: '',
    currentVersion: false,
    createdBy: 'Admin',
    created: new Date().toLocaleString()
  });

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

  // Sample BOM data for Techpacks
  const sampleBOMData = [
    {
      'Material': 'FAB001',
      'Material Description': 'Cotton Jersey Knit',
      'Material Status': 'Active',
      'Material Category': 'Fabric',
      'Comment': 'Main body fabric',
      'Custom Text 1': '',
      'Custom Text 2': '',
      'Custom Text 3': '',
      'Custom Text 4': '',
      'Season': 'FH:2018',
      'Note Count': '2',
      'Latest Note': '2024-01-15',
      'Main Material': 'Yes',
      'Category Sequence': '1',
      'Default Material Color': 'Navy',
      'Composition': '100% Cotton',
      'Buyer Style Name': 'ARC-Merbau/Aurora',
      'Supplier Ref.': 'SUP001',
      'Buyer Style Number': 'U53180654',
      'Default Size': 'L',
      'Default Rating': '4.0',
      'One Size Size': 'XL',
      'One Size Rating': '3.5'
    },
    {
      'Material': 'THR002',
      'Material Description': 'Polyester Thread',
      'Material Status': 'Active',
      'Material Category': 'Thread',
      'Comment': 'Stitching thread',
      'Custom Text 1': '',
      'Custom Text 2': '',
      'Custom Text 3': '',
      'Custom Text 4': '',
      'Season': 'FH:2018',
      'Note Count': '1',
      'Latest Note': '2024-01-10',
      'Main Material': 'No',
      'Category Sequence': '2',
      'Default Material Color': 'Black',
      'Composition': '100% Polyester',
      'Buyer Style Name': 'ARC-Merbau/Aurora',
      'Supplier Ref.': 'SUP002',
      'Buyer Style Number': 'U53180654',
      'Default Size': 'L',
      'Default Rating': '4.2',
      'One Size Size': 'XXL',
      'One Size Rating': '3.0'
    }
  ];

  // Comments state for Order subtable
  const [commentsValue, setCommentsValue] = useState('');
  const [commentsEdit, setCommentsEdit] = useState(false);

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
                            aria-label={expandedProductIndex === idx ? 'Collapse product details' : 'Expand product details'}
                          >
                            {expandedProductIndex === idx ? <ChevronDown className="inline h-4 w-4" /> : <ChevronRight className="inline h-4 w-4" />}
                            <span className="font-medium text-gray-900">{row[col.key] || ''}</span>
                          </td>
                      ];
                    }
                    // Regular columns without expandable subtables
                    if (!col.isGroup) {
                      return [
                        <td key={col.key} className={`px-3 py-3 border-b align-top whitespace-nowrap${colIdx < arr.length - 1 ? ' border-r-2 border-gray-200' : ''}`}>
                          <span className="font-medium text-gray-900">{row[col.key] || ''}</span>
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
                        {/* Subtable Content */}
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
                                      const newRows = [...rows];
                                      newRows[idx] = { ...row, ...poDetailsForm };
                                      setRows(newRows);
                                      setPoDetailsEditIdx(null);
                                      setPoDetailsForm(null);
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setPoDetailsEditIdx(null); setPoDetailsForm(null); }}>Cancel</button>
                                  </>
                                ) : (
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => { setPoDetailsEditIdx(idx); setPoDetailsForm({ ...row }); }}>Edit</button>
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
                    <td colSpan={renderColumns().reduce((acc, col) => acc + (col.isGroup ? 2 : 1), 0) + 1} className="bg-blue-50 px-6 py-4 sticky left-0 z-10">
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
                                <tr><td className="px-2 py-1 font-semibold w-32">M88 Ref</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['M88 Ref'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'M88 Ref': e.target.value}))} /> : row['M88 Ref'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Buyer Style Number</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['Product Buyer Style Number'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'Product Buyer Style Number': e.target.value}))} /> : row['Product Buyer Style Number'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Buyer Style Name</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['Product Buyer Style Name'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'Product Buyer Style Name': e.target.value}))} /> : row['Product Buyer Style Name'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Customer</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['Customer'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'Customer': e.target.value}))} /> : row['Customer'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Department</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['Department'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'Department': e.target.value}))} /> : row['Department'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Status</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['Product Status'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'Product Status': e.target.value}))} /> : row['Product Status'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Description</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['Purchase Description'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'Purchase Description': e.target.value}))} /> : row['Purchase Description'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Product Type</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['Product Type'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'Product Type': e.target.value}))} /> : row['Product Type'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Season</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['Season'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'Season': e.target.value}))} /> : row['Season'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Product Development</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['Product Development'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'Product Development': e.target.value}))} /> : row['Product Development'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Tech Design</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['Tech Design'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'Tech Design': e.target.value}))} /> : row['Tech Design'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">China - QC</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['China-QC'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'China-QC': e.target.value}))} /> : row['China-QC'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Lookbook</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['Lookbook'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'Lookbook': e.target.value}))} /> : row['Lookbook'] || ''}</td></tr>
                                <tr><td className="px-2 py-1 font-semibold w-32">Supplier</td><td className="px-2 py-1">{productDetailsEdit ? <input className="border px-1 py-0.5 rounded text-sm" value={productDetailsForm?.['Supplier'] || ''} onChange={e => setProductDetailsForm((f: any) => ({...f, 'Supplier': e.target.value}))} /> : row['Supplier'] || ''}</td></tr>
                              </tbody>
                            </table>
                            <div className="flex gap-2 mt-2">
                              {productDetailsEdit ? (
                                <>
                                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                    const newRows = [...rows];
                                    newRows[idx] = { ...row, ...productDetailsForm };
                                    setRows(newRows);
                                    setProductDetailsEdit(false);
                                    setProductDetailsForm(null);
                                  }}>Save</button>
                                  <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => { setProductDetailsEdit(false); setProductDetailsForm(null); }}>Cancel</button>
                                </>
                              ) : (
                                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => { setProductDetailsEdit(true); setProductDetailsForm({
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
                          <div className="w-full overflow-x-auto">
                            <table className="text-sm border border-blue-200 rounded my-2" style={{ marginBottom: '12px' }}>
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 font-semibold w-20">BOM Lines</th>
                                  <th className="px-2 py-1 font-semibold w-32">Bill of Material Line Ref.</th>
                                  <th className="px-2 py-1 font-semibold w-28">Bill Of Material category</th>
                                  <th className="px-2 py-1 font-semibold w-24">Comment</th>
                                  <th className="px-2 py-1 font-semibold w-24">Custom Text 1</th>
                                  <th className="px-2 py-1 font-semibold w-24">Custom Text 2</th>
                                  <th className="px-2 py-1 font-semibold w-24">Custom Text 3</th>
                                  <th className="px-2 py-1 font-semibold w-24">Custom Text 4</th>
                                  <th className="px-2 py-1 font-semibold w-24">Material</th>
                                  <th className="px-2 py-1 font-semibold w-32">Material Description</th>
                                  <th className="px-2 py-1 font-semibold w-20">Season</th>
                                  <th className="px-2 py-1 font-semibold w-24">Main Material</th>
                                  <th className="px-2 py-1 font-semibold w-28">Category Sequence</th>
                                  <th className="px-2 py-1 font-semibold w-32">Default Material Color</th>
                                  <th className="px-2 py-1 font-semibold w-24">Composition</th>
                                  <th className="px-2 py-1 font-semibold w-20">Actions</th>
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
                          <div className="w-full overflow-x-auto">
                            <table className="text-sm border border-blue-200 rounded my-2" style={{ marginBottom: '12px' }}>
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 font-semibold w-24">EntityName</th>
                                  <th className="px-2 py-1 font-semibold w-20">Overdue</th>
                                  <th className="px-2 py-1 font-semibold w-28">Activity</th>
                                  <th className="px-2 py-1 font-semibold w-24">Target Date</th>
                                  <th className="px-2 py-1 font-semibold w-24">Expected Date</th>
                                  <th className="px-2 py-1 font-semibold w-16">Color</th>
                                  <th className="px-2 py-1 font-semibold w-20">Actions</th>
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
                          <div className="w-full overflow-x-auto">
                            <table className="text-sm border border-blue-200 rounded my-2" style={{ marginBottom: '12px' }}>
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 font-semibold w-16">Active</th>
                                  <th className="px-2 py-1 font-semibold w-20">Status</th>
                                  <th className="px-2 py-1 font-semibold w-28">Product Sub Type</th>
                                  <th className="px-2 py-1 font-semibold w-24">Collection</th>
                                  <th className="px-2 py-1 font-semibold w-20">Template</th>
                                  <th className="px-2 py-1 font-semibold w-32">Product Color Key Date</th>
                                  <th className="px-2 py-1 font-semibold w-24">Closed Date</th>
                                  <th className="px-2 py-1 font-semibold w-16">Color</th>
                                  <th className="px-2 py-1 font-semibold w-28">Color Description</th>
                                  <th className="px-2 py-1 font-semibold w-24">Color Family</th>
                                  <th className="px-2 py-1 font-semibold w-24">Color Standard</th>
                                  <th className="px-2 py-1 font-semibold w-28">Color External Ref.</th>
                                  <th className="px-2 py-1 font-semibold w-28">Color External Ref. 2.</th>
                                  <th className="px-2 py-1 font-semibold w-24">Approved to SMS</th>
                                  <th className="px-2 py-1 font-semibold w-24">Approved to Bulk</th>
                                  <th className="px-2 py-1 font-semibold w-24">In Development</th>
                                  <th className="px-2 py-1 font-semibold w-20">Actions</th>
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
                            <div className="inline-block w-full">
                              <div className="mb-3">
                                <h4 className="font-semibold text-gray-700 mb-1 text-sm">Version Control</h4>
                                <div className="overflow-x-auto">
                                  <table className="text-xs border border-gray-300 rounded mb-1">
                                    <thead>
                                      <tr className="bg-gray-50">
                                        <th className="px-1 py-0.5 text-left font-semibold border w-20">Version Number</th>
                                        <th className="px-1 py-0.5 text-left font-semibold border w-24">Comment</th>
                                        <th className="px-1 py-0.5 text-left font-semibold border w-28">Bill of Material Version</th>
                                        <th className="px-1 py-0.5 text-left font-semibold border w-28">Size Specification Version</th>
                                        <th className="px-1 py-0.5 text-left font-semibold border w-28">Care Instruction Version</th>
                                        <th className="px-1 py-0.5 text-left font-semibold border w-28">Fibre Composition Version</th>
                                        <th className="px-1 py-0.5 text-left font-semibold border w-20">Label Version</th>
                                        <th className="px-1 py-0.5 text-left font-semibold border w-16">Fit Log</th>
                                        <th className="px-1 py-0.5 text-center font-semibold border w-20">Current Version</th>
                                        <th className="px-1 py-0.5 text-left font-semibold border w-20">Created By</th>
                                        <th className="px-1 py-0.5 text-left font-semibold border w-24">Created</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="hover:bg-gray-50">
                                        <td className="px-1 py-0.5 border text-xs">v1.0</td>
                                        <td className="px-1 py-0.5 border text-xs">Initial version</td>
                                        <td className="px-1 py-0.5 border text-xs">BOM-001</td>
                                        <td className="px-1 py-0.5 border text-xs">SS-001</td>
                                        <td className="px-1 py-0.5 border text-xs">CI-001</td>
                                        <td className="px-1 py-0.5 border text-xs">FC-001</td>
                                        <td className="px-1 py-0.5 border text-xs">L-001</td>
                                        <td className="px-1 py-0.5 border text-xs">FL-001</td>
                                        <td className="px-1 py-0.5 border text-xs text-center">
                                          <div className="w-3 h-3 bg-blue-500 border rounded flex items-center justify-center mx-auto">
                                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                      </div>
                    </td>
                                        <td className="px-1 py-0.5 border text-xs">John Doe</td>
                                        <td className="px-1 py-0.5 border text-xs">2024-01-15</td>
                  </tr>
                                      <tr className="hover:bg-gray-50">
                                        <td className="px-1 py-0.5 border text-xs">v1.1</td>
                                        <td className="px-1 py-0.5 border text-xs">Updated materials</td>
                                        <td className="px-1 py-0.5 border text-xs">BOM-002</td>
                                        <td className="px-1 py-0.5 border text-xs">SS-001</td>
                                        <td className="px-1 py-0.5 border text-xs">CI-001</td>
                                        <td className="px-1 py-0.5 border text-xs">FC-002</td>
                                        <td className="px-1 py-0.5 border text-xs">L-001</td>
                                        <td className="px-1 py-0.5 border text-xs">FL-002</td>
                                        <td className="px-1 py-0.5 border text-xs text-center">
                                          <div className="w-3 h-3 bg-gray-300 border rounded mx-auto"></div>
                                        </td>
                                        <td className="px-1 py-0.5 border text-xs">Jane Smith</td>
                                        <td className="px-1 py-0.5 border text-xs">2024-01-20</td>
                                      </tr>
                                      <tr className="hover:bg-gray-50">
                                        <td className="px-1 py-0.5 border text-xs">v1.2</td>
                                        <td className="px-1 py-0.5 border text-xs">Size adjustments</td>
                                        <td className="px-1 py-0.5 border text-xs">BOM-002</td>
                                        <td className="px-1 py-0.5 border text-xs">SS-002</td>
                                        <td className="px-1 py-0.5 border text-xs">CI-002</td>
                                        <td className="px-1 py-0.5 border text-xs">FC-002</td>
                                        <td className="px-1 py-0.5 border text-xs">L-002</td>
                                        <td className="px-1 py-0.5 border text-xs">FL-003</td>
                                        <td className="px-1 py-0.5 border text-xs text-center">
                                          <div className="w-3 h-3 bg-gray-300 border rounded mx-auto"></div>
                                        </td>
                                        <td className="px-1 py-0.5 border text-xs">Mike Johnson</td>
                                        <td className="px-1 py-0.5 border text-xs">2024-01-25</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
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
                              <div className="mb-2 flex gap-2">
                                {techPacksBOMEdit ? (
                                  <>
                                    <button 
                                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                      onClick={() => {
                                        setTechPacksBOMEdit(false);
                                        // Save the edited data
                                        const newRows = [...rows];
                                        newRows[idx] = { ...row, 'TechPacks BOM': techPacksBOMForm };
                                        setRows(newRows);
                                      }}
                                    >
                                      Save
                                    </button>
                                    <button 
                                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                                      onClick={() => {
                                        setTechPacksBOMEdit(false);
                                        setTechPacksBOMForm([]);
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    <button 
                                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                      onClick={() => {
                                        const newRow = Object.fromEntries([
                                          'Material', 'Material Description', 'Material Status', 'Material Category',
                                          'Comment', 'Custom Text 1', 'Custom Text 2', 'Custom Text 3', 'Custom Text 4',
                                          'Season', 'Note Count', 'Latest Note', 'Main Material', 'Category Sequence',
                                          'Default Material Color', 'Composition', 'Buyer Style Name', 'Supplier Ref.',
                                          'Buyer Style Number', 'ARC- Merbau/Aurora', 'ARC- Nightshadow/lolite',
                                          'ARC- Orion/Olive Amber', 'ARC- Nocturne/Deep Cove', 'ARC- Red Beach/Flare',
                                          'ARC- Shorepine/Titanite', 'ARC- Tui/Stellar', 'BLACK', 'Blackbird',
                                          'Default Size', 'Default Rating', 'One Size Size', 'One Size Rating',
                                          'ARC- Nightshadow/lolite 2', 'ARC- Orion/Olive Amber 2', 'ARC- Nocturne/Deep Cove 2',
                                          'ARC- Red Beach/Flare 2', 'ARC- Shorepine/Titanite 2', 'ARC- Tui/Stellar 2',
                                          'BLACK 2', 'Blackbird 2', 'Default Size 2', 'Default Rating 2',
                                          'One Size Size 2', 'One Size Rating 2'
                                        ].map(key => [key, '']));
                                        setTechPacksBOMForm([...techPacksBOMForm, newRow]);
                                      }}
                                    >
                                      Add Row
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button 
                                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                      onClick={() => {
                                        setTechPacksBOMEdit(true);
                                        setTechPacksBOMForm(row['TechPacks BOM'] ? [...row['TechPacks BOM']] : [...sampleBOMData]);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                      onClick={() => {
                                        setTechPacksBOMForm([...sampleBOMData]);
                                        setTechPacksBOMEdit(true);
                                      }}
                                    >
                                      Add Data
                                    </button>
                                  </>
                                )}
                              </div>
                              <div className="overflow-x-auto">
                                <table className="text-xs border border-gray-300 rounded max-w-4xl">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      {techPacksBOMEdit && (
                                        <th className="px-1 py-0.5 text-center font-semibold border w-8" rowSpan={2}>
                                          Del
                                        </th>
                                      )}
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>
                                        Material
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>
                                        Material Description
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>
                                        Material Status
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>
                                        Material Category
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16" rowSpan={2}>
                                        Comment
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16" rowSpan={2}>
                                        Custom Text 1
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16" rowSpan={2}>
                                        Custom Text 2
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16" rowSpan={2}>
                                        Custom Text 3
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16" rowSpan={2}>
                                        Custom Text 4
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16" rowSpan={2}>
                                        Season
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16" rowSpan={2}>
                                        Note Count
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>
                                        Latest Note
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>
                                        Main Material
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>
                                        Category Sequence
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>
                                        Default Material Color
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>
                                        Composition
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>
                                        Buyer Style Name
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>
                                        Supplier Ref.
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>
                                        Buyer Style Number
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>
                                        ARC- Merbau/Aurora
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>
                                        ARC- Nightshadow/lolite
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>
                                        ARC- Orion/Olive Amber
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>
                                        ARC- Nocturne/Deep Cove
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>
                                        ARC- Red Beach/Flare
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>
                                        ARC- Shorepine/Titanite
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>
                                        ARC- Tui/Stellar
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16" rowSpan={2}>
                                        BLACK
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>
                                        Blackbird
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16" colSpan={2}>
                                        Default
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16" colSpan={2}>
                                        One Size
                                      </th>
                                    </tr>
                                    <tr className="bg-gray-50">
                                      <th className="px-1 py-0.5 text-left font-semibold border w-8">
                                        Size
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-8">
                                        Rating
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-8">
                                        Size
                                      </th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-8">
                                        Rating
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(techPacksBOMForm.length > 0 ? techPacksBOMForm : sampleBOMData).map((bomRow, bomIdx) => (
                                      <tr key={bomIdx} className="hover:bg-gray-50">
                                        {techPacksBOMEdit && (
                                          <td className="px-1 py-0.5 border text-xs">
                                            <button 
                                              className="bg-red-500 text-white px-1 py-0.5 rounded text-xs hover:bg-red-600"
                                              onClick={() => {
                                                const updated = techPacksBOMForm.filter((_, i) => i !== bomIdx);
                                                setTechPacksBOMForm(updated);
                                              }}
                                            >
                                              ×
                                            </button>
                                          </td>
                                        )}
                                        <td className="px-1 py-0.5 border text-xs">
                                          {techPacksBOMEdit ? (
                                            <input 
                                              className="border px-1 py-0.5 rounded text-xs w-full" 
                                              value={bomRow['Material'] || ''} 
                                              onChange={e => {
                                                const updated = [...techPacksBOMForm];
                                                updated[bomIdx] = { ...updated[bomIdx], 'Material': e.target.value };
                                                setTechPacksBOMForm(updated);
                                              }}
                                            />
                                          ) : (bomRow['Material'] || '')}
                                        </td>
                                        <td className="px-1 py-0.5 border text-xs">
                                          {techPacksBOMEdit ? (
                                            <input 
                                              className="border px-1 py-0.5 rounded text-xs w-full" 
                                              value={bomRow['Material Description'] || ''} 
                                              onChange={e => {
                                                const updated = [...techPacksBOMForm];
                                                updated[bomIdx] = { ...updated[bomIdx], 'Material Description': e.target.value };
                                                setTechPacksBOMForm(updated);
                                              }}
                                            />
                                          ) : (bomRow['Material Description'] || '')}
                                        </td>
                                        {/* ...rest of the Tech Packs BOM table fields and logic... */}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          
                          {/* Size Specifications Tab */}
                          {techPacksEditTab === 'Size Specifications' && (
                            <div className="inline-block">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                {/* Details Section */}
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2 text-sm">Details</h4>
                              <table className="text-sm border border-blue-200 rounded mb-2 table-fixed">
                                <tbody>
                                      <tr><td className="px-2 py-1 font-semibold w-32">Product</td><td className="px-2 py-1">{row['Product'] || 'M8830037'}</td></tr>
                                      <tr><td className="px-2 py-1 font-semibold w-32">Comments</td><td className="px-2 py-1">
                                        <textarea 
                                          className="w-full h-20 border px-2 py-1 rounded text-sm resize-none" 
                                          placeholder="Enter comments here..."
                                          defaultValue={row['Size Comments'] || ''}
                                        />
                                      </td></tr>
                                    </tbody>
                                  </table>
                                </div>

                                {/* Image Section */}
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2 text-sm">Image</h4>
                                  <div className="space-y-4">
                                    {/* How To Measure */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">How To Measure</label>
                                      <div className="border border-gray-300 rounded p-2 bg-gray-50 w-32 h-24 flex items-center justify-center">
                                        <div className="text-gray-400 text-xs text-center">
                                          <svg className="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                          </svg>
                                          Image Placeholder
                                        </div>
                                      </div>
                                    </div>

                                    {/* Knit Gauge */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Knit Gauge</label>
                                      <div className="border border-gray-300 rounded p-2 bg-gray-50 w-32 h-24 flex items-center justify-center">
                                        <div className="text-gray-400 text-xs text-center">
                                          <svg className="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                          </svg>
                                          Image Placeholder
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Specification Section */}
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2 text-sm">Specification</h4>
                                <div className="flex border-b border-gray-200 mb-4">
                                  <button 
                                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                      specificationTab === 'Size Chart' 
                                        ? 'border-blue-500 text-blue-600 bg-blue-50' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                    onClick={() => setSpecificationTab('Size Chart')}
                                  >
                                    Size Chart
                                  </button>
                                  <button 
                                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                      specificationTab === 'Make Up Method' 
                                        ? 'border-blue-500 text-blue-600 bg-blue-50' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                    onClick={() => setSpecificationTab('Make Up Method')}
                                  >
                                    Make Up Method
                                  </button>
                                  <button 
                                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                      specificationTab === 'All' 
                                        ? 'border-blue-500 text-blue-600 bg-blue-50' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                    onClick={() => setSpecificationTab('All')}
                                  >
                                    All
                                  </button>
                                </div>
                                
                                {/* Size Chart Tab */}
                                {specificationTab === 'Size Chart' && (
                                  <div className="overflow-x-auto">
                                    <table className="text-xs border border-gray-300 rounded max-w-4xl">
                                      <thead>
                                        <tr className="bg-gray-50">
                                          <th className="px-1 py-0.5 text-left font-semibold border w-16" rowSpan={2}>Sequence</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>Reference</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Name</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-32" rowSpan={2}>Fit Size Dimension</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Size Comment</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" colSpan={2}>Tolerance</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" colSpan={2}>Sizes</th>
                                        </tr>
                                        <tr className="bg-gray-50">
                                          <th className="px-1 py-0.5 text-left font-semibold border w-10">-</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-10">+</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-10">Grade</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-10">One Size</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">1</td>
                                          <td className="px-1 py-0.5 border text-xs">CHEST</td>
                                          <td className="px-1 py-0.5 border text-xs">Chest Width</td>
                                          <td className="px-1 py-0.5 border text-xs">34</td>
                                          <td className="px-1 py-0.5 border text-xs">Standard fit</td>
                                          <td className="px-1 py-0.5 border text-xs">0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">S</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">WAIST</td>
                                          <td className="px-1 py-0.5 border text-xs">Waist Width</td>
                                          <td className="px-1 py-0.5 border text-xs">28</td>
                                          <td className="px-1 py-0.5 border text-xs">Slim fit</td>
                                          <td className="px-1 py-0.5 border text-xs">0.3</td>
                                          <td className="px-1 py-0.5 border text-xs">0.3</td>
                                          <td className="px-1 py-0.5 border text-xs">S</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">3</td>
                                          <td className="px-1 py-0.5 border text-xs">HIP</td>
                                          <td className="px-1 py-0.5 border text-xs">Hip Width</td>
                                          <td className="px-1 py-0.5 border text-xs">36</td>
                                          <td className="px-1 py-0.5 border text-xs">Regular fit</td>
                                          <td className="px-1 py-0.5 border text-xs">0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">S</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">4</td>
                                          <td className="px-1 py-0.5 border text-xs">LENGTH</td>
                                          <td className="px-1 py-0.5 border text-xs">Body Length</td>
                                          <td className="px-1 py-0.5 border text-xs">25</td>
                                          <td className="px-1 py-0.5 border text-xs">Standard length</td>
                                          <td className="px-1 py-0.5 border text-xs">0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">S</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">5</td>
                                          <td className="px-1 py-0.5 border text-xs">SLEEVE</td>
                                          <td className="px-1 py-0.5 border text-xs">Sleeve Length</td>
                                          <td className="px-1 py-0.5 border text-xs">23</td>
                                          <td className="px-1 py-0.5 border text-xs">Regular sleeve</td>
                                          <td className="px-1 py-0.5 border text-xs">0.3</td>
                                          <td className="px-1 py-0.5 border text-xs">0.3</td>
                                          <td className="px-1 py-0.5 border text-xs">S</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                </tbody>
                              </table>
                                  </div>
                                )}

                                {/* Make Up Method Tab */}
                                {specificationTab === 'Make Up Method' && (
                                  <div className="overflow-x-auto">
                                    <table className="text-xs border border-gray-300 rounded max-w-4xl">
                                      <thead>
                                        <tr className="bg-gray-50">
                                          <th className="px-1 py-0.5 text-left font-semibold border w-16" rowSpan={2}>Sequence</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>Reference</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Name</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-32" rowSpan={2}>Fit Size Dimension</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Size Comment</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>All Value</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>Stitch</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>Knit Gauge</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>Yarns Ends</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Stitch Name</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Placement</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Finishings</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Referencing For</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Finish Desc</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-28" rowSpan={2}>Reference Style Name</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>Machine</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" colSpan={1}>Sizes</th>
                                        </tr>
                                        <tr className="bg-gray-50">
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20">One Size</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">1</td>
                                          <td className="px-1 py-0.5 border text-xs">CHEST</td>
                                          <td className="px-1 py-0.5 border text-xs">Chest Width</td>
                                          <td className="px-1 py-0.5 border text-xs">34</td>
                                          <td className="px-1 py-0.5 border text-xs">Standard fit</td>
                                          <td className="px-1 py-0.5 border text-xs">34</td>
                                          <td className="px-1 py-0.5 border text-xs">Single</td>
                                          <td className="px-1 py-0.5 border text-xs">12</td>
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">Single Stitch</td>
                                          <td className="px-1 py-0.5 border text-xs">Center</td>
                                          <td className="px-1 py-0.5 border text-xs">Overlock</td>
                                          <td className="px-1 py-0.5 border text-xs">Seam</td>
                                          <td className="px-1 py-0.5 border text-xs">Clean finish</td>
                                          <td className="px-1 py-0.5 border text-xs">ARC-Merbau/Aurora</td>
                                          <td className="px-1 py-0.5 border text-xs">Juki</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">WAIST</td>
                                          <td className="px-1 py-0.5 border text-xs">Waist Width</td>
                                          <td className="px-1 py-0.5 border text-xs">28</td>
                                          <td className="px-1 py-0.5 border text-xs">Slim fit</td>
                                          <td className="px-1 py-0.5 border text-xs">28</td>
                                          <td className="px-1 py-0.5 border text-xs">Single</td>
                                          <td className="px-1 py-0.5 border text-xs">12</td>
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">Single Stitch</td>
                                          <td className="px-1 py-0.5 border text-xs">Center</td>
                                          <td className="px-1 py-0.5 border text-xs">Overlock</td>
                                          <td className="px-1 py-0.5 border text-xs">Seam</td>
                                          <td className="px-1 py-0.5 border text-xs">Clean finish</td>
                                          <td className="px-1 py-0.5 border text-xs">ARC-Merbau/Aurora</td>
                                          <td className="px-1 py-0.5 border text-xs">Juki</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">3</td>
                                          <td className="px-1 py-0.5 border text-xs">HIP</td>
                                          <td className="px-1 py-0.5 border text-xs">Hip Width</td>
                                          <td className="px-1 py-0.5 border text-xs">36</td>
                                          <td className="px-1 py-0.5 border text-xs">Regular fit</td>
                                          <td className="px-1 py-0.5 border text-xs">36</td>
                                          <td className="px-1 py-0.5 border text-xs">Single</td>
                                          <td className="px-1 py-0.5 border text-xs">12</td>
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">Single Stitch</td>
                                          <td className="px-1 py-0.5 border text-xs">Center</td>
                                          <td className="px-1 py-0.5 border text-xs">Overlock</td>
                                          <td className="px-1 py-0.5 border text-xs">Seam</td>
                                          <td className="px-1 py-0.5 border text-xs">Clean finish</td>
                                          <td className="px-1 py-0.5 border text-xs">ARC-Merbau/Aurora</td>
                                          <td className="px-1 py-0.5 border text-xs">Juki</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">4</td>
                                          <td className="px-1 py-0.5 border text-xs">LENGTH</td>
                                          <td className="px-1 py-0.5 border text-xs">Body Length</td>
                                          <td className="px-1 py-0.5 border text-xs">25</td>
                                          <td className="px-1 py-0.5 border text-xs">Standard length</td>
                                          <td className="px-1 py-0.5 border text-xs">25</td>
                                          <td className="px-1 py-0.5 border text-xs">Single</td>
                                          <td className="px-1 py-0.5 border text-xs">12</td>
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">Single Stitch</td>
                                          <td className="px-1 py-0.5 border text-xs">Center</td>
                                          <td className="px-1 py-0.5 border text-xs">Overlock</td>
                                          <td className="px-1 py-0.5 border text-xs">Seam</td>
                                          <td className="px-1 py-0.5 border text-xs">Clean finish</td>
                                          <td className="px-1 py-0.5 border text-xs">ARC-Merbau/Aurora</td>
                                          <td className="px-1 py-0.5 border text-xs">Juki</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">5</td>
                                          <td className="px-1 py-0.5 border text-xs">SLEEVE</td>
                                          <td className="px-1 py-0.5 border text-xs">Sleeve Length</td>
                                          <td className="px-1 py-0.5 border text-xs">23</td>
                                          <td className="px-1 py-0.5 border text-xs">Regular sleeve</td>
                                          <td className="px-1 py-0.5 border text-xs">23</td>
                                          <td className="px-1 py-0.5 border text-xs">Single</td>
                                          <td className="px-1 py-0.5 border text-xs">12</td>
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">Single Stitch</td>
                                          <td className="px-1 py-0.5 border text-xs">Center</td>
                                          <td className="px-1 py-0.5 border text-xs">Overlock</td>
                                          <td className="px-1 py-0.5 border text-xs">Seam</td>
                                          <td className="px-1 py-0.5 border text-xs">Clean finish</td>
                                          <td className="px-1 py-0.5 border text-xs">ARC-Merbau/Aurora</td>
                                          <td className="px-1 py-0.5 border text-xs">Juki</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                )}

                                {/* All Tab */}
                                {specificationTab === 'All' && (
                                  <div className="overflow-x-auto">
                                    <table className="text-xs border border-gray-300 rounded max-w-4xl">
                                      <thead>
                                        <tr className="bg-gray-50">
                                          <th className="px-1 py-0.5 text-left font-semibold border w-16" rowSpan={2}>Sequence</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>Reference</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Name</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" colSpan={2}>Tolerance</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>All Value</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>Stitch</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>Knit Gauge</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>Yarns Ends</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Stitch Name</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Placement</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Finishings</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-24" rowSpan={2}>Referencing For</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" rowSpan={2}>Machine</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-20" colSpan={2}>Sizes</th>
                                        </tr>
                                        <tr className="bg-gray-50">
                                          <th className="px-1 py-0.5 text-left font-semibold border w-10">-</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-10">+</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-10">Grade</th>
                                          <th className="px-1 py-0.5 text-left font-semibold border w-10">One Size</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">1</td>
                                          <td className="px-1 py-0.5 border text-xs">CHEST</td>
                                          <td className="px-1 py-0.5 border text-xs">Chest Width</td>
                                          <td className="px-1 py-0.5 border text-xs">-0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">+0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">34</td>
                                          <td className="px-1 py-0.5 border text-xs">Single</td>
                                          <td className="px-1 py-0.5 border text-xs">12</td>
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">Single Stitch</td>
                                          <td className="px-1 py-0.5 border text-xs">Center</td>
                                          <td className="px-1 py-0.5 border text-xs">Overlock</td>
                                          <td className="px-1 py-0.5 border text-xs">Seam</td>
                                          <td className="px-1 py-0.5 border text-xs">Juki</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">WAIST</td>
                                          <td className="px-1 py-0.5 border text-xs">Waist Width</td>
                                          <td className="px-1 py-0.5 border text-xs">-0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">+0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">28</td>
                                          <td className="px-1 py-0.5 border text-xs">Single</td>
                                          <td className="px-1 py-0.5 border text-xs">12</td>
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">Single Stitch</td>
                                          <td className="px-1 py-0.5 border text-xs">Center</td>
                                          <td className="px-1 py-0.5 border text-xs">Overlock</td>
                                          <td className="px-1 py-0.5 border text-xs">Seam</td>
                                          <td className="px-1 py-0.5 border text-xs">Juki</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">3</td>
                                          <td className="px-1 py-0.5 border text-xs">HIP</td>
                                          <td className="px-1 py-0.5 border text-xs">Hip Width</td>
                                          <td className="px-1 py-0.5 border text-xs">-0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">+0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">36</td>
                                          <td className="px-1 py-0.5 border text-xs">Single</td>
                                          <td className="px-1 py-0.5 border text-xs">12</td>
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">Single Stitch</td>
                                          <td className="px-1 py-0.5 border text-xs">Center</td>
                                          <td className="px-1 py-0.5 border text-xs">Overlock</td>
                                          <td className="px-1 py-0.5 border text-xs">Seam</td>
                                          <td className="px-1 py-0.5 border text-xs">Juki</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">4</td>
                                          <td className="px-1 py-0.5 border text-xs">LENGTH</td>
                                          <td className="px-1 py-0.5 border text-xs">Body Length</td>
                                          <td className="px-1 py-0.5 border text-xs">-0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">+0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">25</td>
                                          <td className="px-1 py-0.5 border text-xs">Single</td>
                                          <td className="px-1 py-0.5 border text-xs">12</td>
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">Single Stitch</td>
                                          <td className="px-1 py-0.5 border text-xs">Center</td>
                                          <td className="px-1 py-0.5 border text-xs">Overlock</td>
                                          <td className="px-1 py-0.5 border text-xs">Seam</td>
                                          <td className="px-1 py-0.5 border text-xs">Juki</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-1 py-0.5 border text-xs">5</td>
                                          <td className="px-1 py-0.5 border text-xs">SLEEVE</td>
                                          <td className="px-1 py-0.5 border text-xs">Sleeve Length</td>
                                          <td className="px-1 py-0.5 border text-xs">-0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">+0.5</td>
                                          <td className="px-1 py-0.5 border text-xs">23</td>
                                          <td className="px-1 py-0.5 border text-xs">Single</td>
                                          <td className="px-1 py-0.5 border text-xs">12</td>
                                          <td className="px-1 py-0.5 border text-xs">2</td>
                                          <td className="px-1 py-0.5 border text-xs">Single Stitch</td>
                                          <td className="px-1 py-0.5 border text-xs">Center</td>
                                          <td className="px-1 py-0.5 border text-xs">Overlock</td>
                                          <td className="px-1 py-0.5 border text-xs">Seam</td>
                                          <td className="px-1 py-0.5 border text-xs">Juki</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                          <td className="px-1 py-0.5 border text-xs">M</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Fit Log Tab */}
                          {techPacksEditTab === 'Fit Log' && (
                            <div className="inline-block">
                              <div className="overflow-x-auto">
                                <table className="text-xs border border-gray-300 rounded max-w-6xl">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="px-1 py-0.5 text-left font-semibold border w-16">Sequence</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Date</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Type</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Status</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Result</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Comments</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit By</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Location</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Sample</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Sample Size</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Sample Color</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Sample Quantity</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Sample Received</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Sample Returned</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Sample Returned Date</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Sample Returned By</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Sample Returned To</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Sample Returned Via</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Sample Returned Tracking</th>
                                      <th className="px-1 py-0.5 text-left font-semibold border w-24">Fit Sample Returned Notes</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="hover:bg-gray-50">
                                      <td className="px-1 py-0.5 border text-xs">1</td>
                                      <td className="px-1 py-0.5 border text-xs">2024-01-15</td>
                                      <td className="px-1 py-0.5 border text-xs">Initial</td>
                                      <td className="px-1 py-0.5 border text-xs">Completed</td>
                                      <td className="px-1 py-0.5 border text-xs">Approved</td>
                                      <td className="px-1 py-0.5 border text-xs">Good fit, minor adjustments needed</td>
                                      <td className="px-1 py-0.5 border text-xs">John Smith</td>
                                      <td className="px-1 py-0.5 border text-xs">Studio A</td>
                                      <td className="px-1 py-0.5 border text-xs">Sample-001</td>
                                      <td className="px-1 py-0.5 border text-xs">M</td>
                                      <td className="px-1 py-0.5 border text-xs">Navy</td>
                                      <td className="px-1 py-0.5 border text-xs">1</td>
                                      <td className="px-1 py-0.5 border text-xs">2024-01-10</td>
                                      <td className="px-1 py-0.5 border text-xs"></td>
                                      <td className="px-1 py-0.5 border text-xs">2024-01-20</td>
                                      <td className="px-1 py-0.5 border text-xs">Jane Doe</td>
                                      <td className="px-1 py-0.5 border text-xs">Supplier A</td>
                                      <td className="px-1 py-0.5 border text-xs">Courier</td>
                                      <td className="px-1 py-0.5 border text-xs">TRK123456</td>
                                      <td className="px-1 py-0.5 border text-xs">Sample returned in good condition</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                      <td className="px-1 py-0.5 border text-xs">2</td>
                                      <td className="px-1 py-0.5 border text-xs">2024-02-01</td>
                                      <td className="px-1 py-0.5 border text-xs">Revision</td>
                                      <td className="px-1 py-0.5 border text-xs">Completed</td>
                                      <td className="px-1 py-0.5 border text-xs">Approved with changes</td>
                                      <td className="px-1 py-0.5 border text-xs">Sleeve length adjusted</td>
                                      <td className="px-1 py-0.5 border text-xs">Sarah Johnson</td>
                                      <td className="px-1 py-0.5 border text-xs">Studio B</td>
                                      <td className="px-1 py-0.5 border text-xs">Sample-002</td>
                                      <td className="px-1 py-0.5 border text-xs">L</td>
                                      <td className="px-1 py-0.5 border text-xs">Black</td>
                                      <td className="px-1 py-0.5 border text-xs">1</td>
                                      <td className="px-1 py-0.5 border text-xs">2024-01-28</td>
                                      <td className="px-1 py-0.5 border text-xs"></td>
                                      <td className="px-1 py-0.5 border text-xs">2024-02-05</td>
                                      <td className="px-1 py-0.5 border text-xs">Mike Wilson</td>
                                      <td className="px-1 py-0.5 border text-xs">Supplier B</td>
                                      <td className="px-1 py-0.5 border text-xs">Express</td>
                                      <td className="px-1 py-0.5 border text-xs">TRK789012</td>
                                      <td className="px-1 py-0.5 border text-xs">Sample returned with feedback</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          
                          {/* Fibre Composition Tab */}
                          {techPacksEditTab === 'Fibre Composition' && (
                            <div className="inline-block">
                              <div className="space-y-4">
                                {/* Version Control */}
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2 text-sm">Version Control</h4>
                                  <div className="border border-gray-300 rounded mb-4">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                          <th className="text-left py-2 px-3 font-medium text-gray-700">Version Number</th>
                                          <th className="text-left py-2 px-3 font-medium text-gray-700">Comment</th>
                                          <th className="text-left py-2 px-3 font-medium text-gray-700">Current Version</th>
                                          <th className="text-left py-2 px-3 font-medium text-gray-700">Created By</th>
                                          <th className="text-left py-2 px-3 font-medium text-gray-700">Created</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="border-b border-gray-100">
                                          <td className="py-2 px-3">
                                            {versionControlEdit ? (
                                              <input 
                                                type="text" 
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                value={versionControlData.versionNumber}
                                                onChange={(e) => setVersionControlData({
                                                  ...versionControlData,
                                                  versionNumber: e.target.value
                                                })}
                                              />
                                            ) : (
                                              <span className="text-gray-700">{versionControlData.versionNumber || '-'}</span>
                                            )}
                                          </td>
                                          <td className="py-2 px-3">
                                            {versionControlEdit ? (
                                              <input 
                                                type="text" 
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                value={versionControlData.comment}
                                                onChange={(e) => setVersionControlData({
                                                  ...versionControlData,
                                                  comment: e.target.value
                                                })}
                                              />
                                            ) : (
                                              <span className="text-gray-700">{versionControlData.comment || '-'}</span>
                                            )}
                                          </td>
                                          <td className="py-2 px-3">
                                            <div className="flex items-center justify-center">
                                              <input 
                                                type="checkbox" 
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                checked={versionControlData.currentVersion}
                                                onChange={(e) => setVersionControlData({
                                                  ...versionControlData,
                                                  currentVersion: e.target.checked
                                                })}
                                                disabled={!versionControlEdit}
                                              />
                                            </div>
                                          </td>
                                          <td className="py-2 px-3">
                                            {versionControlEdit ? (
                                              <input 
                                                type="text" 
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                value={versionControlData.createdBy}
                                                onChange={(e) => setVersionControlData({
                                                  ...versionControlData,
                                                  createdBy: e.target.value
                                                })}
                                              />
                                            ) : (
                                              <span className="text-gray-700">{versionControlData.createdBy}</span>
                                            )}
                                          </td>
                                          <td className="py-2 px-3">
                                            <span className="text-gray-700">{versionControlData.created}</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="flex space-x-2">
                                    {versionControlEdit ? (
                                      <>
                                        <button 
                                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                          onClick={() => {
                                            setVersionControlData({
                                              ...versionControlData,
                                              created: new Date().toLocaleString()
                                            });
                                            setVersionControlEdit(false);
                                          }}
                                        >
                                          Save
                                        </button>
                                        <button 
                                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                                          onClick={() => {
                                            setVersionControlEdit(false);
                                            setVersionControlData({
                                              versionNumber: '',
                                              comment: '',
                                              currentVersion: false,
                                              createdBy: 'Admin',
                                              created: new Date().toLocaleString()
                                            });
                                          }}
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <button 
                                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                        onClick={() => setVersionControlEdit(true)}
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </div>
                                </div>

                                                                {/* Add New Fibre Composition Button */}
                                <div className="mb-4">
                                  <button 
                                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 flex items-center space-x-2"
                                    onClick={() => {
                                      const newSectionId = fibreSections.length + 1;
                                      setFibreSections([...fibreSections, newSectionId]);
                                      setFibreSectionNames({
                                        ...fibreSectionNames,
                                        [newSectionId]: `Fibre Section ${newSectionId}`
                                      });
                                    }}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Add New Fibre Composition</span>
                                  </button>
                                </div>

                                {/* Fibre Sections */}
                                <div className="space-y-4">
                                  {/* First Row - Original 3 sections */}
                                  <div className="grid grid-cols-3 gap-4">
                                    {fibreSections.slice(0, 3).map((sectionId, index) => (
                                      <div key={sectionId} className="border border-gray-300 rounded p-3 max-w-xs">
                                        <div className="flex justify-between items-center mb-3">
                                          <input
                                            type="text"
                                            className="font-semibold text-gray-700 text-sm bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                                            value={fibreSectionNames[sectionId] || `Fibre Section ${index + 1}`}
                                            onChange={(e) => {
                                              setFibreSectionNames({
                                                ...fibreSectionNames,
                                                [sectionId]: e.target.value
                                              });
                                            }}
                                          />
                                          <button 
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => {
                                              if (fibreSections.length > 1) {
                                                setFibreSections(fibreSections.filter((_, i) => i !== index));
                                                // Remove the name from state when deleting
                                                const newNames = { ...fibreSectionNames };
                                                delete newNames[sectionId];
                                                setFibreSectionNames(newNames);
                                              }
                                            }}
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                          </button>
                                        </div>
                                        <table className="w-full text-xs">
                                          <thead>
                                            <tr className="border-b border-gray-200">
                                              <th className="text-left py-1 font-medium text-gray-700">Fibre</th>
                                              <th className="text-left py-1 font-medium text-gray-700">%</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {[1, 2, 3, 4, 5, 6].map((row) => (
                                              <tr key={row} className="border-b border-gray-100">
                                                <td className="py-1">
                                                  <select className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs">
                                                    <option>Select</option>
                                                    <option>(Faux fur) Polyester</option>
                                                    <option>Acetate</option>
                                                    <option>Acrylic</option>
                                                    <option>Alpaca</option>
                                                    <option>Angora</option>
                                                    <option>Cashmere</option>
                                                    <option>Contains Non-Textile Parts of Animal Origin</option>
                                                    <option>Cotton</option>
                                                    <option>Elastane</option>
                                                    <option>Elasterell-P</option>
                                                    <option>Elastodiene</option>
                                                    <option>Exclusive of Decoration</option>
                                                    <option>Exclusive of Elastic</option>
                                                    <option>Exclusive of Ornamentation</option>
                                                    <option>Exclusive of Trim</option>
                                                    <option>Exclusive of Trimming</option>
                                                    <option>Faux Fur</option>
                                                    <option>Faux Suede Patch</option>
                                                    <option>Finished Piece Washed (for Testing only)</option>
                                                    <option>Imitation Suede</option>
                                                    <option>Lambswool</option>
                                                    <option>Leather</option>
                                                    <option>Lurex</option>
                                                    <option>Lycra</option>
                                                    <option>Lyocell</option>
                                                    <option>Merino Wool</option>
                                                    <option>Metallic</option>
                                                    <option>Metallic fibre</option>
                                                    <option>Metallised Fibre</option>
                                                    <option>Modacrylic</option>
                                                    <option>Nylon</option>
                                                    <option>Olefin</option>
                                                    <option>Organic cotton</option>
                                                    <option>Other Fiber</option>
                                                    <option>Other Fibers</option>
                                                    <option>Paper</option>
                                                    <option>Pig suede</option>
                                                    <option>Polyamide</option>
                                                    <option>Polyester</option>
                                                    <option>Polyester (Recycled)</option>
                                                    <option>Polyester Recycled</option>
                                                    <option>Polypropylene</option>
                                                    <option>Polyurethane</option>
                                                    <option>Polyurethane Foam</option>
                                                    <option>Rayon</option>
                                                    <option>Recycled</option>
                                                    <option>Recycled Nylon</option>
                                                    <option>Recycled Other Fibers</option>
                                                    <option>Recycled Polyester</option>
                                                    <option>Recycled Wool</option>
                                                    <option>Recycled Wool/ Reprocessed Wool</option>
                                                    <option>Recycled/Reclaimed Wool</option>
                                                    <option>Rubber</option>
                                                    <option>Rubber/Elastodiene</option>
                                                    <option>Silk</option>
                                                    <option>Spandex</option>
                                                    <option>Straw</option>
                                                    <option>True Hemp</option>
                                                    <option>Viscose</option>
                                                    <option>Wool</option>
                                                    <option>Wool - Merino</option>
                                                    <option>Wool (Merino)</option>
                                                    <option>Wool Merino</option>
                                                    <option>Yak</option>
                                                    <option>Yarn & Finished Piece Washed (for Testing only)</option>
                                                    <option>Yarn Washed (for Testing only)</option>
                                                    <option>Excluding Trims</option>
                                                    <option>Exclusive of Decoration and Elastic</option>
                                                    <option>Recycled Acrylic</option>
                                                  </select>
                                                </td>
                                                <td className="py-1">
                                                  <input 
                                                    type="number" 
                                                    step="0.1"
                                                    className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
                                                    defaultValue="0.0"
                                                  />
                                                </td>
                                              </tr>
                                            ))}
                                            <tr className="bg-gray-50 font-medium">
                                              <td className="py-1 text-gray-700">Total</td>
                                              <td className="py-1 text-gray-700">0.0</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Additional sections (after the first 3) */}
                                  {fibreSections.length > 3 && (
                                    <div className="grid grid-cols-3 gap-4">
                                      {fibreSections.slice(3).map((sectionId, index) => (
                                        <div key={sectionId} className="border border-gray-300 rounded p-3 max-w-xs">
                                          <div className="flex justify-between items-center mb-3">
                                            <input
                                              type="text"
                                              className="font-semibold text-gray-700 text-sm bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                                              value={fibreSectionNames[sectionId] || `Fibre Section ${index + 4}`}
                                              onChange={(e) => {
                                                setFibreSectionNames({
                                                  ...fibreSectionNames,
                                                  [sectionId]: e.target.value
                                                });
                                              }}
                                            />
                                            <button 
                                              className="text-red-500 hover:text-red-700"
                                              onClick={() => {
                                                setFibreSections(fibreSections.filter((_, i) => i !== index + 3));
                                                // Remove the name from state when deleting
                                                const newNames = { ...fibreSectionNames };
                                                delete newNames[sectionId];
                                                setFibreSectionNames(newNames);
                                              }}
                                            >
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                              </svg>
                                            </button>
                                          </div>
                                          <table className="w-full text-xs">
                                            <thead>
                                              <tr className="border-b border-gray-200">
                                                <th className="text-left py-1 font-medium text-gray-700">Fibre</th>
                                                <th className="text-left py-1 font-medium text-gray-700">%</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {[1, 2, 3, 4, 5, 6].map((row) => (
                                                <tr key={row} className="border-b border-gray-100">
                                                  <td className="py-1">
                                                    <select className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs">
                                                      <option>Select</option>
                                                      <option>(Faux fur) Polyester</option>
                                                      <option>Acetate</option>
                                                      <option>Acrylic</option>
                                                      <option>Alpaca</option>
                                                      <option>Angora</option>
                                                      <option>Cashmere</option>
                                                      <option>Contains Non-Textile Parts of Animal Origin</option>
                                                      <option>Cotton</option>
                                                      <option>Elastane</option>
                                                      <option>Elasterell-P</option>
                                                      <option>Elastodiene</option>
                                                      <option>Exclusive of Decoration</option>
                                                      <option>Exclusive of Elastic</option>
                                                      <option>Exclusive of Ornamentation</option>
                                                      <option>Exclusive of Trim</option>
                                                      <option>Exclusive of Trimming</option>
                                                      <option>Faux Fur</option>
                                                      <option>Faux Suede Patch</option>
                                                      <option>Finished Piece Washed (for Testing only)</option>
                                                      <option>Imitation Suede</option>
                                                      <option>Lambswool</option>
                                                      <option>Leather</option>
                                                      <option>Lurex</option>
                                                      <option>Lycra</option>
                                                      <option>Lyocell</option>
                                                      <option>Merino Wool</option>
                                                      <option>Metallic</option>
                                                      <option>Metallic fibre</option>
                                                      <option>Metallised Fibre</option>
                                                      <option>Modacrylic</option>
                                                      <option>Nylon</option>
                                                      <option>Olefin</option>
                                                      <option>Organic cotton</option>
                                                      <option>Other Fiber</option>
                                                      <option>Other Fibers</option>
                                                      <option>Paper</option>
                                                      <option>Pig suede</option>
                                                      <option>Polyamide</option>
                                                      <option>Polyester</option>
                                                      <option>Polyester (Recycled)</option>
                                                      <option>Polyester Recycled</option>
                                                      <option>Polypropylene</option>
                                                      <option>Polyurethane</option>
                                                      <option>Polyurethane Foam</option>
                                                      <option>Rayon</option>
                                                      <option>Recycled</option>
                                                      <option>Recycled Nylon</option>
                                                      <option>Recycled Other Fibers</option>
                                                      <option>Recycled Polyester</option>
                                                      <option>Recycled Wool</option>
                                                      <option>Recycled Wool/ Reprocessed Wool</option>
                                                      <option>Recycled/Reclaimed Wool</option>
                                                      <option>Rubber</option>
                                                      <option>Rubber/Elastodiene</option>
                                                      <option>Silk</option>
                                                      <option>Spandex</option>
                                                      <option>Straw</option>
                                                      <option>True Hemp</option>
                                                      <option>Viscose</option>
                                                      <option>Wool</option>
                                                      <option>Wool - Merino</option>
                                                      <option>Wool (Merino)</option>
                                                      <option>Wool Merino</option>
                                                      <option>Yak</option>
                                                      <option>Yarn & Finished Piece Washed (for Testing only)</option>
                                                      <option>Yarn Washed (for Testing only)</option>
                                                      <option>Excluding Trims</option>
                                                      <option>Exclusive of Decoration and Elastic</option>
                                                      <option>Recycled Acrylic</option>
                                                    </select>
                                                  </td>
                                                  <td className="py-1">
                                                    <input 
                                                      type="number" 
                                                      step="0.1"
                                                      className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
                                                      defaultValue="0.0"
                                                    />
                                                  </td>
                                                </tr>
                                              ))}
                                              <tr className="bg-gray-50 font-medium">
                                                <td className="py-1 text-gray-700">Total</td>
                                                <td className="py-1 text-gray-700">0.0</td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Care Instructions Tab */}
                          {techPacksEditTab === 'Care Instructions' && (
                            <div className="inline-block">
                              <div className="space-y-4">
                                {/* Product Details */}
                                <div className="bg-white border border-gray-300 rounded p-4 mb-4">
                                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">Product Details</h4>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                      <span className="text-blue-600 font-medium">M8830037</span>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                                      <span className="text-gray-700">MACHINE KNITTED MENS BEANIE</span>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Buyer Style Number</label>
                                      <span className="text-gray-700">22992</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Care Instructions */}
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">Care Instructions</h4>
                                                                     <div className="grid grid-cols-3 gap-4">
                                     {/* Wash */}
                                     <div className="bg-white border border-gray-300 rounded p-4">
                                       <h5 className="font-medium text-gray-700 mb-3 text-sm">Wash</h5>
                                       <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-3">
                                         <option>Select wash type</option>
                                         <option>Machine wash</option>
                                         <option>Hand wash</option>
                                         <option>Do not wash</option>
                                       </select>
                                       <button className="w-full bg-gradient-to-b from-blue-400 to-blue-600 text-white p-2 rounded hover:from-blue-500 hover:to-blue-700 flex items-center justify-center">
                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                         </svg>
                                       </button>
                                     </div>

                                     {/* Wash Modifier */}
                                     <div className="bg-white border border-gray-300 rounded p-4">
                                       <h5 className="font-medium text-gray-700 mb-3 text-sm">Wash Modifier</h5>
                                       <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-3">
                                         <option>Select modifier</option>
                                         <option>Gentle</option>
                                         <option>Normal</option>
                                         <option>Heavy</option>
                                       </select>
                                       <button className="w-full bg-gradient-to-b from-blue-400 to-blue-600 text-white p-2 rounded hover:from-blue-500 hover:to-blue-700 flex items-center justify-center">
                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                         </svg>
                                       </button>
                                     </div>

                                     {/* Bleach */}
                                     <div className="bg-white border border-gray-300 rounded p-4">
                                       <h5 className="font-medium text-gray-700 mb-3 text-sm">Bleach</h5>
                                       <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-3">
                                         <option>Select bleach option</option>
                                         <option>Do not bleach</option>
                                         <option>Bleach when needed</option>
                                         <option>Non-chlorine bleach</option>
                                       </select>
                                       <button className="w-full bg-gradient-to-b from-blue-400 to-blue-600 text-white p-2 rounded hover:from-blue-500 hover:to-blue-700 flex items-center justify-center">
                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                         </svg>
                                       </button>
                                     </div>

                                     {/* Dry */}
                                     <div className="bg-white border border-gray-300 rounded p-4">
                                       <h5 className="font-medium text-gray-700 mb-3 text-sm">Dry</h5>
                                       <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-3">
                                         <option>Select dry method</option>
                                         <option>Tumble dry</option>
                                         <option>Line dry</option>
                                         <option>Drip dry</option>
                                         <option>Do not tumble dry</option>
                                       </select>
                                       <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                       </button>
                                     </div>

                                     {/* Natural Drying */}
                                     <div className="bg-white border border-gray-300 rounded p-4">
                                       <h5 className="font-medium text-gray-700 mb-3 text-sm">Natural Drying</h5>
                                       <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-3">
                                         <option>Select drying method</option>
                                         <option>Line dry</option>
                                         <option>Drip dry</option>
                                         <option>Dry flat</option>
                                         <option>Dry in shade</option>
                                       </select>
                                       <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                       </button>
                                     </div>

                                     {/* Modifier */}
                                     <div className="bg-white border border-gray-300 rounded p-4">
                                       <h5 className="font-medium text-gray-700 mb-3 text-sm">Modifier</h5>
                                       <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-3">
                                         <option>Select modifier</option>
                                         <option>Low heat</option>
                                         <option>Medium heat</option>
                                         <option>High heat</option>
                                         <option>No heat</option>
                                       </select>
                                       <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                       </button>
                                     </div>

                                     {/* Iron */}
                                     <div className="bg-white border border-gray-300 rounded p-4">
                                       <h5 className="font-medium text-gray-700 mb-3 text-sm">Iron</h5>
                                       <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-3">
                                         <option>Select iron setting</option>
                                         <option>Iron if needed</option>
                                         <option>Do not iron</option>
                                         <option>Iron on low</option>
                                         <option>Iron on medium</option>
                                         <option>Iron on high</option>
                                       </select>
                                       <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                       </button>
                                     </div>

                                     {/* Dry Clean */}
                                     <div className="bg-white border border-gray-300 rounded p-4">
                                       <h5 className="font-medium text-gray-700 mb-3 text-sm">Dry Clean</h5>
                                       <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-3">
                                         <option>Select dry clean option</option>
                                         <option>Do not dry clean</option>
                                         <option>Dry clean only</option>
                                         <option>Dry clean with any solvent</option>
                                         <option>Dry clean with petroleum solvent</option>
                                       </select>
                                       <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                       </button>
                                     </div>

                                     {/* Care Code */}
                                     <div className="bg-white border border-gray-300 rounded p-4">
                                       <h5 className="font-medium text-gray-700 mb-3 text-sm">Care Code</h5>
                                       <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-3" defaultValue="HW11">
                                         <option value="HW11">HW11</option>
                                         <option value="HW12">HW12</option>
                                         <option value="HW13">HW13</option>
                                         <option value="HW14">HW14</option>
                                         <option value="HW15">HW15</option>
                                       </select>
                                       <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                       </button>
                                     </div>
                                   </div>

                                   {/* Memo Section */}
                                   <div className="mt-6">
                                     <h4 className="font-semibold text-gray-700 mb-3 text-sm">Memo</h4>
                                     <div className="grid grid-cols-2 gap-4">
                                       {/* Label Card */}
                                       <div className="bg-white border border-gray-300 rounded p-4">
                                         <h5 className="font-medium text-gray-700 mb-3 text-sm">Label</h5>
                                         <textarea 
                                           className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
                                           rows={4}
                                           placeholder="Enter label comments here..."
                                         />
                                       </div>

                                       {/* Label Location Card */}
                                       <div className="bg-white border border-gray-300 rounded p-4">
                                         <h5 className="font-medium text-gray-700 mb-3 text-sm">Label Location</h5>
                                         <textarea 
                                           className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
                                           rows={4}
                                           placeholder="Enter label location comments here..."
                                         />
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                             </div>
                           )}
                          
                          {/* Labels Tab */}
                          {techPacksEditTab === 'Labels' && (
                            <div className="inline-block">
                              <div className="space-y-4">
                                {/* Label Details */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                    <input 
                                      type="text" 
                                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                      defaultValue="M8830037"
                                      readOnly
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input 
                                      type="text" 
                                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                      defaultValue="Classic T-Shirt"
                                      readOnly
                                    />
                                  </div>
                                </div>

                                {/* Labels Table */}
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2 text-sm">Labels</h4>
                                  <div className="overflow-x-auto">
                                    <table className="text-xs border border-gray-300 rounded max-w-4xl">
                                      <thead>
                                        <tr className="bg-gray-50">
                                          <th className="px-2 py-2 text-left font-semibold border">Name</th>
                                          <th className="px-2 py-2 text-left font-semibold border">Description</th>
                                          <th className="px-2 py-2 text-left font-semibold border">Material</th>
                                          <th className="px-2 py-2 text-left font-semibold border">Image Type 1</th>
                                          <th className="px-2 py-2 text-left font-semibold border">Image Type 2</th>
                                          <th className="px-2 py-2 text-left font-semibold border">Position</th>
                                          <th className="px-2 py-2 text-left font-semibold border">Application</th>
                                          <th className="px-2 py-2 text-left font-semibold border">Comment</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-2 py-2 border text-xs">Care Label</td>
                                          <td className="px-2 py-2 border text-xs">Washing and care instructions</td>
                                          <td className="px-2 py-2 border text-xs">Polyester</td>
                                          <td className="px-2 py-2 border text-xs">Woven</td>
                                          <td className="px-2 py-2 border text-xs">Printed</td>
                                          <td className="px-2 py-2 border text-xs">Neck</td>
                                          <td className="px-2 py-2 border text-xs">Sewn</td>
                                          <td className="px-2 py-2 border text-xs">Must be permanent</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-2 py-2 border text-xs">Size Label</td>
                                          <td className="px-2 py-2 border text-xs">Product size information</td>
                                          <td className="px-2 py-2 border text-xs">Cotton</td>
                                          <td className="px-2 py-2 border text-xs">Woven</td>
                                          <td className="px-2 py-2 border text-xs">Embossed</td>
                                          <td className="px-2 py-2 border text-xs">Side Seam</td>
                                          <td className="px-2 py-2 border text-xs">Sewn</td>
                                          <td className="px-2 py-2 border text-xs">Standard size label</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-2 py-2 border text-xs">Brand Label</td>
                                          <td className="px-2 py-2 border text-xs">Brand logo and name</td>
                                          <td className="px-2 py-2 border text-xs">Silk</td>
                                          <td className="px-2 py-2 border text-xs">Woven</td>
                                          <td className="px-2 py-2 border text-xs">Embroidered</td>
                                          <td className="px-2 py-2 border text-xs">Chest</td>
                                          <td className="px-2 py-2 border text-xs">Sewn</td>
                                          <td className="px-2 py-2 border text-xs">Premium brand label</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-2 py-2 border text-xs">Composition Label</td>
                                          <td className="px-2 py-2 border text-xs">Fabric composition details</td>
                                          <td className="px-2 py-2 border text-xs">Polyester</td>
                                          <td className="px-2 py-2 border text-xs">Woven</td>
                                          <td className="px-2 py-2 border text-xs">Printed</td>
                                          <td className="px-2 py-2 border text-xs">Side Seam</td>
                                          <td className="px-2 py-2 border text-xs">Sewn</td>
                                          <td className="px-2 py-2 border text-xs">Required by law</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-2 py-2 border text-xs">Origin Label</td>
                                          <td className="px-2 py-2 border text-xs">Country of origin</td>
                                          <td className="px-2 py-2 border text-xs">Cotton</td>
                                          <td className="px-2 py-2 border text-xs">Woven</td>
                                          <td className="px-2 py-2 border text-xs">Printed</td>
                                          <td className="px-2 py-2 border text-xs">Neck</td>
                                          <td className="px-2 py-2 border text-xs">Sewn</td>
                                          <td className="px-2 py-2 border text-xs">Made in China</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Image Type Sections */}
                                <div className="grid grid-cols-2 gap-6 mt-6">
                                  {/* Image Type 1 */}
                                  <div>
                                    <h4 className="font-semibold text-gray-700 mb-4 text-sm">Image Type 1</h4>
                                    <div className="bg-white border border-gray-300 rounded p-4">
                                      <div className="flex justify-center">
                                        <div className="w-16 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded flex items-center justify-center">
                                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Image Type 2 */}
                                  <div>
                                    <h4 className="font-semibold text-gray-700 mb-4 text-sm">Image Type 2</h4>
                                    <div className="bg-white border border-gray-300 rounded p-4">
                                      <div className="flex justify-center">
                                        <div className="w-16 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded flex items-center justify-center">
                                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* ...rest of the Tech Packs subtabs implementation... */}
                        </div>
                      </div>
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