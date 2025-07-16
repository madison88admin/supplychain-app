import React, { useState } from 'react';
import { Plus, Search, ChevronDown, ChevronRight } from 'lucide-react';
import AddProductModal from '../components/modals/AddProductModal';
import AddTechpackModal from '../components/modals/AddTechpackModal';
import { useData } from '../contexts/DataContext';

// Mock data for seasons
const mockSeasons = [
  { id: 'FH2024', name: 'FH:2024' },
  { id: 'FH2025', name: 'FH:2025' },
  { id: 'Library', name: 'Library' },
  { id: 'None', name: 'None' },
  { id: 'All', name: 'All' },
];

const techPackTabs = [
  'Tech Pack Version',
  'Costings',
  'Sample Lines',
  'Lines',
  'Bill Of Materials',
];

const detailTabs = [
  'Products',
  'Product Colors',
  'Product Color Sizes',
  'Images',
  'Option Images',
  'Details',
];

const techpackDetailTabs = [
  'Tech Pack Version',
  'Bill of Materials',
  'Size Specification',
  'Fit Log',
  'Fibre Composition',
  'Care Instructions',
  'Labels',
];

// Helper to safely get techpack field value by key
const getTechpackFieldValue = (tp: any, key: string) => {
  // Only allow known keys
  if (key in tp) return tp[key];
  return '';
};

// Helper for fibre composition group (mocked)
const getFibreCompositions = (tp: any) => {
  if (!tp.fibreCompositions) return [];
  return tp.fibreCompositions;
};

