import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Clock, 
  User, 
  Edit, 
  Plus, 
  Trash2, 
  Eye, 
  Download, 
  Filter,
  Search,
  Calendar,
  ArrowUpDown,
  ExternalLink,
  ChevronDown,
  X,
  RefreshCw
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface ActivityLog {
  id: string;
  timestamp: Date;
  user: {
    name: string;
    role: string;
    avatar: string;
  };
  action: 'created' | 'updated' | 'deleted' | 'viewed' | 'exported' | 'approved' | 'rejected';
  entity: string;
  entityId: string;
  details: string;
  page: string;
  pageUrl: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  ipAddress: string;
  userAgent: string;
}

const ActivityLogs: React.FC = () => {
  const { user } = useUser();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [sortBy, setSortBy] = useState<keyof ActivityLog>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Memoized action and entity options
  const actionOptions = useMemo(() => [
    { value: 'all', label: 'All Actions' },
    { value: 'created', label: 'Created', color: 'text-green-600' },
    { value: 'updated', label: 'Updated', color: 'text-blue-600' },
    { value: 'deleted', label: 'Deleted', color: 'text-red-600' },
    { value: 'viewed', label: 'Viewed', color: 'text-gray-600' },
    { value: 'exported', label: 'Exported', color: 'text-purple-600' },
    { value: 'approved', label: 'Approved', color: 'text-green-600' },
    { value: 'rejected', label: 'Rejected', color: 'text-red-600' }
  ], []);

  const entityOptions = useMemo(() => [
    { value: 'all', label: 'All Entities' },
    { value: 'Purchase Order', label: 'Purchase Order' },
    { value: 'Product', label: 'Product' },
    { value: 'Material', label: 'Material' },
    { value: 'Sample Request', label: 'Sample Request' },
    { value: 'Supplier', label: 'Supplier' }
  ], []);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        timestamp: new Date('2024-01-15T10:30:00Z'),
        user: {
          name: 'Sample Buyer',
          role: 'Buyer',
          avatar: ''
        },
        action: 'created',
        entity: 'Purchase Order',
        entityId: 'PO-2024-001',
        details: 'Created new purchase order for cotton fabric',
        page: 'Purchase Order',
        pageUrl: '/purchase-order',
        changes: [
          { field: 'Supplier', oldValue: '', newValue: 'ABC Textiles' },
          { field: 'Quantity', oldValue: '', newValue: '1000 yards' },
          { field: 'Total Amount', oldValue: '', newValue: '$15,000' }
        ],
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-15T09:15:00Z'),
        user: {
          name: 'Sample Product Developer',
          role: 'Product Developer',
          avatar: ''
        },
        action: 'updated',
        entity: 'Product',
        entityId: 'PROD-001',
        details: 'Updated product specifications for summer collection',
        page: 'Product Manager',
        pageUrl: '/product-manager',
        changes: [
          { field: 'Material', oldValue: 'Cotton', newValue: 'Organic Cotton' },
          { field: 'Price', oldValue: '$25.00', newValue: '$28.50' }
        ],
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-15T08:45:00Z'),
        user: {
          name: 'Sample QA Specialist',
          role: 'QA',
          avatar: ''
        },
        action: 'approved',
        entity: 'Sample Request',
        entityId: 'SR-2024-005',
        details: 'Approved sample request for new fabric supplier',
        page: 'Sample Requests',
        pageUrl: '/sample-requests',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: '4',
        timestamp: new Date('2024-01-14T16:20:00Z'),
        user: {
          name: 'Sample Admin User',
          role: 'Admin',
          avatar: ''
        },
        action: 'deleted',
        entity: 'Material',
        entityId: 'MAT-003',
        details: 'Deleted obsolete material from inventory',
        page: 'Material Manager',
        pageUrl: '/material-manager',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      {
        id: '5',
        timestamp: new Date('2024-01-14T14:30:00Z'),
        user: {
          name: 'Sample Accountant',
          role: 'Accountant',
          avatar: ''
        },
        action: 'exported',
        entity: 'Purchase Orders',
        entityId: 'BATCH-001',
        details: 'Exported monthly purchase order report',
        page: 'Purchase Orders',
        pageUrl: '/purchase-orders',
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    ];

    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
    setLoading(false);
  }, []);

  // Memoized filter and sort logic
  const processedLogs = useMemo(() => {
    let filtered = logs.filter(log => {
      const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.entityId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAction = selectedAction === 'all' || log.action === selectedAction;
      const matchesEntity = selectedEntity === 'all' || log.entity === selectedEntity;
      
      const matchesDateRange = (!dateRange.start || log.timestamp >= dateRange.start) &&
                              (!dateRange.end || log.timestamp <= dateRange.end);

      return matchesSearch && matchesAction && matchesEntity && matchesDateRange;
    });

    // Sort logs
    filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        const aTime = a.timestamp.getTime();
        const bTime = b.timestamp.getTime();
        return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
      }
      
      if (sortBy === 'user') {
        const aName = a.user.name;
        const bName = b.user.name;
        return sortOrder === 'asc' 
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      }
      
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

    return filtered;
  }, [logs, searchTerm, selectedAction, selectedEntity, dateRange, sortBy, sortOrder]);

  // Update filtered logs when processed logs change
  useEffect(() => {
    setFilteredLogs(processedLogs);
  }, [processedLogs]);

  const getActionIcon = useCallback((action: ActivityLog['action']) => {
    switch (action) {
      case 'created': return <Plus className="h-4 w-4 text-green-600" />;
      case 'updated': return <Edit className="h-4 w-4 text-blue-600" />;
      case 'deleted': return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'viewed': return <Eye className="h-4 w-4 text-gray-600" />;
      case 'exported': return <Download className="h-4 w-4 text-purple-600" />;
      case 'approved': return <Plus className="h-4 w-4 text-green-600" />;
      case 'rejected': return <Trash2 className="h-4 w-4 text-red-600" />;
      default: return <Edit className="h-4 w-4 text-gray-600" />;
    }
  }, []);

  const getActionColor = useCallback((action: ActivityLog['action']) => {
    switch (action) {
      case 'created': return 'bg-green-50 text-green-700 border-green-200';
      case 'updated': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'deleted': return 'bg-red-50 text-red-700 border-red-200';
      case 'viewed': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'exported': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  }, []);

  const formatTimestamp = useCallback((timestamp: Date) => {
    const date = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(timestamp);
    
    const time = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(timestamp);
    
    const timezone = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short'
    }).format(timestamp).split(' ').pop() || '';
    
    return { date, time, timezone };
  }, []);

  const handleSort = useCallback((field: keyof ActivityLog) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy, sortOrder]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedAction('all');
    setSelectedEntity('all');
    setDateRange({ start: null, end: null });
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Export logs');
    setIsExporting(false);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return searchTerm || selectedAction !== 'all' || selectedEntity !== 'all' || dateRange.start || dateRange.end;
  }, [searchTerm, selectedAction, selectedEntity, dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading activity logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Activity Logs</h1>
              <p className="text-sm text-gray-600">
                Comprehensive audit trail of all system activities and user actions
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filters</span>
                {hasActiveFilters && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
                    {[searchTerm, selectedAction !== 'all', selectedEntity !== 'all', dateRange.start, dateRange.end].filter(Boolean).length}
                  </span>
                )}
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {isExporting ? 'Exporting...' : 'Export'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Filter Options</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                  <span>Clear all</span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Action Filter */}
              <div className="relative">
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  {actionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Entity Filter */}
              <div className="relative">
                <select
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  {entityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Date Range */}
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value ? new Date(e.target.value) : null }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <input
                  type="date"
                  value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value ? new Date(e.target.value) : null }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredLogs.length}</span> of <span className="font-medium">{logs.length}</span> activity logs
            </p>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Filtered
              </span>
            )}
          </div>
        </div>

        {/* Activity Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('timestamp')}
                      className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                    >
                      <Clock className="h-4 w-4" />
                      <span>Timestamp</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('user')}
                      className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>User</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action & Entity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Changes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-start space-x-2">
                        {getActionIcon(log.action)}
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-gray-900">{formatTimestamp(log.timestamp).date}</span>
                          <span className="font-mono text-xs text-gray-600">{formatTimestamp(log.timestamp).time}</span>
                          <span className="font-mono text-xs text-gray-400">{formatTimestamp(log.timestamp).timezone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{log.user.name}</div>
                        <div className="text-xs text-gray-500">{log.user.role}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                        </span>
                        <div className="text-sm font-medium text-gray-900">{log.entity}</div>
                        <div className="text-xs text-gray-500 font-mono">{log.entityId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {log.changes && log.changes.length > 0 ? (
                        <div className="space-y-1">
                          {log.changes.slice(0, 2).map((change, index) => (
                            <div key={index} className="text-xs">
                              <span className="font-medium text-gray-700">{change.field}:</span>
                              <span className="text-red-600 line-through ml-1">{change.oldValue}</span>
                              <span className="text-green-600 ml-1">→ {change.newValue}</span>
                            </div>
                          ))}
                          {log.changes.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{log.changes.length - 2} more changes
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No field changes</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{log.details}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        IP: {log.ipAddress}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href={log.pageUrl}
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                      >
                        <span>{log.page}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activity logs found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters to see more results.</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Clear filters</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs; 