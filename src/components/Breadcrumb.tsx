import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbMap: Record<string, string> = {
    'my-tasks': 'My Tasks',
    'product-manager': 'Product Manager',
    'techpacks': 'Techpacks',
    'sample-requests': 'Sample Requests',
    'purchase-orders': 'Purchase Orders',
    'purchase-order': 'Purchase Order',
    'material-manager': 'Material Manager',
    'supplier-loading': 'Supplier Loading',
    'pivot-reports': 'Pivot Reports',
    'documents': 'Documents',
    'user-administration': 'User Administration',
    'data-bank': 'Data Bank',
    'material-purchase-order': 'Material Purchase Order',
    'material-purchase-order-lines': 'Material Purchase Order Lines',
    'test-quick-wins': 'Quick Wins Test'
  };

  // Don't show breadcrumb on home page
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4 px-6 pt-4" aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center hover:text-blue-600 transition-colors"
        aria-label="Go to home page"
      >
        <Home className="h-4 w-4 mr-1" />
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = breadcrumbMap[name] || name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        return (
          <React.Fragment key={name}>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 font-medium" aria-current="page">
                {displayName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-blue-600 transition-colors"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb; 