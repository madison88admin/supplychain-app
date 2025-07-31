import React, { useState } from 'react';
import ReportBar from '../components/ReportBar';
<<<<<<< HEAD
import { Users, Grid, Menu, ChevronRight, ChevronDown, X } from 'lucide-react';
=======
>>>>>>> 1477f560acee0605b1abcbc5da3ec2b0bbcfa6b3
import { useSidebar } from '../contexts/SidebarContext';

const ProductManager: React.FC = () => {
  const [leftActiveTab, setLeftActiveTab] = useState('Tech Pack Version');
  const [rightActiveTab, setRightActiveTab] = useState('Products');
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(['Spring/Summer 2024']);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [selectedProductFilter, setSelectedProductFilter] = useState('Default');
  const [isProductFilterDropdownOpen, setIsProductFilterDropdownOpen] = useState(false);
  const [showSlideUpContainer, setShowSlideUpContainer] = useState(false);
  const [activeContent, setActiveContent] = useState('activities');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  
<<<<<<< HEAD
  // Product Filter Sidebar state
  const [filterSidebarCollapsed, setFilterSidebarCollapsed] = useState(false);
  
  // Sidebar context
  const { sidebarCollapsed } = useSidebar();

  // ProductFilterSidebar Component (moved inside ProductManager)
  const ProductFilterSidebar: React.FC<{ collapsed: boolean; setCollapsed: (collapsed: boolean) => void }> = ({ 
    collapsed, 
    setCollapsed 
  }) => {
    const [selectedSeasons, setSelectedSeasons] = useState<string[]>(['FH:2024', 'FH:2018']);
    const [selectedProductSeason, setSelectedProductSeason] = useState('Library');
    const [expandedItems, setExpandedItems] = useState<string[]>(['Library']);
    const [selectedCategory, setSelectedCategory] = useState('Youth');
    const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
    const [isProductSeasonDropdownOpen, setIsProductSeasonDropdownOpen] = useState(false);

    // Season data
    const availableSeasons = [
      'FH:2018',
      'FH:2019', 
      'FH:2020',
      'FH:2021',
      'FH:2022',
      'FH:2023',
      'FH:2024',
      'FH:2025'
    ];

    // Product season tree data - now dynamically generated based on selected seasons
    const generateSeasonTreeData = () => {
      const seasonItems = selectedSeasons.map(season => ({
        id: season.toLowerCase().replace(/[^a-z0-9]/g, ''),
        label: season,
        type: 'category' as const,
        expanded: false,
        children: [
          { id: 'mens', label: 'Mens', type: 'subcategory' as const },
          { id: 'womens', label: 'Womens', type: 'subcategory' as const },
          { id: 'home', label: 'Home', type: 'subcategory' as const },
          { id: 'unisex', label: 'Unisex', type: 'subcategory' as const },
          { id: 'youth', label: 'Youth', type: 'subcategory' as const }
        ]
      }));

      return [
        ...seasonItems,
        { 
          id: 'library', 
          label: 'Library', 
          type: 'category' as const, 
          expanded: true,
          children: [
            { id: 'mens', label: 'Mens', type: 'subcategory' as const },
            { id: 'womens', label: 'Womens', type: 'subcategory' as const },
            { id: 'home', label: 'Home', type: 'subcategory' as const },
            { id: 'unisex', label: 'Unisex', type: 'subcategory' as const },
            { id: 'youth', label: 'Youth', type: 'subcategory' as const }
          ]
        },
        { 
          id: 'none', 
          label: 'None', 
          type: 'category' as const, 
          expanded: false,
          children: [
            { id: 'mens', label: 'Mens', type: 'subcategory' as const },
            { id: 'womens', label: 'Womens', type: 'subcategory' as const },
            { id: 'home', label: 'Home', type: 'subcategory' as const },
            { id: 'unisex', label: 'Unisex', type: 'subcategory' as const },
            { id: 'youth', label: 'Youth', type: 'subcategory' as const }
          ]
        },
        { 
          id: 'all', 
          label: 'All', 
          type: 'category' as const, 
          expanded: false,
          children: [
            { id: 'mens', label: 'Mens', type: 'subcategory' as const },
            { id: 'womens', label: 'Womens', type: 'subcategory' as const },
            { id: 'home', label: 'Home', type: 'subcategory' as const },
            { id: 'unisex', label: 'Unisex', type: 'subcategory' as const },
            { id: 'youth', label: 'Youth', type: 'subcategory' as const }
          ]
        }
      ];
    };

    const seasonTreeData = generateSeasonTreeData();

    const toggleSeason = (season: string) => {
      setSelectedSeasons(prev => 
        prev.includes(season) 
          ? prev.filter(s => s !== season)
          : [...prev, season]
      );
    };

    const removeSeason = (season: string) => {
      setSelectedSeasons(prev => prev.filter(s => s !== season));
    };

    const toggleExpanded = (itemId: string) => {
      setExpandedItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    };

    const handleCategorySelect = (category: string) => {
      setSelectedCategory(category);
    };

    const handleSeasonRemoveFromTree = (season: string) => {
      setSelectedSeasons(prev => prev.filter(s => s !== season));
    };

    const renderTreeItem = (item: any) => {
      const isExpanded = expandedItems.includes(item.id);
      const isSelected = selectedCategory === item.label;
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div key={item.id} className="flex flex-col">
          <div 
            className={`flex items-center p-2 cursor-pointer rounded-md transition-all duration-200 ${
              isSelected 
                ? 'bg-blue-50 border border-blue-500' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => {
              if (hasChildren) {
                toggleExpanded(item.id);
              } else {
                handleCategorySelect(item.label);
              }
            }}
          >
            <div className="flex items-center gap-2 flex-1">
              {hasChildren && (
                <span className="flex items-center justify-center w-4 h-4 text-gray-500">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              )}
              <span className="text-sm text-gray-700 flex-1">{item.label}</span>
              {isSelected && <ChevronRight size={14} className="text-blue-500" />}
            </div>
          </div>
          
          {hasChildren && isExpanded && (
            <div className="ml-6 flex flex-col gap-0.5">
              {item.children.map((child: any) => (
                <div 
                  key={child.id} 
                  className={`flex items-center justify-between p-1.5 cursor-pointer rounded transition-all duration-200 ${
                    selectedCategory === child.label 
                      ? 'bg-blue-50 border border-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCategorySelect(child.label)}
                >
                  <span className="text-sm text-gray-700">{child.label}</span>
                  {selectedCategory === child.label && <ChevronRight size={14} className="text-blue-500" />}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

         return (
       <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden h-screen ${
         collapsed ? 'w-16' : 'w-72'
       }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 min-h-14">
          <h3 className={`font-semibold text-gray-900 transition-opacity duration-300 ${
            collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          }`}>
            Product Filters
          </h3>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-8 h-8 bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-300"
          >
            <ChevronRight className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Season Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-gray-500" />
            <span className={`text-sm font-semibold text-gray-700 uppercase tracking-wide transition-opacity duration-300 ${
              collapsed ? 'opacity-0' : 'opacity-100'
            }`}>
              Season
            </span>
          </div>
          
          <div className={`flex flex-wrap gap-2 mb-3 transition-opacity duration-300 ${
            collapsed ? 'opacity-0' : 'opacity-100'
          }`}>
            {selectedSeasons.map(season => (
              <div key={season} className="flex items-center gap-1 px-2 py-1 bg-indigo-100 border border-indigo-500 rounded-md">
                <span className="text-xs text-indigo-700">{season}</span>
                <button
                  onClick={() => removeSeason(season)}
                  className="flex items-center justify-center w-4 h-4 bg-transparent border-none cursor-pointer text-indigo-700 hover:bg-indigo-200 rounded-full transition-all duration-200"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          
          <div className={`relative transition-opacity duration-300 ${
            collapsed ? 'opacity-0' : 'opacity-100'
          }`}>
            <button 
              onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
              className="flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer text-sm text-gray-700 hover:border-blue-500 hover:bg-gray-50 transition-all duration-200"
            >
              <span>Add Season</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isSeasonDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSeasonDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                {availableSeasons
                  .filter(season => !selectedSeasons.includes(season))
                  .map(season => (
                    <button
                      key={season}
                      onClick={() => {
                        toggleSeason(season);
                        setIsSeasonDropdownOpen(false);
                      }}
                      className="block w-full px-3 py-2 bg-transparent border-none cursor-pointer text-sm text-gray-700 text-left hover:bg-gray-100 transition-colors duration-200"
                    >
                      {season}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Season Trees Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Grid size={16} className="text-gray-500" />
            <span className={`text-sm font-semibold text-gray-700 uppercase tracking-wide transition-opacity duration-300 ${
              collapsed ? 'opacity-0' : 'opacity-100'
            }`}>
              Product Season Trees
            </span>
          </div>
          
          <div className={`relative transition-opacity duration-300 ${
            collapsed ? 'opacity-0' : 'opacity-100'
          }`}>
            <button 
              onClick={() => setIsProductSeasonDropdownOpen(!isProductSeasonDropdownOpen)}
              className="flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer text-sm text-gray-700 hover:border-blue-500 hover:bg-gray-50 transition-all duration-200"
            >
              <span>{selectedProductSeason}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isProductSeasonDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProductSeasonDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                {['Library', 'Custom', 'Shared', 'Archived'].map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedProductSeason(option);
                      setIsProductSeasonDropdownOpen(false);
                    }}
                    className="block w-full px-3 py-2 bg-transparent border-none cursor-pointer text-sm text-gray-700 text-left hover:bg-gray-100 transition-colors duration-200"
=======
  // Sidebar context
  const { sidebarCollapsed } = useSidebar();
  return (
    <div className="p-6">
      <div className="mb-8 flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-900">Product Manager</h1>
        
        {/* Season Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {selectedSeasons.length === 0 
                ? 'All Seasons' 
                : selectedSeasons.length === 1 
                  ? selectedSeasons[0] 
                  : `${selectedSeasons.length} Seasons`
              }
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isSeasonDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isSeasonDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Filter by Season</h3>
                  <button
                    onClick={() => {
                      setSelectedSeasons([]);
                      setIsSeasonDropdownOpen(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="py-1 max-h-48 overflow-y-auto">
                {[
                  'Spring/Summer 2024',
                  'Fall/Winter 2024',
                  'Spring/Summer 2025',
                  'Fall/Winter 2025',
                  'Holiday 2024',
                  'Resort 2025'
                ].map((season) => (
                  <label
                    key={season}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSeasons.includes(season)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSeasons([...selectedSeasons, season]);
                        } else {
                          setSelectedSeasons(selectedSeasons.filter(s => s !== season));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">{season}</span>
                  </label>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200">
                <button
                  onClick={() => setIsSeasonDropdownOpen(false)}
                  className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProductFilterDropdownOpen(!isProductFilterDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{selectedProductFilter}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isProductFilterDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isProductFilterDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="py-1">
                {['Default', 'Library'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedProductFilter(option);
                      setIsProductFilterDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedProductFilter === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
>>>>>>> 1477f560acee0605b1abcbc5da3ec2b0bbcfa6b3
                  >
                    {option}
                  </button>
                ))}
              </div>
<<<<<<< HEAD
            )}
          </div>
        </div>

        {/* Season Tree Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Menu size={16} className="text-gray-500" />
            <span className={`text-sm font-semibold text-gray-700 uppercase tracking-wide transition-opacity duration-300 ${
              collapsed ? 'opacity-0' : 'opacity-100'
            }`}>
              Season Tree
            </span>
          </div>
          
          <div className={`flex flex-col gap-1 transition-opacity duration-300 ${
            collapsed ? 'opacity-0' : 'opacity-100'
          }`}>
            {seasonTreeData.map(item => renderTreeItem(item))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content with Product Filter Sidebar */}
      <div className="flex-1 flex">
        {/* Product Filter Sidebar - positioned inside the page content */}
        <ProductFilterSidebar 
          collapsed={filterSidebarCollapsed}
          setCollapsed={setFilterSidebarCollapsed}
        />
        
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${filterSidebarCollapsed ? 'ml-0' : 'ml-0'}`}>
          <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Product Manager</h1>
=======
            </div>
          )}
        </div>
>>>>>>> 1477f560acee0605b1abcbc5da3ec2b0bbcfa6b3
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Left Column - Tech Pack Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b" style={{ borderColor: '#3D75A3' }}>
            <div className="flex">
              {['Tech Pack Version', 'Costings', 'Sample Lines', 'Lines', 'Bill Of Materials'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLeftActiveTab(tab)}
                  className={`px-4 py-3 font-medium text-xs ${
                    leftActiveTab === tab
                      ? 'bg-gray-100 text-gray-900 border-t-2 border-l-2 shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                  style={leftActiveTab === tab ? { borderColor: '#3D75A3' } : {}}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-4">
            <div className="overflow-x-auto">
              {leftActiveTab === 'Tech Pack Version' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
<<<<<<< HEAD
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VERSION NUMBER</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMMENT</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BILL OF MATERIAL VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE SPECIFICATION VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CARE INSTRUCTIONS VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIBRE COMPOSITION VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LABEL VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CURRENT VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED BY</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED</th>
=======
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APPROVED BY</th>
>>>>>>> 1477f560acee0605b1abcbc5da3ec2b0bbcfa6b3
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
<<<<<<< HEAD
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Cotton T-Shirt</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">v1.0</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Initial version</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">BOM-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">SIZE-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">CARE-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIBRE-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">LABEL-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIT-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Yes</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Cotton T-Shirt</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">v1.1</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Updated sizing</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">BOM-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">SIZE-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">CARE-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIBRE-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">LABEL-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIT-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">No</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Sarah Johnson</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-20</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Cotton T-Shirt</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">v1.2</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Material update</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">BOM-003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">SIZE-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">CARE-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIBRE-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">LABEL-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIT-003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">No</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Mike Wilson</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-25</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Cotton T-Shirt</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">v2.0</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Major revision</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">BOM-004</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">SIZE-003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">CARE-003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIBRE-003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">LABEL-003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIT-004</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">No</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Lisa Chen</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-02-01</td>
=======
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">v1.0</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">v1.1</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-20</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">-</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">v1.2</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-25</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-blue-100 text-blue-800">
                          In Review
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Sarah Johnson</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">v2.0</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-02-01</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">-</td>
>>>>>>> 1477f560acee0605b1abcbc5da3ec2b0bbcfa6b3
                    </tr>
                  </tbody>
                </table>
              )}

              {leftActiveTab === 'Costings' && (
<<<<<<< HEAD
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                  <thead className="bg-gray-50">
                    <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING REFERENCE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT NAME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT CUSTOMER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MINIMUM ORDER QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER QUANTITY INCREMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER LEAD TIME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE ORDER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO. OF COLORS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE PRICE TOTAL</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING PRICE TOTAL</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST RECALCULATED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER LOCATION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER COUNTRY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEFAULT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADD NEW COLORS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APPROVED DATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER STYLE NAME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER REF.</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER STYLE NUMBER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED BY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST EDITED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST EDITED BY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LANDED SUBTOTAL</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELL INC COMM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER SURCHARGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER SURCHARGE PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MARGIN</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LANDED SUBTOTAL COST</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPECIAL SUR</th>
=======
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMPONENT</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MATERIAL COST</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LABOR COST</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL COST</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MARGIN %</th>
>>>>>>> 1477f560acee0605b1abcbc5da3ec2b0bbcfa6b3
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
<<<<<<< HEAD
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">COST-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Cotton T-Shirt</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">ABC Textiles</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fashion Retail Co</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$8.50</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12.75</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">1000</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">500</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">100</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">30 days</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Standard</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">PO-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SR-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">3</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$8,500.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12,750.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Shanghai</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">China</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Yes</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Yes</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-20</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Active</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 30</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">30 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 60</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">60 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">TS-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SUP-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">BSN-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Initial costing</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-10</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Sarah Johnson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$9,200.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$13,800.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$700.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">7.6%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">35.2%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$8,500.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">COST-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Denim Jeans</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">XYZ Denim</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Blue Jeans Inc</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$15.25</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$22.88</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">800</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">400</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">50</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">45 days</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Premium</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">PO-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SR-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12,200.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$18,304.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-18</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Dhaka</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Bangladesh</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">No</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">No</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-25</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Pending</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">In Development</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 45</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">45 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 90</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">90 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">EUR</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">DJ-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SUP-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">BSN-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Premium denim</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Mike Wilson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-12</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-18</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Lisa Chen</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$13,500.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$20,250.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$1,300.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">10.7%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">33.3%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12,200.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">COST-003</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Wool Sweater</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Wool Masters</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Winter Wear Ltd</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$22.75</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$34.13</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">600</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">300</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">75</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">60 days</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Luxury</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">PO-003</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SR-003</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">4</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$13,650.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$20,478.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-22</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Milan</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Italy</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Yes</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Yes</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-28</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Active</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 60</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">60 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 120</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">120 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">EUR</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">WS-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SUP-003</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">BSN-003</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Premium wool</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">David Brown</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-22</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Emma Davis</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$15,200.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$22,800.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$1,550.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">11.4%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">33.3%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$13,650.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              )}

              {leftActiveTab === 'Sample Lines' && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST LINE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT COMMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG NAME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLLECTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DIVISION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GROUP</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRANSPORT METHOD</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVER TO</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EX-FACTORY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMMENTS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLOSED DATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LINE PURCHASE PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LINE SELLING PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOTE COUNT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LATEST NOTE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER QUANTITY INCREMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER LEAD TIME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER REF.</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STANDARD MINUTE VALUE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEMPLATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REQUEST DATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MINIMUM ORDER QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUB TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT BUYER STYLE NAME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT BUYER STYLE NUMBER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE PURCHASE PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE PURCHASE PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER PURCHASE PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER PURCHASE PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE SELLING PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE SELLING PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER SELLING PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER SELLING PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCTION DEVELOPMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHINA - QC</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MLA - PURCHASING</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 5</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 6</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 7</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 8</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEASON</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEPARTMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER PARENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RECIPIENT PRODUCT SUPPLIER-FACTORY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FG PO NUMBER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RECEIVED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BALANCE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OVER RECEIVED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT TECH PACK VERSION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAIN MATERIAL</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAIN MATERIAL DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVERY CONTACT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 1</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 2</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 3</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 4</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED BY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST EDITED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST EDITED BY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLOR</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">M88 AWB</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MLO AWB</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SHIPMENT ID</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUICKBOOKS INVOICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER INVOICE #</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIERS INV. PAYMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISCOUNT PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELL INC COMM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER SURCHARGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER SURCHARGE PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MOQ</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISCOUNT COST</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPECIAL SUR</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FACTORY SURCHARGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FACTORY SURCHARGE PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>CUSTOMER PROTO APPROVAL</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>TOP SAMPLE EX-M88</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>TOP SAMPLE EX-FACTORY</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>TOP SAMPLE REQUEST</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>PPS SAMPLE EX-M88</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>PPS SAMPLE EX-FACTORY</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>PPS SAMPLE REQUEST</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>TEST REPORT RECEIVED</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>TEST SAMPLE EX-FACTORY</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>TESTING SAMPLE REQUEST</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>PROTO SAMPLE REQUEST</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>PROTO SAMPLE EX-FACTORY</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>PROTO SAMPLE EX-M88</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>CUSTOMER PPS APPROVAL</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>CUSTOMER TOP APPROVAL</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>SAMPLE DELIVERY DATE</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                      </tr>
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST LINE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT COMMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG NAME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLLECTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DIVISION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GROUP</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRANSPORT METHOD</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVER TO</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EX-FACTORY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMMENTS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLOSED DATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LINE PURCHASE PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LINE SELLING PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOTE COUNT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LATEST NOTE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER QUANTITY INCREMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER LEAD TIME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER REF.</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STANDARD MINUTE VALUE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEMPLATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REQUEST DATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MINIMUM ORDER QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUB TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT BUYER STYLE NAME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT BUYER STYLE NUMBER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE PURCHASE PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE PURCHASE PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER PURCHASE PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER PURCHASE PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE SELLING PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE SELLING PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER SELLING PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER SELLING PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCTION DEVELOPMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHINA - QC</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MLA - PURCHASING</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 5</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 6</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 7</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 8</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEASON</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEPARTMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER PARENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RECIPIENT PRODUCT SUPPLIER-FACTORY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FG PO NUMBER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RECEIVED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BALANCE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OVER RECEIVED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT TECH PACK VERSION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAIN MATERIAL</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAIN MATERIAL DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVERY CONTACT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 1</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 2</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 3</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 4</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED BY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST EDITED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST EDITED BY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLOR</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">M88 AWB</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MLO AWB</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SHIPMENT ID</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUICKBOOKS INVOICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER INVOICE #</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIERS INV. PAYMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISCOUNT PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELL INC COMM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER SURCHARGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER SURCHARGE PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MOQ</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISCOUNT COST</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPECIAL SUR</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FACTORY SURCHARGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FACTORY SURCHARGE PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">SR-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Cotton T-Shirt</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SRL-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">5</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Good fit</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Initial</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">FL-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fashion Retail Co</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Spring 2024</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Casual</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Tops</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Air Freight</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">HQ Office</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Completed</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Sample approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">1000</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-20</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$8.50</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12.75</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">3</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fit approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">100</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">30 days</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SUP-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">15.5</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Standard</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-10</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">ABC Textiles</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">500</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Basic cotton t-shirt</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Apparel</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Tops</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Active</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">TS-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">BSN-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">COST-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 30</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">30 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 30</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">30 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 30</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">30 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 60</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">60 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 60</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">60 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$8.50</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12.75</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Sarah Johnson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Mike Wilson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Lisa Chen</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Emma Davis</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">David Brown</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Spring 2024</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Design</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fashion Retail Co</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">ABC Factory</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">PO-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">5</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">0</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">0</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">M</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">v1.0</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Cotton</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">100% Cotton</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team A</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team B</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team C</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team D</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-10</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Sarah Johnson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Navy Blue</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">AWB-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">MLO-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SHIP-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">QB-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">INV-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$8,500.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">5%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12,750.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$700.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">7.6%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">500</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$425.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">0%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-02-01</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-25</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">SR-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Denim Jeans</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SRL-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">3</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Needs adjustment</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Pending</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Revision</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">FL-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Blue Jeans Inc</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fall 2024</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Denim</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Bottoms</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Sea Freight</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Warehouse</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">In Progress</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-02-01</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fit issues found</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">800</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">-</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$15.25</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$22.88</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fit revision needed</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">50</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">45 days</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SUP-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">22.0</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Premium</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-18</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Pending</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">EUR</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">XYZ Denim</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">EUR</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">400</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Premium denim jeans</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Apparel</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Bottoms</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">In Development</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">DJ-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">BSN-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">COST-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">EUR</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Pending</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 45</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">45 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 45</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">45 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 45</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">45 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 90</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">90 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 90</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">90 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$15.25</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$22.88</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Mike Wilson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Lisa Chen</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Emma Davis</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">David Brown</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Sarah Johnson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fall 2024</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Production</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Blue Jeans Inc</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">XYZ Factory</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">PO-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">3</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">0</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">0</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">32</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">v1.1</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Denim</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">100% Cotton Denim</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Mike Wilson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team A</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team B</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team C</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team D</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Mike Wilson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-18</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-25</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Lisa Chen</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Indigo</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">AWB-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">MLO-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SHIP-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">QB-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">INV-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12,200.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">8%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$18,304.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$1,300.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">10.7%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">400</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$976.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">0%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-03-01</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
=======
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Fabric</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$8.50</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">$8.50</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">25%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Thread</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$0.75</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">$0.75</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">20%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Buttons</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$1.25</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">$1.25</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">30%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Assembly</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$3.50</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">$3.50</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">15%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-blue-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">TOTAL</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">$10.50</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">$3.50</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">$14.00</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">22%</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {leftActiveTab === 'Sample Lines' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE TYPE</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLOR</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DUE DATE</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Proto Sample</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">M</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Navy Blue</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-01-10</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Fit Sample</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">S, M, L</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Black</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          In Progress
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-01-25</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Salesman Sample</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">M</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">White, Red</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-02-05</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Pre-Production</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">XS, S, M, L, XL</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">All Colors</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Not Started
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-02-15</td>
                    </tr>
                  </tbody>
                </table>
>>>>>>> 1477f560acee0605b1abcbc5da3ec2b0bbcfa6b3
              )}

              {leftActiveTab === 'Lines' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LINE ITEM</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DESCRIPTION</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUANTITY</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNIT PRICE</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">001</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Cotton T-Shirt - Navy Blue</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">500</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$14.00</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">$7,000.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">002</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Cotton T-Shirt - Black</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">300</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$14.00</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">$4,200.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">003</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Cotton T-Shirt - White</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">200</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$14.00</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">$2,800.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">004</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Cotton T-Shirt - Red</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">150</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$14.00</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">$2,100.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-blue-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900" colSpan={4}>TOTAL</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">$16,100.00</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {leftActiveTab === 'Bill Of Materials' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MATERIAL</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPECIFICATION</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONSUMPTION</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WASTAGE %</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Main Fabric</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">100% Cotton, 180 GSM</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1.2 m</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">5%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Textile Corp</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Thread</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Polyester, 40/2</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">150 m</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Thread Co</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Buttons</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Plastic, 15mm</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">3 pcs</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Button World</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Label</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Woven, 100% Cotton</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1 pc</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">0.5%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Label Pro</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Hang Tag</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Cardboard, 80 GSM</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1 pc</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Tag Solutions</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></div>
        
        {/* Right Column - Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b" style={{ borderColor: '#3D75A3' }}>
            <div className="flex">
              {['Products', 'Product Colors', 'Product Color Sizes', 'Images', 'Option Images', 'Details'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightActiveTab(tab)}
                  className={`px-4 py-3 font-medium text-xs ${
                    rightActiveTab === tab
                      ? 'bg-gray-100 text-gray-900 border-t-2 border-l-2 shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                  style={rightActiveTab === tab ? { borderColor: '#3D75A3' } : {}}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-4">
            <div className="overflow-x-auto">
              {rightActiveTab === 'Products' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT ID</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORY</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">P001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Cotton T-Shirt</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Apparel</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">P002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Denim Jeans</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Apparel</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">P003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Leather Bag</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Accessories</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {rightActiveTab === 'Product Colors' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLOR CODE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLOR NAME</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HEX CODE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AVAILABLE</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">BLK</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Black</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#000000</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">NAV</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Navy Blue</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#000080</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">WHT</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">White</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#FFFFFF</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          No
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {rightActiveTab === 'Product Color Sizes' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHEST (CM)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LENGTH (CM)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STOCK</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">XS</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">86</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">58</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">25</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">S</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">91</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">60</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">45</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">M</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">96</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">62</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">67</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">L</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">101</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">64</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">52</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">XL</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">106</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">66</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">38</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {rightActiveTab === 'Images' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMAGE TYPE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FILENAME</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPLOADED</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Main</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">tshirt_main.jpg</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2.4 MB</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-01-15</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Detail</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">tshirt_detail.png</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1.8 MB</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-01-16</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Back</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">tshirt_back.jpg</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2.1 MB</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-01-17</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {rightActiveTab === 'Option Images' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OPTION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLOR</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMAGE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Option 1</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Black</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">black_tshirt.jpg</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Uploaded
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Option 2</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Navy</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">navy_tshirt.jpg</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Uploaded
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Option 3</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">White</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">-</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {rightActiveTab === 'Details' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROPERTY</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VALUE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNIT</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOTES</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Weight</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">180</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">GSM</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Fabric weight</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Material</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">100% Cotton</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">-</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Main fabric</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Care</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Machine wash</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">-</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">30°C</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Origin</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Bangladesh</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">-</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Manufacturing</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ReportBar Component */}
      <ReportBar
        showSlideUpContainer={showSlideUpContainer}
        setShowSlideUpContainer={setShowSlideUpContainer}
        activeContent={activeContent}
        setActiveContent={setActiveContent}
        sidebarCollapsed={sidebarCollapsed}
        pageData={{
          'Created': '2024-01-15',
          'Last Edited': '2024-01-20',
          'PO Issue Date': '2024-01-25',
          'Order References': selectedRowIndex !== null ? `Product-${selectedRowIndex + 1}` : 'Product-001',
          'Status': selectedRowIndex !== null ? (selectedRowIndex % 2 === 0 ? 'Active' : 'Pending') : 'Active',
          'Production': 'In Progress',
          'Purchase Order Status': 'Issued',
          'Template': 'Standard Product Template',
          'Default PO Line Template': 'Product Line Template',
          'Customer': 'ABC Corp',
          'Supplier': 'XYZ Textiles',
          'Purchase Currency': 'USD',
          'Selling Currency': 'EUR',
          'Total Qty': '1000',
          'Total Cost': '$10,000',
          'Total Value': '$12,000'
        }}
      />
<<<<<<< HEAD
          </div>
        </div>
      </div>
=======
>>>>>>> 1477f560acee0605b1abcbc5da3ec2b0bbcfa6b3
    </div>
  );
};

export default ProductManager;