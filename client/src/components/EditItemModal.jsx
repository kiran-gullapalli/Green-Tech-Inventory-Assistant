import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const categories = ['Perishable', 'Equipment', 'Chemical', 'Office Supply'];

function EditItemModal({ item, onClose, onSuccess }) {
  const [fields, setFields] = useState({ ...item });
  const [errors, setErrors] = useState({});
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
      const res = await fetch(`${API_URL}/api/inventory/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          quantity: Number(fields.quantity),
          reorder_threshold: fields.reorder_threshold ? Number(fields.reorder_threshold) : null
        })
      });
      const json = await res.json();
      if (json.success) {
        onSuccess && onSuccess();
      } else {
        setErrors({ form: json.error });
      }
    } catch {
      setErrors({ form: 'Failed to update item' });
    }
    setSubmitLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <form className="card-shadow bg-white rounded-2xl p-8 max-w-2xl w-full relative border border-gray-100 animate-slide-up" onSubmit={handleSubmit}>
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-light hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            ✏️ Edit Item
          </h2>
          <p className="text-gray-600 text-sm mt-2">Update the item details below</p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Name *</label>
            <input
              name="name"
              value={fields.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            />
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
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="number"
              min="0"
              required
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
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Purchase Date</label>
            <input
              name="purchase_date"
              value={fields.purchase_date || ''}
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
              value={fields.expiry_date || ''}
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
              value={fields.reorder_threshold || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="number"
              min="0"
            />
            {errors.reorder_threshold && <div className="text-red-600 text-xs mt-1 font-semibold">⚠️ {errors.reorder_threshold}</div>}
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Supplier</label>
            <input
              name="supplier"
              value={fields.supplier || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Notes</label>
          <textarea
            name="notes"
            value={fields.notes || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
            rows="4"
          />
        </div>

        {/* Form Error */}
        {errors.form && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-semibold">
            ⚠️ {errors.form}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-6 py-3 rounded-xl font-bold text-gray-700 border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-premium bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitLoading}
          >
            {submitLoading ? '💾 Saving...' : '✓ Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditItemModal;
