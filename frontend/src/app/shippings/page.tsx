"use client";
import React, { useEffect, useState } from 'react';

interface Shipping {
  shippingId: number;
  cost: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  trackingNumber?: string;
  carrierName?: string;
  transportMode?: string;
  shippingStreet?: string;
  shippingDistrict?: string;
  shippingPostalNumber?: string;
  orderId?: number;
}

export default function ShippingsPage() {
  const [shippings, setShippings] = useState<Shipping[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', carrier: '', mode: '', fromDate: '', toDate: '' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Shipping | null>(null);
  const [form, setForm] = useState<Shipping>({
    shippingId: 0, cost: 0, startDate: '', endDate: '', status: '', trackingNumber: '', carrierName: '', transportMode: '', shippingStreet: '', shippingDistrict: '', shippingPostalNumber: '', orderId: 0
  });

  const fetchShippings = async () => {
    setLoading(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/shippings`;
    const params = [];
    if (filter.status) params.push(`status=${encodeURIComponent(filter.status)}`);
    if (filter.carrier) params.push(`carrier=${encodeURIComponent(filter.carrier)}`);
    if (filter.mode) params.push(`mode=${encodeURIComponent(filter.mode)}`);
    if (filter.fromDate) params.push(`fromDate=${filter.fromDate}`);
    if (filter.toDate) params.push(`toDate=${filter.toDate}`);
    if (params.length) url += '/filter?' + params.join('&');
    const res = await fetch(url);
    const data = await res.json();
    setShippings(data);
    setLoading(false);
  };

  useEffect(() => { fetchShippings(); }, [filter]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ shippingId: 0, cost: 0, startDate: '', endDate: '', status: '', trackingNumber: '', carrierName: '', transportMode: '', shippingStreet: '', shippingDistrict: '', shippingPostalNumber: '', orderId: 0 });
    setShowModal(true);
  };

  const handleEdit = (ship: Shipping) => {
    setEditing(ship);
    setForm(ship);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shippings/${id}`, { method: 'DELETE' });
    await fetchShippings();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shippings/${editing.shippingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shippings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    await fetchShippings();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Shippings</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleAdd}>+ Add Shipping</button>
      </div>
      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Status"
          className="px-3 py-2 border rounded-lg"
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Carrier"
          className="px-3 py-2 border rounded-lg"
          value={filter.carrier}
          onChange={e => setFilter(f => ({ ...f, carrier: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Mode"
          className="px-3 py-2 border rounded-lg"
          value={filter.mode}
          onChange={e => setFilter(f => ({ ...f, mode: e.target.value }))}
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
          onClick={() => setFilter({ status: '', carrier: '', mode: '', fromDate: '', toDate: '' })}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={10} className="text-center py-8">Loading...</td></tr>
            ) : shippings.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-8 text-gray-400">No shippings found.</td></tr>
            ) : (
              shippings.map(ship => (
                <tr key={ship.shippingId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{ship.shippingId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ship.cost}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ship.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ship.carrierName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ship.transportMode}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ship.trackingNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ship.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ship.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ship.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-blue-600 hover:underline mr-3" onClick={() => handleEdit(ship)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(ship.shippingId)}>Delete</button>
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
            <h2 className="text-2xl font-bold mb-4">{editing ? "Edit Shipping" : "Add Shipping"}</h2>
            <label className="block mb-1 font-medium">Cost</label>
            <input className="mb-3 w-full border rounded px-3 py-2" type="number" placeholder="Cost" value={form.cost} onChange={e => setForm({ ...form, cost: Number(e.target.value) })} required />
            <label className="block mb-1 font-medium">Status</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} />
            <label className="block mb-1 font-medium">Carrier Name</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Carrier Name" value={form.carrierName} onChange={e => setForm({ ...form, carrierName: e.target.value })} />
            <label className="block mb-1 font-medium">Mode</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Mode" value={form.transportMode} onChange={e => setForm({ ...form, transportMode: e.target.value })} />
            <label className="block mb-1 font-medium">Tracking Number</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Tracking Number" value={form.trackingNumber} onChange={e => setForm({ ...form, trackingNumber: e.target.value })} />
            <label className="block mb-1 font-medium">Start Date</label>
            <input className="mb-3 w-full border rounded px-3 py-2" type="date" placeholder="Start Date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            <label className="block mb-1 font-medium">End Date</label>
            <input className="mb-3 w-full border rounded px-3 py-2" type="date" placeholder="End Date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            <label className="block mb-1 font-medium">Street</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Street" value={form.shippingStreet} onChange={e => setForm({ ...form, shippingStreet: e.target.value })} />
            <label className="block mb-1 font-medium">District</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="District" value={form.shippingDistrict} onChange={e => setForm({ ...form, shippingDistrict: e.target.value })} />
            <label className="block mb-1 font-medium">Postal Number</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Postal Number" value={form.shippingPostalNumber} onChange={e => setForm({ ...form, shippingPostalNumber: e.target.value })} />
            <label className="block mb-1 font-medium">Order ID</label>
            <input className="mb-3 w-full border rounded px-3 py-2" type="number" placeholder="Order ID" value={form.orderId} onChange={e => setForm({ ...form, orderId: Number(e.target.value) })} />
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