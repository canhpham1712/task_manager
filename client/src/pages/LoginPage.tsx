import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">TaskManager</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to manage your tasks</p>
        </div>
        <div className="card p-6">
          <LoginForm />
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
