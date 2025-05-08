"use client";
import React, { useEffect, useState } from 'react';

interface Order {
  orderId: number;
  orderDate?: string;
  orderStatus?: string;
  quantity: number;
  customerId: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', customerId: '', fromDate: '', toDate: '' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [form, setForm] = useState<Order>({
    orderId: 0, orderDate: '', orderStatus: '', quantity: 0, customerId: 0
  });

  const fetchOrders = async () => {
    setLoading(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/orders`;
    const params = [];
    if (filter.status) params.push(`status=${encodeURIComponent(filter.status)}`);
    if (filter.customerId) params.push(`customerId=${filter.customerId}`);
    if (filter.fromDate) params.push(`fromDate=${filter.fromDate}`);
    if (filter.toDate) params.push(`toDate=${filter.toDate}`);
    if (params.length) url += '/filter?' + params.join('&');
    const res = await fetch(url);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ orderId: 0, orderDate: '', orderStatus: '', quantity: 0, customerId: 0 });
    setShowModal(true);
  };

  const handleEdit = (order: Order) => {
    setEditing(order);
    setForm(order);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, { method: 'DELETE' });
    await fetchOrders();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${editing.orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    await fetchOrders();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleAdd}>+ Add Order</button>
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
          type="number"
          placeholder="Customer ID"
          className="px-3 py-2 border rounded-lg w-32"
          value={filter.customerId}
          onChange={e => setFilter(f => ({ ...f, customerId: e.target.value }))}
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
          onClick={() => setFilter({ status: '', customerId: '', fromDate: '', toDate: '' })}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer ID</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No orders found.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{order.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.orderDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.orderStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.customerId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-blue-600 hover:underline mr-3" onClick={() => handleEdit(order)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(order.orderId)}>Delete</button>
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
            <h2 className="text-2xl font-bold mb-4">{editing ? "Edit Order" : "Add Order"}</h2>
            <label className="block mb-1 font-medium">Order Date</label>
            <input className="mb-3 w-full border rounded px-3 py-2" type="date" placeholder="Order Date" value={form.orderDate} onChange={e => setForm({ ...form, orderDate: e.target.value })} required />
            <label className="block mb-1 font-medium">Status</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Status" value={form.orderStatus} onChange={e => setForm({ ...form, orderStatus: e.target.value })} />
            <label className="block mb-1 font-medium">Quantity</label>
            <input className="mb-3 w-full border rounded px-3 py-2" type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} />
            <label className="block mb-1 font-medium">Customer ID</label>
            <input className="mb-3 w-full border rounded px-3 py-2" type="number" placeholder="Customer ID" value={form.customerId} onChange={e => setForm({ ...form, customerId: Number(e.target.value) })} />
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