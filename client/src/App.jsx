import React, { useEffect, useState } from 'react';
import InventoryTable from './components/InventoryTable';
import Dashboard from './components/Dashboard';
import AIInsightPanel from './components/AIInsightPanel';
import SearchFilterBar from './components/SearchFilterBar';
import AddItemForm from './components/AddItemForm';
import EditItemModal from './components/EditItemModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
    const [tab, setTab] = useState('Dashboard');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ category: '', status: '' });
    const [editItem, setEditItem] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Fetch inventory
    const fetchItems = async (params = {}) => {
        setLoading(true);
        setError(null);
        let url = `${API_URL}/api/inventory`;
        const query = [];
        if (params.search) query.push(`search=${encodeURIComponent(params.search)}`);
        if (params.category) query.push(`category=${encodeURIComponent(params.category)}`);
        if (params.status) query.push(`status=${encodeURIComponent(params.status)}`);
        if (query.length) url += '?' + query.join('&');
        try {
            const res = await fetch(url);
            const json = await res.json();
            if (json.success) setItems(json.data);
            else setError(json.error);
        } catch (e) {
            setError('Failed to fetch inventory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems({ search, category: filters.category, status: filters.status });
        // eslint-disable-next-line
    }, [search, filters]);

    const tabs = [
        { id: 'Dashboard', label: 'Dashboard', icon: '📊', color: 'from-blue-500 to-cyan-500' },
        { id: 'Inventory', label: 'Inventory', icon: '📦', color: 'from-green-500 to-emerald-500' },
        { id: 'AI Insights', label: 'AI Insights', icon: '🤖', color: 'from-purple-500 to-pink-500' },
    ];

    const currentTab = tabs.find(t => t.id === tab);

    const renderTab = () => {
        if (tab === 'Inventory') {
            return (
                <div className="animate-fade-in">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Inventory Management
                            </h2>
                            <p className="text-gray-600 mt-2">Track and manage your items efficiently</p>
                        </div>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg flex items-center gap-2 btn-premium"
                        >
                            <span className="text-xl">➕</span> {showAddForm ? 'Cancel' : 'Add Item'}
                        </button>
                    </div>
                    {showAddForm && (
                        <div className="mb-8 animate-slide-down">
                            <div className="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl shadow-lg border border-green-100">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <span>✨</span> Add New Item with AI Magic
                                </h3>
                                <AddItemForm
                                    onSuccess={() => {
                                        fetchItems({ search, category: filters.category, status: filters.status });
                                        setShowAddForm(false);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    <SearchFilterBar
                        search={search}
                        setSearch={setSearch}
                        filters={filters}
                        setFilters={setFilters}
                    />
                    <InventoryTable
                        items={items}
                        loading={loading}
                        error={error}
                        onEdit={item => setEditItem(item)}
                        onRefresh={() => fetchItems({ search, category: filters.category, status: filters.status })}
                    />
                    {editItem && (
                        <EditItemModal
                            item={editItem}
                            onClose={() => setEditItem(null)}
                            onSuccess={() => {
                                setEditItem(null);
                                fetchItems({ search, category: filters.category, status: filters.status });
                            }}
                        />
                    )}
                </div>
            );
        }
        if (tab === 'Dashboard') {
            return <Dashboard items={items} loading={loading} error={error} />;
        }
        if (tab === 'AI Insights') {
            return <AIInsightPanel items={items} />;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50">
            {/* Premium Header */}
            <header className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        {/* Logo & Title */}
                        <div className="flex items-center gap-4">
                            <div className="text-5xl animate-float">🌱</div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">Green-Tech</h1>
                                <p className="text-cyan-100 text-sm font-medium">Intelligent Asset Management</p>
                            </div>
                        </div>

                        {/* Premium Tab Navigation */}
                        <nav className="flex gap-2 bg-white/10 p-1 rounded-xl backdrop-blur-md border border-white/20">
                            {tabs.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${tab === t.id
                                            ? 'bg-white text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 shadow-xl scale-105'
                                            : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    <span className="text-xl mr-2">{t.icon}</span>{t.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                {error && (
                    <div className="mb-8 animate-slide-down bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-6 rounded-xl shadow-lg">
                        <p className="text-red-700 font-bold text-lg">⚠️ Error</p>
                        <p className="text-red-600">{error}</p>
                    </div>
                )}
                {renderTab()}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 mt-16">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="text-white font-bold mb-3">Green-Tech</h3>
                            <p className="text-sm text-gray-400">Sustainable inventory management for the modern world</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-3">Features</h3>
                            <ul className="text-sm text-gray-400 space-y-2">
                                <li>📊 Real-time Analytics</li>
                                <li>🤖 AI Insights</li>
                                <li>♻️ Sustainability Tracking</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-3">Quick Links</h3>
                            <ul className="text-sm text-gray-400 space-y-2">
                                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition">Support</a></li>
                                <li><a href="#" className="hover:text-white transition">About</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                        <p>© 2026 Green-Tech Inventory Assistant • Powered by AI • Built with ♻️ for Sustainability</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
