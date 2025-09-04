import React, { useState } from 'react';
import AdvancedSearch from './AdvancedSearch';

// Example usage of the simple search component
const SearchExample: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement your search logic here
    // This would typically call your API with the search query
  };

  const handleClear = () => {
    setSearchResults([]);
    console.log('Search cleared');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Simple Search Examples</h1>
      
      {/* Product Search Example */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Search</h2>
        <AdvancedSearch
          onSearch={handleSearch}
          onClear={handleClear}
          placeholder="Search products by name, code, or description..."
        />
      </div>

      {/* Purchase Order Search Example */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Purchase Order Search</h2>
        <AdvancedSearch
          onSearch={handleSearch}
          onClear={handleClear}
          placeholder="Search purchase orders by number, supplier, or status..."
        />
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use Simple Search</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• <strong>Type to search:</strong> Enter your search query in the input field</li>
          <li>• <strong>Press Enter:</strong> Search immediately by pressing Enter key</li>
          <li>• <strong>Click Search:</strong> Or click the Search button to execute search</li>
          <li>• <strong>Clear search:</strong> Click the X button to clear the search field</li>
          <li>• <strong>Real-time results:</strong> Search results update based on your query</li>
        </ul>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Results</h3>
          <p className="text-gray-600">Found {searchResults.length} results</p>
        </div>
      )}
    </div>
  );
};

export default SearchExample;
