import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Lightbulb, Sparkles, ArrowRight, Clock, TrendingUp } from 'lucide-react';
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
  lastModified?: string;
  tags?: string[];
  icon?: string;
  quickAction?: string;
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [showFilters, setShowFilters] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

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

  // Mock search results with more detailed data
  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      title: 'Purchase Order PO-2024-001',
      description: 'Approved purchase order for cotton materials from Supplier ABC. Total value: $15,000. Delivery expected by March 15, 2024.',
      type: 'purchase-orders',
      path: '/purchase-orders',
      relevance: 95,
      lastModified: '2 hours ago',
      tags: ['approved', 'cotton', 'supplier-abc'],
      icon: '📄',
      quickAction: 'View Details'
    },
    {
      id: '2',
      title: 'Sample Request SR-2024-005',
      description: 'Fabric sample request for new product line "Summer Collection 2024". Requested samples for 5 different materials.',
      type: 'sample-requests',
      path: '/sample-requests',
      relevance: 88,
      lastModified: '1 day ago',
      tags: ['fabric', 'summer-collection', 'pending'],
      icon: '🧪',
      quickAction: 'Track Status'
    },
    {
      id: '3',
      title: 'Material Manager Dashboard',
      description: 'Comprehensive dashboard for managing materials, colors, specifications, and inventory levels across all product lines.',
      type: 'material-manager',
      path: '/material-manager',
      relevance: 82,
      lastModified: '3 days ago',
      tags: ['dashboard', 'materials', 'inventory'],
      icon: '🏷️',
      quickAction: 'Open Dashboard'
    },
    {
      id: '4',
      title: 'Supplier Loading Report',
      description: 'Monthly supplier performance metrics including delivery times, quality scores, and cost analysis for Q1 2024.',
      type: 'supplier-loading',
      path: '/supplier-loading',
      relevance: 75,
      lastModified: '1 week ago',
      tags: ['report', 'performance', 'q1-2024'],
      icon: '📊',
      quickAction: 'View Report'
    },
    {
      id: '5',
      title: 'Techpack Documentation',
      description: 'Complete technical specifications and documentation for Product Line XYZ including measurements, materials, and production notes.',
      type: 'techpacks',
      path: '/techpacks',
      relevance: 70,
      lastModified: '2 weeks ago',
      tags: ['techpack', 'specifications', 'production'],
      icon: '📋',
      quickAction: 'Open Techpack'
    },
    {
      id: '6',
      title: 'User Administration Panel',
      description: 'Manage user accounts, roles, and permissions across the supply chain system.',
      type: 'user-administration',
      path: '/user-administration',
      relevance: 65,
      lastModified: '1 week ago',
      tags: ['admin', 'users', 'permissions'],
      icon: '👥',
      quickAction: 'Manage Users'
    },
    {
      id: '7',
      title: 'Data Bank Repository',
      description: 'Central repository for all supply chain data including materials, suppliers, and product information.',
      type: 'data-bank',
      path: '/data-bank',
      relevance: 60,
      lastModified: '2 weeks ago',
      tags: ['data', 'repository', 'central'],
      icon: '🗄️',
      quickAction: 'Browse Data'
    },
    {
      id: '8',
      title: 'Pivot Reports Dashboard',
      description: 'Interactive reports and analytics dashboard for supply chain performance metrics.',
      type: 'pivot-reports',
      path: '/pivot-reports',
      relevance: 55,
      lastModified: '3 weeks ago',
      tags: ['analytics', 'reports', 'performance'],
      icon: '📈',
      quickAction: 'View Analytics'
    }
  ];

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Add to recent searches
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
      }
      
      // Simulate search delay
      setTimeout(() => {
        const filtered = mockSearchResults.filter(result => {
          const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              result.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
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
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-4xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for anything in your supply chain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-16 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  autoFocus
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    aria-label="Toggle filters"
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                      aria-label="Clear search"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <Link
              to="/"
              className="ml-6 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Panel */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </h3>
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {Object.entries(groupedFilters).map(([category, filters]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-3 flex items-center">
                        {getFilterIcon(category)} {category}
                      </h4>
                      <div className="space-y-2">
                        {filters.map((filter) => (
                          <label key={filter.id} className="flex items-center space-x-3 cursor-pointer group">
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
              <div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-lg text-gray-500">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                      </h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <TrendingUp className="h-4 w-4" />
                        <span>Sorted by relevance</span>
                      </div>
                    </div>
                                         <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                       {searchResults.map((result) => (
                         <Link
                           key={result.id}
                           to={result.path}
                           className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200"
                         >
                           <div className="flex items-start space-x-4">
                             <div className="flex-shrink-0 mt-1">
                               <span className="text-2xl">{result.icon}</span>
                             </div>
                             <div className="flex-1 min-w-0">
                               <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center space-x-3">
                                   <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                     {result.type.replace('-', ' ')}
                                   </span>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                   <span className="text-sm text-gray-500">{result.relevance}% match</span>
                                   <ArrowRight className="h-4 w-4 text-gray-400" />
                                 </div>
                               </div>
                               <p className="text-gray-600 mb-3 line-clamp-2">{result.description}</p>
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center space-x-4">
                                   {result.tags && (
                                     <div className="flex items-center space-x-2">
                                       {result.tags.slice(0, 3).map((tag) => (
                                         <span
                                           key={tag}
                                           className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                                         >
                                           {tag}
                                         </span>
                                       ))}
                                     </div>
                                   )}
                                   <div className="flex items-center text-sm text-gray-500">
                                     <Clock className="h-4 w-4 mr-1" />
                                     {result.lastModified}
                                   </div>
                                 </div>
                                 {result.quickAction && (
                                   <span className="text-sm text-blue-600 font-medium">
                                     {result.quickAction}
                                   </span>
                                 )}
                               </div>
                             </div>
                           </div>
                         </Link>
                       ))}
                     </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search terms or filters</p>
                    <button
                      onClick={clearSearch}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Search Tips */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    <Lightbulb className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Tips</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="font-medium mb-1">Use filters to narrow results</p>
                          <p>Select specific categories to focus your search on particular areas of your supply chain.</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Search by keywords</p>
                          <p>Try searching for product names, order numbers, supplier names, or material types.</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Use tags for better results</p>
                          <p>Many items have tags that can help you find related content quickly.</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Check recent activity</p>
                          <p>Results show when items were last modified to help you find the most current information.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h3>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(search)}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                        >
                          <span className="text-gray-700">{search}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 