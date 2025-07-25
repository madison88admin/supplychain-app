import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { ChevronDown, ChevronRight } from 'lucide-react';

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
        col.key === 'Order References'
          ? <th key={col.key} rowSpan={2} className="sticky left-0 z-10 bg-white px-2 py-1 border-b text-left whitespace-nowrap align-middle border-r-2 border-gray-200">{col.label}</th>
          : <th key={col.key} rowSpan={2} className={`px-2 py-1 border-b text-left whitespace-nowrap align-middle${i < cols.length - 1 ? ' border-r-2 border-gray-200' : ''}`}>{col.label}</th>
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

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center mb-4 gap-2 relative">
        <h1 className="text-2xl font-bold mr-4">Purchase Orders</h1>
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
                    if (col.key === 'Order References') {
                      return [
                        <td key={col.key} className="sticky left-0 z-0 bg-white px-2 py-1 border-b align-top whitespace-nowrap border-r-2 border-gray-200"> 
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
                    <td colSpan={renderColumns().length} className="bg-blue-50 px-6 py-4">
                      <div>
                        <div className="font-semibold text-blue-700 mb-2">Purchase Order Details</div>
                        {/* Horizontal Tabs */}
                        <div className="mb-4 flex gap-2 border-b border-blue-200">
                          {subTabs.map(tab => (
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
                            <div>
                              <div className="font-semibold text-blue-700 mb-2">Purchase Order Details</div>
                              <table className="text-sm border border-blue-200 rounded mb-2 w-full">
                                <thead className="bg-blue-100">
                                  <tr>
                                    {poDetailsColumns.map(col => (
                                      <th key={col} className="px-2 py-1 text-left font-semibold">{col}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    {poDetailsColumns.map(col => (
                                      <td key={col} className="px-2 py-1">
                                        {poDetailsEditMode ? (
                                          <input
                                            className="border px-1 py-0.5 rounded w-full text-xs"
                                            value={poDetailsForm?.[col] ?? (col === 'Order Reference' ? displayRows[expandedIndex]?.['Order References'] || '' : displayRows[expandedIndex]?.[col] || '')}
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
                              <div className="flex gap-2 mt-2">
                                {!poDetailsEditMode && (
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {
                                    setPoDetailsEditMode(true);
                                    setPoDetailsForm({ ...(displayRows[expandedIndex] || {}) });
                                  }}>Edit</button>
                                )}
                                {poDetailsEditMode && (
                                  <>
                                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                      // Save edits
                                      const updatedRows = [...rows];
                                      const idx = expandedIndex;
                                      if (idx !== null && poDetailsForm) {
                                        // Map 'Order Reference' to 'Order References' in the row
                                        updatedRows[idx] = {
                                          ...updatedRows[idx],
                                          'Order References': poDetailsForm['Order Reference'],
                                          'Supplier': poDetailsForm['Supplier'],
                                          'Purchase Currency': poDetailsForm['Purchase Currency'],
                                          'Status': poDetailsForm['Status'],
                                          'Production': poDetailsForm['Production'],
                                          'MLA- Purchasing': poDetailsForm['MLA- Purchasing'],
                                          'China -QC': poDetailsForm['China -QC'],
                                          'MLA-Planning': poDetailsForm['MLA-Planning'],
                                          'MLA-Shipping': poDetailsForm['MLA-Shipping'],
                                          'Closed Date': poDetailsForm['Closed Date'],
                                          'Selling Currency': poDetailsForm['Selling Currency'],
                                        };
                                        setRows(updatedRows);
                                      }
                                      setPoDetailsEditMode(false);
                                      setPoDetailsForm(null);
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => {
                                      setPoDetailsEditMode(false);
                                      setPoDetailsForm(null);
                                    }}>Cancel</button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          {activeSubTab === 'Delivery' && (
                            <div>
                              <div className="font-semibold text-blue-700 mb-2">Delivery</div>
                              <div className="overflow-x-auto w-full">
                                <table className="text-sm border border-blue-200 rounded mb-2 min-w-[600px]">
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {deliveryDetailsColumns.map(col => (
                                        <th key={col} className="px-2 py-1 text-left font-semibold">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td key="Customer" className="px-2 py-1">{deliveryEditMode ? (
                                        <input className="border px-1 py-0.5 rounded w-full text-xs" value={deliveryForm?.['Customer'] ?? (displayRows[expandedIndex]?.['Customer'] || '')} onChange={e => setDeliveryForm(f => ({ ...(f || {}), 'Customer': e.target.value }))} />
                                      ) : (displayRows[expandedIndex]?.['Customer'] || '')}</td>
                                      <td key="Deliver To" className="px-2 py-1">{deliveryEditMode ? (
                                        <input className="border px-1 py-0.5 rounded w-full text-xs" value={deliveryForm?.['Deliver to'] ?? (displayRows[expandedIndex]?.['Deliver to'] || '')} onChange={e => setDeliveryForm(f => ({ ...(f || {}), 'Deliver to': e.target.value }))} />
                                      ) : (displayRows[expandedIndex]?.['Deliver to'] || '')}</td>
                                      <td key="Transport Method" className="px-2 py-1">{deliveryEditMode ? (
                                        <input className="border px-1 py-0.5 rounded w-full text-xs" value={deliveryForm?.['Transport Method'] ?? (displayRows[expandedIndex]?.['Transport Method'] || '')} onChange={e => setDeliveryForm(f => ({ ...(f || {}), 'Transport Method': e.target.value }))} />
                                      ) : (displayRows[expandedIndex]?.['Transport Method'] || '')}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {!deliveryEditMode && (
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {
                                    setDeliveryEditMode(true);
                                    setDeliveryForm({ ...(displayRows[expandedIndex] || {}) });
                                  }}>Edit</button>
                                )}
                                {deliveryEditMode && (
                                  <>
                                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                      const updatedRows = [...rows];
                                      const idx = expandedIndex;
                                      if (idx !== null && deliveryForm) {
                                        updatedRows[idx] = {
                                          ...updatedRows[idx],
                                          'Customer': deliveryForm['Customer'],
                                          'Deliver to': deliveryForm['Deliver to'],
                                          'Transport Method': deliveryForm['Transport Method'],
                                        };
                                        setRows(updatedRows);
                                      }
                                      setDeliveryEditMode(false);
                                      setDeliveryForm(null);
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => {
                                      setDeliveryEditMode(false);
                                      setDeliveryForm(null);
                                    }}>Cancel</button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          {activeSubTab === 'Critical Path' && (
                            <div>
                              <div className="font-semibold text-blue-700 mb-2">Critical Path</div>
                              <div className="overflow-x-auto w-full">
                                <table className="text-sm border border-blue-200 rounded mb-2 min-w-[400px]">
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {criticalPathColumns.map(col => (
                                        <th key={col} className="px-2 py-1 text-left font-semibold">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td key="Template" className="px-2 py-1">{criticalPathEditMode ? (
                                        <input className="border px-1 py-0.5 rounded w-full text-xs" value={criticalPathForm?.['Template'] ?? (displayRows[expandedIndex]?.['Template'] || '')} onChange={e => setCriticalPathForm(f => ({ ...(f || {}), 'Template': e.target.value }))} />
                                      ) : (displayRows[expandedIndex]?.['Template'] || '')}</td>
                                      <td key="PO Issue Date" className="px-2 py-1">{criticalPathEditMode ? (
                                        <input className="border px-1 py-0.5 rounded w-full text-xs" value={criticalPathForm?.['PO Issue Date'] ?? (displayRows[expandedIndex]?.['PO Issue Date'] || '')} onChange={e => setCriticalPathForm(f => ({ ...(f || {}), 'PO Issue Date': e.target.value }))} />
                                      ) : (displayRows[expandedIndex]?.['PO Issue Date'] || '')}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {!criticalPathEditMode && (
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {
                                    setCriticalPathEditMode(true);
                                    setCriticalPathForm({ ...(displayRows[expandedIndex] || {}) });
                                  }}>Edit</button>
                                )}
                                {criticalPathEditMode && (
                                  <>
                                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                      const updatedRows = [...rows];
                                      const idx = expandedIndex;
                                      if (idx !== null && criticalPathForm) {
                                        updatedRows[idx] = {
                                          ...updatedRows[idx],
                                          'Template': criticalPathForm['Template'],
                                          'PO Issue Date': criticalPathForm['PO Issue Date'],
                                        };
                                        setRows(updatedRows);
                                      }
                                      setCriticalPathEditMode(false);
                                      setCriticalPathForm(null);
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => {
                                      setCriticalPathEditMode(false);
                                      setCriticalPathForm(null);
                                    }}>Cancel</button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          {activeSubTab === 'Audit' && (
                            <div>
                              <div className="font-semibold text-blue-700 mb-2">Audit</div>
                              <div className="overflow-x-auto w-full">
                                <table className="text-sm border border-blue-200 rounded mb-2 min-w-[400px]">
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {auditColumns.map(col => (
                                        <th key={col} className="px-2 py-1 text-left font-semibold">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td key="Created By" className="px-2 py-1">{auditEditMode ? (
                                        <input className="border px-1 py-0.5 rounded w-full text-xs" value={auditForm?.['Created By'] ?? (displayRows[expandedIndex]?.['Created By'] || '')} onChange={e => setAuditForm(f => ({ ...(f || {}), 'Created By': e.target.value }))} />
                                      ) : (displayRows[expandedIndex]?.['Created By'] || '')}</td>
                                      <td key="Created" className="px-2 py-1">{auditEditMode ? (
                                        <input className="border px-1 py-0.5 rounded w-full text-xs" value={auditForm?.['Created'] ?? (displayRows[expandedIndex]?.['Created'] || '')} onChange={e => setAuditForm(f => ({ ...(f || {}), 'Created': e.target.value }))} />
                                      ) : (displayRows[expandedIndex]?.['Created'] || '')}</td>
                                      <td key="Last Edited" className="px-2 py-1">{auditEditMode ? (
                                        <input className="border px-1 py-0.5 rounded w-full text-xs" value={auditForm?.['Last Edited'] ?? (displayRows[expandedIndex]?.['Last Edited'] || '')} onChange={e => setAuditForm(f => ({ ...(f || {}), 'Last Edited': e.target.value }))} />
                                      ) : (displayRows[expandedIndex]?.['Last Edited'] || '')}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {!auditEditMode && (
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {
                                    setAuditEditMode(true);
                                    setAuditForm({ ...(displayRows[expandedIndex] || {}) });
                                  }}>Edit</button>
                                )}
                                {auditEditMode && (
                                  <>
                                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                      const updatedRows = [...rows];
                                      const idx = expandedIndex;
                                      if (idx !== null && auditForm) {
                                        updatedRows[idx] = {
                                          ...updatedRows[idx],
                                          'Created By': auditForm['Created By'],
                                          'Created': auditForm['Created'],
                                          'Last Edited': auditForm['Last Edited'],
                                        };
                                        setRows(updatedRows);
                                      }
                                      setAuditEditMode(false);
                                      setAuditForm(null);
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => {
                                      setAuditEditMode(false);
                                      setAuditForm(null);
                                    }}>Cancel</button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          {activeSubTab === 'Totals' && (
                            <div>
                              <div className="font-semibold text-blue-700 mb-2">Totals</div>
                              <div className="overflow-x-auto w-full">
                                <table className="text-sm border border-blue-200 rounded mb-2 min-w-[400px]">
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {totalsColumns.map(col => (
                                        <th key={col} className="px-2 py-1 text-left font-semibold">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td key="Total Qty" className="px-2 py-1">{totalsEditMode ? (
                                        <input className="border px-1 py-0.5 rounded w-full text-xs" value={totalsForm?.['Total Qty'] ?? (displayRows[expandedIndex]?.['Total Qty'] || '')} onChange={e => setTotalsForm(f => ({ ...(f || {}), 'Total Qty': e.target.value }))} />
                                      ) : (displayRows[expandedIndex]?.['Total Qty'] || '')}</td>
                                      <td key="Total Cost" className="px-2 py-1">{totalsEditMode ? (
                                        <input className="border px-1 py-0.5 rounded w-full text-xs" value={totalsForm?.['Total Cost'] ?? (displayRows[expandedIndex]?.['Total Cost'] || '')} onChange={e => setTotalsForm(f => ({ ...(f || {}), 'Total Cost': e.target.value }))} />
                                      ) : (displayRows[expandedIndex]?.['Total Cost'] || '')}</td>
                                      <td key="Total Value" className="px-2 py-1">{totalsEditMode ? (
                                        <input className="border px-1 py-0.5 rounded w-full text-xs" value={totalsForm?.['Total Value'] ?? (displayRows[expandedIndex]?.['Total Value'] || '')} onChange={e => setTotalsForm(f => ({ ...(f || {}), 'Total Value': e.target.value }))} />
                                      ) : (displayRows[expandedIndex]?.['Total Value'] || '')}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {!totalsEditMode && (
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {
                                    setTotalsEditMode(true);
                                    setTotalsForm({ ...(displayRows[expandedIndex] || {}) });
                                  }}>Edit</button>
                                )}
                                {totalsEditMode && (
                                  <>
                                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                      const updatedRows = [...rows];
                                      const idx = expandedIndex;
                                      if (idx !== null && totalsForm) {
                                        updatedRows[idx] = {
                                          ...updatedRows[idx],
                                          'Total Qty': totalsForm['Total Qty'],
                                          'Total Cost': totalsForm['Total Cost'],
                                          'Total Value': totalsForm['Total Value'],
                                        };
                                        setRows(updatedRows);
                                      }
                                      setTotalsEditMode(false);
                                      setTotalsForm(null);
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => {
                                      setTotalsEditMode(false);
                                      setTotalsForm(null);
                                    }}>Cancel</button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          {activeSubTab === 'Comments' && (
                            <div>
                              <div className="font-semibold text-blue-700 mb-2">Comments</div>
                              <div className="overflow-x-auto w-full">
                                <table className="text-sm border border-blue-200 rounded mb-2 min-w-[200px]">
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {commentsColumns.map(col => (
                                        <th key={col} className="px-2 py-1 text-left font-semibold">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td key="Comments" className="px-2 py-1">{commentsEditMode ? (
                                        <input className="border px-1 py-0.5 rounded w-full text-xs" value={commentsForm?.['Comments'] ?? (displayRows[expandedIndex]?.['Comments'] || '')} onChange={e => setCommentsForm(f => ({ ...(f || {}), 'Comments': e.target.value }))} />
                                      ) : (displayRows[expandedIndex]?.['Comments'] || '')}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {!commentsEditMode && (
                                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {
                                    setCommentsEditMode(true);
                                    setCommentsForm({ ...(displayRows[expandedIndex] || {}) });
                                  }}>Edit</button>
                                )}
                                {commentsEditMode && (
                                  <>
                                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {
                                      const updatedRows = [...rows];
                                      const idx = expandedIndex;
                                      if (idx !== null && commentsForm) {
                                        updatedRows[idx] = {
                                          ...updatedRows[idx],
                                          'Comments': commentsForm['Comments'],
                                        };
                                        setRows(updatedRows);
                                      }
                                      setCommentsEditMode(false);
                                      setCommentsForm(null);
                                    }}>Save</button>
                                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => {
                                      setCommentsEditMode(false);
                                      setCommentsForm(null);
                                    }}>Cancel</button>
                                  </>
                                )}
                              </div>
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