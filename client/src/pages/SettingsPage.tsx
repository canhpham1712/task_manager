import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../stores/uiStore';
import { Card } from '../components/ui/Card';

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useUIStore();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your preferences and account.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Profile */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-500">Toggle between light and dark theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* About */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>Personal Task Manager v1.0.0</p>
            <p>Built with React, TypeScript, Node.js, and SQLite.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
