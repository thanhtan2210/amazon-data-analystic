"use client";

import React, { useEffect, useState } from 'react';

interface Customer {
  customerId: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  signupDate?: string;
  street?: string;
  district?: string;
  postalNumber?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', email: '', district: '' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<Customer>({
    customerId: 0, customerName: '', email: '', phoneNumber: '', signupDate: '', street: '', district: '', postalNumber: ''
  });

  // Tách hàm fetchCustomers ra ngoài để dùng lại
  const fetchCustomers = async () => {
    setLoading(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/customers`;
    const params = [];
    if (filter.name) params.push(`name=${encodeURIComponent(filter.name)}`);
    if (filter.email) params.push(`email=${encodeURIComponent(filter.email)}`);
    if (filter.district) params.push(`district=${encodeURIComponent(filter.district)}`);
    if (params.length) url += '/filter?' + params.join('&');
    const res = await fetch(url);
    const data = await res.json();
    setCustomers(data);
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, [filter]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ customerId: 0, customerName: '', email: '', phoneNumber: '', signupDate: '', street: '', district: '', postalNumber: '' });
    setShowModal(true);
  };

  const handleEdit = (cus: Customer) => {
    setEditing(cus);
    setForm(cus);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, { method: 'DELETE' });
    await fetchCustomers();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${editing.customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    await fetchCustomers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleAdd}>+ Add Customer</button>
      </div>
      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Customer name"
          className="px-3 py-2 border rounded-lg"
          value={filter.name}
          onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Email"
          className="px-3 py-2 border rounded-lg"
          value={filter.email}
          onChange={e => setFilter(f => ({ ...f, email: e.target.value }))}
        />
        <input
          type="text"
          placeholder="District"
          className="px-3 py-2 border rounded-lg"
          value={filter.district}
          onChange={e => setFilter(f => ({ ...f, district: e.target.value }))}
        />
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={() => setFilter({ name: '', email: '', district: '' })}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No customers found.</td></tr>
            ) : (
              customers.map(customer => (
                <tr key={customer.customerId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{customer.customerId}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{customer.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.district}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-blue-600 hover:underline mr-3" onClick={() => handleEdit(customer)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(customer.customerId)}>Delete</button>
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
            <h2 className="text-2xl font-bold mb-4">{editing ? "Edit Customer" : "Add Customer"}</h2>
            <label className="block mb-1 font-medium">Customer Name</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Customer Name" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required />
            <label className="block mb-1 font-medium">Email</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <label className="block mb-1 font-medium">Phone Number</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Phone Number" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
            <label className="block mb-1 font-medium">District</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="District" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} />
            <label className="block mb-1 font-medium">Street</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Street" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
            <label className="block mb-1 font-medium">Postal Number</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Postal Number" value={form.postalNumber} onChange={e => setForm({ ...form, postalNumber: e.target.value })} />
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