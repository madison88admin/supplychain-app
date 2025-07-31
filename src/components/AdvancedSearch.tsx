import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, Filter, X, ChevronDown, ChevronUp, Lightbulb, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchFilter {
  id: string;
  label: string;
  category: string;
  checked: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string;
  path: string;
  relevance: number;
}

const AdvancedSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Search filters organized by category
  const searchFilters: SearchFilter[] = [
    // Overview
    { id: 'all', label: 'All', category: 'overview', checked: true },
    { id: 'dashboard', label: 'Dashboard', category: 'overview', checked: false },
    { id: 'pivot-reports', label: 'Pivot Reports', category: 'overview', checked: false },
    
    // Tasks & Workflow
    { id: 'my-tasks', label: 'My Tasks', category: 'tasks', checked: false },
    { id: 'sample-requests', label: 'Sample Requests', category: 'tasks', checked: false },
    { id: 'techpacks', label: 'Techpacks', category: 'tasks', checked: false },
    { id: 'documents', label: 'Documents', category: 'tasks', checked: false },
    
    // Purchasing
    { id: 'purchase-orders', label: 'Purchase Orders', category: 'purchasing', checked: false },
    { id: 'purchase-order-lines', label: 'Purchase Order Lines', category: 'purchasing', checked: false },
    { id: 'material-purchase-orders', label: 'Material Purchase Orders', category: 'purchasing', checked: false },
    { id: 'material-purchase-order-lines', label: 'Material Purchase Order Lines', category: 'purchasing', checked: false },
    
    // Product Management
    { id: 'product-manager', label: 'Product Manager', category: 'products', checked: false },
    { id: 'material-manager', label: 'Material Manager', category: 'products', checked: false },
    
    // Supplier Management
    { id: 'supplier-loading', label: 'Supplier Loading', category: 'suppliers', checked: false },
    
    // Data & Admin
    { id: 'data-bank', label: 'Data Bank', category: 'admin', checked: false },
    { id: 'user-administration', label: 'User Administration', category: 'admin', checked: false },
  ];

  // Mock search results
  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      title: 'Purchase Order PO-2024-001',
      description: 'Approved purchase order for cotton materials',
      type: 'purchase-orders',
      path: '/purchase-orders',
      relevance: 95
    },
    {
      id: '2',
      title: 'Sample Request SR-2024-005',
      description: 'Fabric sample request for new product line',
      type: 'sample-requests',
      path: '/sample-requests',
      relevance: 88
    },
    {
      id: '3',
      title: 'Material Manager Dashboard',
      description: 'Manage materials, colors, and specifications',
      type: 'material-manager',
      path: '/material-manager',
      relevance: 82
    },
    {
      id: '4',
      title: 'Supplier Loading Report',
      description: 'Monthly supplier performance metrics',
      type: 'supplier-loading',
      path: '/supplier-loading',
      relevance: 75
    }
  ];

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Simulate search delay
      setTimeout(() => {
        const filtered = mockSearchResults.filter(result => {
          const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              result.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesFilter = activeFilters.includes('all') || activeFilters.includes(result.type);
          return matchesQuery && matchesFilter;
        });
        setSearchResults(filtered);
        setIsLoading(false);
      }, 300);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, activeFilters]);

  const handleFilterToggle = (filterId: string) => {
    if (filterId === 'all') {
      setActiveFilters(['all']);
    } else {
      setActiveFilters(prev => {
        const newFilters = prev.filter(f => f !== 'all');
        if (newFilters.includes(filterId)) {
          return newFilters.filter(f => f !== filterId);
        } else {
          return [...newFilters, filterId];
        }
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setActiveFilters(['all']);
  };

  const getFilterIcon = (category: string) => {
    switch (category) {
      case 'overview': return '📊';
      case 'tasks': return '📋';
      case 'purchasing': return '🛒';
      case 'products': return '🏷️';
      case 'suppliers': return '🏢';
      case 'admin': return '⚙️';
      default: return '📁';
    }
  };

  const groupedFilters = searchFilters.reduce((acc, filter) => {
    if (!acc[filter.category]) {
      acc[filter.category] = [];
    }
    acc[filter.category].push(filter);
    return acc;
  }, {} as Record<string, SearchFilter[]>);

  return (
    <div className="relative z-[999999]" ref={searchRef} style={{ position: 'relative' }}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
              type="text"
              placeholder="Search for anything... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1 rounded transition-colors duration-200 ${
                showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
            </button>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

            {/* Search Results Dropdown */}
      {isOpen && createPortal(
        <div 
          className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999999] transition-all duration-200 ease-in-out transform max-h-96 overflow-hidden"
          style={{
            top: searchRef.current ? searchRef.current.getBoundingClientRect().bottom + 8 : 80,
            left: searchRef.current ? searchRef.current.getBoundingClientRect().left : '50%',
            width: searchRef.current ? searchRef.current.getBoundingClientRect().width : 'auto',
            transform: searchRef.current ? 'none' : 'translateX(-50%)'
          }}
        >
          <div className="flex">
            {/* Filters Panel */}
            {showFilters && (
              <div className="w-64 border-r border-gray-200 bg-gray-50">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {Object.entries(groupedFilters).map(([category, filters]) => (
                      <div key={category}>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                          {getFilterIcon(category)} {category}
                        </h4>
                        <div className="space-y-1">
                          {filters.map((filter) => (
                            <label key={filter.id} className="flex items-center space-x-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={activeFilters.includes(filter.id)}
                                onChange={() => handleFilterToggle(filter.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                {filter.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results Panel */}
            <div className="flex-1">
              {searchQuery ? (
                <div className="p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-500">Searching...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((result) => (
                        <div
                          key={result.id}
                          className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{result.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {result.type.replace('-', ' ')}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {result.relevance}% match
                                </span>
                              </div>
                            </div>
                            <Sparkles className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">No results found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Search Tips</h4>
                      <p className="text-sm text-blue-700">
                        Use the filters on the left to narrow your search by category. You can search for products, 
                        purchase orders, materials, and more.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdvancedSearch; 