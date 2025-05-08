'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FaBoxOpen, FaDollarSign, FaTags, FaHome } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Product {
  productId: number;
  productName: string;
  category: string;
  price: number;
  brand: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062';
        const response = await fetch(`${apiUrl}/products`);
        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const averagePrice = totalProducts > 0 ? (products.reduce((acc, curr) => acc + (curr.price || 0), 0) / totalProducts).toFixed(2) : '0.00';
  const categories = new Set(products.map((p) => p.category)).size;

  const chartData = {
    labels: products.map((product) => product.productName),
    datasets: [
      {
        label: 'Product Prices',
        data: products.map((product) => product.price),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Product Price Distribution',
      },
    },
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white shadow rounded-lg p-6 h-32" />
        <div className="bg-white shadow rounded-lg p-6 h-96" />
        <div className="bg-white shadow rounded-lg p-6 h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg p-8 shadow flex flex-col md:flex-row items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><FaHome className="inline-block mr-2" />Welcome to Amazon Analytics Dashboard</h1>
          <p className="text-lg">Get real-time insights into your supply chain and sales performance.</p>
        </div>
        <img src="/banner-analytics.svg" alt="Analytics" className="h-24 hidden md:block" />
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg flex items-center gap-4 shadow">
          <FaBoxOpen className="text-3xl text-blue-500" />
          <div>
            <h3 className="font-semibold">Total Products</h3>
            <p className="text-2xl">{totalProducts}</p>
          </div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg flex items-center gap-4 shadow">
          <FaDollarSign className="text-3xl text-green-500" />
          <div>
            <h3 className="font-semibold">Average Price</h3>
            <p className="text-2xl">${averagePrice}</p>
          </div>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg flex items-center gap-4 shadow">
          <FaTags className="text-3xl text-purple-500" />
          <div>
            <h3 className="font-semibold">Categories</h3>
            <p className="text-2xl">{categories}</p>
          </div>
        </div>
      </div>

      {/* Product Analysis Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Product Analysis</h2>
        <div className="h-96">
          <Bar options={chartOptions} data={chartData} />
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.slice(0, 5).map((product: any) => (
                <tr key={product.productId}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.brand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
