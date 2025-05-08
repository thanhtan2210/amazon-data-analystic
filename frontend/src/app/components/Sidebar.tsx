import React from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaBox, FaUsers, FaUserTie, FaWarehouse, FaTruck, FaShoppingCart } from 'react-icons/fa';

const menuItems = [
  { href: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
  { href: '/products', icon: <FaBox />, label: 'Products' },
  { href: '/customers', icon: <FaUsers />, label: 'Customers' },
  { href: '/employees', icon: <FaUserTie />, label: 'Employees' },
  { href: '/warehouses', icon: <FaWarehouse />, label: 'Warehouses' },
  { href: '/suppliers', icon: <FaTruck />, label: 'Suppliers' },
  { href: '/orders', icon: <FaShoppingCart />, label: 'Orders' },
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#181c24] text-white flex flex-col shadow-lg z-30">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <span className="text-2xl font-bold tracking-wide">Team.com</span>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="flex items-center px-6 py-3 hover:bg-[#23283a] transition-colors rounded-lg">
                <span className="text-lg mr-4">{item.icon}</span>
                <span className="text-base font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center px-6 py-4 border-t border-gray-700">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold mr-3">J</div>
        <div>
          <div className="font-semibold">Jennings</div>
          <div className="text-xs text-gray-400">Product Designer</div>
        </div>
      </div>
    </aside>
  );
} 