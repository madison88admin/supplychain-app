import React, { useRef, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { ChevronDown, ChevronRight, Upload, Edit as EditIcon, Save as SaveIcon, Copy as CopyIcon, Plus, Filter as FilterIcon, Download, X, Search } from 'lucide-react';
import logo from '../images/logo no bg.png';
import ReportBar from '../components/ReportBar';
import { useSidebar } from '../contexts/SidebarContext';
import { purchaseOrderService, convertDbRowToDisplayFormat } from '../lib/purchaseOrderData';

// Define grouped columns
const groupedColumns = [
  {
    label: 'Finish Trim Order',
    children: ['Target Date', 'Completed Date'],
    key: 'Finish trim Order',
  },
  {
    label: 'Link to line',
    children: ['Target Date', 'Completed Date'],
    key: 'Link to line',
  },
  {
    label: 'Finish Care Label',
    children: ['Target Date', 'Completed Date'],
    key: 'Finish Care Label',
  },
  {
    label: 'Packing & Shipping Instructions',
    children: ['Target Date', 'Completed Date'],
    key: 'Packing & Shipping Instructions',
  },
];

// All other columns
const baseColumns = [
  'Order References', 'Status', 'Total Qty', 'Total Cost', 'Total Value', 'Customer', 'Supplier', 'Purchase Currency', 'Selling Currency',
  'Purchase Payment Term', 'Selling Payment Term', 'Supplier Parent', 'Delivery Contact', 'Division', 'Group', 'Supplier Description',
  'Supplier Location', 'Supplier Country', 'Template', 'Transport Method', 'Deliver to', 'Closed Date', 'Delivery Date', 'PO Issue Date',
  'Supplier Currency', 'Comments', 'Production', 'MLA- Purchasing', 'China -QC', 'MLA-Planning', 'MLA-Shipping', 'PO Key User 6',
  'PO Key User 7', 'PO Key User 8', 'PO Key Working Group 2', 'PO Key Working Group 3', 'PO Key Working Group 4',
  'Purchase Payment Term Description', 'Selling Payment Term Description', 'Note Count', 'Latest Note', 'Default PO Line Template',
  'Default Ex-Factory', 'Created By', 'Created', 'Last Edited', 'Last Edited By', 'PO Issue Date',
];

// Define header mappings for flexible import
const headerMapping: Record<string, string[]> = {
  'Order References': ['Order References', 'PO Reference', 'Order Ref', 'Reference', 'PO Number', 'Order Number', 'PO ID'],
  'Status': ['Status', 'PO Status', 'Order Status', 'State', 'Order State', 'Purchase Order Status', 'PO Line Status'],
  'Total Qty': ['Total Qty', 'Total Quantity', 'Quantity', 'Qty', 'Total Units', 'Order Quantity'],
  'Total Cost': ['Total Cost', 'Cost', 'Purchase Cost', 'Total Purchase Cost', 'Amount', 'Total Amount'],
  'Total Value': ['Total Value', 'Value', 'Selling Value', 'Total Selling Value', 'Revenue'],
  'Customer': ['Customer', 'Client', 'Buyer', 'Customer Name', 'Client Name', 'Buyer Name'],
  'Supplier': ['Supplier', 'Vendor', 'Manufacturer', 'Supplier Name', 'Vendor Name', 'Factory'],
  'Purchase Currency': ['Purchase Currency', 'Currency', 'PO Currency', 'Buy Currency', 'Purchase Curr'],
  'Selling Currency': ['Selling Currency', 'Sale Currency', 'Sell Currency', 'Selling Curr'],
  'Purchase Payment Term': ['Purchase Payment Term', 'Payment Term', 'PO Payment Term', 'Buy Payment Term'],
  'Selling Payment Term': ['Selling Payment Term', 'Sale Payment Term', 'Sell Payment Term'],
  'Supplier Parent': ['Supplier Parent', 'Parent Supplier', 'Parent Company', 'Parent Vendor'],
  'Delivery Contact': ['Delivery Contact', 'Contact', 'Delivery Person', 'Contact Person'],
  'Division': ['Division', 'Dept', 'Department', 'Business Unit'],
  'Group': ['Group', 'Product Group', 'Category', 'Product Category'],
  'Supplier Description': ['Supplier Description', 'Description', 'Supplier Info', 'Vendor Description'],
  'Supplier Location': ['Supplier Location', 'Location', 'Factory Location', 'Vendor Location'],
  'Supplier Country': ['Supplier Country', 'Country', 'Factory Country', 'Vendor Country'],
  'Template': ['Template', 'PO Template', 'Order Template', 'Template Name'],
  'Transport Method': ['Transport Method', 'Transport', 'Shipping Method', 'Delivery Method'],
  'Deliver to': ['Deliver to', 'Delivery To', 'Delivery Address', 'Ship To', 'Delivery Location'],
  'Closed Date': ['Closed Date', 'Close Date', 'Completion Date', 'End Date'],
  'Delivery Date': ['Delivery Date', 'Ship Date', 'Expected Delivery', 'Target Delivery'],
  'PO Issue Date': ['PO Issue Date', 'Issue Date', 'Order Date', 'Creation Date', 'PO Date'],
  'Supplier Currency': ['Supplier Currency', 'Vendor Currency', 'Factory Currency'],
  'Comments': ['Comments', 'Comment', 'Notes', 'Description', 'Remarks'],
  'Production': ['Production', 'Production Status', 'Manufacturing', 'Production Stage'],
  'MLA- Purchasing': ['MLA- Purchasing', 'MLA Purchasing', 'Purchasing', 'Buyer', 'Purchasing Agent'],
  'China -QC': ['China -QC', 'China QC', 'QC', 'Quality Control', 'Quality Check'],
  'MLA-Planning': ['MLA-Planning', 'MLA Planning', 'Planning', 'Production Planning'],
  'MLA-Shipping': ['MLA-Shipping', 'MLA Shipping', 'Shipping', 'Logistics'],
  'PO Key User 6': ['PO Key User 6', 'Key User 6', 'User 6', 'Custom Field 6'],
  'PO Key User 7': ['PO Key User 7', 'Key User 7', 'User 7', 'Custom Field 7'],
  'PO Key User 8': ['PO Key User 8', 'Key User 8', 'User 8', 'Custom Field 8'],
  'PO Key Working Group 2': ['PO Key Working Group 2', 'Working Group 2', 'WG2', 'Team 2'],
  'PO Key Working Group 3': ['PO Key Working Group 3', 'Working Group 3', 'WG3', 'Team 3'],
  'PO Key Working Group 4': ['PO Key Working Group 4', 'Working Group 4', 'WG4', 'Team 4'],
  'Purchase Payment Term Description': ['Purchase Payment Term Description', 'Payment Term Desc', 'Buy Payment Term Desc'],
  'Selling Payment Term Description': ['Selling Payment Term Description', 'Sale Payment Term Desc'],
  'Note Count': ['Note Count', 'Notes Count', 'Comment Count', 'Number of Notes'],
  'Latest Note': ['Latest Note', 'Last Note', 'Recent Note', 'Latest Comment'],
  'Default PO Line Template': ['Default PO Line Template', 'PO Line Template', 'Line Template'],
  'Default Ex-Factory': ['Default Ex-Factory', 'Ex-Factory', 'Ex Factory', 'Factory Date'],
  'Created By': ['Created By', 'Creator', 'Author', 'Created By User'],
  'Created': ['Created', 'Creation Date', 'Created Date', 'Date Created'],
  'Last Edited': ['Last Edited', 'Last Modified', 'Modified', 'Last Updated'],
  'Last Edited By': ['Last Edited By', 'Editor', 'Modified By', 'Last Updated By'],
};

const allColumns = [
  ...baseColumns,
  ...groupedColumns.map(g => g.key),
];

// Function to generate dummy purchase order entries
const generateDummyEntries = (): Record<string, any>[] => {
  const customers = ['ABC Corp', 'Beta Industries', 'Gamma Solutions', 'Delta Manufacturing', 'Epsilon Trading', 'Zeta Retail', 'Eta Services', 'Theta Logistics'];
  const suppliers = ['XYZ Textiles', 'Premium Fabrics', 'Global Materials', 'Quality Suppliers', 'Elite Manufacturing', 'Prime Vendors', 'Superior Goods', 'Excellence Corp'];
  const statuses = ['Open', 'Confirmed', 'In Production', 'Shipped', 'Delivered'];
  const divisions = ['Apparel', 'Electronics', 'Home Goods', 'Automotive', 'Healthcare'];
  const groups = ['Men\'s Wear', 'Women\'s Wear', 'Children\'s', 'Accessories', 'Footwear'];
  const transportMethods = ['Sea', 'Air', 'Land', 'Express'];
  const locations = ['Shanghai', 'Bangkok', 'Mumbai', 'Istanbul', 'Cairo', 'Nairobi', 'Lagos', 'Casablanca'];
  const countries = ['China', 'Thailand', 'India', 'Turkey', 'Egypt', 'Kenya', 'Nigeria', 'Morocco'];
  const templates = ['Standard', 'Premium', 'Express', 'Custom', 'Bulk'];
  const currencies = ['USD', 'EUR', 'CNY', 'INR', 'THB', 'TRY', 'EGP', 'KES'];
  const paymentTerms = ['Net 30', 'Net 60', 'Net 90', 'Cash on Delivery', 'Advance Payment'];
  const productionStatuses = ['In Progress', 'Planned', 'Completed', 'On Hold', 'Cancelled'];
  const qcStatuses = ['Passed', 'Pending', 'Failed', 'Under Review', 'Approved'];
  const planningStatuses = ['Planned', 'In Progress', 'Completed', 'Delayed', 'Cancelled'];
  const shippingStatuses = ['Pending', 'In Progress', 'Shipped', 'Delivered', 'Returned'];

  const dummyEntries: Record<string, any>[] = [];

  for (let i = 1; i <= 8; i++) {
    const customer = customers[i - 1];
    const supplier = suppliers[i - 1];
    const status = statuses[i % statuses.length];
    const division = divisions[i % divisions.length];
    const group = groups[i % groups.length];
    const transport = transportMethods[i % transportMethods.length];
    const location = locations[i % locations.length];
    const country = countries[i % countries.length];
    const template = templates[i % templates.length];
    const currency = currencies[i % currencies.length];
    const paymentTerm = paymentTerms[i % paymentTerms.length];
    const production = productionStatuses[i % productionStatuses.length];
    const qc = qcStatuses[i % qcStatuses.length];
    const planning = planningStatuses[i % planningStatuses.length];
    const shipping = shippingStatuses[i % shippingStatuses.length];

    const baseDate = new Date(2024, 6, 1); // July 1, 2024
    const issueDate = new Date(baseDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000)); // Add i weeks
    const deliveryDate = new Date(issueDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // Add 30 days
    const closedDate = new Date(deliveryDate.getTime() - (5 * 24 * 60 * 60 * 1000)); // 5 days before delivery

    const totalQty = 500 + (i * 250);
    const totalCost = totalQty * (10 + i);
    const totalValue = totalCost * 1.2; // 20% markup

    const entry: Record<string, any> = {
      'Order References': `PO-2024-${String(i).padStart(3, '0')}`,
      'Status': status,
      'Total Qty': totalQty,
      'Total Cost': `$${totalCost.toLocaleString()}`,
      'Total Value': `$${totalValue.toLocaleString()}`,
      'Customer': customer,
      'Supplier': supplier,
      'Purchase Currency': currency,
      'Selling Currency': 'EUR',
      'Purchase Payment Term': paymentTerm,
      'Selling Payment Term': 'Net 60',
      'Supplier Parent': `${supplier} Group`,
      'Delivery Contact': `Contact ${i}`,
      'Division': division,
      'Group': group,
      'Supplier Description': `Main supplier for ${division.toLowerCase()}`,
      'Supplier Location': location,
      'Supplier Country': country,
      'Template': template,
      'Transport Method': transport,
      'Deliver to': `Warehouse ${i}`,
      'Closed Date': closedDate.toISOString().split('T')[0],
      'Delivery Date': deliveryDate.toISOString().split('T')[0],
      'PO Issue Date': issueDate.toISOString().split('T')[0],
      'Supplier Currency': currency,
      'Comments': `${status} order for ${customer}`,
      'Production': production,
      'MLA- Purchasing': `Purchaser ${i}`,
      'China -QC': qc,
      'MLA-Planning': planning,
      'MLA-Shipping': shipping,
      'PO Key User 6': `User${i}`,
      'PO Key User 7': `User${i + 1}`,
      'PO Key User 8': `User${i + 2}`,
      'PO Key Working Group 2': `Group${i}`,
      'PO Key Working Group 3': `Group${i + 1}`,
      'PO Key Working Group 4': `Group${i + 2}`,
      'Purchase Payment Term Description': `${paymentTerm} days after invoice`,
      'Selling Payment Term Description': '60 days after invoice',
      'Note Count': i,
      'Latest Note': `Note ${i}: ${status} status update`,
      'Default PO Line Template': `Template ${String.fromCharCode(65 + i)}`,
      'Default Ex-Factory': new Date(issueDate.getTime() + (15 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      'Created By': 'Admin',
      'Created': new Date(issueDate.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      'Last Edited': new Date(issueDate.getTime() - (2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      'Last Edited By': 'Editor',
      'Finish trim Order': { 
        'Target Date': new Date(issueDate.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], 
        'Completed Date': new Date(issueDate.getTime() + (8 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] 
      },
      'Link to line': { 
        'Target Date': new Date(issueDate.getTime() + (10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], 
        'Completed Date': new Date(issueDate.getTime() + (11 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] 
      },
      'Finish Care Label': { 
        'Target Date': new Date(issueDate.getTime() + (12 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], 
        'Completed Date': new Date(issueDate.getTime() + (13 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] 
      },
      'Packing & Shipping Instructions': { 
        'Target Date': new Date(issueDate.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], 
        'Completed Date': new Date(issueDate.getTime() + (15 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] 
      },
    };

    dummyEntries.push(entry);
  }

  return dummyEntries;
};

const initialRow: Record<string, any> = {
  'Order References': 'PO-1001',
  'Status': 'Open',
  'Total Qty': 1000,
  'Total Cost': '$10,000',
  'Total Value': '$12,000',
  'Customer': 'ABC Corp',
  'Supplier': 'XYZ Textiles',
  'Purchase Currency': 'USD',
  'Selling Currency': 'EUR',
  'Purchase Payment Term': 'Net 30',
  'Selling Payment Term': 'Net 60',
  'Supplier Parent': 'XYZ Group',
  'Delivery Contact': 'John Doe',
  'Division': 'Apparel',
  'Group': 'Men\'s Wear',
  'Supplier Description': 'Main supplier for knits',
  'Supplier Location': 'Shanghai',
  'Supplier Country': 'China',
  'Template': 'Standard',
  'Transport Method': 'Sea',
  'Deliver to': 'Warehouse 1',
  'Closed Date': '2024-07-10',
  'Delivery Date': '2024-07-20',
  'PO Issue Date': '2024-07-01',
  'Supplier Currency': 'CNY',
  'Comments': 'Urgent order',
  'Production': 'In Progress',
  'MLA- Purchasing': 'Jane Smith',
  'China -QC': 'Passed',
  'MLA-Planning': 'Planned',
  'MLA-Shipping': 'Pending',
  'PO Key User 6': 'User6',
  'PO Key User 7': 'User7',
  'PO Key User 8': 'User8',
  'PO Key Working Group 2': 'Group2',
  'PO Key Working Group 3': 'Group3',
  'PO Key Working Group 4': 'Group4',
  'Purchase Payment Term Description': '30 days after invoice',
  'Selling Payment Term Description': '60 days after invoice',
  'Note Count': 2,
  'Latest Note': 'Check delivery schedule',
  'Default PO Line Template': 'Template A',
  'Default Ex-Factory': '2024-07-15',
  'Created By': 'Admin',
  'Created': '2024-06-30',
  'Last Edited': '2024-07-02',
  'Last Edited By': 'Editor',
  'Finish trim Order': { 'Target Date': '2024-07-08', 'Completed Date': '2024-07-09' },
  'Link to line': { 'Target Date': '2024-07-10', 'Completed Date': '2024-07-11' },
  'Finish Care Label': { 'Target Date': '2024-07-12', 'Completed Date': '2024-07-13' },
  'Packing & Shipping Instructions': { 'Target Date': '2024-07-14', 'Completed Date': '2024-07-15' },
};

const blankRow: Record<string, any> = Object.fromEntries([
  ...baseColumns.map(col => [col, '']),
  ...groupedColumns.map(g => [g.key, { 'Target Date': '', 'Completed Date': '' }]),
]);

// In the PO Details subtable, use these columns from the main table:
const poDetailsColumns = [
  'Order Reference',
  'Supplier',
  'Purchase Currency',
  'Status',
  'Production',
  'MLA- Purchasing',
  'China -QC',
  'MLA-Planning',
  'MLA-Shipping',
  'Closed Date',
  'Selling Currency',
];
const mockPODetails = [
  { line: 1, item: 'A123', description: 'Widget A', qty: 100, unitPrice: '$10', total: '$1000' },
  { line: 2, item: 'B456', description: 'Widget B', qty: 50, unitPrice: '$20', total: '$1000' },
];

// Add mock data for other subtables
const deliveryDetailsColumns = ['Customer', 'Deliver To', 'Transport Method'];
const mockDeliveryDetails = [
  { date: '2024-07-20', location: 'Warehouse 1', status: 'Pending' },
  { date: '2024-07-22', location: 'Warehouse 2', status: 'Delivered' },
];

// In the Critical Path tab, use these columns:
const criticalPathColumns = ['Template', 'PO Issue Date'];
const mockCriticalPath = [
  { milestone: 'Order Placed', target: '2024-07-01', completed: '2024-07-01', status: 'Done' },
  { milestone: 'Production Start', target: '2024-07-05', completed: '', status: 'Pending' },
];

const auditColumns = ['Created By', 'Created', 'Last Edited'];
const mockAudit = [
  { type: 'Quality', date: '2024-07-10', result: 'Pass' },
  { type: 'Compliance', date: '2024-07-12', result: 'Pending' },
];

// In the Totals tab, use these columns:
const totalsColumns = ['Total Qty', 'Total Cost', 'Total Value'];
const mockTotals = [
  { label: 'Total Qty', value: 150 },
  { label: 'Total Value', value: '$2,000' },
];

const commentsColumns = ['Comments'];
const mockComments = [
  { user: 'Admin', date: '2024-07-01', comment: 'Order created.' },
  { user: 'Editor', date: '2024-07-02', comment: 'Checked delivery schedule.' },
];

// Add mock PO Lines data with comprehensive structure from PurchaseOrders.tsx
const mockPOLines = [
  {
    'Order': 'PO-2024-001',
    'Product': 'Widget X',
    'PO Line': '1',
    'Fit Comment': 'Fits well',
    'Fit Log Status': 'Approved',
    'Fit Log Type': 'Initial',
    'Fit Log Name': 'Spring Fit',
    'Customer': 'Acme Corp',
    'Collection': 'Spring 2024',
    'Division': 'Menswear',
    'Group': 'A',
    'Transport Method': 'Air',
    'Deliver To': 'Warehouse 5',
    'Status': 'Open',
    'Delivery Date': '2024-08-01',
    'Comments': 'Urgent',
    'Quantity': 500,
    'Selling Quantity': 500,
    'Line Purchase Price': '$10',
    'Line Selling Price': '$15',
    'Supplier': 'Best Supplier',
    'Purchase Currency': 'USD',
    'Selling Currency': 'EUR',
    'Production': 'In Progress',
    'MLA-Purchasing': 'Jane Smith',
    'China-QC': 'Passed',
    'MLA-Planning': 'Planned',
    'MLA-Shipping': 'Pending',
    'Template': 'Standard',
    'Ex-Factory': '2024-07-15',
    'Purchase Order Status': 'Confirmed',
    'Supplier Purchase Currency': 'USD',
    'Customer Selling Currency': 'EUR',
    'Minimum Order Quantity': 100,
    'Purchase Description': 'Cotton T-shirt',
    'Product Type': 'Apparel',
    'Product Sub Type': 'T-shirt',
    'Product Status': 'Active',
    'Product Buyer Style Name': 'Classic Tee',
    'Product Buyer Style Number': 'CT-2024',
    'Standard Minute Value': 12,
    'Costing': '$8',
    'Costing Status': 'Final',
    'Supplier Payment Term': 'Net 30',
    'Supplier Payment Term Description': '30 days',
    'Order Purchase Payment Term': 'Net 30',
    'Order Purchase Payment Term Description': '30 days',
    'Product Supplier Purchase Payment Term': 'Net 30',
    'Product Supplier Purhcase Payment Term Description': '30 days',
    'Order Selling Payment Term': 'Net 60',
    'Order Selling Payment Term Description': '60 days',
    'Product Supplier Selling Payment Term': 'Net 60',
    'Product Supplier Selling Payment Term Description': '60 days',
    'Purchase Price': '$10',
    'Selling Price': '$15',
    'Season': 'Spring',
    'Department': 'Production',
    'Customer Parent': 'Acme Group',
    'RECIPIENT PRODUCT SUPPLIER-NUMBER': 'RPS-001',
    'FG PO Number': 'FG-2024-001',
    'Received': 0,
    'Balance': 500,
    'Over Received': 0,
    'Size': 'L',
    'Main Material': 'Cotton',
    'Main Material Description': '100% Cotton',
    'Delivery Contact': 'John Doe',
    'PO Key User 6': 'User6',
    'PO Key User 7': 'User7',
    'PO Key User 8': 'User8',
    'PO Key Working Group 1': 'WG1',
    'PO Key Working Group 2': 'WG2',
    'PO Key Working Group 3': 'WG3',
    'PO Key Working Group 4': 'WG4',
    'Created By': 'Admin',
    'Last Edited': '2024-06-30',
    'Last Edited By': 'Editor',
    'Color': 'Blue',
    'Vessel Schedule': 'VS-2024',
    'Buyer PO Number': 'BPO-2024-001',
    'Shipment ID': 'SHIP-001',
    'Factory Invoiced': 'No',
    'Supplier Invoice': 'INV-001',
    'QuickBooks Invoice': 'QB-001',
    'Shipment Noted': 'No',
    'Buy Information': 'Standard',
    'Handling Charges': '$50',
    'Original Forecasts Quantity': 500,
    'Start Date': '2024-06-01',
    'Cancelled Date': '',
    'Factory Date Paid': '',
    'Date Invoice Raised': '',
    'Submitted Inspection Date': '',
    'Remarks': '',
    'Inspection Results': '',
    'Report Type': '',
    'Inspector': '',
    'Approval Status': '',
    'Shipment Status': '',
    'QC Comment': '',
    'Delay Shipment Code': '',
    'Discount Percentage': '',
    'SELL INC COMM': '',
    'Buyer Surcharge': '',
    'Buyer Surchage Percentage': '',
    'MOQ': '',
    'Discount Cost': '',
    'Factory Surcharge': '',
    'Factory Surchage Percentage': '',
    'Buyer Season': 'Spring',
    'Lookbook': '',
    'Finished Good Testing Status': '',
  },
  {
    'Order': 'PO-2024-002',
    'Product': 'Widget Y',
    'PO Line': '2',
    'Fit Comment': 'Needs adjustment',
    'Fit Log Status': 'Pending',
    'Fit Log Type': 'Revision',
    'Fit Log Name': 'Summer Fit',
    'Customer': 'Beta Corp',
    'Collection': 'Summer 2024',
    'Division': 'Womenswear',
    'Group': 'B',
    'Transport Method': 'Sea',
    'Deliver To': 'Warehouse 3',
    'Status': 'Confirmed',
    'Delivery Date': '2024-09-15',
    'Comments': 'Standard order',
    'Quantity': 300,
    'Selling Quantity': 300,
    'Line Purchase Price': '$12',
    'Line Selling Price': '$18',
    'Supplier': 'Premium Supplier',
    'Purchase Currency': 'USD',
    'Selling Currency': 'EUR',
    'Production': 'Planned',
    'MLA-Purchasing': 'John Doe',
    'China-QC': 'Pending',
    'MLA-Planning': 'In Progress',
    'MLA-Shipping': 'Not Started',
    'Template': 'Premium',
    'Ex-Factory': '2024-08-20',
    'Purchase Order Status': 'Confirmed',
    'Supplier Purchase Currency': 'USD',
    'Customer Selling Currency': 'EUR',
    'Minimum Order Quantity': 100,
    'Purchase Description': 'Silk Blouse',
    'Product Type': 'Apparel',
    'Product Sub Type': 'Blouse',
    'Product Status': 'Active',
    'Product Buyer Style Name': 'Elegant Blouse',
    'Product Buyer Style Number': 'EB-2024',
    'Standard Minute Value': 15,
    'Costing': '$10',
    'Costing Status': 'Final',
    'Supplier Payment Term': 'Net 30',
    'Supplier Payment Term Description': '30 days',
    'Order Purchase Payment Term': 'Net 30',
    'Order Purchase Payment Term Description': '30 days',
    'Product Supplier Purchase Payment Term': 'Net 30',
    'Product Supplier Purhcase Payment Term Description': '30 days',
    'Order Selling Payment Term': 'Net 60',
    'Order Selling Payment Term Description': '60 days',
    'Product Supplier Selling Payment Term': 'Net 60',
    'Product Supplier Selling Payment Term Description': '60 days',
    'Purchase Price': '$12',
    'Selling Price': '$18',
    'Season': 'Summer',
    'Department': 'Production',
    'Customer Parent': 'Beta Group',
    'RECIPIENT PRODUCT SUPPLIER-NUMBER': 'RPS-002',
    'FG PO Number': 'FG-2024-002',
    'Received': 0,
    'Balance': 300,
    'Over Received': 0,
    'Size': 'M',
    'Main Material': 'Silk',
    'Main Material Description': '100% Silk',
    'Delivery Contact': 'Jane Smith',
    'PO Key User 6': 'User6',
    'PO Key User 7': 'User7',
    'PO Key User 8': 'User8',
    'PO Key Working Group 1': 'WG1',
    'PO Key Working Group 2': 'WG2',
    'PO Key Working Group 3': 'WG3',
    'PO Key Working Group 4': 'WG4',
    'Created By': 'Admin',
    'Last Edited': '2024-06-30',
    'Last Edited By': 'Editor',
    'Color': 'Red',
    'Vessel Schedule': 'VS-2024',
    'Buyer PO Number': 'BPO-2024-002',
    'Shipment ID': 'SHIP-002',
    'Factory Invoiced': 'No',
    'Supplier Invoice': 'INV-002',
    'QuickBooks Invoice': 'QB-002',
    'Shipment Noted': 'No',
    'Buy Information': 'Standard',
    'Handling Charges': '$40',
    'Original Forecasts Quantity': 300,
    'Start Date': '2024-07-01',
    'Cancelled Date': '',
    'Factory Date Paid': '',
    'Date Invoice Raised': '',
    'Submitted Inspection Date': '',
    'Remarks': '',
    'Inspection Results': '',
    'Report Type': '',
    'Inspector': '',
    'Approval Status': '',
    'Shipment Status': '',
    'QC Comment': '',
    'Delay Shipment Code': '',
    'Discount Percentage': '',
    'SELL INC COMM': '',
    'Buyer Surcharge': '',
    'Buyer Surchage Percentage': '',
    'MOQ': '',
    'Discount Cost': '',
    'Factory Surcharge': '',
    'Factory Surchage Percentage': '',
    'Buyer Season': 'Summer',
    'Lookbook': '',
    'Finished Good Testing Status': '',
  },
  {
    'Order': 'PO-2024-003',
    'Product': 'Widget Z',
    'PO Line': '3',
    'Fit Comment': 'Perfect fit',
    'Fit Log Status': 'Approved',
    'Fit Log Type': 'Final',
    'Fit Log Name': 'Fall Fit',
    'Customer': 'Gamma Corp',
    'Collection': 'Fall 2024',
    'Division': 'Accessories',
    'Group': 'C',
    'Transport Method': 'Air',
    'Deliver To': 'Warehouse 1',
    'Status': 'Open',
    'Delivery Date': '2024-10-01',
    'Comments': 'High priority',
    'Quantity': 200,
    'Selling Quantity': 200,
    'Line Purchase Price': '$8',
    'Line Selling Price': '$12',
    'Supplier': 'Fast Supplier',
    'Purchase Currency': 'USD',
    'Selling Currency': 'EUR',
    'Production': 'Completed',
    'MLA-Purchasing': 'Mike Johnson',
    'China-QC': 'Passed',
    'MLA-Planning': 'Completed',
    'MLA-Shipping': 'In Progress',
    'Template': 'Express',
    'Ex-Factory': '2024-09-10',
    'Purchase Order Status': 'Confirmed',
    'Supplier Purchase Currency': 'USD',
    'Customer Selling Currency': 'EUR',
    'Minimum Order Quantity': 50,
    'Purchase Description': 'Leather Bag',
    'Product Type': 'Accessories',
    'Product Sub Type': 'Bag',
    'Product Status': 'Active',
    'Product Buyer Style Name': 'Classic Bag',
    'Product Buyer Style Number': 'CB-2024',
    'Standard Minute Value': 8,
    'Costing': '$6',
    'Costing Status': 'Final',
    'Supplier Payment Term': 'Net 30',
    'Supplier Payment Term Description': '30 days',
    'Order Purchase Payment Term': 'Net 30',
    'Order Purchase Payment Term Description': '30 days',
    'Product Supplier Purchase Payment Term': 'Net 30',
    'Product Supplier Purhcase Payment Term Description': '30 days',
    'Order Selling Payment Term': 'Net 60',
    'Order Selling Payment Term Description': '60 days',
    'Product Supplier Selling Payment Term': 'Net 60',
    'Product Supplier Selling Payment Term Description': '60 days',
    'Purchase Price': '$8',
    'Selling Price': '$12',
    'Season': 'Fall',
    'Department': 'Production',
    'Customer Parent': 'Gamma Group',
    'RECIPIENT PRODUCT SUPPLIER-NUMBER': 'RPS-003',
    'FG PO Number': 'FG-2024-003',
    'Received': 0,
    'Balance': 200,
    'Over Received': 0,
    'Size': 'Standard',
    'Main Material': 'Leather',
    'Main Material Description': 'Genuine Leather',
    'Delivery Contact': 'Sarah Wilson',
    'PO Key User 6': 'User6',
    'PO Key User 7': 'User7',
    'PO Key User 8': 'User8',
    'PO Key Working Group 1': 'WG1',
    'PO Key Working Group 2': 'WG2',
    'PO Key Working Group 3': 'WG3',
    'PO Key Working Group 4': 'WG4',
    'Created By': 'Admin',
    'Last Edited': '2024-06-30',
    'Last Edited By': 'Editor',
    'Color': 'Brown',
    'Vessel Schedule': 'VS-2024',
    'Buyer PO Number': 'BPO-2024-003',
    'Shipment ID': 'SHIP-003',
    'Factory Invoiced': 'No',
    'Supplier Invoice': 'INV-003',
    'QuickBooks Invoice': 'QB-003',
    'Shipment Noted': 'No',
    'Buy Information': 'Standard',
    'Handling Charges': '$30',
    'Original Forecasts Quantity': 200,
    'Start Date': '2024-08-01',
    'Cancelled Date': '',
    'Factory Date Paid': '',
    'Date Invoice Raised': '',
    'Submitted Inspection Date': '',
    'Remarks': '',
    'Inspection Results': '',
    'Report Type': '',
    'Inspector': '',
    'Approval Status': '',
    'Shipment Status': '',
    'QC Comment': '',
    'Delay Shipment Code': '',
    'Discount Percentage': '',
    'SELL INC COMM': '',
    'Buyer Surcharge': '',
    'Buyer Surchage Percentage': '',
    'MOQ': '',
    'Discount Cost': '',
    'Factory Surcharge': '',
    'Factory Surchage Percentage': '',
    'Buyer Season': 'Fall',
    'Lookbook': '',
    'Finished Good Testing Status': '',
  }
];

// Define the columns to show in the PO Lines table (limited to match the original size)
const poLinesColumns = [
  'Order', 'Product', 'PO Line', 'Fit Comment', 'Fit Log Status', 'Fit Log Type', 'Fit Log Name', 
  'Customer', 'Collection', 'Division', 'Group', 'Transport Method', 'Deliver To', 'Status', 
  'Delivery Date', 'Comments', 'Quantity'
];

const PurchaseOrder: React.FC = () => {
  // Sticky column configuration with precise positioning
  const stickyColumns = [
    { key: 'checkbox-header', left: 0, zIndex: 30, width: 48 },
    { key: 'Order References', left: 48, zIndex: 40, width: 120 }
  ];

  const getStickyStyle = (key: string, isHeader: boolean = false) => {
    const stickyCol = stickyColumns.find(c => c.key === key);
    if (!stickyCol) return {};
    
    const baseStyle = {
      position: 'sticky' as const,
      left: `${stickyCol.left}px`,
      zIndex: stickyCol.zIndex,
      backgroundColor: isHeader ? '#f9fafb' : '#ffffff',
      boxSizing: 'border-box' as const,
      borderCollapse: 'separate' as const,
      borderSpacing: 0,
      width: `${stickyCol.width}px`,
      minWidth: `${stickyCol.width}px`,
      maxWidth: `${stickyCol.width}px`
    };

    // Add specific border styling for each sticky column
    if (key === 'checkbox-header') {
      return {
        ...baseStyle,
        borderRight: '1px solid #e5e7eb',
        borderLeft: '1px solid #e5e7eb'
      };
    } else if (key === 'Order References') {
      return {
        ...baseStyle,
        borderRight: '2px solid #e5e7eb',
        borderLeft: '1px solid #e5e7eb'
      };
    }

    return baseStyle;
  };

  const [rows, setRows] = useState(generateDummyEntries());
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<Record<string, any> | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [search, setSearch] = useState('');
  const [filteredRows, setFilteredRows] = useState<typeof rows | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Add state for column selector search
  const [columnSearch, setColumnSearch] = useState('');

  // Add state for Add New modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState<Record<string, any>>({});

  // Add state for Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});

  // Multi-row selection states
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Cell selection states
  const [selectedCell, setSelectedCell] = useState<{rowIndex: number, colKey: string} | null>(null);

  // Sidebar context
  const { sidebarCollapsed } = useSidebar();

  // Filtered columns for selector
  const filteredColumnList = allColumns.filter(col =>
    col.toLowerCase().includes(columnSearch.toLowerCase())
  );

  // Helper function to find matching column headers
  const findMatchingColumn = (importedHeaders: string[], targetColumn: string): string | null => {
    const possibleHeaders = headerMapping[targetColumn] || [targetColumn];
    
    // First try exact match
    const exactMatch = importedHeaders.find(header => 
      possibleHeaders.includes(header)
    );
    if (exactMatch) return exactMatch;
    
    // Then try case-insensitive match
    const caseInsensitiveMatch = importedHeaders.find(header => 
      possibleHeaders.some((possible: string) => 
        possible.toLowerCase() === header.toLowerCase()
      )
    );
    if (caseInsensitiveMatch) return caseInsensitiveMatch;
    
    // Finally try partial match (header contains target or target contains header)
    const partialMatch = importedHeaders.find(header => 
      possibleHeaders.some((possible: string) => 
        header.toLowerCase().includes(possible.toLowerCase()) ||
        possible.toLowerCase().includes(header.toLowerCase())
      )
    );
    
    return partialMatch || null;
  };

  // Helper function to format dates to MM/DD/YYYY format
  const formatDateToMMDDYYYY = (dateValue: any): string => {
    if (!dateValue) return '';
    
    // If it's already a string in MM/DD/YYYY format
    if (typeof dateValue === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateValue)) {
      return dateValue;
    }
    
    // If it's a Date object or Excel serial number
    let date: Date;
    if (typeof dateValue === 'number') {
      // Excel serial number (days since 1900-01-01)
      date = new Date((dateValue - 25569) * 86400 * 1000);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      // Try to parse as string
      date = new Date(dateValue);
    }
    
    // Check if valid date
    if (isNaN(date.getTime())) return '';
    
    // Format as MM/DD/YYYY
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  };

  // Helper function to check if a column is a date column
  const isDateColumn = (columnName: string): boolean => {
    const dateKeywords = ['Date', 'Created', 'Last Edited', 'Closed', 'Delivery', 'Issue', 'Factory'];
    return dateKeywords.some(keyword => columnName.includes(keyword));
  };

  // Add state for PO Details edit mode and form
  const [poDetailsEditMode, setPoDetailsEditMode] = useState(false);
  const [poDetailsForm, setPoDetailsForm] = useState<Record<string, any> | null>(null);

  // Add edit state and form for each tab
  const [deliveryEditMode, setDeliveryEditMode] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState<Record<string, any> | null>(null);
  const [criticalPathEditMode, setCriticalPathEditMode] = useState(false);
  const [criticalPathForm, setCriticalPathForm] = useState<Record<string, any> | null>(null);
  const [auditEditMode, setAuditEditMode] = useState(false);
  const [auditForm, setAuditForm] = useState<Record<string, any> | null>(null);
  const [totalsEditMode, setTotalsEditMode] = useState(false);
  const [totalsForm, setTotalsForm] = useState<Record<string, any> | null>(null);
  const [commentsEditMode, setCommentsEditMode] = useState(false);
  const [commentsForm, setCommentsForm] = useState<Record<string, any> | null>(null);

  // Add edit state for PO Lines
  const [poLinesEditMode, setPoLinesEditMode] = useState(false);
  const [poLinesForm, setPoLinesForm] = useState<Record<string, any>[] | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Record<string, any> | null>(null);
  // PO lines loaded from database (display format from purchaseOrderService)
  const [poLinesData, setPoLinesData] = useState<Record<string, any>[]>([]);
  
  // State for slide-up container
  const [showSlideUpContainer, setShowSlideUpContainer] = useState(false);
  const [activeContent, setActiveContent] = useState('');
  const [activeProductTab, setActiveProductTab] = useState('Product Details');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load data from Supabase (fallback to dummy if empty or error)
  useEffect(() => {
    const loadDataFromDatabase = async () => {
      try {
        const dbRows = await purchaseOrderService.getAllPurchaseOrderLines();
        if (!dbRows || dbRows.length === 0) return; // keep dummy

        const displayLines = dbRows.map(convertDbRowToDisplayFormat);

        // Map line-level fields into this page's order-level schema
        const mapped = displayLines.map((line: Record<string, any>) => {
          const mappedRow: Record<string, any> = { ...blankRow };
          mappedRow['Order References'] = line['Order'] || '';
          mappedRow['Status'] = line['Status'] || '';
          mappedRow['Customer'] = line['Customer'] || '';
          mappedRow['Supplier'] = line['Supplier'] || '';
          mappedRow['Purchase Currency'] = line['Purchase Currency'] || '';
          mappedRow['Selling Currency'] = line['Selling Currency'] || '';
          mappedRow['Division'] = line['Division'] || '';
          mappedRow['Group'] = line['Group'] || '';
          mappedRow['Template'] = line['Template'] || '';
          mappedRow['Transport Method'] = line['Transport Method'] || '';
          mappedRow['Deliver to'] = line['Deliver To'] || '';
          mappedRow['Closed Date'] = line['Closed Date'] || '';
          mappedRow['Delivery Date'] = line['Delivery Date'] || '';
          mappedRow['PO Issue Date'] = line['Start Date'] || '';
          mappedRow['Comments'] = line['Comments'] || '';
          mappedRow['Production'] = line['Production'] || '';
          mappedRow['MLA- Purchasing'] = line['MLA-Purchasing'] || '';
          mappedRow['China -QC'] = line['China-QC'] || '';
          mappedRow['MLA-Planning'] = line['MLA-Planning'] || '';
          mappedRow['MLA-Shipping'] = line['MLA-Shipping'] || '';
          mappedRow['PO Key User 6'] = line['PO Key User 6'] || '';
          mappedRow['PO Key User 7'] = line['PO Key User 7'] || '';
          mappedRow['PO Key User 8'] = line['PO Key User 8'] || '';
          mappedRow['Created By'] = line['Created By'] || '';
          mappedRow['Created'] = line['Created'] || '';
          mappedRow['Last Edited'] = line['Last Edited'] || '';
          mappedRow['Last Edited By'] = line['Last Edited By'] || '';
          // Grouped fields for this page are not present in DB mapping; leave as empty objects
          return mappedRow;
        });

        setRows(mapped);
        setPoLinesData(displayLines);
      } catch (e) {
        // Keep dummy data on error
        console.error('Failed loading purchase orders from database:', e);
      }
    };
    loadDataFromDatabase();
  }, []);

  // Filtered PO lines for the currently selected order
  // Note: computed after displayRows is defined further below

  const handleEdit = () => {
    // Only edit if a row is selected/highlighted
    if (selectedIndex >= 0 && selectedIndex < displayRows.length) {
      setEditFormData({ ...JSON.parse(JSON.stringify(displayRows[selectedIndex])) });
      setIsEditModalOpen(true);
    }
  };

  const handleChange = (col: string, value: string, subCol?: string) => {
    if (!editRow) return;
    if (subCol) {
      setEditRow({ ...editRow, [col]: { ...editRow[col], [subCol]: value } });
    } else {
      setEditRow({ ...editRow, [col]: value });
    }
  };

  const handleSave = () => {
    if (editRow !== null && editIndex !== null) {
      const newRows = [...(filteredRows ?? rows)];
      newRows[editIndex] = { ...editRow };
      if (filteredRows) {
        const mainRows = [...rows];
        const idxInMain = rows.indexOf(filteredRows[editIndex]);
        if (idxInMain !== -1) mainRows[idxInMain] = { ...editRow };
        setRows(mainRows);
        setFilteredRows(newRows);
      } else {
        setRows(newRows);
      }
      setEditIndex(null);
      setEditRow(null);
    }
  };

  const handleCopy = () => {
    const baseRows = filteredRows ?? rows;
    const newRows = [...baseRows];
    newRows.splice(selectedIndex + 1, 0, JSON.parse(JSON.stringify(baseRows[selectedIndex])));
    if (filteredRows) {
      const mainRows = [...rows];
      const idxInMain = rows.indexOf(baseRows[selectedIndex]);
      mainRows.splice(idxInMain + 1, 0, JSON.parse(JSON.stringify(baseRows[selectedIndex])));
      setRows(mainRows);
      setFilteredRows(newRows);
    } else {
      setRows(newRows);
    }
  };

  const handleAdd = () => {
    // Initialize form data with blank row
    setAddFormData({ ...blankRow });
    setIsAddModalOpen(true);
  };

  const handleAddSave = () => {
    // Add the new row to the beginning of the list
    const newRows = [addFormData, ...(filteredRows ?? rows)];
    if (filteredRows) {
      const mainRows = [addFormData, ...rows];
      setRows(mainRows);
      setFilteredRows(newRows);
    } else {
      setRows(newRows);
    }
    setSelectedIndex(0);
    setIsAddModalOpen(false);
    setAddFormData({});
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    setAddFormData({});
  };

  const handleEditSave = () => {
    // Update the row with form data
    const newRows = [...(filteredRows ?? rows)];
    newRows[selectedIndex] = { ...editFormData };
    if (filteredRows) {
      const mainRows = [...rows];
      const idxInMain = rows.indexOf(filteredRows[selectedIndex]);
      if (idxInMain !== -1) mainRows[idxInMain] = { ...editFormData };
      setRows(mainRows);
      setFilteredRows(newRows);
    } else {
      setRows(newRows);
    }
    setIsEditModalOpen(false);
    setEditFormData({});
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditFormData({});
  };

  // Dynamic filtering: update filteredRows whenever search or rows changes
  useEffect(() => {
    if (!search.trim()) {
      setFilteredRows(null);
    } else {
      const lower = search.toLowerCase();
      setFilteredRows(
        rows.filter(row =>
          allColumns.some(col => {
            const val = row[col];
            if (typeof val === 'object' && val !== null && 'Target Date' in val) {
              return (
                (val['Target Date'] ?? '').toLowerCase().includes(lower) ||
                (val['Completed Date'] ?? '').toLowerCase().includes(lower)
              );
            }
            return String(val ?? '').toLowerCase().includes(lower);
          })
        )
      );
    }
  }, [search, rows]);

  const handleClear = () => {
    // If a row is selected, show confirmation dialog
    if (selectedIndex >= 0 && displayRows.length > 0) {
      setShowDeleteConfirm(true);
    }
    // If no row is selected, clear search and filters
    else {
      setSearch('');
      setFilteredRows(null);
      setSelectedIndex(0);
    }
  };

  const handleConfirmDelete = () => {
    const newRows = [...(filteredRows ?? rows)];
    newRows.splice(selectedIndex, 1);
    
    if (filteredRows) {
      const mainRows = [...rows];
      const idxInMain = rows.indexOf(filteredRows[selectedIndex]);
      if (idxInMain !== -1) mainRows.splice(idxInMain, 1);
      setRows(mainRows);
      setFilteredRows(newRows);
    } else {
      setRows(newRows);
    }
    
    // Reset selection and edit states
    setSelectedIndex(0);
    setEditIndex(null);
    setEditRow(null);
    setExpandedIndex(null);
    setSelectedProductDetails(null);
    
    // If we deleted the last row, reset to empty state
    if (newRows.length === 0) {
      setSelectedIndex(-1);
    } else if (selectedIndex >= newRows.length) {
      setSelectedIndex(newRows.length - 1);
    }
    
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleColumnToggle = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PurchaseOrders');
    XLSX.writeFile(workbook, 'purchase_orders.xlsx');
  };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      
      // Map uploaded data to table columns with flexible header matching
      const mappedRows = json.map((row) => {
        const newRow: Record<string, any> = { ...blankRow };
        const importedHeaders = Object.keys(row);
        
        // Map base columns with flexible matching and date formatting
        baseColumns.forEach((col) => {
          const matchingHeader = findMatchingColumn(importedHeaders, col);
          if (matchingHeader && row[matchingHeader] !== undefined) {
            // Check if this is a date column and format accordingly
            if (isDateColumn(col)) {
              newRow[col] = formatDateToMMDDYYYY(row[matchingHeader]);
            } else {
              newRow[col] = row[matchingHeader];
            }
          }
        });
        
        // Map grouped columns with flexible matching and date formatting
        groupedColumns.forEach((group) => {
          const targetDateHeader = findMatchingColumn(importedHeaders, `${group.label} - Target Date`);
          const completedDateHeader = findMatchingColumn(importedHeaders, `${group.label} - Completed Date`);
          
          newRow[group.key] = {
            'Target Date': targetDateHeader ? formatDateToMMDDYYYY(row[targetDateHeader]) || '' : '',
            'Completed Date': completedDateHeader ? formatDateToMMDDYYYY(row[completedDateHeader]) || '' : '',
          };
        });
        
        return newRow;
      });
      
      setRows((prev) => [...prev, ...mappedRows]);
    };
    reader.readAsArrayBuffer(file);
  };

  const displayRows = filteredRows ?? rows;

  // Now that displayRows is available, compute selected order's PO lines
  const selectedOrderRef = (displayRows[selectedIndex] || {})['Order References'];
  const filteredPoLines = poLinesData.filter((line) => (line['Order'] || '') === (selectedOrderRef || ''));

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < displayRows.length) {
        e.preventDefault();
        handleEdit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, displayRows.length]);

  // For rendering, expand grouped columns into subcolumns
  const renderColumns = () => {
    const cols: { label: string; key: string; isGroup?: boolean; children?: string[] }[] = [];
    
    // Always add Order References first if it's in visibleColumns
    if (visibleColumns.includes('Order References')) {
      cols.push({ label: 'Order References', key: 'Order References' });
    }
    
    // Add all other columns except Order References (since we already added it)
    visibleColumns.forEach(col => {
      if (col !== 'Order References') {
        const group = groupedColumns.find(g => g.key === col);
        if (group) {
          cols.push({ label: group.label, key: group.key, isGroup: true, children: group.children });
        } else {
          cols.push({ label: col, key: col });
        }
      }
    });
    return cols;
  };

  // Fix: renderHeaderRows returns correct structure
  const renderHeaderRows = () => {
    const cols = renderColumns();
    const firstRow = [
      <th 
        key="checkbox-header" 
        rowSpan={2} 
        className="px-3 py-1 border-b text-center whitespace-nowrap"
        style={{
          ...getStickyStyle('checkbox-header', true),
          borderTop: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <div className="flex items-center justify-center">
          <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2" />
        </div>
      </th>,
      ...cols.map((col, i) => {
        return col.isGroup ? (
          <th 
            key={`${col.key}-group-${i}`} 
            colSpan={2} 
            className={`px-2 py-1 border-b text-center whitespace-nowrap`}
            style={{
              ...getStickyStyle(col.key, true),
              borderTop: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            {col.label}
          </th>
        ) : (
          <th 
            key={`${col.key}-single-${i}`} 
            rowSpan={2} 
            className={`px-2 py-1 border-b text-left whitespace-nowrap align-middle`}
            style={{
              ...getStickyStyle(col.key, true),
              borderTop: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            {col.label}
          </th>
        );
      })
    ];
    const secondRow = cols.flatMap((col, idx) =>
      col.isGroup
        ? [
            <th key={`${col.key}-target-${idx}`} className={`px-2 py-1 border-b text-center whitespace-nowrap border-r-2 border-gray-200`}>Target Date</th>,
            <th key={`${col.key}-completed-${idx}`} className={`${idx < cols.length - 1 ? 'border-r-2 border-gray-200' : ''} px-2 py-1 border-b text-center whitespace-nowrap`}>Completed Date</th>,
          ]
        : []
    );
    return [firstRow, secondRow];
  };

  const subTabs = ['PO Details', 'Delivery', 'Critical Path', 'Audit', 'Totals', 'Comments', 'Product Details'];
  const [activeSubTab, setActiveSubTab] = useState('PO Details');

  // Helper functions for subtable editing
  const handleSubTableEdit = (tableType: string) => {
    switch (tableType) {
      case 'poDetails':
        setPoDetailsForm({
          'Order Reference': displayRows[expandedIndex!]?.['Order References'] || '',
          'Supplier': displayRows[expandedIndex!]?.['Supplier'] || '',
          'Purchase Currency': displayRows[expandedIndex!]?.['Purchase Currency'] || '',
          'Status': displayRows[expandedIndex!]?.['Status'] || '',
          'Production': displayRows[expandedIndex!]?.['Production'] || '',
          'MLA- Purchasing': displayRows[expandedIndex!]?.['MLA- Purchasing'] || '',
          'China -QC': displayRows[expandedIndex!]?.['China -QC'] || '',
          'MLA-Planning': displayRows[expandedIndex!]?.['MLA-Planning'] || '',
          'MLA-Shipping': displayRows[expandedIndex!]?.['MLA-Shipping'] || '',
          'Closed Date': displayRows[expandedIndex!]?.['Closed Date'] || '',
          'Selling Currency': displayRows[expandedIndex!]?.['Selling Currency'] || '',
        });
        setPoDetailsEditMode(true);
        break;
      case 'delivery':
        setDeliveryForm({
          'Customer': displayRows[expandedIndex!]?.['Customer'] || '',
          'Deliver To': displayRows[expandedIndex!]?.['Deliver to'] || '',
          'Transport Method': displayRows[expandedIndex!]?.['Transport Method'] || '',
        });
        setDeliveryEditMode(true);
        break;
      case 'criticalPath':
        setCriticalPathForm({
          'Template': displayRows[expandedIndex!]?.['Template'] || '',
          'PO Issue Date': displayRows[expandedIndex!]?.['PO Issue Date'] || '',
        });
        setCriticalPathEditMode(true);
        break;
      case 'audit':
        setAuditForm({
          'Created By': displayRows[expandedIndex!]?.['Created By'] || '',
          'Created': displayRows[expandedIndex!]?.['Created'] || '',
          'Last Edited': displayRows[expandedIndex!]?.['Last Edited'] || '',
        });
        setAuditEditMode(true);
        break;
      case 'totals':
        setTotalsForm({
          'Total Qty': displayRows[expandedIndex!]?.['Total Qty'] || '',
          'Total Cost': displayRows[expandedIndex!]?.['Total Cost'] || '',
          'Total Value': displayRows[expandedIndex!]?.['Total Value'] || '',
        });
        setTotalsEditMode(true);
        break;
      case 'comments':
        setCommentsForm({
          'Comments': displayRows[expandedIndex!]?.['Comments'] || '',
        });
        setCommentsEditMode(true);
        break;
      case 'poLines':
        setPoLinesForm([...filteredPoLines]);
        setPoLinesEditMode(true);
        break;
    }
  };

  const handleSubTableSave = (tableType: string) => {
    if (expandedIndex === null) return;

    const newRows = [...(filteredRows ?? rows)];
    const currentRow = { ...newRows[expandedIndex] };

    switch (tableType) {
      case 'poDetails':
        if (poDetailsForm) {
          // Update the main row with form data
          Object.keys(poDetailsForm).forEach(key => {
            if (key === 'Order Reference') {
              currentRow['Order References'] = poDetailsForm[key];
            } else {
              currentRow[key] = poDetailsForm[key];
            }
          });
        }
        setPoDetailsEditMode(false);
        setPoDetailsForm(null);
        break;
      case 'delivery':
        if (deliveryForm) {
          Object.keys(deliveryForm).forEach(key => {
            if (key === 'Deliver To') {
              currentRow['Deliver to'] = deliveryForm[key];
            } else {
              currentRow[key] = deliveryForm[key];
            }
          });
        }
        setDeliveryEditMode(false);
        setDeliveryForm(null);
        break;
      case 'criticalPath':
        if (criticalPathForm) {
          Object.keys(criticalPathForm).forEach(key => {
            currentRow[key] = criticalPathForm[key];
          });
        }
        setCriticalPathEditMode(false);
        setCriticalPathForm(null);
        break;
      case 'audit':
        if (auditForm) {
          Object.keys(auditForm).forEach(key => {
            currentRow[key] = auditForm[key];
          });
        }
        setAuditEditMode(false);
        setAuditForm(null);
        break;
      case 'totals':
        if (totalsForm) {
          Object.keys(totalsForm).forEach(key => {
            currentRow[key] = totalsForm[key];
          });
        }
        setTotalsEditMode(false);
        setTotalsForm(null);
        break;
      case 'comments':
        if (commentsForm) {
          Object.keys(commentsForm).forEach(key => {
            currentRow[key] = commentsForm[key];
          });
        }
        setCommentsEditMode(false);
        setCommentsForm(null);
        break;
      case 'poLines':
        // For PO Lines, we would typically update a separate data structure
        // For now, we'll just close the edit mode
        setPoLinesEditMode(false);
        setPoLinesForm(null);
        break;
    }

    // Update the rows
    newRows[expandedIndex] = currentRow;
    if (filteredRows) {
      const mainRows = [...rows];
      const idxInMain = rows.indexOf(filteredRows[expandedIndex]);
      if (idxInMain !== -1) mainRows[idxInMain] = currentRow;
      setRows(mainRows);
      setFilteredRows(newRows);
    } else {
      setRows(newRows);
    }
  };

  const handleSubTableCancel = (tableType: string) => {
    switch (tableType) {
      case 'poDetails':
        setPoDetailsEditMode(false);
        setPoDetailsForm(null);
        break;
      case 'delivery':
        setDeliveryEditMode(false);
        setDeliveryForm(null);
        break;
      case 'criticalPath':
        setCriticalPathEditMode(false);
        setCriticalPathForm(null);
        break;
      case 'audit':
        setAuditEditMode(false);
        setAuditForm(null);
        break;
      case 'totals':
        setTotalsEditMode(false);
        setTotalsForm(null);
        break;
      case 'comments':
        setCommentsEditMode(false);
        setCommentsForm(null);
        break;
      case 'poLines':
        setPoLinesEditMode(false);
        setPoLinesForm(null);
        break;
    }
  };

  const handlePoLinesChange = (lineIndex: number, field: string, value: string) => {
    if (!poLinesForm) return;
    const newPoLines = [...poLinesForm];
    newPoLines[lineIndex] = { ...newPoLines[lineIndex], [field]: value };
    setPoLinesForm(newPoLines);
  };

  const handleProductClick = (productData: Record<string, any>) => {
    // If the same product is already selected, close it
    if (selectedProductDetails && selectedProductDetails['PO Line'] === productData['PO Line']) {
      setSelectedProductDetails(null);
    } else {
      // Otherwise, select the new product and switch to Product Details tab
      setSelectedProductDetails(productData);
      setActiveProductTab('Product Details');
      setActiveSubTab('Product Details');
    }
  };

  // Multi-row selection handlers
  const handleRowSelect = (rowIndex: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
    } else {
      newSelectedRows.add(rowIndex);
    }
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.size === displayRows.length);
    setSelectedIndex(rowIndex);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      const allIndices = new Set(displayRows.map((_, index) => index));
      setSelectedRows(allIndices);
      setSelectAll(true);
    }
  };

  const handleExportSelected = () => {
    const rowsToExport = selectedRows.size > 0 
      ? displayRows.filter((_, index) => selectedRows.has(index))
      : displayRows;
    
    const ws = XLSX.utils.json_to_sheet(rowsToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PurchaseOrders');
    XLSX.writeFile(wb, `purchase_orders_${selectedRows.size > 0 ? 'selected' : 'all'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Cell selection handlers - now highlights entire row
  const handleCellClick = (rowIndex: number, colKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex(rowIndex);
    // Clear any previous cell selection
    setSelectedCell(null);
  };

  const handleCellKeyDown = (rowIndex: number, colKey: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedIndex(rowIndex);
      // Clear any previous cell selection
      setSelectedCell(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Purchase Order</h1>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Primary Actions */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleImportClick}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          
          <button 
            onClick={handleEdit}
            disabled={selectedIndex < 0 || selectedIndex >= displayRows.length}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <EditIcon className="w-4 h-4 mr-2" />
            Edit
          </button>
          
          <button 
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              style={{ minWidth: 250 }}
            />
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowColumnSelector(v => !v)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FilterIcon className="w-4 h-4 mr-2" />
            Filter Columns
          </button>
          
          <button 
            onClick={handleExportSelected}
            disabled={displayRows.length === 0}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            {selectedRows.size > 0 ? `Export Selected (${selectedRows.size})` : 'Export All'}
          </button>
        </div>

        {/* Filter Actions */}
        {/* Removed Filter and Clear buttons for dynamic search */}
      </div>

      {/* Selection Summary */}
      {selectedRows.size > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">
                {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedRows(new Set());
                setSelectAll(false);
              }}
              className="text-sm text-green-600 hover:text-green-800 underline"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Interaction Guide */}
      <div className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 text-xs text-blue-700">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium">Quick Tips:</span>
          <span>• Click row to select for editing</span>
          <span>• Click chevron to view details</span>
          <span>• Press Enter to edit selected row</span>
        </div>
      </div>

      {/* Column Selector Modal */}
      {showColumnSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999999] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Select Columns to Display</h3>
              <button onClick={() => setShowColumnSelector(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Search columns..."
                value={columnSearch}
                onChange={e => setColumnSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mb-4">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors"
                onClick={() => {
                  setVisibleColumns(prev => {
                    const newCols = [...prev, ...filteredColumnList.filter(col => !prev.includes(col))];
                    return allColumns.filter(c => newCols.includes(c));
                  });
                }}
              >
                Select All
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors"
                onClick={() => {
                  setVisibleColumns(prev => prev.filter(col => !filteredColumnList.includes(col)));
                }}
              >
                Deselect All
              </button>
            </div>
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {filteredColumnList.length === 0 ? (
                <div className="text-sm text-gray-400 px-2 py-4">No columns found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredColumnList.map(col => (
                    <label key={col} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col)}
                        onChange={() => handleColumnToggle(col)}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700">{col}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">{visibleColumns.length} of {allColumns.length} columns selected</span>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" 
                onClick={() => setShowColumnSelector(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto" style={{ maxHeight: 'calc(84vh - 220px)' }}>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(84vh - 220px)' }}>
          <table className="min-w-full bg-white border border-gray-200 rounded-md text-xs" style={{ 
            boxSizing: 'border-box',
            borderCollapse: 'separate',
            borderSpacing: 0,
            tableLayout: 'auto'
          }}>
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-40">
              <tr>
                {renderHeaderRows()[0]}
              </tr>
              {renderHeaderRows()[1].length > 0 && (
                <tr>
                  {renderHeaderRows()[1]}
                </tr>
              )}
            </thead>
            <tbody>
              {displayRows.map((row, idx) => (
                <React.Fragment key={idx}>
                  <tr
                    className={`
                      transition-all duration-300 cursor-pointer group
                      ${selectedIndex === idx ? 'bg-blue-50 border border-blue-500' : 'hover:bg-gray-50'}
                      ${selectedRows.has(idx) && selectedIndex !== idx ? 'bg-green-50 border border-green-500' : ''}
                      ${selectedRows.has(idx) && selectedIndex === idx ? 'bg-blue-50 border border-blue-500' : ''}
                      ${editIndex === idx ? 'bg-yellow-50 border border-yellow-500' : ''}
                    `}
                    title="Click to select for editing • Click chevron to view details"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('input[type="checkbox"]') || 
                          (e.target as HTMLElement).closest('button[data-action="expand"]')) {
                        return;
                      }
                      // When a row is clicked (not its checkbox), treat it as a single selection:
                      // Clear all previous multi-selections and set this as the only selected row.
                      setSelectedRows(new Set([idx]));
                      setSelectAll(false); // Since it's a single selection, selectAll should be false
                      setSelectedIndex(idx);
                    }}
                  >
                    {/* Checkbox column */}
                    <td 
                      className="px-3 py-3 border-b text-center align-middle whitespace-nowrap"
                      style={{
                        ...getStickyStyle('checkbox-header', false),
                        borderTop: '1px solid #e5e7eb',
                        borderBottom: '1px solid #e5e7eb'
                      }}
                    >
                      <div className="flex items-center justify-center w-full">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(idx)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelect(idx);
                          }}
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                        />
                      </div>
                    </td>
                    
                    {renderColumns().flatMap((col, colIdx, arr) => {
                      if (col.key === 'Order References') {
                        return [
                          <td 
                            key={col.key} 
                            className="px-2 py-1 border-b text-center align-middle whitespace-nowrap cursor-pointer transition-all duration-200"
                            style={{
                              ...getStickyStyle(col.key, false),
                              borderTop: '1px solid #e5e7eb',
                              borderBottom: '1px solid #e5e7eb'
                            }}
                            onClick={(e) => handleCellClick(idx, col.key, e)}
                            onKeyDown={(e) => handleCellKeyDown(idx, col.key, e)}
                            tabIndex={0}
                          > 
                            <div className="flex items-center justify-center space-x-1">
                              <div className="flex-1">
                                {editIndex === idx ? (
                                  <input
                                    className="border px-1 py-0.5 rounded w-32 text-xs"
                                    value={editRow ? editRow[col.key] : ''}
                                    onChange={e => handleChange(col.key, e.target.value)}
                                  />
                                ) : (
                                  <span className="text-xs">{row[col.key] || ''}</span>
                                )}
                              </div>
                              <button
                                data-action="expand"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newExpandedIndex = expandedIndex === idx ? null : idx;
                                  setExpandedIndex(newExpandedIndex);
                                  if (newExpandedIndex === null) {
                                    setSelectedProductDetails(null);
                                  }
                                }}
                                className="ml-2 p-1 hover:bg-blue-100 rounded transition-colors"
                                title={expandedIndex === idx ? 'Collapse details' : 'Expand details'}
                              >
                                {expandedIndex === idx ? (
                                  <ChevronDown className="h-5 w-5 text-blue-600 transition-transform duration-200" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-gray-500 hover:text-blue-600 transition-transform duration-200" />
                                )}
                              </button>
                            </div>
                          </td>
                        ];
                      }
                      if (col.isGroup) {
                        return col.children!.map((subCol, subIdx) => (
                          <td
                            key={col.key + '-' + subCol}
                            className={
                              `px-2 py-1 border-b text-center align-middle whitespace-nowrap cursor-pointer transition-all duration-200` +
                              ((subIdx === 0 || subCol === 'Target Date') ? ' border-r-2 border-gray-200' : '') +
                              (colIdx === arr.length - 1 && subCol === 'Completed Date' ? '' : '') +
                              (selectedIndex === idx ? ' bg-blue-50' : ' hover:bg-gray-50')
                            }
                            onClick={(e) => handleCellClick(idx, col.key + '-' + subCol, e)}
                            onKeyDown={(e) => handleCellKeyDown(idx, col.key + '-' + subCol, e)}
                            tabIndex={0}
                          >
                            {editIndex === idx ? (
                              <input
                                className="border px-1 py-0.5 rounded w-32 text-xs"
                                value={editRow ? editRow[col.key]?.[subCol] || '' : ''}
                                onChange={e => handleChange(col.key, e.target.value, subCol)}
                              />
                            ) : (
                              row[col.key]?.[subCol] || ''
                            )}
                          </td>
                        ));
                      } else {
                        return [
                          <td 
                            key={col.key} 
                            className={`px-2 py-1 border-b text-center align-middle whitespace-nowrap cursor-pointer transition-all duration-200${colIdx < arr.length - 1 ? ' border-r-2 border-gray-200' : ''}${selectedIndex === idx ? ' bg-blue-50' : ' hover:bg-gray-50'}`}
                            onClick={(e) => handleCellClick(idx, col.key, e)}
                            onKeyDown={(e) => handleCellKeyDown(idx, col.key, e)}
                            tabIndex={0}
                          >
                            {editIndex === idx ? (
                              <input
                                className="border px-1 py-0.5 rounded w-32 text-xs"
                                value={editRow ? editRow[col.key] : ''}
                                onChange={e => handleChange(col.key, e.target.value)}
                              />
                            ) : (
                              row[col.key] || ''
                            )}
                          </td>
                        ];
                      }
                    })}
                  </tr>
                  {expandedIndex === idx && (
                    <tr key={`expanded-${idx}`}>
                      <td colSpan={visibleColumns.length + 1} className="bg-transparent p-0 border-none">
                        <div className="bg-white w-full shadow-lg p-3 mt-1 overflow-x-auto" style={{ maxWidth: '100vw' }}>
                          <div className="flex flex-row gap-4" style={{ minWidth: '1200px' }}>
                            {/* Left: Tab bar and tab content */}
                            <div className="flex-1 min-w-0 overflow-x-auto">
                              <div className="mb-2 flex gap-1 border-b border-blue-200">
                                {subTabs.map(tab => (
                                  <button
                                    key={tab}
                                    className={`px-2 py-1 -mb-px rounded-t text-xs font-medium transition-colors border-b-2 ${activeSubTab === tab ? 'bg-white border-blue-500 text-blue-700' : 'bg-blue-50 border-transparent text-gray-600 hover:text-blue-600'}`}
                                    onClick={() => setActiveSubTab(tab)}
                                  >
                                    {tab}
                                  </button>
                                ))}
                              </div>
                              {/* Tab content */}
                              {activeSubTab === 'PO Details' && (
                                <>
                                  <div className="font-semibold text-blue-700 mb-1 text-xs">Purchase Order Details</div>
                                  <div className="overflow-x-auto" style={{ maxWidth: '800px' }}>
                                    <table className="text-xs border border-blue-200 rounded-md mb-1" style={{ minWidth: '600px' }}>
                                    <thead className="bg-blue-100">
                                      <tr>
                                        {poDetailsColumns.map(col => (
                                          <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs">{col}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        {poDetailsColumns.map(col => (
                                          <td key={col} className="px-1 py-0.5">
                                            {poDetailsEditMode ? (
                                              <input
                                                className="border px-0.5 py-0 rounded w-full text-xs"
                                                value={poDetailsForm?.[col] ?? ''}
                                                onChange={e => setPoDetailsForm(f => ({ ...(f || {}), [col]: e.target.value }))}
                                              />
                                            ) : (
                                              col === 'Order Reference'
                                                ? displayRows[expandedIndex]?.['Order References'] || ''
                                                : displayRows[expandedIndex]?.[col] || ''
                                            )}
                                          </td>
                                        ))}
                                      </tr>
                                    </tbody>
                                  </table>
                                  </div>
                                </>
                              )}
                              {activeSubTab === 'Delivery' && (
                                <>
                                  <div className="font-semibold text-blue-700 mb-1 text-xs">Delivery</div>
                                  <div className="overflow-x-auto" style={{ maxWidth: '500px' }}>
                                    <table className="text-xs border border-blue-200 rounded-md mb-1" style={{ minWidth: '400px' }}>
                                    <thead className="bg-blue-100">
                                      <tr>
                                        {deliveryDetailsColumns.map(col => (
                                          <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs">{col}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="px-1 py-0.5">
                                          {deliveryEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={deliveryForm?.['Customer'] ?? ''}
                                              onChange={e => setDeliveryForm(f => ({ ...(f || {}), 'Customer': e.target.value }))}
                                            />
                                          ) : (
                                            displayRows[expandedIndex]?.['Customer'] || ''
                                          )}
                                        </td>
                                        <td className="px-1 py-0.5">
                                          {deliveryEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={deliveryForm?.['Deliver To'] ?? ''}
                                              onChange={e => setDeliveryForm(f => ({ ...(f || {}), 'Deliver To': e.target.value }))}
                                            />
                                          ) : (
                                            displayRows[expandedIndex]?.['Deliver to'] || ''
                                          )}
                                        </td>
                                        <td className="px-1 py-0.5">
                                          {deliveryEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={deliveryForm?.['Transport Method'] ?? ''}
                                              onChange={e => setDeliveryForm(f => ({ ...(f || {}), 'Transport Method': e.target.value }))}
                                            />
                                          ) : (
                                            displayRows[expandedIndex]?.['Transport Method'] || ''
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  </div>
                                </>
                              )}
                              {activeSubTab === 'Critical Path' && (
                                <>
                                  <div className="font-semibold text-blue-700 mb-1 text-xs">Critical Path</div>
                                  <div className="overflow-x-auto" style={{ maxWidth: '500px' }}>
                                    <table className="text-xs border border-blue-200 rounded-md mb-1" style={{ minWidth: '300px' }}>
                                    <thead className="bg-blue-100">
                                      <tr>
                                        {criticalPathColumns.map(col => (
                                          <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs">{col}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="px-1 py-0.5">
                                          {criticalPathEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={criticalPathForm?.['Template'] ?? ''}
                                              onChange={e => setCriticalPathForm(f => ({ ...(f || {}), 'Template': e.target.value }))}
                                            />
                                          ) : (
                                            displayRows[expandedIndex]?.['Template'] || ''
                                          )}
                                        </td>
                                        <td className="px-1 py-0.5">
                                          {criticalPathEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={criticalPathForm?.['PO Issue Date'] ?? ''}
                                              onChange={e => setCriticalPathForm(f => ({ ...(f || {}), 'PO Issue Date': e.target.value }))}
                                            />
                                          ) : (
                                            displayRows[expandedIndex]?.['PO Issue Date'] || ''
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  </div>
                                </>
                              )}
                              {activeSubTab === 'Audit' && (
                                <>
                                  <div className="font-semibold text-blue-700 mb-1 text-xs">Audit</div>
                                  <table className="text-xs border border-blue-200 rounded-md mb-1 w-full">
                                    <thead className="bg-blue-100">
                                      <tr>
                                        {auditColumns.map(col => (
                                          <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs">{col}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="px-1 py-0.5">
                                          {auditEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={auditForm?.['Created By'] ?? ''}
                                              onChange={e => setAuditForm(f => ({ ...(f || {}), 'Created By': e.target.value }))}
                                            />
                                          ) : (
                                            displayRows[expandedIndex]?.['Created By'] || ''
                                          )}
                                        </td>
                                        <td className="px-1 py-0.5">
                                          {auditEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={auditForm?.['Created'] ?? ''}
                                              onChange={e => setAuditForm(f => ({ ...(f || {}), 'Created': e.target.value }))}
                                            />
                                          ) : (
                                            displayRows[expandedIndex]?.['Created'] || ''
                                          )}
                                        </td>
                                        <td className="px-1 py-0.5">
                                          {auditEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={auditForm?.['Last Edited'] ?? ''}
                                              onChange={e => setAuditForm(f => ({ ...(f || {}), 'Last Edited': e.target.value }))}
                                            />
                                          ) : (
                                            displayRows[expandedIndex]?.['Last Edited'] || ''
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </>
                              )}
                              {activeSubTab === 'Totals' && (
                                <>
                                  <div className="font-semibold text-blue-700 mb-1 text-xs">Totals</div>
                                  <table className="text-xs border border-blue-200 rounded-md mb-1 w-full">
                                    <thead className="bg-blue-100">
                                      <tr>
                                        {totalsColumns.map(col => (
                                          <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs">{col}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="px-1 py-0.5">
                                          {totalsEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={totalsForm?.['Total Qty'] ?? ''}
                                              onChange={e => setTotalsForm(f => ({ ...(f || {}), 'Total Qty': e.target.value }))}
                                            />
                                          ) : (
                                            displayRows[expandedIndex]?.['Total Qty'] || ''
                                          )}
                                        </td>
                                        <td className="px-1 py-0.5">
                                          {totalsEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={totalsForm?.['Total Cost'] ?? ''}
                                              onChange={e => setTotalsForm(f => ({ ...(f || {}), 'Total Cost': e.target.value }))}
                                            />
                                          ) : (
                                            displayRows[expandedIndex]?.['Total Cost'] || ''
                                          )}
                                        </td>
                                        <td className="px-1 py-0.5">
                                          {totalsEditMode ? (
                                            <input
                                              className="border px-0.5 py-0 rounded w-full text-xs"
                                              value={totalsForm?.['Total Value'] ?? ''}
                                              onChange={e => setTotalsForm(f => ({ ...(f || {}), 'Total Value': e.target.value }))}
                                            />
                                          ) : (
                                            displayRows[expandedIndex]?.['Total Value'] || ''
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </>
                              )}
                              {activeSubTab === 'Comments' && (
                                <>
                                  <div className="font-semibold text-blue-700 mb-1 text-xs">Comments</div>
                                  <table className="text-xs border border-blue-200 rounded-md mb-1 w-full">
                                    <thead className="bg-blue-100">
                                      <tr>
                                        {commentsColumns.map(col => (
                                          <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs">{col}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="px-1 py-0.5">
                                          {commentsEditMode ? (
                                            <textarea
                                              className="border px-0.5 py-0 rounded w-full text-xs resize-none"
                                              rows={2}
                                              value={commentsForm?.['Comments'] ?? ''}
                                              onChange={e => setCommentsForm(f => ({ ...(f || {}), 'Comments': e.target.value }))}
                                            />
                                          ) : (
                                            displayRows[expandedIndex]?.['Comments'] || ''
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </>
                              )}
                              {activeSubTab === 'Product Details' && selectedProductDetails && (
                                <>
                                  <div className="font-semibold text-blue-700 mb-1 text-xs">Product Details</div>
                                  <div className="mb-2 flex gap-1 border-b border-blue-200">
                                    {['Product Details', 'Critical Path', 'Images', 'Comments', 'Bill Of Materials', 'Activities', 'Colorways'].map(tab => (
                                      <button
                                        key={tab}
                                        className={`px-2 py-1 -mb-px rounded-t text-xs font-medium transition-colors border-b-2 ${activeProductTab === tab ? 'bg-white border-blue-500 text-blue-700' : 'bg-blue-50 border-transparent text-gray-600 hover:text-blue-600'}`}
                                        onClick={() => setActiveProductTab(tab)}
                                      >
                                        {tab}
                                      </button>
                                    ))}
                                  </div>
                                  {/* Product Details Tab content */}
                                  {activeProductTab === 'Product Details' && (
                                    <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
                                      <table className="text-xs border border-blue-200 rounded-md w-full">
                                        <thead className="bg-blue-100">
                                          <tr>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Field</th>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Value</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">M88 Ref</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['RECIPIENT PRODUCT SUPPLIER-NUMBER'] || ''}</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Buyer Style Number</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Product Buyer Style Number'] || ''}</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Buyer Style Name</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Product Buyer Style Name'] || ''}</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Customer</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Customer'] || ''}</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Department</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Department'] || ''}</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Status</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Product Status'] || ''}</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Description</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Purchase Description'] || ''}</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Product Type</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Product Type'] || ''}</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Season</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Season'] || ''}</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Product Development</td>
                                            <td className="px-2 py-1 border-t border-blue-100">-</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Tech Design</td>
                                            <td className="px-2 py-1 border-t border-blue-100">-</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">China - QC</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['China-QC'] || ''}</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Lookbook</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Lookbook'] || '-'}</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                  {activeProductTab === 'Critical Path' && (
                                    <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
                                      <table className="text-xs border border-blue-200 rounded-md w-full">
                                        <thead className="bg-blue-100">
                                          <tr>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Milestone</th>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Target Date</th>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Completed Date</th>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Status</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Order Placement</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Order Placement']?.['Target Date'] || ''}</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Order Placement']?.['Completed Date'] || ''}</td>
                                            <td className="px-2 py-1 border-t border-blue-100">-</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Production Start</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Production'] || ''}</td>
                                            <td className="px-2 py-1 border-t border-blue-100">-</td>
                                            <td className="px-2 py-1 border-t border-blue-100">-</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">Ex-Factory</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Ex-Factory'] || ''}</td>
                                            <td className="px-2 py-1 border-t border-blue-100">-</td>
                                            <td className="px-2 py-1 border-t border-blue-100">-</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                  {activeProductTab === 'Images' && (
                                    <div className="p-4 text-center text-gray-500">
                                      <p>No images available for this product.</p>
                                    </div>
                                  )}
                                  {activeProductTab === 'Comments' && (
                                    <div className="p-4">
                                      <textarea
                                        className="w-full border border-blue-200 rounded-md p-2 text-xs"
                                        rows={4}
                                        placeholder="Add comments about this product..."
                                        defaultValue={selectedProductDetails['Comments'] || ''}
                                      />
                                    </div>
                                  )}
                                  {activeProductTab === 'Bill Of Materials' && (
                                    <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
                                      <table className="text-xs border border-blue-200 rounded-md w-full">
                                        <thead className="bg-blue-100">
                                          <tr>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Material</th>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Description</th>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Quantity</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">{selectedProductDetails['Main Material'] || ''}</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Main Material Description'] || ''}</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Quantity'] || ''}</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                  {activeProductTab === 'Activities' && (
                                    <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
                                      <table className="text-xs border border-blue-200 rounded-md w-full">
                                        <thead className="bg-blue-100">
                                          <tr>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Activity</th>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Status</th>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Date</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">MLA-Purchasing</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['MLA-Purchasing'] || ''}</td>
                                            <td className="px-2 py-1 border-t border-blue-100">-</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">MLA-Planning</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['MLA-Planning'] || ''}</td>
                                            <td className="px-2 py-1 border-t border-blue-100">-</td>
                                          </tr>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">MLA-Shipping</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['MLA-Shipping'] || ''}</td>
                                            <td className="px-2 py-1 border-t border-blue-100">-</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                  {activeProductTab === 'Colorways' && (
                                    <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
                                      <table className="text-xs border border-blue-200 rounded-md w-full">
                                        <thead className="bg-blue-100">
                                          <tr>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Color</th>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Size</th>
                                            <th className="px-2 py-1 text-left font-semibold text-xs">Quantity</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td className="px-2 py-1 border-t border-blue-100 font-medium">{selectedProductDetails['Color'] || ''}</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Size'] || ''}</td>
                                            <td className="px-2 py-1 border-t border-blue-100">{selectedProductDetails['Quantity'] || ''}</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                  <div className="flex justify-end mt-2">
                                    <button
                                      className="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                                      onClick={() => setSelectedProductDetails(null)}
                                    >
                                      Close Details
                                    </button>
                                  </div>
                                </>
                              )}
                              {activeSubTab === 'Product Details' && !selectedProductDetails && (
                                <div className="p-4 text-center text-gray-500">
                                  <p>Click on a product in the PO Lines table to view its details.</p>
                                </div>
                              )}
                            </div>
                            {/* Right: PO Lines table */}
                            <div className="flex-1 min-w-0 overflow-x-auto">
                              <div className="font-semibold text-blue-700 mb-1 text-xs">PO Lines</div>
                              <div className="overflow-x-auto" style={{ maxWidth: '600px' }}>
                                <table className="text-xs border border-blue-200 rounded-md mb-1" style={{ minWidth: '800px' }}>
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {poLinesColumns.map(col => (
                                        <th key={col} className="px-1 py-0.5 text-left font-semibold text-xs whitespace-nowrap">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(poLinesEditMode ? poLinesForm : filteredPoLines)?.map((line, index) => (
                                      <tr key={line['PO Line']}>
                                        {poLinesColumns.map(col => (
                                          <td key={col} className="px-1 py-0.5 whitespace-nowrap">
                                            {poLinesEditMode ? (
                                              <input
                                                className="border px-0.5 py-0 rounded w-full text-xs"
                                                value={(line as any)[col] || ''}
                                                onChange={e => handlePoLinesChange(index, col, e.target.value)}
                                              />
                                            ) : col === 'Product' ? (
                                              <button
                                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-xs"
                                                onClick={() => handleProductClick(line)}
                                              >
                                                {(line as any)[col] || ''}
                                              </button>
                                            ) : (
                                              (line as any)[col] || ''
                                            )}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                           </div>
                          </div>
                        </td>
                      </tr>
                    
                  )}
                </React.Fragment>
                
            ))}
            {displayRows.length === 0 && (
              <tr><td colSpan={visibleColumns.reduce((acc, col) => {
                const group = groupedColumns.find(g => g.key === col);
                return acc + (group ? 2 : 1);
              }, 0) + 1} className="text-center py-4 text-gray-400">No results found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999999]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <img src={logo} alt="Logo" className="w-8 h-8" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Purchase Order</h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete the selected Purchase Order? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                No, Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999999] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add New Purchase Order</h3>
              <button 
                onClick={handleAddCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allColumns.map(col => {
                  const group = groupedColumns.find(g => g.key === col);
                  if (group) {
                    return (
                      <div key={col} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">{group.label}</label>
                        {group.children.map(subCol => (
                          <div key={subCol} className="ml-4">
                            <label className="block text-xs text-gray-600 mb-1">{subCol}</label>
                            <input
                              type={isDateColumn(subCol) ? "date" : "text"}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              value={addFormData[col]?.[subCol] || ''}
                              onChange={e => {
                                const newData = { ...addFormData };
                                if (!newData[col]) newData[col] = {};
                                newData[col][subCol] = e.target.value;
                                setAddFormData(newData);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div key={col}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{col}</label>
                        <input
                          type={isDateColumn(col) ? "date" : "text"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          value={addFormData[col] || ''}
                          onChange={e => setAddFormData({ ...addFormData, [col]: e.target.value })}
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleAddCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999999] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Purchase Order</h3>
              <button 
                onClick={handleEditCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              {/* Main Row Fields */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Main Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allColumns.map(col => {
                    const group = groupedColumns.find(g => g.key === col);
                    if (group) {
                      return (
                        <div key={col} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">{group.label}</label>
                          {group.children.map(subCol => (
                            <div key={subCol} className="ml-4">
                              <label className="block text-xs text-gray-600 mb-1">{subCol}</label>
                              <input
                                type={isDateColumn(subCol) ? "date" : "text"}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                value={editFormData[col]?.[subCol] || ''}
                                onChange={e => {
                                  const newData = { ...editFormData };
                                  if (!newData[col]) newData[col] = {};
                                  newData[col][subCol] = e.target.value;
                                  setEditFormData(newData);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      );
                    } else {
                      return (
                        <div key={col}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{col}</label>
                          <input
                            type={isDateColumn(col) ? "date" : "text"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={editFormData[col] || ''}
                            onChange={e => setEditFormData({ ...editFormData, [col]: e.target.value })}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              {/* Subtables */}
              <div className="space-y-6">
                {/* PO Details Subtable */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">PO Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {poDetailsColumns.map(col => (
                      <div key={col}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{col}</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          value={editFormData[col] || ''}
                          onChange={e => setEditFormData({ ...editFormData, [col]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Subtable */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Delivery Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deliveryDetailsColumns.map(col => (
                      <div key={col}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{col}</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          value={editFormData[col] || ''}
                          onChange={e => setEditFormData({ ...editFormData, [col]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Path Subtable */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Critical Path</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {criticalPathColumns.map(col => (
                      <div key={col}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{col}</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          value={editFormData[col] || ''}
                          onChange={e => setEditFormData({ ...editFormData, [col]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Subtable */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Audit Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {auditColumns.map(col => (
                      <div key={col}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{col}</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          value={editFormData[col] || ''}
                          onChange={e => setEditFormData({ ...editFormData, [col]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals Subtable */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Totals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {totalsColumns.map(col => (
                      <div key={col}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{col}</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          value={editFormData[col] || ''}
                          onChange={e => setEditFormData({ ...editFormData, [col]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments Subtable */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Comments</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {commentsColumns.map(col => (
                      <div key={col}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{col}</label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                          value={editFormData[col] || ''}
                          onChange={e => setEditFormData({ ...editFormData, [col]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* PO Lines Subtable */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-semibold text-gray-800">PO Lines</h4>
                    <button
                      onClick={() => {
                        const newLine = {
                          'PO Line': `Line ${(editFormData.poLines?.length || 0) + 1}`,
                          'Product': '',
                          'Description': '',
                          'Qty': '',
                          'Unit Price': '',
                          'Total': ''
                        };
                        setEditFormData({
                          ...editFormData,
                          poLines: [...(editFormData.poLines || []), newLine]
                        });
                      }}
                      className="px-3 py-1 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center gap-1"
                    >
                      <span>+</span> Add PO Line
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-300 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          {poLinesColumns.map(col => (
                            <th key={col} className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-b border-gray-200">
                              {col}
                            </th>
                          ))}
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-b border-gray-200">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(editFormData.poLines || mockPOLines).map((line: Record<string, any>, index: number) => (
                          <tr key={index} className="border-b border-gray-200">
                            {poLinesColumns.map(col => (
                              <td key={col} className="px-3 py-2">
                                <input
                                  type="text"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  value={line[col] || ''}
                                  onChange={e => {
                                    const updatedLines = [...(editFormData.poLines || mockPOLines)];
                                    updatedLines[index] = { ...updatedLines[index], [col]: e.target.value };
                                    setEditFormData({ ...editFormData, poLines: updatedLines });
                                  }}
                                />
                              </td>
                            ))}
                            <td className="px-3 py-2">
                              <button
                                onClick={() => {
                                  const updatedLines = (editFormData.poLines || mockPOLines).filter((_: Record<string, any>, i: number) => i !== index);
                                  setEditFormData({ ...editFormData, poLines: updatedLines });
                                }}
                                className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ReportBar Component */}
      <ReportBar
        showSlideUpContainer={showSlideUpContainer}
        setShowSlideUpContainer={setShowSlideUpContainer}
        activeContent={activeContent}
        setActiveContent={setActiveContent}
        sidebarCollapsed={sidebarCollapsed}
        pageData={displayRows[selectedIndex] || {}}
      />
    </div>
  );
};

export default PurchaseOrder; 