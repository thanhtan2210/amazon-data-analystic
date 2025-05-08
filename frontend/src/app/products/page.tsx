"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductModal from './ProductModal';

interface Product {
  productId?: number;
  productName: string;
  description?: string;
  price: number;
  weight?: number;
  category?: string;
  brand?: string;
  dateAdded?: string;
  images?: string;
  length?: number;
  width?: number;
  height?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', category: '', minPrice: '', maxPrice: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  async function fetchProducts() {
    setLoading(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/products`;
    const params = [];
    if (filter.name) params.push(`name=${encodeURIComponent(filter.name)}`);
    if (filter.category) params.push(`category=${encodeURIComponent(filter.category)}`);
    if (filter.minPrice) params.push(`minPrice=${filter.minPrice}`);
    if (filter.maxPrice) params.push(`maxPrice=${filter.maxPrice}`);
    if (params.length) url += '/filter?' + params.join('&');
    const res = await fetch(url);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : data.data || []);
    setLoading(false);
  }

  useEffect(() => { fetchProducts(); }, [filter]);

  async function handleAddOrEdit(product: Product) {
    try {
      if (editProduct) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${editProduct.productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...product, productId: editProduct.productId }),
        });
        alert('Product updated!');
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
        alert('Product added!');
      }
      setModalOpen(false);
      setEditProduct(null);
      await fetchProducts();
    } catch (e) {
      alert('Error!');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this product?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, { method: 'DELETE' });
      alert('Product deleted!');
      await fetchProducts();
    } catch (e) {
      alert('Error!');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={() => { setEditProduct(null); setModalOpen(true); }}>+ Add Product</button>
      </div>
      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Product name"
          className="px-3 py-2 border rounded-lg"
          value={filter.name}
          onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Category"
          className="px-3 py-2 border rounded-lg"
          value={filter.category}
          onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Min price"
          className="px-3 py-2 border rounded-lg w-32"
          value={filter.minPrice}
          onChange={e => setFilter(f => ({ ...f, minPrice: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Max price"
          className="px-3 py-2 border rounded-lg w-32"
          value={filter.maxPrice}
          onChange={e => setFilter(f => ({ ...f, maxPrice: e.target.value }))}
        />
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={() => setFilter({ name: '', category: '', minPrice: '', maxPrice: '' })}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No products found.</td></tr>
            ) : (
              products.map(product => (
                <tr key={product.productId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{product.productId}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{product.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price?.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-blue-600 hover:underline mr-3" onClick={() => { setEditProduct(product); setModalOpen(true); }}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(product.productId!)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ProductModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditProduct(null); }}
        onSubmit={handleAddOrEdit}
        initialData={editProduct}
      />
    </div>
  );
} 