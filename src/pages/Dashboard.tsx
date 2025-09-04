import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { 
  Package, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  DollarSign,
  Users,
  Truck,
  Calendar,
  ArrowRight,
  Activity,
  FileText,
  ShoppingCart,
  Layers,
  Bell,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { supabase } from '../lib/supabase';

interface DashboardMetrics {
  totalPurchaseOrders: number;
  pendingApprovals: number;
  lowStockAlerts: number;
  overdueTasks: number;
  monthlySpend: number;
  activeSuppliers: number;
  completedTasks: number;
  pendingSamples: number;
}

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const { tasks, products, purchaseOrders, sampleRequests } = useData();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPurchaseOrders: 0,
    pendingApprovals: 0,
    lowStockAlerts: 0,
    overdueTasks: 0,
    monthlySpend: 0,
    activeSuppliers: 0,
    completedTasks: 0,
    pendingSamples: 0
  });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Load dashboard metrics
  useEffect(() => {
    loadDashboardMetrics();
  }, []);

  const loadDashboardMetrics = async () => {
    try {
      setLoading(true);
      
      // Load metrics from database
      const [
        { data: purchaseOrdersData },
        { data: suppliersData },
        { data: tasksData },
        { data: productsData }
      ] = await Promise.all([
        supabase.from('purchase_orders').select('*'),
        supabase.from('suppliers').select('*').eq('is_active', true),
        supabase.from('tasks').select('*'),
        supabase.from('products').select('*')
      ]);

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const overdueTasks = tasksData?.filter(task => 
        new Date(task.due_date) < now && task.status !== 'completed'
      ).length || 0;

      const lowStockProducts = productsData?.filter(product => 
        product.current_stock <= product.min_stock_level
      ).length || 0;

      const monthlySpend = purchaseOrdersData?.filter(po => 
        new Date(po.created_at) >= thisMonth && po.status === 'completed'
      ).reduce((sum, po) => sum + (po.total_amount || 0), 0) || 0;

      setMetrics({
        totalPurchaseOrders: purchaseOrdersData?.length || 0,
        pendingApprovals: purchaseOrdersData?.filter(po => po.status === 'pending').length || 0,
        lowStockAlerts: lowStockProducts,
        overdueTasks,
        monthlySpend,
        activeSuppliers: suppliersData?.length || 0,
        completedTasks: tasksData?.filter(task => task.status === 'completed').length || 0,
        pendingSamples: sampleRequests.filter(sr => sr.status === 'Pending Review').length
      });

      // Generate notifications
      const newNotifications = [];
      if (overdueTasks > 0) {
        newNotifications.push({
          id: 1,
          type: 'warning',
          message: `${overdueTasks} tasks are overdue`,
          icon: AlertCircle
        });
      }
      if (lowStockProducts > 0) {
        newNotifications.push({
          id: 2,
          type: 'error',
          message: `${lowStockProducts} products are low in stock`,
          icon: Package
        });
      }
      if (metrics.pendingApprovals > 0) {
        newNotifications.push({
          id: 3,
          type: 'info',
          message: `${metrics.pendingApprovals} purchase orders need approval`,
          icon: ShoppingCart
        });
      }
      setNotifications(newNotifications);

    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks for current user
  const userTasks = tasks.filter(task => task.assignedTo === user?.name);
  const recentTasks = userTasks.slice(0, 4);

  const stats = [
    { 
      title: 'Total Purchase Orders', 
      value: metrics.totalPurchaseOrders.toString(), 
      change: '+12%', 
      icon: ShoppingCart, 
      color: 'bg-blue-500',
      trend: 'up'
    },
    { 
      title: 'Pending Approvals', 
      value: metrics.pendingApprovals.toString(), 
      change: metrics.pendingApprovals > 0 ? 'Needs Attention' : 'All Clear', 
      icon: AlertCircle, 
      color: metrics.pendingApprovals > 0 ? 'bg-red-500' : 'bg-green-500',
      trend: metrics.pendingApprovals > 0 ? 'warning' : 'good'
    },
    { 
      title: 'Low Stock Alerts', 
      value: metrics.lowStockAlerts.toString(), 
      change: metrics.lowStockAlerts > 0 ? 'Action Required' : 'Stock OK', 
      icon: Package, 
      color: metrics.lowStockAlerts > 0 ? 'bg-orange-500' : 'bg-green-500',
      trend: metrics.lowStockAlerts > 0 ? 'warning' : 'good'
    },
    { 
      title: 'Monthly Spend', 
      value: `$${(metrics.monthlySpend / 1000).toFixed(1)}K`, 
      change: '+18%', 
      icon: DollarSign, 
      color: 'bg-purple-500',
      trend: 'up'
    },
    { 
      title: 'Active Suppliers', 
      value: metrics.activeSuppliers.toString(), 
      change: '+5%', 
      icon: Truck, 
      color: 'bg-indigo-500',
      trend: 'up'
    },
    { 
      title: 'Completed Tasks', 
      value: metrics.completedTasks.toString(), 
      change: '+25%', 
      icon: CheckCircle, 
      color: 'bg-green-500',
      trend: 'up'
    },
    { 
      title: 'Overdue Tasks', 
      value: metrics.overdueTasks.toString(), 
      change: metrics.overdueTasks > 0 ? 'Needs Attention' : 'On Track', 
      icon: Clock, 
      color: metrics.overdueTasks > 0 ? 'bg-red-500' : 'bg-green-500',
      trend: metrics.overdueTasks > 0 ? 'warning' : 'good'
    },
    { 
      title: 'Pending Samples', 
      value: metrics.pendingSamples.toString(), 
      change: '-8%', 
      icon: FileText, 
      color: 'bg-yellow-500',
      trend: 'down'
    }
  ];


  const recentItems = [
    { id: 1, name: 'Summer Dress Collection', type: 'Techpack', updated: '2 hours ago', path: '/techpacks' },
    { id: 2, name: 'PO-2024-001 - Cotton Shirts', type: 'Purchase Order', updated: '4 hours ago', path: '/purchase-orders' },
    { id: 3, name: 'Sample Request - Denim Jacket', type: 'Sample', updated: '1 day ago', path: '/sample-requests' },
    { id: 4, name: 'Q1 2024 Material Report', type: 'Report', updated: '2 days ago', path: '/pivot-reports' },
  ];

  const quickActions = [
    { title: 'Create New Style', icon: Package, path: '/product-manager', color: 'bg-blue-500' },
    { title: 'Submit Sample Request', icon: Clock, path: '/sample-requests', color: 'bg-green-500' },
    { title: 'Generate Purchase Order', icon: DollarSign, path: '/purchase-orders', color: 'bg-purple-500' },
    { title: 'Check Supplier Status', icon: Truck, path: '/supplier-loading', color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening in your supply chain today.
            </p>
          </div>
          <button
            onClick={loadDashboardMetrics}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-6 space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-l-4 ${
                notification.type === 'error' ? 'bg-red-50 border-red-400' :
                notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <notification.icon className={`h-5 w-5 ${
                  notification.type === 'error' ? 'text-red-600' :
                  notification.type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <span className={`font-medium ${
                  notification.type === 'error' ? 'text-red-800' :
                  notification.type === 'warning' ? 'text-yellow-800' :
                  'text-blue-800'
                }`}>
                  {notification.message}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' :
                stat.trend === 'warning' ? 'text-orange-600' :
                'text-green-600'
              }`}>
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
              <Link 
                to="/my-tasks"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' : 
                      task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === 'High' ? 'bg-red-100 text-red-700' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {recentTasks.length === 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
                <Link 
                  to="/my-tasks"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>View all</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
                <p className="text-gray-600">You're all caught up! Check back later for new tasks.</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className={`p-3 rounded-lg ${action.color} group-hover:scale-105 transition-transform`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 mt-2 text-center">
                    {action.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recently Accessed */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recently Accessed</h2>
            <div className="space-y-3">
              {recentItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.type} • {item.updated}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;