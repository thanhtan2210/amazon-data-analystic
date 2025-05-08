"use client";
import React, { useEffect, useState } from 'react';

interface Supplier {
  supplierId: number;
  companyName: string;
  representativeName?: string;
  phoneNumber?: string;
  email?: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ companyName: '', representativeName: '', email: '' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState<Supplier>({
    supplierId: 0, companyName: '', representativeName: '', phoneNumber: '', email: ''
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/suppliers`;
    const params = [];
    if (filter.companyName) params.push(`companyName=${encodeURIComponent(filter.companyName)}`);
    if (filter.representativeName) params.push(`representativeName=${encodeURIComponent(filter.representativeName)}`);
    if (filter.email) params.push(`email=${encodeURIComponent(filter.email)}`);
    if (params.length) url += '/filter?' + params.join('&');
    const res = await fetch(url);
    const data = await res.json();
    setSuppliers(data);
    setLoading(false);
  };

  useEffect(() => { fetchSuppliers(); }, [filter]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ supplierId: 0, companyName: '', representativeName: '', phoneNumber: '', email: '' });
    setShowModal(true);
  };

  const handleEdit = (sup: Supplier) => {
    setEditing(sup);
    setForm(sup);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers/${id}`, { method: 'DELETE' });
    await fetchSuppliers();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers/${editing.supplierId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    await fetchSuppliers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleAdd}>+ Add Supplier</button>
      </div>
      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Company name"
          className="px-3 py-2 border rounded-lg"
          value={filter.companyName}
          onChange={e => setFilter(f => ({ ...f, companyName: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Representative name"
          className="px-3 py-2 border rounded-lg"
          value={filter.representativeName}
          onChange={e => setFilter(f => ({ ...f, representativeName: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Email"
          className="px-3 py-2 border rounded-lg"
          value={filter.email}
          onChange={e => setFilter(f => ({ ...f, email: e.target.value }))}
        />
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={() => setFilter({ companyName: '', representativeName: '', email: '' })}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Representative</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
            ) : suppliers.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No suppliers found.</td></tr>
            ) : (
              suppliers.map(sup => (
                <tr key={sup.supplierId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{sup.supplierId}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{sup.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sup.representativeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sup.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sup.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-blue-600 hover:underline mr-3" onClick={() => handleEdit(sup)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(sup.supplierId)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              {editing ? 'Edit Supplier' : 'Add Supplier'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="companyName" className="block mb-2">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={form.companyName}
                  onChange={(e) => setForm(f => ({ ...f, companyName: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="representativeName" className="block mb-2">Representative Name</label>
                <input
                  type="text"
                  id="representativeName"
                  name="representativeName"
                  value={form.representativeName}
                  onChange={(e) => setForm(f => ({ ...f, representativeName: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block mb-2">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={(e) => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                  {editing ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 ml-2">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 