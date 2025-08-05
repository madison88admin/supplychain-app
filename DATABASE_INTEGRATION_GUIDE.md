# 🚀 Database Integration Guide for Supply Chain Management System

## 📋 Overview

This guide shows you how to apply the same database integration pattern we used for **User Administration** and **Material Manager** to all other pages in your supply chain application.

## ✅ What's Already Working

### 1. **User Administration** ✅
- ✅ Real-time database CRUD operations
- ✅ Edit user names, emails, roles, departments
- ✅ Add new users
- ✅ Delete users
- ✅ Search and filter functionality

### 2. **Material Manager** ✅
- ✅ Real-time database CRUD operations for products and suppliers
- ✅ Edit material names, codes, categories, costs
- ✅ Add new materials and suppliers
- ✅ Delete items
- ✅ Search functionality

## 🔧 How to Apply to Other Pages

### Step 1: Import the Data Management Functions

Add this import to your page:

```typescript
import { 
  productManagement, 
  supplierManagement, 
  purchaseOrderManagement,
  materialPurchaseOrderManagement,
  sampleRequestManagement,
  taskManagement,
  documentManagement,
  Product, 
  Supplier,
  PurchaseOrder,
  MaterialPurchaseOrder,
  SampleRequest,
  Task,
  Document
} from '../lib/supplyChainData';
```

### Step 2: Add Database State Management

Add these state variables to your component:

```typescript
// Database state
const [data, setData] = useState<YourDataType[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [searchTerm, setSearchTerm] = useState('');
const [showAddModal, setShowAddModal] = useState(false);
const [editingItem, setEditingItem] = useState<YourDataType | null>(null);
const [formData, setFormData] = useState({
  // Your form fields here
});
```

### Step 3: Load Data from Database

Add this useEffect to load data:

