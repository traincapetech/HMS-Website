import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const DebugInfo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { doctor, isAuthenticated } = useSelector(state => state.doctor);
  
  // Get all localStorage items
  const getLocalStorageItems = () => {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        // Try to parse as JSON
        items[key] = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        // If not JSON, store as string
        items[key] = localStorage.getItem(key);
      }
    }
    return items;
  };
  
  const localStorageItems = getLocalStorageItems();
  
  // Toggle visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  // Only render in development
  if (window.location.hostname !== 'https://hms-backend-1-pngp.onrender.com' && !window.location.hostname.includes('127.0.0.1')) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={toggleVisibility}
        className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        {isVisible ? 'Hide Debug' : 'Show Debug'}
      </button>
      
      {isVisible && (
        <div className="mt-2 p-4 bg-white border border-gray-300 rounded shadow-lg max-w-md max-h-96 overflow-auto">
          <h3 className="font-bold text-lg mb-2">Debug Information</h3>
          
          <div className="mb-4">
            <h4 className="font-semibold">Redux State:</h4>
            <div className="text-sm">
              <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
              <p><strong>Doctor:</strong> {doctor ? `${doctor.Name} (${doctor.Email})` : 'No doctor in Redux'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold">localStorage:</h4>
            <div className="text-sm">
              {Object.keys(localStorageItems).map(key => (
                <div key={key} className="mb-2">
                  <strong>{key}:</strong> 
                  <pre className="whitespace-pre-wrap break-all bg-gray-100 p-1 mt-1 rounded text-xs">
                    {typeof localStorageItems[key] === 'object' 
                      ? JSON.stringify(localStorageItems[key], null, 2)
                      : localStorageItems[key]}
                  </pre>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-red-600 text-white px-2 py-1 rounded text-sm"
            >
              Clear localStorage & Reload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugInfo; 