import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '../../stores/uiStore';

export function MainLayout() {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className={`transition-all duration-200 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
