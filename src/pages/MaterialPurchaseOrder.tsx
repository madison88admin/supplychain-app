import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
              <tr
                key={idx}
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