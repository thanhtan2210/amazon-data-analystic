"use client";
import React, { useEffect, useState } from 'react';

interface Warehouse {
  warehouseId: number;
  warehouseName: string;
  area?: number;
  capacity?: number;
  status?: string;
  phoneNumber?: string;
  stockQuantity?: number;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', status: '', minArea: '', maxArea: '', minCapacity: '', maxCapacity: '' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Warehouse | null>(null);
  const [form, setForm] = useState<Warehouse>({
    warehouseId: 0, warehouseName: '', area: 0, capacity: 0, status: '', phoneNumber: '', stockQuantity: 0
  });

  const fetchWarehouses = async () => {
    setLoading(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/warehouses`;
    const params = [];
    if (filter.name) params.push(`name=${encodeURIComponent(filter.name)}`);
    if (filter.status) params.push(`status=${encodeURIComponent(filter.status)}`);
    if (filter.minArea) params.push(`minArea=${filter.minArea}`);
    if (filter.maxArea) params.push(`maxArea=${filter.maxArea}`);
    if (filter.minCapacity) params.push(`minCapacity=${filter.minCapacity}`);
    if (filter.maxCapacity) params.push(`maxCapacity=${filter.maxCapacity}`);
    if (params.length) url += '/filter?' + params.join('&');
    const res = await fetch(url);
    const data = await res.json();
    setWarehouses(Array.isArray(data) ? data : data.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchWarehouses(); }, [filter]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ warehouseId: 0, warehouseName: '', area: 0, capacity: 0, status: '', phoneNumber: '', stockQuantity: 0 });
    setShowModal(true);
  };

  const handleEdit = (wh: Warehouse) => {
    setEditing(wh);
    setForm(wh);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/warehouses/${id}`, { method: 'DELETE' });
    await fetchWarehouses();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/warehouses/${editing.warehouseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/warehouses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    await fetchWarehouses();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Warehouses</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleAdd}>+ Add Warehouse</button>
      </div>
      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Warehouse name"
          className="px-3 py-2 border rounded-lg"
          value={filter.name}
          onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Status"
          className="px-3 py-2 border rounded-lg"
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Min area"
          className="px-3 py-2 border rounded-lg w-32"
          value={filter.minArea}
          onChange={e => setFilter(f => ({ ...f, minArea: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Max area"
          className="px-3 py-2 border rounded-lg w-32"
          value={filter.maxArea}
          onChange={e => setFilter(f => ({ ...f, maxArea: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Min capacity"
          className="px-3 py-2 border rounded-lg w-32"
          value={filter.minCapacity}
          onChange={e => setFilter(f => ({ ...f, minCapacity: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Max capacity"
          className="px-3 py-2 border rounded-lg w-32"
          value={filter.maxCapacity}
          onChange={e => setFilter(f => ({ ...f, maxCapacity: e.target.value }))}
        />
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={() => setFilter({ name: '', status: '', minArea: '', maxArea: '', minCapacity: '', maxCapacity: '' })}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Qty</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8">Loading...</td></tr>
            ) : warehouses.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">No warehouses found.</td></tr>
            ) : (
              warehouses.map(wh => (
                <tr key={wh.warehouseId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{wh.warehouseId}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{wh.warehouseName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{wh.area}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{wh.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{wh.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{wh.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{wh.stockQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-blue-600 hover:underline mr-3" onClick={() => handleEdit(wh)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(wh.warehouseId)}>Delete</button>
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
            <h2 className="text-2xl font-bold mb-4">{editing ? 'Edit Warehouse' : 'Add Warehouse'}</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-1 font-medium">Warehouse Name</label>
              <input type="text" id="warehouseName" name="warehouseName" value={form.warehouseName} onChange={(e) => setForm(f => ({ ...f, warehouseName: e.target.value }))} className="mb-3 w-full border rounded px-3 py-2" />
              <label className="block mb-1 font-medium">Area</label>
              <input type="number" id="area" name="area" value={form.area} onChange={(e) => setForm(f => ({ ...f, area: Number(e.target.value) }))} className="mb-3 w-full border rounded px-3 py-2" />
              <label className="block mb-1 font-medium">Capacity</label>
              <input type="number" id="capacity" name="capacity" value={form.capacity} onChange={(e) => setForm(f => ({ ...f, capacity: Number(e.target.value) }))} className="mb-3 w-full border rounded px-3 py-2" />
              <label className="block mb-1 font-medium">Status</label>
              <input type="text" id="status" name="status" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))} className="mb-3 w-full border rounded px-3 py-2" />
              <label className="block mb-1 font-medium">Phone Number</label>
              <input type="text" id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={(e) => setForm(f => ({ ...f, phoneNumber: e.target.value }))} className="mb-3 w-full border rounded px-3 py-2" />
              <label className="block mb-1 font-medium">Stock Quantity</label>
              <input type="number" id="stockQuantity" name="stockQuantity" value={form.stockQuantity} onChange={(e) => setForm(f => ({ ...f, stockQuantity: Number(e.target.value) }))} className="mb-3 w-full border rounded px-3 py-2" />
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">{editing ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 ml-2">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 