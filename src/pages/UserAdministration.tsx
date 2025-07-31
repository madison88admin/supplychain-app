import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, MoreVertical, UserPlus, Shield, Mail, Phone, Users, Eye, EyeOff, Copy, User } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'Production' | 'Admin' | 'QA' | 'Product Developer' | 'Buyer' | 'Logistics Manager' | 'Accountant' | 'Costing Analyst';
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  avatar?: string;
  phone?: string;
  lastLogin?: string;
}

const UserAdministration: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Sample Product Developer',
      email: 'developer@madison88.com',
      password: 'demo123',
      role: 'Product Developer',
      department: 'Product Development',
      status: 'Active',
      avatar: '',
      phone: '+1 (555) 123-4567',
      lastLogin: '2024-01-15 09:30 AM'
    },
    {
      id: '2',
      name: 'Sample Buyer',
      email: 'buyer@madison88.com',
      password: 'demo123',
      role: 'Buyer',
      department: 'Procurement',
      status: 'Active',
      avatar: '',
      phone: '+1 (555) 234-5678',
      lastLogin: '2024-01-15 08:45 AM'
    },
    {
      id: 'admin-1',
      name: 'Sample Admin User',
      email: 'admin@madison88.com',
      password: 'admin123',
      role: 'Admin',
      department: 'IT',
      status: 'Active',
      avatar: '',
      phone: '+1 (555) 999-9999',
      lastLogin: '2024-01-15 10:15 AM'
    },
    {
      id: '3',
      name: 'Sample Production Manager',
      email: 'production@madison88.com',
      password: 'demo123',
      role: 'Production',
      department: 'Production',
      status: 'Active',
      avatar: '',
      phone: '+1 (555) 345-6789',
      lastLogin: '2024-01-15 11:30 AM'
    },
    {
      id: '4',
      name: 'Sample QA Specialist',
      email: 'qa@madison88.com',
      password: 'demo123',
      role: 'QA',
      department: 'Quality Assurance',
      status: 'Active',
      avatar: '',
      phone: '+1 (555) 456-7890',
      lastLogin: '2024-01-15 10:45 AM'
    },
    {
      id: '5',
      name: 'Sample Logistics Manager',
      email: 'logistics@madison88.com',
      password: 'demo123',
      role: 'Logistics Manager',
      department: 'Logistics',
      status: 'Active',
      avatar: '',
      phone: '+1 (555) 567-8901',
      lastLogin: '2024-01-14 04:20 PM'
    },
    {
      id: '6',
      name: 'Sample Accountant',
      email: 'accountant@madison88.com',
      password: 'demo123',
      role: 'Accountant',
      department: 'Finance',
      status: 'Inactive',
      avatar: '',
      phone: '+1 (555) 678-9012',
      lastLogin: '2024-01-10 02:30 PM'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Product Developer' as User['role'],
    department: 'Product Development',
    status: 'Active' as User['status'],
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPasswordRow, setShowPasswordRow] = useState<{ [userId: string]: boolean }>({});

  const roles = ['Production', 'Admin', 'QA', 'Product Developer', 'Buyer', 'Logistics Manager', 'Accountant', 'Costing Analyst'];
  const departments = ['Production', 'Quality Assurance', 'Product Development', 'Procurement', 'Logistics', 'Finance', 'IT', 'Costing'];
  const statuses = ['Active', 'Inactive', 'Pending'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'Production': return 'bg-blue-100 text-blue-800';
      case 'QA': return 'bg-green-100 text-green-800';
      case 'Product Developer': return 'bg-indigo-100 text-indigo-800';
      case 'Buyer': return 'bg-orange-100 text-orange-800';
      case 'Logistics Manager': return 'bg-yellow-100 text-yellow-800';
      case 'Accountant': return 'bg-red-100 text-red-800';
      case 'Costing Analyst': return 'bg-pink-100 text-pink-800';

      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      ...formData,
      avatar: '',
      lastLogin: 'Never'
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Product Developer',
      department: 'Product Development',
      status: 'Active',
      phone: ''
    });
  };

  const handleEditUser = () => {
    if (editingUser) {
      const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Product Developer',
        department: 'Product Development',
        status: 'Active',
        phone: ''
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      department: user.department,
      status: user.status,
      phone: user.phone || ''
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Administration</h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Administrators</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'Admin').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="All">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.phone && (
                          <div className="text-xs text-gray-400 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded select-all">
                        {showPasswordRow[user.id] ? user.password : '•'.repeat(user.password.length)}
                      </span>
                      <button
                        type="button"
                        className="p-1 text-gray-500 hover:text-indigo-600"
                        onClick={() => setShowPasswordRow((prev) => ({ ...prev, [user.id]: !prev[user.id] }))}
                        title={showPasswordRow[user.id] ? 'Hide Password' : 'Show Password'}
                      >
                        {showPasswordRow[user.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin || 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              if (editingUser) {
                handleEditUser();
              } else {
                handleAddUser();
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-20"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-indigo-600"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-indigo-600"
                    onClick={async () => {
                      await navigator.clipboard.writeText(formData.password);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1200);
                    }}
                    tabIndex={-1}
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                  {copied && (
                    <span className="absolute right-10 -bottom-6 text-xs text-green-600 bg-white px-2 py-1 rounded shadow border border-green-100">Copied!</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as User['role']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as User['status']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      role: 'Product Developer',
                      department: 'Product Development',
                      status: 'Active',
                      phone: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdministration; 