```typescript
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await yourManagementFunction.getAllItems();
    setData(data);
  } catch (err) {
    console.error('Error loading data:', err);
    setError('Failed to load data. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### Step 4: Add CRUD Operations

#### Create Function:
```typescript
const handleAddItem = async () => {
  try {
    setError(null);
    const newItem = await yourManagementFunction.createItem(formData);
    setData([newItem, ...data]);
    setShowAddModal(false);
    setFormData({ /* reset form */ });
  } catch (err) {
    console.error('Error adding item:', err);
    setError('Failed to add item. Please try again.');
  }
};
```

#### Update Function:
```typescript
const handleEditItem = async () => {
  if (!editingItem) return;
  
  try {
    setError(null);
    const updatedItem = await yourManagementFunction.updateItem(editingItem.id, formData);
    setData(data.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    setEditingItem(null);
    setFormData({ /* reset form */ });
  } catch (err) {
    console.error('Error updating item:', err);
    setError('Failed to update item. Please try again.');
  }
};
```

#### Delete Function:
```typescript
const handleDeleteItem = async (id: string) => {
  if (window.confirm('Are you sure you want to delete this item?')) {
    try {
      setError(null);
      await yourManagementFunction.deleteItem(id);
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    }
  }
};
```

### Step 5: Add UI Components

#### Search Bar:
```typescript
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
  <input
    type="text"
    placeholder="Search items..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
  />
</div>
```

#### Add Button:
```typescript
<button
  onClick={() => setShowAddModal(true)}
  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
>
  <Plus className="h-4 w-4 mr-2" />
  Add Item
</button>
```

#### Data Table:
```typescript
<table className="w-full">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {filteredData.map((item) => (
      <tr key={item.id} className="hover:bg-gray-50">
        <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
        <td className="px-4 py-2 text-sm text-gray-900">{item.code}</td>
        <td className="px-4 py-2 text-sm text-gray-500">{item.status}</td>
        <td className="px-4 py-2 text-sm">
          <div className="flex space-x-2">
            <button
              onClick={() => openEditModal(item)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteItem(item.id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

## 📄 Page-Specific Implementation Guide

### 1. **Purchase Orders** (`/purchase-orders`)
```typescript
// Use: purchaseOrderManagement
// Data: PurchaseOrder[]
// Features: Create PO, add lines, update status, delete PO
```

### 2. **Material Purchase Orders** (`/material-purchase-orders`)
```typescript
// Use: materialPurchaseOrderManagement
// Data: MaterialPurchaseOrder[]
// Features: Create MPO, add material lines, update status
```

### 3. **Sample Requests** (`/sample-requests`)
```typescript
// Use: sampleRequestManagement
// Data: SampleRequest[]
// Features: Create requests, update status, add evaluation notes
```

### 4. **My Tasks** (`/my-tasks`)
```typescript
// Use: taskManagement.getMyTasks(userId)
// Data: Task[]
// Features: View assigned tasks, update status, add hours
```

### 5. **Documents** (`/documents`)
```typescript
// Use: documentManagement
// Data: Document[]
// Features: Upload files, add metadata, categorize documents
```

### 6. **Products** (`/products`)
```typescript
// Use: productManagement
// Data: Product[]
// Features: Create products, update costs, manage inventory
```

### 7. **Suppliers** (`/suppliers`)
```typescript
// Use: supplierManagement
// Data: Supplier[]
// Features: Manage supplier profiles, contact info, terms
```

## 🔄 Quick Implementation Template

Here's a template you can copy and modify for any page:

```typescript
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { yourManagementFunction, YourDataType } from '../lib/supplyChainData';

const YourPage: React.FC = () => {
  // Database state
  const [data, setData] = useState<YourDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<YourDataType | null>(null);
  const [formData, setFormData] = useState({
    // Your form fields
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await yourManagementFunction.getAllItems();
      setData(data);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      setError(null);
      const newItem = await yourManagementFunction.createItem(formData);
      setData([newItem, ...data]);
      setShowAddModal(false);
      setFormData({ /* reset */ });
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    }
  };

  const handleEditItem = async () => {
    if (!editingItem) return;
    
    try {
      setError(null);
      const updatedItem = await yourManagementFunction.updateItem(editingItem.id, formData);
      setData(data.map(item => 
        item.id === editingItem.id ? updatedItem : item
      ));
      setEditingItem(null);
      setFormData({ /* reset */ });
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setError(null);
        await yourManagementFunction.deleteItem(id);
        setData(data.filter(item => item.id !== id));
      } catch (err) {
        console.error('Error deleting item:', err);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  const openEditModal = (item: YourDataType) => {
    setEditingItem(item);
    setFormData({
      // Map item fields to form data
    });
  };

  // Filter data
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Page Title</h1>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and Add Button */}
      <div className="mb-6 flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          {/* Your table headers and rows */}
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit' : 'Add'} Item
            </h2>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              if (editingItem) {
                handleEditItem();
              } else {
                handleAddItem();
              }
            }}>
              {/* Your form fields */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                    setFormData({ /* reset */ });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourPage;
```

## 🎯 Benefits of This Approach

1. **✅ Real-time Updates**: All changes save to database immediately
2. **✅ Data Persistence**: Changes survive page reloads and app restarts
3. **✅ Error Handling**: Proper error messages and loading states
4. **✅ Search & Filter**: Built-in search functionality
5. **✅ CRUD Operations**: Complete Create, Read, Update, Delete functionality
6. **✅ Type Safety**: Full TypeScript support with proper interfaces
7. **✅ Consistent UI**: Same pattern across all pages

## 🚀 Next Steps

1. **Choose a page** to implement next (recommend starting with Purchase Orders)
2. **Copy the template** and modify for your specific data type
3. **Test the functionality** by adding, editing, and deleting items
4. **Repeat** for other pages

## 📞 Need Help?

If you encounter any issues or need help implementing this pattern on a specific page, just let me know which page you're working on and I'll help you implement it!

---

**🎉 You now have a complete database-driven supply chain management system!** 