const ProductManager: React.FC = () => {
  const { products, techpacks, updateTechpack } = useData();
  const [selectedSeason, setSelectedSeason] = useState('FH2024');
  const [searchQuery, setSearchQuery] = useState(''); // main search
  const [sidebarSearch, setSidebarSearch] = useState(''); // sidebar search
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTechPackTab, setActiveTechPackTab] = useState(techPackTabs[0]);
  const [activeDetailTab, setActiveDetailTab] = useState(detailTabs[0]);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [expandedTechpackTab, setExpandedTechpackTab] = useState<string>(techpackDetailTabs[0]);
  const [editingCell, setEditingCell] = useState<{techpackId: string, field: string, fibreIdx?: number} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showAddTechpackModal, setShowAddTechpackModal] = useState(false);
  const [techpackModalProduct, setTechpackModalProduct] = useState<any | null>(null);
  const [editingVersionTechpackId, setEditingVersionTechpackId] = useState<string | null>(null);
  const [versionEditValues, setVersionEditValues] = useState<{ version: string; status: string; lastUpdated: string } | null>(null);

  // Filter products by season and both search inputs
  const filteredProducts = products.filter(product => {
    const matchesSeason = selectedSeason === 'All' || product.season === selectedSeason;
    const matchesMainSearch =
      product.styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.styleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSidebarSearch =
      product.styleName.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      product.styleNumber.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      product.customer.toLowerCase().includes(sidebarSearch.toLowerCase());
    // Both must match if both are used
    return matchesSeason && matchesMainSearch && matchesSidebarSearch;
  });

  // Helper: get techpacks for a product
  const getTechpacksForProduct = (product: any) =>
    techpacks.filter(tp => tp.styleNumber === product.styleNumber);

  // Handle cell edit (support fibre composition group)
  const handleCellEdit = (techpackId: string, field: string, value: string, fibreIdx?: number) => {
    if (typeof fibreIdx === 'number') {
      // Edit fibre composition group
      const tp = techpacks.find(tp => tp.id === techpackId);
      if (!tp) return;
      const fibreCompositions = getFibreCompositions(tp).slice();
      fibreCompositions[fibreIdx] = { ...fibreCompositions[fibreIdx], [field]: value };
      updateTechpack(techpackId, { fibreCompositions });
    } else {
      const tp = techpacks.find(tp => tp.id === techpackId);
      if (!tp) return;
      if (['version', 'status'].includes(field)) {
        // Save previous version/status to versionHistory
        const prevVersion = tp.version;
        const prevStatus = tp.status;
        const prevLastUpdated = tp.lastUpdated;
        const newHistory = Array.isArray(tp.versionHistory) ? [...tp.versionHistory] : [];
        newHistory.unshift({ version: prevVersion, status: prevStatus, lastUpdated: prevLastUpdated });
        updateTechpack(techpackId, { [field]: value, lastUpdated: new Date().toISOString().split('T')[0], versionHistory: newHistory });
      } else {
        updateTechpack(techpackId, { [field]: value });
      }
    }
    setEditingCell(null);
    setEditValue('');
  };

  // Add/remove fibre composition row
  const handleAddFibreRow = (techpackId: string) => {
    const tp = techpacks.find(tp => tp.id === techpackId);
    if (!tp) return;
    const fibreCompositions = getFibreCompositions(tp).slice();
    fibreCompositions.push({ fibreName: '', percentage: '', notes: '' });
    updateTechpack(techpackId, { fibreCompositions });
  };
  const handleRemoveFibreRow = (techpackId: string, idx: number) => {
    const tp = techpacks.find(tp => tp.id === techpackId);
    if (!tp) return;
    const fibreCompositions = getFibreCompositions(tp).slice();
    fibreCompositions.splice(idx, 1);
    updateTechpack(techpackId, { fibreCompositions });
  };

  // Mock fields for each tab (for demo, map to existing techpack fields)
  const getFieldsForTab = (tab: string) => {
    switch (tab) {
      case 'Tech Pack Version':
        return [
          { key: 'version', label: 'Version' },
          { key: 'status', label: 'Status' },
        ];
      case 'Bill of Materials':
        return [
          { key: 'category', label: 'Category' },
          { key: 'dueDate', label: 'Due Date' },
        ];
      case 'Size Specification':
        return [
          { key: 'completionRate', label: 'Completion (%)' },
        ];
      case 'Fit Log':
        return [
          { key: 'comments', label: 'Comments' },
        ];
      case 'Fibre Composition':
        return [
          { key: 'priority', label: 'Priority' },
        ];
      case 'Care Instructions':
        return [
          { key: 'createdBy', label: 'Created By' },
        ];
      case 'Labels':
        return [
          { key: 'name', label: 'Name' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] p-4 gap-4">
      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Season Tree</h2>
        {/* Sidebar Product Search */}
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search product..."
            value={sidebarSearch}
            onChange={e => setSidebarSearch(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <ul className="space-y-2">
          {mockSeasons.map(season => (
            <li key={season.id}>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedSeason === season.id ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
                onClick={() => setSelectedSeason(season.id)}
              >
                {season.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-5 w-5" /> Add New Product
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Plus className="h-5 w-5" /> Raise Sample Request
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Plus className="h-5 w-5" /> Create New Version
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2">
            Set as Current Version
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2">
            Audit
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
            Reporting
          </button>
        </div>

        {/* Tech Pack Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex gap-2">
            {techPackTabs.map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors ${activeTechPackTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTechPackTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex items-center mb-4">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th></th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Season</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Quantity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map(product => {
                  const expanded = expandedProductId === product.id;
                  const techpacksForProduct = techpacks.filter(tp => tp.styleNumber === product.styleNumber);
                  return (
                    <React.Fragment key={product.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-2 align-top">
                          <button
                            onClick={() => setExpandedProductId(expanded ? null : product.id)}
                            className="focus:outline-none"
                            aria-label={expanded ? 'Collapse' : 'Expand'}
                          >
                            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.styleName} className="w-10 h-10 rounded object-cover" />
                            <div>
                              <div className="font-medium text-gray-900">{product.styleName}</div>
                              <div className="text-xs text-gray-500">{product.styleNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{product.customer}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{product.season}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{product.status}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{product.quantity}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">${product.price}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{product.margin}%</td>
                      </tr>
                      {expanded && (
                        <tr>
                          <td colSpan={8} className="bg-blue-50 px-6 py-4">
                            <div>
                              <div className="font-semibold text-blue-700 mb-2">Techpacks for this product</div>
                              {/* Techpack Tabs */}
                              <div className="mb-2">
                                <nav className="flex gap-2">
                                  {techpackDetailTabs.map(tab => (
                                    <button
                                      key={tab}
                                      className={`px-3 py-1 rounded-t font-medium transition-colors ${expandedTechpackTab === tab ? 'bg-white border-x border-t border-blue-400 text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
                                      onClick={() => setExpandedTechpackTab(tab)}
                                    >
                                      {tab}
                                    </button>
                                  ))}
                                </nav>
                              </div>
                              {/* Techpack Editable Table(s) */}
                              {techpacksForProduct.length === 0 ? (
                                <div className="text-gray-500 flex flex-col items-center gap-2">
                                  No techpacks found for this product.
                                  <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-2"
                                    onClick={() => {
                                      setTechpackModalProduct(product);
                                      setShowAddTechpackModal(true);
                                    }}
                                  >
                                    Add Techpack
                                  </button>
                                </div>
                              ) : expandedTechpackTab === 'Fibre Composition' ? (
                                <div className="flex flex-col gap-6">
                                  {/* Version Control Table */}
                                  <div>
                                    <div className="font-semibold text-blue-700 mb-1">Version Control</div>
                                    {techpacksForProduct.map(tp => (
                                      <React.Fragment key={tp.id}>
                                        <table className="w-full text-sm border border-blue-200 rounded mb-2">
                                          <thead className="bg-blue-100">
                                            <tr>
                                              <th className="px-2 py-1 text-left">Version</th>
                                              <th className="px-2 py-1 text-left">Status</th>
                                              <th className="px-2 py-1 text-left">Last Updated</th>
                                              <th className="px-2 py-1 text-left">Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr className="border-b border-blue-100">
                                              {editingVersionTechpackId === tp.id ? (
                                                <>
                                                  <td className="px-2 py-1">
                                                    <input
                                                      type="text"
                                                      value={versionEditValues?.version ?? tp.version}
                                                      onChange={e => setVersionEditValues(v => ({ ...(v || { version: tp.version, status: tp.status, lastUpdated: tp.lastUpdated }), version: e.target.value }))}
                                                      className="px-1 py-0.5 border border-blue-300 rounded text-sm w-full"
                                                    />
                                                  </td>
                                                  <td className="px-2 py-1">
                                                    <input
                                                      type="text"
                                                      value={versionEditValues?.status ?? tp.status}
                                                      onChange={e => setVersionEditValues(v => ({ ...(v || { version: tp.version, status: tp.status, lastUpdated: tp.lastUpdated }), status: e.target.value }))}
                                                      className="px-1 py-0.5 border border-blue-300 rounded text-sm w-full"
                                                    />
                                                  </td>
                                                  <td className="px-2 py-1">
                                                    <input
                                                      type="text"
                                                      value={versionEditValues?.lastUpdated ?? tp.lastUpdated}
                                                      onChange={e => setVersionEditValues(v => ({ ...(v || { version: tp.version, status: tp.status, lastUpdated: tp.lastUpdated }), lastUpdated: e.target.value }))}
                                                      className="px-1 py-0.5 border border-blue-300 rounded text-sm w-full"
                                                    />
                                                  </td>
                                                  <td className="px-2 py-1 flex gap-2">
                                                    <button
                                                      className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border border-green-200 rounded"
                                                      onClick={() => {
                                                        // Save: push previous to versionHistory, update current
                                                        const prevVersion = tp.version;
                                                        const prevStatus = tp.status;
                                                        const prevLastUpdated = tp.lastUpdated;
                                                        const newHistory = Array.isArray(tp.versionHistory) ? [...tp.versionHistory] : [];
                                                        newHistory.unshift({ version: prevVersion, status: prevStatus, lastUpdated: prevLastUpdated });
                                                        updateTechpack(tp.id, {
                                                          version: versionEditValues?.version ?? tp.version,
                                                          status: (versionEditValues?.status ?? tp.status) as 'Draft' | 'In Review' | 'Approved' | 'Revision Required',
                                                          lastUpdated: versionEditValues?.lastUpdated ?? tp.lastUpdated,
                                                          versionHistory: newHistory
                                                        });
                                                        setEditingVersionTechpackId(null);
                                                        setVersionEditValues(null);
                                                      }}
                                                    >
                                                      Save
                                                    </button>
                                                    <button
                                                      className="text-gray-600 hover:text-gray-800 text-xs px-2 py-1 border border-gray-200 rounded"
                                                      onClick={() => {
                                                        setEditingVersionTechpackId(null);
                                                        setVersionEditValues(null);
                                                      }}
                                                    >
                                                      Cancel
                                                    </button>
                                                  </td>
                                                </>
                                              ) : (
                                                <>
                                                  <td className="px-2 py-1">{tp.version}</td>
                                                  <td className="px-2 py-1">{tp.status}</td>
                                                  <td className="px-2 py-1">{tp.lastUpdated}</td>
                                                  <td className="px-2 py-1">
                                                    <button
                                                      className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-200 rounded"
                                                      onClick={() => {
                                                        setEditingVersionTechpackId(tp.id);
                                                        setVersionEditValues({ version: tp.version, status: tp.status, lastUpdated: tp.lastUpdated });
                                                      }}
                                                    >
                                                      Edit
                                                    </button>
                                                  </td>
                                                </>
                                              )}
                                            </tr>
                                          </tbody>
                                        </table>
                                        {/* Version History Table */}
                                        {tp.versionHistory && tp.versionHistory.length > 0 && (
                                          <div className="mb-2">
                                            <div className="font-semibold text-gray-700 mb-1">Version History</div>
                                            <table className="w-full text-xs border border-gray-200 rounded">
                                              <thead className="bg-gray-100">
                                                <tr>
                                                  <th className="px-2 py-1 text-left">Version</th>
                                                  <th className="px-2 py-1 text-left">Status</th>
                                                  <th className="px-2 py-1 text-left">Last Updated</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {tp.versionHistory.map((vh, idx) => (
                                                  <tr key={idx} className="border-b border-gray-100">
                                                    <td className="px-2 py-1">{vh.version}</td>
                                                    <td className="px-2 py-1">{vh.status}</td>
                                                    <td className="px-2 py-1">{vh.lastUpdated}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                  {/* Fibre Composition Group Table */}
                                  <div>
                                    <div className="font-semibold text-blue-700 mb-1">Fibre Composition Group</div>
                                    {techpacksForProduct.map(tp => (
                                      <div key={tp.id} className="mb-4">
                                        <table className="w-full text-sm border border-blue-200 rounded mb-1">
                                          <thead className="bg-blue-100">
                                            <tr>
                                              <th className="px-2 py-1 text-left">Fibre Name</th>
                                              <th className="px-2 py-1 text-left">Percentage</th>
                                              <th className="px-2 py-1 text-left">Notes</th>
                                              <th className="px-2 py-1 text-left">Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {getFibreCompositions(tp).length === 0 ? (
                                              <tr>
                                                <td colSpan={4} className="text-gray-400 text-center py-2">No fibre composition rows. Click 'Add Row' to create one.</td>
                                              </tr>
                                            ) : (
                                              getFibreCompositions(tp).map((fibre: any, idx: number) => (
                                                <tr key={idx} className="border-b border-blue-100">
                                                  {['fibreName', 'percentage', 'notes'].map(field => (
                                                    <td key={field} className="px-2 py-1">
                                                      {editingCell && editingCell.techpackId === tp.id && editingCell.field === field && editingCell.fibreIdx === idx ? (
                                                        <input
                                                          type="text"
                                                          value={editValue}
                                                          autoFocus
                                                          onChange={e => setEditValue(e.target.value)}
                                                          onBlur={() => handleCellEdit(tp.id, field, editValue, idx)}
                                                          onKeyDown={e => {
                                                            if (e.key === 'Enter') handleCellEdit(tp.id, field, editValue, idx);
                                                            if (e.key === 'Escape') setEditingCell(null);
                                                          }}
                                                          className="px-1 py-0.5 border border-blue-300 rounded text-sm w-full"
                                                        />
                                                      ) : (
                                                        <span
                                                          className="cursor-pointer hover:underline"
                                                          onClick={() => {
                                                            setEditingCell({ techpackId: tp.id, field, fibreIdx: idx });
                                                            setEditValue(fibre[field]?.toString() ?? '');
                                                          }}
                                                        >
                                                          {fibre[field]?.toString() ?? ''}
                                                        </span>
                                                      )}
                                                    </td>
                                                  ))}
                                                  <td className="px-2 py-1">
                                                    <button
                                                      className="text-red-500 hover:text-red-700 text-xs px-2 py-1 border border-red-200 rounded"
                                                      onClick={() => handleRemoveFibreRow(tp.id, idx)}
                                                    >
                                                      Remove
                                                    </button>
                                                  </td>
                                                </tr>
                                              ))
                                            )}
                                          </tbody>
                                        </table>
                                        <button
                                          className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-200 rounded"
                                          onClick={() => handleAddFibreRow(tp.id)}
                                        >
                                          Add Row
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <table className="w-full text-sm border border-blue-200 rounded">
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {getFieldsForTab(expandedTechpackTab).map(field => (
                                        <th key={field.key} className="px-2 py-1 text-left">{field.label}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {techpacksForProduct.map(tp => (
                                      <tr key={tp.id} className="border-b border-blue-100">
                                        {getFieldsForTab(expandedTechpackTab).map(field => (
                                          <td key={field.key} className="px-2 py-1">
                                            {editingCell && editingCell.techpackId === tp.id && editingCell.field === field.key ? (
                                              <input
                                                type="text"
                                                value={editValue}
                                                autoFocus
                                                onChange={e => setEditValue(e.target.value)}
                                                onBlur={() => handleCellEdit(tp.id, field.key, editValue)}
                                                onKeyDown={e => {
                                                  if (e.key === 'Enter') handleCellEdit(tp.id, field.key, editValue);
                                                  if (e.key === 'Escape') setEditingCell(null);
                                                }}
                                                className="px-1 py-0.5 border border-blue-300 rounded text-sm w-full"
                                              />
                                            ) : (
                                              <span
                                                className="cursor-pointer hover:underline"
                                                onClick={() => {
                                                  setEditingCell({ techpackId: tp.id, field: field.key });
                                                  setEditValue(getTechpackFieldValue(tp, field.key)?.toString() ?? '');
                                                }}
                                              >
                                                {getTechpackFieldValue(tp, field.key)?.toString() ?? ''}
                                              </span>
                                            )}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
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

          {/* Detail Tabs */}
          <div className="border-t border-gray-200 bg-gray-50">
            <nav className="flex gap-2 px-4 pt-2">
              {detailTabs.map(tab => (
                <button
                  key={tab}
                  className={`px-3 py-2 font-medium rounded-t transition-colors ${activeDetailTab === tab ? 'bg-white border-x border-t border-gray-200 text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
                  onClick={() => setActiveDetailTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
            <div className="p-4">
              {/* Placeholder for detail tab content */}
              <div className="text-gray-500">{activeDetailTab} content goes here.</div>
            </div>
          </div>
        </div>
        <AddProductModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
        <AddTechpackModal
          isOpen={showAddTechpackModal}
          onClose={() => setShowAddTechpackModal(false)}
          initialStyleNumber={techpackModalProduct?.styleNumber}
          initialCustomer={techpackModalProduct?.customer}
        />
      </main>
    </div>
  );
};

export default ProductManager;