"use client";
import React, { useEffect, useState } from 'react';

interface Employee {
  employeeId: number;
  fullName: string;
  department?: string;
  hireDate?: string;
  email?: string;
  phoneNumber?: string;
  salary?: number;
  role?: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', department: '', role: '' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState<Employee>({
    employeeId: 0, fullName: '', department: '', hireDate: '', email: '', phoneNumber: '', salary: 0, role: ''
  });

  useEffect(() => {
    async function fetchEmployees() {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/employees`;
      const params = [];
      if (filter.name) params.push(`name=${encodeURIComponent(filter.name)}`);
      if (filter.department) params.push(`department=${encodeURIComponent(filter.department)}`);
      if (filter.role) params.push(`role=${encodeURIComponent(filter.role)}`);
      if (params.length) url += '/filter?' + params.join('&');
      const res = await fetch(url);
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : data.data || []);
      setLoading(false);
    }
    fetchEmployees();
  }, [filter]);

  const handleAdd = () => {
    setEditing(null);
    setForm({ employeeId: 0, fullName: '', department: '', hireDate: '', email: '', phoneNumber: '', salary: 0, role: '' });
    setShowModal(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditing(emp);
    setForm(emp);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`, { method: 'DELETE' });
    setEmployees(employees.filter(e => e.employeeId !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/${editing.employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    // Reload data
    let url = `${process.env.NEXT_PUBLIC_API_URL}/employees`;
    const params = [];
    if (filter.name) params.push(`name=${encodeURIComponent(filter.name)}`);
    if (filter.department) params.push(`department=${encodeURIComponent(filter.department)}`);
    if (filter.role) params.push(`role=${encodeURIComponent(filter.role)}`);
    if (params.length) url += '/filter?' + params.join('&');
    const res = await fetch(url);
    setEmployees(await res.json());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Employees</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleAdd}>+ Add Employee</button>
      </div>
      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input type="text" placeholder="Full name" className="px-3 py-2 border rounded-lg" value={filter.name} onChange={e => setFilter(f => ({ ...f, name: e.target.value }))} />
        <input type="text" placeholder="Department" className="px-3 py-2 border rounded-lg" value={filter.department} onChange={e => setFilter(f => ({ ...f, department: e.target.value }))} />
        <input type="text" placeholder="Role" className="px-3 py-2 border rounded-lg" value={filter.role} onChange={e => setFilter(f => ({ ...f, role: e.target.value }))} />
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => setFilter({ name: '', department: '', role: '' })}>Clear</button>
      </div>
      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8">Loading...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">No employees found.</td></tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.employeeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{emp.employeeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{emp.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.salary?.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-blue-600 hover:underline mr-3" onClick={() => handleEdit(emp)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(emp.employeeId)}>Delete</button>
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
            <h2 className="text-2xl font-bold mb-4">{editing ? "Edit Employee" : "Add Employee"}</h2>
            <label className="block mb-1 font-medium">Full Name</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
            <label className="block mb-1 font-medium">Department</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
            <label className="block mb-1 font-medium">Role</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
            <label className="block mb-1 font-medium">Email</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <label className="block mb-1 font-medium">Phone Number</label>
            <input className="mb-3 w-full border rounded px-3 py-2" placeholder="Phone Number" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
            <label className="block mb-1 font-medium">Salary</label>
            <input className="mb-3 w-full border rounded px-3 py-2" type="number" placeholder="Salary" value={form.salary ?? ''} onChange={e => setForm({ ...form, salary: Number(e.target.value) })} />
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