import React from 'react';

function computeStatus(item) {
  const now = new Date();
  if (item.expiry_date) {
    const expiry = new Date(item.expiry_date);
    if (expiry < now) return 'Expired';
    else if ((expiry - now) / (1000 * 60 * 60 * 24) <= 7) return 'Expiring Soon';
  }
  if (item.quantity <= item.reorder_threshold) return 'Low Stock';
  return 'OK';
}

function Dashboard({ items, loading, error }) {
  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-gray-500 text-lg">📊 Loading dashboard...</div>
    </div>
  );
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <p className="text-red-700">⚠️ {error}</p>
    </div>
  );

  const now = new Date();
  const expiringSoon = items.filter(item => item.expiry_date && new Date(item.expiry_date) > now && (new Date(item.expiry_date) - now) / (1000 * 60 * 60 * 24) <= 7);
  const expired = items.filter(item => item.expiry_date && new Date(item.expiry_date) < now);
  const lowStock = items.filter(item => item.quantity <= item.reorder_threshold);
  const totalItems = items.length;
  const consumedBeforeExpiry = items.filter(item => {
    if (!item.expiry_date) return true;
    const expiry = new Date(item.expiry_date);
    return expiry > now && item.quantity > item.reorder_threshold;
  }).length;
  const sustainabilityScore = totalItems ? Math.round((consumedBeforeExpiry / totalItems) * 100) : 0;

  const topExpiring = [...expiringSoon].sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date)).slice(0, 5);
  const topLowStock = [...lowStock].sort((a, b) => a.quantity - b.quantity).slice(0, 5);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">📊</div>
        <div className="text-gray-600 text-lg font-semibold">Loading dashboard...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-6 rounded-xl">
      <p className="text-red-700 font-bold">⚠️ {error}</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Page Title */}
      <div className="mb-12">
        <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Real-time inventory insights and sustainability metrics</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        
        {/* Total Items */}
        <div className="card-shadow bg-white rounded-2xl p-6 border border-gray-100 group hover:border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">📦</span>
            </div>
            <span className="text-3xl font-black text-blue-600">{totalItems}</span>
          </div>
          <p className="text-gray-600 font-semibold">Total Items</p>
          <p className="text-xs text-gray-500 mt-2">Across all categories</p>
        </div>

        {/* Expiring Soon */}
        <div className="card-shadow bg-white rounded-2xl p-6 border border-gray-100 group hover:border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">⏰</span>
            </div>
            <span className="text-3xl font-black text-yellow-600">{expiringSoon.length}</span>
          </div>
          <p className="text-gray-600 font-semibold">Expiring Soon</p>
          <p className="text-xs text-gray-500 mt-2">Within 7 days</p>
        </div>

        {/* Low Stock */}
        <div className="card-shadow bg-white rounded-2xl p-6 border border-gray-100 group hover:border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">📉</span>
            </div>
            <span className="text-3xl font-black text-orange-600">{lowStock.length}</span>
          </div>
          <p className="text-gray-600 font-semibold">Low Stock</p>
          <p className="text-xs text-gray-500 mt-2">Below reorder level</p>
        </div>

        {/* Sustainability Score */}
        <div className="card-shadow bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 border border-green-500 text-white group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">♻️</span>
            </div>
            <span className="text-3xl font-black">{sustainabilityScore}%</span>
          </div>
          <p className="font-semibold">Sustainability</p>
          <p className="text-xs text-green-100 mt-2">Waste reduction score</p>
        </div>

        {/* Expired Items */}
        <div className="card-shadow bg-white rounded-2xl p-6 border border-gray-100 group hover:border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">❌</span>
            </div>
            <span className="text-3xl font-black text-red-600">{expired.length}</span>
          </div>
          <p className="text-gray-600 font-semibold">Expired</p>
          <p className="text-xs text-gray-500 mt-2">Need removal</p>
        </div>
      </div>

      {/* Detail Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Expiring Soon List */}
        <div className="card-shadow bg-white rounded-2xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">⏰</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Expiring Soonest</h3>
              <p className="text-sm text-gray-500">Action required</p>
            </div>
          </div>
          <div className="space-y-3">
            {topExpiring.length ? (
              topExpiring.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 group hover:bg-yellow-50 p-2 rounded-lg transition">
                  <span className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-yellow-700 font-medium">{item.expiry_date}</p>
                  </div>
                  <span className="text-yellow-600 font-bold whitespace-nowrap text-sm">{item.quantity} {item.unit}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">✨</p>
                <p className="text-gray-500">No items expiring soon</p>
                <p className="text-xs text-gray-400 mt-1">Great job maintaining stock!</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock List */}
        <div className="card-shadow bg-white rounded-2xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📉</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Low Stock Items</h3>
              <p className="text-sm text-gray-500">Reorder recommended</p>
            </div>
          </div>
          <div className="space-y-4">
            {topLowStock.length ? (
              topLowStock.map((item, idx) => {
                const percentage = Math.min((item.quantity / item.reorder_threshold) * 100, 100);
                return (
                  <div key={item.id} className="group hover:bg-orange-50 p-3 rounded-lg transition">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-orange-700 font-medium">{item.quantity}/{item.reorder_threshold}</p>
                      </div>
                    </div>
                    <div className="ml-10 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full transition-all duration-500"
                        style={{ width: percentage + '%' }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">✨</p>
                <p className="text-gray-500">All items well-stocked</p>
                <p className="text-xs text-gray-400 mt-1">Inventory is healthy!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
