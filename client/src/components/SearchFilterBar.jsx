import React, { useState, useEffect } from 'react';

const categories = [
  '', 'Perishable', 'Equipment', 'Chemical', 'Office Supply'
];
const statuses = [
  '', 'Expiring Soon', 'Expired', 'Low Stock', 'OK'
];

function SearchFilterBar({ search, setSearch, filters, setFilters }) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, setSearch]);

  const handleCategory = e => {
    setFilters(f => ({ ...f, category: e.target.value }));
  };
  const handleStatus = e => {
    setFilters(f => ({ ...f, status: e.target.value }));
  };
  const clearFilters = () => {
    setLocalSearch('');
    setFilters({ category: '', status: '' });
    setSearch('');
  };

  return (
    <div className="card-shadow bg-white rounded-2xl p-6 border border-gray-100 mb-8 animate-fade-in">
      {/* Title */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">🔍 Search & Filter</h3>
        <p className="text-sm text-gray-500">Find items quickly by name, category, or status</p>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Search Input */}
        <div className="relative group">
          <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Item Name</label>
          <input
            type="text"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium placeholder-gray-500"
          />
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
        </div>

        {/* Category Select */}
        <div className="relative group">
          <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Category</label>
          <select
            value={filters.category}
            onChange={handleCategory}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-medium appearance-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat ? cat : '📂 All Categories'}</option>
            ))}
          </select>
          <div className="absolute right-4 top-11 pointer-events-none text-gray-500">
            ▼
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
        </div>

        {/* Status Select */}
        <div className="relative group">
          <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Status</label>
          <select
            value={filters.status}
            onChange={handleStatus}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 font-medium appearance-none cursor-pointer"
          >
            {statuses.map(stat => (
              <option key={stat} value={stat}>{stat ? stat : '📊 All Statuses'}</option>
            ))}
          </select>
          <div className="absolute right-4 top-11 pointer-events-none text-gray-500">
            ▼
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          className="btn-premium bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg"
          onClick={clearFilters}
          title="Reset all filters"
        >
          ✕ Clear All
        </button>
      </div>
    </div>
  );
}

export default SearchFilterBar;
