"use client";
import React, { useEffect, useState } from 'react';

interface Discount {
  discountId: number;
  discountName?: string;
  discountType?: string;
  discountValue: number;
  startDate?: string;
  endDate?: string;
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', type: '', fromDate: '', toDate: '' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [form, setForm] = useState<Discount>({
    discountId: 0, discountName: '', discountType: '', discountValue: 0, startDate: '', endDate: ''
  });

  const fetchDiscounts = async () => {
    setLoading(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/discounts`;
    const params = [];
    if (filter.name) params.push(`name=${encodeURIComponent(filter.name)}`);
    if (filter.type) params.push(`type=${encodeURIComponent(filter.type)}`);
    if (filter.fromDate) params.push(`fromDate=${filter.fromDate}`);
    if (filter.toDate) params.push(`toDate=${filter.toDate}`);
    if (params.length) url += '/filter?' + params.join('&');
    const res = await fetch(url);
    const data = await res.json();
    setDiscounts(data);
    setLoading(false);
  };

  useEffect(() => { fetchDiscounts(); }, [filter]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ discountId: 0, discountName: '', discountType: '', discountValue: 0, startDate: '', endDate: '' });
    setShowModal(true);
  };

  const handleEdit = (discount: Discount) => {
    setEditing(discount);
    setForm(discount);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discounts/${id}`, { method: 'DELETE' });
    await fetchDiscounts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discounts/${editing.discountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    await fetchDiscounts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Discounts</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleAdd}>+ Add Discount</button>
      </div>
      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Discount name"
          className="px-3 py-2 border rounded-lg"
          value={filter.name}
          onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Type"
          className="px-3 py-2 border rounded-lg"
          value={filter.type}
          onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
        />
        <input
          type="date"
          placeholder="From date"
          className="px-3 py-2 border rounded-lg"
          value={filter.fromDate}
          onChange={e => setFilter(f => ({ ...f, fromDate: e.target.value }))}
        />
        <input
          type="date"
          placeholder="To date"
          className="px-3 py-2 border rounded-lg"
          value={filter.toDate}
          onChange={e => setFilter(f => ({ ...f, toDate: e.target.value }))}
        />
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={() => setFilter({ name: '', type: '', fromDate: '', toDate: '' })}
        >
          Clear
        </button>
      </div>
      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
            ) : discounts.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No discounts found.</td></tr>
            ) : (
              discounts.map(discount => (
                <tr key={discount.discountId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{discount.discountId}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{discount.discountName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{discount.discountType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{discount.discountValue}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{discount.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{discount.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-blue-600 hover:underline mr-3" onClick={() => handleEdit(discount)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(discount.discountId)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded-lg" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">{editing ? "Edit Discount" : "Add Discount"}</h2>
            <label className="block mb-1 font-medium">Discount Name</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Discount Name" value={form.discountName} onChange={e => setForm({ ...form, discountName: e.target.value })} required />
            <label className="block mb-1 font-medium">Type</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Type" value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} />
            <label className="block mb-1 font-medium">Value</label>
            <input className="mb-3 w-full border rounded px-3 py-2" type="number" placeholder="Value" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })} />
            <label className="block mb-1 font-medium">Start Date</label>
            <input className="mb-3 w-full border rounded px-3 py-2" type="date" placeholder="Start Date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            <label className="block mb-1 font-medium">End Date</label>
            <input className="mb-3 w-full border rounded px-3 py-2" type="date" placeholder="End Date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">{editing ? "Update" : "Add"}</button>
              <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 