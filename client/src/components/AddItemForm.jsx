import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const categories = ['Perishable', 'Equipment', 'Chemical', 'Office Supply'];

function AddItemForm({ onSuccess }) {
    const [fields, setFields] = useState({
        name: '',
        category: '',
        quantity: '',
        unit: '',
        purchase_date: '',
        expiry_date: '',
        reorder_threshold: '',
        supplier: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSuggested, setAiSuggested] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Validation
    const validate = () => {
        const e = {};
        if (!fields.name || fields.name.length < 2) e.name = 'Name required, min 2 chars';
        if (!fields.quantity || isNaN(fields.quantity) || Number(fields.quantity) <= 0) e.quantity = 'Quantity must be positive';
        if (fields.expiry_date && fields.purchase_date && new Date(fields.expiry_date) < new Date(fields.purchase_date)) e.expiry_date = 'Expiry must be after purchase date';
        if (fields.reorder_threshold && (isNaN(fields.reorder_threshold) || Number(fields.reorder_threshold) <= 0)) e.reorder_threshold = 'Reorder threshold must be positive';
        return e;
    };

    // AI auto-fill
    const handleAIFill = async () => {
        setAiLoading(true);
        setAiSuggested(false);
        try {
            const res = await fetch(`${API_URL}/api/ai/categorize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: fields.name })
            });
            const json = await res.json();
            if (json.success && json.data) {
                setFields(f => ({
                    ...f,
                    category: json.data.category || '',
                    unit: json.data.unit || '',
                    reorder_threshold: json.data.reorder_threshold || ''
                }));
                setAiSuggested(true);
            }
        } catch { }
        setAiLoading(false);
    };

    // Handle field changes
    const handleChange = e => {
        const { name, value } = e.target;
        setFields(f => ({ ...f, [name]: value }));
        setErrors(e => ({ ...e, [name]: undefined }));
    };

    // Submit
    const handleSubmit = async e => {
        e.preventDefault();
        const eObj = validate();
        setErrors(eObj);
        if (Object.keys(eObj).length) return;
        setSubmitLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...fields,
                    quantity: Number(fields.quantity),
                    reorder_threshold: fields.reorder_threshold ? Number(fields.reorder_threshold) : null
                })
            });
            const json = await res.json();
            if (json.success) {
                setFields({
                    name: '', category: '', quantity: '', unit: '', purchase_date: '', expiry_date: '', reorder_threshold: '', supplier: '', notes: ''
                });
                setAiSuggested(false);
                onSuccess && onSuccess();
            } else {
                setErrors({ form: json.error });
            }
        } catch {
            setErrors({ form: 'Failed to add item' });
        }
        setSubmitLoading(false);
    };

    return (
        <form className="card-shadow bg-white rounded-2xl p-8 border border-gray-100 mb-10 animate-fade-in" onSubmit={handleSubmit}>
            {/* Form Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    ➕ Add New Item
                </h2>
                <p className="text-gray-600">Enter item details to add it to your inventory</p>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Name Input with AI Button */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Item Name *</label>
                    <div className="flex gap-2">
                        <input
                            name="name"
                            value={fields.name}
                            onChange={handleChange}
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                            required
                            placeholder="Enter item name..."
                        />
                        <button
                            type="button"
                            className="btn-premium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={handleAIFill}
                            disabled={aiLoading || !fields.name}
                            title="Use AI to auto-fill category and unit"
                        >
                            {aiLoading ? '⏳ Loading...' : '🤖 AI-Fill'}
                        </button>
                        {aiSuggested && <span className="flex items-center text-green-700 font-bold text-sm">✓ Suggested!</span>}
                    </div>
                    {errors.name && <div className="text-red-600 text-xs mt-1 font-semibold">⚠️ {errors.name}</div>}
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Category</label>
                    <select
                        name="category"
                        value={fields.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none"
                    >
                        <option value="">📂 Select category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Quantity *</label>
                    <input
                        name="quantity"
                        value={fields.quantity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        type="number"
                        min="0"
                        required
                        placeholder="0"
                    />
                    {errors.quantity && <div className="text-red-600 text-xs mt-1 font-semibold">⚠️ {errors.quantity}</div>}
                </div>

                {/* Unit */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Unit</label>
                    <input
                        name="unit"
                        value={fields.unit}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="kg, L, box, etc."
                    />
                </div>

                {/* Purchase Date */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Purchase Date</label>
                    <input
                        name="purchase_date"
                        value={fields.purchase_date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        type="date"
                    />
                </div>

                {/* Expiry Date */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Expiry Date</label>
                    <input
                        name="expiry_date"
                        value={fields.expiry_date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        type="date"
                    />
                    {errors.expiry_date && <div className="text-red-600 text-xs mt-1 font-semibold">⚠️ {errors.expiry_date}</div>}
                </div>

                {/* Reorder Threshold */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Reorder Threshold</label>
                    <input
                        name="reorder_threshold"
                        value={fields.reorder_threshold}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        type="number"
                        min="0"
                        placeholder="5"
                    />
                    {errors.reorder_threshold && <div className="text-red-600 text-xs mt-1 font-semibold">⚠️ {errors.reorder_threshold}</div>}
                </div>

                {/* Supplier */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Supplier</label>
                    <input
                        name="supplier"
                        value={fields.supplier}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Supplier name"
                    />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Notes</label>
                    <textarea
                        name="notes"
                        value={fields.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                        rows="3"
                        placeholder="Add any notes about this item..."
                    />
                </div>
            </div>

            {/* Form Error */}
            {errors.form && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-semibold">
                    ⚠️ {errors.form}
                </div>
            )}

            {/* Action Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="btn-premium bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={submitLoading}
                >
                    {submitLoading ? '⏳ Adding...' : '✓ Add Item'}
                </button>
            </div>
        </form>
    );
}

export default AddItemForm;
