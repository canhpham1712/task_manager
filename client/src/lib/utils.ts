import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'TODO':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'DONE':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'LOW':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    case 'MEDIUM':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    case 'HIGH':
      return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    case 'URGENT':
      return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}
