import React, { useState, useMemo, useCallback } from 'react';
import { Users, Grid, Menu, ChevronRight, ChevronLeft, ChevronDown, X } from 'lucide-react';
import { TreeItem, ProductFilterSidebarProps, AVAILABLE_SEASONS, PRODUCT_SEASON_OPTIONS } from '../types/productManager';

const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({ 
  collapsed, 
  setCollapsed 
}) => {
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(['FH:2024', 'FH:2018']);
  const [selectedProductSeason, setSelectedProductSeason] = useState('Library');
  const [expandedItems, setExpandedItems] = useState<string[]>(['Library']);
  const [selectedCategory, setSelectedCategory] = useState('Youth');
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [isProductSeasonDropdownOpen, setIsProductSeasonDropdownOpen] = useState(false);



  // Memoized season tree data generation
  const seasonTreeData = useMemo(() => {
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
  }, [selectedSeasons]);

  // Memoized event handlers
  const toggleSeason = useCallback((season: string) => {
    setSelectedSeasons(prev => 
      prev.includes(season) 
        ? prev.filter(s => s !== season)
        : [...prev, season]
    );
  }, []);

  const removeSeason = useCallback((season: string) => {
    setSelectedSeasons(prev => prev.filter(s => s !== season));
  }, []);

  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleSeasonRemoveFromTree = useCallback((season: string) => {
    setSelectedSeasons(prev => prev.filter(s => s !== season));
  }, []);

  const renderTreeItem = useCallback((item: TreeItem) => {
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
        
                 {hasChildren && isExpanded && item.children && (
           <div className="ml-6 flex flex-col gap-0.5">
             {item.children.map((child: TreeItem) => (
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
  }, [expandedItems, selectedCategory, toggleExpanded, handleCategorySelect]);

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden h-screen ${
      collapsed ? 'w-12' : 'w-72'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between bg-gray-50 border-b border-gray-200 min-h-14 ${
        collapsed ? 'p-2' : 'p-4'
      }`}>
        <h3 className={`font-semibold text-gray-900 transition-opacity duration-300 ${
          collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
        }`}>
          Product Filters
        </h3>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center justify-center bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-300 ${
            collapsed ? 'w-6 h-6' : 'w-8 h-8'
          }`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={20} />}
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
              {AVAILABLE_SEASONS
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
              {PRODUCT_SEASON_OPTIONS.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedProductSeason(option);
                    setIsProductSeasonDropdownOpen(false);
                  }}
                  className="block w-full px-3 py-2 bg-transparent border-none cursor-pointer text-sm text-gray-700 text-left hover:bg-gray-100 transition-colors duration-200"
                >
                  {option}
                </button>
              ))}
            </div>
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

export default ProductFilterSidebar; 