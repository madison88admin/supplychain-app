import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import OptimizedImage from './OptimizedImage';

const TestQuickWins: React.FC = () => {
  const [showLoading, setShowLoading] = useState(false);

  const testError = () => {
    throw new Error('This is a test error to demonstrate the Error Boundary!');
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Quick Wins Test Page</h2>
      
      {/* Test Loading Spinner */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Loading Spinner Test</h3>
        <div className="flex space-x-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Small Blue</p>
            <LoadingSpinner size="sm" color="blue" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Medium White</p>
            <div className="bg-gray-800 p-4 rounded">
              <LoadingSpinner size="md" color="white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Large Gray</p>
            <LoadingSpinner size="lg" color="gray" />
          </div>
        </div>
        <button
          onClick={() => setShowLoading(!showLoading)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Toggle Loading State
        </button>
        {showLoading && (
          <div className="bg-gray-100 p-8 rounded">
            <LoadingSpinner size="lg" />
            <p className="text-center mt-4">Loading content...</p>
          </div>
        )}
      </div>

      {/* Test Optimized Image */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Optimized Image Test</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Valid Image</p>
            <OptimizedImage
              src="https://via.placeholder.com/300x200"
              alt="Test image"
              className="w-full h-48 rounded"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Invalid Image (will show fallback)</p>
            <OptimizedImage
              src="https://invalid-url-that-will-fail.com/image.jpg"
              alt="Invalid image"
              className="w-full h-48 rounded"
            />
          </div>
        </div>
      </div>

      {/* Test Error Boundary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Error Boundary Test</h3>
        <button
          onClick={testError}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Trigger Test Error
        </button>
        <p className="text-sm text-gray-600">
          Click the button above to test the Error Boundary component.
        </p>
      </div>
    </div>
  );
};

export default TestQuickWins; 