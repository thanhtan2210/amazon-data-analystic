import React, { useState, useEffect } from 'react';

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

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  initialData?: Product | null;
}

export default function ProductModal({ open, onClose, onSubmit, initialData }: ProductModalProps) {
  const [form, setForm] = useState<Product>({
    productName: '',
    description: '',
    price: 0,
    weight: undefined,
    category: '',
    brand: '',
    dateAdded: '',
    images: '',
    length: undefined,
    width: undefined,
    height: undefined,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ productName: '', description: '', price: 0, weight: undefined, category: '', brand: '', dateAdded: '', images: '', length: undefined, width: undefined, height: undefined });
  }, [initialData, open]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (["price", "weight", "length", "width", "height"].includes(name)) {
      setForm(f => ({ ...f, [name]: value === '' ? undefined : Number(value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.productName || !form.category || !form.brand) {
      setError('Please fill all required fields.');
      return;
    }
    setError('');
    onSubmit(form);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4">{initialData ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="block mb-1 font-medium">Product Name</label>
          <input name="productName" value={form.productName} onChange={handleChange} placeholder="Product Name" className="w-full px-3 py-2 border rounded-lg" required />
          <label className="block mb-1 font-medium">Category</label>
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full px-3 py-2 border rounded-lg" required />
          <label className="block mb-1 font-medium">Brand</label>
          <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="w-full px-3 py-2 border rounded-lg" required />
          <label className="block mb-1 font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-3 py-2 border rounded-lg" />
          <label className="block mb-1 font-medium">Price</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="w-full px-3 py-2 border rounded-lg" required min={0} />
          <label className="block mb-1 font-medium">Weight</label>
          <input name="weight" type="number" value={form.weight ?? ''} onChange={handleChange} placeholder="Weight" className="w-full px-3 py-2 border rounded-lg" min={0} />
          <label className="block mb-1 font-medium">Length</label>
          <input name="length" type="number" value={form.length ?? ''} onChange={handleChange} placeholder="Length" className="w-full px-3 py-2 border rounded-lg" min={0} />
          <label className="block mb-1 font-medium">Width</label>
          <input name="width" type="number" value={form.width ?? ''} onChange={handleChange} placeholder="Width" className="w-full px-3 py-2 border rounded-lg" min={0} />
          <label className="block mb-1 font-medium">Height</label>
          <input name="height" type="number" value={form.height ?? ''} onChange={handleChange} placeholder="Height" className="w-full px-3 py-2 border rounded-lg" min={0} />
          <label className="block mb-1 font-medium">Images (URLs)</label>
          <input name="images" value={form.images ?? ''} onChange={handleChange} placeholder="Images (URLs)" className="w-full px-3 py-2 border rounded-lg" />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">{initialData ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 