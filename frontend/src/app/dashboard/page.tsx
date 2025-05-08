"use client";

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SummaryData {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  totalWarehouses: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [revenueByMonth, setRevenueByMonth] = useState<any[]>([]);
  const [ordersByMonth, setOrdersByMonth] = useState<any[]>([]);
  const [revenueByProduct, setRevenueByProduct] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [summaryRes, revenueMonthRes, ordersMonthRes, revenueProductRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/summary`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/revenue-by-month`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/orders-by-month`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/revenue-by-product`),
      ]);
      setSummary(await summaryRes.json());
      setRevenueByMonth(await revenueMonthRes.json());
      setOrdersByMonth(await ordersMonthRes.json());
      setRevenueByProduct(await revenueProductRes.json());
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // Chart data
  const revenueByMonthData = {
    labels: revenueByMonth.map((item) => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: revenueByMonth.map((item) => item.revenue),
        backgroundColor: '#6366f1',
        borderRadius: 8,
      },
    ],
  };

  const ordersByMonthData = {
    labels: ordersByMonth.map((item) => item.month),
    datasets: [
      {
        label: 'Orders',
        data: ordersByMonth.map((item) => item.orders),
        backgroundColor: '#34d399',
        borderRadius: 8,
      },
    ],
  };

  const revenueByProductData = {
    labels: revenueByProduct.map((item) => item.productName),
    datasets: [
      {
        label: 'Revenue',
        data: revenueByProduct.map((item) => item.revenue),
        backgroundColor: '#f59e42',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-indigo-600">{summary?.totalOrders ?? '—'}</div>
          <div className="text-xs text-gray-500 mt-2">Total Orders</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-green-600">${summary?.totalRevenue?.toLocaleString() ?? '—'}</div>
          <div className="text-xs text-gray-500 mt-2">Total Revenue</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-600">{summary?.totalCustomers ?? '—'}</div>
          <div className="text-xs text-gray-500 mt-2">Total Customers</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-purple-600">{summary?.totalProducts ?? '—'}</div>
          <div className="text-xs text-gray-500 mt-2">Total Products</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-yellow-600">{summary?.totalWarehouses ?? '—'}</div>
          <div className="text-xs text-gray-500 mt-2">Total Warehouses</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue by Month</h2>
          <Bar data={revenueByMonthData} />
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Orders by Month</h2>
          <Bar data={ordersByMonthData} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Revenue by Product</h2>
        <Bar data={revenueByProductData} />
      </div>
    </div>
  );
} 