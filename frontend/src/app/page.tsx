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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const chartData = {
    labels: products.map((product: any) => product.productName),
    datasets: [
      {
        label: 'Product Prices',
        data: products.map((product: any) => product.price),
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
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold">Total Products</h3>
            <p className="text-2xl">{products.length}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-semibold">Average Price</h3>
            <p className="text-2xl">
              ${(products.reduce((acc: number, curr: any) => acc + curr.price, 0) / products.length).toFixed(2)}
            </p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="font-semibold">Categories</h3>
            <p className="text-2xl">
              {new Set(products.map((p: any) => p.category)).size}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Product Analysis</h2>
        <div className="h-96">
          <Bar options={chartOptions} data={chartData} />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.slice(0, 5).map((product: any) => (
                <tr key={product.productId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.brand}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
