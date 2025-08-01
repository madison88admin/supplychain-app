import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { ChevronDown, ChevronRight } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const firstRow = cols.map((col, i) =>
      col.isGroup ? (
        <th key={col.key} colSpan={2} className={`px-2 py-1 border-b text-center whitespace-nowrap${i < cols.length - 1 ? ' border-r-2 border-gray-200' : ''}`}>{col.label}</th>
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

  const renderOrderReferencesSubTable = (orderRef: string) => {
    return (
      <div className="bg-blue-50 px-6 py-4">
        <div>
          <div className="font-semibold text-blue-700 mb-2">Material Purchase Order Details</div>
          {/* Subtable Content */}
          <div className="max-w-4xl w-full">
            <div className="bg-white rounded-lg border border-blue-200 p-4">
              <div className="overflow-x-auto">
                <table className="text-sm w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Order Reference</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Template</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Transport Method</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Deliver To</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Status</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Total Qty</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Total Cost</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Total Value</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Customer</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Supplier</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Purchase Currency</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Purchase Payment Term</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Closed Date</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">MPO Key Date</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Supplier Currency</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Supplier Description</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Supplier Parent</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Delivery Date</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Recipient Product Supplier</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Comments</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Purchasing</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">MPO Key User 2</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">MPO Key User 3</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">MPO Key User 4</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">MPO Key User 5</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">MPO Key User 6</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">MPO Key User 7</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">MPO Key User 8</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Note Count</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Latest Note</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Purchase Payment Term Description</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Created By</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Last Edited</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Selling Currency</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Selling Payment Term</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Delivery Contact</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Division</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Group</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Supplier Location</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Supplier Country</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Selling Payment Term Description</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Default Material Purchase Order Line Template</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Default MPO Line Key Date</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">MPO Key Working Group 1</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">MPO Key Working Group 2</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">MPO Key Working Group 3</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">MPO Key Working Group 4</th>
                      <th className="px-3 py-2 text-left font-semibold border border-gray-300">Last Edited By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-3 py-2 border border-gray-300">{orderRef}</td>
                      <td className="px-3 py-2 border border-gray-300">Standard MPO</td>
                      <td className="px-3 py-2 border border-gray-300">Sea Freight</td>
                      <td className="px-3 py-2 border border-gray-300">Main Warehouse</td>
                      <td className="px-3 py-2 border border-gray-300">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Open</span>
                      </td>
                      <td className="px-3 py-2 border border-gray-300">10,000 pcs</td>
                      <td className="px-3 py-2 border border-gray-300">$45,750</td>
                      <td className="px-3 py-2 border border-gray-300">$52,500</td>
                      <td className="px-3 py-2 border border-gray-300">Fashion Brand Inc</td>
                      <td className="px-3 py-2 border border-gray-300">Premium Textiles Co.</td>
                      <td className="px-3 py-2 border border-gray-300">USD</td>
                      <td className="px-3 py-2 border border-gray-300">Net 30</td>
                      <td className="px-3 py-2 border border-gray-300">2024-07-15</td>
                      <td className="px-3 py-2 border border-gray-300">2024-01-10</td>
                      <td className="px-3 py-2 border border-gray-300">USD</td>
                      <td className="px-3 py-2 border border-gray-300">Premium Textiles Co. Ltd</td>
                      <td className="px-3 py-2 border border-gray-300">Textile Group International</td>
                      <td className="px-3 py-2 border border-gray-300">2024-02-10</td>
                      <td className="px-3 py-2 border border-gray-300">Production Team</td>
                      <td className="px-3 py-2 border border-gray-300">Priority order for Spring collection</td>
                      <td className="px-3 py-2 border border-gray-300">John Smith</td>
                      <td className="px-3 py-2 border border-gray-300">Sarah Johnson</td>
                      <td className="px-3 py-2 border border-gray-300">Mike Wilson</td>
                      <td className="px-3 py-2 border border-gray-300">Lisa Brown</td>
                      <td className="px-3 py-2 border border-gray-300">David Lee</td>
                      <td className="px-3 py-2 border border-gray-300">Emma Davis</td>
                      <td className="px-3 py-2 border border-gray-300">Tom Anderson</td>
                      <td className="px-3 py-2 border border-gray-300">Anna Garcia</td>
                      <td className="px-3 py-2 border border-gray-300">5</td>
                      <td className="px-3 py-2 border border-gray-300">Materials confirmed for production</td>
                      <td className="px-3 py-2 border border-gray-300">Net 30 days from invoice date</td>
                      <td className="px-3 py-2 border border-gray-300">John Smith</td>
                      <td className="px-3 py-2 border border-gray-300">2024-01-15</td>
                      <td className="px-3 py-2 border border-gray-300">EUR</td>
                      <td className="px-3 py-2 border border-gray-300">Net 60</td>
                      <td className="px-3 py-2 border border-gray-300">Warehouse Manager</td>
                      <td className="px-3 py-2 border border-gray-300">Casual Wear</td>
                      <td className="px-3 py-2 border border-gray-300">A</td>
                      <td className="px-3 py-2 border border-gray-300">Shanghai, China</td>
                      <td className="px-3 py-2 border border-gray-300">China</td>
                      <td className="px-3 py-2 border border-gray-300">Net 60 days from delivery</td>
                      <td className="px-3 py-2 border border-gray-300">Standard Template</td>
                      <td className="px-3 py-2 border border-gray-300">2024-01-12</td>
                      <td className="px-3 py-2 border border-gray-300">Production</td>
                      <td className="px-3 py-2 border border-gray-300">Quality Control</td>
                      <td className="px-3 py-2 border border-gray-300">Logistics</td>
                      <td className="px-3 py-2 border border-gray-300">Finance</td>
                      <td className="px-3 py-2 border border-gray-300">John Smith</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Material Purchase Orders</h1>
      <div className="flex flex-wrap items-center mb-4 gap-2 relative">
        <button className="bg-blue-700 text-white px-3 py-1 rounded mr-2" onClick={handleImportClick}>Import</button>
        <input
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2" onClick={handleEdit} disabled={editIndex !== null || displayRows.length === 0}>Edit</button>
        <button className="bg-green-500 text-white px-3 py-1 rounded mr-2" onClick={handleSave} disabled={editIndex === null}>Save</button>
        <button className="bg-gray-500 text-white px-3 py-1 rounded mr-2" onClick={handleCopy} disabled={displayRows.length === 0}>Copy</button>
        <button className="bg-purple-500 text-white px-3 py-1 rounded mr-2" onClick={handleAdd} disabled={editIndex !== null}>Add</button>
        <button className="bg-indigo-500 text-white px-3 py-1 rounded mr-2" onClick={() => setShowColumnSelector(v => !v)}>Filter Columns</button>
        <button className="bg-green-700 text-white px-3 py-1 rounded mr-2" onClick={handleExport} disabled={displayRows.length === 0}>Export to XLSX</button>
        {showColumnSelector && (
          <div className="absolute z-10 bg-white border rounded shadow p-3 top-12 left-0 max-h-72 overflow-y-auto w-64">
            <div className="font-bold mb-2">Select Columns</div>
            <div className="flex gap-2 mb-2">
              <button className="bg-green-500 text-white px-2 py-1 rounded text-xs" onClick={() => setVisibleColumns(allColumns)}>Select All</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={() => setVisibleColumns([])}>Deselect All</button>
            </div>
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
        <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={handleFilter}>Filter</button>
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleClear} disabled={!search && !filteredRows}>Clear</button>
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
              <React.Fragment key={idx}>
                <tr
                  className={
                    (selectedIndex === idx ? 'bg-blue-50 ' : '') +
                    (editIndex === idx ? 'bg-yellow-50' : '')
                  }
                  onClick={() => setSelectedIndex(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  {renderColumns().flatMap((col, colIdx, arr) => {
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
                          {col.key === 'Order References' ? (
                            <div className="flex items-center space-x-1">
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
                            editIndex === idx ? (
                              <input
                                className="border px-1 py-0.5 rounded w-32 text-xs"
                                value={editRow ? editRow[col.key] : ''}
                                onChange={e => handleChange(col.key, e.target.value)}
                              />
                            ) : (
                              row[col.key] || ''
                            )
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
                    }, 0)} className="p-0">
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
              }, 0)} className="text-center py-4 text-gray-400">No results found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialPurchaseOrder; 