import React, { useState, useRef } from 'react';
import { Plus, Search, Filter, Eye, Edit as Pencil, Save, ShoppingCart, Calendar, DollarSign, TrendingUp, Package, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import EditPurchaseOrderModal, { PurchaseOrder as PurchaseOrderType } from '../components/modals/EditPurchaseOrderModal';

const PurchaseOrders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [expandedPO, setExpandedPO] = useState<string | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([ // Default data, can be replaced by Excel upload
    {
      id: 1,
      poNumber: 'PO-2024-001',
      customer: 'H&M',
      styleNumber: 'SC001',
      styleName: 'Cotton T-Shirt Premium',
      colorway: 'Navy Blue',
      quantity: 10000,
      sizes: 'XS-XXL',
      unitPrice: 15.99,
      totalValue: 159900,
      status: 'Confirmed',
      exFactoryDate: '2024-02-15',
      destination: 'Hamburg, Germany',
      version: 'FC1',
      supplier: 'Textile Solutions Ltd',
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-14',
      bulkApprovalStatus: 'Approved',
      progress: 85
    },
    {
      id: 2,
      poNumber: 'PO-2024-002',
      customer: 'Zara',
      styleNumber: 'SC002',
      styleName: 'Summer Dress Collection',
      colorway: 'Floral Print',
      quantity: 5000,
      sizes: 'XS-L',
      unitPrice: 29.99,
      totalValue: 149950,
      status: 'In Production',
      exFactoryDate: '2024-02-20',
      destination: 'Barcelona, Spain',
      version: 'FC2',
      supplier: 'Fashion Factory Inc',
      createdDate: '2024-01-12',
      lastUpdated: '2024-01-13',
      bulkApprovalStatus: 'Pending',
      progress: 60
    },
    {
      id: 3,
      poNumber: 'PO-2024-003',
      customer: 'Uniqlo',
      styleNumber: 'SC003',
      styleName: 'Denim Jacket Classic',
      colorway: 'Indigo',
      quantity: 8000,
      sizes: 'S-XL',
      unitPrice: 49.99,
      totalValue: 399920,
      status: 'Draft',
      exFactoryDate: '2024-03-01',
      destination: 'Tokyo, Japan',
      version: 'FC1',
      supplier: 'Denim Works Co',
      createdDate: '2024-01-14',
      lastUpdated: '2024-01-14',
      bulkApprovalStatus: 'Not Required',
      progress: 25
    },
    {
      id: 4,
      poNumber: 'PO-2024-004',
      customer: 'Nike',
      styleNumber: 'SC004',
      styleName: 'Athletic Shorts Pro',
      colorway: 'Black/White',
      quantity: 15000,
      sizes: 'XS-XXL',
      unitPrice: 24.99,
      totalValue: 374850,
      status: 'Shipped',
      exFactoryDate: '2024-01-25',
      destination: 'Portland, USA',
      version: 'FC3',
      supplier: 'SportsTech Manufacturing',
      createdDate: '2024-01-08',
      lastUpdated: '2024-01-11',
      bulkApprovalStatus: 'Approved',
      progress: 100
    },
    {
      id: 5,
      poNumber: 'PO-2024-005',
      customer: 'Patagonia',
      styleNumber: 'SC005',
      styleName: 'Winter Coat Premium',
      colorway: 'Forest Green',
      quantity: 3000,
      sizes: 'S-XL',
      unitPrice: 89.99,
      totalValue: 269970,
      status: 'Approved',
      exFactoryDate: '2024-02-28',
      destination: 'California, USA',
      version: 'FC1',
      supplier: 'OutdoorGear Manufacturing',
      createdDate: '2024-01-11',
      lastUpdated: '2024-01-12',
      bulkApprovalStatus: 'Approved',
      progress: 40
    },
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrderType | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Excel Upload Handler ---
  const EXCEL_COLUMNS = [
    'Order References', 'Status', 'Total Qty', 'Total Cost', 'Total Value', 'Customer', 'Supplier', 'Purchase Currency', 'Selling Currency', 'Purchase Payment Term', 'Selling Payment Term', 'Supplier Parent', 'Delivery Contact', 'Division', 'Group', 'Supplier Description', 'Supplier Location', 'Supplier Country', 'Template', 'Transport Method', 'Deliver to', 'Closed Date', 'Delivery Date', 'PO Issue Date', 'Supplier Currency', 'Comments', 'Production', 'MLA- Purchasing', 'China -QC', 'MLA-Planning', 'MLA-Shipping', 'PO Key User 6', 'PO Key User 7', 'PO Key User 8', 'PO Key Working Group 2', 'PO Key Working Group 3', 'PO Key Working Group 4', 'Purchase Payment Term Description', 'Selling Payment Term Description', 'Note Count', 'Latest Note', 'Default PO Line Template', 'Default Ex-Factory', 'Created By', 'Created', 'Last Edited', 'Last Edited By', 'Finish trim Order - Target Date', 'Finish trim Order - Completed Date', 'Link to line - Target Date', 'Link to line - Completed Date', 'Finish Care Label - Target Date', 'Finish Care Label - Completed Date', 'Packing & Shipping Instructions - Target Date', 'Packing & Shipping Instructions - Completed Date'
  ];
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFileName(file ? file.name : null);
    if (!file) return;
    const reader = new FileReader();
    const isCSV = file.name.endsWith('.csv');
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      let workbook;
      if (isCSV) {
        // For CSV, XLSX.read expects type 'string'
        workbook = XLSX.read(data, { type: 'string' });
      } else {
        // For Excel, use 'binary'
        workbook = XLSX.read(data, { type: 'binary' });
      }
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      // Map Excel/CSV columns to purchaseOrders structure
      const mappedOrders = (jsonData as any[]).map((row, idx) => {
        // Normalize keys: trim spaces from all keys
        const normalizedRow = Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key.trim(), value])
        );
        // Build the mapped object using the master column list
        const mapped: any = { id: idx + 1 };
        EXCEL_COLUMNS.forEach(col => {
          const val = normalizedRow[col];
          mapped[col] = (val === undefined || val === '') ? null : val;
        });
        // Add any extra fields from the row that aren't in the master list
        Object.keys(normalizedRow).forEach(key => {
          if (!EXCEL_COLUMNS.includes(key)) {
            mapped[key] = (normalizedRow[key] === undefined || normalizedRow[key] === '') ? null : normalizedRow[key];
          }
        });
        return mapped;
      });
      setPurchaseOrders(mappedOrders);
    };
    if (isCSV) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  // --- Export to Excel Handler ---
  const exportToExcel = () => {
    // Prepare data for export (filteredOrders)
    const ws = XLSX.utils.json_to_sheet(filteredOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PurchaseOrders');
    // Format date as MM-DD-YY
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    const dateStr = `${mm}-${dd}-${yy}`;
    XLSX.writeFile(wb, `purchase_orders_${dateStr}.xlsx`);
  };

  // --- Placeholder for backend API Excel integration ---
  // TODO: Implement backend API fetch for Excel data

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Production': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBulkApprovalColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Not Required': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOrders = purchaseOrders.filter(order => {
    const styleName = order['Style Name'] || '';
    const poNumber = order['Order References'] || '';
    const customer = order['Customer'] || '';
    const matchesSearch =
      styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (order['Status'] || '') === filterStatus;
    const matchesCustomer = filterCustomer === 'all' || (order['Customer'] || '') === filterCustomer;
    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const totalValue = filteredOrders.reduce((sum, order) => sum + order.totalValue, 0);
  const averageOrderValue = filteredOrders.length > 0 ? totalValue / filteredOrders.length : 0;

  // --- Get PO Lines Data ---
  // Reuse the PO lines generation logic from PurchaseOrderLines
  // (If you want to avoid double logic, you can move the PO lines generator to a shared util)
  const getPurchaseOrderLines = (poNumber: string) => {
    // This logic should match the one in PurchaseOrderLines.tsx
    // For now, we can copy the generator or import it if refactored
    // For this example, let's assume you have the same purchaseOrders array here
    const purchaseOrders = [
      {
        id: 1,
        poNumber: 'PO-2024-001',
        customer: 'H&M',
        styleNumber: 'SC001',
        styleName: 'Cotton T-Shirt Premium',
        colorway: 'Navy Blue',
        quantity: 10000,
        sizes: 'XS-XXL',
        unitPrice: 15.99,
        totalValue: 159900,
        status: 'Confirmed',
        exFactoryDate: '2024-02-15',
        destination: 'Hamburg, Germany',
        version: 'FC1',
        supplier: 'Textile Solutions Ltd',
        createdDate: '2024-01-10',
        lastUpdated: '2024-01-14',
        bulkApprovalStatus: 'Approved',
        progress: 85
      },
      {
        id: 2,
        poNumber: 'PO-2024-002',
        customer: 'Zara',
        styleNumber: 'SC002',
        styleName: 'Summer Dress Collection',
        colorway: 'Floral Print',
        quantity: 5000,
        sizes: 'XS-L',
        unitPrice: 29.99,
        totalValue: 149950,
        status: 'In Production',
        exFactoryDate: '2024-02-20',
        destination: 'Barcelona, Spain',
        version: 'FC2',
        supplier: 'Fashion Factory Inc',
        createdDate: '2024-01-12',
        lastUpdated: '2024-01-13',
        bulkApprovalStatus: 'Pending',
        progress: 60
      },
      {
        id: 3,
        poNumber: 'PO-2024-003',
        customer: 'Uniqlo',
        styleNumber: 'SC003',
        styleName: 'Denim Jacket Classic',
        colorway: 'Indigo',
        quantity: 8000,
        sizes: 'S-XL',
        unitPrice: 49.99,
        totalValue: 399920,
        status: 'Draft',
        exFactoryDate: '2024-03-01',
        destination: 'Tokyo, Japan',
        version: 'FC1',
        supplier: 'Denim Works Co',
        createdDate: '2024-01-14',
        lastUpdated: '2024-01-14',
        bulkApprovalStatus: 'Not Required',
        progress: 25
      },
      {
        id: 4,
        poNumber: 'PO-2024-004',
        customer: 'Nike',
        styleNumber: 'SC004',
        styleName: 'Athletic Shorts Pro',
        colorway: 'Black/White',
        quantity: 15000,
        sizes: 'XS-XXL',
        unitPrice: 24.99,
        totalValue: 374850,
        status: 'Shipped',
        exFactoryDate: '2024-01-25',
        destination: 'Portland, USA',
        version: 'FC3',
        supplier: 'SportsTech Manufacturing',
        createdDate: '2024-01-08',
        lastUpdated: '2024-01-11',
        bulkApprovalStatus: 'Approved',
        progress: 100
      },
      {
        id: 5,
        poNumber: 'PO-2024-005',
        customer: 'Patagonia',
        styleNumber: 'SC005',
        styleName: 'Winter Coat Premium',
        colorway: 'Forest Green',
        quantity: 3000,
        sizes: 'S-XL',
        unitPrice: 89.99,
        totalValue: 269970,
        status: 'Approved',
        exFactoryDate: '2024-02-28',
        destination: 'California, USA',
        version: 'FC1',
        supplier: 'OutdoorGear Manufacturing',
        createdDate: '2024-01-11',
        lastUpdated: '2024-01-12',
        bulkApprovalStatus: 'Approved',
        progress: 40
      },
    ];
    const sizeMap: { [key: string]: number } = {
      'XS': 0, 'S': 1, 'M': 2, 'L': 3, 'XL': 4, 'XXL': 5
    };
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    let lineId = 1;
    let lines: any[] = [];
    purchaseOrders.filter(po => (po.poNumber || (po as any)['Order References']) === poNumber).forEach(po => {
      const sizeRanges = (po.sizes || (po as any)['Sizes'] || '').split('-');
      const startSize = sizeMap[sizeRanges[0]] || 0;
      const endSize = sizeMap[sizeRanges[sizeRanges.length - 1]] || 0;
      const sizeCount = endSize - startSize + 1;
      const quantity = po.quantity || (po as any)['Total Qty'] || 0;
      const styleNumber = po.styleNumber || (po as any)['Style Number'] || '';
      const styleName = po.styleName || (po as any)['Style Name'] || '';
      const colorway = po.colorway || (po as any)['Colorway'] || '';
      const status = po.status || (po as any)['Status'] || '';
      const quantityPerSize = Math.floor(quantity / sizeCount);
      for (let i = startSize; i <= endSize; i++) {
        const size = sizes[i];
        const sizeQuantity = i === endSize ? quantity - (quantityPerSize * (sizeCount - 1)) : quantityPerSize;
        lines.push({
          id: lineId++,
          lineNumber: String(lineId - 1).padStart(3, '0'),
          size,
          quantity: sizeQuantity,
          styleNumber,
          styleName,
          colorway,
          status,
        });
      }
    });
    return lines;
  };

  // --- Dynamic Customer Filter Options ---
  const customerOptions = Array.from(new Set(purchaseOrders.map(order =>
    order.customer || order.Customer || order.CustomerName || ''
  ).filter(Boolean)));

  const subTabs = ['PO Details', 'Delivery', 'Critical Path', 'Audit', 'Totals', 'Comments'];
  const [activeSubTab, setActiveSubTab] = useState('PO Details');

  return (
    <div className="flex h-auto max-h-[90vh]">
      {/* Remove the left sidebar with Create PO and stats */}
      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Purchase Orders</h1>
            <p className="text-xs text-gray-600">Manage purchase orders and track production progress</p>
          </div>
          <div className="flex w-full md:w-auto justify-between md:justify-end items-end gap-2">
            <div className="flex flex-col items-start">
              <span className="mb-0.5 text-xs text-gray-700">{selectedFileName || "No file chosen"}</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-1 px-2 rounded-lg border-0 text-xs font-semibold bg-blue-200 text-blue-800 hover:bg-blue-300"
              >
                Choose File
              </button>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                ref={fileInputRef}
                onChange={handleExcelUpload}
                className="hidden"
              />
            </div>
            <div className="flex gap-1 items-center">
              <a href="file:///C:/Users/DELL/Downloads/purchase_orders.xlsx" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs">View Excel Source</a>
              <button onClick={exportToExcel} className="bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition-colors text-xs">Export to Excel</button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 mb-2">
          <div className="flex flex-col md:flex-row gap-1 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Filter className="h-3 w-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-700">Filters:</span>
              </div>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Approved">Approved</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Production">In Production</option>
                <option value="Shipped">Shipped</option>
              </select>
              <select 
                value={filterCustomer} 
                onChange={(e) => setFilterCustomer(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Customers</option>
                {customerOptions.map((customer) => (
                  <option key={customer} value={customer}>{customer}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-2 py-1 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Purchase Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-blue-600 border-b border-blue-700 sticky top-0 z-10">
                <tr>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">Order Reference</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">Status</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">Total Qty</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">Total Value</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">Total Cost</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">Customer</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">Supplier</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">Delivery Date</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">PO Issue Date</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const expanded = expandedPO === order['Order References'];
                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        className={`hover:bg-gray-50 cursor-pointer ${expanded ? 'bg-blue-50' : ''}`}
                        onClick={() => setExpandedPO(expanded ? null : order['Order References'])}
                        tabIndex={0}
                        aria-expanded={expanded}
                      >
                        <td className="py-2 px-2 text-xs">{order['Order References']}</td>
                        <td className="py-2 px-2 text-xs">{order['Status']}</td>
                        <td className="py-2 px-2 text-xs">{order['Total Qty']}</td>
                        <td className="py-2 px-2 text-xs">{order['Total Value']}</td>
                        <td className="py-2 px-2 text-xs">{order['Total Cost']}</td>
                        <td className="py-2 px-2 text-xs">{order['Customer']}</td>
                        <td className="py-2 px-2 text-xs">{order['Supplier']}</td>
                        <td className="py-2 px-2 text-xs">{order['Delivery Date']}</td>
                        <td className="py-2 px-2 text-xs">{order['PO Issue Date']}</td>
                        <td className="py-2 px-2 text-xs">
                          <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors" onClick={e => { e.stopPropagation(); setEditingOrder(order); setEditModalOpen(true); }}>
                            <Pencil className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr>
                          <td colSpan={10} className="bg-blue-50 px-6 py-4">
                            <div className="flex flex-row gap-2">
                              {/* PO Lines Data */}
                              <div className="flex-1">
                                <div className="bg-white rounded-lg shadow p-4 border border-blue-200">
                                  <div className="font-semibold text-blue-700 mb-2">Purchase Order Lines</div>
                                  <table className="w-full text-xs border border-blue-100 rounded mb-2">
                                    <thead className="bg-blue-50">
                                      <tr>
                                        <th className="px-0.5 py-1 text-left w-8">Line No.</th>
                                        <th className="px-0.5 py-1 text-left w-12">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {getPurchaseOrderLines(order['Order References']).map(line => (
                                        <tr key={line.id} className="border-b border-blue-50">
                                          <td className="px-0.5 py-1 w-8">{line.lineNumber}</td>
                                          <td className="px-0.5 py-1 w-12">{line.status}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              {/* Extra Info Card */}
                              <div className="w-[700px] min-w-[400px] max-w-[700px]">
                                <div className="bg-white rounded-lg shadow p-4 border border-blue-200">
                                  <div className="font-semibold text-blue-700 mb-2">Information</div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-2 text-xs">
                                    {/* Show Comments as the first field if present */}
                                    {order['Comments'] && (
                                      <div className="flex flex-col border-b border-blue-50 pb-1 mb-1 col-span-1">
                                        <span className="font-semibold text-gray-700">Comments</span>
                                        <span className="text-gray-900">{String(order['Comments'])}</span>
                                      </div>
                                    )}
                                    {Object.entries(order).map(([key, value]) => {
                                      // Skip the 10 main columns, id, and Total Cost, and skip Comments (already shown)
                                      if ([
                                        'poNumber', 'Order References', 'status', 'Status', 'quantity', 'Total Qty', 'totalValue', 'Total Value', 'Total Cost', 'customer', 'Customer', 'supplier', 'Supplier', 'Delivery Date', 'PO Issue Date', 'Comments', 'id'
                                      ].includes(key)) return null;
                                      return (
                                        <div key={key} className="flex flex-col border-b border-blue-50 pb-1 mb-1 col-span-1">
                                          <span className="font-semibold text-gray-700">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                          <span className="text-gray-900">{String(value)}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">No purchase orders found</h3>
            <p className="text-sm text-gray-600 mb-3">Try adjusting your filters or search query</p>
            <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Create New Purchase Order
            </button>
          </div>
        )}
      </div>
      {/* Collapsible Metrics Sidebar (sticky) */}
      <div className={`sticky top-0 h-screen z-20 relative transition-all duration-300 bg-gray-50 border-l border-gray-200 flex flex-col items-center ${sidebarOpen ? 'w-60' : 'w-15'}`}>
        {/* Toggle Button */}
        <button
          className="absolute -left-4 top-4 z-10 bg-white border border-gray-200 rounded-full shadow p-1 hover:bg-gray-100 transition-colors"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        {/* Create PO Button */}
        <button className={`bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-2 mt-4 flex items-center justify-center mx-2 ${sidebarOpen ? 'w-full px-3 py-2 space-x-2' : 'w-14 h-14 p-0'}`}>
          <Plus className="h-5 w-5" />
          {sidebarOpen && <span className="text-sm">Create PO</span>}
        </button>
        {/* Edit Button */}
        <button className={`bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors mb-2 flex items-center justify-center mx-2 ${sidebarOpen ? 'w-full px-3 py-2 space-x-2' : 'w-14 h-14 p-0'}`}>
          <Pencil className="h-5 w-5" />
          {sidebarOpen && <span className="text-sm">Edit</span>}
        </button>
        {/* Save Button */}
        <button className={`bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition-colors mb-4 flex items-center justify-center mx-2 ${sidebarOpen ? 'w-full px-3 py-2 space-x-2' : 'w-14 h-14 p-0'}`}>
          <Save className="h-5 w-5" />
          {sidebarOpen && <span className="text-sm">Save</span>}
        </button>
        {/* Stats Cards */}
        <div className={`space-y-2 w-full flex-1 flex flex-col items-center ${sidebarOpen ? '' : 'pt-2'}`}> {/* add pt-2 for compact mode */}
          {/* Total Orders */}
          <div className={`bg-gray-100 rounded-lg shadow-sm border border-gray-200 flex items-center mx-2 ${sidebarOpen ? 'p-2 w-full' : 'p-1 w-10 h-10 justify-center'} transition-all duration-300`}>
            <div className={`${sidebarOpen ? 'p-1' : 'p-0'} bg-blue-100 rounded-lg flex items-center justify-center`}> <ShoppingCart className="h-5 w-5 text-blue-600" /> </div>
            {sidebarOpen && (
              <div className="ml-2">
                <p className="text-[11px] text-gray-600">Total Orders</p>
                <p className="text-base font-bold text-gray-900">{purchaseOrders.length}</p>
              </div>
            )}
          </div>
          {/* Total Value */}
          <div className={`bg-gray-100 rounded-lg shadow-sm border border-gray-200 flex items-center mx-2 ${sidebarOpen ? 'p-2 w-full' : 'p-1 w-10 h-10 justify-center'} transition-all duration-300`}>
            <div className={`${sidebarOpen ? 'p-1' : 'p-0'} bg-green-100 rounded-lg flex items-center justify-center`}> <DollarSign className="h-5 w-5 text-green-600" /> </div>
            {sidebarOpen && (
              <div className="ml-2">
                <p className="text-[11px] text-gray-600">Total Value</p>
                <p className="text-base font-bold text-gray-900">${(totalValue / 1000000).toFixed(1)}M</p>
              </div>
            )}
          </div>
          {/* In Production */}
          <div className={`bg-gray-100 rounded-lg shadow-sm border border-gray-200 flex items-center mx-2 ${sidebarOpen ? 'p-2 w-full' : 'p-1 w-10 h-10 justify-center'} transition-all duration-300`}>
            <div className={`${sidebarOpen ? 'p-1' : 'p-0'} bg-blue-100 rounded-lg flex items-center justify-center`}> <Package className="h-5 w-5 text-blue-600" /> </div>
            {sidebarOpen && (
              <div className="ml-2">
                <p className="text-[11px] text-gray-600">In Production</p>
                <p className="text-base font-bold text-blue-600">{purchaseOrders.filter(po => po.status === 'In Production').length}</p>
              </div>
            )}
          </div>
          {/* Avg. Order Value */}
          <div className={`bg-gray-100 rounded-lg shadow-sm border border-gray-200 flex items-center mx-2 ${sidebarOpen ? 'p-2 w-full' : 'p-1 w-10 h-10 justify-center'} transition-all duration-300`}>
            <div className={`${sidebarOpen ? 'p-1' : 'p-0'} bg-purple-100 rounded-lg flex items-center justify-center`}> <TrendingUp className="h-5 w-5 text-purple-600" /> </div>
            {sidebarOpen && (
              <div className="ml-2">
                <p className="text-[11px] text-gray-600">Avg. Order Value</p>
                <p className="text-base font-bold text-purple-600">${averageOrderValue.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <EditPurchaseOrderModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        order={editingOrder}
        onSave={updatedOrder => {
          setPurchaseOrders(prev => prev.map(po => po.id === updatedOrder.id ? { ...po, ...updatedOrder } : po));
          setEditModalOpen(false);
        }}
      />
    </div>
  );
};

export default PurchaseOrders;