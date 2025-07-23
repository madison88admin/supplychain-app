import React, { useState } from 'react';
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

  // --- Excel Upload Handler ---
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

        return {
          id: idx + 1,
          poNumber: normalizedRow['Name'] || normalizedRow['Order References'] || normalizedRow['PO Number'] || normalizedRow['poNumber'] || '',
          customer: normalizedRow['Customer'] || normalizedRow['CustomerName'] || normalizedRow['customer'] || '',
          styleNumber: normalizedRow['Style Number'] || normalizedRow['styleNumber'] || '',
          styleName: normalizedRow['Style Name'] || normalizedRow['styleName'] || '',
          colorway: normalizedRow['Colorway'] || normalizedRow['colorway'] || '',
          quantity: Number(normalizedRow['Quantity'] || normalizedRow['quantity'] || 0),
          sizes: normalizedRow['Sizes'] || normalizedRow['sizes'] || '',
          unitPrice: Number(normalizedRow['Unit Price'] || normalizedRow['unitPrice'] || 0),
          totalValue: Number(normalizedRow['Total Value'] || normalizedRow['totalValue'] || 0),
          status: normalizedRow['Status'] || normalizedRow['StatusName'] || normalizedRow['status'] || '',
          exFactoryDate: normalizedRow['Ex-Factory Date'] || normalizedRow['exFactoryDate'] || '',
          destination: normalizedRow['Destination'] || normalizedRow['Location'] || normalizedRow['LocationName'] || normalizedRow['destination'] || '',
          version: normalizedRow['Version'] || normalizedRow['version'] || '',
          supplier: normalizedRow['Supplier'] || normalizedRow['supplier'] || '',
          createdDate: normalizedRow['Created Date'] || normalizedRow['createdDate'] || '',
          lastUpdated: normalizedRow['Last Updated'] || normalizedRow['lastUpdated'] || '',
          bulkApprovalStatus: normalizedRow['Bulk Approval Status'] || normalizedRow['bulkApprovalStatus'] || '',
          progress: Number(normalizedRow['Progress'] || normalizedRow['progress'] || 0),
        };
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
    const matchesSearch = order.styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesCustomer = filterCustomer === 'all' || order.customer === filterCustomer;
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
    purchaseOrders.filter(po => po.poNumber === poNumber).forEach(po => {
      const sizeRanges = po.sizes.split('-');
      const startSize = sizeMap[sizeRanges[0]] || 0;
      const endSize = sizeMap[sizeRanges[sizeRanges.length - 1]] || 0;
      const sizeCount = endSize - startSize + 1;
      const quantityPerSize = Math.floor(po.quantity / sizeCount);
      for (let i = startSize; i <= endSize; i++) {
        const size = sizes[i];
        const sizeQuantity = i === endSize ? po.quantity - (quantityPerSize * (sizeCount - 1)) : quantityPerSize;
        lines.push({
          id: lineId++,
          lineNumber: String(lineId - 1).padStart(3, '0'),
          size,
          quantity: sizeQuantity,
          styleNumber: po.styleNumber,
          styleName: po.styleName,
          colorway: po.colorway,
          status: po.status,
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
            <p className="text-sm text-gray-600">Manage purchase orders and track production progress</p>
          </div>
          <div className="flex gap-2 items-center">
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <a href="https://1drv.ms/x/c/491b76432c9908e6/Eay_Qx5RaG9MlDoxhaP4TlgBGPJqPrtjRWG26tJyF5JOBw?e=HAQAJN" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">View Excel Source</a>
            <button onClick={exportToExcel} className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">Export to Excel</button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Customers</option>
                {customerOptions.map((customer) => (
                  <option key={customer} value={customer}>{customer}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">PO Number</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">Product</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">Customer</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white">Status</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white hidden md:table-cell">Quantity</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white hidden md:table-cell">Total Value</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white hidden lg:table-cell">Location</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white hidden lg:table-cell">Progress</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-white hidden xl:table-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const expanded = expandedPO === order.poNumber;
                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        className={`hover:bg-gray-50 cursor-pointer ${expanded ? 'bg-blue-50' : ''}`}
                        onClick={() => setExpandedPO(expanded ? null : order.poNumber)}
                        tabIndex={0}
                        aria-expanded={expanded}
                      >
                        <td className="py-2 px-2">
                          <div>
                            <div className="font-bold text-xs text-gray-900" title={order.poNumber}>{order.poNumber?.toString().slice(0, 8)}</div>
                            <div className="text-[10px] text-gray-500">{order.version}</div>
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <div>
                            <div className="font-medium text-xs text-gray-900">{order.styleName}</div>
                            <div className="text-[10px] text-gray-500">{order.styleNumber} • {order.colorway}</div>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-xs text-gray-900">{order.customer}</td>
                        <td className="py-2 px-2">
                          <div className="space-y-1">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-medium border ${getStatusColor(order.status)}`}>{order.status}</span>
                            <div>
                              <span className={`px-2 py-1 rounded-full text-[10px] font-medium border ${getBulkApprovalColor(order.bulkApprovalStatus)}`}>{order.bulkApprovalStatus}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2 hidden md:table-cell">
                          <div>
                            <div className="text-xs text-gray-900">{order.quantity.toLocaleString()}</div>
                            <div className="text-[10px] text-gray-500">{order.sizes}</div>
                          </div>
                        </td>
                        <td className="py-2 px-2 hidden md:table-cell">
                          <div>
                            <div className="text-xs font-medium text-gray-900">${order.totalValue.toLocaleString()}</div>
                            <div className="text-[10px] text-gray-500">${order.unitPrice}/unit</div>
                          </div>
                        </td>
                        <td className="py-2 px-2 hidden lg:table-cell">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-900">{order.destination}</span>
                          </div>
                        </td>
                        <td className="py-2 px-2 hidden lg:table-cell">
                          <div className="w-12">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-gray-600">{order.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full ${order.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${order.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2 hidden xl:table-cell">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors" onClick={e => { e.stopPropagation(); setEditingOrder(order); setEditModalOpen(true); }}>
                              <Pencil className="h-3 w-3" />
                            </button>
                            {order.status === 'Shipped' && (
                              <button className="p-1 text-purple-600 hover:text-purple-800 transition-colors">
                                <Truck className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expanded && (
                        <tr>
                          <td colSpan={9} className="bg-blue-50 px-6 py-4">
                            <div className="bg-white rounded-lg shadow p-4 border border-blue-200">
                              <div className="font-semibold text-blue-700 mb-2">Purchase Order Lines</div>
                              <table className="w-full text-xs border border-blue-100 rounded mb-2">
                                <thead className="bg-blue-50">
                                  <tr>
                                    <th className="px-2 py-1 text-left">Line #</th>
                                    <th className="px-2 py-1 text-left">Size</th>
                                    <th className="px-2 py-1 text-left">Quantity</th>
                                    <th className="px-2 py-1 text-left">Style</th>
                                    <th className="px-2 py-1 text-left">Colorway</th>
                                    <th className="px-2 py-1 text-left">Status</th> {/* Add this */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {getPurchaseOrderLines(order.poNumber).map(line => (
                                    <tr key={line.id} className="border-b border-blue-50">
                                      <td className="px-2 py-1">{line.lineNumber}</td>
                                      <td className="px-2 py-1">{line.size}</td>
                                      <td className="px-2 py-1">{line.quantity}</td>
                                      <td className="px-2 py-1">{line.styleNumber} - {line.styleName}</td>
                                      <td className="px-2 py-1">{line.colorway}</td>
                                      <td className="px-2 py-1">{line.status}</td> {/* Show status here */}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
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