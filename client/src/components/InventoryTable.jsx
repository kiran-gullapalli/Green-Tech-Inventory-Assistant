import React, { useState } from 'react';

const statusConfig = {
  'Expired': { icon: '❌', bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700', borderColor: 'border-red-200' },
  'Expiring Soon': { icon: '⏰', bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700', borderColor: 'border-yellow-200' },
  'Low Stock': { icon: '📉', bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700', borderColor: 'border-orange-200' },
  'OK': { icon: '✅', bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700', borderColor: 'border-green-200' }
};

function InventoryTable({ items, loading, error, onEdit, onRefresh }) {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">📦</div>
        <div className="text-gray-600 text-lg font-semibold">Loading inventory...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-6 rounded-xl">
      <p className="text-red-700 font-bold">⚠️ {error}</p>
    </div>
  );
  
  if (!items.length) return (
    <div className="card-shadow bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-12 text-center">
      <p className="text-5xl mb-4">📭</p>
      <p className="text-blue-700 font-bold text-xl">No items found</p>
      <p className="text-blue-600 text-sm mt-2">Add your first item to get started</p>
    </div>
  );

  const sortedItems = [...items].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortBy === 'quantity') cmp = a.quantity - b.quantity;
    else if (sortBy === 'expiry') cmp = new Date(a.expiry_date || '9999') - new Date(b.expiry_date || '9999');
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          onRefresh();
        }
      } catch (e) {
        alert('Failed to delete item');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Table Header Title */}
      <div className="mb-8">
        <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Inventory Items
        </h2>
        <p className="text-gray-600">Manage and track all your items</p>
      </div>

      {/* Table Container */}
      <div className="card-shadow bg-white rounded-2xl overflow-hidden border border-gray-100">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 text-white sticky top-0 z-10">
              <tr className="text-sm md:text-base">
                <th 
                  className="px-6 py-4 text-left font-black cursor-pointer hover:bg-white/10 transition-colors group"
                  onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                >
                  <div className="flex items-center gap-2">
                    <span>📦</span>
                    <span>Item Name</span>
                    <span className="text-xs group-hover:scale-125 transition-transform">
                      {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-black">Category</th>
                <th 
                  className="px-6 py-4 text-left font-black cursor-pointer hover:bg-white/10 transition-colors group"
                  onClick={() => { setSortBy('quantity'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                >
                  <div className="flex items-center gap-2">
                    <span>Qty</span>
                    <span className="text-xs group-hover:scale-125 transition-transform">
                      {sortBy === 'quantity' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-black">Unit</th>
                <th 
                  className="px-6 py-4 text-left font-black cursor-pointer hover:bg-white/10 transition-colors group"
                  onClick={() => { setSortBy('expiry'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                >
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>Expiry</span>
                    <span className="text-xs group-hover:scale-125 transition-transform">
                      {sortBy === 'expiry' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-black">Status</th>
                <th className="px-6 py-4 text-center font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedItems.map((item, idx) => {
                const config = statusConfig[item.status] || statusConfig['OK'];
                return (
                  <tr 
                    key={item.id} 
                    className={`group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors duration-200 ${idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}
                  >
                    <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {item.category || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-bold text-lg">{item.quantity}</td>
                    <td className="px-6 py-4 text-gray-700">{item.unit || '—'}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{item.expiry_date ? item.expiry_date : '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${config.badge} border-current`}>
                        {config.icon} {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(item)}
                          className="btn-premium bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
                          title="Edit item"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="btn-premium bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
                          title="Delete item"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <p className="text-gray-700 font-bold">Showing <span className="text-gradient-text">{sortedItems.length}</span> of <span className="text-gradient-text">{items.length}</span> items</p>
          <button
            onClick={onRefresh}
            className="btn-premium bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-5 py-2 rounded-lg font-bold transition-all hover:scale-105"
            title="Refresh inventory"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

export default InventoryTable;
