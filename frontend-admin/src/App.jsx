import React, { useState, useEffect } from 'react';
import Login from './Auth/Login';
import UploadForm from './Auth/UploadForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

 
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Login setToken={setToken} />
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header bar for Admin */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-sm"
        >
          Logout
        </button>
      </nav>

      <main className="container mx-auto px-4">
        {/* Aapka UploadForm.jsx yahan sara kaam sambhaal lega (Upload + List + Delete) */}
        <UploadForm />
      </main>
    </div>
  );
}

export default App;