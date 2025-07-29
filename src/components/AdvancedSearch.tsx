import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  icon?: string;
  quickAction?: string;
}

// Memoized search result item component
const SearchResultItem = React.memo<{
  result: SearchResult;
  index: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onNavigate: (path: string) => void;
}>(({ result, index, selectedIndex, onSelect, onNavigate }) => {
  const handleClick = useCallback(() => {
    onNavigate(result.path);
  }, [result.path, onNavigate]);

  const handleMouseEnter = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        index === selectedIndex 
          ? 'bg-blue-50 border-2 border-blue-200' 
          : 'hover:bg-gray-50 border-2 border-transparent'
      }`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <span className="text-lg">{result.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {result.title}
            </h4>
            <span className="text-xs text-gray-500 ml-2">
              {result.relevance}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {result.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {result.type.replace('-', ' ')}
              </span>
              {result.quickAction && (
                <span className="text-xs text-gray-500">
                  {result.quickAction}
                </span>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
});

SearchResultItem.displayName = 'SearchResultItem';

const AdvancedSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Memoized search filters
  const searchFilters: SearchFilter[] = useMemo(() => [
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
  ], []);

  // Memoized search results
  const mockSearchResults: SearchResult[] = useMemo(() => [
    {
      id: '1',
      title: 'Purchase Order PO-2024-001',
      description: 'Approved purchase order for cotton materials',
      type: 'purchase-orders',
      path: '/purchase-orders',
      relevance: 95,
      icon: '📄',
      quickAction: 'View Details'
    },
    {
      id: '2',
      title: 'Sample Request SR-2024-005',
      description: 'Fabric sample request for new product line',
      type: 'sample-requests',
      path: '/sample-requests',
      relevance: 88,
      icon: '🧪',
      quickAction: 'Track Status'
    },
    {
      id: '3',
      title: 'Material Manager Dashboard',
      description: 'Manage materials, colors, and specifications',
      type: 'material-manager',
      path: '/material-manager',
      relevance: 82,
      icon: '🏷️',
      quickAction: 'Open Dashboard'
    },
    {
      id: '4',
      title: 'Supplier Loading Report',
      description: 'Monthly supplier performance metrics',
      type: 'supplier-loading',
      path: '/supplier-loading',
      relevance: 75,
      icon: '📊',
      quickAction: 'View Report'
    },
    {
      id: '5',
      title: 'Techpack Documentation',
      description: 'Complete technical specifications for Product Line XYZ',
      type: 'techpacks',
      path: '/techpacks',
      relevance: 70,
      icon: '📋',
      quickAction: 'Open Techpack'
    },
    {
      id: '6',
      title: 'User Administration Panel',
      description: 'Manage user accounts, roles, and permissions',
      type: 'user-administration',
      path: '/user-administration',
      relevance: 65,
      icon: '👥',
      quickAction: 'Manage Users'
    },
    {
      id: '7',
      title: 'Data Bank Repository',
      description: 'Central repository for all supply chain data',
      type: 'data-bank',
      path: '/data-bank',
      relevance: 60,
      icon: '🗄️',
      quickAction: 'Browse Data'
    },
    {
      id: '8',
      title: 'Pivot Reports Dashboard',
      description: 'Interactive reports and analytics dashboard',
      type: 'pivot-reports',
      path: '/pivot-reports',
      relevance: 55,
      icon: '📈',
      quickAction: 'View Analytics'
    }
  ], []);

  // Memoized grouped filters
  const groupedFilters = useMemo(() => {
    return searchFilters.reduce((acc, filter) => {
      if (!acc[filter.category]) {
        acc[filter.category] = [];
      }
      acc[filter.category].push(filter);
      return acc;
    }, {} as Record<string, SearchFilter[]>);
  }, [searchFilters]);

  // Memoized filter icon function
  const getFilterIcon = useCallback((category: string) => {
    switch (category) {
      case 'overview': return '📊';
      case 'tasks': return '📋';
      case 'purchasing': return '🛒';
      case 'products': return '🏷️';
      case 'suppliers': return '🏢';
      case 'admin': return '⚙️';
      default: return '📁';
    }
  }, []);

  // Memoized filtered results
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return mockSearchResults.filter(result => {
      const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          result.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilters.includes('all') || activeFilters.includes(result.type);
      return matchesQuery && matchesFilter;
    });
  }, [searchQuery, activeFilters, mockSearchResults]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredResults.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredResults.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && filteredResults[selectedIndex]) {
            window.location.href = filteredResults[selectedIndex].path;
            setIsOpen(false);
            setSelectedIndex(-1);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, filteredResults, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedIndex]);

  // Handle search with debouncing
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        setSearchResults(filteredResults);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [filteredResults, searchQuery]);

  const handleFilterToggle = useCallback((filterId: string) => {
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
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setActiveFilters(['all']);
  }, []);

  const handleNavigate = useCallback((path: string) => {
    window.location.href = path;
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return (
    <div className="relative" ref={searchRef}>
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
          {isOpen && searchResults.length > 0 && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-white px-2 py-1 rounded border">
              ↑↓ to navigate • Enter to select • Esc to close
            </div>
          )}
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
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
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
                    <div className="max-h-80 overflow-y-auto" ref={resultsRef}>
                      <div className="space-y-1">
                        {searchResults.map((result, index) => (
                          <SearchResultItem
                            key={result.id}
                            result={result}
                            index={index}
                            selectedIndex={selectedIndex}
                            onSelect={handleSelect}
                            onNavigate={handleNavigate}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">No results found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                  )}
                  
                  {/* View All Results Button */}
                  {searchResults.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                      <Link
                        to="/search"
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2 transition-colors duration-200 flex items-center justify-center font-medium"
                      >
                        View all results ({searchResults.length})
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
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
        </div>
      )}
    </div>
  );
};

export default React.memo(AdvancedSearch); 